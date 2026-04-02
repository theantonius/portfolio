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
  "teach.",
  "weird.",
  "grow.",
  "provocative.",
  "connect.",
  "matter.",
  "learn.",
];

const cycleEl = document.getElementById("tagline-cycle");

if (cycleEl) {
  let i = 0;

  const cycle = () => {
    // Fade out
    cycleEl.style.opacity = 0;

    setTimeout(() => {
      // Swap text
      i = (i + 1) % endings.length;
      cycleEl.textContent = endings[i];

      // Fade in
      cycleEl.style.opacity = 1;
    }, 500); // wait for fade out to finish
  };

  setInterval(cycle, 3000); // change every 3 seconds
}
