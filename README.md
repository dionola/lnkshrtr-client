# lnkshrtr

lnkshrtr is a small, clean link shortener built for the moments when you want to turn a messy URL into something you can actually share. You can make a short link quickly from the home page, sign in when you want a dashboard, and keep track of the links that matter to you.

It supports custom short codes, password-protected links, public profile pages, visit tracking, and QR codes, so it feels more like a useful little product than a one-screen demo.

## Demo

Add a short walkthrough video here that shows the core flow: creating a link, signing in, managing links from the dashboard, opening a public profile, and using a QR code.

<!-- Replace this with the final demo video link or embed.

Example:

https://github.com/user-attachments/assets/demo-video-id

-->

## Tech Stack

The frontend is a React and TypeScript app built with Vite, with a small client-side architecture that keeps the main user flows easy to follow.

- React for the UI
- TypeScript for typed components, API responses, and shared app models
- Vite for local development and production builds
- React Router for home, auth, dashboard, redirect, and public profile routes
- Zustand for auth and link state
- Tailwind CSS for the visual system
- Lucide React for interface icons
- React QR Code for shareable QR codes
- Vitest and Testing Library helpers for unit and store coverage

## Features

- Create short links from the public home page
- Choose custom short codes
- Protect links with a password
- Manage links from a signed-in dashboard
- Share public profile pages and public links
- Generate QR codes for shortened URLs

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
