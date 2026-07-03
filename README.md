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

To deploy JackBOT-Frontend, follow these steps:

1. Copy `package.json` and `package-lock.json` to your deployment environment
2. Set up your environment variables in a `.env` file
3. Install dependencies with `npm install`
4. Build the production version with `npm run build`

> The app uses the Node.js adapter for server-side deployment. Make sure your deployment environment supports Node.js.
