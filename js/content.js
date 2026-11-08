const ICONS = {
  design: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 20h8M12 18v2"/><path d="M7 9h4M7 13h10"/></svg>`,
  software: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 16l-4-4 4-4M16 8l4 4-4 4"/><path d="M14 6l-4 12"/></svg>`,
  ecommerce: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l-1 10H7L6 8z"/><path d="M9 8V7a3 3 0 016 0v1"/></svg>`,
  seo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V5M4 19l6-7 4 4 6-8"/><circle cx="20" cy="7" r="1.5" fill="currentColor" stroke="none"/></svg>`,
};

const WA_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M19.05 4.91A9.87 9.87 0 0012.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 004.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.2 8.2 0 01-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.42 5.83c0 4.55-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z"/></svg>`;

const MOCKUPS = {
  health: `<div class="mockup mockup-health"><div class="mock-chrome"><span></span><span></span><span></span></div><div class="mock-health"><div class="ring"></div><div class="stats-mini"><span></span><span></span></div></div></div>`,
  fin: `<div class="mockup mockup-fin"><div class="mock-chrome"><span></span><span></span><span></span></div><div class="mock-fin"><div class="bar w-40"></div><div class="spark"></div><div class="pills"><i></i><i></i></div></div></div>`,
  market: `<div class="mockup mockup-market"><div class="mock-chrome"><span></span><span></span><span></span></div><div class="mock-store"><div class="tile"></div><div class="tile"></div></div></div>`,
  mobile: `<div class="mockup mockup-mobile"><div class="mock-chrome"><span></span><span></span><span></span></div><div class="mock-hero-block"><div class="bar w-40"></div><div class="cta-chip"></div></div></div>`,
};

function whatsappHref(site) {
  const num = String(site.whatsappNumber || "").replace(/\D/g, "");
  const text = encodeURIComponent(site.whatsappMessage || "");
  return `https://wa.me/${num}?text=${text}`;
}

function mediaSrc(path) {
  if (!path) return "";
  return String(path).replace(/^\//, "");
}

function inlineMd(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function markdownToHtml(source) {
  const raw = String(source || "").trim();
  if (!raw) return "";
  const blocks = raw.split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split("\n");
      const list = lines.every((line) => /^\s*-\s+/.test(line));
      if (list) {
        const items = lines
          .map((line) => `<li>${inlineMd(line.replace(/^\s*-\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${inlineMd(block).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function applySeo(data) {
  if (data.seoTitle) document.title = data.seoTitle;
  if (data.seoDescription) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", data.seoDescription);
  }
}

function renderBanner(data) {
  const host = document.querySelector("[data-banner]");
  if (!host || !data) return;
  host.innerHTML = `
    <p class="eyebrow">${escapeHtml(data.eyebrow)}</p>
    <h1>${escapeHtml(data.title)}</h1>
    <p class="lead">${escapeHtml(data.lead)}</p>
  `;
}

function projectCard(item, { compact = false } = {}) {
  const cats = (item.categories || []).join(" ");
  const imageSrc = mediaSrc(item.image);
  const usePhoto = Boolean(imageSrc);
  const mockup = usePhoto
    ? `<div class="mockup mockup-photo"><div class="mock-chrome"><span></span><span></span><span></span></div><img src="${escapeAttr(imageSrc)}" alt="${escapeAttr(item.imageAlt || item.title)}" /></div>`
    : MOCKUPS[item.mockup] || MOCKUPS.mobile;
  const overlay = usePhoto
    ? `<div class="project-overlay"><button type="button" class="btn btn-glow" data-preview>Preview</button></div>`
    : "";
  const summary = compact ? item.homeSummary || item.summary : item.summary;
  const tools = compact
    ? ""
    : `<div class="tag-row">${(item.tools || []).map((tool) => `<span class="badge">${escapeHtml(tool)}</span>`).join("")}</div>`;
  const story = item.preview
    ? `<div class="preview-story" hidden>${markdownToHtml(item.preview)}</div>`
    : "";
  return `
    <article class="project-card" data-categories="${escapeAttr(cats)}">
      ${mockup}
      ${overlay}
      <div class="project-meta">
        <span class="tag">${escapeHtml(item.tag)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(summary)}</p>
        ${story}
        ${tools}
      </div>
    </article>
  `;
}

function sortedProjects(items) {
  return [...(items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
}

async function fetchJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function renderHome(home, portfolio, site) {
  applySeo(home);
  const hero = home.hero || {};
  const heroCopy = document.querySelector("[data-home-hero]");
  if (heroCopy) {
    heroCopy.innerHTML = `
      <p class="eyebrow">${escapeHtml(hero.eyebrow)}</p>
      <h1>${escapeHtml(hero.title)}</h1>
      <p class="lead">${escapeHtml(hero.lead)}</p>
      <div class="hero-actions">
        <a href="${escapeAttr(hero.primaryCta?.href)}" class="btn btn-glow">${escapeHtml(hero.primaryCta?.label)}</a>
        <a href="${escapeAttr(hero.secondaryCta?.href)}" class="btn btn-ghost">${escapeHtml(hero.secondaryCta?.label)}</a>
      </div>
      <div class="hero-stats">
        ${(hero.stats || [])
          .map(
            (stat) =>
              `<div><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`
          )
          .join("")}
      </div>
    `;
  }
  const hudA = document.querySelector("[data-hud-a]");
  const hudB = document.querySelector("[data-hud-b]");
  if (hudA) hudA.innerHTML = `<span class="hud-dot"></span> ${escapeHtml(hero.hudA || "")}`;
  if (hudB) hudB.textContent = hero.hudB || "";

  const services = home.services || {};
  const servicesHead = document.querySelector("[data-home-services-head]");
  if (servicesHead) {
    servicesHead.innerHTML = `
      <p class="eyebrow">${escapeHtml(services.eyebrow)}</p>
      <h2>${escapeHtml(services.title)}</h2>
      <p class="section-sub">${escapeHtml(services.subtitle)} <a class="inline-link" href="${escapeAttr(services.linkHref)}">${escapeHtml(services.linkLabel)}</a></p>
    `;
  }
  const servicesGrid = document.querySelector("[data-home-services]");
  if (servicesGrid) {
    servicesGrid.innerHTML = (services.items || [])
      .map(
        (item) => `
        <article class="glass-card">
          <div class="icon-wrap">${ICONS[item.icon] || ICONS.design}</div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `
      )
      .join("");
  }

  const process = home.process || {};
  const processHead = document.querySelector("[data-home-process-head]");
  if (processHead) {
    processHead.innerHTML = `
      <p class="eyebrow">${escapeHtml(process.eyebrow)}</p>
      <h2>${escapeHtml(process.title)}</h2>
      <p class="section-sub">${escapeHtml(process.subtitle)} <a class="inline-link" href="${escapeAttr(process.linkHref)}">${escapeHtml(process.linkLabel)}</a></p>
    `;
  }
  const pipeline = document.querySelector("[data-home-process]");
  if (pipeline) {
    pipeline.innerHTML = (process.steps || [])
      .map(
        (step) => `
        <li>
          <span class="step-num">${escapeHtml(step.num)}</span>
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.text)}</p>
        </li>
      `
      )
      .join("");
  }

  const work = home.work || {};
  const workHead = document.querySelector("[data-home-work-head]");
  if (workHead) {
    workHead.innerHTML = `
      <p class="eyebrow">${escapeHtml(work.eyebrow)}</p>
      <h2>${escapeHtml(work.title)}</h2>
      <p class="section-sub">${escapeHtml(work.subtitle)} <a class="inline-link" href="${escapeAttr(work.linkHref)}">${escapeHtml(work.linkLabel)}</a></p>
    `;
  }
  const workGrid = document.querySelector("[data-home-work]");
  if (workGrid) {
    const featured = sortedProjects(portfolio.items).filter((item) => item.featured !== false).slice(0, 6);
    workGrid.innerHTML = featured.map((item) => projectCard(item, { compact: true })).join("");
  }

  const contact = home.contact || {};
  const contactCopy = document.querySelector("[data-home-contact]");
  if (contactCopy) {
    contactCopy.innerHTML = `
      <p class="eyebrow">${escapeHtml(contact.eyebrow)}</p>
      <h2>${escapeHtml(contact.title)}</h2>
      <p class="section-sub">${escapeHtml(contact.subtitle)}</p>
      <a href="${escapeAttr(contact.contactPageHref)}" class="btn btn-ghost stack-btn">${escapeHtml(contact.contactPageLabel)}</a>
      <a class="btn btn-whatsapp" href="${escapeAttr(whatsappHref(site))}" target="_blank" rel="noopener noreferrer">
        ${WA_ICON}
        ${escapeHtml(site.whatsappLabel || "Chat on WhatsApp")}
      </a>
      <ul class="contact-points">
        ${(contact.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
      </ul>
    `;
  }
}

function renderServices(data) {
  applySeo(data);
  renderBanner(data.banner);
  const list = document.querySelector("[data-services]");
  if (list) {
    list.innerHTML = (data.items || [])
      .map(
        (item) => `
        <article class="service-block">
          <div>
            <p class="eyebrow">${escapeHtml(item.num)}</p>
            <h2>${escapeHtml(item.title)}</h2>
            <p class="section-sub">${escapeHtml(item.text)}</p>
            <ul class="feature-list">
              ${(item.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("")}
            </ul>
            <div class="badge-row">
              ${(item.badges || []).map((b) => `<span class="badge">${escapeHtml(b)}</span>`).join("")}
            </div>
            <a class="btn btn-glow" href="${escapeAttr(item.ctaHref)}">${escapeHtml(item.ctaLabel)}</a>
          </div>
          <div class="glass-card">
            <h3>${escapeHtml(item.asideTitle)}</h3>
            <p>${escapeHtml(item.asideText)}</p>
          </div>
        </article>
      `
      )
      .join("");
  }
  const stackHead = document.querySelector("[data-stack-head]");
  if (stackHead && data.stack) {
    stackHead.innerHTML = `
      <p class="eyebrow">${escapeHtml(data.stack.eyebrow)}</p>
      <h2>${escapeHtml(data.stack.title)}</h2>
      <p class="section-sub">${escapeHtml(data.stack.subtitle)}</p>
    `;
  }
  const stack = document.querySelector("[data-stack]");
  if (stack) {
    stack.innerHTML = (data.stack?.items || [])
      .map((item) => `<div class="tech-chip">${escapeHtml(item)}</div>`)
      .join("");
  }
  const cta = document.querySelector("[data-page-cta]");
  if (cta && data.cta) {
    cta.innerHTML = `
      <div>
        <h2>${escapeHtml(data.cta.title)}</h2>
        <p>${escapeHtml(data.cta.text)}</p>
      </div>
      <a class="btn btn-glow" href="${escapeAttr(data.cta.href)}">${escapeHtml(data.cta.label)}</a>
    `;
  }
}

function renderPortfolio(data) {
  applySeo(data);
  renderBanner(data.banner);
  const filters = document.querySelector("[data-filters]");
  if (filters) {
    filters.innerHTML = (data.filters || [])
      .map(
        (item, index) =>
          `<button type="button" class="${index === 0 ? "active" : ""}" data-filter="${escapeAttr(item.id)}">${escapeHtml(item.label)}</button>`
      )
      .join("");
  }
  const grid = document.querySelector("[data-portfolio-grid]");
  if (grid) {
    grid.innerHTML = sortedProjects(data.items)
      .map((item) => projectCard(item))
      .join("");
  }
  const tHead = document.querySelector("[data-testimonials-head]");
  if (tHead && data.testimonials) {
    tHead.innerHTML = `
      <p class="eyebrow">${escapeHtml(data.testimonials.eyebrow)}</p>
      <h2>${escapeHtml(data.testimonials.title)}</h2>
      <p class="section-sub">${escapeHtml(data.testimonials.subtitle)}</p>
    `;
  }
  const quotes = document.querySelector("[data-testimonials]");
  if (quotes) {
    quotes.innerHTML = (data.testimonials?.items || [])
      .map(
        (item) => `
        <article class="glass-card">
          <div class="stars" aria-label="5 stars">★★★★★</div>
          <p class="quote">“${escapeHtml(item.quote)}”</p>
          <div class="client">
            <span class="avatar">${escapeHtml(item.initials)}</span>
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <small>${escapeHtml(item.role)}</small>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  }
  const cta = document.querySelector("[data-page-cta]");
  if (cta && data.cta) {
    cta.innerHTML = `
      <div>
        <h2>${escapeHtml(data.cta.title)}</h2>
        <p>${escapeHtml(data.cta.text)}</p>
      </div>
      <a class="btn btn-glow" href="${escapeAttr(data.cta.href)}">${escapeHtml(data.cta.label)}</a>
    `;
  }
}

function renderAbout(data) {
  applySeo(data);
  renderBanner(data.banner);
  const intro = document.querySelector("[data-about-intro]");
  if (intro && data.intro) {
    intro.innerHTML = `
      <div>
        <p class="eyebrow">${escapeHtml(data.intro.eyebrow)}</p>
        <h2>${escapeHtml(data.intro.title)}</h2>
        ${(data.intro.paragraphs || [])
          .map((p) => `<p class="section-sub">${escapeHtml(p)}</p>`)
          .join("")}
      </div>
      <aside class="glass-card">
        <h3>${escapeHtml(data.intro.asideTitle)}</h3>
        <p>${escapeHtml(data.intro.asideText)}</p>
      </aside>
    `;
  }
  const stats = document.querySelector("[data-stats]");
  if (stats) {
    stats.innerHTML = (data.stats || [])
      .map(
        (item) => `
        <article class="glass-card stat-card">
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.label)}</span>
        </article>
      `
      )
      .join("");
  }
  const pHead = document.querySelector("[data-about-process-head]");
  if (pHead && data.process) {
    pHead.innerHTML = `
      <p class="eyebrow">${escapeHtml(data.process.eyebrow)}</p>
      <h2>${escapeHtml(data.process.title)}</h2>
      <p class="section-sub">${escapeHtml(data.process.subtitle)}</p>
    `;
  }
  const steps = document.querySelector("[data-about-process]");
  if (steps) {
    steps.innerHTML = (data.process?.steps || [])
      .map(
        (step) => `
        <article class="glass-card process-step">
          <span class="step-num">${escapeHtml(step.num)}</span>
          <div>
            <h3>${escapeHtml(step.title)}</h3>
            <p>${escapeHtml(step.text)}</p>
          </div>
        </article>
      `
      )
      .join("");
  }
  const vHead = document.querySelector("[data-values-head]");
  if (vHead && data.values) {
    vHead.innerHTML = `
      <p class="eyebrow">${escapeHtml(data.values.eyebrow)}</p>
      <h2>${escapeHtml(data.values.title)}</h2>
    `;
  }
  const values = document.querySelector("[data-values]");
  if (values) {
    values.innerHTML = (data.values?.items || [])
      .map(
        (item) => `
        <article class="glass-card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `
      )
      .join("");
  }
}

function renderContact(data, site) {
  applySeo(data);
  renderBanner(data.banner);
  const direct = document.querySelector("[data-contact-direct]");
  if (direct) {
    const social = (site.social || [])
      .map(
        (item) =>
          `<a href="${escapeAttr(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a>`
      )
      .join("");
    direct.innerHTML = `
      <h2>${escapeHtml(data.directTitle)}</h2>
      <ul class="contact-meta">
        <li>
          <strong>Email</strong>
          <a class="inline-link" href="mailto:${escapeAttr(site.email)}">${escapeHtml(site.email)}</a>
        </li>
        <li>
          <strong>Phone</strong>
          <a class="inline-link" href="${escapeAttr(site.phoneHref)}">${escapeHtml(site.phone)}</a>
        </li>
        <li>
          <strong>Location</strong>
          ${escapeHtml(site.location)}
        </li>
      </ul>
      <a class="btn btn-whatsapp glow-wa" href="${escapeAttr(whatsappHref(site))}" target="_blank" rel="noopener noreferrer">
        ${WA_ICON}
        ${escapeHtml(site.whatsappLabel || "Chat on WhatsApp")}
      </a>
      <div class="social-row">${social}</div>
    `;
  }
  const submit = document.querySelector("[data-form-submit]");
  if (submit && data.form?.submitLabel) submit.innerHTML = escapeHtml(data.form.submitLabel);
  const faqHead = document.querySelector("[data-faq-head]");
  if (faqHead && data.faq) {
    faqHead.innerHTML = `
      <p class="eyebrow">${escapeHtml(data.faq.eyebrow)}</p>
      <h2>${escapeHtml(data.faq.title)}</h2>
    `;
  }
  const faq = document.querySelector("[data-faq]");
  if (faq) {
    faq.innerHTML = (data.faq?.items || [])
      .map(
        (item) => `
        <article class="faq-item">
          <button type="button" aria-expanded="false">${escapeHtml(item.question)}</button>
          <p class="faq-panel" hidden>${escapeHtml(item.answer)}</p>
        </article>
      `
      )
      .join("");
  }
}

(async function boot() {
  try {
    const page = document.body.dataset.page || "home";
    const site = await fetchJson("content/site.json");
    window.ZodawebLayout.inject(site);

    if (page === "home") {
      const [home, portfolio] = await Promise.all([
        fetchJson("content/home.json"),
        fetchJson("content/portfolio.json"),
      ]);
      renderHome(home, portfolio, site);
    } else if (page === "services") {
      renderServices(await fetchJson("content/services.json"));
    } else if (page === "portfolio") {
      renderPortfolio(await fetchJson("content/portfolio.json"));
    } else if (page === "about") {
      renderAbout(await fetchJson("content/about.json"));
    } else if (page === "contact") {
      renderContact(await fetchJson("content/contact.json"), site);
    }
  } catch (error) {
    console.error(error);
  }
  if (typeof window.ZodawebInit === "function") window.ZodawebInit();
})();
