document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("vehicle-row");
  if (!container) return;

  const THUMB_PLACEHOLDER = "images/vehicles/vehicle-thumb-placeholder.svg";

  const SECTION_ICONS = {
    ground: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="7" cy="17" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="17" cy="17" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M4 17h2.5M14.5 17H20M10 17h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M7 14V8h10v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M9 8V6h6v2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      </svg>
    `,
    flying: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12h4l2-3h6l2 3h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M9 9V6l3-2 3 2v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M12 14v4M10 18h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `,
    transport: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 14h16v3H4z" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M6 14V9h12v5" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M9 9V7h6v2" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M8 17v2M12 17v2M16 17v2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `
  };

  const META_ICONS = {
    buy: `
      <svg class="vehicle-meta-svg vehicle-meta-svg--credit" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="miter"
          d="M6.2 5.8h11.1l1.6 2.4v7.6l-1.6 2.4H6.2l-1.6-2.4V8.2l1.6-2.4z" />
        <path fill="currentColor" fill-opacity="0.22" stroke="none"
          d="M7.8 8.4h8.4v1.1H7.8zm0 2.6h8.4v1.1H7.8zm0 2.6h6.2v1.1H7.8z" />
        <path fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.75"
          d="M15.2 6.1l1.3 2.1v7.6l-1.3 2.1" />
      </svg>
    `,
    sell: `
      <svg class="vehicle-meta-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5h14v6H5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M9 11v6l3 2 3-2v-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M8 8h8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `,
    cargo: `
      <svg class="vehicle-meta-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 9h14v10H5z" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5 9l7-4 7 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M12 5v14" fill="none" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    `,
    seats: `
      <svg class="vehicle-meta-svg" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5 18v-1.5a4 4 0 0 1 8 0V18" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="16.5" cy="9" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M13.5 18v-1a3 3 0 0 1 6 0v1" fill="none" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    `
  };

  function sectionGridId(key) {
    return `vehicle-grid-${String(key)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}`;
  }

  function createSectionHeader(sectionKey, title, gridId) {
    const header = document.createElement("button");
    header.type = "button";
    header.className = "vehicle-section-header";
    header.setAttribute("aria-expanded", "true");
    header.setAttribute("aria-controls", gridId);
    header.setAttribute("aria-label", `Show or hide the ${title} vehicles section`);
    const icon = SECTION_ICONS[sectionKey] || SECTION_ICONS.ground;
    header.innerHTML = `
      <div class="vehicle-section-accent" aria-hidden="true"></div>
      <div class="vehicle-section-main">
        <span class="vehicle-section-icon" aria-hidden="true">${icon}</span>
        <span class="vehicle-section-title">${title}</span>
      </div>
      <span class="vehicle-section-chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
      <div class="vehicle-section-line" aria-hidden="true"></div>
    `;
    return header;
  }

  function thumbToLargeUrl(thumbPath) {
    const s = String(thumbPath).replace(/^\/+/, "");
    const lastDot = s.lastIndexOf(".");
    if (lastDot <= 0) return `${s}-lg`;
    const base = s.slice(0, lastDot);
    const ext = s.slice(lastDot);
    if (base.toLowerCase().endsWith("-lg")) return s;
    return `${base}-lg${ext}`;
  }

  function metaItem(kind, label, value) {
    const wrap = document.createElement("div");
    wrap.className = "vehicle-meta-item";
    wrap.setAttribute("title", label);
    const ic = document.createElement("span");
    ic.className = "vehicle-meta-icon";
    ic.setAttribute("aria-hidden", "true");
    ic.innerHTML = META_ICONS[kind] || "";
    const val = document.createElement("span");
    val.className = "vehicle-meta-value";
    val.textContent = value == null ? "—" : String(value);
    wrap.appendChild(ic);
    wrap.appendChild(val);
    return wrap;
  }

  function createCard(vehicle) {
    const glow = document.createElement("div");
    glow.className = "vehicle-card-glow";

    const card = document.createElement("article");
    card.className = "vehicle-card";

    const thumbWrap = document.createElement("div");
    thumbWrap.className = "vehicle-thumb-wrap";
    const thumbInner = document.createElement("div");
    thumbInner.className = "vehicle-thumb-inner";

    const img = document.createElement("img");
    img.className = "vehicle-thumb";
    img.alt = vehicle.name;
    img.loading = "lazy";
    const thumbSrc = vehicle.thumb ? String(vehicle.thumb).replace(/^\/+/, "") : THUMB_PLACEHOLDER;
    img.src = thumbSrc;
    img.addEventListener("error", () => {
      img.src = THUMB_PLACEHOLDER;
    });

    if (vehicle.thumb) {
      const link = document.createElement("a");
      link.href = thumbToLargeUrl(vehicle.thumb);
      link.setAttribute("data-lightbox", "vehicles");
      link.setAttribute("data-title", vehicle.name);
      link.className = "vehicle-lightbox-link";
      link.appendChild(img);
      thumbInner.appendChild(link);
    } else {
      thumbInner.appendChild(img);
    }
    thumbWrap.appendChild(thumbInner);

    const body = document.createElement("div");
    body.className = "vehicle-body";

    const title = document.createElement("h3");
    title.className = "vehicle-title";
    title.textContent = vehicle.name;

    const desc = document.createElement("p");
    desc.className = "vehicle-desc";
    desc.textContent = vehicle.description || "";

    const meta = document.createElement("div");
    meta.className = "vehicle-meta";
    meta.appendChild(metaItem("buy", "Cost", vehicle.buy));
    meta.appendChild(metaItem("sell", "Sell price", vehicle.sell));
    meta.appendChild(metaItem("cargo", "Cargo", vehicle.cargo));
    meta.appendChild(metaItem("seats", "Seats", vehicle.seats));

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(meta);

    card.appendChild(thumbWrap);
    card.appendChild(body);
    glow.appendChild(card);
    return glow;
  }

  fetch("data/vehicles.json")
    .then(r => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .then(data => {
      container.innerHTML = "";
      const sections = Array.isArray(data.sections) ? data.sections : [];

      sections.forEach((section, idx) => {
        const key = section.key || section.title || `section-${idx}`;
        const title = section.title || key;
        const vehicles = Array.isArray(section.vehicles) ? section.vehicles : [];
        if (!vehicles.length) return;

        const wrap = document.createElement("section");
        wrap.className = "vehicle-section";

        const gridId = sectionGridId(key);
        const header = createSectionHeader(key, title, gridId);

        const grid = document.createElement("div");
        grid.className = "vehicle-section-grid";
        grid.id = gridId;

        const startCollapsed = idx > 0;
        if (startCollapsed) {
          wrap.classList.add("vehicle-section--collapsed");
          header.setAttribute("aria-expanded", "false");
        }

        header.addEventListener("click", () => {
          wrap.classList.toggle("vehicle-section--collapsed");
          const collapsed = wrap.classList.contains("vehicle-section--collapsed");
          header.setAttribute("aria-expanded", String(!collapsed));
        });

        vehicles.forEach(v => {
          grid.appendChild(createCard(v));
        });

        wrap.appendChild(header);
        wrap.appendChild(grid);
        container.appendChild(wrap);
      });
    })
    .catch(err => {
      console.error("Vehicles page failed to load:", err);
      container.innerHTML =
        '<p class="vehicle-page-error">Could not load vehicle database. Check the console for details.</p>';
    });
});
