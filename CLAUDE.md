# Portfolio — Claude Session Context

Use this file to brief Claude at the start of a new session.

---

## Project Overview

Personal portfolio site for Antonius Wiriadjaja (antoni.us/wiriadjaja).
An artist, creative technologist, and educator based in New York City.
Tagline cycles through: think / teach / weird / grow / provocative / connect / matter / learn.

Live at: https://antoni.us (GitHub Pages, HTTPS enforced, custom domain via CNAME)

---

## File Structure

```
portfolio/
  index.html              — Landing page with looping hero video
  art.html                — /art section (project grid)
  tech.html               — /tech section (three-category tab layout)
  education.html          — /education section (project grid)
  about.html              — /about page (bio, CV, pronunciation, contact)
  project.html            — Universal project detail template (reads URL params)
  projects.json           — Compiled project data (do not edit directly)
  about.json              — Compiled about page data (do not edit directly)
  css/
    style.css             — Global styles (variables, landing page, shared, mobile touch targets)
    section.css           — Section page styles (sidebar, grid, cards)
    project.css           — Project detail page styles + lightbox modal
    about.css             — About page styles
  js/
    script.js             — Tagline cycling
  content/
    about.md              — About page source (YAML frontmatter + markdown body)
    art/                  — Art project markdown files (01-foodmasku.md, etc.)
    tech/                 — Tech project markdown files (with category field)
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
- **/tech** — creative tech capabilities, split into three categories (accent: lavender `#c880e8`)
- **/education** — courses and teaching (accent: mint green `#70d882`)
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
- Mobile nav links: vertical stack, 48px min touch targets, accent-colored left border per section

### Hero Video (index.html)
- Single looping Dropbox-hosted MP4 (autoplay, muted, loop, playsinline)
- Direct link uses `raw=1` param for streaming
- Plan: cycle randomly between multiple videos with crossfade
- Videos stored in `videos/` folder
- On mobile: hero appears above the sidebar panel; top of video cropped (`object-position: center 75%`)

### Images
- Hosted on Cloudflare R2 — hotlinked directly in markdown frontmatter
- Base URL pattern: `https://pub-4dfc13c1f83c4042ab9ec7b1d414b6ee.r2.dev/[project]/[filename].jpg`
- Recommended sizes:
  - Thumbnail: 800 × 600px (4:3) — JPG
  - Hero: 1400 × 600px (~7:3) — JPG
  - Gallery: 800 × 800px (1:1) — JPG
  - Use PNG only for images with transparency

### Lightbox (project.html)
- Gallery images show as square thumbnails in a grid
- Clicking a thumbnail opens a full-size image in a dark overlay modal
- Each gallery item supports separate thumb and full URLs:
  ```yaml
  gallery:
    - thumb: https://...r2.dev/project/01_thumb.jpg
      full: https://...r2.dev/project/01_full.jpg
  ```
- Left/right arrows to browse, Escape or click outside to close
- Counter shown at bottom (e.g. "2 / 6")
- Falls back gracefully if only a plain string URL is provided

---

## Content Authoring System

Content is written in Markdown and compiled to JSON via `npm run build`. Never edit `projects.json` or `about.json` directly — they are generated files.

### Adding or editing a project

Create or edit a `.md` file in `content/art/`, `content/tech/`, or `content/education/`. Files are numbered for ordering (e.g. `01-foodmasku.md`).

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
Year is optional — omit for tech and education entries (templates handle missing year gracefully).

### Project page layout (top to bottom):
1. Back link (← /section)
2. Hero image (full width)
3. Title + year/medium meta (year omitted if not set)
4. Description text
5. Bulleted list (list-title + list)
6. Exhibited at (exhibitions)
7. Press
8. Gallery grid (square thumbnails, click to open lightbox)
9. External link (if present)

---

## /tech Section — Category System

Tech entries require a `category` field. The /tech page has a sticky tab bar with three anchor sections:

- `category: fabrication` → Fabrication section
- `category: code` → Code & Creative Tools section
- `category: design` → Design & Media section

### Current /tech entries:

**Fabrication**
- Computerized Embroidery (Brother/Singer machines, digitization)
- 3D Printing (FDM, SLA)
- CNC Router (ShopBot, Fusion 360)
- Vinyl Cutter (Cricut, Illustrator)
- Laser Cutter (Epilog, Illustrator)
- Electronics Prototyping (Breadboarding, Soldering, Arduino)
- Sewing and E-Textiles (Soft Circuits, Smart Fabrics)

**Code & Creative Tools**
- Physical Computing / pcomp (Arduino, Raspberry Pi, Sensors)
- Creative Coding (JavaScript, p5.js, Three.js)
- Web Development (HTML, CSS, JavaScript)
- Big Screens (Large Format Video, openFrameworks)
- Workflow Automation (n8n, Monday.com, Webflow, Eventbrite)
- AI Tools & Workflows (Claude, ChatGPT, Flora, Generative Image Tools)
- Git & Version Control (Git, GitHub)
- Max/MSP (MIDI, Interactive Audio)

**Design & Media**
- CAD (Autodesk Fusion 360, Onshape)
- Adobe Suite (Illustrator certified, Premiere, After Effects, Express)
- Figma & UI Design (Figma, Prototyping, Wireframing)
- Photography & Lighting (DSLR, Studio Lighting)
- Video Editing & Production (Adobe Premiere, After Effects)
- Teaching & Curriculum Design (Hands-on Technical Education)

---

## /education Section — Course Entries

Education entries are individual courses/programs, not topic areas. No year field.
Medium describes the level and institution.

### Current /education entries:
1. **Fulbright Scholar** — New Media, Traditional Arts, Indonesia (2018–2019, Solo, Java)
2. **Talking Fabrics** — Graduate Course, ITP NYU / NYU Shanghai (ITP ×2, Shanghai ×3, 2015–2018)
3. **New Interfaces in Musical Expression (NIME)** — Graduate Course, NYU Shanghai (×2, 2015–2018)
4. **Interaction Lab** — Undergraduate Course, NYU Shanghai (2015–2018)
5. **Communications Lab** — Graduate Course, ITP NYU
6. **Creative Coding** — Undergraduate Course, Queens College CUNY
7. **Web Development** — Undergraduate Course, Queens College / BMCC (includes Advanced Web Dev)
8. **Multimedia Programming** — Undergraduate Course, BMCC
9. **Thesis** — Undergraduate Course, Queens College CUNY

NYU Shanghai: 2015–2018. Left for Fulbright 2018–2019.

---

## /art Section — Current Projects

- foodmasku (2020–2025) — Performance, Photography, Video and Food
- Post Papa (2025)
- Since the Shooting (2023)
- We Become XYZ (2019)
- Other Work (2009–2019)

---

## About Page Data System

All about page content lives in `content/about.md`. YAML frontmatter holds structured data; the markdown body becomes the bio paragraphs. Run `npm run build` after editing.

CV sections with no entries are automatically hidden.

---

## Git & Deployment

- Repo: github.com/theantonius/portfolio
- Branch: main
- Deployed via GitHub Pages with custom domain (CNAME: antoni.us)
- HTTPS enforced via GitHub Pages settings
- SSH configured on MacBook Air — push with just `git push`
- To push from Cowork session: not possible directly; commit here, then `git push` from terminal

---

## Things Still To Do

- [ ] Fill in descriptions in all content/*.md files
- [ ] Upload hero/thumbnail images to Cloudflare R2 for all tech and education entries
- [ ] Add gallery images (thumb + full) to art projects
- [ ] Add more videos to videos/ folder and build crossfade cycling JS
- [ ] Fill in real CV data in content/about.md (solo/group exhibitions, certifications, press)
- [ ] Consider adding CV download link on about page
- [ ] Test on real mobile devices
- [ ] Decide what to do with Teaching & Curriculum Design in /tech (odd fit in Design & Media)

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
