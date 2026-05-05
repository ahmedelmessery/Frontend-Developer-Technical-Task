# ShopNext — Frontend Developer Technical Task

A responsive product store built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**, consuming the [FakeStoreAPI](https://fakestoreapi.com).

---

## Live Demo

> Deploy to Vercel with one click:
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, SSR) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Auth storage | js-cookie (JWT in cookies) |
| State management | React Context API |
| API | [FakeStoreAPI](https://fakestoreapi.com) |

---

## Features

- **User Registration & Login** — JWT token stored in cookies via `js-cookie`
- **Product List Page** — responsive grid (1 → 2 → 3 → 4 cols), image / title / price / rating
- **Search** — real-time filter by product title
- **Category Filter** — pill buttons for each category
- **Pagination** — "Load more" button (12 products per page)
- **Product Details Page** — full image, title, description, price, category, rating
- **Loading states** — Next.js `loading.tsx` + spinner component
- **Error handling** — Next.js `error.tsx` boundary + API error propagation
- **SSR + caching** — server components fetch with `next: { revalidate: 60 }`
- **Fully responsive** — mobile-first, works on all screen sizes

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (AuthProvider + Navbar)
│   ├── page.tsx            # Home — product list (Server Component)
│   ├── loading.tsx         # Route-level loading UI
│   ├── error.tsx           # Route-level error boundary
│   ├── login/
│   │   └── page.tsx        # Login form
│   ├── register/
│   │   └── page.tsx        # Register form
│   └── product/
│       └── [id]/
│           ├── page.tsx    # Product details (Server Component)
│           └── loading.tsx
├── components/
│   ├── Navbar.tsx          # Sticky nav with auth state
│   ├── ProductCard.tsx     # Single product card
│   ├── ProductGrid.tsx     # Grid + search + filter (Client Component)
│   ├── SearchBar.tsx       # Search input
│   ├── CategoryFilter.tsx  # Category pill buttons
│   └── LoadingSpinner.tsx  # Reusable spinner
├── context/
│   └── AuthContext.tsx     # Auth state + login/register/logout
├── lib/
│   └── api.ts              # FakeStoreAPI fetch helpers
└── types/
    └── product.ts          # Product TypeScript interface
```

---

## API — FakeStoreAPI

**Base URL:** `https://fakestoreapi.com`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | All products |
| `GET` | `/products/:id` | Single product |
| `GET` | `/products/categories` | All categories |
| `GET` | `/products/category/:name` | Products by category |
| `POST` | `/auth/login` | Login → returns `{ token }` |
| `POST` | `/users` | Register new user |

### Postman Collection

Import this public collection to test all endpoints:
**[https://www.postman.com/collections/fakestoreapi](https://fakestoreapi.com)**

Or use the raw endpoints above directly in Postman with:
- Base URL: `https://fakestoreapi.com`
- Login body: `{ "username": "mor_2314", "password": "83r5^_" }`

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd my-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Demo Credentials

FakeStoreAPI has pre-seeded users. Use these to test login:

| Username | Password |
|---|---|
| `mor_2314` | `83r5^_` |
| `johnd` | `m38rmF$` |

---

## Deployment

This app is ready to deploy on **Vercel** with zero configuration:

```bash
npx vercel
```
