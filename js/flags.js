document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("flag-grid");
  if (!container) return;

  fetch("data/flags.json")
    .then((res) => res.json())
    .then((raw) => {
      const imageBase = (raw && raw.imageBase) || "images/flags";
      const imageExt = (raw && raw.imageExt) || "jpg";
      const thumbSuffix = (raw && raw.thumbSuffix) || " - thumb";
      const flags = Array.isArray(raw) ? raw : raw.flags || [];
      container.innerHTML = "";
      flags.forEach((flag) => {
        const base = String(flag.image).replace(/^\/+/, "");
        const fullSrc = `${imageBase}/${base}.${imageExt}`;
        const thumbSrc = `${imageBase}/${base}${thumbSuffix}.${imageExt}`;

        const wrapper = document.createElement("a");
        wrapper.href = fullSrc;
        wrapper.setAttribute("data-lightbox", "flags");
        wrapper.style.position = "relative";
        wrapper.classList.add("flag-wrapper");

        const img = document.createElement("img");
        img.src = thumbSrc;
        img.alt = flag.image;
        img.className = "helm";

        wrapper.appendChild(img);

        if (flag.collected) {
          const dot = document.createElement("div");
          dot.className = "collected-dot";
          wrapper.appendChild(dot);
        }

        container.appendChild(wrapper);
      });
    });
});
