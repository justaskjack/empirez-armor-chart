document.addEventListener('DOMContentLoaded', () => {
  fetch('data/backpacks.json')
    .then(res => res.json())
    .then(backpacks => {
      const container = document.getElementById('backpack-row');

      backpacks.forEach((bp, index) => {
        const card = document.createElement('div');
        card.className = 'backpack-card';

        const galleryId = `bp-gallery-${index}`;
        const galleryWrapper = document.createElement('div');
        galleryWrapper.id = galleryId;
        galleryWrapper.className = 'lightgallery';

        const a = document.createElement('a');
        a.href = `images/backpacks/${bp.image}`;
        a.setAttribute('data-lg-size', '1406-1390');
        a.setAttribute('data-sub-html', `<h4>${bp.name}</h4><p>Slots: ${bp.slots}</p>`);

        const img = document.createElement('img');
        img.src = `images/backpacks/${bp.thumb}`;
        img.alt = bp.name;
        img.className = 'backpack-thumb';
        a.appendChild(img);
        galleryWrapper.appendChild(a);
        card.appendChild(galleryWrapper);

        lightGallery(galleryWrapper, {
          selector: 'a',
          plugins: [lgThumbnail],
          thumbnail: true,
          animateThumb: true,
          showThumbByDefault: false
        });

        const details = document.createElement('div');
        details.className = 'backpack-details';
        details.innerHTML = `
          <div class="bp-name"><strong>Name:</strong> ${bp.name}</div>
          <div class="bp-slots"><strong>Slots:</strong> ${bp.slots}</div>
        `;

        // Strap slot icons
        const strapRow = document.createElement('div');
        strapRow.className = 'strap-slot-row';
        (bp.strapSlots || []).forEach(icon => {
          const slotIcon = document.createElement('img');
          slotIcon.src = `images/backpacks/${icon}`;
          slotIcon.className = 'strap-slot-icon';
          strapRow.appendChild(slotIcon);
        });

        details.appendChild(strapRow);
        card.appendChild(details);
        container.appendChild(card);
      });
    });
});
