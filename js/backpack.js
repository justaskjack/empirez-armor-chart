document.addEventListener("DOMContentLoaded", () => {
  const BACKPACK_CARD_BACK = "backpack_cardback.png";

  const DEFAULT_LAYOUT = {
    thumb: { left: 15.233, top: 18.85, width: 27.267, height: 51.6 },
    title: { left: 47.5, top: 14.5, width: 41, height: 16 },
    slots: { left: 47.5, top: 31.5, width: 41, height: 9 },
    strapSlots: [
      { left: 25.367, top: 81.3, width: 6.967, height: 10 },
      { left: 33.8, top: 81.3, width: 6.967, height: 10 },
      { left: 42.233, top: 81.3, width: 6.967, height: 10 },
      { left: 50.667, top: 81.3, width: 6.967, height: 10 },
      { left: 59.1, top: 81.3, width: 6.967, height: 10 },
      { left: 67.533, top: 81.3, width: 6.967, height: 10 }
    ]
  };

  function applyRect(el, rect) {
    if (!rect || typeof rect !== "object") return;
    const { left, top, width, height } = rect;
    if (left != null) el.style.left = `${left}%`;
    if (top != null) el.style.top = `${top}%`;
    if (width != null) el.style.width = `${width}%`;
    if (height != null) el.style.height = `${height}%`;
  }

  function normalizeLayout(raw) {
    const base = { ...DEFAULT_LAYOUT, ...(raw && typeof raw === "object" ? raw : {}) };
    const straps = Array.isArray(base.strapSlots) ? base.strapSlots : DEFAULT_LAYOUT.strapSlots;
    return {
      thumb: base.thumb || DEFAULT_LAYOUT.thumb,
      title: base.title || DEFAULT_LAYOUT.title,
      slots: base.slots || DEFAULT_LAYOUT.slots,
      strapSlots: straps.length >= 6 ? straps.slice(0, 6) : DEFAULT_LAYOUT.strapSlots
    };
  }

  function buildBackpackCard(bp, index, layout) {
    const card = document.createElement("div");
    card.className = "backpack-card backpack-card--ccg";
    const bgPath = `images/${String(BACKPACK_CARD_BACK).replace(/"/g, "")}`;
    card.style.backgroundImage = `url("${bgPath}")`;

    const shell = document.createElement("div");
    shell.className = "backpack-card-ccg";

    const thumb = document.createElement("div");
    thumb.className = "backpack-card-ccg__thumb";
    applyRect(thumb, layout.thumb);

    const galleryId = `bp-gallery-${index}`;
    const galleryWrapper = document.createElement("div");
    galleryWrapper.id = galleryId;
    galleryWrapper.className = "lightgallery backpack-card-ccg__lg";

    const a = document.createElement("a");
    a.href = `images/backpacks/${bp.image}`;
    a.setAttribute("data-lg-size", "1406-1390");
    a.setAttribute("data-sub-html", `<h4>${bp.name}</h4><p>Slots: ${bp.slots}</p>`);

    const img = document.createElement("img");
    img.src = `images/backpacks/${bp.thumb}`;
    img.alt = bp.name;
    img.className = "backpack-card-ccg__thumb-img";
    img.loading = "lazy";

    a.appendChild(img);
    galleryWrapper.appendChild(a);
    thumb.appendChild(galleryWrapper);

    const titleEl = document.createElement("div");
    titleEl.className = "backpack-card-ccg__title";
    titleEl.textContent = bp.name;
    applyRect(titleEl, layout.title);

    const slotsEl = document.createElement("div");
    slotsEl.className = "backpack-card-ccg__slots";
    slotsEl.textContent = `Slots: ${bp.slots}`;
    applyRect(slotsEl, layout.slots);

    const icons = Array.isArray(bp.strapSlots) ? bp.strapSlots : [];

    shell.appendChild(thumb);
    shell.appendChild(titleEl);
    shell.appendChild(slotsEl);

    for (let i = 0; i < 6; i++) {
      const slot = document.createElement("div");
      slot.className = "backpack-card-ccg__strap-slot";
      applyRect(slot, layout.strapSlots[i]);
      if (icons[i]) {
        const slotIcon = document.createElement("img");
        slotIcon.src = `images/backpacks/${icons[i]}`;
        slotIcon.alt = "";
        slotIcon.className = "backpack-card-ccg__strap-icon";
        slot.appendChild(slotIcon);
      }
      shell.appendChild(slot);
    }

    card.appendChild(shell);
    return card;
  }

  Promise.all([
    fetch("data/backpacks.json").then(res => res.json()),
    fetch("data/backpack-card-layout.json")
      .then(res => res.json())
      .catch(() => ({}))
  ])
    .then(([backpacks, layoutRaw]) => {
      const layout = normalizeLayout(layoutRaw);
      const container = document.getElementById("backpack-row");
      backpacks.forEach((bp, index) => {
        const card = buildBackpackCard(bp, index, layout);
        container.appendChild(card);
        const galleryWrapper = card.querySelector(".lightgallery");
        if (galleryWrapper) {
          lightGallery(galleryWrapper, {
            selector: "a",
            plugins: [lgThumbnail],
            thumbnail: true,
            animateThumb: true,
            showThumbByDefault: false
          });
        }
      });
    })
    .catch(err => {
      console.error("Backpacks page failed to load:", err);
    });
});
