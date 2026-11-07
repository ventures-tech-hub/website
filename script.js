const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 10);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const setMenu = (isOpen) => {
  menuButton.classList.toggle("open", isOpen);
  nav.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
};

menuButton.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !nav.classList.contains("open")) return;
  setMenu(false);
  menuButton.focus();
});

// Whole card is clickable: follow the card's own link unless another control was clicked
document.querySelectorAll(".card-link").forEach((card) => {
  const link = card.querySelector("a[href]");
  if (!link) return;
  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button, input, select, textarea")) return;
    if (window.getSelection().toString()) return;
    if (event.ctrlKey || event.metaKey) window.open(link.href, "_blank", "noopener");
    else link.click();
  });
});

// FAQ: only one answer open at a time
const faqs = document.querySelectorAll("details.faq");
faqs.forEach((faq) => faq.addEventListener("toggle", () => {
  if (!faq.open) return;
  faqs.forEach((other) => { if (other !== faq) other.open = false; });
}));

// Newsletter: design-system error state instead of the browser's validation popup
document.querySelectorAll(".news-form").forEach((form) => {
  const field = form.querySelector(".news-input");
  const input = field.querySelector("input");
  const clear = field.querySelector(".news-clear");
  const error = form.querySelector(".news-error");

  const setError = (message) => {
    field.classList.toggle("is-error", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
    error.hidden = !message;
  };

  input.addEventListener("input", () => {
    clear.hidden = !input.value;
    if (field.classList.contains("is-error")) setError("");
  });
  clear.addEventListener("click", (event) => {
    event.preventDefault();
    input.value = "";
    clear.hidden = true;
    setError("");
    input.focus();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return setError("Please enter your email address.");
    if (!input.checkValidity() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setError("Please enter a valid email address.");
    setError("");
  });
});

// Numbered detail sections (01–06): on mobile the numbers stay pinned and only the selected step's content shows
const stepTabsQuery = window.matchMedia("(max-width: 768px)");
document.querySelectorAll("[data-step-tabs]").forEach((list, listIndex) => {
  const items = [...list.children];
  const head = document.createElement("div");
  head.className = "step-tabs-head";
  const sourceLabel = items[0].querySelector(".eyebrow");
  if (sourceLabel) {
    const label = document.createElement("span");
    label.className = "eyebrow step-tabs-label";
    label.textContent = sourceLabel.textContent;
    head.append(label);
  }
  const bar = document.createElement("div");
  bar.className = "step-tabs";
  bar.setAttribute("role", "tablist");
  head.append(bar);

  const buttons = items.map((item, index) => {
    const num = item.querySelector(".wwd-num, .detail-num");
    const title = item.querySelector("h3");
    item.id ||= `step-${listIndex + 1}-${index + 1}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "step-tab";
    button.textContent = num ? num.textContent : String(index + 1).padStart(2, "0");
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", item.id);
    if (title) button.setAttribute("aria-label", `${button.textContent} ${title.textContent}`);
    if (num) button.style.setProperty("--tab", getComputedStyle(num).backgroundColor);
    button.addEventListener("click", () => select(index, true));
    bar.append(button);
    return button;
  });

  const select = (index, fromClick) => {
    items.forEach((item, i) => item.classList.toggle("is-current", i === index));
    buttons.forEach((button, i) => {
      button.setAttribute("aria-selected", String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    if (!fromClick || !stepTabsQuery.matches) return;
    // Keep the new step's start in view when switching after scrolling down
    const gap = list.getBoundingClientRect().top - head.getBoundingClientRect().bottom;
    if (gap < 0) window.scrollBy({ top: gap, behavior: "smooth" });
  };

  bar.addEventListener("keydown", (event) => {
    const current = buttons.findIndex((button) => button.getAttribute("aria-selected") === "true");
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    const next = (current + step + buttons.length) % buttons.length;
    select(next, true);
    buttons[next].focus();
  });

  list.before(head);
  list.classList.add("has-step-tabs");
  select(0, false);
});

// Insights: search (filters the posts, with a clear icon) and sort dropdown
const insightTools = document.querySelector(".all-tools");
if (insightTools) {
  const grid = document.querySelector(".post-grid");
  const posts = [...grid.querySelectorAll(".post")];
  const searchInput = insightTools.querySelector(".search input");
  const searchClear = insightTools.querySelector(".search-clear");
  const empty = document.createElement("p");
  empty.className = "post-empty";
  empty.textContent = "No insights match your search.";
  empty.hidden = true;
  grid.after(empty);

  const applySearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    searchClear.hidden = !searchInput.value;
    let shown = 0;
    posts.forEach((post) => {
      const match = !query || post.textContent.toLowerCase().includes(query);
      post.hidden = !match;
      if (match && post.offsetParent !== null) shown += 1;
    });
    empty.hidden = !query || shown > 0;
  };
  searchInput.addEventListener("input", applySearch);
  searchClear.addEventListener("click", (event) => {
    event.preventDefault();
    searchInput.value = "";
    applySearch();
    searchInput.focus();
  });

  const sort = insightTools.querySelector(".sort");
  const trigger = sort.querySelector(".sort-trigger");
  const menu = sort.querySelector(".sort-menu");
  const valueLabel = sort.querySelector(".sort-value");
  const options = [...menu.querySelectorAll('[role="option"]')];
  let focused = 0;

  const postTime = (post) => Date.parse(post.querySelector(".post-date")?.textContent || "") || 0;
  const focusOption = (index) => {
    focused = (index + options.length) % options.length;
    options.forEach((option, i) => option.classList.toggle("is-focused", i === focused));
    menu.setAttribute("aria-activedescendant", options[focused].id);
  };
  const setOpen = (open) => {
    menu.hidden = !open;
    sort.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    if (open) {
      const selected = options.findIndex((option) => option.getAttribute("aria-selected") === "true");
      focusOption(selected < 0 ? 0 : selected);
      menu.focus();
    }
  };
  const choose = (option) => {
    options.forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    valueLabel.textContent = option.textContent;
    valueLabel.classList.remove("is-placeholder");
    const newest = option.dataset.sort === "newest";
    posts
      .slice()
      .sort((a, b) => (newest ? postTime(b) - postTime(a) : postTime(a) - postTime(b)))
      .forEach((post) => grid.append(post));
    setOpen(false);
    trigger.focus();
  };

  options.forEach((option, index) => {
    option.id = `sort-option-${index + 1}`;
    option.addEventListener("click", () => choose(option));
    option.addEventListener("mousemove", () => focusOption(index));
  });
  trigger.addEventListener("click", () => setOpen(menu.hidden));
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  });
  menu.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") focusOption(focused + 1);
    else if (event.key === "ArrowUp") focusOption(focused - 1);
    else if (event.key === "Enter" || event.key === " ") choose(options[focused]);
    else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      if (event.key === "Escape") trigger.focus();
      return;
    } else return;
    event.preventDefault();
  });
  document.addEventListener("click", (event) => {
    if (!sort.contains(event.target)) setOpen(false);
  });
}

/* ---------- Ventures: horizontal scroller arrows & dots ---------- */
document.querySelectorAll(".venture-scroller").forEach((scroller) => {
  const track = scroller.querySelector(".venture-track");
  const arrows = scroller.querySelectorAll(".venture-arrow");
  const dots = scroller.querySelectorAll(".venture-dot");
  if (!track) return;
  const step = () => {
    const card = track.querySelector(".venture-card");
    return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
  };
  const update = () => {
    const s = step();
    if (arrows.length) {
      const max = track.scrollWidth - track.clientWidth - 2;
      arrows[0].disabled = track.scrollLeft <= 2;
      arrows[1].disabled = track.scrollLeft >= max;
    }
    if (dots.length && s > 0) {
      const activeIndex = Math.min(dots.length - 1, Math.max(0, Math.round(track.scrollLeft / s)));
      dots.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === activeIndex);
      });
    }
  };
  arrows.forEach((btn) => btn.addEventListener("click", () => {
    track.scrollBy({ left: step() * Number(btn.dataset.dir), behavior: "smooth" });
  }));
  dots.forEach((dot, idx) => dot.addEventListener("click", () => {
    const s = step();
    track.scrollTo({ left: idx * s, behavior: "smooth" });
  }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});

/* ---------- Legal pages: "On This Page" follows the section in view ---------- */
document.querySelectorAll(".lg-toc").forEach((toc) => {
  const links = [...toc.querySelectorAll("a[href^='#']")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (!sections.length) return;
  const setActive = (i) => links.forEach((a, j) => a.classList.toggle("is-active", i === j));
  const update = () => {
    const line = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) + 120;
    let current = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) current = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = sections.length - 1;
    setActive(current);
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  // Tablet/phone: the card is a dropdown — tap the heading to show all sections, pick one to close it
  const head = toc.querySelector(".lg-toc-head");
  if (!head) return;
  const setOpen = (open) => head.setAttribute("aria-expanded", String(open));
  head.addEventListener("click", () => setOpen(head.getAttribute("aria-expanded") !== "true"));
  links.forEach((a) => a.addEventListener("click", () => setOpen(false)));
});

/* ---------- For Founders, For Businesses & For Partners: testimonial arrows ---------- */
document.querySelectorAll(".ff-stories, .fb-stories, .pt-stories").forEach((wrap) => {
  const track = wrap.querySelector(".ff-quotes, .fb-quotes, .pt-quotes");
  const [prev, next] = wrap.querySelectorAll(".ff-arrow, .fb-arrow, .pt-arrow");
  if (!track || !prev || !next) return;
  const step = () => {
    const card = track.firstElementChild;
    return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
  };
  const update = () => prev.classList.toggle("is-off", track.scrollLeft <= 2);
  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => {
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step(), behavior: "smooth" });
  });
  track.addEventListener("scroll", update, { passive: true });
  update();
});
