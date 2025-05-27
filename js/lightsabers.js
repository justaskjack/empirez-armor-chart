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

        const blade = document.createElement('div');
        blade.className = 'blade';
        blade.style.backgroundColor = saber.bladeColor;

        const img = document.createElement('img');
        img.src = `images/${saber.thumb}`;
        img.alt = saber.name;
        img.className = 'saber-img';

        let bladeVisible = false;

        cardWrapper.addEventListener('click', () => {
          bladeVisible = !bladeVisible;
          blade.classList.toggle('active', bladeVisible);

          const sound = new Audio(`sounds/${bladeVisible ? saber.soundOn : saber.soundOff}`);
          sound.play();
        });

        cardWrapper.appendChild(blade);
        cardWrapper.appendChild(img);
        card.appendChild(cardWrapper);

        const label = document.createElement('div');
        label.className = 'saber-label';
        label.textContent = saber.name;
        card.appendChild(label);

        saberContainer.appendChild(card);
      });
    });
});
