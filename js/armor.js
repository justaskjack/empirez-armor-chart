fetch('data/armor.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('armor-container');

    data.forEach(armor => {
      const card = document.createElement('div');
      card.className = 'armor-card';
      card.innerHTML = `
        <img src="images/${armor.image}" alt="${armor.name}" />
        <h2>${armor.name}</h2>
        <p><strong>Type:</strong> ${armor.type}</p>
        <p><strong>Protection:</strong> ${armor.protection}</p>
        <p><strong>Rarity:</strong> ${armor.rarity}</p>
        <p><strong>Location:</strong> ${armor.location}</p>
      `;
      container.appendChild(card);
    });
  });