const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.join(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');

const R2 = 'https://pub-4dfc13c1f83c4042ab9ec7b1d414b6ee.r2.dev/';

// Expand a bare path like "postpapa/thumb.jpg" to a full R2 URL.
// Leaves http:// URLs and images/ local paths untouched.
function r2(val) {
  if (!val) return val;
  if (typeof val === 'string') {
    if (val.startsWith('http') || val.startsWith('images/')) return val;
    return R2 + val;
  }
  // gallery array — each item is a string or { thumb, full, caption }
  if (Array.isArray(val)) {
    return val.map(item => {
      if (typeof item === 'string') return r2(item);
      return { ...item, thumb: r2(item.thumb), full: r2(item.full) };
    });
  }
  return val;
}

function readSection(section) {
  const dir = path.join(CONTENT, section);
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
      return {
        ...data,
        thumbnail: r2(data.thumbnail),
        hero: r2(data.hero),
        description: content.trim(),
        list: data.list || [],
        gallery: r2(data.gallery || []),
        exhibitions: data.exhibitions || [],
        press: data.press || [],
      };
    });
}

// Build projects.json
const projects = {
  art: readSection('art'),
  tech: readSection('tech'),
  education: readSection('education'),
};
fs.writeFileSync(
  path.join(ROOT, 'projects.json'),
  JSON.stringify(projects, null, 2)
);
console.log('✓ projects.json');

// Build about.json
const { data, content } = matter(fs.readFileSync(path.join(CONTENT, 'about.md'), 'utf8'));
const about = {
  photo: r2(data.photo) || null,
  pronunciation: {
    name: data.pronunciation_name,
    guide: data.pronunciation_guide,
  },
  bio: content.trim().split(/\n\n+/).filter(Boolean),
  contact: { email: data.contact_email },
  cv: data.cv || {},
};
fs.writeFileSync(
  path.join(ROOT, 'about.json'),
  JSON.stringify(about, null, 2)
);
console.log('✓ about.json');

// Build recent.json (landing page "Recently" highlights)
const recentSrc = matter(fs.readFileSync(path.join(CONTENT, 'recent.md'), 'utf8'));
const recent = {
  intro: recentSrc.data.intro || '',
  items: (recentSrc.data.items || []).map(i => ({
    lead: i.lead || '',
    detail: i.detail || '',
    link: i.link || '',
    date: i.date || '',
    image: r2(i.image || ''),
  })),
};
fs.writeFileSync(
  path.join(ROOT, 'recent.json'),
  JSON.stringify(recent, null, 2)
);
console.log('✓ recent.json');
