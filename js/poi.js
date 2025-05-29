document.addEventListener('DOMContentLoaded', () => {
  fetch('data/poi.json')
    .then(res => res.json())
    .then(pois => {
      const poiContainer = document.getElementById('poi-row');

      pois.forEach(poi => {
        const card = document.createElement('div');
        card.className = 'armor-card';

        const img = document.createElement('img');
        img.className = 'armor-img';
        img.src = `images/${poi.images[0]}`;
        img.alt = poi.name;

        const details = document.createElement('div');
        details.className = 'armor-details';

        const nameEl = document.createElement('h2');
        nameEl.textContent = poi.name;

        const notesEl = document.createElement('p');
        notesEl.textContent = poi.notes;

        details.appendChild(nameEl);
        details.appendChild(notesEl);

        card.appendChild(img);
        card.appendChild(details);
        poiContainer.appendChild(card);
      });
    });
});
