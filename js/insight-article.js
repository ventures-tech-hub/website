(() => {
  const posts = window.loktaraInsights || {};
  const slug = new URLSearchParams(location.search).get('post') || 'building-for-the-long-term';
  const post = posts[slug];
  const title = document.querySelector('#article-title');
  if (!post) {
    title.textContent = 'Insight not found';
    document.querySelector('#article-summary').textContent = 'This article may have moved. Browse the latest insights to find another story.';
    document.querySelector('#article-content').innerHTML = '<p><a href="insights.html#all-insights">Back to all insights →</a></p>';
    return;
  }
  const [category, headline, summary, image, date, author, role, minutes, intro, points, quote, tags] = post;
  document.title = `${headline} — Loktara Ventures`;
  document.querySelector('meta[name="description"]').content = summary;
  title.textContent = headline;
  document.querySelector('#article-category').textContent = category;
  document.querySelector('#article-category').classList.add(category === 'Technology' ? 'tag-orange' : category === 'Markets & Trends' ? 'tag-green' : 'tag-navy');
  document.querySelector('#article-read-time').textContent = minutes;
  document.querySelector('#article-summary').textContent = summary;
  document.querySelector('#article-author').textContent = author;
  document.querySelector('#article-role').textContent = role;
  const dateNode = document.querySelector('#article-date'); dateNode.textContent = date; dateNode.dateTime = new Date(date).toISOString().slice(0,10);
  const hero = document.querySelector('#article-image'); hero.src = image; hero.alt = headline;
  const content = document.querySelector('#article-content');
  content.innerHTML = `<p>${intro}</p>${points.map((point, index) => `<section class="article-point"><img class="article-point-icon" src="assets/ui/icons/Trust.svg" alt=""/><div><h2>${index + 1}. ${point}</h2><p>${pointText(category, point, index)}</p></div></section>`).join('')}<p>${summary}</p>`;
  document.querySelector('#article-quote').textContent = `“${quote}”`;
  document.querySelector('#article-tags').innerHTML = tags.map((tag) => `<a href="insights.html#all-insights">${tag}</a>`).join('');
  const others = Object.entries(posts).filter(([key]) => key !== slug);
  document.querySelector('#related-posts').innerHTML = others.slice(0,2).map(([key, item]) => relatedCard(key,item)).join('');
  const popular = ['ai-and-the-next-wave-of-innovation','raising-capital-the-right-way','scaling-beyond-the-early-stage','the-future-of-sustainable-businesses'].filter((key) => key !== slug && posts[key]);
  document.querySelector('#popular-posts').innerHTML = popular.slice(0,4).map((key) => popularCard(key,posts[key])).join('');
  const categoryList = [...new Set(Object.values(posts).map((item) => item[0]))];
  const categoryIcons = {
    'Venture Building': 'cc1.svg',
    'Startups & Founders': 'cc2.svg',
    'Markets & Trends': 'cc3.svg',
    Technology: 'cc4.svg',
    'Capital & Investment': 'cc5.svg',
    'Business Growth': 'cc6.svg',
    'Industry Perspectives': 'cc7.svg'
  };
  document.querySelector('#article-categories').innerHTML = categoryList.map((name) => `<li><a href="insights.html#all-insights"><img src="assets/ui/icons/${categoryIcons[name]}" alt=""/><span>${name}</span><small>${Object.values(posts).filter((item) => item[0] === name).length}</small></a></li>`).join('');
  document.querySelector('#copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); document.querySelector('#copy-link').textContent = '✓'; }
    catch { document.querySelector('#copy-link').textContent = location.href; }
  });
  const search = document.querySelector('#article-search');
  search.addEventListener('keydown', (event) => { if (event.key === 'Enter' && search.value.trim()) location.href = `insights.html#all-insights`; });
  document.querySelector('.article-newsletter form').addEventListener('submit', (event) => event.preventDefault());
  document.querySelectorAll('.article-share a').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));

  function pointText(section, point, index) {
    const examples = [
      `Start by examining ${point.toLowerCase()} in the context of your customers and your current capabilities. A focused approach helps teams make practical progress and learn what works.`,
      `Make ${point.toLowerCase()} part of the way your team works. Clear ownership and regular feedback help turn an intention into a dependable business practice.`,
      `Review what is changing and adjust your approach as new information arrives. This keeps ${point.toLowerCase()} connected to the outcomes that matter.`
    ];
    return examples[index % examples.length];
  }
  function relatedCard(key,item) { return `<a class="related-card" href="insight.html?post=${key}"><img src="${item[3]}" alt=""/><span><small>${item[4]}</small><strong>${item[1]}</strong><em>Read More →</em></span></a>`; }
  function popularCard(key,item) { return `<a class="popular-card" href="insight.html?post=${key}"><img src="${item[3]}" alt=""/><span><small>${item[4]}</small><strong>${item[1]}</strong></span></a>`; }
})();
