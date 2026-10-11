# Newsletter Subscribe

A newsletter signup site built with React and Express. Visitors submit an email
address, receive a confirmation link, and become active subscribers after
confirming it. Subscriber records are stored in PostgreSQL.

![Newsletter subscribe preview](newsletter-subscribe-preview.png)

## Technology

- React 19, TypeScript, Vite, and Tailwind CSS
- Node.js 24, Express 5, and TypeScript
- PostgreSQL with Drizzle ORM
- Resend for confirmation and welcome emails
- Google Cloud Pub/Sub for asynchronous email delivery when running in GCP mode

## Requirements

- Node.js 24 and pnpm
- PostgreSQL database
- Resend account
- [go-task](https://taskfile.dev/) to run both apps together

For Resend testing mode, the recipient must be the email address associated
with your Resend account. To send to other recipients, verify a domain you own
in Resend and use a sender address on that domain.

## Local setup

Install dependencies in each app:

```bash
cd server && pnpm install
cd ../web && pnpm install
```

Create `server/.env` using `server/.env.example`. Set `DATABASE_URL` to your
PostgreSQL connection string, and configure `RESEND_API_KEY` and
`RESEND_SENDER`. The development defaults use local delivery through Resend
(`PUBSUB_MODE=local`), so Google Cloud credentials are not needed.

Create `web/.env`:

```env
APP_ENV="development"
APP_PORT="5174"
VITE_APP_API_URL="http://localhost:8080/v1"
```

Start the frontend and backend from the repository root:

```bash
task dev
```

The site runs at `http://localhost:5174`, and the API runs at
`http://localhost:8080`. The frontend calls `VITE_APP_API_URL` directly, so
include `/v1` in its value to match the API routes. The Vite config also has an
`/api` proxy, but the current frontend does not use it when
`VITE_APP_API_URL` is set. Wait for both apps to report ready before testing
the signup flow.

## Database

Set `DATABASE_URL` in `server/.env`, then apply the existing migrations:

```bash
cd server
pnpm run migrate
```

After changing the Drizzle schema, generate and apply a migration:

```bash
cd server
pnpm run generate
pnpm run migrate
```

## Signup and email flow

1. `POST /v1/newsletter/subscribe` validates and stores a pending subscriber.
2. The API sends a confirmation email through Resend. In local mode this is
   direct; in GCP mode the API publishes a Pub/Sub message.
3. The email link opens the frontend at `/confirm-email`, which posts the email
   and token to `POST /v1/newsletter/confirm-email`.
4. The API confirms the subscriber and sends a welcome email. In local mode it
   is sent directly; in GCP mode a second Pub/Sub topic handles it.

API routes:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/v1/healthz` | Health check |
| `POST` | `/v1/newsletter/subscribe` | Start or reissue a subscription |
| `POST` | `/v1/newsletter/confirm-email` | Confirm a pending subscription |
| `POST` | `/v1/newsletter/send-confirm-email` | Pub/Sub push endpoint for confirmation emails |
| `POST` | `/v1/newsletter/send-welcome-email` | Pub/Sub push endpoint for welcome emails |

## Tests and builds

Server:

```bash
cd server
pnpm exec vitest run
pnpm build
pnpm lint
```

Frontend:

```bash
cd web
pnpm run build
pnpm lint
```

## Deployment

The intended layout is a Vercel-hosted static frontend and a Render-hosted
Express API. Use separate environment settings for each deployment. Do not
commit `.env` files, API keys, database credentials, or service-account keys.

### Frontend on Vercel

Set the Vercel project root to `web`, build command to `pnpm run build`, and
output directory to `dist`. Configure this build environment variable:

```env
VITE_APP_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/v1
```

The frontend uses this value as the API base URL. If it is missing, it falls
back to `/api`, which needs a working proxy or rewrite to the backend. The
current `web/vercel.json` has a misspelled `rewites` key, so Vercel will not
apply its intended SPA fallback. Correct it to `rewrites` before relying on
that config for deep links such as `/confirm-email`. A basic SPA fallback is:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### API on Render

Set the Render service root to `server`, build command to
`pnpm install --frozen-lockfile && pnpm run build`, and start command to
`pnpm start`. Configure:

| Variable | Production value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | Use the port supplied by Render |
| `DATABASE_URL` | Production PostgreSQL connection string |
| `GCP_PROJECT_ID` | Google Cloud project ID |
| `PUBSUB_MODE` | `gcp` |
| `PUBSUB_VERIFICATION_TOKEN` | Long random secret (currently required by config; push handlers do not yet validate it) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to the Google service-account JSON secret file on Render |
| `APP_URL` | Public Vercel site URL used in email links |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_SENDER` | Address on a domain verified in Resend |

Run database migrations against the production database before opening
signups. The Express API currently enables permissive CORS; if calling the API
directly from a browser, restrict allowed origins to the deployed frontend.

### Google Cloud Pub/Sub

In GCP mode, topic names include the `NODE_ENV` suffix. With production
configuration, create:

- `newsletter-subscribe-production`
- `newsletter-email-confirmed-production`

Configure push subscriptions to call the corresponding Render HTTPS endpoints:

- `https://YOUR-RENDER-SERVICE.onrender.com/v1/newsletter/send-confirm-email`
- `https://YOUR-RENDER-SERVICE.onrender.com/v1/newsletter/send-welcome-email`

Provide the Render API with Google Application Default Credentials for a
service account that can publish to the topics. Store credentials using
Render's secret-file mechanism (not in the repository or ordinary source
files). The push endpoints currently validate payload shape but do **not**
authenticate the Pub/Sub caller; secure them before enabling public production
delivery.

## Before accepting public signups

- Add authentication for Pub/Sub push requests.
- Add an unsubscribe endpoint (the database has unsubscribe fields, but no
  current API route implements unsubscribing).
- Add rate limiting and abuse protection to public endpoints.
- Fix the `rewites` spelling in `web/vercel.json` before relying on Vercel SPA
  fallback routing.
