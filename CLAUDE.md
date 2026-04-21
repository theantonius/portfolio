# Portfolio — Claude Session Context

Use this file to brief Claude at the start of a new session.

---

## Project Overview

Personal portfolio site for Antonius Wiriadjaja (antoni.us/wiriadjaja).
An artist, creative technologist, and educator based in New York City.
Tagline cycles through: think / teach / weird / grow / provocative / connect / matter / learn.

---

## File Structure

```
portfolio/
  index.html              — Landing page with looping hero video
  art.html                — /art section (project grid)
  tech.html               — /tech section (project grid)
  education.html          — /education section (project grid)
  about.html              — /about page (bio, CV, pronunciation, contact)
  project.html            — Universal project detail template (reads URL params)
  projects.json           — Compiled project data (do not edit directly)
  about.json              — Compiled about page data (do not edit directly)
  css/
    style.css             — Global styles (variables, landing page, shared)
    section.css           — Section page styles (sidebar, grid, cards)
    project.css           — Project detail page styles
    about.css             — About page styles
  js/
    script.js             — Tagline cycling
  content/
    about.md              — About page source (YAML frontmatter + markdown body)
    art/                  — Art project markdown files (01-foodmasku.md, etc.)
    tech/                 — Tech project markdown files
    education/            — Education project markdown files
  scripts/
    build.js              — Node.js build script: compiles content/*.md → projects.json + about.json
  videos/                 — Store MP4 files here for hero cycling
  images/                 — Local fallback images (most images now on Cloudflare R2)
  CLAUDE.md               — This file
  README.md               — GitHub README
  package.json            — npm scripts (npm run build)
```

---

## Sections

Three main sections plus about:
- **/art** — art projects (accent: golden yellow `#f0c030`)
- **/tech** — creative tech work, tools, fabrication (accent: lavender `#c880e8`)
- **/education** — teaching areas (accent: mint green `#70d882`)
- **/about** — bio, CV, pronunciation, contact (accent: light grey `#cccccc`)

---

## Design Decisions

### Colors
- Sidebar/panel background: `#1f1f1f`
- Content area background: `#fafafa` (light, gallery-style)
- Accent colors:
  - /art → `#f0c030` (golden yellow)
  - /tech → `#c880e8` (lavender)
  - /education → `#70d882` (mint green)
  - /about → `#cccccc` (light grey)
- Contact links hover: `#cccccc` (light grey)
- Sidebar width: `300px` (consistent across all pages)

### Fonts
- Headlines: Raleway 700 (Google Fonts)
- Body: Roboto 400/500 (Google Fonts)
- Loaded via Google Fonts link in each HTML file's `<head>`

### Layout
- Landing page: dark sidebar (right) + full-bleed looping hero video (left)
- Section pages: dark sidebar (left) + light content area `#fafafa` with project grid (right)
- Project detail page: same sidebar (left) + full project info (right)
- All sidebars are identical: name (links to index), tagline, about blurb, nav links, contact links
- Sidebar gap: `36px` (matches landing panel exactly)
- Mobile: content area floats to top (`order: -1`), sidebar below — applies to all pages

### Hero Video (index.html)
- Single looping Dropbox-hosted MP4 (autoplay, muted, loop, playsinline)
- Direct link uses `raw=1` param for streaming
- Plan: cycle randomly between multiple videos with crossfade
- Videos stored in `videos/` folder
- On mobile: hero appears above the sidebar panel; top of video cropped (`object-position: center 75%`)

### Images
- Hosted on Cloudflare R2 — hotlinked directly in projects.json
- Base URL pattern: `https://pub-4dfc13c1f83c4042ab9ec7b1d414b6ee.r2.dev/[project]/[filename].jpg`
- Recommended sizes:
  - Thumbnail: 800 × 600px (4:3) — JPG
  - Hero: 1400 × 600px (~7:3) — JPG
  - Gallery: 800 × 800px (1:1) — JPG
  - Use PNG only for images with transparency

---

## Content Authoring System

Content is written in Markdown and compiled to JSON via `npm run build`. Never edit `projects.json` or `about.json` directly — they are generated files.

### Adding or editing a project

Create or edit a `.md` file in `content/art/`, `content/tech/`, or `content/education/`. Files are numbered for ordering (e.g. `01-foodmasku.md`).

```markdown
---
id: my-project
title: Project Title
year: "2025"
medium: Medium / Format
thumbnail: https://...r2.dev/project/thumb.jpg
hero: https://...r2.dev/project/hero.jpg
list-title: Heading for bulleted list
list:
  - Bullet one
  - Bullet two
gallery:
  - thumb: https://...r2.dev/project/01_thumb.jpg
    full: https://...r2.dev/project/01_full.jpg
exhibitions:
  - Venue, City — Year
press:
  - title: Article Title
    publication: Publication
    url: https://...
link: https://optional-external-link.com
---

Description text goes here as the markdown body.
```

Run `npm run build` after saving. No new HTML needed ever.
Card thumbnail falls back to `hero` if `thumbnail` is not set.
Empty fields are automatically hidden on the project page.

### Project page layout (top to bottom):
1. Back link (← /section)
2. Hero image (full width)
3. Title + year/medium meta
4. Description text
5. Bulleted list (list-title + list)
6. Exhibited at (exhibitions)
7. Press
8. Gallery grid (square crops)
9. External link (if present)

---

## About Page Data System

All about page content lives in `content/about.md`. YAML frontmatter holds structured data; the markdown body becomes the bio paragraphs. Run `npm run build` after editing.

```markdown
---
pronunciation:
  name: "..."
  guide: "..."
contact:
  email: hi@antoni.us
cv:
  education:
    - year: "..."
      entry: "..."
  certification: [...]
  solo: [...]
  group: [...]
  teaching: [...]
  awards: [...]
  press:
    - year: "..."
      entry: "..."
      publication: "..."
      url: "..."
---

Bio paragraph one.

Bio paragraph two.
```

CV sections with no entries are automatically hidden.

---

## Current Projects (content/)

### /art
- foodmasku (2020–2025) — Performance, Photography, Video and Food
- Post Papa (2025)
- Since the Shooting (2023)
- We Become XYZ (2019)
- Other Work (2009–2019)

### /tech
- Computerized Embroidery
- 3D Printing
- CNC Router
- Big Screens
- Vinyl Cutter
- Laser Cutter
- Electronics Prototyping
- Sewing and E-Textiles
- Computer-Aided Design (CAD)

### /education
- Creative Code
- Physical Computing
- Digital Fabrication
- Thesis & Concept
- Robotics

---

## Things Still To Do

- [ ] Fill in descriptions, lists, and gallery images in content/*.md files
- [ ] Add more Cloudflare R2 images for tech and education projects
- [ ] Add more videos to videos/ folder and build crossfade cycling JS
- [ ] Confirm LinkedIn URL (currently linkedin.com/in/theantonius)
- [ ] Fill in real CV data in content/about.md (solo/group exhibitions, certifications, press)
- [ ] Consider adding CV download link on about page
- [ ] Test on real mobile devices
- [ ] Future: build modal overlay for project detail (discussed, deferred)

---

## Key CSS Variables (style.css)

```css
--sidebar-width: 300px;
--sidebar-bg: #1f1f1f;
--sidebar-text: #f0f0f0;
--accent: #e05c00;
--content-bg: #fafafa;
--font: 'Roboto', Arial, sans-serif;
--font-heading: 'Raleway', Arial, sans-serif;
```
