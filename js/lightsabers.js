document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('saber-carousel-stage');
  const prevBtn = document.getElementById('saber-prev');
  const nextBtn = document.getElementById('saber-next');
  const infoPanel = document.getElementById('saber-info-panel');
  if (!stage || !prevBtn || !nextBtn || !infoPanel) return;

  let activeIndex = 0;
  let ignitedIndex = -1;
  let saberNodes = [];
  let sabersData = [];
  let isAnimating = false;
  const ANIMATION_MS = 360;

  function circularDistance(from, to, len) {
    const raw = (to - from + len) % len;
    if (raw > len / 2) return raw - len;
    return raw;
  }

  function setNodeIgnited(node, ignited) {
    node.blades.forEach(b => b.classList.toggle('active', ignited));
    node.card.classList.toggle('saber-ignited', ignited);
  }

  function playSound(file) {
    if (!file) return;
    const sound = new Audio(`sounds/${file}`);
    sound.volume = 0.5;
    sound.play();
  }

  function updateInfoPanel(saber) {
    const extras = [];
    if (saber.doubleBlade) extras.push('Double-bladed');
    if (saber.crossguard) extras.push('Crossguard');
    if (saber.darksaber || saber.name.includes('Dark Sword')) extras.push('Darksaber profile');

    const metaHtml =
      extras.length > 0
        ? `<div class="saber-info-meta">${extras.map(e => `<span class="saber-info-pill">${e}</span>`).join('')}</div>`
        : '';

    infoPanel.innerHTML = `
      <div class="saber-info-inner">
        <div class="saber-info-title">${saber.name}</div>
        ${metaHtml}
      </div>
    `;
  }

  function updateStageGlow() {
    const saber = sabersData[activeIndex];
    stage.style.setProperty('--active-blade-color', saber?.bladeColor || '#00e8ff');
  }

  function updateCarousel() {
    const len = saberNodes.length;
    if (!len) return;

    saberNodes.forEach((node, i) => {
      const delta = circularDistance(activeIndex, i, len);
      const absDelta = Math.abs(delta);

      node.card.classList.remove(
        'is-active',
        'is-near-left',
        'is-near-right',
        'is-far-left',
        'is-far-right',
        'is-hidden'
      );

      if (delta === 0) node.card.classList.add('is-active');
      else if (delta === -1) node.card.classList.add('is-near-left');
      else if (delta === 1) node.card.classList.add('is-near-right');
      else if (delta === -2) node.card.classList.add('is-far-left');
      else if (delta === 2) node.card.classList.add('is-far-right');
      else node.card.classList.add('is-hidden');

      node.card.style.setProperty('--saber-order', String(100 - absDelta));
      node.card.setAttribute('aria-hidden', absDelta > 2 ? 'true' : 'false');
    });

    updateStageGlow();
    updateInfoPanel(sabersData[activeIndex]);
  }

  function setActive(nextIndex) {
    const len = saberNodes.length;
    if (!len || isAnimating) return;
    activeIndex = (nextIndex + len) % len;

    // Requirement: only one ignited saber and retract when switching active.
    if (ignitedIndex !== -1 && ignitedIndex !== activeIndex) {
      setNodeIgnited(saberNodes[ignitedIndex], false);
      playSound(sabersData[ignitedIndex].soundOff);
      ignitedIndex = -1;
    }

    isAnimating = true;
    updateCarousel();
    window.setTimeout(() => {
      isAnimating = false;
    }, ANIMATION_MS);
  }

  function igniteOrRetractActive() {
    const node = saberNodes[activeIndex];
    const saber = sabersData[activeIndex];
    if (!node || !saber) return;

    if (ignitedIndex === activeIndex) {
      setNodeIgnited(node, false);
      playSound(saber.soundOff);
      ignitedIndex = -1;
      return;
    }

    if (ignitedIndex !== -1) {
      setNodeIgnited(saberNodes[ignitedIndex], false);
      playSound(sabersData[ignitedIndex].soundOff);
    }

    setNodeIgnited(node, true);
    playSound(saber.soundOn);
    ignitedIndex = activeIndex;
  }

  function createSaberNode(saber, index) {
    const card = document.createElement('div');
    card.className = 'saber-card';

    const wrapper = document.createElement('div');
    wrapper.className = 'saber-wrapper';
    wrapper.setAttribute('data-tooltip', saber.name);

    const blades = [];
    const topBlade = document.createElement('div');
    if (saber.name.includes('Dark Sword')) {
      topBlade.className = 'blade darksaber-blade';
    } else {
      topBlade.className = 'blade';
    }

    if (saber.darksaber) topBlade.classList.add('darksaber-blade');
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
    if (saber.doubleBlade) {
      bottomBlade = document.createElement('div');
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

    if (saber.customBladeTop) {
      topBlade.style.display = 'none';
      const topImgBlade = document.createElement('img');
      topImgBlade.src = `images/${saber.customBladeTop}`;
      topImgBlade.className = 'custom-blade top';
      if (saber.customTopOffsetX) topImgBlade.style.left = saber.customTopOffsetX;
      if (saber.customTopOffsetY) topImgBlade.style.bottom = saber.customTopOffsetY;
      blades.push(topImgBlade);
    }

    if (saber.customBladeBottom) {
      if (bottomBlade) bottomBlade.style.display = 'none';
      const bottomImgBlade = document.createElement('img');
      bottomImgBlade.src = `images/${saber.customBladeBottom}`;
      bottomImgBlade.className = 'custom-blade bottom';
      if (saber.customBottomOffsetX) bottomImgBlade.style.left = saber.customBottomOffsetX;
      if (saber.customBottomOffsetY) bottomImgBlade.style.top = saber.customBottomOffsetY;
      blades.push(bottomImgBlade);
    }

    const img = document.createElement('img');
    img.src = `images/${saber.thumb}`;
    img.alt = saber.name;
    img.className = 'saber-img';
    if (saber.hiltOffsetY) img.style.transform = `translateY(${saber.hiltOffsetY})`;

    blades.forEach(b => wrapper.appendChild(b));
    wrapper.appendChild(img);
    card.appendChild(wrapper);

    card.addEventListener('click', () => {
      if (activeIndex === index) {
        igniteOrRetractActive();
      } else {
        setActive(index);
      }
    });

    return { card, blades };
  }

  function bindControls() {
    prevBtn.addEventListener('click', () => setActive(activeIndex - 1));
    nextBtn.addEventListener('click', () => setActive(activeIndex + 1));

    stage.addEventListener('wheel', e => {
      e.preventDefault();
      if (e.deltaY > 0) setActive(activeIndex + 1);
      else setActive(activeIndex - 1);
    }, { passive: false });

    let touchStartX = 0;
    let touchEndX = 0;
    stage.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) < 30) return;
      if (diff < 0) setActive(activeIndex + 1);
      else setActive(activeIndex - 1);
    }, { passive: true });
  }

  fetch('data/lightsabers.json')
    .then(res => res.json())
    .then(sabers => {
      sabersData = sabers;
      stage.querySelectorAll('.saber-card').forEach(el => el.remove());
      saberNodes = sabers.map((saber, i) => {
        const node = createSaberNode(saber, i);
        stage.appendChild(node.card);
        return node;
      });

      bindControls();
      updateCarousel();
    });
});
