# 🛍️ ShopEZ – Fashion & Tech E-commerce Application

Welcome to the **ShopEZ** repository — a full-stack MERN e-commerce application built using **MongoDB**, **Express.js**, **React**, and **Node.js**. ShopEZ is a multi-category online store featuring **Mobiles**, **Gadgets**, **Men's Wear**, and **Women's Wear**, complete with user authentication, cart management, checkout, order tracking, and an admin dashboard.

---

## 🛠️ Project Architecture & Design

Before development began, the project architecture, database models, and user workflows were established. Below is a summary of the technical design:

| Document | Description |
|---|---|
| **Technical Architecture** | MERN stack design — decoupled React client (`client/`) + Express API server (`server/`) |
| **ER Diagram** | 5 Mongoose collections: `users`, `products`, `carts`, `orders`, `admins` |
| **E-commerce Features** | Guest browsing, customer cart/checkout, admin CRUD product & order management |
| **Roles & Responsibilities** | Role-Based Access Control (RBAC): `user` and `admin` roles via JWT middleware |
| **User Flows** | Browse → Product Detail → Add to Cart → Checkout → Order Placed → Delivery |
| **MVC Pattern** | `models/` (MongoDB schemas) · `controllers/` (business logic) · React pages (views) |

---

## 🔗 Live Demo

> Access the fully deployed application here:

| Service | URL |
|---|---|
| 🌐 **Frontend Client** | [ShopEZ on Vercel](#) *(deploy to get your link)* |
| ⚙️ **Backend API Server** | [ShopEZ API on Render](#) *(deploy to get your link)* |

---

## 🔑 Test Accounts & Credentials

Pre-seeded accounts you can use to test all features:

### 👑 Administrator Account *(Full CRUD + Order Management)*
| Field | Value |
|---|---|
| Email | `admin@shopez.com` |
| Password | `admin123` |

### 👤 Customer Account *(Browse, Cart & Checkout)*
| Field | Value |
|---|---|
| Email | `sarah@shopez.com` |
| Password | `sarah123` |

> You can also register any new account on the **Sign Up** page.

---

## 📋 Project Implementation Matrix

### 📁 1. Project Architecture

| Milestone | Implementation |
|---|---|
| ER Diagram | 5 Mongoose models: `User`, `Product`, `Cart`, `Order`, `Admin` with relational references |
| Features | Guest browsing, user cart + checkout + order history, admin product/order CRUD |
| Roles & Responsibilities | JWT-protected middleware (`middleware/auth.js`) enforces `user` vs `admin` role access |
| User Flow | Browse categories → Product detail → Select size/variant → Add to cart → Checkout → Order confirmed |
| MVC Pattern | `models/` handles schema · `controllers/` handles logic · React `pages/` are the views |

---

### ⚙️ 2. Project Setup & Configuration

| Task | Details |
|---|---|
| Project Folder | Monorepo with decoupled `client/` (Vite + React) and `server/` (Express + Node) |
| Client Setup | Scaffolded with Vite, installed React Router v6, Lucide Icons, global CSS design system |
| Server Setup | Express server with `dotenv`, `cors`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `nodemon` |

---

### 💻 3. Backend Development

```
server/
├── index.js              ← Express app entry point
├── seed.js               ← Database seeder (20 products, 4 categories)
├── config/
│   └── db.js             ← MongoDB Atlas connection
├── models/
│   ├── User.js           ← User schema (username, email, password, role)
│   ├── Product.js        ← Product schema (name, category, price, image, stock, discount)
│   ├── Cart.js           ← Cart schema (userId, items[], quantity, size)
│   ├── Order.js          ← Order schema (shippingAddress, paymentMethod, status, totalAmount)
│   └── Admin.js          ← Admin config schema (categories[], banner{})
├── controllers/
│   ├── userController.js     ← Register, Login, Profile
│   ├── productController.js  ← List, Filter by category, Get by ID, CRUD
│   ├── cartController.js     ← Get cart, Add item, Update item, Remove item
│   ├── orderController.js    ← Place order, Get orders, Update status
│   └── adminController.js    ← Get config, Update config
├── routes/
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
└── middleware/
    └── auth.js           ← JWT token verification + admin role guard
```

**REST API Endpoints:**

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/users/register` | Create new account | Public |
| `POST` | `/api/users/login` | Login, receive JWT | Public |
| `GET` | `/api/users/profile` | Get user profile | 🔒 User |
| `GET` | `/api/products` | List all products | Public |
| `GET` | `/api/products?category=Mobiles` | Filter by category | Public |
| `GET` | `/api/products/:id` | Get product detail | Public |
| `POST` | `/api/products` | Create product | 🔒 Admin |
| `PUT` | `/api/products/:id` | Update product | 🔒 Admin |
| `DELETE` | `/api/products/:id` | Delete product | 🔒 Admin |
| `GET` | `/api/cart` | Get user's cart | 🔒 User |
| `POST` | `/api/cart` | Add item to cart | 🔒 User |
| `PUT` | `/api/cart/:itemId` | Update quantity/size | 🔒 User |
| `DELETE` | `/api/cart/:itemId` | Remove cart item | 🔒 User |
| `POST` | `/api/orders` | Place an order | 🔒 User |
| `GET` | `/api/orders` | Get user's orders | 🔒 User |
| `GET` | `/api/orders/all` | Get all orders | 🔒 Admin |
| `PUT` | `/api/orders/:id` | Update order status | 🔒 Admin |
| `GET` | `/api/admin/config` | Get store config | Public |
| `PUT` | `/api/admin/config` | Update categories/banner | 🔒 Admin |

---

### 🗄️ 4. Database Development

| Task | Details |
|---|---|
| Configure MongoDB | Connection string stored in `server/.env` targeting MongoDB Atlas cloud cluster |
| Database Collections | `users` · `products` · `carts` · `orders` · `admins` |
| Mongoose Models | Full schema validation, `pre('save')` password hashing via `bcryptjs` in `User.js` |
| Seed Data | 20 products across 4 categories seeded via `node seed.js` |

**Product Categories & Seed Data:**

| Category | Items (5 each) |
|---|---|
| 📱 Mobiles | iPhone 14, Samsung Galaxy S23, OnePlus 11, Google Pixel 7, Xiaomi Redmi Note 12 |
| 🎧 Gadgets | AirPods Pro, Sony WH-1000XM5, Apple Watch Series 8, iPad 10th Gen, Bluetooth Speaker |
| 👔 Men's Wear | Oxford Shirt, Slim Chinos, Hoodie, Leather Jacket, Running Sneakers |
| 👗 Women's Wear | Floral Dress, Denim Jacket, High-Waist Jeans, Knit Sweater, Block-Heel Boots |

---

### 🎨 5. Frontend Development

```
client/src/
├── main.jsx              ← React entry point
├── App.jsx               ← Router layout, navigation, protected routes
├── index.css             ← Global design system (CSS variables, components)
├── context/
│   └── AppContext.jsx     ← Global state: auth token, cart, user, order actions
├── components/
│   ├── Navbar.jsx        ← Top navigation with cart badge
│   └── ProductCard.jsx   ← Reusable product card component
└── pages/
    ├── Home.jsx              ← Hero banner, category grid, featured products
    ├── Products.jsx          ← Full catalogue with category filter sidebar
    ├── ProductDetail.jsx     ← Product page: images, size selector, Add to Cart
    ├── Cart.jsx              ← Cart items, quantity controls, checkout form, order placed
    ├── Login.jsx             ← User login form
    ├── Register.jsx          ← User registration form
    ├── Profile.jsx           ← Order history and account details
    ├── AdminDashboard.jsx    ← Admin stats overview
    ├── AdminProducts.jsx     ← Admin product list with delete
    ├── AdminNewProduct.jsx   ← Add / edit product form
    └── AdminOrders.jsx       ← All orders with status management
```

**Key Frontend Features:**

- 🏠 **Home Page** — Hero banner, shop-by-category grid (4 categories), featured product cards
- 🔍 **Products Page** — Category filter, search, live product grid with discount badges
- 📦 **Product Detail** — Image, rating, stock indicator, size/variant selector (S/M/L/XL for clothing, 128GB/256GB for mobiles), quantity picker, Add to Cart / Buy Now
- 🛒 **Cart** — Item list with quantity +/−, size selector, remove, order summary (subtotal, discounts, shipping, total)
- ✅ **Checkout** — Shipping address form + payment method (Credit Card / PayPal) → Order placed confirmation with order ID
- 👤 **Profile** — Logged-in user's full order history with status pills
- 🔒 **Admin Dashboard** — Protected admin panel for managing products and order statuses

---

### 🚀 6. Project Execution

| Task | Status |
|---|---|
| Steps for Execution | See **How to Run Locally** section below |
| Test Credentials | `admin@shopez.com` / `admin123` · `sarah@shopez.com` / `sarah123` |
| Deployed Frontend | Vercel *(see Live Demo section)* |
| Deployed Backend | Render *(see Live Demo section)* |

---

## 🚀 How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier is fine)
- Git

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/SHOP_EZ.git
cd SHOP_EZ
```

---

### Step 2 — Configure Environment Variables

Inside the `server/` folder, create a `.env` file (git-ignored):

```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopEZ?retryWrites=true&w=majority
JWT_SECRET=shopez_jwt_secret_key_12345
NODE_ENV=development
```

> ⚠️ Replace `<username>` and `<password>` with your MongoDB Atlas credentials.  
> ⚠️ Go to **Atlas → Network Access → Add IP Address → Allow Access from Anywhere** if connecting from a local machine.

---

### Step 3 — Start the Backend API Server

```bash
cd server
npm install
npm start
```

> Server runs on **http://localhost:8000**

---

### Step 4 — Seed the Database

```bash
cd server
node seed.js
```

This populates the database with:
- ✅ 20 products across 4 categories
- ✅ Admin store configuration (banner + categories)
- ✅ 2 test user accounts

---

### Step 5 — Start the Frontend Client

```bash
cd client
npm install
npm run dev
```

> React app opens at **http://localhost:5173**

---

## 🗂️ Full Project Folder Structure

```
SHOP_EZ/
├── client/                        ← React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Products.jsx
│   │       ├── ProductDetail.jsx
│   │       ├── Cart.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Profile.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       ├── AdminNewProduct.jsx
│   │       └── AdminOrders.jsx
│   ├── package.json
│   └── vercel.json
│
├── server/                        ← Node.js + Express Backend
│   ├── index.js
│   ├── seed.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Admin.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   └── vercel.json
│
├── .gitignore
└── README.md
```

---

## 🧰 Tech Stack Summary

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Lucide Icons, Vanilla CSS |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **Deployment** | Vercel (client) · Render (server) |

---

## 📝 Notes

- The `server/.env` file is **git-ignored** — never commit your secrets.
- Free-tier MongoDB Atlas requires your IP to be whitelisted under **Security → Network Access**.
- For Vercel deployment, set environment variables (`MONGO_URI`, `JWT_SECRET`) in the Vercel project dashboard.
- The client `vercel.json` includes SPA rewrite rules so React Router works on browser refresh.

---

