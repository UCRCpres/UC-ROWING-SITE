function getNav(active) {
  const pages = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'training.html', label: 'Training' },
    { href: 'events.html', label: 'Events' },
    { href: 'gallery.html', label: 'Gallery' },
    { href: 'sponsors.html', label: 'Sponsors' },
    { href: 'forms.html', label: 'Forms' },
    { href: 'contact.html', label: 'Contact' },
    { href: 'login.html', label: 'Members', highlight: true },
  ];
  const links = pages.map(p =>
    `<li><a href="${p.href}" class="${p.label === active ? 'active' : ''}" ${p.highlight ? 'style="color:var(--gold);"' : ''}>${p.label}</a></li>`
  ).join('');
  return `
  <nav>
    <div class="nav-inner">
      <a href="index.html" class="nav-logo"><img src="logo.png" alt="UC Rowing Club" style="height:38px;width:auto;display:block;"></a>
      <ul class="nav-links">${links}</ul>
    </div>
  </nav>`;
}

function getFooter() {
  return `
  <footer>
    <div class="footer-inner">
      <div>
        <div class="footer-brand"><span>UC</span> Rowing Club</div>
        <p class="footer-tagline">Student run. Community driven.<br>Competing at the highest level since 1908.</p>
      </div>
      <div>
        <div class="footer-col-title">Pages</div>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="training.html">Training</a></li>
          <li><a href="events.html">Events</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="sponsors.html">Sponsors</a></li>
          <li><a href="forms.html">Forms</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Connect</div>
        <ul class="footer-links">
          <li><a href="#">Instagram</a></li>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">UC Sport</a></li>
          <li><a href="#">Rowing NZ</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2026 UC Rowing Club. All rights reserved.</div>
      <div class="footer-uc">A <span>UC Sport</span> affiliated club · University of Canterbury</div>
    </div>
  </footer>`;
}

document.addEventListener('DOMContentLoaded', function() {
  const navEl = document.getElementById('nav-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  if (navEl) navEl.outerHTML = getNav(navEl.dataset.active);
  if (footerEl) footerEl.outerHTML = getFooter();
});
