const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Relic", "None"];
let allData = [];

fetch('data/armor.json')
  .then(res => res.json())
  .then(data => {
    allData = data;
    renderSections(allData);
  });

function renderSections(data) {
  const container = document.getElementById('armor-sections');
  container.innerHTML = '';

  rarityOrder.forEach(rarity => {
    const filteredCards = data.filter(item => item.rarity === rarity);
    if (filteredCards.length === 0) return;

    const section = document.createElement('section');
    section.className = `armor-section bar-${rarity}`;
    section.dataset.rarity = rarity;

    const toggle = document.createElement('button');
    toggle.innerHTML = '&#8722;';
    toggle.className = 'section-toggle';
    
    toggle.onclick = () => {
      const isHidden = grid.style.display === 'none';
      toggle.innerHTML = isHidden ? '&#8722;' : '+';
      grid.classList.toggle('collapsed');
    };

    const grid = document.createElement('div');
    grid.className = 'armor-grid';

    let cards = filteredCards;

    cards.forEach(armor => {
      const card = document.createElement('div');
      card.className = 'armor-card';

      card.innerHTML = `
        <a href="images/${armor.image}" data-lightbox="armor" data-title="${armor.name} - ${armor.type}">
          <img src="images/${armor.image}" alt="${armor.name}" class="armor-img" />
        </a>
        <div class="armor-details">
          <h2>${armor.name}</h2>
          <p><strong>Type:</strong> ${armor.type}</p>
          <p><strong>Protection Level:</strong> ${armor.protection}</p>
          <p><strong>Rarity:</strong> <span class="rarity-value-${armor.rarity}">${armor.rarity}</span></p>
          <p><strong>Location:</strong> ${armor.location}</p>
        </div>
      `;
      grid.appendChild(card);
    });

    section.appendChild(toggle);
    section.appendChild(grid);
    container.appendChild(section);
  });
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('rarityFilter').addEventListener('change', applyFilters);
document.getElementById('sortOption').addEventListener('change', applyFilters);

function applyFilters() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const rarity = document.getElementById('rarityFilter').value;
  const sortOption = document.getElementById('sortOption').value;

  let filtered = allData.filter(a => (
    (!rarity || a.rarity === rarity) &&
    (
      a.name.toLowerCase().includes(search) ||
      a.type.toLowerCase().includes(search) ||
      a.location.toLowerCase().includes(search)
    )
  ));

  if (sortOption === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortOption === 'name-desc') filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (sortOption === 'protection-asc') filtered.sort((a, b) => a.protection - b.protection);
  if (sortOption === 'protection-desc') filtered.sort((a, b) => b.protection - a.protection);

  renderSections(filtered);
}

const globalToggle = document.createElement('button');
globalToggle.textContent = 'Collapse All';
globalToggle.style = "margin-left: 1rem; padding: 0.5rem 1rem;";
let allCollapsed = false;

globalToggle.addEventListener('click', () => {
  const grids = document.querySelectorAll('.armor-grid');
  const toggles = document.querySelectorAll('.section-toggle');
  grids.forEach((grid, idx) => {
    grid.classList.toggle('collapsed', !allCollapsed);
    toggles[idx].innerHTML = !allCollapsed ? '+' : '&#8722;';
  });
  allCollapsed = !allCollapsed;
  globalToggle.textContent = allCollapsed ? 'Expand All' : 'Collapse All';
});

document.getElementById('controls').appendChild(globalToggle);

// =======================
// HELMS LOADING SECTION
// =======================
fetch('data/helms.json')
  .then(res => res.json())
  .then(helms => {
    const grid = document.getElementById('helmGrid');
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      grid.appendChild(cell);
    }

    helms.forEach(helm => {
      const anchor = document.createElement('a');
      anchor.href = `images/${helm.image}`;
      anchor.setAttribute('data-lightbox', 'helm');
      anchor.title = helm.name;
      anchor.style.gridColumn = helm.col;
      anchor.style.gridRow = helm.row;
      anchor.style.position = 'relative'; // required for dot positioning

      const img = document.createElement('img');
      img.src = `images/${helm.thumb}`;
      img.alt = helm.name;
      img.title = helm.name;
      img.className = 'helm-thumb';

      anchor.appendChild(img);

      if (helm.collected) {
        const dot = document.createElement('div');
        dot.className = 'collected-dot';
        anchor.appendChild(dot);
      }

      grid.appendChild(anchor);
    });
  });
