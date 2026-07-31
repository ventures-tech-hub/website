const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  root.style.setProperty("--scroll", progress.toFixed(4));
  header.classList.toggle("scrolled", window.scrollY > 40);
};

const movingWordmarks = [...document.querySelectorAll("[data-watermark]")];
let watermarkFrame = 0;
const updateWatermarks = () => {
  watermarkFrame = 0;
  const viewportMiddle = window.innerHeight / 2;
  movingWordmarks.forEach((wordmark) => {
    const section = wordmark.parentElement;
    const rect = section.getBoundingClientRect();
    const direction = Number(wordmark.dataset.direction || 1);
    const localProgress = (viewportMiddle - (rect.top + rect.height / 2)) / (rect.height + window.innerHeight);
    wordmark.style.setProperty("--wm-shift", (localProgress * 240 * direction).toFixed(2));
  });
};

const requestWatermarkUpdate = () => {
  if (watermarkFrame || reduceMotion) return;
  watermarkFrame = requestAnimationFrame(updateWatermarks);
};

updateScroll();
updateWatermarks();
window.addEventListener("scroll", updateScroll, { passive: true });
window.addEventListener("scroll", requestWatermarkUpdate, { passive: true });
window.addEventListener("resize", requestWatermarkUpdate, { passive: true });

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.classList.toggle("open");
  nav.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.classList.remove("open");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !nav.classList.contains("open")) return;
  menuButton.classList.remove("open");
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  menuButton.focus();
});

const ventureStack = document.querySelector(".ecosystem-stack");
const ventureCards = [...document.querySelectorAll(".venture-card")];
if (ventureStack) {
  const ventureNames = ["one", "two", "three"];
  ventureStack.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const rect = ventureStack.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    const index = position < .32 ? 0 : position < .68 ? 1 : 2;
    ventureStack.dataset.active = ventureNames[index];
  });
  ventureStack.addEventListener("pointerleave", () => {
    delete ventureStack.dataset.active;
  });
  ventureCards.forEach((card, index) => {
    card.addEventListener("focus", () => { ventureStack.dataset.active = ventureNames[index]; });
    card.addEventListener("blur", () => { delete ventureStack.dataset.active; });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.13 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...nav.querySelectorAll("a")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.6] }
);
sections.forEach((section) => sectionObserver.observe(section));

if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((element) => {
    const baseTransform = getComputedStyle(element).transform;
    element.addEventListener("pointermove", (event) => {
      const box = element.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      element.style.transform = `${baseTransform === "none" ? "" : baseTransform} perspective(1200px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg) translateZ(3px)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = baseTransform === "none" ? "" : baseTransform;
    });
  });
}
