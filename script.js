function initNav() {
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");
  if (!navLinks || !navToggle) return;

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initForms() {
  document.querySelectorAll("form[data-quote-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      if (!data.get("form-name")) {
        data.set("form-name", form.getAttribute("name") || "quote");
      }
      const name = String(data.get("name") || data.get("fullName") || "").trim();
      if (form.hasAttribute("data-netlify")) {
        try {
          await fetch(form.getAttribute("action") || "/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data).toString(),
          });
        } catch (error) {
          console.error(error);
        }
      }
      if (status) {
        status.textContent = `Thanks, ${name || "there"}. We’ll review your brief and get back within 24 hours.`;
      }
      form.reset();
      form.querySelectorAll(".pill-check input").forEach((input) => {
        input.checked = false;
      });
    });
  });
}

function initFilters() {
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll("[data-categories]")];
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      cards.forEach((card) => {
        const cats = (card.dataset.categories || "").split(" ");
        const show = filter === "all" || cats.includes(filter);
        card.hidden = !show;
      });
    });
  });
}

function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const trigger = item.querySelector("button");
    const panel = item.querySelector(".faq-panel");
    if (!trigger || !panel) return;
    trigger.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
    });
  });
}

function initServicePrefill() {
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");
  if (!service) return;
  const input = document.querySelector(`input[name="services"][value="${service}"]`);
  if (input) input.checked = true;
}

function initPreview() {
  const triggers = document.querySelectorAll("[data-preview]");
  if (!triggers.length) return;

  const modal = document.createElement("div");
  modal.className = "preview-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="previewTitle">
      <button type="button" class="preview-close" aria-label="Close preview">&times;</button>
      <img alt="" />
      <div class="preview-copy">
        <p class="eyebrow">Case preview</p>
        <h3 id="previewTitle"></h3>
        <div class="preview-text"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const img = modal.querySelector("img");
  const titleEl = modal.querySelector("#previewTitle");
  const copyEl = modal.querySelector(".preview-text");

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  const openFromCard = (card) => {
    const photo = card.querySelector("img");
    if (!photo) return;
    img.src = photo.getAttribute("src");
    img.alt = photo.alt;
    titleEl.textContent = card.querySelector("h3")?.textContent || "";
    const story = card.querySelector(".preview-story");
    if (story) {
      copyEl.innerHTML = story.innerHTML;
    } else {
      copyEl.textContent = (card.querySelector(".project-meta p")?.textContent || "").trim();
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  modal.querySelector(".preview-close").addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) close();
  });

  triggers.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const card = button.closest(".project-card");
      if (card) openFromCard(card);
    });
  });

  document.querySelectorAll(".mockup-photo img").forEach((photo) => {
    photo.addEventListener("click", () => {
      const card = photo.closest(".project-card");
      if (card) openFromCard(card);
    });
  });
}

window.ZodawebInit = function ZodawebInit() {
  initNav();
  initYear();
  initForms();
  initFilters();
  initFaq();
  initServicePrefill();
  initPreview();
};
