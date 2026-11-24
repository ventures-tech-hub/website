/* Shared site shell. Kept in one place so every page uses the same navigation and footer. */
(() => {
  const headerMarkup = `<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="index.html" aria-label="Loktara Ventures home"><img src="assets/ui/logo.svg" alt="Loktara Ventures" width="151" height="40" /></a>
    <nav class="nav-links" aria-label="Primary navigation">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="what-we-do.html">What We Do</a>
      <a href="our-ventures.html">Our Ventures</a>
      <a href="approach.html">Our Approach</a>
      <a href="for-founders.html">For Founders</a>
      <a href="for-business.html">For Business</a>
      <a href="insights.html">Insights</a>
      <a href="contact.html">Contact</a>
      <a class="btn btn-primary nav-cta-mobile" href="contact.html#contact-form">Get in Touch →</a>
    </nav>
    <a class="btn btn-primary btn-sm header-cta" href="contact.html#contact-form">Get in Touch →</a>
    <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false">
      <svg class="i-menu" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <svg class="i-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
  </div>
</header>`;
  const footerMarkup = `<footer class="site-footer"><div class="container footer-main"><div class="footer-brand"><a href="index.html" aria-label="Loktara Ventures home"><img src="assets/ui/logo.svg" alt="Loktara Ventures" width="242" height="64"/></a><p>Building a brighter tomorrow.</p></div>
<div class="footer-col"><h4>Company</h4><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li><li><a href="what-we-do.html">What We Do</a></li><li><a href="our-ventures.html">Our Ventures</a></li><li><a href="ecosystem.html">Our Ecosystem</a></li><li><a href="approach.html">Our Approach</a></li><li><a href="insights.html">Insights</a></li><li><a href="contact.html">Contact</a></li></ul></div>
<div class="footer-col"><h4>For</h4><ul><li><a href="for-founders.html">For Founders</a></li><li><a href="for-business.html">For Businesses</a></li><li><a href="for-partners.html">Investors &amp; Partners</a></li></ul></div>
<div class="footer-col"><h4>Legal</h4><ul><li><a href="#">Privacy Policy</a></li><li><a href="terms-of-service.html">Terms of Use</a></li><li><a href="legal.html">Refund &amp; Cancellation</a></li></ul></div>
<div class="footer-col"><h4>Follow Us</h4><div class="socials"><a href="https://www.youtube.com/" aria-label="YouTube"><svg viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#f00"/><path d="m13 9 10 7-10 7z" fill="#fff"/></svg></a><a href="https://x.com/" aria-label="X" class="ny-x">𝕏</a><a href="https://www.linkedin.com/company/loktara-ventures/" aria-label="LinkedIn"><svg viewBox="0 0 32 32"><rect width="32" height="32" rx="3" fill="#0076b2"/><path fill="#fff" d="M7 12h4v13H7zm2-6a2.3 2.3 0 1 1 0 4.6A2.3 2.3 0 0 1 9 6zm5 6h4v1.8c.7-1.2 2-2.1 3.8-2.1 4 0 4.8 2.5 4.8 6V25h-4v-5.9c0-1.5 0-3.4-2-3.4s-2.6 1.6-2.6 3.3V25h-4z"/></svg></a></div></div></div><div class="footer-bottom"><div class="container"><span>© 2026 Loktara Ventures Private Limited. All rights reserved.</span><span class="tagline">Building a brighter tomorrow.</span></div></div></footer>`;
  const activeByPage = {
    "index.html": "index.html",
    "about.html": "about.html",
    "what-we-do.html": "what-we-do.html",
    "our-ventures.html": "our-ventures.html",
    "ventures.html": "our-ventures.html",
    "niyoos.html": "our-ventures.html",
    "peerports.html": "our-ventures.html",
    "primerishta.html": "our-ventures.html",
    "approach.html": "approach.html",
    "for-founders.html": "for-founders.html",
    "share-idea.html": "for-founders.html",
    "for-business.html": "for-business.html",
    "business-inquiry.html": "for-business.html",
    "insights.html": "insights.html",
    "insight.html": "insights.html",
    "contact.html": "contact.html"
  };
  const route = decodeURIComponent(location.pathname).replace(/\/+$/, "").split("/").pop() || "";
  const page = !route ? "index.html" : route.endsWith(".html") ? route : `${route}.html`;
  const activeHref = activeByPage[page];
  const headerSlot = document.querySelector("[data-site-header]");
  const footerSlot = document.querySelector("[data-site-footer]");
  if (headerSlot) {
    headerSlot.outerHTML = headerMarkup;
    if (activeHref) {
      const activeLink = document.querySelector(`.nav-links a[href="${activeHref}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
        activeLink.setAttribute("aria-current", "page");
      }
    }
  }
  if (footerSlot) footerSlot.outerHTML = footerMarkup;
  document.dispatchEvent(new CustomEvent("site-components:ready"));
})();
