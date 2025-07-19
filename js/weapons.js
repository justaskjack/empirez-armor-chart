document.addEventListener("DOMContentLoaded", () => {
  fetch("data/weapons.json")
    .then(response => response.json())
    .then(data => {
      const firearms = data.filter(w => w.type === "Firearm");
      const melee = data.filter(w => w.type === "Melee");

      const renderSection = (list, containerId, titleText) => {
        const container = document.getElementById(containerId);

        // Add section header title
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = titleText;
        sectionTitle.className = "weapon-section-title";
        container.appendChild(sectionTitle);

        list.forEach(weapon => {
          const card = document.createElement("div");
          card.className = "weapon-card";

          // Top row with name and ammo type
          const header = document.createElement("div");
          header.className = "weapon-header";
          header.innerHTML = `<span><strong>${weapon.name}</strong></span><span><strong>Ammo:</strong> ${weapon.ammo}</span>`;
          card.appendChild(header);

          // Thumbnail
          const thumbWrapper = document.createElement("div");
          thumbWrapper.className = "weapon-thumb";
          const thumb = document.createElement("img");
          const thumbPath = `images/weapons/${weapon.image.replace(".png", " - thumb.png")}`;
          const fullSize = `images/weapons/${weapon.image}`;
          thumb.src = thumbPath;
          thumb.alt = weapon.name;
          thumb.addEventListener("click", () => {
            const instance = lightGallery(document.createElement("div"), {
              dynamic: true,
              dynamicEl: [{ src: fullSize }]
            });
            instance.openGallery();
          });
          thumbWrapper.appendChild(thumb);
          card.appendChild(thumbWrapper);

          // Slots
          if (weapon.slots && weapon.slots.length) {
            const slotsDiv = document.createElement("div");
            slotsDiv.className = "weapon-slots";
            weapon.slots.forEach(slot => {
              const slotImg = document.createElement("img");
              slotImg.src = `images/icons/${slot}`;
              slotImg.alt = "Slot";
              slotsDiv.appendChild(slotImg);
            });
            card.appendChild(slotsDiv);
          }

          // Accessories
          if (weapon.accessories && weapon.accessories.length) {
            const accessoriesLabel = document.createElement("div");
            accessoriesLabel.innerHTML = "<strong>Compatible accessories:</strong>";
            card.appendChild(accessoriesLabel);

            const accessoryList = document.createElement("ul");
            accessoryList.className = "weapon-accessories";
            weapon.accessories.forEach(item => {
              const li = document.createElement("li");
              li.textContent = item;
              accessoryList.appendChild(li);
            });
            card.appendChild(accessoryList);
          }

          // Magazines
          if (weapon.magazines && weapon.magazines.length) {
            const magLabel = document.createElement("div");
            magLabel.className = "mag-label";
            magLabel.textContent = "Magazine:";
            card.appendChild(magLabel);

            const magRow = document.createElement("div");
            magRow.className = "weapon-magazines";
            weapon.magazines.forEach(mag => {
              const magBlock = document.createElement("div");
              magBlock.className = "mag-block";

              const magImg = document.createElement("img");
              magImg.src = `images/weapons/${mag.image}`;
              magImg.alt = mag.name;
              magBlock.appendChild(magImg);

              const magName = document.createElement("div");
              magName.className = "mag-name";
              magName.textContent = mag.name;
              magBlock.appendChild(magName);

              magRow.appendChild(magBlock);
            });
            card.appendChild(magRow);
          }

          container.appendChild(card);
        });
      };

      renderSection(firearms, "weapons-row-main", "Firearms");
      renderSection(melee, "weapons-row-melee", "Melee");
    });
});
