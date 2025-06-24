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
        const thumb = document.createElement("img");
        thumb.src = "images/" + imgPath;
        thumb.alt = `${tip.name} Screenshot ${index + 1}`;

        // Special handling for interactive map
        if (tip.name === "Imperial Bunker" && index === 0) {
          thumb.classList.add("interactive-map-thumb");
          thumb.title = "Click to open interactive map";
          thumb.addEventListener("click", () => openInteractiveMap(tip.interactiveMap));
        } else {
          thumb.setAttribute("data-lg-size", "1400-800");
          thumb.setAttribute("data-src", "images/" + imgPath);
          thumb.setAttribute("data-sub-html", `<h4>${tip.name}</h4>`);
        }

        gallery.appendChild(thumb);
      });

      card.appendChild(gallery);
      container.appendChild(card);
    });
  });

// DRAGGABLE INTERACTIVE MAP
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

  // Enable drag
  let isDragging = false;
  let startX, startY;
  scrollArea.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.pageX - scrollArea.scrollLeft;
    startY = e.pageY - scrollArea.scrollTop;
    scrollArea.style.cursor = "grabbing";
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
    scrollArea.style.cursor = "default";
  });
  scrollArea.addEventListener("mousemove", e => {
    if (!isDragging) return;
    scrollArea.scrollLeft = startX - e.pageX;
    scrollArea.scrollTop = startY - e.pageY;
  });
}
