# Pyrus Telegram Sync Admin

React admin panel for managing Pyrus -> Telegram sync integrations.

## Required environment

Create `.env.local` with:

```bash
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
VITE_API_BASE_URL=http://localhost:3000
```

## Scripts

```bash
npm install
npm run dev
npm run build
```

The app uses Auth0 SDK token handling and sends `Authorization: Bearer <access_token>` on every API request.
