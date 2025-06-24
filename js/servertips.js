fetch('data/servertips.json')
  .then(res => res.json())
  .then(tips => {
    const container = document.getElementById('tips-row');
    tips.forEach(tip => {
      const card = document.createElement('div');
      card.className = 'tip-card';

      const left = document.createElement('div');
      left.className = 'tip-text';
      const title = document.createElement('h2');
      title.textContent = tip.name;
      const notes = document.createElement('p');
      notes.innerHTML = `<strong>Notes:</strong> ${tip.notes}`;
      left.appendChild(title);
      left.appendChild(notes);

      const right = document.createElement('div');
      right.className = 'tip-gallery';

      tip.images.forEach((img, index) => {
        const a = document.createElement('a');
        if (img === 'Imperial Bunker Map Thumb.png') {
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('interactiveMapModal').style.display = 'flex';
          });
        } else {
          a.href = `images/servertips/${img}`;
          a.setAttribute('data-lightbox', tip.name);
          a.setAttribute('data-title', tip.name);
        }

        const i = document.createElement('img');
        i.src = `images/servertips/${img}`;
        i.alt = tip.name;
        i.className = 'tip-thumb';
        a.appendChild(i);
        right.appendChild(a);
      });

      card.appendChild(left);
      card.appendChild(right);
      container.appendChild(card);
    });
  });

// ========== INTERACTIVE MAP LOGIC ==========
const modal = document.getElementById('interactiveMapModal');
const closeMapBtn = document.getElementById('closeMapBtn');
closeMapBtn.addEventListener('click', () => modal.style.display = 'none');

const scrollArea = document.querySelector('.interactive-map-scroll');
let isDragging = false, startX, startY, scrollLeft, scrollTop;

scrollArea.addEventListener('mousedown', (e) => {
  isDragging = true;
  scrollArea.classList.add('dragging');
  startX = e.pageX - scrollArea.offsetLeft;
  startY = e.pageY - scrollArea.offsetTop;
  scrollLeft = scrollArea.scrollLeft;
  scrollTop = scrollArea.scrollTop;
});
scrollArea.addEventListener('mouseleave', () => {
  isDragging = false;
  scrollArea.classList.remove('dragging');
});
scrollArea.addEventListener('mouseup', () => {
  isDragging = false;
  scrollArea.classList.remove('dragging');
});
scrollArea.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - scrollArea.offsetLeft;
  const y = e.pageY - scrollArea.offsetTop;
  const walkX = (x - startX);
  const walkY = (y - startY);
  scrollArea.scrollLeft = scrollLeft - walkX;
  scrollArea.scrollTop = scrollTop - walkY;
});

// ========== ROOM AREA HIGHLIGHTS ==========
const rooms = [
  { coords: "195,1990,260,2055", screenshot: "IB Map 01.png" },
  { coords: "195,1905,260,1970", screenshot: "IB Map 02.png" }
];

const mapEl = document.getElementById("bunkerMapMap");
rooms.forEach((room, i) => {
  const area = document.createElement("area");
  area.shape = "rect";
  area.coords = room.coords;
  area.title = `Room ${i + 1}`;
  area.style.cursor = 'pointer';
  area.addEventListener('click', () => {
    window.open(`images/rooms/${room.screenshot}`, '_blank');
  });
  mapEl.appendChild(area);
});
