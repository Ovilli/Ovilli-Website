# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static portfolio website for Ovilli (ovilli.de). Vanilla HTML/CSS/JS — no build tools, no package manager, no test suite. Hosted on GitHub Pages with Cloudflare in front.

## Dev

No build step. Open `index.html` directly in browser, or use any static server.

Dev mode bypass (skips Cloudflare Turnstile CAPTCHA): add `?dev=1` query param, or run on `localhost`/`127.0.0.1`.

## Architecture

### Pages
- `index.html` — main portfolio (hero, about sections, contact)
- `olives.html` — standalone olive facts page
- `privacy.html`, `impressum.html` — legal pages
- `404.html` — custom error page

### CSS/JS
Single CSS file (`css/style.css`), single JS file (`js/index.js`). All logic lives in `index.js`.

### Key patterns in `js/index.js`

**Captcha gate**: Cloudflare Turnstile widget blocks the page on load. Token sent to `ovilli-captcha.mzlatin4.workers.dev` for verification. On success, `body.locked` class removed and content revealed. `isVerified` flag tracks state.

**i18n**: All UI text in `translations` object with `en`/`de` keys. `render()` repopulates the DOM when `currentLang` changes. Language toggle button in header switches between EN/DE. Preference is session-only (not persisted).

**About sections**: Dynamically generated from `translations[lang].sections` array in `render()` — not hardcoded in HTML.

**Scroll animations**: Intersection Observer triggers fade-in on content sections. Scroll progress bar and header hide/show on scroll via `scroll` event listener.

**Tendril canvas animation**: Physics-based Verlet integration canvas animation exists in code but is disabled (`initTendrils()` call is commented out).

### CI
`.github/workflows/purge-cache.yml` auto-purges Cloudflare cache on every push to `master`.
