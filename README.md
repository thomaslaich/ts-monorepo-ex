Educational example of a multi-service application in a typescript monorepo.

Application available at:
multi-container-app-ts.cknlike.com

## Technologies

- Monorepo tooling using turborepo and pnpm
- Docker and Kubernetes for containerization and orchestration
- Development workflow using Skaffold
- Sveltekit frontend with tanstack-query for api fetching
- An api server (and task orchestrator) using nest.js and ts-rest
- Strongly typed mq with ts-amqp

## Build and run locally

Build the solution locally:

```
pnpm install
pnpm build
```

Deploy locally in production mode:

```
pnpm localdeploy
```

Deploy locally using Skaffold and build watchers:

```
pnpm dev
```

Ship the application to google cloud (normally done by CI):

```
pnpm ship
```

## Development workflow
