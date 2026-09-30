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
