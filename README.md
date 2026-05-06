# Pyrus Telegram Sync Admin

React admin panel for managing Pyrus -> Telegram sync integrations.

## Required environment

Create `.env.local` with:

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=admin
```

## Scripts

```bash
npm install
npm run dev
npm run build
```

Authentication uses a single fixed username/password set via `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` (defaults: `admin` / `admin`). The session is stored in `localStorage`.
