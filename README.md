# antoni.us/wiriadjaja

Personal portfolio site for Antonius Wiriadjaja — artist, creative technologist, and educator based in New York City.

## Structure

A static HTML/CSS/JS portfolio with three sections plus an about page. Content is authored in Markdown and compiled to JSON — no HTML editing needed to add projects or update bio/CV.

```
portfolio/
  index.html              — Landing page with looping hero video
  art.html                — Art projects
  tech.html               — Creative tech work
  education.html          — Teaching areas
  about.html              — Bio, CV, pronunciation, contact
  project.html            — Universal project detail page (URL param driven)
  projects.json           — Compiled project data (do not edit directly)
  about.json              — Compiled about page data (do not edit directly)
  css/
    style.css             — Global styles and variables
    section.css           — Section page styles (sidebar, grid, cards)
    project.css           — Project detail page styles
    about.css             — About page styles
  js/
    script.js             — Tagline cycling
  content/
    about.md              — Bio, CV, and contact source
    art/                  — Art project markdown files
    tech/                 — Tech project markdown files
    education/            — Education project markdown files
  scripts/
    build.js              — Compiles content/*.md → projects.json + about.json
  videos/                 — Hero video files (MP4)
  images/                 — Local fallback images
```

## Adding a Project

Create a new `.md` file in the appropriate `content/` subfolder (e.g. `content/art/06-myproject.md`):

```markdown
---
id: my-project
title: Project Title
year: "2025"
medium: Medium / Format
thumbnail: https://...r2.dev/my-project/thumb.jpg
hero: https://...r2.dev/my-project/hero.jpg
list-title: Heading for bulleted list
list:
  - Item one
  - Item two
gallery:
  - thumb: https://...r2.dev/my-project/01_thumb.jpg
    full: https://...r2.dev/my-project/01_full.jpg
exhibitions:
  - Venue, City — Year
press:
  - title: Article
    publication: Publication
    url: https://...
---

A short description of the project goes here.
```

Then run the build script to compile to JSON:

```bash
npm run build
```

The project will automatically appear in the section grid and get its own detail page. Empty fields are hidden automatically.

## Image Hosting

Images are hosted on Cloudflare R2 and hotlinked directly in the markdown frontmatter.

Recommended sizes:
- **Thumbnail**: 800 × 600px (4:3) — JPG
- **Hero**: 1400 × 600px — JPG
- **Gallery**: 800 × 800px (square) — JPG

## Updating the About Page

Edit `content/about.md` — no HTML or JSON editing needed. The YAML frontmatter holds pronunciation, CV, and contact; the markdown body becomes the bio paragraphs. Run `npm run build` after saving.

CV sections with no entries are automatically hidden.

## Design

- Fonts: Raleway (headings) + Roboto (body) via Google Fonts
- Sidebar: `#1f1f1f`, width `300px`, consistent across all pages
- Content area: `#fafafa` (light, gallery-style)
- Section accent colors: golden yellow `/art`, lavender `/tech`, mint green `/education`
- Mobile: content area appears above sidebar on all pages

## Running Locally

The JSON fetch requires a local server. Use VS Code Live Server or:

```bash
npx serve .
```
