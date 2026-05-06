# lnkshrtr

[![lnkshrtr](https://ejyic7eskr7jje45.public.blob.vercel-storage.com/lnkshrtr-thumbnail.png)](https://lnkshrtr.com2)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat&logo=sqlalchemy&logoColor=white)

lnkshrtr is a small, clean link shortener built for the moments when you want to turn a messy URL into something you can actually share. You can make a short link quickly from the home page, sign in when you want a dashboard, and keep track of the links that matter to you.

It supports custom short codes, password-protected links, public profile pages, visit tracking, and QR codes, so it feels more like a useful little product than a one-screen demo.

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

Main value:

- `VITE_API_URL`

## Useful Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm test`
- `pnpm lint`
