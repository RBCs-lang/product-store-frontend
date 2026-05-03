// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5001";

// ── DOM References ────────────────────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks  = document.querySelector(".nav-links");
const descArea  = document.getElementById("description");
const charCount = document.getElementById("char-count");

// ── Navbar Hamburger ──────────────────────────────────────────────────────────
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// ── Character Counter for Description ────────────────────────────────────────
descArea.addEventListener("input", () => {
  const len = descArea.value.length;
  charCount.textContent = `${len} / 500`;
  charCount.style.color = len > 450 ? "#ff5a5a" : "";
});

// ── Clear all field error states ──────────────────────────────────────────────
function clearErrors() {
  ["name", "price", "stock", "category", "description"].forEach(field => {
    document.getElementById(field).classList.remove("invalid");
    document.getElementById(`err-${field}`).textContent = "";
  });
  document.getElementById("form-error").classList.add("hidden");
  document.getElementById("form-success").classList.add("hidden");
}

// ── Client-side validation (mirrors backend rules) ────────────────────────────
function validateForm() {
  let isValid = true;

  const name        = document.getElementById("name").value.trim();
  const priceRaw    = document.getElementById("price").value.trim();
  const stockRaw    = document.getElementById("stock").value.trim();
  const category    = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();

  // Name
  if (!name) {
    setError("name", "Product name is required.");
    isValid = false;
  } else if (name.length < 2) {
    setError("name", "Name must be at least 2 characters.");
    isValid = false;
  } else if (name.length > 100) {
    setError("name", "Name must be under 100 characters.");
    isValid = false;
  }

  // Price
  const price = parseFloat(priceRaw);
  if (priceRaw === "") {
    setError("price", "Price is required.");
    isValid = false;
  } else if (isNaN(price) || price < 0) {
    setError("price", "Enter a valid non-negative price.");
    isValid = false;
  }

  // Stock
  const stock = parseInt(stockRaw, 10);
  if (stockRaw !== "" && (isNaN(stock) || stock < 0)) {
    setError("stock", "Stock must be a non-negative whole number.");
    isValid = false;
  }

  // Category
  if (!category) {
    setError("category", "Please select a category.");
    isValid = false;
  }

  // Description
  if (description.length > 500) {
    setError("description", "Description must be under 500 characters.");
    isValid = false;
  }

  return isValid;
}

function setError(field, message) {
  document.getElementById(field).classList.add("invalid");
  document.getElementById(`err-${field}`).textContent = message;
}

// ── Submit Product via POST API ───────────────────────────────────────────────
async function submitProduct() {
  clearErrors();

  if (!validateForm()) return;   // Stop if client-side validation fails

  const payload = {
    name:        document.getElementById("name").value.trim(),
    price:       parseFloat(document.getElementById("price").value),
    category:    document.getElementById("category").value,
    description: document.getElementById("description").value.trim(),
    stock:       parseInt(document.getElementById("stock").value || "0", 10),
    image_url:   document.getElementById("image_url").value.trim(),
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  const btn      = document.getElementById("submit-btn");
  const btnText  = document.getElementById("btn-text");
  const btnLoader = document.getElementById("btn-loader");

  btn.disabled = true;
  btnText.textContent = "Submitting…";
  btnLoader.classList.remove("hidden");

  try {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // ── Success ──────────────────────────────────────────────────────────
      document.getElementById("form-success").classList.remove("hidden");
      resetForm();
    } else if (response.status === 422 && data.errors) {
      // ── Backend Validation Errors ─────────────────────────────────────────
      Object.entries(data.errors).forEach(([field, msg]) => setError(field, msg));
    } else {
      // ── Generic Server Error ──────────────────────────────────────────────
      showFormError(data.error || "Something went wrong. Please try again.");
    }

  } catch (err) {
    console.error("Network error:", err);
    showFormError("Could not connect to the server. Make sure Flask is running on http://localhost:5000");
  } finally {
    btn.disabled = false;
    btnText.textContent = "Add Product";
    btnLoader.classList.add("hidden");
  }
}

function showFormError(message) {
  const el = document.getElementById("form-error");
  el.textContent = message;
  el.classList.remove("hidden");
}

function resetForm() {
  ["name", "price", "stock", "category", "description", "image_url"].forEach(id => {
    document.getElementById(id).value = id === "stock" ? "0" : "";
  });
  charCount.textContent = "0 / 500";
}
