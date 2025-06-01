document.addEventListener('DOMContentLoaded', () => {
  fetch('data/poi.json')
    .then(res => res.json())
    .then(pois => {
      const mainRow = document.getElementById('poi-row-main');
      const retiredRow = document.getElementById('poi-row-retired');

      pois.forEach((poi, index) => {
        const card = document.createElement('div');
        card.className = 'armor-card';

        // Gallery container
        const galleryWrapper = document.createElement('div');
        galleryWrapper.className = 'lightgallery';
        galleryWrapper.id = `lg-gallery-poi-${index}`;

        // First image is the visible thumbnail
        const thumbLink = document.createElement('a');
        thumbLink.href = `images/${poi.gallery[0]}`;
        thumbLink.setAttribute('data-lg-size', '1406-1390');
        thumbLink.setAttribute('data-sub-html', `<h4>${poi.name}</h4><p>${poi.notes}</p>`);

        const thumbImg = document.createElement('img');
        thumbImg.src = `images/${poi.gallery[0]}`;
        thumbImg.alt = poi.name;
        thumbImg.className = 'base-img';

        thumbLink.appendChild(thumbImg);
        galleryWrapper.appendChild(thumbLink);

        // Hidden images for lightGallery
        for (let i = 1; i < poi.gallery.length; i++) {
          const a = document.createElement('a');
          a.href = `images/${poi.gallery[i]}`;
          a.setAttribute('data-lg-size', '1406-1390');
          a.setAttribute('data-sub-html', `<h4>${poi.name}</h4><p>${poi.notes}</p>`);
          a.className = 'hidden';
          galleryWrapper.appendChild(a);
        }

        // Right-hand text block
        const text = document.createElement('div');
        text.className = 'armor-text';

        const nameEl = document.createElement('div');
        nameEl.innerHTML = `<strong>Name:</strong> ${poi.name}`;
        text.appendChild(nameEl);

        const notesEl = document.createElement('div');
        notesEl.innerHTML = `<strong>Notes:</strong> ${poi.notes}`;
        notesEl.style.marginTop = "16px";
        text.appendChild(notesEl);

        // Assemble card
        card.appendChild(galleryWrapper);
        card.appendChild(text);

        // For now, all go to retired section
        retiredRow.appendChild(card);

        // Initialize lightGallery
        lightGallery(galleryWrapper, {
          selector: 'a',
          plugins: [lgThumbnail],
          thumbnail: true,
          animateThumb: true,
          showThumbByDefault: true
        });
      });
    });
});
