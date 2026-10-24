const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const msg = (t) => (document.querySelector("#msg").textContent = t);

async function loadDestinations() {
  const d = await (await fetch("/api/destinations")).json();
  const opts = d
    .map((x) => `<option value="${x.id}">${esc(x.name)}</option>`)
    .join("");
  document.querySelector("#dest").innerHTML = opts;
  document.querySelector("#filter").insertAdjacentHTML("beforeend", opts);
}

async function loadPhotos() {
  const f = document.querySelector("#filter").value;
  const r = await fetch("/api/photos" + (f ? "?destination_id=" + f : ""), {
    headers: authHeader(),
  });
  if (r.status === 401) {
    localStorage.clear();
    return (location.href = "login.html");
  }
  const photos = await r.json();
  document.querySelector("#grid").innerHTML =
    photos
      .map(
        (p) =>
          `<article class="card photo-card"><img src="${esc(p.url)}" alt="${esc(p.caption || p.destination_name)}" loading="lazy">
     <div class="card-body"><h3>${esc(p.destination_name)}</h3><p class="muted">${esc(p.caption)}</p>
     <button class="btn secondary" data-id="${p.id}">Delete</button></div></article>`,
      )
      .join("") || "<p>No photos yet. Upload your first one above.</p>";
}

document.querySelector("#uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  msg("Uploading...");
  const fd = new FormData(e.target);
  const r = await fetch("/api/photos", {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}` },
    body: fd,
  });
  const d = await r.json();
  msg(d.message);
  if (r.ok) {
    e.target.reset();
    document.querySelector("#prev").style.display = "none";
    loadPhotos();
  }
});

document.querySelector("#grid").addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id || !confirm("Delete this photo?")) return;
  await fetch("/api/photos/" + id, { method: "DELETE", headers: authHeader() });
  loadPhotos();
});

document.querySelector("#filter").addEventListener("change", loadPhotos);

(async () => {
  if (!token()) return (location.href = "login.html");
  await loadDestinations();
  loadPhotos();
})();
const box = document.querySelector("#lightbox");
let cur = 0;
const imgs = () => [...document.querySelectorAll("#grid .photo-card img")];

function showPhoto(i) {
  const list = imgs();
  if (!list.length) return;
  cur = (i + list.length) % list.length;
  const img = list[cur],
    card = img.closest(".photo-card");
  document.querySelector("#lbImg").src = img.src;
  document.querySelector("#lbTitle").textContent =
    card.querySelector("h3").textContent;
  document.querySelector("#lbCap").textContent =
    card.querySelector(".muted").textContent;
  box.classList.add("open");
}
const closePhoto = () => {
  box.classList.remove("open");
  document.querySelector("#lbImg").src = "";
};

document.querySelector("#grid").addEventListener("click", (e) => {
  if (e.target.matches(".photo-card img")) showPhoto(imgs().indexOf(e.target));
});
document.querySelector("#lbClose").addEventListener("click", closePhoto);
document
  .querySelector("#lbPrev")
  .addEventListener("click", () => showPhoto(cur - 1));
document
  .querySelector("#lbNext")
  .addEventListener("click", () => showPhoto(cur + 1));
box.addEventListener("click", (e) => {
  if (e.target === box) closePhoto();
});
document.addEventListener("keydown", (e) => {
  if (!box.classList.contains("open")) return;
  if (e.key === "Escape") closePhoto();
  if (e.key === "ArrowLeft") showPhoto(cur - 1);
  if (e.key === "ArrowRight") showPhoto(cur + 1);
});
document.querySelector("#file").addEventListener("change", (e) => {
  const f = e.target.files[0],
    p = document.querySelector("#prev");
  if (f) {
    p.src = URL.createObjectURL(f);
    p.style.display = "block";
  } else p.style.display = "none";
});
