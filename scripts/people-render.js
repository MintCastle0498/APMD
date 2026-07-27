// Renders PEOPLE/ALUMNI/STAFF (people-data.js) into whichever
// [data-people-grid] section matches — adding a new person is just adding a
// new object to the right array, nothing here needs to change.

// `note` is optional (e.g. a double major) — when present it renders as its
// own line under the main major/university/year line, indented to align
// with it rather than with the label.
function degreeRowMarkup(d) {
  const note = d.note ? `<span class="professor__degree-note">${d.note}</span>` : "";
  return `
    <div class="professor__degree-row">
      <span class="professor__degree-label">${d.label}</span>
      <span class="professor__degree-detail"><span class="professor__degree-major">${d.major}</span><span class="professor__degree-punct">,</span> <span class="professor__degree-university">${d.university}</span><span class="professor__degree-punct">,</span> <span class="professor__degree-paren">(</span><span class="professor__degree-year">${d.year}</span><span class="professor__degree-paren">)</span></span>${note}
    </div>
  `;
}

function studentCardMarkup(person) {
  const degreeRows = person.degrees.map(degreeRowMarkup).join("");
  return `
    <div class="student-card">
      <button class="student-card__row" type="button" data-student-toggle aria-expanded="false">
        <div class="student-card__photo-wrap">
          <img class="student-card__photo" src="${person.photo}" alt="${person.name}" loading="lazy" />
        </div>
        <div class="student-card__info">
          <div class="student-card__primary">
            <h3 class="student-card__name">${person.name}</h3>
            <p class="student-card__role">${person.role}</p>
            <div class="student-card__admission">
              <span>${person.admissionYear}</span>
              <span>${person.admissionSeason}</span>
            </div>
          </div>
          <div class="student-card__divider" aria-hidden="true"></div>
          <div class="student-card__extra-wrap">
            <div class="student-card__extra">
              <p class="student-card__email">${person.email}</p>
              <div class="professor__degree">${degreeRows}</div>
            </div>
          </div>
        </div>
      </button>
    </div>
  `;
}

// Same visual layout as studentCardMarkup, but a plain (non-button) row with
// no divider/extra-info block at all — nothing to expand into — and the
// admission row only appears if a year or season was actually given.
function staffCardMarkup(person) {
  const admission =
    person.admissionYear || person.admissionSeason
      ? `<div class="student-card__admission">
          <span>${person.admissionYear}</span>
          <span>${person.admissionSeason}</span>
        </div>`
      : "";

  return `
    <div class="student-card student-card--static">
      <div class="student-card__row">
        <div class="student-card__photo-wrap">
          <img class="student-card__photo" src="${person.photo}" alt="${person.name}" loading="lazy" />
        </div>
        <div class="student-card__info">
          <div class="student-card__primary">
            <h3 class="student-card__name">${person.name}</h3>
            <p class="student-card__role">${person.role}</p>
            ${admission}
          </div>
        </div>
      </div>
    </div>
  `;
}

// The comma after `program` is baked in here (not a separate gapped span) so
// it reads as "Ph.D. Candidate," attached to the word before the 8px gap to
// the year.
function alumniCardMarkup(person) {
  const programSpan = person.year
    ? `<span>${person.program},</span>`
    : `<span>${person.program}</span>`;
  const yearSpan = person.year ? `<span>${person.year}</span>` : "";
  const seasonSpan = person.season ? `<span>${person.season}</span>` : "";
  const currentRow = person.current
    ? `
      <div class="alumni-card__current">
        <span>Currently:</span>
        <span>${person.current}</span>
      </div>`
    : "";

  return `
    <div class="alumni-card">
      <h3 class="alumni-card__name">${person.name}</h3>
      <div class="alumni-card__program">
        ${programSpan}
        ${yearSpan}
        ${seasonSpan}
      </div>${currentRow}
    </div>
  `;
}

function initPeopleGrids() {
  const grids = document.querySelectorAll("[data-people-grid]");
  if (!grids.length) return;

  grids.forEach((grid) => {
    const members = PEOPLE.filter((person) => person.category === grid.dataset.peopleGrid);
    if (!members.length) return;

    grid.innerHTML = members
      .map(studentCardMarkup)
      .join('<div class="dash-line" role="separator" aria-hidden="true"></div>');
  });

  // Click toggles the extra-info reveal; leaving the card with the pointer
  // auto-collapses it again, same as the Professor's Research Focus and the
  // Home NEWS card excerpt. Staff cards (.student-card--static) have no
  // toggle button at all, so they're skipped here.
  document.querySelectorAll(".student-card").forEach((card) => {
    const button = card.querySelector("[data-student-toggle]");
    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    // Same touch fix as the Home NEWS card (news-render.js): a touch tap's
    // own release fires pointerleave immediately (touch never sustains
    // hover), so without this the card closed itself the instant it opened
    // on any touch device. Real mouse leaves still auto-collapse as before.
    card.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      card.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function initStaffGrid() {
  const grid = document.querySelector('[data-people-grid="staff"]');
  if (!grid || typeof STAFF === "undefined" || !STAFF.length) return;

  grid.innerHTML = STAFF.map(staffCardMarkup).join('<div class="dash-line" role="separator" aria-hidden="true"></div>');
}

function initAlumniGrid() {
  const grid = document.querySelector('[data-people-grid="alumni"]');
  if (!grid || typeof ALUMNI === "undefined" || !ALUMNI.length) return;

  grid.innerHTML = ALUMNI.map(alumniCardMarkup).join('<div class="dash-line" role="separator" aria-hidden="true"></div>');
}

// Same hover-tint/click-rotate interaction as the Professor's Research
// Focus, applied to the Alumni section's own title — click to open, click
// again to close (no pointerleave auto-collapse).
function initAlumniToggle() {
  const toggle = document.querySelector("[data-alumni-toggle]");
  if (!toggle) return;

  const alumni = toggle.closest(".alumni");

  toggle.addEventListener("click", () => {
    const isOpen = alumni.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (typeof PEOPLE !== "undefined") {
  initPeopleGrids();
}
initStaffGrid();
initAlumniGrid();
initAlumniToggle();
