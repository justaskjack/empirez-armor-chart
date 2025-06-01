document.addEventListener('DOMContentLoaded', () => {
  fetch('data/poi.json')
    .then(res => res.json())
    .then(pois => {
      const mainRow = document.getElementById('poi-row-main');
      const retiredRow = document.getElementById('poi-row-retired');

      // TEMP: All POIs go to "retired" row for now
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

          const thumbImg = document.createElement('img');
          thumbImg.src = `images/${img}`;
          thumbImg.alt = `${poi.name} ${i + 1}`;
          thumbImg.className = (i === 0) ? 'base-img' : 'hidden';

          a.appendChild(thumbImg);
          galleryWrapper.appendChild(a);
        });

        // Initialize lightGallery
        lightGallery(galleryWrapper, {
          selector: 'a',
          plugins: [window.lgThumbnail],
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

        // For now, everything goes to retired row
        retiredRow.appendChild(card);
      });
    });
});
