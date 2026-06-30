# Phase 0: Project Foundation

## Overview
Phase 0 focuses on establishing a production-ready architecture before writing any AI or business logic code. Instead of a standard single-folder project, we set up a **PNPM Monorepo** (Workspace) to cleanly separate the frontend, backend, and shared libraries. 

In this phase, we established the core scaffolding:
1. **Shared Database (`lib/db`)**: Set up a PostgreSQL database connection using Drizzle ORM.
2. **Shared API Schemas (`lib/api-zod`)**: Created a dedicated package for Zod schemas to guarantee type-safety across both frontend and backend.
3. **Backend API (`artifacts/api-server`)**: Configured an Express.js REST API with TypeScript, logging, and CORS.
4. **Frontend (`artifacts/careerpilot`)**: Scaffolded a React application using Vite and Tailwind CSS.

## Packages Installed
- **Backend & DB:** `express`, `cors`, `pino`, `drizzle-orm`, `pg`, `drizzle-kit`
- **Frontend:** `react`, `react-dom`, `vite`, `tailwindcss`
- **Workspace:** `typescript`, `zod`

## Concepts & Technologies Used
- **Monorepo Architecture:** Organizing multiple related packages (frontend, backend, db) in a single repository for easier dependency management and code sharing.
- **REST API Design:** Building a scalable server to handle HTTP requests.
- **Object-Relational Mapping (ORM):** Using Drizzle to interact with PostgreSQL using strongly-typed TypeScript models instead of raw SQL queries.
