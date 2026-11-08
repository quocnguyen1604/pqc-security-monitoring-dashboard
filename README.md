# PQC Security Monitoring Dashboard

A university software engineering project that presents a local, fictional view of an organization's migration to post-quantum cryptography using ML-KEM.

The single-page dashboard brings together executive security posture, migration progress, organizational risks, connection-level exposure, and security event context.

## Scope and limitations

- Connection, risk, and event records are local synthetic data.
- The application does not monitor real infrastructure, connect to external services, or perform cryptographic operations.
- HNDL ratings describe potential future exposure; they are not evidence that traffic has been collected.
- Unexpected fallback events are indicators for review, not proof of a successful attack.
- PQC coverage measures ML-KEM adoption. It is not a complete security score and does not replace the separate overall risk status.
- Risk classifications and status thresholds are initial, explainable project rules, not a formal security certification.

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

## Tests and production build

```sh
npm test
npm run build
npm run preview
```

`npm run build` runs TypeScript project checks and then creates the production bundle in `dist/`. The `dist/` directory is generated output and should not be committed.

## Project structure

```text
.
├── index.html                    Vite HTML entry point
├── package.json                  Dependencies and npm scripts
├── package-lock.json             Locked dependency versions for reproducible installs
├── postcss.config.js             PostCSS and Tailwind integration
├── tailwind.config.js            Tailwind content paths and theme configuration
├── tsconfig.json                 TypeScript project references
├── tsconfig.app.json             TypeScript settings for application source
├── tsconfig.node.json            TypeScript settings for Vite/Vitest configuration
├── vite.config.ts                Vite React application configuration
├── vitest.config.ts              Unit test configuration
├── src/
│   ├── App.tsx                   Composes dashboard sections in the application shell
│   ├── main.tsx                  React entry point
│   ├── index.css                 Tailwind directives and global styles
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppShell.tsx      Responsive sidebar, header, and page layout
│   │   └── ui/                   Shared badges, metric cards, headers, and states
│   ├── data/                     Local fictional connections, events, and risks
│   ├── features/
│   │   ├── connections/          Searchable and filterable connection inventory
│   │   ├── events/               Contextual security event feed
│   │   ├── migration/            Migration KPIs, status chart, and blocked devices
│   │   ├── overview/             Executive status, KPIs, and PQC adoption chart
│   │   └── risks/                Organizational risk details and severity chart
│   ├── services/
│   │   ├── metrics.ts            Coverage, counts, and chart distributions
│   │   └── riskAssessment.ts     Connection risk and overall status rules
│   └── types/
│       └── security.ts           Shared connection, event, and risk types
└── tests/
    ├── businessLogic.test.ts     Metric, risk, and status unit tests
    └── setup.test.ts             Basic Vitest setup check
```

## Git notes

Commit `package-lock.json` so installs can use `npm ci`. Do not commit `node_modules/`, generated build output, local environment files, editor state, or TypeScript build cache files; these are covered by `.gitignore`.
