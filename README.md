# 🛒 Product Store — Frontend

A responsive two-page frontend for the Product Store, built with **vanilla HTML, CSS, and JavaScript**.

> 🔗 Backend Repo: https://github.com/YOUR_USERNAME/product-store-backend

---

## 👥 Team
| Name | Role |
|------|------|
|Biswajit Moharana| Backend Development |
|Subh Sharma| Frontend Development |

---

## 🛠️ Tech Stack
- **HTML5** — Semantic page structure
- **CSS3** — Styling and responsive design
- **JavaScript (ES6+)** — DOM manipulation and API integration
- **Google Fonts** — Bebas Neue + DM Sans typography

---

## ⚙️ Setup & Installation

### Prerequisites
- The **backend must be running** before opening the frontend
- Follow the backend setup guide here: https://github.com/YOUR_USERNAME/product-store-backend
- **VS Code** with the **Live Server** extension installed

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/product-store-frontend.git
cd product-store-frontend
```

### 2. ⚠️ Make sure backend is running FIRST
> The backend **must be running before** you open the frontend. Without it, the site will show a "Could not connect" error.

**Every time you want to use the app:**

**Terminal 1 — Start Backend:**
```bash
cd backend
python app.py
```
Keep this terminal open! ✅

**Then — Start Frontend:**
- Open `index.html` in VS Code
- Click **Go Live** (bottom right corner)

```
❌ Wrong order = "Could not connect to backend" error
✅ Right order = Backend running first, then open frontend
```

> 💡 It's like turning on the electricity before switching on the lights — backend powers everything.

### 3. Open with Live Server
- Open the project folder in VS Code
- Right-click `index.html` → **Open with Live Server**
- The site opens at: **http://127.0.0.1:5500/index.html**

---

## 📄 Pages

### 🏠 Home Page (`index.html`)
- Navbar with links to Home and Add Product
- Fetches all products from the backend API on page load
- Displays products as cards using **DOM manipulation**
- Each card shows: product image, category badge, name, description, price, stock
- **Live search** — filters products by name and description as you type
- **Category filter** — dropdown to filter by category
- Product count updates dynamically
- Error state shown if backend is unreachable (with retry button)
- Loading spinner while fetching data

### ➕ Add Product Page (`add-product.html`)
- Form with fields: Name, Price, Stock, Category, Description, Image URL
- **Client-side validation** before sending to API
- Calls `POST /products` with JSON body on submit
- Displays backend validation errors field-by-field in red
- Success message with link back to home after adding
- Loading spinner on submit button while request is in progress
- Character counter for description field (max 500)

---

## 📁 Project Structure
```
product-store-frontend/
├── index.html          ← Home page
├── add-product.html    ← Add Product page
├── style.css           ← Shared styles for both pages
├── app.js              ← JavaScript for home page
├── add-product.js      ← JavaScript for add product page
└── README.md           ← This file
```

---

## 🔌 API Integration
The frontend communicates with the Flask backend at `http://localhost:5001`.

| Action | Method | Endpoint |
|--------|--------|----------|
| Load all products | GET | `/products` |
| Add a product | POST | `/products` |

To change the backend URL, update this line in both `app.js` and `add-product.js`:
```javascript
const API_BASE = "http://localhost:5001";
```

---

## 🎨 Design Features
- Dark theme with electric yellow-green accent color
- Bebas Neue display font for headings
- Animated product cards with hover effects
- Product images with zoom-on-hover effect
- Responsive mobile layout with hamburger menu
- Staggered card entrance animations
- Color-coded stock badges (normal / low / out of stock)
