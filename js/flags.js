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

        const img = document.createElement("img");
        img.src = `images/${flag.image} - thumb.png`;
        img.alt = flag.image;
        img.className = "helm";

        wrapper.appendChild(img);
        container.appendChild(wrapper);
      });
    });
});
