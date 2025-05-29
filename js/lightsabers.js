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

        // === Top Blade ===
        const topBlade = document.createElement('div');
        topBlade.className = 'blade';
        topBlade.style.backgroundColor = saber.bladeColor || '#0ff';
        topBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');
        if (saber.offsetY) topBlade.style.bottom = saber.offsetY;
        if (saber.offsetX) topBlade.style.left = saber.offsetX;
        if (saber.bladeZIndex) topBlade.style.zIndex = saber.bladeZIndex;
        blades.push(topBlade);

        let bottomBlade = null;

        // === Bottom Blade (for double sabers) ===
        if (saber.doubleBlade) {
          bottomBlade = document.createElement('div');
          bottomBlade.className = 'blade bottom-blade';
          bottomBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          bottomBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff';

          // Apply bottom-specific offsets if present
          if (saber.bottomOffsetX) bottomBlade.style.left = saber.bottomOffsetX;
          else if (saber.offsetX) bottomBlade.style.left = saber.offsetX;

          if (saber.bottomOffsetY) bottomBlade.style.top = saber.bottomOffsetY;
          else bottomBlade.style.top = '100%'; // default fallback

          if (saber.bladeZIndex) bottomBlade.style.zIndex = saber.bladeZIndex;

          blades.push(bottomBlade);
        }

        const img = document.createElement('img');
        img.src = `images/${saber.thumb}`;
        img.alt = saber.name;
        img.className = 'saber-img';

        // Optionally offset the hilt image vertically
        if (saber.hiltOffsetY) {
          img.style.transform = `translateY(${saber.hiltOffsetY})`;
        }

        let bladeVisible = false;

        cardWrapper.addEventListener('click', () => {
          bladeVisible = !bladeVisible;
          blades.forEach(b => b.classList.toggle('active', bladeVisible));

          const sound = new Audio(`sounds/${bladeVisible ? saber.soundOn : saber.soundOff}`);
          sound.volume = 0.5;
          sound.play();
        });

        blades.forEach(b => cardWrapper.appendChild(b));
        cardWrapper.appendChild(img);
        card.appendChild(cardWrapper);
        saberContainer.appendChild(card);
      });
    });
});
