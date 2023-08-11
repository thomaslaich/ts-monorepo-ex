Educational example of a multi-service application in a typescript monorepo.

Application available at:

[https://multi-container-demo.timelapse.foo](multi-container-demo.timelapse.foo)

## Notes on architecture

The application is delibarately over-engineered and is meant as a POC for deploying a fully fledged typescript microservices architecture using Kubernetes.

## Technologies

- Monorepo tooling using turborepo and pnpm
- Docker and Kubernetes for containerization and orchestration
- Nest.js API server (using ts-rest for contract)
- Nest.js worker microservice
- TODO: CI/CD using github actions
- TODO: Terraform for cloud resources provisioning
- TODO: Development workflow using Skaffold
- TODO: Instrumentation using OpenTelemetry
- TODO: Sveltekit frontend
- TODO: Nest.js websocket for reactive UI
- TODO: Strongly typed mq with mq-ts

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

## Ship the application to production

Ship the application to google cloud (normally done by CI):

```
pnpm ship
```

The above command needs kubectl to be logged in with your cluster.

## Development workflow

TODO

## Using Grafana

TODO

## Thoughts

TODO

## Further reading

TODO
