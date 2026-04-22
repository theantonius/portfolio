// ================================
// PROJECT TAB SWITCHING
// ================================
const tabs = document.querySelectorAll(".tab");
const projects = document.querySelectorAll(".project");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    projects.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.project;
    document.getElementById(target).classList.add("active");
  });
});

// ================================
// CYCLING TAGLINE
// ================================
const endings = [
  "think.",
  "that teach.",
  "weird.",
  "provocative.",
  "for connection.",
  "matter.",
  "learn.",
  "feel.",
  "move.",
  "see.",
  "glow.",
  "strange.",
  "listen.",
  "remember.",
  "talk back.",
  "for people.",
  "with purpose.",
  "for change.",
  "that resist.",
  "that breathe.",
  "ask questions.",
  "cringe.",
  "for bodies.",
  "uncomfortable.",
  "linger.",
  "with care.",
  "that confuse.",
  "perform.",
  "eat.",
  "edible.",
  "for survival.",
  "love.",
  "make love.",
  "queer.",
  "for joy.",
  "for fun.",
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

  // First word fades in after a beat, then cycles every 3s
  setTimeout(() => {
    showNext();
    setInterval(showNext, 3000);
  }, 1200); // change every 3 seconds
}
