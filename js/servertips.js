fetch('data/servertips.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('tips-row');
    data.forEach(tip => {
      const card = document.createElement('div');
      card.className = 'poi-card wide-card';

      const left = document.createElement('div');
      left.className = 'poi-left';
      left.innerHTML = `
        <h2>${tip.name}</h2>
        <p><strong>Notes:</strong> ${tip.notes}</p>
      `;

      const right = document.createElement('div');
      right.className = 'poi-right';
      tip.gallery.forEach((imgSrc, index) => {
        const anchor = document.createElement('a');
        anchor.href = `images/${imgSrc}`;
        anchor.setAttribute('data-lightbox', `tip-${tip.name.replace(/\s+/g, '-')}`);
        anchor.setAttribute('data-title', tip.name);

        const img = document.createElement('img');
        img.src = `images/${imgSrc}`;
        img.alt = `${tip.name} screenshot ${index + 1}`;

        anchor.appendChild(img);
        right.appendChild(anchor);
      });

      card.appendChild(left);
      card.appendChild(right);
      container.appendChild(card);
    });
  });
