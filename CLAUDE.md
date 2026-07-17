# Portfolio — Claude Session Context

Use this file to brief Claude at the start of a new session.

---

## Project Overview

Personal portfolio site for Antonius Wiriadjaja (antoni.us/wiriadjaja).
An artist, creative technologist, and educator based in New York City.
Tagline cycles randomly through ~36 endings ("making things ___").

Live at: https://antoni.us (GitHub Pages, HTTPS enforced, custom domain via CNAME)

**July 2026 redesign: the site is now a ONE-PAGE portfolio.** All content lives
in `index.html` as scrollable sections. The old multi-page files remain only as
redirect stubs for legacy links.

---

## File Structure

```
portfolio/
  index.html              — THE site. One page, all sections
  art.html                — redirect stub → /#art
  tech.html               — redirect stub → /#tech
  education.html          — redirect stub → /#education
  about.html              — redirect stub → /#about
  project.html            — redirect stub; maps ?section=art&id=x → /#art/x
  projects.json           — Compiled project data (do not edit directly)
  about.json              — Compiled about page data (do not edit directly)
  recent.json             — Compiled Recently data (do not edit directly)
  css/
    site.css              — ALL styles (variables, nav, panels, modal, lightbox, responsive)
  js/
    site.js               — ALL behavior (data loading, rendering, tagline, scroll, modal, lightbox)
  content/
    about.md              — About source (YAML frontmatter + markdown body)
    recent.md             — Recently source
    art/                  — Art project markdown files (01-foodmasku.md, etc.)
    tech/                 — Tech entry markdown files (with category field)
    education/            — Education entry markdown files
  scripts/
    build.js              — Node.js build: compiles content/*.md → *.json (unchanged)
  images/                 — Local fallback images (most images on Cloudflare R2)
  CLAUDE.md               — This file
  package.json            — npm scripts (npm run build)
```

---

## One-Page Layout

Section order in `index.html`:

1. **Hero** (`#top`) — full-viewport dark `#1f1f1f`. Name + cycling tagline +
   intro (intro text comes from `recent.md` `intro` field), pinned top-left.
   Scroll hint bottom center. Staggered fade-in on load.
2. **Recently** (`#recently`, accent `#e05c00`) — list from `recent.json`.
3. **Art** (`#art`, accent `#f0c030`) — card grid. Clicking a card opens a
   slide-over **modal** (hero, description, list, exhibitions, press, gallery
   with lightbox, external link). Hash-routed: `/#art/foodmasku` is a
   shareable deep link. Escape / backdrop click / × closes.
4. **Tech** (`#tech`, accent `#c880e8`) — accordion rows grouped into
   Fabrication / Code & Creative Tools / Design & Media. Row head = title +
   medium; click expands description. No images, no detail pages.
5. **Education** (`#education`, accent `#70d882`) — plain list, title + medium.
   No detail pages.
6. **About** (`#about`, accent `#999`) — photo + name + pronunciation + bio +
   contact, then full CV in 2-column layout (1 col mobile). From `about.json`.
7. **Footer** — dark strip: name + Email / LinkedIn / GitHub.

### Navigation & scroll behavior

- Fixed top nav, hidden during hero, slides in after ~70% of hero is scrolled.
  Name left, section links right. Active link takes current section's accent.
- `--live` CSS variable on `:root` holds the current section accent (JS swaps
  it on scroll; scroll listener picks last section whose top passed the upper
  third of the viewport).
- Gentle snap: `scroll-snap-type: y proximity` on `html` (desktop only —
  disabled under 640px, where it fights long sections).
- Reveal animation: `.reveal` elements fade-up via IntersectionObserver;
  siblings stagger 70ms apart (capped at 8 steps). Respects
  `prefers-reduced-motion`.
- Mobile nav shrink: compresses when scrolling down, restores scrolling up.

### Data loading

`js/site.js` fetches `recent.json`, `projects.json`, `about.json` in parallel
on load and renders every section. No build change was needed — the markdown →
JSON pipeline is untouched.

### Legacy redirects

Old URLs keep working:
- `art.html` → `/#art` (same for tech/education/about)
- `project.html?section=art&id=foodmasku` → `/#art/foodmasku`
- `project.html?section=tech&id=*` → `/#tech` (tech/education details folded into sections)

---

## Design Decisions

### Colors
- Dark panels (hero, nav, footer): `#1f1f1f`
- Content background: `#fafafa`
- Accents: recently `#e05c00`, art `#f0c030`, tech `#c880e8`,
  education `#70d882`, about `#999999`
- All defined as CSS variables in `css/site.css` `:root`

### Fonts
- Headlines: Raleway 700 (Google Fonts)
- Body: Roboto 400/500 (Google Fonts)

### Images
- Hosted on Cloudflare R2 — hotlinked in markdown frontmatter
- Base URL: `https://pub-4dfc13c1f83c4042ab9ec7b1d414b6ee.r2.dev/[project]/[filename].jpg`
- Newer images use `https://img.antoni.us/...`
- Recommended sizes: thumbnail 800×600 (4:3), hero 1400×600, gallery 800×800,
  recently banners 1200×675 (16:9)
- All rendered images use `loading="lazy"` except modal hero
- Only art cards (5), recently banners, and the about photo load with the page;
  tech and education render no images

### Art modal gallery / lightbox
- Gallery items: plain string URL or `{ thumb, full, caption }`
- Lightbox: arrows/keys to browse, Escape or click outside to close, counter +
  optional caption

---

## Content Authoring System (unchanged)

Content is markdown, compiled to JSON via `npm run build`. Never edit
`projects.json`, `about.json`, or `recent.json` directly.

### Adding or editing a project

Create/edit a `.md` file in `content/art/`, `content/tech/`, or
`content/education/`. Files are numbered for ordering (e.g. `01-foodmasku.md`).

```markdown
---
id: my-project
title: Project Title
year: "2025"          # omit for tech/education entries
medium: Medium / Format
category: fabrication # tech only: fabrication | code | design
thumbnail: https://...r2.dev/project/thumb.jpg
hero: https://...r2.dev/project/hero.jpg
list-title: Heading for bulleted list
list:
  - Bullet one
gallery:
  - thumb: https://...r2.dev/project/01_thumb.jpg
    full: https://...r2.dev/project/01_full.jpg
    caption: Optional caption
exhibitions:
  - Venue, City — Year
press:
  - title: Article Title
    publication: Publication
    url: https://...
link: https://optional-external-link.com
---

Description text as the markdown body. Blank lines split paragraphs.
```

Run `npm run build` after saving.

**Where fields surface now:**
- Art: everything surfaces in the modal.
- Tech: `title`, `medium`, `category`, `description` surface on the page.
  Thumbnails/heroes/galleries in tech markdown are currently unused (kept in
  the data for the future).
- Education: only `title` and `medium` surface. Everything else unused.

### Recently (`content/recent.md`)

```markdown
---
intro: One-line blurb — ALSO used as the hero intro paragraph.
items:
  - lead: Short punchy headline
    date: May 2026         # optional
    detail: One-sentence detail.
    link: art.html         # optional; legacy page links auto-map to hashes
    image: https://...     # optional 16:9 banner
---
```

- Legacy `link` values (`art.html`, `project.html?section=art&id=x`) are
  mapped to hash links (`#art`, `#art/x`) at render time — old values keep
  working.
- Order most career-forward first; aim for ~6 items, 3-4 images max.

### About (`content/about.md`)

YAML frontmatter (photo, pronunciation, contact, cv sections) + markdown body
→ bio paragraphs. Empty CV sections auto-hide.

---

## /tech Categories

`category:` field required on tech entries:
- `fabrication` → Fabrication
- `code` → Code & Creative Tools
- `design` → Design & Media

Current entries: 21 across the three groups (embroidery, 3D printing, CNC,
vinyl, laser, electronics, e-textiles / pcomp, creative coding, web, big
screens, automation, AI tools, git, Max/MSP / CAD, Adobe, Figma, photography,
video, teaching).

---

## /education Entries

Individual courses/programs, no year field. Medium = level + institution.
Current: Fulbright, Talking Fabrics, NIME, Interaction Lab, Comms Lab,
Creative Coding, Web Development, Multimedia Programming, Thesis.

---

## Git & Deployment

- Repo: github.com/theantonius/portfolio — branch: main
- GitHub Pages, custom domain (CNAME: antoni.us), HTTPS enforced
- SSH configured on MacBook Air — push with just `git push`
- From Cowork session: commit here, then `git push` from terminal

---

## Things Still To Do

- [ ] Test the one-pager on real mobile devices
- [ ] Fill in remaining description text in content/*.md (education entries especially)
- [ ] Add gallery images (thumb + full) to remaining art projects
- [ ] Consider a CV download link in the about section
- [ ] Consider OpenGraph/social preview image in index.html head
