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

// INTERACTIVE MAP WITH ZOOM + DRAG
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

  const img = document.createElement("img");
  img.src = "images/" + mapData.image;
  img.className = "draggable-map";
  scrollArea.appendChild(img);
  content.appendChild(scrollArea);

  // Add hotspots
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

    scrollArea.appendChild(hotspot);
  });

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // === Enable drag and zoom ===
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;

  function updateTransform() {
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  // Mouse down to pan
  scrollArea.addEventListener("mousedown", e => {
    isPanning = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    scrollArea.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", () => {
    isPanning = false;
    scrollArea.style.cursor = "grab";
  });

  scrollArea.addEventListener("mousemove", e => {
    if (!isPanning) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  // Scroll wheel to zoom
  scrollArea.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomAmount = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.5, scale + zoomAmount), 3); // Clamp between 0.5x and 3x

    // Zoom toward mouse position
    const rect = img.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    translateX -= offsetX * (newScale - scale) / scale;
    translateY -= offsetY * (newScale - scale) / scale;

    scale = newScale;
    updateTransform();
  });

  // Initial zoom-to-fit on load
  window.requestAnimationFrame(() => {
    const bounds = scrollArea.getBoundingClientRect();
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const scaleX = bounds.width / imgWidth;
    const scaleY = bounds.height / imgHeight;
    scale = Math.min(scaleX, scaleY, 1);
    translateX = 0;
    translateY = 0;
    updateTransform();
  });
}
