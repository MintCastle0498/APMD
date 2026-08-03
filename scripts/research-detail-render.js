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
  `;
}

if (typeof RESEARCH_TOPICS !== "undefined") {
  initResearchDetail();
}
