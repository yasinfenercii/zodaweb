window.ZodawebLayout = {
  inject(site) {
    const page = document.body.dataset.page || "home";
    const headerHost = document.getElementById("site-header");
    const footerHost = document.getElementById("site-footer");
    const brandName = site.brandName || "Zodaweb";
    const tagline = site.tagline || "Web Design & Software";
    const quoteLabel = site.quoteLabel || "Get a Quote";
    const nav = Array.isArray(site.nav) ? site.nav : [];
    const social = Array.isArray(site.social) ? site.social : [];

    const zwMark = (id) => `
    <svg class="logo-mark" viewBox="0 0 42 42" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="${id}-g" x1="6" y1="4" x2="38" y2="38">
          <stop stop-color="#00F2FE"/>
          <stop offset="0.5" stop-color="#4FACFE"/>
          <stop offset="1" stop-color="#8A2BE2"/>
        </linearGradient>
      </defs>
      <rect x="1.2" y="1.2" width="39.6" height="39.6" rx="12" fill="#0B1018" stroke="url(#${id}-g)" stroke-width="1.2"/>
      <path d="M11.5 13.2h17.2M28.7 13.2 13.4 28.8h17.4" stroke="url(#${id}-g)" stroke-width="2.55" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22.6 13.4 25.8 29l3.5-10.4 3.2 10.4 2.4-8.2" stroke="url(#${id}-g)" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M31.4 13.6 37.6 7.4M37.6 7.4h-5M37.6 7.4v5" stroke="url(#${id}-g)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="21.2" cy="21" r="1.45" fill="#00F2FE"/>
      <circle cx="32.2" cy="28.6" r="1.2" fill="#8A2BE2"/>
    </svg>
  `;

    const brand = (id) => `
    <a href="index.html" class="logo" aria-label="${escapeHtml(brandName)} home">
      ${zwMark(id)}
      <span class="logo-word">
        <span class="logo-text">${escapeHtml(brandName)}</span>
        <span class="logo-tag">${escapeHtml(tagline)}</span>
      </span>
    </a>
  `;

    const links = nav
      .map(
        (item) =>
          `<a href="${escapeAttr(item.href)}" class="${item.id === page ? "active" : ""}">${escapeHtml(item.label)}</a>`
      )
      .join("");
    const headerLinks = `${links}<a href="contact.html" class="btn btn-glow mobile-cta">${escapeHtml(quoteLabel)}</a>`;

    if (headerHost) {
      headerHost.innerHTML = `
      <header class="header" id="header">
        <div class="container nav">
          ${brand("zwHead")}
          <nav class="nav-links" id="navLinks" aria-label="Primary">
            ${headerLinks}
          </nav>
          <a href="contact.html" class="btn btn-glow nav-cta">${escapeHtml(quoteLabel)}</a>
          <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
    `;
    }

    if (footerHost) {
      const socialLinks = social
        .map(
          (item) =>
            `<a href="${escapeAttr(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a>`
        )
        .join("");
      footerHost.innerHTML = `
      <footer class="footer">
        <div class="container footer-grid">
          <div>
            ${brand("zwFoot")}
            <p>${escapeHtml(site.footerBlurb || "")}</p>
          </div>
          <nav aria-label="Footer">
            ${links}
          </nav>
          <div class="social">
            ${socialLinks}
          </div>
        </div>
        <div class="container copyright">
          <p>© <span id="year"></span> ${escapeHtml(site.copyrightName || brandName)}. All rights reserved.</p>
        </div>
      </footer>
    `;
    }
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
