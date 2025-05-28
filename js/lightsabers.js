document.addEventListener('DOMContentLoaded', () => {
  fetch('lightsabers.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('lightsaber-container');

      data.forEach(saber => {
        const wrapper = document.createElement('div');
        wrapper.className = 'saber-wrapper';
        wrapper.title = saber.name;

        const saberDiv = document.createElement('div');
        saberDiv.className = 'saber';

        const hilt = document.createElement('img');
        hilt.src = saber.thumb;
        hilt.alt = saber.name;
        hilt.className = 'hilt';

        const blade = document.createElement('div');
        blade.className = 'blade';

        // Safe check for bladeColor
        const bladeColor = saber.bladeColor || '#0ff';
        blade.style.setProperty('--blade-color', bladeColor);
        blade.style.backgroundColor = bladeColor;

        // Create audio elements safely
        const soundOn = new Audio(saber.soundOn || 'Saber-on.wav');
        const soundOff = new Audio(saber.soundOff || 'Saber-off.wav');
        soundOn.volume = 0.7;
        soundOff.volume = 0.7;

        // Toggle behavior
        hilt.addEventListener('click', () => {
          const isActive = blade.classList.toggle('active');
          if (isActive) {
            soundOn.currentTime = 0;
            soundOn.play();
          } else {
            soundOff.currentTime = 0;
            soundOff.play();
          }
        });

        saberDiv.appendChild(blade);
        saberDiv.appendChild(hilt);
        wrapper.appendChild(saberDiv);
        container.appendChild(wrapper);
      });
    })
    .catch(error => {
      console.error('Failed to load lightsabers:', error);
    });
});
