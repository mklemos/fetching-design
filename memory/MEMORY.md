# Fetching Design - Project Memory

## Current Status
- **Phase**: Project scaffolding complete, ready for development
- **Live URL**: https://fetching.design (placeholder page served from nginx inline HTML)
- **SSL**: Valid until 2026-05-26

## Infrastructure
- Vultr VPS: 140.82.22.132 (SSH alias: vultr-vista)
- Nginx proxy config: `/home/max/interview-prep/nginx_unified.conf`
- DNS: GoDaddy, A record @ -> 140.82.22.132, CNAME www -> fetching.design
- Disk usage on server: 85% (11G free) - consider pruning Docker images before adding more containers

## Decisions Made
- Domain: fetching.design for portfolio, team-builder moved to team-builder.fetching.design
- Tech stack: TBD (likely Next.js or Astro + Tailwind + TypeScript + bun)

## Projects to Showcase
- Team Builder (team-builder.fetching.design) - classroom team formation tool
- Interview Prep (interview.fetching.design) - AI interview practice
- EOTECH IP Scout (eoscout.fetching.design) - patent/IP research tool
- Vista Group (vistagroup.fetching.design) - WordPress site
- Allura (port 3000) - details TBD
- Marin Private AI (marinprivateai.com) - separate domain

## Open Questions
- Final tech stack decision
- Design direction (minimal, bold, etc.)
- Whether to include blog/writing section
- Contact form vs. simple email link
- Whether to include pricing/services section
