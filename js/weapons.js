document.addEventListener("DOMContentLoaded", () => {
  fetch("data/weapons.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("weapons-row");

      const firearms = data.filter(weapon => weapon.type === "Firearm");
      const melee = data.filter(weapon => weapon.type === "Melee");

      const createSection = (title, list) => {
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = title;
        sectionTitle.classList.add("armor-section-title");
        container.appendChild(sectionTitle);

        const section = document.createElement("div");
        section.className = "armor-section";
        list.forEach(weapon => {
          const card = document.createElement("div");
          card.className = "armor-card";

          const topRow = document.createElement("div");
          topRow.className = "armor-card-toprow";
          topRow.innerHTML = `<span><strong>Name:</strong> ${weapon.name}</span><span><strong>Ammo type:</strong> ${weapon.ammo}</span>`;
          card.appendChild(topRow);

          const thumb = document.createElement("img");
          const thumbPath = `images/weapons/${weapon.image.replace('.png', ' - thumb.png')}`;
          const fullSize = `images/weapons/${weapon.image}`;

          thumb.src = thumbPath;
          thumb.alt = weapon.name;
          thumb.className = "armor-thumb";
          thumb.addEventListener("click", () => {
            const instance = lightGallery(document.createElement("div"), {
              dynamic: true,
              dynamicEl: [{ src: fullSize }]
            });
            instance.openGallery();
          });
          card.appendChild(thumb);

          const slots = document.createElement("div");
          slots.className = "bp-slots";
          weapon.slots.forEach(slot => {
            const slotImg = document.createElement("img");
            slotImg.src = `images/bps/${slot}`;
            slotImg.alt = "Slot";
            slots.appendChild(slotImg);
          });
          card.appendChild(slots);

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

          const magLabel = document.createElement("div");
          magLabel.innerHTML = "<strong>Magazine:</strong>";
          card.appendChild(magLabel);

          const magRow = document.createElement("div");
          magRow.className = "weapon-mags";
          weapon.magazines.forEach(mag => {
            const magThumb = document.createElement("img");
            magThumb.src = `images/weapons/${mag.image}`;
            magThumb.alt = mag.name;
            magRow.appendChild(magThumb);

            const magName = document.createElement("span");
            magName.textContent = mag.name;
            magRow.appendChild(magName);
          });
          card.appendChild(magRow);

          section.appendChild(card);
        });

        container.appendChild(section);
      };

      createSection("Firearms", firearms);
      createSection("Melee", melee);
    });
});
