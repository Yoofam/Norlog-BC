# Deploying Norlog Building Concept

The site is a React + Vite (TanStack Start) app. All data (products, quotes,
bookings, site settings) is stored in the visitor's browser via `localStorage`,
and email notifications are sent from the browser to the address configured in
**Admin → Site**. There is no database or server to provision, so it runs on any
static/Node host.

## Build

```bash
bun install       # or npm install
bun run build     # outputs .output/
```

## Netlify

- Build command: `npm run build`
- Publish directory: `.output/public`
- Functions/SSR are handled automatically by the Nitro output preset. To force a
  fully static site, set `NITRO_PRESET=netlify` before building.

## Vercel

- Framework preset: Other
- Build command: `npm run build`
- Output directory: `.output/public`
- Set `NITRO_PRESET=vercel` in the environment variables.

## cPanel / any static host

```bash
NITRO_PRESET=static npm run build
```

Upload the contents of `.output/public` to `public_html` (or the host's web
root). Because routing is client-side, add a rewrite of all unknown paths to
`/index.html` (Apache users: an `.htaccess` with
`FallbackResource /index.html`).

## After deploying

1. Visit `/admin` and enter the PIN (default `3275`, changeable in
   `src/lib/constants.ts`).
2. Open the **Site** tab, set the notification email, logo and contact details.
3. Click **Send test email** and confirm the one-time activation email so form
   submissions start arriving.
