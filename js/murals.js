document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("mural-grid");
  if (!container) return;

  fetch("data/murals.json")
    .then((res) => res.json())
    .then((raw) => {
      const imageBase = (raw && raw.imageBase) || "images/murals";
      const murals = Array.isArray(raw) ? raw : raw.murals || [];
      container.innerHTML = "";

      murals.forEach((mural) => {
        const file = String(mural.image || "").replace(/^\/+/, "");
        const title =
          mural.title != null && String(mural.title).trim() !== ""
            ? String(mural.title).trim()
            : file.replace(/\.[^/.]+$/, "");

        const src = `${imageBase}/${file}`;

        const anchor = document.createElement("a");
        anchor.href = encodeURI(src);
        anchor.className = "mural-card";
        anchor.setAttribute("data-lightbox", "murals");
        anchor.setAttribute("data-title", title);
        anchor.title = title;

        const inner = document.createElement("div");
        inner.className = "mural-card__inner";

        const media = document.createElement("div");
        media.className = "mural-card__media";

        const img = document.createElement("img");
        img.src = src;
        img.alt = title;
        img.className = "mural-card__thumb";
        img.loading = "lazy";

        const hover = document.createElement("div");
        hover.className = "mural-card__hover";
        hover.setAttribute("aria-hidden", "true");
        const hoverName = document.createElement("span");
        hoverName.className = "mural-card__hover-name";
        hoverName.textContent = title;
        hover.appendChild(hoverName);

        media.appendChild(img);
        media.appendChild(hover);
        inner.appendChild(media);
        anchor.appendChild(inner);
        container.appendChild(anchor);
      });
    })
    .catch((err) => {
      console.error("Murals page failed to load data:", err);
      container.innerHTML =
        '<p class="mural-page-error">Could not load murals. Please try again later.</p>';
    });
});
