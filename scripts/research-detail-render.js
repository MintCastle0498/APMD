// Renders a single RESEARCH_TOPICS entry (research-data.js) into
// [data-research-detail] on research-detail.html, picked by the
// ?topic=<slug> query param that research-render.js's card links set.

function researchDetailGalleryMarkup(images, topic) {
  return images
    .map((src) => `<img class="research-detail__image" src="${src}" alt="${topic}" loading="lazy" />`)
    .join("");
}

function researchDetailBodyMarkup(paragraphs) {
  return paragraphs.map((p) => `<p class="research-detail__paragraph">${p}</p>`).join("");
}

// `titles` is a topic's detail.publications — exact PUBLICATIONS titles
// (see research-data.js) resolved here via findPublicationByTitle
// (publication-data.js, loaded before this file — see research-detail.html)
// into full citations, each linking to that paper's own highlighted spot on
// publication.html via the same ?paper=<slug> deep link publication-render.js
// reads. Titles that don't resolve (a typo, or a paper not yet in
// PUBLICATIONS) are silently skipped rather than rendering a broken citation.
function researchDetailPublicationsMarkup(titles) {
  if (!titles || !titles.length) return "";

  const items = titles
    .map((title) => (typeof findPublicationByTitle === "function" ? findPublicationByTitle(title) : null))
    .filter(Boolean)
    .map((pub) => {
      const slug = slugifyPublicationTitle(pub.title);
      return `
        <li class="research-detail__publication">
          <a class="research-detail__publication-link" href="publication.html?paper=${slug}">
            ${pub.authors}, &ldquo;${pub.title},&rdquo; <span class="research-detail__publication-journal">${pub.journal}</span>
          </a>
        </li>
      `;
    })
    .join("");

  if (!items) return "";

  return `
    <div class="research-detail__publications">
      <h2 class="research-detail__publications-heading">Representative Publications</h2>
      <ul class="research-detail__publications-list">${items}</ul>
    </div>
  `;
}

function researchDetailBackLink() {
  return `
    <a class="research-detail__back" href="research.html">
      <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
        <path d="M6 1L1 5.5L6 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Research
    </a>
  `;
}

function initResearchDetail() {
  const container = document.querySelector("[data-research-detail]");
  if (!container) return;

  const slug = new URLSearchParams(window.location.search).get("topic");
  const item = slug && findResearchTopicBySlug(slug);

  if (!item) {
    container.innerHTML = `
      ${researchDetailBackLink()}
      <p class="research-detail__paragraph">Research topic not found.</p>
    `;
    return;
  }

  document.title = `${item.topic} – APMD`;

  // Falls back to the list card's own image/summary until a topic gets
  // dedicated detail content (see research-data.js's `detail` field).
  const detail = item.detail || {};
  const images = detail.images && detail.images.length ? detail.images : [item.image];
  const body = detail.body && detail.body.length ? detail.body : [item.summary];

  container.innerHTML = `
    ${researchDetailBackLink()}
    <div class="page-title-container">
      <h1 class="page-title">${item.topic}<span class="page-title__dot">.</span></h1>
    </div>
    <div class="research-detail__gallery">
      ${researchDetailGalleryMarkup(images, item.topic)}
    </div>
    <div class="research-detail__body">
      ${researchDetailBodyMarkup(body)}
    </div>
    ${researchDetailPublicationsMarkup(detail.publications)}
  `;
}

if (typeof RESEARCH_TOPICS !== "undefined") {
  initResearchDetail();
}
