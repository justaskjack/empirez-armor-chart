document.addEventListener('DOMContentLoaded', () => {
  fetch('data/poi.json')
    .then(res => res.json())
    .then(pois => {
      const poiContainer = document.getElementById('poi-row');

      pois.forEach((poi, index) => {
        const card = document.createElement('div');
        card.className = 'armor-card';

        const groupName = `poi-${index}`;
        const thumb = poi.gallery[0];

        const galleryWrapper = document.createElement('div');
        galleryWrapper.id = `lg-gallery-poi-${index}`;
        galleryWrapper.className = 'lightgallery';
        card.appendChild(galleryWrapper);

        poi.gallery.forEach((img, i) => {
          const a = document.createElement('a');
          a.href = `images/${img}`;
          a.setAttribute('data-lg-size', '1406-1390');
          a.setAttribute('data-sub-html', `<h4>${poi.name}</h4><p>Image ${i + 1}</p>`);

          const thumb = document.createElement('img');
          thumb.src = `images/${img}`;
          thumb.alt = `${poi.name} ${i + 1}`;
          thumb.className = (i === 0) ? 'base-img' : 'hidden';

          a.appendChild(thumb);
          galleryWrapper.appendChild(a);
        });

        // Required for thumbnail plugin to work
        const lgThumbnail = window.lgThumbnail;

        // Initialize lightGallery
        lightGallery(galleryWrapper, {
          selector: 'a',
          plugins: [lgThumbnail],
          thumbnail: true,
          animateThumb: true,
          showThumbByDefault: true
        });

        const text = document.createElement('div');
        text.className = 'armor-text';

        const nameEl = document.createElement('div');
        nameEl.innerHTML = `<strong>Name:</strong> ${poi.name}`;
        text.appendChild(nameEl);

        const notesEl = document.createElement('div');
        notesEl.innerHTML = `<strong>Notes:</strong> ${poi.notes}`;
        notesEl.style.marginTop = "16px";
        text.appendChild(notesEl);

        card.appendChild(text);
        poiContainer.appendChild(card);
      });
    });
});
