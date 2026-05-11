// Market Prices page — 2.2
// Renders price tables grouped by category. JSON-driven via data/marketprices.json.

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("market-sections");
  if (!container) return;

  const searchInput = document.getElementById("marketSearchInput");
  const categorySelect = document.getElementById("marketCategoryFilter");
  const lastUpdatedEl = document.getElementById("marketLastUpdated");

  const DEFAULT_CURRENCY = "Credits";
  let currency = DEFAULT_CURRENCY;
  let allCategories = [];

  function normalize(value) {
    return (value == null ? "" : String(value)).toLowerCase();
  }

  function formatPrice(price) {
    if (price == null || price === "") return "—";
    const n = Number(price);
    if (!Number.isFinite(n)) return String(price);
    return n.toLocaleString("en-US") + " " + currency;
  }

  function buildSectionHeader(categoryName) {
    const header = document.createElement("div");
    header.className = "market-section-header";
    header.innerHTML = `
      <div class="market-section-accent" aria-hidden="true"></div>
      <div class="market-section-main">
        <span class="market-section-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
          </svg>
        </span>
        <span class="market-section-title"></span>
      </div>
      <div class="market-section-line" aria-hidden="true"></div>
    `;
    header.querySelector(".market-section-title").textContent = categoryName;
    return header;
  }

  function buildHeadRow() {
    const row = document.createElement("div");
    row.className = "market-row market-row--head";
    row.setAttribute("role", "row");
    row.innerHTML = `
      <div class="market-cell market-cell--name" role="columnheader">Item</div>
      <div class="market-cell market-cell--price" role="columnheader">Avg. Market Price</div>
      <div class="market-cell market-cell--notes" role="columnheader">Notes</div>
    `;
    return row;
  }

  function buildItemRow(item) {
    const row = document.createElement("div");
    row.className = "market-row";
    row.setAttribute("role", "row");

    const name = document.createElement("div");
    name.className = "market-cell market-cell--name";
    name.setAttribute("role", "cell");
    name.setAttribute("data-label", "Item");
    name.textContent = item.name || "—";

    const price = document.createElement("div");
    price.className = "market-cell market-cell--price";
    price.setAttribute("role", "cell");
    price.setAttribute("data-label", "Avg. Market Price");
    price.textContent = formatPrice(item.price);

    const notes = document.createElement("div");
    notes.className = "market-cell market-cell--notes";
    notes.setAttribute("role", "cell");
    notes.setAttribute("data-label", "Notes");
    const noteText = (item.notes == null || String(item.notes).trim() === "") ? "—" : String(item.notes);
    notes.textContent = noteText;
    if (noteText === "—") notes.classList.add("market-cell--empty");

    row.appendChild(name);
    row.appendChild(price);
    row.appendChild(notes);
    return row;
  }

  function buildSection(category) {
    const section = document.createElement("section");
    section.className = "market-section";
    section.dataset.category = category.category;

    section.appendChild(buildSectionHeader(category.category));

    const table = document.createElement("div");
    table.className = "market-table";
    table.setAttribute("role", "table");
    table.setAttribute("aria-label", category.category + " price list");

    table.appendChild(buildHeadRow());
    category.items.forEach(item => table.appendChild(buildItemRow(item)));

    section.appendChild(table);
    return section;
  }

  function buildEmptyState(message) {
    const empty = document.createElement("div");
    empty.className = "market-empty";
    empty.textContent = message;
    return empty;
  }

  function applyFilters() {
    const searchTerm = normalize(searchInput && searchInput.value);
    const selectedCategory = categorySelect ? categorySelect.value : "";

    const filtered = allCategories
      .filter(cat => !selectedCategory || cat.category === selectedCategory)
      .map(cat => ({
        category: cat.category,
        items: cat.items.filter(item => {
          if (!searchTerm) return true;
          const haystack =
            normalize(item.name) + " " +
            normalize(item.notes) + " " +
            normalize(cat.category);
          return haystack.includes(searchTerm);
        })
      }))
      .filter(cat => cat.items.length > 0);

    container.innerHTML = "";

    if (filtered.length === 0) {
      container.appendChild(
        buildEmptyState("No items match your filters. Try clearing the search or category.")
      );
      return;
    }

    filtered.forEach(cat => container.appendChild(buildSection(cat)));
  }

  function populateCategoryFilter() {
    if (!categorySelect) return;
    while (categorySelect.options.length > 1) categorySelect.remove(1);
    allCategories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.category;
      opt.textContent = cat.category;
      categorySelect.appendChild(opt);
    });
  }

  function setLastUpdated(value) {
    if (!lastUpdatedEl) return;
    if (value) {
      lastUpdatedEl.textContent = "Last updated: " + value;
      lastUpdatedEl.style.display = "";
    } else {
      lastUpdatedEl.style.display = "none";
    }
  }

  function normalizeData(raw) {
    if (Array.isArray(raw)) {
      return { currency: DEFAULT_CURRENCY, categories: raw, lastUpdated: "" };
    }
    if (raw && typeof raw === "object") {
      return {
        currency: raw.currency || DEFAULT_CURRENCY,
        categories: Array.isArray(raw.categories) ? raw.categories : [],
        lastUpdated: raw.lastUpdated || ""
      };
    }
    return { currency: DEFAULT_CURRENCY, categories: [], lastUpdated: "" };
  }

  fetch("data/marketprices.json")
    .then(res => res.json())
    .then(raw => {
      const data = normalizeData(raw);
      currency = data.currency;
      allCategories = data.categories.filter(c => c && Array.isArray(c.items));
      populateCategoryFilter();
      setLastUpdated(data.lastUpdated);
      applyFilters();
    })
    .catch(err => {
      console.error("Market Prices: failed to load data:", err);
      container.innerHTML = "";
      container.appendChild(
        buildEmptyState("Could not load market prices. Please try again later.")
      );
    });

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (categorySelect) categorySelect.addEventListener("change", applyFilters);
});
