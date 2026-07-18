# ReWear — Full-Stack Preloved Fashion Store

MERN app: React + Tailwind frontend, Node/Express backend, MongoDB, Cloudinary
image storage, Razorpay payments, PDFKit receipts, and a full admin panel.
Styling exactly matches the original landing page (putty/bottle-green/mustard
palette, Fraunces + Work Sans + Space Mono fonts).

## Folder structure
```
rewear/
├── client/   React app (Vite + Tailwind)
└── server/   Node + Express API
```

## 1. Set up accounts (free tiers work)
- **MongoDB Atlas** — create a cluster, get your connection string.
- **Cloudinary** — create an account, get cloud name / API key / API secret.
- **Razorpay** — create a test-mode account, get key id / key secret.

## 2. Backend setup
```bash
cd server
npm install
cp .env.local .env
# fill in .env with your MongoDB, Cloudinary, and Razorpay values
npm run dev
```
Server runs on http://localhost:5000.

Create your first admin login:
```bash
node utils/seedAdmin.js
```
This creates `admin@rewear.com` / `admin123` (or set `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` env vars first). Log in with these credentials on the
site, then visit `/admin`.

## 3. Frontend setup
```bash
cd client
npm install
npm run dev
```
Runs on http://localhost:5173 and talks to the API at `http://localhost:5000/api`
(change with a `VITE_API_URL` env var if needed).

## 4. Using it
- Browse `/shop`, add items to cart, checkout with the Razorpay test
  checkout (use Razorpay's test card numbers — no real money moves in test mode).
- After payment, download the PDF receipt from the Order Success page or
  My Orders.
- Log in as admin (`/admin`) to:
  - Add/edit/delete products with Cloudinary image upload
  - View all orders, edit shipping addresses, update payment/order status

## 5. Deploying
- **Client** → Vercel (or Netlify)
- **Server** → Render (or Railway)
- **Database** → MongoDB Atlas (already cloud-hosted)
- Set the same env vars from `.env` in your Render dashboard, and set
  `CLIENT_URL` there to your deployed frontend URL, and `VITE_API_URL` in
  the client's env to your deployed backend URL.

## Notes
- Product prices/stock are re-verified server-side at order time, so the
  cart total can't be tampered with from the browser.
- Stock is decremented only after Razorpay payment is verified.
- Deleting a product also removes its images from Cloudinary.
