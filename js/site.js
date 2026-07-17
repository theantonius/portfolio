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
let artProjects = [];

function renderRecently(data) {
  if (data.intro) {
    const intro = document.getElementById("hero-intro");
    if (intro) intro.textContent = data.intro;
  }
  const list = document.getElementById("recent-list");
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
  artProjects = projects;
  const grid = document.getElementById("art-grid");
  grid.innerHTML = projects.map(p => `
    <button class="art-card reveal" data-id="${p.id}" aria-haspopup="dialog">
      <div class="art-card-thumb">
        <img src="${p.thumbnail || p.hero}" alt="${p.title}" loading="lazy" />
      </div>
      <h3>${p.title}</h3>
      <p>${p.year ? p.year + " — " : ""}${p.medium}</p>
    </button>
  `).join("");

  grid.querySelectorAll(".art-card").forEach(card => {
    card.addEventListener("click", () => {
      location.hash = "#art/" + card.dataset.id;
    });
  });
}

function renderTech(projects) {
  const groups = {
    fabrication: { title: "Fabrication", items: [] },
    code:        { title: "Code & Creative Tools", items: [] },
    design:      { title: "Design & Media", items: [] },
  };
  projects.forEach(p => { if (groups[p.category]) groups[p.category].items.push(p); });

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
        return `
        <div class="tech-row reveal">
          <button class="tech-row-head" aria-expanded="false">
            <span class="tech-row-title">${p.title}</span>
            <span class="tech-row-medium">${p.medium}</span>
            <span class="tech-row-chevron">▾</span>
          </button>
          <div class="tech-row-body">
            <div class="tech-row-body-inner">
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
  education: "#70d882",
  about:     "#999999",
};

function initNav() {
  const nav = document.getElementById("topnav");
  const links = nav.querySelectorAll(".topnav-link");
  const sections = ["recently", "art", "tech", "education", "about"]
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

function openArtModal(id) {
  const project = artProjects.find(p => p.id === id);
  if (!project) return;
  modalOpenId = id;

  const heroHtml = project.hero
    ? `<img src="${project.hero}" alt="${project.title}" class="modal-hero" />` : "";

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

  const linkHtml = project.link
    ? `<a href="${project.link}" target="_blank" rel="noopener" class="modal-ext-link">View project ↗</a>` : "";

  modalPanel.innerHTML = `
    <button class="modal-close" aria-label="Close">×</button>
    ${heroHtml}
    <h2 class="modal-title">${project.title}</h2>
    <p class="modal-meta">${project.year ? project.year + " — " : ""}${project.medium}</p>
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
  document.body.style.overflow = "hidden";
  modalPanel.scrollTop = 0;
  document.title = `Antoni.us — ${project.title}`;
}

function closeArtModal() {
  if (!modalOpenId) return;
  modalOpenId = null;
  modal.classList.remove("open");
  document.body.style.overflow = "";
  document.title = "antoni.us/wiriadjaja — Portfolio of Antonius Wiriadjaja";
  if (location.hash.startsWith("#art/")) {
    history.replaceState(null, "", "#art");
  }
}

function handleHash() {
  const m = location.hash.match(/^#art\/([\w-]+)$/);
  if (m) {
    openArtModal(m[1]);
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
  const [recentRes, projectsRes, aboutRes] = await Promise.all([
    fetch("recent.json"),
    fetch("projects.json"),
    fetch("about.json"),
  ]);
  const recent = await recentRes.json();
  const projects = await projectsRes.json();
  const about = await aboutRes.json();

  renderRecently(recent);
  renderArt(projects.art || []);
  renderTech(projects.tech || []);
  renderEducation(projects.education || []);
  renderAbout(about);

  initReveals();
  initNav();

  // open modal if page loaded with #art/<id>
  handleHash();
}

init();
