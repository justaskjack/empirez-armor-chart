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

        // Create a LightGallery container div
        const galleryWrapper = document.createElement('div');
        galleryWrapper.id = `lg-gallery-${index}`;
        galleryWrapper.className = 'lightgallery';
        card.appendChild(galleryWrapper);
        
        // Add all images to the gallery group
        base.gallery.forEach((img, i) => {
          const a = document.createElement('a');
          a.href = `images/bases/${img}`;
          a.setAttribute('data-lg-size', '1406-1390'); // example size
          a.setAttribute('data-sub-html', `<h4>${base.name}</h4><p>Image ${i + 1}</p>`);
        
          const thumb = document.createElement('img');
          thumb.src = `images/bases/${img}`;
          thumb.alt = `${base.name} ${i + 1}`;
          thumb.className = (i === 0) ? 'base-img' : 'hidden'; // show first, hide rest
        
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
        nameEl.innerHTML = `<strong>Name:</strong> ${base.name}`;
        text.appendChild(nameEl);

const costEl = document.createElement('div');
costEl.innerHTML = `<strong>Cost:</strong> ${base.cost}`;
costEl.style.marginTop = "16px"; // ← Add this line
text.appendChild(costEl);


        card.appendChild(text);
        baseContainer.appendChild(card);
      });
    });
});
