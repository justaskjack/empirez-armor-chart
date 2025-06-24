fetch("data/servertips.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("tips-row");
    data.forEach(tip => {
      const card = document.createElement("div");
      card.className = "tip-card";

      const content = document.createElement("div");
      content.className = "tip-content";

      const title = document.createElement("h3");
      title.textContent = tip.name;

      const notes = document.createElement("p");
      notes.textContent = tip.notes;

      content.appendChild(title);
      content.appendChild(notes);
      card.appendChild(content);

      const gallery = document.createElement("div");
      gallery.className = "tip-gallery";

      tip.gallery.forEach((imgPath, index) => {
        const thumb = document.createElement("a");
        thumb.href = "images/" + imgPath;
        thumb.setAttribute("data-lightbox", tip.name);
        thumb.setAttribute("data-title", `${tip.name} Screenshot ${index + 1}`);

        const img = document.createElement("img");
        img.src = "images/" + imgPath;
        img.alt = `${tip.name} Screenshot ${index + 1}`;

        // Special handling for interactive map
        if (tip.name === "Imperial Bunker" && index === 0) {
          img.classList.add("interactive-map-thumb");
          img.title = "Click to open interactive map";

          img.removeAttribute("data-src");
          img.removeAttribute("data-lg-size");
          img.removeAttribute("data-sub-html");

          img.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            openInteractiveMap(tip.interactiveMap);
          });
        } else {
          img.setAttribute("data-src", "images/" + imgPath);
          img.setAttribute("data-lg-size", "1400-800");
          img.setAttribute("data-sub-html", `<h4>${tip.name}</h4>`);
        }

        thumb.appendChild(img);
        gallery.appendChild(thumb);
      });

      card.appendChild(gallery);
      container.appendChild(card);
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

  // Add hotspots to zoomContainer
  mapData.hotspots.forEach(h => {
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

  // === PAN + ZOOM ===
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let startX, startY;

  function updateTransform() {
    zoomContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  // Zoom toward mouse pointer
  scrollArea.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const delta = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
    const newScale = Math.max(0.3, Math.min(scale * delta, 4));

    const rect = zoomContainer.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;

    offsetX -= dx * (newScale / scale - 1);
    offsetY -= dy * (newScale / scale - 1);

    scale = newScale;
    updateTransform();
  });

  // Dragging
  scrollArea.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    scrollArea.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    scrollArea.style.cursor = "default";
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    updateTransform();
  });

  // Zoom to fit on load
  img.onload = () => {
    const containerWidth = scrollArea.clientWidth;
    const containerHeight = scrollArea.clientHeight;
    const scaleX = containerWidth / img.naturalWidth;
    const scaleY = containerHeight / img.naturalHeight;
    scale = Math.min(scaleX, scaleY, 1);
    offsetX = 0;
    offsetY = 0;
    updateTransform();
  };
}
