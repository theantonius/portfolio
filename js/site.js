/* ==========================================================
   antoni.us — one-page portfolio
   Data loading, rendering, scroll behavior, art modal, lightbox
   ========================================================== */

// ================================
// CYCLING TAGLINE
// ================================
const endings = [
  "think.", "that teach.", "weird.", "provocative.", "for connection.",
  "matter.", "learn.", "feel.", "move.", "see.", "glow.", "strange.",
  "listen.", "remember.", "talk back.", "for people.", "with purpose.",
  "for change.", "that resist.", "that breathe.", "ask questions.",
  "cringe.", "for bodies.", "uncomfortable.", "linger.", "with care.",
  "that confuse.", "perform.", "eat.", "edible.", "for survival.",
  "love.", "make love.", "queer.", "for joy.", "for fun.",
];

const cycleEl = document.getElementById("tagline-cycle");

if (cycleEl) {
  let last = -1;
  const showNext = () => {
    cycleEl.style.opacity = 0;
    setTimeout(() => {
      let next;
      do { next = Math.floor(Math.random() * endings.length); } while (next === last);
      last = next;
      cycleEl.textContent = endings[next];
      cycleEl.style.opacity = 1;
    }, 500);
  };
  setTimeout(() => {
    showNext();
    setInterval(showNext, 3000);
  }, 1200);
}

// ================================
// INTERNAL LINK MAPPING (legacy → hash)
// ================================
function mapLink(link) {
  if (!link) return "";
  if (/^https?:\/\//.test(link)) return link;
  const m = link.match(/^project\.html\?section=art&id=([\w-]+)/);
  if (m) return "#art/" + m[1];
  return link
    .replace(/^index\.html.*/, "#top")
    .replace(/^art\.html.*/, "#art")
    .replace(/^tech\.html.*/, "#tech")
    .replace(/^education\.html.*/, "#education")
    .replace(/^about\.html.*/, "#about");
}

// ================================
// RENDERERS
// ================================
const projectsBySection = { art: [], tech: [], education: [] };
let featuredIds = new Set();

// Silent card loops retain still posters for reduced motion and failed playback.
const previewMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const previewObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.dataset.inView = String(entry.isIntersecting);
  });
  syncPreviewPlayback();
});

function syncPreviewPlayback() {
  document.querySelectorAll("video[data-preview]").forEach(video => {
    const play = video.dataset.inView === "true" &&
      !previewMotion.matches && !document.hidden && !modal.classList.contains("open");
    if (play) video.play().catch(() => {}); // Poster stays visible if autoplay is blocked.
    else video.pause();
  });
}

document.addEventListener("visibilitychange", syncPreviewPlayback);
previewMotion.addEventListener("change", syncPreviewPlayback);

function wirePreviews(container) {
  container.querySelectorAll("video[data-preview]").forEach(video => previewObserver.observe(video));
}

function previewHtml(src, poster, title) {
  if (!src || previewMotion.matches) {
    return poster ? `<img src="${poster}" alt="${title}" loading="lazy" />` : "";
  }
  return `<video data-preview muted loop playsinline preload="none" poster="${poster || ""}" aria-hidden="true" tabindex="-1"><source src="${src}" type="video/mp4" /></video>`;
}

// one card: image/video (or placeholder block) + title + summary
function cardHtml(p, section, opts = {}) {
  const img = opts.image || p.thumbnail || p.hero;
  const title = opts.title || p.title;
  const thumb = previewHtml(p.previewVideo, img, p.title)
    || `<span class="card-placeholder">${title}</span>`;
  return `
    <button class="art-card reveal${opts.big ? " feat-big" : ""}" data-section="${section}" data-id="${p.id}" aria-haspopup="dialog">
      <div class="art-card-thumb">${thumb}</div>
      <h3>${title}</h3>
      <p>${p.summary ? p.summary : (p.year ? p.year + " — " : "") + p.medium}</p>
    </button>`;
}

function wireCards(container) {
  wirePreviews(container);
  container.querySelectorAll(".art-card").forEach(card => {
    card.addEventListener("click", () => {
      const s = card.dataset.section;
      location.hash = s === "education" ? "#education" : "#" + s + "/" + card.dataset.id;
    });
  });
}

function renderFeatured(featured) {
  const intro = document.getElementById("hero-intro");
  if (intro && featured.intro) intro.textContent = featured.intro;

  const L = featured.links || {};
  const links = [
    L.resume   && `<a href="${L.resume}" target="_blank" rel="noopener">Résumé</a>`,
    L.email    && `<a href="mailto:${L.email}">Email</a>`,
    L.linkedin && `<a href="${L.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`,
    L.github   && `<a href="${L.github}" target="_blank" rel="noopener">GitHub</a>`,
  ].filter(Boolean);
  document.getElementById("hero-links").innerHTML = links.join('<span class="sep">·</span>');

  // featured items don't repeat in their own section grid
  featuredIds = new Set((featured.items || []).map(i => i.section + "/" + i.id));
  const grid = document.getElementById("featured-grid");
  grid.innerHTML = (featured.items || []).map(item => {
    const p = (projectsBySection[item.section] || []).find(x => x.id === item.id);
    return p ? cardHtml(p, item.section, item) : "";
  }).join("");
  wireCards(grid);

}

function renderRecently(data) {
  if (data.intro) {
    const intro = document.getElementById("hero-intro");
    if (intro) intro.textContent = data.intro;
  }
  const list = document.getElementById("recent-list");
  if (!list) return; // Recently section removed from the page (Oct 2026)
  list.innerHTML = (data.items || []).map(i => {
    const link = mapLink(i.link);
    const external = /^https?:\/\//.test(link);
    const lead = link
      ? `<a class="recent-lead recent-link" href="${link}"${external ? ' target="_blank" rel="noopener"' : ""}>${i.lead}</a>`
      : `<span class="recent-lead">${i.lead}</span>`;
    const date = i.date ? `<span class="recent-date">${i.date}</span>` : "";
    const image = i.image ? `<img class="recent-thumb" src="${i.image}" alt="" loading="lazy" />` : "";
    return `
      <li class="recent-item reveal">
        ${image}
        ${date}
        ${lead}
        <span class="recent-detail">${i.detail}</span>
      </li>`;
  }).join("");
}

function renderArt(projects) {
  const grid = document.getElementById("art-grid");
  grid.innerHTML = projects.filter(p => !featuredIds.has("art/" + p.id)).map(p => cardHtml(p, "art")).join("");
  wireCards(grid);
}

function renderTechProjects(projects) {
  const grid = document.getElementById("tech-grid");
  if (!grid) return; // /tech section parked (Oct 2026)
  grid.innerHTML = projects.filter(p => p.category === "project" && !featuredIds.has("tech/" + p.id)).map(p => cardHtml(p, "tech")).join("");
  wireCards(grid);
}

function renderTech(projects) {
  const groups = {
    code:        { title: "Code & Creative Tools", items: [] },
    fabrication: { title: "Fabrication", items: [] },
    design:      { title: "Design & Media", items: [] },
  };
  // optional rank: puts priority skills first; the rest keep file order
  const ranked = projects.map((p, i) => ({ p, i }))
    .sort((a, b) => (a.p.rank || 999) - (b.p.rank || 999) || a.i - b.i)
    .map(x => x.p);
  ranked.forEach(p => { if (groups[p.category]) groups[p.category].items.push(p); });

  const wrap = document.getElementById("tech-groups");
  wrap.innerHTML = Object.values(groups).map(g => `
    <div class="tech-group">
      <h3 class="tech-group-title reveal">${g.title}</h3>
      ${g.items.map(p => {
        const desc = (p.description || "")
          .split(/\n\n+/)
          .filter(Boolean)
          .map(para => `<p>${para}</p>`)
          .join("");
        const photo = p.photo
          ? `<img class="tech-row-photo" data-src="${p.photo}" alt="${p.title}" />`
          : "";
        return `
        <div class="tech-row reveal">
          <button class="tech-row-head" aria-expanded="false">
            <span class="tech-row-title">${p.title}</span>
            <span class="tech-row-medium">${p.medium}</span>
            <span class="tech-row-chevron">▾</span>
          </button>
          <div class="tech-row-body">
            <div class="tech-row-body-inner">
              ${photo}
              <div class="tech-row-desc">${desc}</div>
            </div>
          </div>
        </div>`;
      }).join("")}
    </div>
  `).join("");

  wrap.querySelectorAll(".tech-row-head").forEach(head => {
    head.addEventListener("click", () => {
      const row = head.parentElement;
      const open = row.classList.toggle("open");
      head.setAttribute("aria-expanded", open);
      // load the photo only on first expand — keeps initial page light
      const photo = row.querySelector(".tech-row-photo[data-src]");
      if (open && photo) {
        photo.src = photo.dataset.src;
        photo.removeAttribute("data-src");
      }
    });
  });
}

function renderEducation(projects) {
  const list = document.getElementById("edu-list");
  list.innerHTML = projects.map(p => `
    <li class="edu-item reveal">
      <h3>${p.title}</h3>
      <p>${p.medium}</p>
    </li>
  `).join("");
}

function renderAbout(data) {
  const cvSections = [
    { key: "education",     label: "Education" },
    { key: "certification", label: "Certifications" },
    { key: "solo",          label: "Solo Exhibitions" },
    { key: "group",         label: "Group Exhibitions" },
    { key: "film",          label: "Film" },
    { key: "teaching",      label: "Teaching" },
    { key: "awards",        label: "Awards & Residencies" },
    { key: "publications",  label: "Publications" },
    { key: "press",         label: "Press" },
  ];

  const cvHtml = cvSections.map(({ key, label }) => {
    const items = data.cv[key];
    if (!items || items.length === 0) return "";
    const rows = items.map(item => {
      const entryHtml = item.url
        ? `<a href="${item.url}" target="_blank">${item.entry}</a>${item.publication ? ` — ${item.publication}` : ""}`
        : item.entry;
      return `<li><span class="cv-year">${item.year}</span><span>${entryHtml}</span></li>`;
    }).join("");
    return `
      <div class="cv-section">
        <h5 class="cv-heading">${label}</h5>
        <ul class="cv-list">${rows}</ul>
      </div>`;
  }).join("");

  document.getElementById("about-content").innerHTML = `
    <div class="about-top reveal">
      <img src="${data.photo || "images/placeholder-photo.jpg"}" alt="${data.pronunciation.name}" class="about-photo" loading="lazy" />
      <div class="about-text">
        <p class="about-name">${data.pronunciation.name}</p>
        <p class="about-pronunciation">${data.pronunciation.guide}</p>
        <div class="about-bio">${data.bio.map(p => `<p>${p}</p>`).join("")}</div>
        <p class="about-contact"><a href="mailto:${data.contact.email}">${data.contact.email}</a></p>
      </div>
    </div>
    <div class="reveal">
      <h4 class="cv-heading-main">CV</h4>
      <div class="cv-columns">${cvHtml}</div>
    </div>
  `;
}

// ================================
// REVEAL-ON-SCROLL (fade-up + stagger)
// ================================
function initReveals() {
  const els = document.querySelectorAll(".reveal");

  // stagger siblings within the same parent, capped so late items don't lag
  const groups = new Map();
  els.forEach(el => {
    const parent = el.parentElement;
    const n = groups.get(parent) || 0;
    el.style.setProperty("--d", Math.min(n, 8) * 0.07 + "s");
    groups.set(parent, n + 1);
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => io.observe(el));
}

// ================================
// NAV + LIVE ACCENT
// ================================
const SECTION_ACCENTS = {
  recently:  "#e05c00",
  art:       "#f0c030",
  tech:      "#c880e8",
  skills:    "#c880e8",
  education: "#70d882",
  about:     "#999999",
};

function initNav() {
  const nav = document.getElementById("topnav");
  const links = nav.querySelectorAll(".topnav-link");
  const sections = ["tech", "skills", "education", "art", "about"]
    .filter(id => document.getElementById(id))
    .map(id => document.getElementById(id));
  const hero = document.getElementById("top");

  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;

    // show nav once past ~70% of the hero
    nav.classList.toggle("show", y > hero.offsetHeight * 0.7);

    // mobile shrink: compress when scrolling down, restore scrolling up
    nav.classList.toggle("shrink", y > lastY && y > hero.offsetHeight);
    lastY = y;

    // current section = last one whose top passed the upper third
    let current = null;
    const probe = y + window.innerHeight * 0.35;
    sections.forEach(s => { if (s.offsetTop <= probe) current = s; });

    if (current) {
      document.documentElement.style.setProperty("--live", SECTION_ACCENTS[current.id]);
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current.id));
    } else {
      links.forEach(l => l.classList.remove("active"));
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

// ================================
// ART MODAL (+ hash routing)
// ================================
const modal = document.getElementById("art-modal");
const modalPanel = document.getElementById("art-modal-panel");
let modalOpenId = null;
let modalSection = null;

function openArtModal(section, id) {
  const project = (projectsBySection[section] || []).find(p => p.id === id);
  if (!project) return;
  modalOpenId = id;
  modalSection = section;

  const heroHtml = project.heroVideo
    ? `<video class="modal-hero" muted loop playsinline preload="metadata" ${previewMotion.matches ? "" : "autoplay"} poster="${project.hero || project.thumbnail || ""}" aria-label="${project.title} demonstration"><source src="${project.heroVideo}" type="video/mp4" /></video>`
    : project.hero ? `<img src="${project.hero}" alt="${project.title}" class="modal-hero" />` : "";

  const descHtml = (project.description || "")
    .split(/\n\n+/)
    .filter(Boolean)
    .map(para => `<p class="modal-desc">${para}</p>`)
    .join("");

  const listHtml = project.list && project.list.length ? `
    <div class="modal-section">
      ${project["list-title"] ? `<h4 class="modal-label">${project["list-title"]}</h4>` : ""}
      <ul class="modal-list">${project.list.map(i => `<li>${i}</li>`).join("")}</ul>
    </div>` : "";

  const exhibitionsHtml = project.exhibitions && project.exhibitions.length ? `
    <div class="modal-section">
      <h4 class="modal-label">Exhibited at</h4>
      <ul class="modal-list">${project.exhibitions.map(e => `<li>${e}</li>`).join("")}</ul>
    </div>` : "";

  const pressHtml = project.press && project.press.length ? `
    <div class="modal-section">
      <h4 class="modal-label">Press</h4>
      <ul class="modal-list">
        ${project.press.map(p => `<li><a href="${p.url}" target="_blank" rel="noopener">${p.title}</a> — ${p.publication}</li>`).join("")}
      </ul>
    </div>` : "";

  const gallery = project.gallery || [];
  const galleryFullUrls = gallery.map(i => typeof i === "string" ? i : (i.full || i.thumb));
  const galleryCaptions = gallery.map(i => typeof i === "object" && i.caption ? i.caption : "");

  const galleryHtml = gallery.length ? `
    <div class="modal-gallery">
      ${gallery.map((item, i) => {
        const thumbSrc = typeof item === "string" ? item : item.thumb;
        const caption = typeof item === "object" && item.caption ? item.caption : "";
        return `
          <div class="gallery-item">
            <img src="${thumbSrc}" alt="${project.title}" class="modal-gallery-img" data-index="${i}" loading="lazy" />
            ${caption ? `<p class="gallery-caption">${caption}</p>` : ""}
          </div>`;
      }).join("")}
    </div>` : "";

  const projectLinks = Array.isArray(project.links) ? project.links.filter(l => l && l.url && l.label) : [];
  const projectLinksHtml = projectLinks.length ? `
    <ul class="modal-links">
      ${projectLinks.map(l => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.label}</a></li>`).join("")}
    </ul>` : "";

  const linkHtml = project.link
    ? `<a href="${project.link}" target="_blank" rel="noopener" class="modal-ext-link">View project ↗</a>` : "";

  modalPanel.innerHTML = `
    <button class="modal-close" aria-label="Close">×</button>
    ${heroHtml}
    <h2 class="modal-title">${project.title}</h2>
    <p class="modal-meta">${project.year ? project.year + " — " : ""}${project.medium}</p>
    ${projectLinksHtml}
    ${descHtml}
    ${listHtml}
    ${exhibitionsHtml}
    ${pressHtml}
    ${galleryHtml}
    ${linkHtml}
  `;

  modalPanel.querySelector(".modal-close").addEventListener("click", closeArtModal);
  modalPanel.querySelectorAll(".modal-gallery-img").forEach(img => {
    img.addEventListener("click", () => {
      openLightbox(galleryFullUrls, galleryCaptions, parseInt(img.dataset.index));
    });
  });

  modal.classList.add("open");
  syncPreviewPlayback();
  document.body.style.overflow = "hidden";
  modalPanel.scrollTop = 0;
  document.title = `Antoni.us — ${project.title}`;
}

function closeArtModal() {
  if (!modalOpenId) return;
  modalOpenId = null;
  modal.classList.remove("open");
  modalPanel.querySelectorAll("video").forEach(video => video.pause());
  syncPreviewPlayback();
  document.body.style.overflow = "";
  document.title = "antoni.us/wiriadjaja — Portfolio of Antonius Wiriadjaja";
  if (/^#(art|tech)\//.test(location.hash)) {
    if (modalSection === "art") {
      history.replaceState(null, "", "#art");
    } else {
      // tech projects open from Featured (the /tech section is parked): go back to the top
      history.replaceState(null, "", location.pathname + location.search);
      window.scrollTo(0, 0);
    }
  }
}

function handleHash() {
  const m = location.hash.match(/^#(art|tech)\/([\w-]+)$/);
  if (m) {
    openArtModal(m[1], m[2]);
  } else if (modalOpenId) {
    closeArtModal();
  }
}

modal.querySelector(".modal-backdrop").addEventListener("click", closeArtModal);
window.addEventListener("hashchange", handleHash);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modalOpenId && !document.getElementById("lightbox").classList.contains("open")) {
    closeArtModal();
  }
});

// ================================
// LIGHTBOX
// ================================
let galleryImages = [];
let galleryCaptionsLB = [];
let currentIndex = 0;

function showLightboxImage() {
  document.getElementById("lightbox-img").src = galleryImages[currentIndex];
  document.getElementById("lightbox-counter").textContent = `${currentIndex + 1} / ${galleryImages.length}`;
  const cap = galleryCaptionsLB[currentIndex] || "";
  const capEl = document.getElementById("lightbox-caption");
  capEl.textContent = cap;
  capEl.style.display = cap ? "block" : "none";
}

function openLightbox(images, captions, index) {
  galleryImages = images;
  galleryCaptionsLB = captions || [];
  currentIndex = index;
  showLightboxImage();
  document.getElementById("lightbox").classList.add("open");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox").addEventListener("click", e => {
  if (e.target.id === "lightbox") closeLightbox();
});
document.getElementById("lightbox-prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  showLightboxImage();
});
document.getElementById("lightbox-next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  showLightboxImage();
});
document.addEventListener("keydown", e => {
  if (!document.getElementById("lightbox").classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showLightboxImage();
  }
  if (e.key === "ArrowRight") {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showLightboxImage();
  }
});

// ================================
// INIT
// ================================
async function init() {
  const [projectsRes, aboutRes, featuredRes] = await Promise.all([
    fetch("projects.json"),
    fetch("about.json"),
    fetch("featured.json"),
  ]);
  const projects = await projectsRes.json();
  const about = await aboutRes.json();
  const featured = await featuredRes.json();

  projectsBySection.art = (projects.art || []).filter(p => !p.hidden); // hidden: true keeps a file off the site
  projectsBySection.tech = projects.tech || [];
  projectsBySection.education = projects.education || [];

  renderFeatured(featured);
  renderArt(projectsBySection.art);
  renderTechProjects(projects.tech || []);
  renderTech(projects.tech || []);
  renderEducation(projects.education || []);
  renderAbout(about);

  initReveals();
  initNav();

  // open modal if page loaded with #art/<id> or #tech/<id>
  handleHash();
}

init();
