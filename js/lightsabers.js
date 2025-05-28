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
          blade.classList.toggle('active', bladeVisible);

          const sound = new Audio(`sounds/${bladeVisible ? saber.soundOn : saber.soundOff}`);
          sound.volume = 0.5;
          sound.play();
        });

        cardWrapper.appendChild(blade);
        cardWrapper.appendChild(img);
        card.appendChild(cardWrapper);
        saberContainer.appendChild(card);
      });
    });
});
