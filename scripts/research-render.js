// Renders RESEARCH_TOPICS (research-data.js) into [data-research-list],
// then reveals each card on scroll — the same IntersectionObserver pattern
// news-render.js uses for the Home NEWS grid.

// Every other card swaps image/info sides (image right, info left) — see
// .research-card--reverse in styles.css — so the list reads as an
// alternating zigzag instead of every row lining up the same way.
//
// Only "more >" is a real <a> — the card itself is a plain <div>. Clicking
// the image or text does nothing; only the affordance that actually lights
// up on hover (.research-card__more:hover in styles.css) is clickable, so
// the click target matches the visual hover target exactly instead of the
// whole card silently being a link.
function researchCardMarkup(item, index) {
  const reverseClass = index % 2 === 1 ? " research-card--reverse" : "";
  const href = `research-detail.html?topic=${slugifyResearchTopic(item.topic)}`;
  return `
    <div class="research-card${reverseClass}">
      <img class="research-card__image" src="${item.image}" alt="${item.topic}" loading="lazy" />
      <div class="research-card__info">
        <h3 class="research-card__topic">${item.topic}</h3>
        <div class="research-card__summary">
          <p class="research-card__excerpt">${item.summary}</p>
          <a class="research-card__more" href="${href}" aria-label="More about ${item.topic}">
            <span class="research-card__more-text">more</span>
            <svg class="research-card__more-chevron" width="7" height="11" viewBox="0 0 7 11" fill="none">
              <path d="M1 1L6 5.5L1 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  `;
}

function initResearchList() {
  const container = document.querySelector("[data-research-list]");
  if (!container) return;

  container.innerHTML = RESEARCH_TOPICS.map(researchCardMarkup).join(
    '<div class="dash-line" role="separator" aria-hidden="true"></div>'
  );

  const cards = container.querySelectorAll(".research-card");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  // One-time reveal, then unobserve — see news-render.js's identical
  // observer for why toggling this on/off with entry.isIntersecting (this
  // used to do that, to replay the reveal on scrolling back up) causes a
  // real vibration bug at the bottom of the page: revealing a card moves
  // it (translateY), which can flip its own intersection state right back,
  // hide it, move it back, re-intersect, reveal again — forever, once
  // there's no further scroll room to carry it clear of the threshold.
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  cards.forEach((card) => revealObserver.observe(card));
}

if (typeof RESEARCH_TOPICS !== "undefined") {
  initResearchList();
}
