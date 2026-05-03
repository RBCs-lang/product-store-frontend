// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5001";

// ── State ─────────────────────────────────────────────────────────────────────
let allProducts = [];

// ── DOM References ────────────────────────────────────────────────────────────
const loadingEl   = document.getElementById("loading");
const errorEl     = document.getElementById("error-msg");
const emptyEl     = document.getElementById("empty-msg");
const gridEl      = document.getElementById("products-grid");
const countEl     = document.getElementById("product-count");
const searchInput = document.getElementById("search-input");
const filterEl    = document.getElementById("category-filter");
const hamburger   = document.getElementById("hamburger");
const navLinks    = document.querySelector(".nav-links");

// ── Navbar Hamburger ──────────────────────────────────────────────────────────
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// ── Fetch Products from Backend ───────────────────────────────────────────────
async function fetchProducts() {
  showState("loading");

  try {
    const response = await fetch(`${API_BASE}/products`);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    allProducts = data.products || [];

    countEl.textContent = allProducts.length;
    renderProducts(allProducts);

  } catch (err) {
    console.error("Failed to fetch products:", err);
    showState("error");
  }
}

// ── Render Products Grid ──────────────────────────────────────────────────────
function renderProducts(products) {
  // Clear previous cards
  gridEl.innerHTML = "";

  if (products.length === 0) {
    showState("empty");
    return;
  }

  showState("grid");

  const template = document.getElementById("card-template");

  products.forEach((product, index) => {
    // Clone template
    const card = template.content.cloneNode(true).querySelector(".product-card");

    // Set animation delay for staggered entrance
    card.style.animationDelay = `${index * 0.07}s`;

    // Populate card using DOM manipulation
    // Image
    const imgWrap = card.querySelector(".card-img-wrap");
    const img = card.querySelector(".card-img");
    if (product.image_url) {
      img.src = product.image_url;
      img.alt = product.name;
      imgWrap.classList.add("has-image");
      img.onerror = () => imgWrap.classList.remove("has-image"); // fallback if URL broken
    }

    card.querySelector(".card-category").textContent = product.category || "Uncategorised";
    card.querySelector(".card-name").textContent = product.name;
    card.querySelector(".card-desc").textContent = product.description || "No description available.";
    card.querySelector(".card-price").textContent = `₹${Number(product.price).toLocaleString("en-IN")}`;

    // Stock badge with colour coding
    const stockEl = card.querySelector(".card-stock");
    const stock = product.stock ?? 0;
    if (stock === 0) {
      stockEl.textContent = "Out of Stock";
      stockEl.classList.add("none");
    } else if (stock <= 5) {
      stockEl.textContent = `Only ${stock} left`;
      stockEl.classList.add("low");
    } else {
      stockEl.textContent = `${stock} in stock`;
    }

    gridEl.appendChild(card);
  });
}

// ── Show/Hide UI States ───────────────────────────────────────────────────────
function showState(state) {
  loadingEl.classList.add("hidden");
  errorEl.classList.add("hidden");
  emptyEl.classList.add("hidden");
  gridEl.classList.add("hidden");

  if (state === "loading") loadingEl.classList.remove("hidden");
  if (state === "error")   errorEl.classList.remove("hidden");
  if (state === "empty")   emptyEl.classList.remove("hidden");
  if (state === "grid")    gridEl.classList.remove("hidden");
}

// ── Live Search & Filter ──────────────────────────────────────────────────────
function applyFilters() {
  const query    = searchInput.value.toLowerCase().trim();
  const category = filterEl.value;

  const filtered = allProducts.filter(p => {
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      (p.description || "").toLowerCase().includes(query);

    const matchesCategory = !category || p.category === category;

    return matchesSearch && matchesCategory;
  });

  countEl.textContent = filtered.length;
  renderProducts(filtered);
}

searchInput.addEventListener("input", applyFilters);
filterEl.addEventListener("change", applyFilters);

// ── Init ──────────────────────────────────────────────────────────────────────
fetchProducts();
