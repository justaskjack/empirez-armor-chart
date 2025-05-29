document.addEventListener('DOMContentLoaded', () => {
  fetch('data/poi.json')
    .then(res => res.json())
    .then(pois => {
      const container = document.getElementById('poi-row');

      pois.forEach((poi, index) => {
        const card = document.createElement('div');
        card.className = 'armor-card';

        const img = document.createElement('img');
        img.src = `images/${poi.gallery[0]}`;
        img.alt = poi.name;
        img.className = 'armor-img';
        img.dataset.index = index;

        const details = document.createElement('div');
        details.className = 'armor-details';

        const name = document.createElement('h2');
        name.textContent = poi.name;

        const notes = document.createElement('p');
        notes.textContent = poi.notes;

        details.appendChild(name);
        details.appendChild(notes);
        card.appendChild(img);
        card.appendChild(details);

        // Add gallery click event
        img.addEventListener('click', () => {
          openGallery(poi.gallery, 0);
        });

        container.appendChild(card);
      });
    });
});
