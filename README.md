# trpc-forms

trpc-forms is a web application for creating forms, sharing them with respondents, and reviewing submitted responses. The repository is a pnpm and Turborepo monorepo: the web app, HTTP API, database code, and application services live in separate workspaces.

## What the application does

Users can sign up and sign in, create forms, add and edit fields, and reorder fields in the form builder. Each form has a public URL for respondents. Form owners can preview their form without submitting a response and open a table of responses organized by the form's field labels.

The current form field types include text, number, email, password, checkbox, radio, select, textarea, date, time, datetime-local, and file. Select and radio fields do not have option configuration yet, and file uploads are not implemented. Those fields cannot be submitted through the current public form.

## Repository layout

```text
apps/
  api/                    Express API server
  web/                    Next.js application
packages/
  database/               Drizzle schema, PostgreSQL connection, migrations
  services/               User, form, and form-submission operations
  trpc/                   tRPC routers, procedures, and API context
  logger/                 Shared Winston logger
  eslint-config/          Shared ESLint configurations
  typescript-config/      Shared TypeScript configurations
```

### How the parts fit together

- `apps/web` contains the dashboard, form builder, private preview, public form page, and submissions table. It calls the API through the shared tRPC client.
- `apps/api` runs the Express server. It mounts the tRPC endpoint at `/trpc`, REST-style OpenAPI endpoints at `/api`, an OpenAPI document at `/openapi.json`, and API documentation at `/docs`.
- `packages/trpc` defines the routers and input/output validation. Authenticated procedures verify the user token and make the user ID available to protected operations.
- `packages/services` contains application logic. Form and submission services use the database package and enforce ownership where form data is private.
- `packages/database` exports the Drizzle database client and PostgreSQL models. SQL migration files are in `packages/database/drizzle`.

## Requirements

- Node.js 18 or newer
- pnpm 9
- PostgreSQL

Install dependencies from the repository root:

```sh
pnpm install
```

## Environment setup

The root development commands load environment variables from a root `.env` file. Create one with the values needed for your local setup:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_API_URL=http://localhost:8000/trpc
```

`DATABASE_URL` and `JWT_SECRET` are required. `NEXT_PUBLIC_API_URL` is optional, but setting it to the API's tRPC URL is recommended when running the web app and API on separate local ports. Without it, the web app uses `/trpc` on its own origin.

The API uses port `8000` by default. You can set `PORT` to use another port and should update `NEXT_PUBLIC_API_URL` accordingly. `BASE_URL` defaults to `http://localhost:8000` and is used to generate OpenAPI links. `NODE_ENV` defaults to `development`; the API accepts `development` or `prod`. The logger accepts `LOGGER_LEVEL=error`, `info`, or `debug`.

Do not commit `.env` files or put secrets in `NEXT_PUBLIC_*` variables. The `NEXT_PUBLIC_` prefix makes a value available to browser code.

## Database setup

The database schema and migration files are managed with Drizzle. Set `DATABASE_URL`, then apply the migrations:

```sh
pnpm db:migrate
```

When you change a database model, generate a migration and review the generated SQL before applying it:

```sh
pnpm db:generate
pnpm db:migrate
```

## Run locally

Start the web app and API from the repository root:

```sh
pnpm dev
```

The web app is available at [http://localhost:3000](http://localhost:3000). The API is available at [http://localhost:8000](http://localhost:8000), unless you configure a different port.

Useful API URLs:

- `http://localhost:8000/health` checks the API process.
- `http://localhost:8000/trpc` is the tRPC endpoint.
- `http://localhost:8000/openapi.json` serves the generated OpenAPI document.
- `http://localhost:8000/docs` serves the API reference.

To run one application by itself:

```sh
pnpm --filter web dev
pnpm --filter @repo/api dev
```

These commands run in each application's workspace. Set the needed variables in that workspace's environment file or export them in the shell first. The root `pnpm dev` command is the simplest option for local development because it loads the root `.env` before starting the apps.

The API and web app need to share the same database and authentication configuration to work together.

## Main routes

### Web application

- `/login` and `/signup` are the authentication pages.
- `/dashboard/forms` lists the signed-in user's forms.
- `/dashboard/forms/[id]` is the form builder.
- `/dashboard/forms/[id]/preview` is an owner-only preview with submission disabled.
- `/dashboard/forms/[id]/submissions` shows responses for a form to its owner.
- `/form/[form_id]` is the public form respondents can fill out.

### API

The API provides authentication and form procedures through both tRPC and generated OpenAPI routes. Public procedures are used for fetching a shareable form and submitting a response. Form management and reading submissions require authentication.

## Common commands

Run these from the repository root:

```sh
pnpm dev             # Start development apps
pnpm build           # Build configured apps and packages
pnpm lint            # Run configured ESLint tasks
pnpm check-types     # Run configured TypeScript checks
pnpm format          # Format TypeScript, TSX, and Markdown files
pnpm db:generate     # Generate database migrations
pnpm db:migrate      # Apply database migrations
```

Turborepo runs tasks across the workspaces and uses package dependencies to determine task order where configured.

## Development notes

- Add API input and output validation in the relevant tRPC route model and keep service validation close to the data operation.
- Keep authorization in server-side procedures and services. A client-side route or hidden button is not an authorization boundary.
- Form field order is stored in the numeric `index` column. Drag-and-drop reordering currently updates field indexes transactionally rather than using string-based fractional indexing.
- Form submissions are stored as JSON values associated with field IDs. The submissions view joins those IDs to the current field labels for display.
- Database model changes should be accompanied by a generated and reviewed migration.
