document.addEventListener('DOMContentLoaded', () => {
  fetch('data/bases.json')
    .then(res => res.json())
    .then(bases => {
      const baseContainer = document.getElementById('base-row');

      bases.forEach((base, index) => {
        const card = document.createElement('div');
        card.className = 'armor-card';

        // Lightbox group identifier
        const groupName = `base-${index}`;

        // Thumbnail from first gallery image
        const thumb = base.gallery[0];

        const galleryLinks = base.gallery.map((img, i) => {
          const a = document.createElement('a');
          a.href = `images/${img}`;
          a.setAttribute('data-lightbox', groupName);
          a.setAttribute('data-title', `${base.name} (${i + 1}/${base.gallery.length})`);
          if (i === 0) {
            const image = document.createElement('img');
            image.src = `images/${img}`;
            image.alt = base.name;
            image.className = 'armor-img';
            a.appendChild(image);
          }
          return a;
        });

        galleryLinks.forEach(link => card.appendChild(link));

        const text = document.createElement('div');
        text.className = 'armor-text';

        const nameEl = document.createElement('div');
        nameEl.innerHTML = `<strong>Name:</strong> ${base.name}`;
        text.appendChild(nameEl);

        const costEl = document.createElement('div');
        costEl.innerHTML = `<strong>Cost:</strong> ${base.cost}`;
        text.appendChild(costEl);

        card.appendChild(text);
        baseContainer.appendChild(card);
      });
    });
});
