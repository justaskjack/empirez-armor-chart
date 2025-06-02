document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("flag-grid");
  if (!container) return;

  fetch("data/flags.json")
    .then((res) => res.json())
    .then((flags) => {
      container.innerHTML = "";
      flags.forEach((flag) => {
      const wrapper = document.createElement("a");
      wrapper.href = `images/${flag.image}.png`;
      wrapper.setAttribute("data-lightbox", "flags");
      wrapper.style.position = "relative"; // required for dot positioning
      wrapper.classList.add("flag-wrapper"); // ← ADD THIS LINE

        const img = document.createElement("img");
        img.src = `images/${flag.image} - thumb.png`;
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
