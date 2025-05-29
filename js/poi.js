// poi.js
document.addEventListener('DOMContentLoaded', () => {
  fetch('data/poi.json')
    .then(res => res.json())
    .then(data => {
      const poiRow = document.getElementById('base-row'); // Same container ID as bases

      data.forEach(poi => {
        const card = document.createElement('div');
        card.className = 'armor-card';

        const details = document.createElement('div');
        details.className = 'armor-details';

        const title = document.createElement('h2');
        title.textContent = poi.name;

        const note = document.createElement('p');
        note.textContent = poi.notes;

        const galleryWrapper = document.createElement('div');
        galleryWrapper.className = 'poi-gallery';
        galleryWrapper.id = `gallery-${poi.name.replace(/\s+/g, '-')}`;

        // Add images to gallery
        poi.gallery.forEach(image => {
          const link = document.createElement('a');
          link.href = `images/${image}`;
          link.dataset.lightbox = `gallery-${poi.name}`;
          link.dataset.subHtml = `<h4>${poi.name}</h4>`;
          link.innerHTML = `<img src="images/${image}" style="max-width: 80px; border-radius: 4px; margin: 4px;" />`;
          galleryWrapper.appendChild(link);
        });

        details.appendChild(title);
        details.appendChild(note);
        details.appendChild(galleryWrapper);

        card.appendChild(details);
        poiRow.appendChild(card);

        // Initialize lightGallery
        lightGallery(galleryWrapper, {
          selector: 'a',
          thumbnail: true
        });
      });
    });
});
