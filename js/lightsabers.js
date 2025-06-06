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
        cardWrapper.setAttribute('data-tooltip', saber.name);

        const blades = [];

        let bladeVisible = false;

        // === Top Blade ===
        if (saber.customBladeTop) {
          const topImg = document.createElement('img');
          topImg.src = `images/${saber.customBladeTop}`;
          topImg.className = 'custom-blade top';
          topImg.style.display = 'none';
          blades.push(topImg);
        } else {
          const topBlade = document.createElement('div');
          topBlade.className = saber.darksaber || saber.name.includes("Dark Sword")
            ? 'blade darksaber-blade'
            : 'blade';

          topBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          topBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');

          if (saber.offsetY) topBlade.style.bottom = saber.offsetY;
          if (saber.offsetX) topBlade.style.left = saber.offsetX;
          if (saber.bladeZIndex) topBlade.style.zIndex = saber.bladeZIndex;

          if (saber.bladeRotation) {
            topBlade.style.setProperty('--blade-rotation', saber.bladeRotation);
            topBlade.classList.add('rotated');
          }

          if (saber.bladeAngle) {
            topBlade.style.setProperty('--blade-angle', saber.bladeAngle);
            topBlade.classList.add('angled');
          }

          blades.push(topBlade);

          if (saber.crossguard) {
            const leftBlade = document.createElement('div');
            leftBlade.className = 'blade crossguard-blade left-blade';
            leftBlade.style.backgroundColor = saber.bladeColor || '#0ff';
            leftBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');

            const rightBlade = document.createElement('div');
            rightBlade.className = 'blade crossguard-blade right-blade';
            rightBlade.style.backgroundColor = saber.bladeColor || '#0ff';
            rightBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');

            blades.push(leftBlade, rightBlade);
          }
        }

        // === Bottom Blade ===
        if (saber.customBladeBottom) {
          const bottomImg = document.createElement('img');
          bottomImg.src = `images/${saber.customBladeBottom}`;
          bottomImg.className = 'custom-blade bottom';
          bottomImg.style.display = 'none';
          blades.push(bottomImg);
        } else if (saber.doubleBlade) {
          const bottomBlade = document.createElement('div');
          bottomBlade.className = 'blade bottom-blade';
          bottomBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          bottomBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');

          if (saber.bottomOffsetX) bottomBlade.style.left = saber.bottomOffsetX;
          else if (saber.offsetX) bottomBlade.style.left = saber.offsetX;

          if (saber.bottomOffsetY) bottomBlade.style.top = saber.bottomOffsetY;
          else bottomBlade.style.top = '100%';

          if (saber.bladeZIndex) bottomBlade.style.zIndex = saber.bladeZIndex;

          blades.push(bottomBlade);
        }

        // === Hilt ===
        const img = document.createElement('img');
        img.src = `images/${saber.thumb}`;
        img.alt = saber.name;
        img.className = 'saber-img';

        if (saber.hiltOffsetY) {
          img.style.transform = `translateY(${saber.hiltOffsetY})`;
        }

        // === Click to Toggle Blades + Play Sound ===
        cardWrapper.addEventListener('click', () => {
          bladeVisible = !bladeVisible;

          blades.forEach(b => {
            if (b.tagName === 'IMG') {
              b.style.display = bladeVisible ? 'block' : 'none';
            } else {
              b.classList.toggle('active', bladeVisible);
            }
          });

          const sound = new Audio(`sounds/${bladeVisible ? saber.soundOn : saber.soundOff}`);
          sound.volume = 0.5;
          sound.play();
        });

        // === Assemble DOM ===
        blades.forEach(b => cardWrapper.appendChild(b));
        cardWrapper.appendChild(img);
        card.appendChild(cardWrapper);
        saberContainer.appendChild(card);
      });
    });
});
