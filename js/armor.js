const rarityOrder = [
  "Common", "Uncommon", "Rare", "Epic",
  "Legendary", "Mythic", "Relic", "None"
];

fetch('data/armor.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('armor-sections');

    rarityOrder.forEach(rarity => {
      const section = document.createElement('section');
      section.className = `armor-section bar-${rarity}`;

      const grid = document.createElement('div');
      grid.className = 'armor-grid';

      let cards = data.filter(a => a.rarity === rarity);

      if (rarity === 'Rare') {
        while (cards.length < 6) {
          cards.push(...cards.slice(0, Math.min(cards.length, 6 - cards.length)));
        }
      } else {
        cards = cards.slice(0, 1);
        while (cards.length < 3) {
          cards.push(...cards.slice(0, 3 - cards.length));
        }
      }

      cards.forEach(armor => {
        const card = document.createElement('div');
        card.className = 'armor-card';

        card.innerHTML = `
          <a href="images/${armor.image}" data-lightbox="armor" data-title="${armor.name} - ${armor.type}">
            <img src="images/${armor.image}" alt="${armor.name}" class="armor-img" />
          </a>
          <div class="armor-details">
            <h2>${armor.name}</h2>
            <p><strong>Type:</strong> ${armor.type}</p>
            <p><strong>Protection Level:</strong> ${armor.protection}</p>
            <p><strong>Rarity:</strong> <span class="rarity-value-${armor.rarity}">${armor.rarity}</span></p>
            <p><strong>Location:</strong> ${armor.location}</p>
          </div>
        `;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  });
