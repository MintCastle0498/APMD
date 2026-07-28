// Renders PUBLICATIONS (publication-data.js) grouped by year into
// [data-publication-years], newest year first, and drives the fixed year
// sidebar's scroll-spy (current year bold/accent, 2 years above/below
// fading out, click to jump).

// `journal` is stored as one combined citation string (e.g. "Nanophotonics
// 14, 8, 1273-1282 (2025)") — this strips it down to just the journal's own
// name for display (volume/issue/page numbers dropped), cutting at
// whichever comes first: a comma, an opening paren, or a digit preceded by
// whitespace. `pub.year` (already a clean separate field) supplies the year
// instead of trying to re-parse it back out of the string.
function journalName(journal) {
  const match = journal.match(/^.*?(?=,|\(|\s\d)/);
  return (match ? match[0] : journal).trim();
}

// people-data.js (PEOPLE/ALUMNI, loaded before this file — see
// publication.html) stores names "Family, Given" (e.g. "Kim, Hyeonhee"),
// but a paper's authors string writes them "Given Family" (e.g. "Hyeonhee
// Kim", matching how they're cited on the actual paper) — this converts
// the former into the latter so the two can be compared directly, also
// dropping the "Dr. " prefix a few roster entries use.
function toGivenFamily(rawName) {
  const name = rawName.replace(/^Dr\.\s*/, "").trim();
  const commaIdx = name.indexOf(",");
  if (commaIdx === -1) return name;
  const family = name.slice(0, commaIdx).trim();
  const given = name.slice(commaIdx + 1).trim();
  return `${given} ${family}`;
}

// A name's internal whitespace/hyphenation can legitimately differ
// between how a given paper actually prints it and how people-data.js
// spells the same person out — e.g. one 2024 paper credits "Seung Kyu
// Kang" (three words) while this lab's own Alumni entry has him as "Kang,
// Seungkyu" ("Seungkyu" as one word), and "Sang-Hyeon Nam" (hyphenated)
// vs. this lab's "Nam, Sanghyeon" (not). A plain exact-string check missed
// both. Collapsing whitespace AND hyphens away before comparing means any
// of those spellings matches the same person.
function normalizeName(name) {
  return name.toLowerCase().replace(/[\s-]+/g, "");
}

// A few more people whose paper-credited name is a genuinely different
// romanization of the same syllables from their own People-page spelling
// (not just whitespace/hyphenation, which normalizeName above already
// handles) — confirmed by hand, not guessed, since two different-looking
// romanizations of a Korean name can't be told apart programmatically.
const OUR_NAME_ALIASES = [
  "Minseong Heo", // this lab's Alumni entry has him as "Heo, Minsung"
  "Kyungsun Yun", // this lab's Alumni entry has her as "Yun, Kyunsun"
  "Nayeun Lee", // this lab's Alumni entry has her as "Lee, Nayeon"
];

// Everyone this lab page actually has a listing for — the Professor
// (hardcoded in people.html, not in PEOPLE) plus every current roster
// member and every Alumni entry. Built once (not per-card): PEOPLE/ALUMNI
// are static arrays, not something that changes while the page is open.
function buildOurNames() {
  // "J. Shin" is how the Professor's own name is abbreviated on this
  // list's older (pre-APMD, Stanford-era) entries — every single paper
  // here is one of his, so unlike an abbreviated roster/alumni name (which
  // would risk matching the wrong person entirely, e.g. some other "H.
  // Kim"), this one abbreviation is unambiguous across the whole file.
  const names = new Set(["Jonghwa Shin", "J. Shin", ...OUR_NAME_ALIASES].map(normalizeName));
  if (typeof PEOPLE !== "undefined") {
    PEOPLE.forEach((p) => names.add(normalizeName(toGivenFamily(p.name))));
  }
  if (typeof ALUMNI !== "undefined") {
    ALUMNI.forEach((a) => names.add(normalizeName(toGivenFamily(a.name))));
  }
  return names;
}

const OUR_NAMES = buildOurNames();

// Splits the authors string back into its individual names and fades
// anyone NOT in OUR_NAMES to gray-4 — external collaborators read as
// visually secondary to this lab's own people at a glance, without having
// to actually read every name. A few older entries write the last name as
// "..., and Name" or (with only two authors) "Name1 and Name2" instead of
// a plain comma — the capturing group here keeps whichever exact
// separator ", " / " and " / ", and " was actually used as its own
// (untouched) array element, interleaved with the real name tokens on
// either side of it, so splitting to find names doesn't also rewrite the
// citation's own punctuation. Each name's trailing */‡ marks travel with
// it into the OUR_NAMES check (stripped first so e.g. "Jonghwa Shin‡"
// still matches "Jonghwa Shin") but stay in the displayed text.
//
// pub.externalAuthors (optional, per-entry) forces specific same-named
// people to render as external regardless of the OUR_NAMES match — for
// the rare case where a real outside collaborator happens to share an
// exact name with an actual roster member (e.g. a different "Jong Min
// Kim" than this lab's own), which no amount of normalization can
// distinguish since they're genuinely the same string.
function authorsMarkup(authors, externalAuthors) {
  const overrides = new Set((externalAuthors || []).map(normalizeName));
  return authors
    .split(/(,\s+(?:and\s+)?|\s+and\s+)/)
    .map((part, i) => {
      if (i % 2 === 1) return part; // a captured separator, not a name
      const bare = normalizeName(part.replace(/[*‡]/g, "").trim());
      return OUR_NAMES.has(bare) && !overrides.has(bare)
        ? part
        : `<span class="publication-card__author--external">${part}</span>`;
    })
    .join("");
}

// Both image and doiUrl are optional (an entry gets added before its
// figure/DOI is ready to hand) — plain <img src=""> reloads the current
// page in some browsers rather than just failing quietly, and an empty
// href on the DOI link would "link" to this same page too, so each gets
// its own graceful stand-in instead of just leaving the field blank.
function publicationCardMarkup(pub) {
  const imageMarkup = pub.image
    ? `<img class="publication-card__image" src="${pub.image}" alt="${pub.title}" loading="lazy" />`
    : `<div class="publication-card__image publication-card__image--empty" aria-hidden="true"></div>`;
  const doiMarkup = pub.doiUrl
    ? `<a class="publication-card__doi" href="${pub.doiUrl}" target="_blank" rel="noopener noreferrer">DOI</a>`
    : `<span class="publication-card__doi publication-card__doi--pending">DOI</span>`;
  return `
    <div class="publication-card">
      ${imageMarkup}
      <div class="publication-card__info">
        <h3 class="publication-card__title">${pub.title}</h3>
        <p class="publication-card__authors">${authorsMarkup(pub.authors, pub.externalAuthors)}</p>
        <div class="publication-card__journal-row">
          <span class="publication-card__journal">${journalName(pub.journal)} (${pub.year})</span>
          ${doiMarkup}
        </div>
      </div>
    </div>
  `;
}

function yearBlockMarkup(year, pubs) {
  const cards = pubs.map(publicationCardMarkup).join("");
  return `
    <div class="publication-year-block" data-year-block="${year}">
      <span class="publication-year-label">${year}</span>
      <div class="publication-year-list">${cards}</div>
    </div>
  `;
}

// `date` (added via a Crossref lookup per DOI, see publication-data.js's
// own header comment) is "YYYY-MM" or "YYYY-MM-DD" — Crossref doesn't
// always have day-level precision, and a handful of very old entries
// have neither and no `date` field at all. Turning it into one plain
// comparable number (year*10000 + month*100 + day) means an entry with
// only a year sorts as e.g. 20260000, which lands after every dated entry
// in that same year but never crosses into a different year — exactly
// "sort by whatever precision Crossref actually gave this one paper."
function dateSortValue(pub) {
  if (!pub.date) return pub.year * 10000;
  const [y, mo = "0", d = "0"] = pub.date.split("-");
  return Number(y) * 10000 + Number(mo) * 100 + Number(d);
}

function groupByYear(pubs) {
  const byYear = new Map();
  pubs.forEach((pub) => {
    if (!byYear.has(pub.year)) byYear.set(pub.year, []);
    byYear.get(pub.year).push(pub);
  });
  const entries = [...byYear.entries()].sort((a, b) => b[0] - a[0]);
  entries.forEach(([, list]) => {
    list.sort((a, b) => dateSortValue(b) - dateSortValue(a));
  });
  return entries;
}

// Matches .publication-year-nav's fixed height (5 * 36) and
// .publication-year-nav__item's height in styles.css — the slide math
// below only lines up if all three stay in sync.
const YEAR_NAV_ITEM_HEIGHT = 36;
const YEAR_NAV_CENTER_SLOT = 2; // 0-indexed, middle of 5 visible slots

// Must match .publication-year-nav__item's width / .is-current's width in
// styles.css — these are the boxes fitTextWidth() below stretches each
// year's digits to fill exactly.
const YEAR_NAV_WIDTH = 32;
const YEAR_NAV_WIDTH_CURRENT = 40;

// Geist's digits aren't tabular, so "2026" and "2021" naturally measure a
// couple px apart — enough to look unevenly centered in a fixed-width
// slot. Rather than lean on CSS text-justify (inter-character justification
// is a CJK feature; several engines don't extend the stretch to plain
// Latin/digit runs, so it silently did nothing here), this measures the
// text's real rendered width and computes the exact letter-spacing needed
// to stretch it to the target — works regardless of font metrics or
// browser support.
//
// el.getBoundingClientRect().width measures the BOX, not the text — since
// .publication-year-nav__item already has a fixed CSS width (32/40px),
// that call was just reading back the fixed width itself every time
// (always ~0 natural spacing needed), which is why the fix appeared to do
// nothing. Forcing width: fit-content first makes the box actually
// shrink-wrap the glyphs so the measurement is the text's real size; the
// width is put back (clearing the inline override) before letter-spacing
// is applied, so the CSS class's fixed width still wins for layout.
function fitTextWidth(el, targetWidth) {
  el.style.letterSpacing = "0px";
  el.style.width = "fit-content";
  const natural = el.getBoundingClientRect().width;
  el.style.width = "";
  const chars = el.textContent.length;
  if (chars > 1 && natural > 0) {
    el.style.letterSpacing = `${(targetWidth - natural) / (chars - 1)}px`;
  }
}

// Matches the fixed header's own height — this is the y the target year
// block's top edge should land at after scrolling, same reference line the
// IntersectionObserver below uses to decide what counts as "at the top."
const HEADER_HEIGHT = 64;

// A short, decisive ease-out (not the browser's own "smooth" behavior,
// which glides for a browser-controlled duration/curve that reads as slow
// and floaty) — this is the "탁탁 붙는" snap: quick motion that visibly
// decelerates into place rather than drifting to a stop. Returns a promise
// that resolves once the animation finishes, so callers know exactly when
// it's safe to stop suppressing the scroll-spy observer.
function animateScrollTo(targetY, duration) {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 1) {
      resolve();
      return;
    }
    const startTime = performance.now();

    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      window.scrollTo(0, startY + distance * eased);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

function initYearSidebar(years) {
  const list = document.querySelector("[data-year-nav-list]");
  const nav = document.querySelector(".publication-year-nav");
  if (!list || !nav || !years.length) return;

  let currentIndex = 0;

  // Every year gets a permanent <li>, never removed — what changes on
  // navigation is just which one is "current" and how far the list is
  // slid, so the current year's slot never moves even at the first/last
  // year (there just aren't real items to fill the empty slots on that
  // side, matching the "leave it blank" ask).
  list.innerHTML = years
    .map((year) => `<li><button type="button" class="publication-year-nav__item" data-year-jump="${year}">${year}</button></li>`)
    .join("");

  const items = [...list.querySelectorAll(".publication-year-nav__item")];

  function render() {
    items.forEach((item, index) => {
      const distance = Math.abs(index - currentIndex);
      item.classList.toggle("is-current", distance === 0);
      item.classList.toggle("is-near", distance === 1);
      item.classList.toggle("is-far", distance === 2);
      fitTextWidth(item, distance === 0 ? YEAR_NAV_WIDTH_CURRENT : YEAR_NAV_WIDTH);
    });

    const offset = (YEAR_NAV_CENTER_SLOT - currentIndex) * YEAR_NAV_ITEM_HEIGHT;
    list.style.transform = `translateY(${offset}px)`;
  }

  // Set while a scroll triggered from the sidebar itself (click or wheel)
  // is still animating, so the IntersectionObserver below doesn't fight it:
  // the animation passes through other years' threshold bands on the way
  // to its target, and without this guard each one briefly became
  // "current" mid-flight, snapping the sidebar there and back — the
  // "튕기는" bounce. animateScrollTo's own promise resolving (not a guessed
  // timeout) is what lifts the guard again, exactly when the motion ends.
  let ignoreObserverUntilScrollSettles = false;
  let scrollToken = 0;

  function goTo(index, { scroll = true } = {}) {
    const clamped = Math.max(0, Math.min(years.length - 1, index));
    if (clamped === currentIndex) return;
    currentIndex = clamped;
    render();

    if (scroll) {
      const target = document.querySelector(`[data-year-block="${years[currentIndex]}"]`);
      if (target) {
        const token = ++scrollToken;
        ignoreObserverUntilScrollSettles = true;
        const targetY = window.scrollY + target.getBoundingClientRect().top - HEADER_HEIGHT;
        animateScrollTo(targetY, 320).then(() => {
          // Only the most recent scroll gets to clear the guard — if
          // another jump started before this one finished, that newer
          // call's own resolution is what should end the suppression.
          if (token === scrollToken) {
            ignoreObserverUntilScrollSettles = false;
          }
        });
      }
    }
  }

  render();

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-year-jump]");
    if (!button) return;
    goTo(years.indexOf(Number(button.dataset.yearJump)));
  });

  // Scrolling with the pointer over the sidebar jumps exactly one year per
  // wheel notch instead of scrolling the page underneath it. wheelLocked is
  // a cooldown (matching the snap transition's own length) so one physical
  // scroll gesture — which fires many small wheel events — moves one year
  // at a time instead of racing through several.
  let wheelLocked = false;
  nav.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      goTo(currentIndex + (event.deltaY > 0 ? 1 : -1));
      setTimeout(() => {
        wheelLocked = false;
      }, 450);
    },
    { passive: false }
  );

  // Whichever year block is at the TOP of the visible screen becomes
  // "current" — the rootMargin shrinks the observed area down to a thin
  // band just below the fixed header (64px down), not the viewport's
  // vertical center, so scrolling a new paper to the top of the screen is
  // what moves its year into the sidebar's center.
  const observer = new IntersectionObserver(
    (entries) => {
      if (ignoreObserverUntilScrollSettles) return;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = years.indexOf(Number(entry.target.dataset.yearBlock));
        if (index !== -1 && index !== currentIndex) {
          currentIndex = index;
          render();
        }
      });
    },
    { rootMargin: `-${HEADER_HEIGHT}px 0px -85% 0px`, threshold: 0 }
  );

  document.querySelectorAll("[data-year-block]").forEach((el) => observer.observe(el));
}

function initPublicationYears() {
  const container = document.querySelector("[data-publication-years]");
  if (!container) return;

  const grouped = groupByYear(PUBLICATIONS);

  container.innerHTML = grouped
    .map(([year, pubs]) => yearBlockMarkup(year, pubs))
    .join('<div class="dash-line" role="separator" aria-hidden="true"></div>');

  initYearSidebar(grouped.map(([year]) => year));
}

if (typeof PUBLICATIONS !== "undefined") {
  initPublicationYears();
}
