(function () {
  if (document.querySelector('.site-footer')) return;
  const year = new Date().getFullYear();
  const f = document.createElement('footer');
  f.className = 'site-footer';
  f.innerHTML = `
    <div class="sf-grid">
      <div class="sf-brand">
        <a class="sf-logo" href="index.html">VoyageVista</a>
        <p>Discover incredible places across India, plan your trips and keep your travel memories in one place.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <a href="explore.html">All Destinations</a>
        <a href="trip-planner.html">Trip Planner</a>
        <a href="my-trips.html">My Trips</a>
      </div>
      <div>
        <h4>Your Space</h4>
        <a href="favorites.html">Favorites</a>
        <a href="my-photos.html">Trip Photos</a>
        <a href="login.html">Login</a>
      </div>
      <div>
        <h4>Popular</h4>
        <a href="destination.html?id=1">Jaipur</a>
        <a href="destination.html?id=2">Goa</a>
        <a href="destination.html?id=3">Varanasi</a>
        <a href="destination.html?id=4">Manali</a>
      </div>
    </div>
    <div class="sf-bottom">
      <span>© ${year} VoyageVista. All rights reserved.</span>
      <span>Built by Srishti · <a href="https://github.com/Srishti1305" target="_blank" rel="noopener">GitHub</a></span>
    </div>`;
  document.body.appendChild(f);
})();