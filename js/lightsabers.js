document.addEventListener('DOMContentLoaded', () => {
  fetch('data/lightsabers.json')
    .then(res => res.json())
    .then(sabers => {
      const saberContainer = document.getElementById('saber-row');

      sabers.forEach((saber, index) => {
        const card = document.createElement('div');
        card.className = 'saber-card';

        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'saber-wrapper';
        cardWrapper.setAttribute('data-tooltip', saber.name); // Tooltip on hover

        const blades = [];

        // === Top Blade (default) ===
        const topBlade = document.createElement('div');
        topBlade.className = 'blade';
        topBlade.style.backgroundColor = saber.bladeColor || '#0ff';
        topBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');
        if (saber.offsetY) topBlade.style.bottom = saber.offsetY;
        if (saber.offsetX) topBlade.style.left = saber.offsetX;
        if (saber.bladeZIndex) topBlade.style.zIndex = saber.bladeZIndex;
        blades.push(topBlade);

        // === Bottom Blade (for double sabers) ===
        let bottomBlade = null;
        if (saber.doubleBlade) {
          bottomBlade = document.createElement('div');
          bottomBlade.className = 'blade bottom-blade';
          bottomBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          bottomBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff';
          bottomBlade.style.left = saber.offsetX || '50%';
          bottomBlade.style.transform = 'scaleY(0) translateX(-50%)';
          bottomBlade.style.transformOrigin = 'top';
          bottomBlade.style.zIndex = saber.bladeZIndex || 2;
          bottomBlade.style.top = '100%'; // Will be adjusted after image loads
          blades.push(bottomBlade);
        }

        const img = document.createElement('img');
        img.src = `images/${saber.thumb}`;
        img.alt = saber.name;
        img.className = 'saber-img';

        // Position bottom blade based on actual hilt height after image loads
        img.onload = () => {
          if (saber.doubleBlade && bottomBlade) {
            const hiltHeight = img.offsetHeight;
            bottomBlade.style.top = `${hiltHeight}px`;
          }
        };

        // Optional vertical offset for blade or hilt
        if (saber.offsetY) topBlade.style.bottom = saber.offsetY;
        if (saber.hiltOffsetY) img.style.transform = `translateY(${saber.hiltOffsetY})`;

        let bladeVisible = false;

        cardWrapper.addEventListener('click', () => {
          bladeVisible = !bladeVisible;
          blades.forEach(b => b.classList.toggle('active', bladeVisible));

          const sound = new Audio(`sounds/${bladeVisible ? saber.soundOn : saber.soundOff}`);
          sound.volume = 0.5;
          sound.play();
        });

        // Create hilt wrapper and append image
        const hiltWrapper = document.createElement('div');
        hiltWrapper.className = 'hilt-wrapper';
        hiltWrapper.appendChild(img);

        // Append blades first, then hilt
        blades.forEach(b => cardWrapper.appendChild(b));
        cardWrapper.appendChild(hiltWrapper);
        card.appendChild(cardWrapper);
        saberContainer.appendChild(card);
      });
    });
});
