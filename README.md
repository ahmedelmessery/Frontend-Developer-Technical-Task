# Frontend Developer Technical Task

A responsive e-commerce product store built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 — App Router, SSR, Server Components |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Auth storage | js-cookie — JWT in cookies (7-day, sameSite strict) |
| State management | React Context API |
| API | RouteМisr Ecommerce API |

---

## Features

- **User Registration & Login** — JWT stored in cookies, auto-redirects on auth state
- **Route protection** — middleware guards `/product/*`, redirects unauthenticated users to `/login`
- **Product list** — responsive 2→3→4 column grid, image / title / price / rating
- **Search** — debounced (400ms) keyword filter, URL-based state
- **Category filter** — pill buttons, instant, URL-based state
- **Pagination** — URL-based page param, server-side slice
- **Product details** — interactive image gallery with thumbnail switcher
- **Loading states** — Next.js `loading.tsx` route convention
- **Error handling** — Next.js `error.tsx` boundary + API error messages
- **SSR + caching** — server components with `next: { revalidate: 60 }`
- **Fully responsive** — mobile-first

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (AuthProvider + Navbar)
│   ├── page.tsx                # Home — product list (Server Component)
│   ├── loading.tsx             # Route-level loading UI
│   ├── error.tsx               # Route-level error boundary
│   ├── login/page.tsx          # Login form
│   ├── register/page.tsx       # Register form
│   └── product/[id]/
│       ├── page.tsx            # Product details (Server Component)
│       └── loading.tsx
├── components/
│   ├── Navbar.tsx              # Sticky nav with auth state
│   ├── ProductCard.tsx         # Single product card
│   ├── ProductGallery.tsx      # Interactive image gallery (Client)
│   ├── Filters.tsx             # Search + category filter (Client)
│   ├── Pagination.tsx          # Page navigation (Client)
│   └── LoadingSpinner.tsx      # Reusable spinner
├── context/
│   └── AuthContext.tsx         # Auth state + login/register/logout
├── lib/
│   └── api.ts                  # API fetch helpers
├── middleware.ts               # Route protection
└── types/
    └── product.ts              # TypeScript interfaces
```

---

## API — RouteМisr Ecommerce

**Base URL:** `https://ecommerce.routemisr.com/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products?limit=40&page=1` | Paginated products |
| `GET` | `/products/:id` | Single product |
| `GET` | `/categories` | All categories |
| `POST` | `/auth/signin` | `{ email, password }` → `{ token, user }` |
| `POST` | `/auth/signup` | `{ name, email, password, rePassword, phone }` → `{ token, user }` |

> **Note:** The API does not support `keyword` or `category` query params for filtering.
> Filtering is applied server-side on the full product list after fetching.

---

## Setup

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
git clone <your-repo-url>
cd my-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=https://ecommerce.routemisr.com/api/v1
```

### Build

```bash
npm run build
npm start
```

---

## Deployment

Deploy to Vercel with zero config:

```bash
npx vercel
```

Add `NEXT_PUBLIC_API_URL` in your Vercel project environment variables.
