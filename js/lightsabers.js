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
        
        // Add darksaber shape if name matches
        if (saber.name.includes("Dark Sword")) {
          topBlade.className = 'blade darksaber-blade';
        } else {
          topBlade.className = 'blade';
        }

        if (saber.darksaber) {
          topBlade.classList.add('darksaber-blade');
        }


        topBlade.style.backgroundColor = saber.bladeColor || '#0ff';
        topBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');
        if (saber.offsetY) topBlade.style.bottom = saber.offsetY;
        if (saber.offsetX) topBlade.style.left = saber.offsetX;
        if (saber.bladeZIndex) topBlade.style.zIndex = saber.bladeZIndex;
        blades.push(topBlade);

        if (saber.bladeRotation) {
          topBlade.style.setProperty('--blade-rotation', saber.bladeRotation);
          topBlade.classList.add('rotated');
        }

        if (saber.bladeAngle) {
          topBlade.style.setProperty('--blade-angle', saber.bladeAngle);
          topBlade.classList.add('angled');
        }

        if (saber.crossguard) {
          const leftBlade = document.createElement('div');
          leftBlade.className = 'blade crossguard-blade left-blade';
          leftBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          leftBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');
          blades.push(leftBlade);
        
          const rightBlade = document.createElement('div');
          rightBlade.className = 'blade crossguard-blade right-blade';
          rightBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          rightBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');
          blades.push(rightBlade);
        }


        let bottomBlade = null;

        // === Bottom Blade (for double sabers) ===
        if (saber.doubleBlade) {
          bottomBlade = document.createElement('div');
          bottomBlade.className = 'blade bottom-blade';
          bottomBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          bottomBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');  // ✅ FIXED

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

          // === Custom Image Blades (Optional) ===
          if (saber.customBladeTop) {
            topBlade.style.display = 'none'; // Disable default blade
            const topImgBlade = document.createElement('img');
            topImgBlade.src = `images/${saber.customBladeTop}`;
            topImgBlade.className = 'custom-blade top';
          
            // Apply optional offsets
            if (saber.customTopOffsetX) topImgBlade.style.left = saber.customTopOffsetX;
            if (saber.customTopOffsetY) topImgBlade.style.bottom = saber.customTopOffsetY;
          
            blades.push(topImgBlade);
          }
          
          if (saber.customBladeBottom) {
            if (bottomBlade) bottomBlade.style.display = 'none'; // Disable default double blade
            const bottomImgBlade = document.createElement('img');
            bottomImgBlade.src = `images/${saber.customBladeBottom}`;
            bottomImgBlade.className = 'custom-blade bottom';
          
            // Apply optional offsets
            if (saber.customBottomOffsetX) bottomImgBlade.style.left = saber.customBottomOffsetX;
            if (saber.customBottomOffsetY) bottomImgBlade.style.top = saber.customBottomOffsetY;
          
            blades.push(bottomImgBlade);
          }

        
        // ✅ Now actually add them to the DOM
        blades.forEach(b => cardWrapper.appendChild(b));

        
        cardWrapper.appendChild(img);
        card.appendChild(cardWrapper);
        saberContainer.appendChild(card);
      });
    });
});
