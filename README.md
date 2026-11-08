# PQC Security Monitoring Dashboard

A university software engineering project that presents a local, fictional view of an organization's migration to post-quantum cryptography using ML-KEM.

The dashboard highlights migration coverage alongside classical key exchange, potential Harvest Now, Decrypt Later (HNDL) exposure, unexpected fallback indicators, and organizational risks. It supports executive, project management, and connection-level security review in one application.

## Scope and limitations

- All connection, risk, and event records are local fictional data.
- The application does not monitor infrastructure, connect to external services, or perform cryptographic operations.
- HNDL ratings describe potential future exposure, not evidence that traffic has been collected.
- Unexpected fallback events are review indicators, not proof of a successful attack.
- PQC coverage is an adoption metric, not a complete security score.

## Technology

- React and TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- Vitest

## Prerequisites

Install Node.js and npm.

## Setup and development

```sh
npm ci
npm run dev
```

Vite prints the local development URL after it starts.

## Validation and production build

```sh
npm test
npm run build
npm run preview
```

`npm run build` runs the TypeScript project checks before creating the production bundle in `dist/`. The `dist/` directory is generated output and should not be committed.

## Project structure

```text
src/
  components/   Shared layout and UI components
  data/         Local fictional connection, event, and risk records
  features/     Overview, migration, risks, connections, and event views
  services/     Metric calculations and risk assessment rules
  types/        Shared TypeScript models
  utils/        Reserved for shared utilities
  App.tsx       Feature composition
  main.tsx      React entry point
tests/          Vitest unit tests
```

## Git notes

Commit `package-lock.json` so installs can use `npm ci`. Do not commit `node_modules/`, generated build output, local environment files, editor state, or TypeScript build cache files; these are covered by `.gitignore`.

No hosting-provider deployment configuration is included because the target hosting platform has not been selected. The Vite production build can be deployed to a static host by publishing the contents of `dist/`.
