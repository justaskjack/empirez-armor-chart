// 2.1

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("collectable-row");
  if (!container) return;

  function addRow(label, value, parent) {
    const row = document.createElement("div");
    row.className = "collectable-data-row";

    const lab = document.createElement("span");
    lab.className = "collectable-label";
    lab.textContent = label;

    const val = document.createElement("span");
    val.className = "collectable-value";
    val.textContent = value == null || value === "" ? "—" : String(value);

    row.appendChild(lab);
    row.appendChild(val);
    parent.appendChild(row);
  }

    fetch("data/collectables.json")
    .then(res => res.json())
    .then(items => {
      container.innerHTML = "";
      items.forEach(item => {
        const glow = document.createElement("div");
        glow.className = "collectable-card-glow";

        const card = document.createElement("div");
        card.className = "collectable-card";
        if (item.collected) {
          card.classList.add("collectable-card--collected");
        }

        const thumbFrame = document.createElement("div");
        thumbFrame.className = "collectable-thumb-frame";

        const imageLink = document.createElement("a");
        imageLink.href = `images/${item.image}.png`;
        imageLink.setAttribute("data-lightbox", "collectables");
        imageLink.setAttribute("data-title", item.name);
        imageLink.className = "collectable-lightbox-link";

        const img = document.createElement("img");
        img.src = `images/${item.image} - thumb.png`;
        img.alt = item.name;
        img.className = "collectable-thumb";
        img.loading = "lazy";

        imageLink.appendChild(img);
        thumbFrame.appendChild(imageLink);

        const content = document.createElement("div");
        content.className = "collectable-content";

        const header = document.createElement("div");
        header.className = "collectable-header";

        const title = document.createElement("h3");
        title.className = "collectable-title";
        title.textContent = item.name;

        const status = document.createElement("span");
        status.className =
          "collectable-status " +
          (item.collected ? "collectable-status--collected" : "collectable-status--open");
        status.textContent = item.collected ? "COLLECTED" : "UNSCANNED";

        header.appendChild(title);
        header.appendChild(status);

        const rows = document.createElement("div");
        rows.className = "collectable-rows";

        addRow("SELL PRICE", item.sellPrice, rows);
        addRow("SLOTS", item.slots || "N/A", rows);
        addRow("NOTE", item.note || "", rows);

        content.appendChild(header);
        content.appendChild(rows);

        card.appendChild(thumbFrame);
        card.appendChild(content);
        glow.appendChild(card);
        container.appendChild(glow);
      });
    });
});
