# FurniCasa Next.js

FurniCasa is a Next.js App Router storefront for modern furniture. The existing React/Vite UI, bilingual English/Arabic experience, product filters, inquiry list, inquiry form, and contact form are preserved.

## Project structure

```text
app/                 Next.js routes, layout, and global styles
src/components/home/ Homepage sections grouped by feature
src/contexts/        Inquiry and language state providers
public/assets/       Browser-served product and banner images
```

Each homepage section has its own lowercase folder containing its component and stylesheet, for example `src/components/home/hero/hero.jsx` and `hero.css`. The main page composition lives in `src/app.jsx`; providers are exported through `src/contexts/index.jsx`, and homepage sections through `src/components/home/index.jsx`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Data sources

The live catalog is loaded from the user-portal backend's public API configured
with `NEXT_PUBLIC_FURNICASA_API_BASE_URL` and
`NEXT_PUBLIC_FURNICASA_STORE_SLUG`. The base URL should point to the backend's
`/api/public` path, for example `https://your-backend.example.com/api/public`.
`NEXT_PUBLIC_FURNICASA_API_ORIGIN` is optional and is used for catalog images;
when omitted it is derived from the public API URL. Products, categories,
materials, and catalog images are not hardcoded in the frontend. Inquiry
submissions and contact messages are persisted in Supabase.

Keep `.env.local` private. It contains the public Supabase client settings and
the public catalog API configuration used by the browser.

## Production

```bash
npm run build
npm start
```

