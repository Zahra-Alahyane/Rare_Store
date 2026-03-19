# 🛍️ Store App (Full Stack)

A modern **full-stack e-commerce application** built with:

* ⚛️ **React + Vite** (Frontend)
* 🐘 **Laravel** (Backend API)

This project demonstrates a complete workflow: frontend UI, routing, API consumption, and backend services.

---

## 🚀 Features

### Frontend

* 🧭 Client-side routing with React Router
* 📦 Product listing and navigation
* 🔎 Dynamic data fetching using Axios
* 🎨 Responsive and clean UI

### Backend (Laravel)

* 🔗 RESTful API endpoints
* 🗄️ Database management with Eloquent ORM
* 🔐 Ready for authentication (can be extended)
* ⚙️ MVC architecture

---

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* React Router DOM
* Axios
* ESLint

### Backend

* Laravel
* PHP
* MySQL (or any supported DB)

---

## 📁 Project Structure

```text
project-root/
├── frontend/ (React + Vite)
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Pages (Home, Product, etc.)
│   │   ├── services/       # Axios API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── images/         # Screenshots/images
│   ├── package.json
│   └── vite.config.js
├── backend/ (Laravel)
│   ├── app/                # Controllers, Models
│   ├── routes/             # API routes
│   ├── database/           # Migrations, seeders
│   ├── config/
│   ├── .env
│   └── artisan
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/store-app.git
cd store-app
```

---

### 2️⃣ Setup Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your database in `.env`, then run:

```bash
php artisan migrate
php artisan serve
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

### 3️⃣ Setup Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔗 API Integration

The frontend communicates with the Laravel backend using **Axios**.

Example:

```js
axios.get("http://127.0.0.1:8000/api/products")
```

API routes are defined in:

```text
backend/routes/api.php
```

---

## 📸 Screenshots

### Home Page

![Home Page](screenshots/home-page.png)

### Login Page

![Login Page](screenshots/login-page.png)

### Subscription Products Page

![Subscription Page](screenshots/subscription-page.png)

---

## 🎯 Future Improvements

* 🛒 Shopping cart system
* 🔐 User authentication (Laravel Sanctum / JWT)
* 💳 Payment integration
* 📊 Admin dashboard

---

## 👩‍💻 Author

**Zahra Alahyane**
Computer Science Student @ EST

---

## 📄 License

This project is for educational purposes.
