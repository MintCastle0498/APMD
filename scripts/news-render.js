// Renders NEWS_POSTS (news-data.js) into either the Home preview grid or the
// full News page list — whichever container is present on the current page.

function formatNewsDate(post) {
  const start = post.date.split("-").join(".");
  const end = post.dateEnd && post.dateEnd !== post.date ? post.dateEnd.split("-").join(".") : null;
  return end ? `${start} – ${end}` : start;
}

// One tag = the category (colored dot + label, e.g. "학회 참석") plus one
// tag per post for who it's about ("APMD" for the whole lab, otherwise the
// person/people named). Two different chip styles (dot vs plain outline) so
// "what kind of post" and "who it's about" read as two different kinds of
// information at a glance, not just a row of identical pills.
function newsTagsMarkup(post) {
  const cat = NEWS_CATEGORIES[post.tag];
  const categoryChip = cat
    ? `<span class="news-tag news-tag--category">
        <span class="news-tag__dot" style="background:${cat.dot}"></span>${cat.label}
      </span>`
    : "";
  const peopleLabel = (post.people || []).join(", ");
  const peopleChip = peopleLabel ? `<span class="news-tag news-tag--people">${peopleLabel}</span>` : "";
  return `<div class="news-tags">${categoryChip}${peopleChip}</div>`;
}

// Shared by the Home card and the full news.html post — a single photo
// renders as a plain image, more than one gets the swipeable carousel
// (scroll-snap track + counter + dots + prev/next arrows). initCarousel
// (below) wires up the interactive bits once this markup is in the DOM.
function newsCarouselMarkup(post, frameClass, imageClass) {
  const images = post.images || [];
  const multi = images.length > 1;
  // data-zoom-src/-alt (not just reading the <img> next to it at click time)
  // so the lightbox always opens the exact photo that was clicked, not
  // whichever slide the carousel happens to be showing by then.
  const slides = images
    .map(
      (img, i) => `
        <div class="news-carousel__slide" data-slide-index="${i}">
          <img class="${imageClass}" src="${img.src}" alt="${img.alt || post.title}" loading="lazy" />
          <button type="button" class="news-carousel__zoom" data-zoom data-zoom-src="${img.src}" data-zoom-alt="${img.alt || post.title}" aria-label="원본 크기로 보기">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" stroke-width="1.6"/><path d="M13.5 13.5L18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8.5 6V11M6 8.5H11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
          ${img.credit ? `<span class="news-carousel__credit">${img.credit}</span>` : ""}
        </div>`
    )
    .join("");

  const dots = multi && images.length <= 8
    ? `<div class="news-carousel__dots" role="tablist" aria-label="사진 넘기기">
        ${images.map((_, i) => `<button type="button" class="news-carousel__dot" data-slide-to="${i}" aria-label="${i + 1}번째 사진"></button>`).join("")}
      </div>`
    : "";

  const counter = multi
    ? `<span class="news-carousel__counter"><span data-slide-current>1</span> / ${images.length}</span>`
    : "";

  // The whole left/right half of the frame is the hit target (data-slide-
  // prev/next on the <button> itself, sized to that full half in CSS), not
  // just the small round icon — the icon is a nested, purely visual span so
  // it can still sit centered at the edge while the button underneath it
  // covers the entire side.
  const arrows = multi
    ? `
      <button type="button" class="news-carousel__arrow news-carousel__arrow--prev" data-slide-prev aria-label="이전 사진">
        <span class="news-carousel__arrow-icon">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7L7 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </button>
      <button type="button" class="news-carousel__arrow news-carousel__arrow--next" data-slide-next aria-label="다음 사진">
        <span class="news-carousel__arrow-icon">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </button>`
    : "";

  return `
    <div class="news-carousel ${frameClass}" data-carousel>
      <div class="news-carousel__track" data-carousel-track>${slides}</div>
      ${arrows}
      ${counter}
      ${dots}
    </div>
  `;
}

function newsCardMarkup(post) {
  return `
    <article class="news-card" data-id="${post.id}">
      ${newsCarouselMarkup(post, "news-card__frame", "news-card__image")}
      <button class="news-card__body" type="button" aria-expanded="false" aria-label="Show excerpt">
        ${newsTagsMarkup(post)}
        <h3 class="news-card__title">${post.title}</h3>
        <div class="news-card__meta">
          <span class="news-card__date">${formatNewsDate(post)}</span>
          <span class="news-card__toggle" aria-hidden="true">
            <span class="news-card__more">more</span>
            <span class="news-card__chevron-stack">
              <svg class="news-card__chevron news-card__chevron--down" width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M1 1L8 9L15 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg class="news-card__chevron news-card__chevron--right" width="7" height="11" viewBox="0 0 7 11" fill="none">
                <path d="M1 1L6 5.5L1 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </span>
        </div>
        <div class="news-card__excerpt-wrap">
          <p class="news-card__excerpt">${post.excerpt}</p>
        </div>
      </button>
    </article>
  `;
}

function newsPostMarkup(post) {
  const paragraphs = post.body.map((p) => `<p class="news-post__paragraph">${p}</p>`).join("");
  return `
    <article class="news-post" id="${post.id}">
      ${newsCarouselMarkup(post, "news-post__frame", "news-post__image")}
      <div class="news-post__body">
        ${newsTagsMarkup(post)}
        <h2 class="news-post__title">${post.title}</h2>
        <span class="news-post__date">${formatNewsDate(post)}</span>
        ${paragraphs}
      </div>
    </article>
  `;
}

function latestPosts(count) {
  return [...NEWS_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, count);
}

// Native "smooth" scrollTo runs on the browser's own built-in easing, which
// on most engines is a flat/linear-ish curve — fine for a short nudge, but
// over a whole slide-width it reads as stiff, mechanical motion rather than
// the eased glide most modern carousels (and the rest of this site's own
// hover/reveal transitions) use. This animates scrollLeft by hand instead.
//
// Two things had to both be true to actually read as smoother, not just
// different — an ease-out-cubic curve here first (fast off the start,
// settling in at the end) came back reported as feeling STIFFER than the
// plain native scrollTo it replaced:
//
// 1. scroll-snap-type was still "x proximity" on the track (styles.css)
//    while this ran. That's not just inert during a JS-driven scroll — the
//    browser's own snap machinery keeps trying to pull scrollLeft toward
//    the nearest snap point on every frame, fighting this animation's own
//    writes to that exact same property. Two things driving scrollLeft at
//    once is what actually produced the stiffness: not the curve, a fight.
//    Disabling snap for the animation's duration and restoring it once the
//    slide has actually arrived removes the other party from that fight.
// 2. ease-out-cubic's own shape — maximum velocity right at t=0 — reads as
//    a sudden jerk into motion even with nothing fighting it. ease-*in*-out
//    (slow-fast-slow, the same shape .page-container's own load-in
//    transition and most native app slide transitions use) has no instant
//    jump in velocity at either end, which is what actually reads as
//    "smooth" rather than merely "not linear."
function animateScrollTo(el, targetLeft, duration) {
  const startLeft = el.scrollLeft;
  const delta = targetLeft - startLeft;
  if (!delta) return;
  const start = performance.now();
  const previousSnap = el.style.scrollSnapType;
  el.style.scrollSnapType = "none";

  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    el.scrollLeft = startLeft + delta * eased;
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      el.style.scrollSnapType = previousSnap;
    }
  }
  requestAnimationFrame(step);
}

// One swipeable frame: native horizontal scroll-snap does the actual
// dragging/momentum (touch, trackpad, mouse-wheel-shift all just work, no
// custom pointer-tracking needed) — this only keeps the counter/dots/arrows
// in sync with whichever slide the snap has landed on, and lets the arrows
// (and dots) *drive* that same scroll position (via animateScrollTo above,
// not native scrollTo — see its own comment) rather than fight it.
function initCarousel(root) {
  const track = root.querySelector("[data-carousel-track]");
  const slides = root.querySelectorAll(".news-carousel__slide");
  if (!track || slides.length < 2) return;

  const dots = root.querySelectorAll("[data-slide-to]");
  const counterEl = root.querySelector("[data-slide-current]");
  let current = 0;

  function setActive(index) {
    current = index;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    if (counterEl) counterEl.textContent = index + 1;
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    animateScrollTo(track, clamped * track.clientWidth, 500);
  }

  // Reflects whichever slide is actually centered after any scroll — drag,
  // wheel, arrow click, or dot click alike — rather than tracking each input
  // method separately.
  let raf = null;
  track.addEventListener(
    "scroll",
    () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const index = Math.round(track.scrollLeft / track.clientWidth);
        if (index !== current) setActive(index);
      });
    },
    { passive: true }
  );

  const prevBtn = root.querySelector("[data-slide-prev]");
  const nextBtn = root.querySelector("[data-slide-next]");
  // stopPropagation: the card's own body is a <button> that opens the
  // excerpt on click (news-card__body) — these arrows/dots sit outside that
  // button already, but they're reachable via the same pointer path, so
  // stopping propagation keeps a click here from also bubbling into
  // anything listening on the card itself.
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); goTo(current + 1); });
  dots.forEach((dot, i) => dot.addEventListener("click", (e) => { e.stopPropagation(); goTo(i); }));

  setActive(0);
}

// One lightbox shared by every photo on the page (Home cards and the News
// page's own posts alike), built lazily on first use rather than once per
// card/post — there's only ever one photo open at a time regardless of how
// many carousels exist. Centered via fixed + flex on the overlay itself
// (not a translate(-50%,-50%) on the image), so it stays centered
// regardless of the image's own natural aspect ratio.
let newsLightbox = null;

function getNewsLightbox() {
  if (newsLightbox) return newsLightbox;

  const el = document.createElement("div");
  el.className = "news-lightbox";
  el.innerHTML = `
    <button type="button" class="news-lightbox__close" aria-label="닫기">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 1L17 17M17 1L1 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
    <img class="news-lightbox__image" alt="" />
  `;
  document.body.appendChild(el);
  const imageEl = el.querySelector(".news-lightbox__image");

  function close() {
    el.classList.remove("is-open");
    document.documentElement.classList.remove("news-lightbox-open");
  }

  // Closes on a click anywhere on the dark backdrop, but not one that
  // bubbled up from the image or the close button themselves (those have
  // their own handling — the image click below is intentionally a no-op,
  // see its own comment).
  el.addEventListener("click", (e) => {
    if (e.target === el) close();
  });
  el.querySelector(".news-lightbox__close").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  // Stops a click ON the photo itself from bubbling to the backdrop and
  // closing the lightbox — there's nothing else for it to do here, since
  // "already viewing the photo you clicked" has no further zoom level.
  imageEl.addEventListener("click", (e) => e.stopPropagation());

  newsLightbox = {
    open(src, alt) {
      imageEl.src = src;
      imageEl.alt = alt || "";
      el.classList.add("is-open");
      // Not overflow: hidden on <body> — this site's own scroll/parallax
      // listeners (script.js) read window.scrollY, which a body-level
      // overflow hack leaves untouched while still visually freezing the
      // page; class-based so nothing here has to know what page it's on.
      document.documentElement.classList.add("news-lightbox-open");
    },
    close,
  };
  return newsLightbox;
}

// Wires every zoom button on the page, independent of initCarousel — a
// single-photo post/card has no carousel at all (initCarousel bails out
// below 2 slides) but its one photo should still be zoomable.
function initZoom(root) {
  const lightbox = getNewsLightbox();
  root.querySelectorAll("[data-zoom]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      lightbox.open(btn.dataset.zoomSrc, btn.dataset.zoomAlt);
    });
  });
}

function initHomeNewsGrid() {
  const grid = document.querySelector("[data-news-grid]");
  if (!grid) return;

  grid.innerHTML = latestPosts(6).map(newsCardMarkup).join("");

  const cards = grid.querySelectorAll(".news-card");
  cards.forEach((card) => card.querySelectorAll("[data-carousel]").forEach(initCarousel));
  initZoom(grid);

  cards.forEach((card) => {
    const body = card.querySelector(".news-card__body");
    body.addEventListener("click", () => {
      if (card.classList.contains("is-open")) {
        window.location.href = `news.html#${card.dataset.id}`;
        return;
      }
      card.classList.add("is-open");
      body.setAttribute("aria-expanded", "true");
    });

    // Touch pointers fire pointerleave right after the tap that opened this
    // (a touch "pointer" never sustains hover the way a mouse does — most
    // browsers treat contact ending as leaving), so without the pointerType
    // check this closed the card in the same instant it opened on any touch
    // device — the tap looked like it did nothing. Restricting the
    // auto-collapse to real mouse pointers leaves touch as a clean toggle:
    // tap opens (see the click handler above), tap again navigates.
    card.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      card.classList.remove("is-open");
      body.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll reveal: each card starts hidden (see .news-card in styles.css)
  // and fades/slides in once it's actually scrolled into view, staggered a
  // little per card instead of all firing at once. Falls back to showing
  // everything immediately if IntersectionObserver isn't available or the
  // user asked for reduced motion.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  // One-time reveal: add .is-visible and stop observing, rather than
  // toggling it on/off with entry.isIntersecting on every scroll tick. That
  // toggling used to replay the reveal on scrolling back up past a card,
  // but it had a real bug at the very bottom of the page: revealing a card
  // moves it (the translateY in .news-card's own transition), and once
  // scrolled all the way down there's no further scroll to carry it past
  // the observer's threshold — so a card sitting right at that boundary
  // would reveal, shift up into no-longer-intersecting, hide, shift back
  // down into intersecting, reveal again, forever. That read as the News
  // cards' text vibrating in place whenever the page was scrolled all the
  // way to the bottom. Unobserving after the first reveal removes the loop
  // entirely — nothing left to toggle back off once it's shown.
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

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${(index % 3) * 80}ms`;
    revealObserver.observe(card);
  });
}

function initNewsPageList() {
  const list = document.querySelector("[data-news-list]");
  if (!list) return;

  list.innerHTML = latestPosts(NEWS_POSTS.length).map(newsPostMarkup).join("");
  list.querySelectorAll("[data-carousel]").forEach(initCarousel);
  initZoom(list);
}

if (typeof NEWS_POSTS !== "undefined") {
  initHomeNewsGrid();
  initNewsPageList();
}
