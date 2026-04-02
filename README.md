# antoni.us/wiriadjaja

Personal portfolio site for Antonius Wiriadjaja — artist, creative technologist, and educator based in New York City.

## Structure

A static HTML/CSS/JS portfolio with three sections plus an about page. All content is driven by JSON files — no HTML editing needed to add projects or update bio/CV.

```
portfolio/
  index.html          — Landing page with looping hero video
  art.html            — Art projects
  tech.html           — Creative tech work
  education.html      — Teaching areas
  about.html          — Bio, CV, pronunciation, contact
  project.html        — Universal project detail page (URL param driven)
  projects.json       — All project data
  about.json          — Bio, CV, and contact data
  style.css           — Global styles
  section.css         — Section page styles
  project.css         — Project detail styles
  about.css           — About page styles
  script.js           — Tagline cycling
  videos/             — Hero video files (MP4)
  images/             — Local fallback images
```

## Adding a Project

Open `projects.json` and add an entry to `art`, `tech`, or `education`:

```json
{
  "id": "my-project",
  "title": "Project Title",
  "year": "2025",
  "medium": "Medium / Format",
  "thumbnail": "https://...r2.dev/my-project/thumb.jpg",
  "hero": "https://...r2.dev/my-project/hero.jpg",
  "description": "A short description.",
  "list-title": "Heading for bulleted list",
  "list": ["Item one", "Item two"],
  "gallery": ["https://...r2.dev/my-project/01.jpg"],
  "exhibitions": ["Venue, City — Year"],
  "press": [
    { "title": "Article", "publication": "Publication", "url": "https://..." }
  ]
}
```

The project will automatically appear in the section grid and get its own detail page. Empty fields are hidden automatically.

## Image Hosting

Images are hosted on Cloudflare R2 and hotlinked directly in `projects.json`.

Recommended sizes:
- **Thumbnail**: 800 × 600px (4:3) — JPG
- **Hero**: 1400 × 600px — JPG
- **Gallery**: 800 × 800px (square) — JPG

## Updating the About Page

Edit `about.json` directly — no HTML needed. Fields:
- `bio` — array of paragraphs
- `pronunciation` — name and phonetic guide
- `contact` — email address
- `cv` — education, certifications, solo/group exhibitions, teaching, awards, press

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
