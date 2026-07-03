# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit frontend application called "jackbot-frontend" using Svelte 5 with TailwindCSS for styling. The project is configured with Node.js adapter for server-side deployment.

## Development Commands

- `npm run dev` - Start development server
- `npm run dev -- --open` - Start development server and open in browser
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run prepare` - Sync SvelteKit (runs automatically during install)

## Architecture

### Framework Stack
- **SvelteKit**: Full-stack framework with file-based routing
- **Svelte 5**: Component framework with new runes syntax (`$props()`, `$state()`, etc.)
- **TailwindCSS v4**: Utility-first CSS framework with Vite plugin
- **Vite**: Build tool and development server
- **Node.js Adapter**: For server-side deployment

### Project Structure
- `src/routes/` - SvelteKit pages and layouts using file-based routing
- `src/lib/` - Reusable components and utilities (importable via `$lib` alias)
- `src/app.css` - Global styles imported in root layout
- `static/` - Static assets served from root
- `svelte.config.js` - SvelteKit configuration with Node adapter
- `vite.config.js` - Vite configuration with TailwindCSS and SvelteKit plugins

### Key Conventions
- Uses Svelte 5 runes syntax: `let { children } = $props()` for component props
- Layout components use `{@render children()}` to render child content
- TailwindCSS classes for styling throughout the application
- JavaScript configuration files (not TypeScript, though jsconfig.json provides some type support)

## Important Notes

- This is a fresh SvelteKit project with minimal custom code currently implemented
- No testing framework is currently configured
- No linting or formatting tools are configured in package.json
- The project uses the latest Svelte 5 syntax and patterns