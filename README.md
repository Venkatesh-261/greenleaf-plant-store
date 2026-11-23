# GreenLeaf — Premium Plant Nursery E-commerce

An original React + Bootstrap 5 storefront inspired by the breadth of features in modern plant-shopping websites. It does **not** copy Plant Orbit's branding or page design.

## Run locally

1. Install Node.js (LTS).
2. Extract this folder.
3. Open a terminal in the project folder.
4. Run these commands from the folder that contains `package.json` (for example, `D:\plant_nursery\GreenLeaf\greenleaf-premium`):

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually http://localhost:5173).

## Included in this frontend prototype

- Responsive premium botanical homepage
- Product catalogue with category filtering, search, sorting, price range and stock filter
- Product detail pages with plant care information
- Add-to-cart and quantity management
- Wishlist
- Demo account sign-in
- Demo checkout and order tracking
- Admin dashboard with catalogue and locally recorded demo orders
- Browser localStorage persistence

## Demo routes

- `/` — Home
- `/shop` — All products
- `/category/Indoor%20Plants` — Category collection
- `/product/P001` — Product detail
- `/wishlist` — Wishlist
- `/cart` — Shopping bag
- `/checkout` — Demo checkout
- `/account` — Demo account
- `/track-order` — Track a demo order
- `/admin` — Admin dashboard

## Important production notes

This is a working **frontend prototype**, not a production-ready commerce backend. Cart, wishlist, demo user and demo orders are stored in the current browser's localStorage. No real payment is taken and no real customer account is created.

Before launching for real customers, add:
- Backend API (for example Node.js + Express)
- Database (for example MongoDB or PostgreSQL)
- Secure authentication and role-based admin authorization
- Inventory and order APIs with server-side validation
- Payment gateway integration (Razorpay/Stripe) and verified webhooks
- Shipping, tax, privacy, refund and terms workflows
- Image hosting/CDN and licensed product photography

## Image note

The hero artwork, category visuals and product illustrations are bundled locally in `public/images`, so they do not depend on third-party image hosts or an internet connection. The app also includes image error fallbacks. These are original vector illustrations rather than commercial product photographs; replace them with your own licensed plant photography when preparing a real store.


## Photo edition

This edition replaces illustrated SVG plant artwork with photographic plant imagery. The hero photograph is bundled locally in `public/images/hero-real-plants.png`. Product/category photographs use remote image CDNs and therefore require an internet connection. If you deploy commercially, confirm each image provider's licensing and usage terms or replace with your own nursery photography.
