// 2.1

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("collectable-row");
  if (!container) return;

  const SECTION_ORDER = [
    "Currencies",
    "Keycards+",
    "Toys",
    "Legos",
    "Crafting",
    "Misc"
  ];

  const SECTION_ICONS = {
    "Currencies": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8"></circle>
        <path d="M12 7v10M9 9.5h4a2 2 0 1 1 0 4h-2a2 2 0 1 0 0 4h4"></path>
      </svg>
    `,
    "Keycards+": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="6" width="17" height="12" rx="1"></rect>
        <path d="M8 10h8M8 14h5M16.5 14h0"></path>
      </svg>
    `,
    "Toys": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="10" r="2"></circle>
        <circle cx="15" cy="10" r="2"></circle>
        <path d="M6.5 14.5h11l-1 4h-9zM7.5 6.5h9"></path>
      </svg>
    `,
    "Legos": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="9" width="16" height="10"></rect>
        <rect x="7" y="6" width="2.5" height="3"></rect>
        <rect x="11" y="6" width="2.5" height="3"></rect>
        <rect x="15" y="6" width="2.5" height="3"></rect>
      </svg>
    `,
    "Crafting": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4l1.3 2.6 2.9.5-2.1 2 0.5 2.9L12 10.7 9.4 12l0.5-2.9-2.1-2 2.9-.5z"></path>
        <circle cx="12" cy="16.5" r="3.2"></circle>
      </svg>
    `,
    "Misc": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 8.5L12 4l7.5 4.5V18L12 22l-7.5-4z"></path>
        <path d="M4.5 8.5L12 13l7.5-4.5"></path>
      </svg>
    `
  };

  function normalizeText(value) {
    return (value || "").toString().toLowerCase();
  }

  function detectCategory(item) {
    if (SECTION_ORDER.includes(item.category)) return item.category;

    const name = normalizeText(item.name);
    const note = normalizeText(item.note);
    const haystack = `${name} ${note}`;

    if (/(credit|coin|medallion|currency)/.test(haystack)) return "Currencies";
    if (/(keycard|datacard|star map|chaincode|datapad|holocron)/.test(haystack)) return "Keycards+";
    if (/(lego|brick|block)/.test(haystack)) return "Legos";
    if (/(charcoal|craft|component|material|resource|powder|scrap|wire|battery|fuel|gas filter|tablet)/.test(haystack)) return "Crafting";
    if (/(droid|turret|turbine|droideka|grapple|seeker|probe|toy|figure)/.test(haystack)) return "Toys";

    return "Misc";
  }

  function addRow(label, value, parent) {
    const row = document.createElement("div");
    row.className = "collectable-data-row";

    const lab = document.createElement("span");
    lab.className = "collectable-label";
    lab.textContent = label;

    const val = document.createElement("span");
    val.className = "collectable-value";
    val.textContent = value == null || value === "" ? "—" : String(value);

    row.appendChild(lab);
    row.appendChild(val);
    parent.appendChild(row);
  }

  function createSectionHeader(sectionName) {
    const header = document.createElement("div");
    header.className = "collectable-section-header";
    header.innerHTML = `
      <div class="collectable-section-accent" aria-hidden="true"></div>
      <div class="collectable-section-main">
        <span class="collectable-section-icon" aria-hidden="true">${SECTION_ICONS[sectionName] || ""}</span>
        <span class="collectable-section-title">${sectionName}</span>
      </div>
      <div class="collectable-section-line" aria-hidden="true"></div>
    `;
    return header;
  }

  function createCard(item) {
    const glow = document.createElement("div");
    glow.className = "collectable-card-glow";

    const card = document.createElement("div");
    card.className = "collectable-card";
    if (item.collected) {
      card.classList.add("collectable-card--collected");
    }

    const thumbFrame = document.createElement("div");
    thumbFrame.className = "collectable-thumb-frame";

    const imageLink = document.createElement("a");
    imageLink.href = `images/${item.image}.png`;
    imageLink.setAttribute("data-lightbox", "collectables");
    imageLink.setAttribute("data-title", item.name);
    imageLink.className = "collectable-lightbox-link";

    const img = document.createElement("img");
    img.src = `images/${item.image} - thumb.png`;
    img.alt = item.name;
    img.className = "collectable-thumb";
    img.loading = "lazy";

    imageLink.appendChild(img);
    thumbFrame.appendChild(imageLink);

    const content = document.createElement("div");
    content.className = "collectable-content";

    const header = document.createElement("div");
    header.className = "collectable-header";

    const title = document.createElement("h3");
    title.className = "collectable-title";
    title.textContent = item.name;

    const status = document.createElement("span");
    status.className =
      "collectable-status " +
      (item.collected ? "collectable-status--collected" : "collectable-status--open");
    status.textContent = item.collected ? "COLLECTED" : "UNSCANNED";

    header.appendChild(title);
    header.appendChild(status);

    const rows = document.createElement("div");
    rows.className = "collectable-rows";

    addRow("SELL PRICE", item.sellPrice, rows);
    addRow("SLOTS", item.slots || "N/A", rows);
    addRow("NOTE", item.note || "", rows);

    content.appendChild(header);
    content.appendChild(rows);

    card.appendChild(thumbFrame);
    card.appendChild(content);
    glow.appendChild(card);

    return glow;
  }

  fetch("data/collectables.json")
    .then(res => res.json())
    .then(items => {
      container.innerHTML = "";

      const grouped = SECTION_ORDER.reduce((acc, section) => {
        acc[section] = [];
        return acc;
      }, {});

      items.forEach(item => {
        const section = detectCategory(item);
        grouped[section].push(item);
      });

      SECTION_ORDER.forEach(section => {
        const sectionItems = grouped[section];
        if (!sectionItems.length) return;

        const sectionWrap = document.createElement("section");
        sectionWrap.className = "collectable-section";

        sectionWrap.appendChild(createSectionHeader(section));

        const sectionGrid = document.createElement("div");
        sectionGrid.className = "collectable-section-grid";

        sectionItems.forEach(item => {
          sectionGrid.appendChild(createCard(item));
        });

        sectionWrap.appendChild(sectionGrid);
        container.appendChild(sectionWrap);
      });
    });
});
