# Fetching Design - Project Instructions

## Project Overview

**Name**: Fetching Design
**Type**: Portfolio / boutique web application development site
**Domain**: fetching.design (live), www.fetching.design
**Hosting**: Vultr VPS (140.82.22.132), Docker Compose, Nginx reverse proxy
**DNS**: GoDaddy (fetching.design)

## Purpose

Personal portfolio and boutique web development agency site for Max Lemos. Showcases web application projects (team-builder, interview-prep, eoscout, vista group, etc.) and positions fetching.design as a professional brand for custom web application development.

## Architecture

This is a static/SSR portfolio site. Tech stack TBD but likely:
- Framework: Next.js or Astro (SSR/SSG)
- Styling: Tailwind CSS
- Language: TypeScript (strict mode)
- Package manager: bun
- Deployment: Docker on Vultr, behind nginx reverse proxy

```
src/
├── app/            # Pages and layouts
├── components/     # Reusable UI components
├── content/        # Portfolio content (projects, case studies)
├── lib/            # Utilities and helpers
└── styles/         # Global styles and Tailwind config
```

## Infrastructure

### Vultr Server (140.82.22.132)

SSH: `ssh vultr-vista` (user: max, key: id_ed25519)

The server runs a unified nginx reverse proxy (`interview-prep-proxy` container) that routes all subdomains:

| Domain | App |
|--------|-----|
| fetching.design / www.fetching.design | **This site** (portfolio) |
| team-builder.fetching.design | Team Builder |
| interview.fetching.design | Interview Prep |
| eoscout.fetching.design | EOTECH IP Scout |
| vistagroup.fetching.design | Vista Group WordPress |

**Proxy config**: `/home/max/interview-prep/nginx_unified.conf` on the server
**SSL**: Let's Encrypt via certbot Docker container, webroot at `/home/max/interview-prep/certbot-webroot/`
**Important**: After editing nginx_unified.conf, you must `sudo docker restart interview-prep-proxy` (not just reload) because the config is a bind-mounted file and sed/scp creates a new inode.

### DNS (GoDaddy)

Nameservers: ns03/ns04.domaincontrol.com
All subdomains are A records pointing to 140.82.22.132.

## Deployment

Currently the root domain serves an inline HTML placeholder from the nginx config. Once the site is built:

1. Build the site locally or in CI
2. Create a Docker container (or serve static files)
3. Add an upstream in nginx_unified.conf
4. Update the fetching.design server block to proxy to the new container
5. Restart the proxy container

## Conventions

### Code Style
- TypeScript strict mode
- Prefer `const` over `let`
- Use named exports
- Maximum function length: 30 lines
- Prettier for formatting (on save via hook)

### Naming
- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- CSS: Tailwind utility classes, BEM for custom CSS if needed

### Git
- Branch format: `feature/<description>` or `fix/<description>`
- Commit format: Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.)
- PR required for main branch
- Never commit secrets, .env files, or node_modules

### Content
- Project descriptions should be concise and outcome-focused
- Use real metrics where available (users, performance, tech stack)
- Images should be optimized (WebP, lazy-loaded)

## SEO Requirements

This is a public-facing portfolio site. SEO matters:
- Unique title tags and meta descriptions on every page
- Single H1 per page matching primary keyword intent
- Structured data (LocalBusiness, Person, WebSite schemas)
- Clean permalink slugs
- XML sitemap
- Core Web Vitals: optimize LCP, INP, CLS
- Mobile-first responsive design
- HTTPS enforced (already handled by nginx)

## Testing

- Framework: Vitest (or Playwright for e2e)
- Run: `bun test`
- Coverage target: 80% for utility code
- E2E tests for critical user flows (navigation, contact form)

## Commands

```bash
bun dev          # Development server
bun build        # Production build
bun test         # Run tests
bun lint         # Lint code
```

## Working Guidelines

- Check `memory/MEMORY.md` before starting work to understand current status
- Update `memory/MEMORY.md` after meaningful progress
- Run `bun build` before declaring work complete
- Test on mobile viewport before pushing UI changes
