fetch('js/weapons.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('weapons-row');

    const createSection = (title, items) => {
      const section = document.createElement('div');
      section.className = 'weapon-section';

      const heading = document.createElement('h2');
      heading.textContent = title;
      section.appendChild(heading);

      const row = document.createElement('div');
      row.className = 'weapon-row';

      items.forEach(weapon => {
        const card = document.createElement('div');
        card.className = 'weapon-card';

        const header = document.createElement('div');
        header.className = 'weapon-header';
        header.innerHTML = `<strong>Name:</strong> ${weapon.name} <span class="ammo-type">Ammo type:</span> ${weapon.ammo}`;
        card.appendChild(header);

        const thumbLink = document.createElement('a');
        thumbLink.href = weapon.image;
        thumbLink.setAttribute('data-lg-size', '1400-900');
        thumbLink.setAttribute('data-lg-src', weapon.image);
        thumbLink.className = 'weapon-thumb';
        const img = document.createElement('img');
        img.src = weapon.image;
        thumbLink.appendChild(img);
        card.appendChild(thumbLink);

        const slotsRow = document.createElement('div');
        slotsRow.className = 'weapon-slots';
        weapon.slots.forEach(slot => {
          const slotImg = document.createElement('img');
          slotImg.src = `images/icons/${slot}`;
          slotImg.alt = '';
          slotsRow.appendChild(slotImg);
        });
        card.appendChild(slotsRow);

        const accText = document.createElement('div');
        accText.className = 'weapon-accessories';
        accText.innerHTML = `<strong>Compatible accessories:</strong><ul>${weapon.accessories.map(acc => `<li>${acc}</li>`).join('')}</ul>`;
        card.appendChild(accText);

        const magWrap = document.createElement('div');
        magWrap.className = 'weapon-magazines';
        weapon.magazines.forEach(mag => {
          const magBlock = document.createElement('div');
          magBlock.className = 'mag-block';
          const magImg = document.createElement('img');
          magImg.src = mag.image;
          const magName = document.createElement('div');
          magName.className = 'mag-name';
          magName.textContent = mag.name;
          magBlock.appendChild(magImg);
          magBlock.appendChild(magName);
          magWrap.appendChild(magBlock);
        });
        if (weapon.magazines.length > 0) {
          const label = document.createElement('div');
          label.className = 'mag-label';
          label.textContent = 'Magazine:';
          card.appendChild(label);
          card.appendChild(magWrap);
        }

        row.appendChild(card);
      });

      section.appendChild(row);
      container.appendChild(section);
    };

    createSection("Firearms", data.firearms);
    createSection("Melee", data.melee);
  });
