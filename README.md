# PayTomorrow Workspace Documentation and Deployment Guide

This workspace is a monorepo containing all clients, microservices, and database configurations for the PayTomorrow platform. It uses pnpm workspaces and Turborepo for workspace orchestration and builds.

---

## Workspace Structure

The project is split into clients, services, packages, and database tools:

### Clients
* [clients/web](file:///Users/matteopaoli/projects/paytomorrow/clients/web) - Next.js client interface.
* [clients/mobile](file:///Users/matteopaoli/projects/paytomorrow/clients/mobile) - Expo (React Native) mobile application.

### Services
* [services/api-server](file:///Users/matteopaoli/projects/paytomorrow/services/api-server) - NestJS API server handling core domain logic.
* [services/messaging](file:///Users/matteopaoli/projects/paytomorrow/services/messaging) - Golang service dedicated to notification processing.

### Shared Packages
* [packages/db](file:///Users/matteopaoli/projects/paytomorrow/packages/db) - Shared database mappings, queries, and Drizzle/Prisma schema configurations.
* [packages/typescript-config](file:///Users/matteopaoli/projects/paytomorrow/packages/typescript-config) - Shared TypeScript compiler configurations.

### Database Setup
* [db/](file:///Users/matteopaoli/projects/paytomorrow/db) - Contains SQL initialization scripts:
  * `00_init.sql`: Creates required extensions (like PostGIS) and sets up the primary schema.
  * `01_seed.sql`: Inserts seed data.

---

## Local Development Setup

To configure the workspace locally on an Apple Silicon (arm64) Mac, follow these steps.

### Prerequisites
* Node.js: Node 20 (LTS) or Node 22 (LTS) is highly recommended. Using LTS versions prevents compilation issues with the canvas dependency on arm64 architectures.
* pnpm: Version 10 or later is used to manage workspace dependencies.
* Docker & Docker Compose: Used to manage database containers locally.

### Step 1: Environment Configurations
Copy the `.env.example` files to `.env` in the respective client and service folders:
* For the web client, copy `clients/web/.env.example` to `clients/web/.env` and supply the required secrets.
* For the API server, copy `services/api-server/.env.example` to `services/api-server/.env`.
* For the mobile client, copy `clients/mobile/.env.example` to `clients/mobile/.env`.

### Step 2: Spin up Database Services
Launch the PostgreSQL / PostGIS database containers. The primary compose file builds PostGIS from a custom Dockerfile (`db/Dockerfile`) based on the official native arm64 `postgres:15` image:
```bash
docker compose up -d
```
The database container automatically mounts and executes the SQL scripts under `db/` to initialize and seed the tables on startup.

### Step 3: Install Dependencies
Run the workspace installer from the root directory:
```bash
pnpm install
```

### Step 4: Run Services Locally

To start the Next.js web application:
```bash
cd clients/web
pnpm dev
```

To start the NestJS backend API server:
```bash
cd services/api-server
pnpm run start:dev
```

To run the messaging microservice (Go):
```bash
cd services/messaging
go run main.go
```

To run the mobile app using Expo:
```bash
cd clients/mobile
pnpm start
```

---

## Deployment Guide

There are multiple environments configured for deployment via Docker Compose.

### Local Staging Deployment
To test a replica of the staging environment locally, run the staging compose file:
```bash
docker compose -f compose.staging.yml up -d --build
```
This launches:
* `staging-db`: A PostgreSQL/PostGIS database instance.
* `messaging`: The compiled Golang messaging microservice container.

### Preproduction Deployment
To deploy or run the preproduction configuration, run:
```bash
docker compose -f compose.preprod.yml up -d --build
```
This launches `preprod-db` utilizing a vanilla PostgreSQL 15 image.

### Production Next.js Deployments
For production builds of the Next.js web client, run:
```bash
cd clients/web
pnpm build
pnpm start
```
Ensure that all relevant environment variables are set in your target deployment platform hosting the NestJS API and Next.js frontend.
