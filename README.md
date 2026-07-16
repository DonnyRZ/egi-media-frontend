# EGI Media Frontend

Premium digital news platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- Axios

## Getting Started

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Ensure `egi-media-backend` is running at `http://localhost:5002`.

## Project Structure

```
src/
  app/                 # Next.js App Router
  features/            # Feature-based UI sections
  shared/
    components/        # Reusable UI components
    config/            # Environment config
    constants/         # App constants
    hooks/             # Shared hooks
    lib/               # Axios, errors, utilities
    mappers/           # DTO to domain mappers
    providers/         # React providers
    repositories/      # Data access layer
    services/          # API services
    stores/            # Zustand stores
    types/             # TypeScript types
    utils/             # Helper functions
```

## API Integration

All API calls follow:

```
Page → TanStack Query Hook → Repository → Service → Axios → egi-media-backend
```

Endpoints are sourced from `egi-media-backend/swagger_output.json`.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
