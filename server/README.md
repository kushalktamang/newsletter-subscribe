# Blueprint For Express With Typescript

> An express with typescript template that I can use in every other project without starting from the start.

## Features

- **Structure**: Used for building project related to PERN stack
- **DATABASE**: PostgresSQL with Drizzle ORM
- **OXC**: Oxfmt for formatting and Oxlint for linting
- **Logging**: Winston for logging
- **Validation**: Zod for schema validation

## Quickstart

### Prerequisites

- Nodejs 22+
- typescript 7+

### Installation

1. Clone the repository

```bash
git clone https://github.com/kushalktamang/blueprint-express.git
cd blueprint-express
```

2. Install Dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
# From root directory
task dev
```

4. For database migration

```bash
task generate
task migration
```

5. Drizzle Studio

```bash
task studio
```

The API will be available at `http://localhost:8080`

### Google Cloud Pub/Sub

Local development defaults to direct email delivery through Resend, so it does
not require Google credentials. Configure a valid `RESEND_API_KEY` and a sender
address verified with Resend. To publish through Google Cloud Pub/Sub instead,
set `PUBSUB_MODE=gcp`, create the `newsletter-subscribe-development` topic in
the project configured by `GCP_PROJECT_ID`, and authenticate with Application
Default Credentials:

```bash
gcloud auth application-default login
gcloud config set project YOUR_GCP_PROJECT_ID
```

The authenticated account needs the Pub/Sub Publisher role on the project or
topic. In deployed environments, configure Application Default Credentials
using the platform's service identity instead of a local user login.

For GCP delivery, configure a Pub/Sub push subscription for that topic pointing
to the publicly reachable HTTPS endpoint `/v1/newsletter/send-confirm-email`.
The endpoint awaits Resend's result and returns an error response if delivery
fails, allowing Pub/Sub to retry.
