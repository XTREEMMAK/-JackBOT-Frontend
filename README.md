![JackBot Logo](https://jackbot.kjnet.us/images/JackBot_logo.webp)

# JackBOT-Frontend

A pirate-themed web chat frontend built with SvelteKit and Svelte 5. JackBOT provides an interactive chat interface that can hook into any webhook you provide, making it a versatile solution for chat applications with a swashbuckling twist.

## Technologies Used

- **SvelteKit**: Full-stack framework with file-based routing
- **Svelte 5**: Modern component framework with runes syntax
- **TailwindCSS v4**: Utility-first CSS framework
- **Vite**: Build tool and development server
- **Node.js Adapter**: For server-side deployment

## Features

- Pirate-themed chat interface
- Webhook integration for backend communication
- Responsive design with TailwindCSS
- Modern Svelte 5 architecture

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

JackBOT-Frontend ships as a Docker image, built and published automatically to the GitHub Container Registry (ghcr.io) by the `docker-publish.yml` GitHub Actions workflow on every push to `main` (or via manual `workflow_dispatch`). Provisioning and running the container on the target host is owned by a separate Ansible playbook, not by this repository — this repo's only job is to produce a correct, environment-agnostic image.

No repo secrets are required for this workflow — it authenticates to `ghcr.io` using the automatically-provided `GITHUB_TOKEN`.

> **One-time setup:** after the first successful workflow run, open the package's settings under the repo's (or `xtreemmak` account's) Packages tab and set its visibility to **Public**. Packages published via `GITHUB_TOKEN` default to private, and the Ansible playbook needs to `docker pull` without authenticating.

### Image

```
docker pull ghcr.io/xtreemmak/jackbot-frontend:latest
```

Tags published: `latest` (tracks `main`) and `sha-<short-git-sha>` (immutable, one per build).

### Required runtime environment variables

The image bakes in nothing environment-specific — every value below is read from the container's environment at startup or per-request, so the same image works in any environment just by changing how it's run.

| Variable | Required | Notes |
| --- | --- | --- |
| `WEBHOOK_URL` | yes | Backend webhook endpoint the chat forwards messages to. Server-side only, never sent to the browser. |
| `PUBLIC_APP_NAME` | yes | Shown in the page title and PWA meta tags. |
| `PUBLIC_APP_DESCRIPTION` | yes | Used for the page `<meta name="description">`. |
| `PUBLIC_THEME_COLOR` | yes | Used for `theme-color`/`msapplication-TileColor` meta tags, e.g. `#f0b034`. |
| `PORT` | no | Port the Node server listens on. Defaults to `3000`. |
| `HOST` | no | Interface to bind. Defaults to `0.0.0.0`. |
| `ORIGIN` | strongly recommended in production | Set to the public URL (e.g. `https://chat.example.com`) whenever the app sits behind a reverse proxy/load balancer. SvelteKit's CSRF origin check needs this to accept the chat `POST` request to `/api/webhook`; without it, requests can be rejected once the container isn't reached directly on its own hostname. |
| `BODY_SIZE_LIMIT` | no | adapter-node request body size limit override. |

See [`@sveltejs/adapter-node`'s environment variables](https://svelte.dev/docs/kit/adapter-node#environment-variables) for the full list adapter-node reads (all unprefixed, straight from `process.env`).

### Local development / smoke-testing with Docker

A minimal `docker-compose.yml` is included purely for local convenience — it is not used by CI and is not what the production Ansible playbook uses:

```bash
cp .env.example .env   # fill in real values
docker compose up --build
```

### Production

The production host pulls and runs the published image via this project's Ansible playbook, which supplies the environment variables above (e.g. via a templated env file or Ansible Vault) and owns real orchestration concerns (restart policy, reverse proxy, TLS, health checks). This repository's responsibility ends at "produces a working image."
