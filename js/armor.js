const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Relic", "None"];

const EQUIPMENT_SLOT_ORDER = [
  "leftweapon",
  "rightweapon",
  "chest",
  "shirt",
  "belt",
  "legs",
  "backpack",
  "head",
  "mask",
  "eyes",
  "hands",
  "feet",
  "armband"
];

const DEFAULT_CARD_BACK = "armorsets_cardback01.png";
const DEFAULT_EQUIPMENT_IMAGE = "equipment01.jpg";
const EQUIPMENT_IMAGE_DIR = "images/armor_sets/equipment/";

let allData = [];
let equipmentHotspotLayout = {};

function buildArmorCard(armor) {
  const cardBack = armor.cardBack || DEFAULT_CARD_BACK;
  const equipmentImage = armor.equipmentImage || DEFAULT_EQUIPMENT_IMAGE;
  const tooltips = armor.equipmentTooltips && typeof armor.equipmentTooltips === "object"
    ? armor.equipmentTooltips
    : {};

  const card = document.createElement("div");
  card.className = "armor-card armor-card--ccg";
  card.style.position = "relative";
  const bgPath = `images/${String(cardBack).replace(/"/g, "")}`;
  card.style.backgroundImage = `url("${bgPath}")`;

  const shell = document.createElement("div");
  shell.className = "armor-card-ccg";

  const titleEl = document.createElement("div");
  titleEl.className = "armor-card-ccg__title";
  titleEl.textContent = armor.name;

  const prot = document.createElement("div");
  prot.className = "armor-card-ccg__protection";
  prot.setAttribute("aria-label", `Protection level ${armor.protection}`);
  prot.textContent = String(armor.protection);

  const meta = document.createElement("div");
  meta.className = "armor-card-ccg__meta";
  const metaR = document.createElement("div");
  metaR.className = "armor-card-ccg__meta-line";
  const metaRLabel = document.createElement("span");
  metaRLabel.className = "armor-card-ccg__meta-label";
  metaRLabel.textContent = "Rarity:";
  const metaRVal = document.createElement("span");
  metaRVal.className = `armor-card-ccg__meta-value rarity-value-${armor.rarity}`;
  metaRVal.textContent = armor.rarity;
  metaR.appendChild(metaRLabel);
  metaR.appendChild(metaRVal);

  const metaL = document.createElement("div");
  metaL.className = "armor-card-ccg__meta-line";
  const metaLLabel = document.createElement("span");
  metaLLabel.className = "armor-card-ccg__meta-label";
  metaLLabel.textContent = "Location:";
  const metaLVal = document.createElement("span");
  metaLVal.className = "armor-card-ccg__meta-value";
  metaLVal.textContent = armor.location;
  metaL.appendChild(metaLLabel);
  metaL.appendChild(metaLVal);

  meta.appendChild(metaR);
  meta.appendChild(metaL);

  const thumbWrap = document.createElement("div");
  thumbWrap.className = "armor-card-ccg__thumb-wrap";

  const thumbLink = document.createElement("a");
  thumbLink.href = encodeURI(`images/armor_sets/${armor.image}`);
  thumbLink.setAttribute("data-lightbox", "armor");
  thumbLink.setAttribute("data-title", `${armor.name} — ${armor.type}`);
  thumbLink.className = "armor-card-ccg__thumb-link";

  const thumbImg = document.createElement("img");
  thumbImg.src = `images/armor_sets/${armor.image}`;
  thumbImg.alt = armor.name;
  thumbImg.className = "armor-card-ccg__thumb-img";
  thumbImg.loading = "lazy";

  thumbLink.appendChild(thumbImg);
  thumbWrap.appendChild(thumbLink);

  const typeEl = document.createElement("div");
  typeEl.className = "armor-card-ccg__type";
  typeEl.textContent = armor.type;

  const equipWrap = document.createElement("div");
  equipWrap.className = "armor-card-ccg__equipment";

  const equipImg = document.createElement("img");
  equipImg.src = `${EQUIPMENT_IMAGE_DIR}${equipmentImage}`;
  equipImg.alt = "";
  equipImg.className = "armor-card-ccg__equipment-img";
  equipImg.decoding = "async";

  const equipHits = document.createElement("div");
  equipHits.className = "armor-card-ccg__equipment-hits";
  equipHits.setAttribute("aria-hidden", "true");

  EQUIPMENT_SLOT_ORDER.forEach(slotId => {
    const rect = equipmentHotspotLayout[slotId];
    if (!rect) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "armor-card-ccg__hotspot";
    btn.style.left = `${rect.left}%`;
    btn.style.top = `${rect.top}%`;
    btn.style.width = `${rect.width}%`;
    btn.style.height = `${rect.height}%`;
    const tip = tooltips[slotId];
    btn.title = tip != null && String(tip).trim() !== "" ? String(tip) : slotId;
    btn.setAttribute("aria-label", tip != null && String(tip).trim() !== "" ? String(tip) : slotId);
    equipHits.appendChild(btn);
  });

  equipWrap.appendChild(equipImg);
  equipWrap.appendChild(equipHits);

  shell.appendChild(titleEl);
  shell.appendChild(prot);
  shell.appendChild(meta);
  shell.appendChild(thumbWrap);
  shell.appendChild(typeEl);
  shell.appendChild(equipWrap);

  card.appendChild(shell);

  if (armor.collected) {
    const dot = document.createElement("div");
    dot.className = "collected-dot armor-card-ccg__collected-dot";
    card.appendChild(dot);
  }

  return card;
}

function renderSections(data) {
  const container = document.getElementById("armor-sections");
  container.innerHTML = "";

  rarityOrder.forEach(rarity => {
    const filteredCards = data.filter(item => item.rarity === rarity);
    if (filteredCards.length === 0) return;

    const section = document.createElement("section");
    section.className = `armor-section bar-${rarity}`;
    section.dataset.rarity = rarity;

    const toggle = document.createElement("button");
    toggle.innerHTML = "&#8722;";
    toggle.className = "section-toggle";

    const grid = document.createElement("div");
    grid.className = "armor-grid";

    toggle.onclick = () => {
      grid.classList.toggle("collapsed");
      toggle.innerHTML = grid.classList.contains("collapsed") ? "+" : "&#8722;";
    };

    filteredCards.forEach(armor => {
      grid.appendChild(buildArmorCard(armor));
    });

    section.appendChild(toggle);
    section.appendChild(grid);
    container.appendChild(section);
  });
}

Promise.all([
  fetch("data/armor.json").then(res => res.json()),
  fetch("data/equipment-hotspot-layout.json")
    .then(res => res.json())
    .catch(() => ({}))
])
  .then(([armorData, layout]) => {
    equipmentHotspotLayout = layout && typeof layout === "object" ? layout : {};
    allData = armorData;
    renderSections(allData);
  })
  .catch(err => {
    console.error("Armor page failed to load data:", err);
  });

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("rarityFilter").addEventListener("change", applyFilters);
document.getElementById("sortOption").addEventListener("change", applyFilters);

function applyFilters() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const rarity = document.getElementById("rarityFilter").value;
  const sortOption = document.getElementById("sortOption").value;

  let filtered = allData.filter(
    a =>
      (!rarity || a.rarity === rarity) &&
      (a.name.toLowerCase().includes(search) ||
        a.type.toLowerCase().includes(search) ||
        a.location.toLowerCase().includes(search))
  );

  if (sortOption === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortOption === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (sortOption === "protection-asc") filtered.sort((a, b) => a.protection - b.protection);
  if (sortOption === "protection-desc") filtered.sort((a, b) => b.protection - a.protection);

  renderSections(filtered);
}

const globalToggle = document.createElement("button");
globalToggle.textContent = "Collapse All";
globalToggle.style = "margin-left: 1rem; padding: 0.5rem 1rem;";
let allCollapsed = false;

globalToggle.addEventListener("click", () => {
  const grids = document.querySelectorAll(".armor-grid");
  const toggles = document.querySelectorAll(".section-toggle");
  grids.forEach((grid, idx) => {
    grid.classList.toggle("collapsed", !allCollapsed);
    toggles[idx].innerHTML = !allCollapsed ? "+" : "&#8722;";
  });
  allCollapsed = !allCollapsed;
  globalToggle.textContent = allCollapsed ? "Expand All" : "Collapse All";
});

document.getElementById("controls").appendChild(globalToggle);

// =======================
// HELMS LOADING SECTION
// =======================
fetch("data/helms.json")
  .then(res => res.json())
  .then(helms => {
    const grid = document.getElementById("helmGrid");

    helms.forEach(helm => {
      const anchor = document.createElement("a");
      anchor.href = `images/${helm.image}`;
      anchor.setAttribute("data-lightbox", "helm");
      anchor.title = helm.name;
      anchor.style.gridColumn = helm.col;
      anchor.style.gridRow = helm.row;
      anchor.style.position = "relative";

      const img = document.createElement("img");
      img.src = `images/${helm.thumb}`;
      img.alt = helm.name;
      img.title = helm.name;
      img.className = "helm-thumb";

      anchor.appendChild(img);

      if (helm.collected) {
        const dot = document.createElement("div");
        dot.className = "collected-dot";
        anchor.appendChild(dot);
      }

      grid.appendChild(anchor);
    });
  });
