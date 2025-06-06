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

        // === Top Blade ===
        let topBlade;
        if (saber.name === "Lyss' Darksaber") {
          topBlade = document.createElement('img');
          topBlade.src = 'images/Lightsaber 18-b.png';
          topBlade.className = 'custom-blade top';
        } else {
          topBlade = document.createElement('div');
          topBlade.className = 'blade';
          topBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          topBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');

          if (saber.bladeRotation) {
            topBlade.style.setProperty('--blade-rotation', saber.bladeRotation);
            topBlade.classList.add('rotated');
          }
          if (saber.bladeAngle) {
            topBlade.style.setProperty('--blade-angle', saber.bladeAngle);
            topBlade.classList.add('angled');
          }
        }
        blades.push(topBlade);

        // === Crossguard ===
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

        // === Bottom Blade ===
        let bottomBlade;
        if (saber.name === "Lyss' Darksaber") {
          bottomBlade = document.createElement('img');
          bottomBlade.src = 'images/Lightsaber 18-c.png';
          bottomBlade.className = 'custom-blade bottom';
          blades.push(bottomBlade);
        } else if (saber.doubleBlade) {
          bottomBlade = document.createElement('div');
          bottomBlade.className = 'blade bottom-blade';
          bottomBlade.style.backgroundColor = saber.bladeColor || '#0ff';
          bottomBlade.style.setProperty('--blade-color', saber.bladeColor || '#0ff');

          blades.push(bottomBlade);
        }

        const img = document.createElement('img');
        img.src = `images/${saber.thumb}`;
        img.alt = saber.name;
        img.className = 'saber-img';

        if (saber.hiltOffsetY) {
          img.style.transform = `translateY(${saber.hiltOffsetY})`;
        }

        let bladeVisible = false;

        cardWrapper.addEventListener('click', () => {
          bladeVisible = !bladeVisible;
          blades.forEach(b => {
            b.classList.toggle('active', bladeVisible);
          });

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
