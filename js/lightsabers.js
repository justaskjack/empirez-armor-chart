document.addEventListener('DOMContentLoaded', () => {
  fetch('data/lightsabers.json')
    .then(res => res.json())
    .then(sabers => {
      const saberContainer = document.getElementById('saber-row');

      sabers.forEach((saber) => {
        const card = document.createElement('div');
        card.className = 'saber-card';

        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'saber-wrapper';
        cardWrapper.setAttribute('data-tooltip', saber.name);

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

        // === Bottom Blade (for doubleBlade sabers only) ===
        let bottomBlade = null;
        if (saber.doubleBlade) {
          bottomBlade = document.createElement('div');
          bottomBlade.className = 'blade bottom-blade';
          bottomBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          bottomBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');
          bottomBlade.style.left = saber.offsetX || '0px';
          if (saber.bladeZIndex) bottomBlade.style.zIndex = saber.bladeZIndex;

          // Temporarily set top to 0 until image loads
          bottomBlade.style.top = '0px';
          blades.push(bottomBlade);
        }

        const img = document.createElement('img');
        img.src = `images/${saber.thumb}`;
        img.alt = saber.name;
        img.className = 'saber-img';

        // Optionally shift the hilt image
        if (saber.hiltOffsetY) {
          img.style.transform = `translateY(${saber.hiltOffsetY})`;
        }

        // Align bottom blade after image loads
        img.onload = () => {
          if (saber.doubleBlade && bottomBlade) {
            const imageBottom = img.offsetTop + img.offsetHeight;
            bottomBlade.style.top = `${imageBottom}px`;
          }
        };

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
