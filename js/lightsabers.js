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

        const blade = document.createElement('div');

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
        
        if (saber.doubleBlade) {
          const bottomBlade = document.createElement('div');
          bottomBlade.className = 'blade bottom-blade';
          bottomBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          bottomBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff';
        
          // Blade grows downward from hilt
          bottomBlade.style.top = '100%'; // align with bottom of hilt
          bottomBlade.style.bottom = 'auto'; // prevent interference
          bottomBlade.style.transform = 'scaleY(1)';
          bottomBlade.style.transformOrigin = 'top';
        
          if (saber.offsetX) bottomBlade.style.left = saber.offsetX;
          if (saber.bladeZIndex) bottomBlade.style.zIndex = saber.bladeZIndex;
        
          blades.push(bottomBlade);
        }


        blade.className = 'blade';
        
        // Set both the background color and CSS variable
        blade.style.backgroundColor = saber.bladeColor || '#0ff';
        blade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');

        if (saber.offsetX) blade.style.left = saber.offsetX;
        // if (saber.offsetY) blade.style.bottom = `calc(100% + ${saber.offsetY})`;
        if (saber.bladeZIndex) blade.style.zIndex = saber.bladeZIndex;

        // Optional horizontal position offset
        if (saber.offsetX) {
          blade.style.left = saber.offsetX;
        }
        // if (saber.offsetY) {
        //   blade.style.top = saber.offsetY;
        // }
        if (saber.bladeZIndex) {
        blade.style.zIndex = saber.bladeZIndex;
        }
        
        const img = document.createElement('img');
        img.src = `images/${saber.thumb}`;
        img.alt = saber.name;
        img.className = 'saber-img';

        // Apply vertical offset to blade starting point (Y), so it dips into the hilt
        if (saber.offsetY) {
          blade.style.bottom = saber.offsetY;
        }
        
        // Optionally also shift the hilt image visually if needed
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
