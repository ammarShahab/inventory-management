# 📦 Smart Inventory & Order Management System

A full-stack inventory and order management system built for small to medium businesses. Manage products, categories, orders, and stock levels — all in real time.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://inventory-management-sandy-iota.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-orange?style=for-the-badge)](https://convex.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 🌐 Live Demo

**[https://inventory-management-sandy-iota.vercel.app/](https://inventory-management-sandy-iota.vercel.app/)**

> Use the **Demo Login** button on the login page to explore the app without creating an account.

---

## ✨ Features

### 🔐 Authentication

- Email & password sign up / sign in
- One-click **Demo Login** with pre-filled credentials
- Session-based auth with automatic token management
- Protected routes — unauthenticated users are redirected to login

### 📁 Product & Category Management

- Create and manage product **categories** (Electronics, Grocery, Clothing, etc.)
- Add products with: name, category, price, stock quantity, minimum stock threshold, and status
- Auto-update product status to **Out of Stock** when stock reaches zero

### 🛒 Order Management

- Create new orders with multiple products per order
- Auto-calculate total price based on selected products and quantities
- Update order status: `Pending → Confirmed → Shipped → Delivered`
- Cancel orders with automatic **stock restoration**
- Filter orders by status or date

### 📊 Stock Handling

- Automatically **deduct stock** when an order is placed
- Show real-time warning: _"Only X items available in stock"_
- Prevent order confirmation if stock is insufficient
- Product status auto-switches to **Out of Stock** when stock hits 0

### 🔁 Restock Queue

- Automatically adds low-stock products to a **Restock Queue**
- Products ordered by lowest stock first
- Priority indicators: 🔴 High / 🟡 Medium / 🟢 Low
- Manually restock products and remove them from the queue

### 🛡️ Conflict Detection

- Prevents **duplicate products** in the same order
- Prevents ordering **inactive/out-of-stock** products
- Clear inline error messages for all conflicts

### 📈 Dashboard

- **Total Orders Today** — live count
- **Revenue Today** — auto-calculated from active orders
- **Pending vs Completed Orders** — at a glance
- **Low Stock Items Count** — pulled from restock queue
- **Product Summary** — sorted by lowest stock with status badges
- **Activity Log** — latest 10 system actions in real time

### 📋 Activity Log

Tracks all major system actions:

- Order created / status updated / cancelled
- Stock updated for a product
- Product added to Restock Queue

---

## 🛠️ Tech Stack

| Layer                  | Technology                                 |
| ---------------------- | ------------------------------------------ |
| **Framework**          | Next.js 16 (App Router)                    |
| **Language**           | TypeScript                                 |
| **UI Components**      | shadcn/ui                                  |
| **Styling**            | Tailwind CSS                               |
| **Font**               | Geist                                      |
| **Forms**              | React Hook Form                            |
| **Validation**         | Zod                                        |
| **Backend / Database** | Convex                                     |
| **Authentication**     | BetterAuth + `@convex-dev/better-auth`     |
| **Deployment**         | Vercel (frontend) + Convex Cloud (backend) |

---

<!-- ## 📁 Folder Structure

```
inventory-management/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (sharedlayout)/
│   │   ├── layout.tsx          ← Navbar wrapper
│   │   └── page.tsx            ← Landing page
│   ├── (protected)/
│   │   └── dashboard/
│   │       ├── layout.tsx      ← Sidebar + auth guard
│   │       ├── page.tsx        ← Dashboard overview
│   │       ├── products/page.tsx
│   │       ├── categories/page.tsx
│   │       ├── orders/page.tsx
│   │       └── restock/page.tsx
│   ├── api/auth/[...all]/route.ts
│   ├── hooks/
│   │   └── useRequireAuth.ts
│   └── lib/
│       ├── auth.ts             ← BetterAuth server config
│       └── auth-client.ts      ← BetterAuth browser client
│
├── components/
│   ├── ui/                     ← shadcn/ui primitives
│   └── web/
│       ├── Navbar.tsx
│       ├── ConvexClientProvider.tsx
│       ├── auth/
│       │   ├── login-form.tsx
│       │   ├── signup-form.tsx
│       │   └── signout-btn.tsx
│       └── dashboard/
│           ├── orders/
│           ├── products/
│           ├── categories/
│           ├── restock/
│           └── activity/
│
├── convex/
│   ├── schema.ts               ← Database schema
│   ├── auth.config.ts
│   ├── categories.ts
│   ├── products.ts
│   ├── orders.ts
│   ├── restock.ts
│   ├── activityLog.ts
│   └── dashboard.ts
│
├── lib/
│   └── validations/
│       ├── auth.ts
│       ├── category.ts
│       ├── product.ts
│       └── order.ts
│
├── middleware.ts               ← Route protection
└── .env.local
``` -->

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev/) account (free)
- A [Vercel](https://vercel.com/) account (for deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/ammarShahab/inventory-management.git
cd inventory-management
```

### 2. Install Dependencies

```bash
npm install
```

<!-- ### 3. Install shadcn/ui Components

```bash
npx shadcn@latest init
npx shadcn@latest add button input label card form select badge table dialog alert-dialog separator scroll-area tooltip
```

### 4. Set Up Convex

```bash
npx convex dev
```

This will:

- Prompt you to log in to Convex
- Create a new project (or link an existing one)
- Generate `convex/_generated/` automatically
- Print your `NEXT_PUBLIC_CONVEX_URL`

Keep this terminal running during development. -->

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site

# BetterAuth
BETTER_AUTH_SECRET=your_secret_key_here   # generate: openssl rand -hex 32
BETTER_AUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Start the Development Server

```bash
# Terminal 1 — Convex backend
npx convex dev

# Terminal 2 — Next.js frontend
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Environment Variables

| Variable                      | Description                              | Example                    |
| ----------------------------- | ---------------------------------------- | -------------------------- |
| `NEXT_PUBLIC_CONVEX_URL`      | Convex deployment URL                    | `https://xxx.convex.cloud` |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Convex site URL                          | `https://xxx.convex.site`  |
| `BETTER_AUTH_SECRET`          | Secret key for BetterAuth (min 32 chars) | `openssl rand -hex 32`     |
| `BETTER_AUTH_URL`             | Your app's base URL                      | `http://localhost:3000`    |
| `NEXT_PUBLIC_SITE_URL`        | Public site URL                          | `http://localhost:3000`    |

> ⚠️ Never commit `.env.local` to Git. It is already listed in `.gitignore`.

---

## 🚀 Deployment

### Deploy to Vercel

**1. Push to GitHub:**

```bash
git add .
git commit -m "initial commit"
git push origin main
```

**2. Deploy Convex to production:**

```bash
npx convex deploy
```

Copy the production URL printed after deployment.

**3. Import to Vercel:**

- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Click **Add New Project** → Import your GitHub repo
- Add all environment variables (use production URLs)
- Click **Deploy**

**4. Set production environment variables in Vercel:**

```env
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-prod-deployment.convex.site
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
CONVEX_DEPLOYMENT=prod:your-deployment-name
CONVEX_DEPLOY_KEY=prod:your-deployment-key
```

<!-- **5. Update trusted origins in `lib/auth.ts`:**

```ts
trustedOrigins: [
  "http://localhost:3000",
  "https://your-app.vercel.app",
],
``` -->

---

## 🧭 Usage

| Route                   | Description                   |
| ----------------------- | ----------------------------- |
| `/`                     | Landing page                  |
| `/signup`               | Create a new account          |
| `/login`                | Sign in (includes Demo Login) |
| `/dashboard`            | Overview with live stats      |
| `/dashboard/products`   | Add and manage products       |
| `/dashboard/categories` | Create product categories     |
| `/dashboard/orders`     | Create and manage orders      |
| `/dashboard/restock`    | Restock queue + activity log  |

---

## 📝 Important Notes

- **Create categories first** before adding products — the product form pulls categories from the database
- **Demo account** is auto-created on first login if it doesn't exist
- **Convex is reactive** — all data updates in real time across all connected clients without polling
- The **Restock Queue** is automatically managed — products are added/removed based on stock vs threshold

---

## 🔮 Future Improvements

- [ ] Role-based access control (Admin / Staff)
- [ ] Export orders and reports to PDF / Excel
- [ ] Dark mode toggle
- [ ] Product image uploads
- [ ] Email notifications for low stock alerts
- [ ] Analytics charts (revenue trends, top products)
- [ ] Multi-location inventory support
- [ ] Barcode / QR code scanning for products

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ using Next.js, Convex, and BetterAuth
  <br />
  <a href="https://inventory-management-sandy-iota.vercel.app/">View Live Demo</a>
</div>
