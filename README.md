# NextHireAI

AI Resume & Cover Letter Builder SaaS — Next.js (App Router) · TypeScript · Tailwind · Firebase · OpenAI · Cashfree.

This is the real production codebase, built in runnable layers. See [`../PLAN.md`](../PLAN.md) for the full architecture and phase plan.

## Build status

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Foundation: project setup, design tokens, **landing page** (hero + trust strip + footer), UI primitives, SEO | ✅ Done |
| 2 | Auth (Firebase): signup/login/Google/forgot/verify, protected routes, dashboard shell | ⏳ Next |
| 3 | Resume builder + templates + autosave (Firestore) | ⏳ |
| 4 | AI features (OpenAI) + cover letters | ⏳ |
| 5 | ATS checker + premium blur gating | ⏳ |
| 6 | Cashfree subscriptions + server-side verification + webhooks | ⏳ |
| 7 | PDF / DOCX downloads (gated) + premium templates | ⏳ |
| 8 | Support (contact/feedback/FAQ/help) + account | ⏳ |
| 9 | Hardening: rate limits, rules, a11y/SEO/perf | ⏳ |

## Prerequisites

1. **Node.js 20 LTS or newer** — install from https://nodejs.org (not currently installed on this machine).

## Getting started

```bash
# 1. install dependencies
npm install

# 2. set up environment
cp .env.example .env.local      # then fill in values (Firebase optional until Phase 2)

# 3. run the dev server
npm run dev                     # http://localhost:3000
```

The landing page renders with **no keys required**. Firebase / OpenAI / Cashfree
keys are only needed once their phases land.

## Project structure

```
src/
  app/            # routes (App Router) + globals.css (design tokens)
  components/
    ui/           # design-system primitives (Button, ...)
    landing/      # NavBar, Hero, MeshStage, TrustStrip, Footer
  lib/            # utils (firebase, ai, cashfree, etc. added per phase)
```

## Design system

All brand values from the original NextHireAI hero are defined as CSS variables
in `src/app/globals.css` and surfaced to Tailwind in `tailwind.config.ts`
(e.g. `bg-canvas`, `text-mute`, `rounded-lg`). Philosophy: single dark surface,
hairline borders, **no drop shadows**, one white CTA pill, Inter with `ss03`.
