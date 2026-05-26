document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tips-row");
  if (!container) return;

  const expandAllBtn = document.getElementById("tips-expand-all");
  const collapseAllBtn = document.getElementById("tips-collapse-all");

  function sectionPanelId(name) {
    return (
      "tip-section-" +
      String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  function createSectionHeader(sectionName, panelId) {
    const header = document.createElement("button");
    header.type = "button";
    header.className = "tip-section-header";
    header.setAttribute("aria-expanded", "false");
    header.setAttribute("aria-controls", panelId);
    header.setAttribute(
      "aria-label",
      `Show or hide the ${sectionName} server tip section`
    );
    header.innerHTML = `
      <div class="tip-section-accent" aria-hidden="true"></div>
      <div class="tip-section-main">
        <span class="tip-section-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M12 3l8 4v6c0 5-3.5 8.5-8 10-8-1.5-8-5-8-10V7l8-4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"></path>
          </svg>
        </span>
        <span class="tip-section-title"></span>
      </div>
      <span class="tip-section-chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
      <div class="tip-section-line" aria-hidden="true"></div>
    `;
    header.querySelector(".tip-section-title").textContent = sectionName;
    return header;
  }

  function buildTipCard(tip) {
    const card = document.createElement("div");
    card.className = "tip-card";

    const content = document.createElement("div");
    content.className = "tip-content";

    const notes = document.createElement("div");
    notes.className = "tip-notes";
    notes.innerHTML = tip.notes || "";

    content.appendChild(notes);
    card.appendChild(content);

    const gallery = document.createElement("div");
    gallery.className = "tip-gallery";

    const galleryItems = Array.isArray(tip.gallery) ? tip.gallery : [];
    galleryItems.forEach((imgPath, index) => {
      const thumb = document.createElement("a");
      thumb.href = "images/" + imgPath;
      thumb.setAttribute("data-lightbox", tip.name);
      thumb.setAttribute("data-title", `${tip.name} Screenshot ${index + 1}`);

      const img = document.createElement("img");
      img.src = "images/" + imgPath;
      img.alt = `${tip.name} Screenshot ${index + 1}`;
      img.loading = "lazy";

      if (tip.name === "Imperial Bunker" && index === 0) {
        img.classList.add("interactive-map-thumb");
        img.title = "Click to open interactive map";

        img.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openInteractiveMap(tip.interactiveMap);
        });
      }

      thumb.appendChild(img);
      gallery.appendChild(thumb);
    });

    card.appendChild(gallery);
    return card;
  }

  function setSectionCollapsed(section, header, collapsed) {
    section.classList.toggle("tip-section--collapsed", collapsed);
    header.setAttribute("aria-expanded", String(!collapsed));
  }

  function setAllSections(collapsed) {
    container.querySelectorAll(".tip-section").forEach((section) => {
      const header = section.querySelector(".tip-section-header");
      if (header) setSectionCollapsed(section, header, collapsed);
    });
  }

  fetch("data/servertips.json")
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = "";

      data.forEach((tip) => {
        const panelId = sectionPanelId(tip.name);
        const section = document.createElement("section");
        section.className = "tip-section tip-section--collapsed";

        const header = createSectionHeader(tip.name, panelId);

        const body = document.createElement("div");
        body.className = "tip-section-body";
        body.id = panelId;
        body.setAttribute("role", "region");
        body.setAttribute("aria-labelledby", panelId + "-label");
        header.id = panelId + "-label";

        body.appendChild(buildTipCard(tip));

        header.addEventListener("click", () => {
          const collapsed = section.classList.contains("tip-section--collapsed");
          setSectionCollapsed(section, header, !collapsed);
        });

        section.appendChild(header);
        section.appendChild(body);
        container.appendChild(section);
      });

      if (expandAllBtn) {
        expandAllBtn.addEventListener("click", () => setAllSections(false));
      }
      if (collapseAllBtn) {
        collapseAllBtn.addEventListener("click", () => setAllSections(true));
      }
    })
    .catch((err) => {
      console.error("Server Tips failed to load:", err);
      container.innerHTML =
        '<p class="tip-page-error">Could not load server tips. Please try again later.</p>';
    });
});

// === INTERACTIVE MAP FUNCTIONALITY ===
function openInteractiveMap(mapData) {
  const overlay = document.createElement("div");
  overlay.className = "interactive-map-overlay";

  const content = document.createElement("div");
  content.className = "interactive-map-content";

  const closeBtn = document.createElement("button");
  closeBtn.className = "interactive-map-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => document.body.removeChild(overlay);
  content.appendChild(closeBtn);

  const scrollArea = document.createElement("div");
  scrollArea.className = "interactive-map-scroll";

  const zoomContainer = document.createElement("div");
  zoomContainer.className = "zoom-container";
  zoomContainer.style.transformOrigin = "top left";

  const img = document.createElement("img");
  img.src = "images/" + mapData.image;
  img.className = "draggable-map";
  zoomContainer.appendChild(img);

  mapData.hotspots.forEach((h) => {
    const hotspot = document.createElement("div");
    hotspot.className = "map-hotspot";
    hotspot.style.left = h.x + "px";
    hotspot.style.top = h.y + "px";
    hotspot.style.width = h.width + "px";
    hotspot.style.height = h.height + "px";

    hotspot.addEventListener("click", () => {
      const viewer = document.createElement("div");
      viewer.className = "lightbox-overlay";
      const imgEl = document.createElement("img");
      imgEl.src = "images/" + h.image;
      viewer.appendChild(imgEl);
      viewer.onclick = () => viewer.remove();
      document.body.appendChild(viewer);
    });

    zoomContainer.appendChild(hotspot);
  });

  scrollArea.appendChild(zoomContainer);
  content.appendChild(scrollArea);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  let scale = 1;
  let minScale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function updateTransform() {
    zoomContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  scrollArea.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const delta = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
    const newScale = Math.max(minScale, Math.min(scale * delta, 4));

    const rect = zoomContainer.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;

    offsetX -= dx * (newScale / scale - 1);
    offsetY -= dy * (newScale / scale - 1);

    scale = newScale;
    updateTransform();
  });

  scrollArea.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    scrollArea.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    scrollArea.style.cursor = "default";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    requestAnimationFrame(updateTransform);
  });

  img.onload = () => {
    const containerWidth = scrollArea.clientWidth;
    const containerHeight = scrollArea.clientHeight;
    const scaleX = containerWidth / img.naturalWidth;
    const scaleY = containerHeight / img.naturalHeight;
    scale = minScale = Math.min(scaleX, scaleY, 1);

    offsetX = (containerWidth - img.naturalWidth * scale) / 2;
    offsetY = (containerHeight - img.naturalHeight * scale) / 2;

    updateTransform();
  };
}
