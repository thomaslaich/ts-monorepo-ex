Educational example of a multi-service application in a js monorepo.

## Technologies

- Solid.js frontend with tanstack-query for api fetching
- An api server (and task orchestrator) using nest.js and ts-rest
- Kubernetes for orchestration
- Monorepo tooling using turborepo
- Development workflow using Skaffold
<!-- - Multiple worker types
  - hashsum worker in Node.js
  - ... worker in C#/.NET
  - ... worker in Haskell
- Calculation service in C++ -->
<!-- and Bazel -->

## Build and run locally

Build the solution locally:

```
npm install
npm run build
```

Run the solution locally:

```
npm run deploy
```

## Development workflow
