# Link Shortener Frontend

Vite + React frontend for the link shortener project.

## Stack

- React
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS
- Vitest

## Features

- create short links
- custom codes
- password-protected links
- dashboard for signed-in users
- public profile / public links
- QR code support

## Run

```bash
pnpm install
pnpm dev
```

## Environment

Start from [`.env.example`](/Users/stephen/repoClone/lnkshrtr-frontend/.env.example:1).

Main value:

- `VITE_API_URL`

## Useful Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm test`
- `pnpm lint`

## Notes

- API wrapper lives in [`src/services/api-client.ts`](/Users/stephen/repoClone/lnkshrtr-frontend/src/services/api-client.ts:1).
- State stores live in [`src/stores`](/Users/stephen/repoClone/lnkshrtr-frontend/src/stores:1).
