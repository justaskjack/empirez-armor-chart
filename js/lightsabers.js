document.addEventListener("DOMContentLoaded", function () {
  fetch("lightsabers.json")
    .then((response) => response.json())
    .then((sabers) => {
      const row = document.getElementById("saber-row");

      sabers.forEach((saber) => {
        const card = document.createElement("div");
        card.className = "saber-card";

        const wrapper = document.createElement("div");
        wrapper.className = "saber-wrapper";
        wrapper.setAttribute("data-tooltip", saber.name);

        // Create main blade
        const blade = document.createElement("div");
        blade.className = "blade";
        blade.style.setProperty("--blade-color", saber.bladeColor || "#0ff");
        blade.style.backgroundColor = saber.bladeColor;

        // Custom offsets and rotation
        if (saber.offsetX) blade.style.left = saber.offsetX;
        if (saber.offsetY) blade.style.bottom = saber.offsetY;
        if (saber.rotation) blade.style.transform = `rotate(${saber.rotation}deg)`;
        if (saber.shape === "knife") blade.style.borderRadius = "0 30% 0 30%";

        wrapper.appendChild(blade);

        // Optional mirrored blade
        if (saber.mirroredBlade) {
          const bottomBlade = blade.cloneNode(true);
          bottomBlade.style.top = "100%";
          bottomBlade.style.bottom = "auto";
          wrapper.appendChild(bottomBlade);
        }

        // Optional side blades
        if (saber.sideBlades) {
          const leftBlade = blade.cloneNode(true);
          leftBlade.style.bottom = "calc(100% - 30px)";
          leftBlade.style.left = "-15px";
          leftBlade.style.transform = "rotate(90deg)";
          wrapper.appendChild(leftBlade);

          const rightBlade = blade.cloneNode(true);
          rightBlade.style.bottom = "calc(100% - 30px)";
          rightBlade.style.left = "15px";
          rightBlade.style.transform = "rotate(-90deg)";
          wrapper.appendChild(rightBlade);
        }

        // Create hilt image
        const img = document.createElement("img");
        img.className = "saber-img";
        img.src = `images/lightsabers/${saber.thumb}`;
        wrapper.appendChild(img);

        // Sounds
        const onSound = new Audio(`sounds/${saber.soundOn}`);
        const offSound = new Audio(`sounds/${saber.soundOff}`);
        onSound.volume = 0.7;
        offSound.volume = 0.7;

        let bladeActive = false;
        wrapper.addEventListener("click", () => {
          bladeActive = !bladeActive;
          wrapper.querySelectorAll(".blade").forEach((b) => {
            b.classList.toggle("active", bladeActive);
          });
          if (bladeActive) {
            onSound.currentTime = 0;
            onSound.play();
          } else {
            offSound.currentTime = 0;
            offSound.play();
          }
        });

        card.appendChild(wrapper);
        row.appendChild(card);
      });
    });
});
