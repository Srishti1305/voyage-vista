const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let all = [];

// first number in text like "$180 - $350"
const lowPrice = (d) => {
  const m = String(d.avg_budget || "").match(/\d+/);
  return m ? Number(m[0]) : null;
};

function render() {
  const cat = $("#category").value,
    bud = $("#budget").value;
  const list = all.filter((d) => {
    if (cat && d.category !== cat) return false;
    const p = lowPrice(d);
    if (bud === "low" && !(p !== null && p < 150)) return false;
    if (bud === "mid" && !(p !== null && p >= 150 && p <= 200)) return false;
    if (bud === "high" && !(p !== null && p > 200)) return false;
    return true;
  });
  $("#count").textContent =
    `${list.length} destination${list.length === 1 ? "" : "s"} found`;
  $("#grid").innerHTML =
    list
      .map(
        (d) =>
          `<article class="card"><img src="${esc(d.image_url)}" alt="${esc(d.name)}" loading="lazy"><div class="card-body"><h3>${esc(d.name)}</h3><p class="muted">${esc(d.state)} · ${esc(d.category)} · ${esc(d.avg_budget)}</p><p>${esc(d.description)}</p><a class="btn" href="destination.html?id=${d.id}">View destination</a></div></article>`,
      )
      .join("") || "<p>No destinations match these filters.</p>";
}

async function load() {
  const s = new URLSearchParams(location.search).get("search") || "";
  $("#search").value = s;
  const r = await fetch(`/api/destinations?search=${encodeURIComponent(s)}`);
  all = await r.json();
  const cats = [...new Set(all.map((d) => d.category).filter(Boolean))].sort();
  $("#category").innerHTML =
    '<option value="">All categories</option>' +
    cats.map((c) => `<option>${esc(c)}</option>`).join("");
  render();
}

$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  location.search = "?search=" + encodeURIComponent($("#search").value);
});
$("#category").addEventListener("change", render);
$("#budget").addEventListener("change", render);
$("#clearFilters").addEventListener("click", () => {
  $("#category").value = "";
  $("#budget").value = "";
  render();
});
load();
