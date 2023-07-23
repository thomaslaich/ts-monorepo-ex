(self) educational example of a multi-service application in a monorepo.

## Technologies

- Remix frontend
- An api server (and task orchestrator) using nest.js and ts-rest
- Kubernetes for orchestration
- Development workflow using Skaffold
- Multiple worker types
  - hashsum worker in Node.js
  - ... worker in C#/.NET
  - ... worker in Haskell
- Calculation service in C++
- Monorepo building using turborepo and Bazel

## Build and run locally

Build the solution by running the following command from the package root:

```
npm install
npm run build
```

## Development workflow
