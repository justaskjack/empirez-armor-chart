document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("collectable-row");
  if (!container) return;

  fetch("data/collectables.json")
    .then(res => res.json())
    .then(items => {
      container.innerHTML = "";
      items.forEach(item => {
        const card = document.createElement("div");
        card.className = "armor-card";
        card.style.position = "relative"; // needed for dot

        const imageLink = document.createElement("a");
        imageLink.href = `images/${item.image}.png`;
        imageLink.setAttribute("data-lightbox", "collectables");
        imageLink.setAttribute("data-title", item.name);

        const img = document.createElement("img");
        img.src = `images/${item.image} - thumb.png`;
        img.alt = item.name;
        img.className = "armor-img";
        img.style.width = "313px";
        img.style.height = "313px";

        imageLink.appendChild(img);

        if (item.collected) {
          const dot = document.createElement("div");
          dot.className = "collected-dot";
          card.appendChild(dot);
        }

        const content = document.createElement("div");
        content.className = "armor-card-details";

        const name = document.createElement("p");
        name.innerHTML = `<strong>Name:</strong> ${item.name}`;

        const price = document.createElement("p");
        price.innerHTML = `<strong>Sell Price:</strong> ${item.sellPrice}`;

        const slots = document.createElement("p");
        slots.innerHTML = `<strong>Slots:</strong> ${item.slots || 'N/A'}`;

        const note = document.createElement("p");
        note.innerHTML = `<strong>Note:</strong> ${item.note || ''}`;

        content.appendChild(name);
        content.appendChild(price);
        content.appendChild(slots);
        content.appendChild(note);

        card.appendChild(imageLink);
        card.appendChild(content);
        container.appendChild(card);
      });
    });
});
