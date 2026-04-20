const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.join(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');

function readSection(section) {
  const dir = path.join(CONTENT, section);
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
      return {
        ...data,
        description: content.trim(),
        list: data.list || [],
        gallery: data.gallery || [],
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
