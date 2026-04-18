document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("flag-grid");
  if (!container) return;

  const DEFAULT_CARD_BACK = "flag_cardback01.jpg";
  const CARD_BACK_DIR = "images/";

  function resolveCardBack(flag, rootDefault) {
    const fallback = rootDefault || DEFAULT_CARD_BACK;
    const c = flag.cardBack;
    if (c == null || c === "") return fallback;
    if (typeof c === "number") {
      const map = {
        1: "flag_cardback01.jpg",
        2: "flag_cardback02.jpg",
        3: "flag_cardback03.jpg"
      };
      return map[c] || fallback;
    }
    const s = String(c).trim();
    if (s === "1" || s === "2" || s === "3") {
      return (
        {
          "1": "flag_cardback01.jpg",
          "2": "flag_cardback02.jpg",
          "3": "flag_cardback03.jpg"
        }[s] || fallback
      );
    }
    return s;
  }

  fetch("data/flags.json")
    .then((res) => res.json())
    .then((raw) => {
      const imageBase = (raw && raw.imageBase) || "images/flags";
      const imageExt = (raw && raw.imageExt) || "jpg";
      const thumbSuffix = (raw && raw.thumbSuffix) || " - thumb";
      const rootDefaultBack = (raw && raw.defaultCardBack) || DEFAULT_CARD_BACK;
      const flags = Array.isArray(raw) ? raw : raw.flags || [];
      container.innerHTML = "";

      flags.forEach((flag) => {
        const base = String(flag.image).replace(/^\/+/, "");
        const fullSrc = `${imageBase}/${base}.${imageExt}`;
        const thumbSrc = `${imageBase}/${base}${thumbSuffix}.${imageExt}`;
        const cardBackFile = resolveCardBack(flag, rootDefaultBack);
        const bgPath = `${CARD_BACK_DIR}${String(cardBackFile).replace(/^\/+/, "")}`;

        const displayName =
          flag.displayName != null && String(flag.displayName).trim() !== ""
            ? String(flag.displayName).trim()
            : String(flag.image).replace(/_/g, " ");
        const faction = flag.faction != null ? String(flag.faction).trim() : "";

        const anchor = document.createElement("a");
        anchor.href = encodeURI(fullSrc);
        anchor.setAttribute("data-lightbox", "flags");
        anchor.className = "flag-card";
        const lightboxTitle = faction ? `${displayName} — ${faction}` : displayName;
        anchor.setAttribute("data-title", lightboxTitle);

        const shell = document.createElement("div");
        shell.className = "flag-card__shell";
        shell.style.backgroundImage = `url("${bgPath}")`;

        const titleEl = document.createElement("div");
        titleEl.className = "flag-card__title";
        titleEl.textContent = displayName;

        const thumbWrap = document.createElement("div");
        thumbWrap.className = "flag-card__thumb-wrap";

        const thumbImg = document.createElement("img");
        thumbImg.src = thumbSrc;
        thumbImg.alt = displayName;
        thumbImg.className = "flag-card__thumb";
        thumbImg.loading = "lazy";

        thumbWrap.appendChild(thumbImg);

        const factionEl = document.createElement("div");
        factionEl.className = "flag-card__faction";
        factionEl.textContent = faction;

        shell.appendChild(titleEl);
        shell.appendChild(thumbWrap);
        shell.appendChild(factionEl);
        anchor.appendChild(shell);

        if (flag.collected) {
          const dot = document.createElement("div");
          dot.className = "collected-dot flag-card__collected-dot";
          anchor.appendChild(dot);
        }

        container.appendChild(anchor);
      });
    });
});
