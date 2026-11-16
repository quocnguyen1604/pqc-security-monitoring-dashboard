# PQC Security Monitoring Dashboard

A university software engineering project that presents a local, fictional view of an organization's migration to post-quantum cryptography using ML-KEM.

The single-page dashboard brings together organizational and customer-specific migration status, proposed customer-deadline readiness, HNDL estimates by data class, organizational risks, connection-level exposure, filterable security events, and an initial customer report preview.

## Scope and limitations

- Connection, risk, event, and customer data-flow records are local synthetic data.
- The application does not monitor real infrastructure, connect to external services, or perform cryptographic operations.
- HNDL ratings describe potential future exposure; they are not evidence that traffic has been collected.
- Unexpected fallback events are indicators for review, not proof of a successful attack.
- PQC coverage measures ML-KEM adoption. It is not a complete security score and does not replace the separate overall risk status.
- The 31 December 2027 customer PQC deadline is a proposal, not an approved contractual commitment.
- Customer data classes and GB-per-month October 2026 volumes are provisional illustrative reporting assumptions.
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
├── docs/
│   ├── decisionLog.md             Record of technical and architectural decisions
│   ├── riskLog.md                 Project risk register and mitigation tracking
│   └── customerReportingAssumptions.md Proposed deadline, classes, volume, and HNDL methodology
├── src/
│   ├── App.tsx                   Composes dashboard sections in the application shell
│   ├── main.tsx                  React entry point
│   ├── index.css                 Tailwind directives and global styles
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppShell.tsx      Responsive navigation, header, and page layout
│   │   ├── customer/              Reusable customer exposure presentation
│   │   └── ui/                   Shared badges, metric cards, headers, and states
│   ├── config/                   Proposed customer deadline and reporting assumptions
│   ├── data/                     Local synthetic connections, events, risks, and customer data flows
│   ├── features/
│   │   ├── connections/          Searchable and filterable connection inventory
│   │   ├── customer/              Customer deadline, HNDL, and report preview sections
│   │   ├── events/               Severity/type filters and expandable event context
│   │   ├── migration/            Migration KPIs, status chart, and blocker details
│   │   ├── overview/             Executive status, KPIs, and adoption chart
│   │   └── risks/                Organizational risks and severity chart
│   ├── services/
│   │   ├── customerMigration.ts Customer migration metrics and deadline assessment
│   │   ├── customerReporting.ts HNDL aggregation and customer flow validation
│   │   ├── events.ts             Event filtering and contextual explanations
│   │   ├── metrics.ts            Coverage, counts, and chart distributions
│   │   └── riskAssessment.ts     Connection risk and overall status rules
│   └── types/
│       ├── customerReporting.ts  Customer data class and flow models
│       └── security.ts           Shared connection, event, and risk types
└── tests/
    ├── businessLogic.test.ts     Metric, risk, and status unit tests
    ├── customerMigration.test.ts Customer coverage and deadline tests
    ├── customerReporting.test.ts Customer flow and exposure tests
    ├── events.test.ts            Event filtering and context tests
    └── setup.test.ts             Basic Vitest setup check
```

## Git notes

Commit `package-lock.json` so installs can use `npm ci`. Do not commit `node_modules/`, generated build output, local environment files, editor state, or TypeScript build cache files; these are covered by `.gitignore`.
