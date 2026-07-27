// Browser-side glue: File System Access API (real disk reads/writes, no
// server) driving AdminCore's pure text logic (admin-core.js), plus all
// the tab/form wiring. This only runs usefully over http://localhost or
// https — Chrome/Edge refuse showDirectoryPicker() on a plain file://
// page, which is why this has to be opened through a local server (see
// admin/README.md).

let rootHandle = null;

// Mirrors NEWS_CATEGORIES in scripts/news-data.js — kept in sync by hand
// since this tool reads that file as plain text (to splice it safely)
// rather than executing it, so it can't just import the real object.
const NEWS_CATEGORY_LABELS = {
  award: "수상",
  event: "연구실 행사",
  conference: "학회 참석",
  press: "외부보도",
};

// ---------------------------------------------------------------------
// File System Access helpers
// ---------------------------------------------------------------------

async function getDirHandle(relDirPath, { create = false } = {}) {
  let handle = rootHandle;
  const parts = relDirPath.split("/").filter(Boolean);
  for (const part of parts) {
    handle = await handle.getDirectoryHandle(part, { create });
  }
  return handle;
}

async function readTextFile(relPath) {
  const parts = relPath.split("/");
  const fileName = parts.pop();
  const dir = await getDirHandle(parts.join("/"));
  const fileHandle = await dir.getFileHandle(fileName);
  const file = await fileHandle.getFile();
  return await file.text();
}

async function writeTextFile(relPath, text) {
  const parts = relPath.split("/");
  const fileName = parts.pop();
  const dir = await getDirHandle(parts.join("/"), { create: true });
  const fileHandle = await dir.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(text);
  await writable.close();
}

async function writeBinaryFile(relPath, file) {
  const parts = relPath.split("/");
  const fileName = parts.pop();
  const dir = await getDirHandle(parts.join("/"), { create: true });
  const fileHandle = await dir.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(file);
  await writable.close();
}

async function fileExists(relPath) {
  try {
    const parts = relPath.split("/");
    const fileName = parts.pop();
    const dir = await getDirHandle(parts.join("/"));
    await dir.getFileHandle(fileName);
    return true;
  } catch {
    return false;
  }
}

// Keeps the original name whenever there's no collision (matches how
// every existing photo/figure in this repo is named) — only appends
// "-2", "-3", ... if something's already there under that exact name.
async function uniqueFileName(folder, desiredName) {
  const dot = desiredName.lastIndexOf(".");
  const stem = dot === -1 ? desiredName : desiredName.slice(0, dot);
  const ext = dot === -1 ? "" : desiredName.slice(dot);
  let name = desiredName;
  let n = 1;
  while (await fileExists(`${folder}/${name}`)) {
    n += 1;
    name = `${stem}-${n}${ext}`;
  }
  return name;
}

function sanitizeFileName(name) {
  // Only strip characters that are actually illegal in a Windows file
  // name (this repo already has commas, apostrophes, en-dashes, spaces,
  // parentheses, and Korean text in real filenames — none of that needs
  // touching).
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "");
}

function extOf(fileName) {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot);
}

// ---------------------------------------------------------------------
// Status / toast
// ---------------------------------------------------------------------

function showToast(message, isError) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.toggle("admin-toast--error", !!isError);
  el.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.hidden = true;
  }, isError ? 6000 : 3200);
}

async function withBusy(button, fn) {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "처리 중...";
  try {
    await fn();
  } catch (err) {
    console.error(err);
    showToast(`오류: ${err && err.message ? err.message : err}`, true);
  } finally {
    button.disabled = false;
    // fn() itself may have already set a deliberate final label (e.g. an
    // edit-mode submit calling cancelXEdit(), which resets the button back
    // to "추가하기") — only fall back to the pre-click snapshot if nothing
    // did, i.e. textContent is still the "처리 중..." placeholder.
    if (button.textContent === "처리 중...") {
      button.textContent = original;
    }
  }
}

// ---------------------------------------------------------------------
// Folder picking
// ---------------------------------------------------------------------

const DATA_FILES = {
  news: "scripts/news-data.js",
  people: "scripts/people-data.js",
  publication: "scripts/publication-data.js",
};

async function pickFolder() {
  const handle = await window.showDirectoryPicker({ mode: "readwrite" });
  rootHandle = handle;
  // Sanity check: this should be the repo root, not some random folder —
  // scripts/news-data.js existing is a cheap, specific enough signature.
  const looksRight = await fileExists(DATA_FILES.news);
  if (!looksRight) {
    rootHandle = null;
    throw new Error(
      "이 폴더에 scripts/news-data.js가 없습니다. 사이트 루트 폴더(APMD Web)를 선택해주세요."
    );
  }
  document.getElementById("folder-status").textContent = `선택됨: ${handle.name}`;
  document.getElementById("admin-main").classList.remove("is-disabled");
  await refreshAll();
}

// ---------------------------------------------------------------------
// News
// ---------------------------------------------------------------------

function newsIdBase(dateStr) {
  return `post-${(dateStr || "").replace(/-/g, "")}`;
}

async function uniqueNewsId(dateStr, existingIds) {
  const base = newsIdBase(dateStr);
  let id = base;
  let n = 1;
  while (existingIds.includes(id)) {
    n += 1;
    id = `${base}-${n}`;
  }
  return id;
}

function renderNewsList(entries) {
  const list = document.getElementById("news-list");
  if (!entries.length) {
    list.innerHTML = `<p class="admin-empty">아직 등록된 글이 없습니다.</p>`;
    return;
  }
  list.innerHTML = entries
    .slice()
    .reverse()
    .map((e) => {
      const o = e.obj;
      if (!o) {
        return `<div class="admin-item admin-item--error">읽기 오류: ${e.error}</div>`;
      }
      const cat = NEWS_CATEGORY_LABELS[o.tag] || o.tag;
      return `
        <div class="admin-item" data-index="${e.index}">
          <div class="admin-item__main">
            <span class="admin-item__title">${escapeHtml(o.title)}</span>
            <span class="admin-item__meta">${escapeHtml(o.date)}${o.dateEnd && o.dateEnd !== o.date ? " – " + escapeHtml(o.dateEnd) : ""} · ${escapeHtml(cat)} · ${escapeHtml((o.people || []).join(", "))} · 사진 ${o.images.length}장</span>
          </div>
          <div class="admin-item__actions">
            <button type="button" class="admin-item__edit" data-action="edit-news" data-index="${e.index}">수정</button>
            <button type="button" class="admin-item__delete" data-action="delete-news" data-index="${e.index}">삭제</button>
          </div>
        </div>
      `;
    })
    .join("");
}

async function refreshNewsList() {
  const source = await readTextFile(DATA_FILES.news);
  const entries = AdminCore.listEntries(source, "NEWS_POSTS");
  renderNewsList(entries);
  return entries;
}

function collectNewsImageRows() {
  return [...document.querySelectorAll("#news-image-rows .admin-image-row")].map((row) => ({
    file: row._file,
    credit: row.querySelector(".admin-image-row__credit").value.trim(),
  }));
}

function renderNewsImageRows(files) {
  const container = document.getElementById("news-image-rows");
  container.innerHTML = "";
  [...files].forEach((file) => {
    const row = document.createElement("div");
    row.className = "admin-image-row";
    row._file = file;
    row.innerHTML = `
      <span class="admin-image-row__name">${escapeHtml(file.name)}</span>
      <input type="text" class="admin-image-row__credit" placeholder="사진 출처 (선택, 예: APMD Lab)" />
    `;
    container.appendChild(row);
  });
}

// Edit state: null in "add" mode, the entry's index while editing it.
// newsExistingImages carries forward the images already on disk for the
// entry being edited (each row's credit stays editable, and removing a row
// just drops it from the entry — the file itself is left alone, same as
// deleteNewsEntry below never touching image files). New uploads in
// #news-images are appended after these on submit.
let newsEditIndex = null;
let newsExistingImages = [];

function renderExistingNewsImageRows() {
  const container = document.getElementById("news-existing-image-rows");
  container.innerHTML = "";
  newsExistingImages.forEach((img, i) => {
    const row = document.createElement("div");
    row.className = "admin-image-row admin-image-row--existing";
    row.innerHTML = `
      <span class="admin-image-row__name">${escapeHtml(img.src.split("/").pop())}</span>
      <input type="text" class="admin-image-row__credit" placeholder="사진 출처 (선택, 예: APMD Lab)" value="${escapeHtml(img.credit || "")}" />
      <button type="button" class="admin-image-row__remove" aria-label="제거">✕</button>
    `;
    row.querySelector(".admin-image-row__credit").addEventListener("input", (ev) => {
      newsExistingImages[i] = { ...newsExistingImages[i], credit: ev.target.value.trim() };
    });
    row.querySelector(".admin-image-row__remove").addEventListener("click", () => {
      newsExistingImages.splice(i, 1);
      renderExistingNewsImageRows();
    });
    container.appendChild(row);
  });
}

async function startEditNews(index) {
  const source = await readTextFile(DATA_FILES.news);
  const entries = AdminCore.listEntries(source, "NEWS_POSTS");
  const entry = entries[index];
  if (!entry || !entry.obj) return;
  const o = entry.obj;
  const form = document.getElementById("news-form");

  form.title.value = o.title || "";
  form.tag.value = o.tag;
  form.people.value = (o.people || []).join(", ");
  form.date.value = o.date || "";
  form.dateEnd.value = o.dateEnd || "";
  form.excerpt.value = o.excerpt || "";
  form.body.value = (o.body || []).join("\n\n");

  newsExistingImages = (o.images || []).map((img) => ({ ...img }));
  renderExistingNewsImageRows();
  document.getElementById("news-images").value = "";
  document.getElementById("news-image-rows").innerHTML = "";

  newsEditIndex = index;
  document.getElementById("news-form-title").textContent = "소식 수정";
  document.getElementById("news-submit-btn").textContent = "수정 완료";
  document.getElementById("news-cancel-edit").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelNewsEdit() {
  newsEditIndex = null;
  newsExistingImages = [];
  const form = document.getElementById("news-form");
  form.reset();
  document.getElementById("news-existing-image-rows").innerHTML = "";
  document.getElementById("news-image-rows").innerHTML = "";
  document.getElementById("news-form-title").textContent = "새 소식 추가";
  document.getElementById("news-submit-btn").textContent = "추가하기";
  document.getElementById("news-cancel-edit").hidden = true;
}

async function submitNewsForm(e) {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  await withBusy(button, async () => {
    const title = form.title.value.trim();
    const tag = form.tag.value;
    const peopleRaw = form.people.value.trim();
    const people = peopleRaw ? peopleRaw.split(",").map((s) => s.trim()).filter(Boolean) : ["APMD"];
    const date = form.date.value;
    const dateEnd = form.dateEnd.value || "";
    const excerpt = form.excerpt.value.trim();
    const bodyRaw = form.body.value.trim();
    const body = bodyRaw
      ? bodyRaw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
      : [excerpt];
    const newRows = collectNewsImageRows();

    if (!title) throw new Error("제목을 입력해주세요.");
    if (!date) throw new Error("날짜를 입력해주세요.");
    if (!newsExistingImages.length && !newRows.length) throw new Error("사진을 1장 이상 선택해주세요.");

    const newImages = [];
    for (const { file, credit } of newRows) {
      const desired = sanitizeFileName(file.name);
      const finalName = await uniqueFileName("News", desired);
      await writeBinaryFile(`News/${finalName}`, file);
      newImages.push({ src: `News/${finalName}`, alt: title, ...(credit ? { credit } : {}) });
    }
    const images = [...newsExistingImages, ...newImages];

    const source = await readTextFile(DATA_FILES.news);

    if (newsEditIndex !== null) {
      const original = AdminCore.listEntries(source, "NEWS_POSTS")[newsEditIndex];
      const id = (original && original.obj && original.obj.id) || newsIdBase(date);
      const entry = { id, title, tag, people, date, ...(dateEnd && dateEnd !== date ? { dateEnd } : {}), images, excerpt: excerpt || body[0], body };
      const newSource = AdminCore.updateEntryAt(source, "NEWS_POSTS", newsEditIndex, AdminCore.formatNewsEntry(entry));
      await writeTextFile(DATA_FILES.news, newSource);
      cancelNewsEdit();
      await refreshNewsList();
      showToast(`"${title}" 글을 수정했습니다.`);
      return;
    }

    const existingIds = AdminCore.listEntries(source, "NEWS_POSTS").map((e) => e.obj && e.obj.id).filter(Boolean);
    const id = await uniqueNewsId(date, existingIds);

    const entry = { id, title, tag, people, date, ...(dateEnd && dateEnd !== date ? { dateEnd } : {}), images, excerpt: excerpt || body[0], body };
    const entryText = AdminCore.formatNewsEntry(entry);
    const newSource = AdminCore.insertEntry(source, "NEWS_POSTS", entryText);
    await writeTextFile(DATA_FILES.news, newSource);

    form.reset();
    document.getElementById("news-image-rows").innerHTML = "";
    await refreshNewsList();
    showToast(`"${title}" 글을 추가했습니다.`);
  });
}

async function deleteNewsEntry(index) {
  if (!confirm("이 글을 삭제할까요? (사진 파일은 지워지지 않습니다)")) return;
  const source = await readTextFile(DATA_FILES.news);
  const newSource = AdminCore.deleteEntryAt(source, "NEWS_POSTS", index);
  await writeTextFile(DATA_FILES.news, newSource);
  if (newsEditIndex !== null) cancelNewsEdit();
  await refreshNewsList();
  showToast("삭제했습니다.");
}

// ---------------------------------------------------------------------
// People (roster / alumni / staff)
// ---------------------------------------------------------------------

const PEOPLE_CATEGORY_LABELS = {
  postdoc: "Post Doctoral Researcher",
  phd: "Ph.D. Candidate",
  integrated: "Integrated M.S.-Ph.D. Candidate",
  ms: "M.S. Candidate",
};

function renderPeopleList(entries) {
  const list = document.getElementById("people-roster-list");
  if (!entries.length) {
    list.innerHTML = `<p class="admin-empty">아직 등록된 인원이 없습니다.</p>`;
    return;
  }
  list.innerHTML = entries
    .map((e) => {
      const o = e.obj;
      if (!o) return `<div class="admin-item admin-item--error">읽기 오류: ${e.error}</div>`;
      return `
        <div class="admin-item" data-index="${e.index}">
          <div class="admin-item__main">
            <span class="admin-item__title">${escapeHtml(o.name)}</span>
            <span class="admin-item__meta">${escapeHtml(PEOPLE_CATEGORY_LABELS[o.category] || o.category)} · ${escapeHtml(o.role || "")}</span>
          </div>
          <div class="admin-item__actions">
            <button type="button" class="admin-item__edit" data-action="edit-people" data-index="${e.index}">수정</button>
            <button type="button" class="admin-item__delete" data-action="delete-people" data-index="${e.index}">삭제</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderAlumniList(entries) {
  const list = document.getElementById("people-alumni-list");
  if (!entries.length) {
    list.innerHTML = `<p class="admin-empty">아직 등록된 졸업생이 없습니다.</p>`;
    return;
  }
  list.innerHTML = entries
    .map((e) => {
      const o = e.obj;
      if (!o) return `<div class="admin-item admin-item--error">읽기 오류: ${e.error}</div>`;
      return `
        <div class="admin-item" data-index="${e.index}">
          <div class="admin-item__main">
            <span class="admin-item__title">${escapeHtml(o.name)}</span>
            <span class="admin-item__meta">${escapeHtml(o.program)} ${escapeHtml(o.year || "")} · ${escapeHtml(o.current || "")}</span>
          </div>
          <div class="admin-item__actions">
            <button type="button" class="admin-item__edit" data-action="edit-alumni" data-index="${e.index}">수정</button>
            <button type="button" class="admin-item__delete" data-action="delete-alumni" data-index="${e.index}">삭제</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderStaffList(entries) {
  const list = document.getElementById("people-staff-list");
  if (!entries.length) {
    list.innerHTML = `<p class="admin-empty">아직 등록된 직원이 없습니다.</p>`;
    return;
  }
  list.innerHTML = entries
    .map((e) => {
      const o = e.obj;
      if (!o) return `<div class="admin-item admin-item--error">읽기 오류: ${e.error}</div>`;
      return `
        <div class="admin-item" data-index="${e.index}">
          <div class="admin-item__main">
            <span class="admin-item__title">${escapeHtml(o.name)}</span>
            <span class="admin-item__meta">${escapeHtml(o.role || "")}</span>
          </div>
          <div class="admin-item__actions">
            <button type="button" class="admin-item__edit" data-action="edit-staff" data-index="${e.index}">수정</button>
            <button type="button" class="admin-item__delete" data-action="delete-staff" data-index="${e.index}">삭제</button>
          </div>
        </div>
      `;
    })
    .join("");
}

async function refreshPeopleLists() {
  const source = await readTextFile(DATA_FILES.people);
  const roster = AdminCore.listEntries(source, "PEOPLE");
  const alumni = AdminCore.listEntries(source, "ALUMNI");
  const staff = AdminCore.listEntries(source, "STAFF");
  renderPeopleList(roster);
  renderAlumniList(alumni);
  renderStaffList(staff);
  return { roster, alumni, staff };
}

function collectDegreeRows() {
  return [...document.querySelectorAll("#degree-rows .admin-degree-row")].map((row) => {
    const label = row.querySelector('[data-field="label"]').value;
    const major = row.querySelector('[data-field="major"]').value.trim();
    const university = row.querySelector('[data-field="university"]').value.trim();
    const year = row.querySelector('[data-field="year"]').value.trim();
    const note = row.querySelector('[data-field="note"]').value.trim();
    return { label, major, university, year, ...(note ? { note } : {}) };
  });
}

function addDegreeRow() {
  const container = document.getElementById("degree-rows");
  const row = document.createElement("div");
  row.className = "admin-degree-row";
  row.innerHTML = `
    <select data-field="label">
      <option value="B.S.">B.S.</option>
      <option value="M.S.">M.S.</option>
      <option value="Ph.D.">Ph.D.</option>
    </select>
    <input type="text" data-field="major" placeholder="전공 (예: Materials Science and Engineering)" />
    <input type="text" data-field="university" placeholder="학교" />
    <input type="text" data-field="year" placeholder="연도" style="width:5em" />
    <input type="text" data-field="note" placeholder="비고 (선택)" />
    <button type="button" class="admin-degree-row__remove" aria-label="삭제">✕</button>
  `;
  row.querySelector(".admin-degree-row__remove").addEventListener("click", () => row.remove());
  container.appendChild(row);
}

// Edit state for each People sub-tab — same "null = add mode, otherwise the
// entry's index" convention as newsEditIndex above. *EditPhoto holds the
// path already on disk for the entry being edited, used only when the edit
// form's photo input is left empty (i.e. "keep the current photo").
let peopleEditIndex = null;
let peopleEditPhoto = "";
let alumniEditIndex = null;
let staffEditIndex = null;
let staffEditPhoto = "";

async function startEditPeople(index) {
  const source = await readTextFile(DATA_FILES.people);
  const entries = AdminCore.listEntries(source, "PEOPLE");
  const entry = entries[index];
  if (!entry || !entry.obj) return;
  const o = entry.obj;
  const form = document.getElementById("people-roster-form");

  form.category.value = o.category;
  form.name.value = o.name || "";
  form.role.value = o.role || "";
  form.admissionYear.value = o.admissionYear || "";
  form.admissionSeason.value = o.admissionSeason || "Spring";
  form.email.value = o.email || "";
  form.photo.required = false;
  form.photo.value = "";

  document.getElementById("degree-rows").innerHTML = "";
  (o.degrees || []).forEach((d) => {
    addDegreeRow();
    const row = document.getElementById("degree-rows").lastElementChild;
    row.querySelector('[data-field="label"]').value = d.label || "B.S.";
    row.querySelector('[data-field="major"]').value = d.major || "";
    row.querySelector('[data-field="university"]').value = d.university || "";
    row.querySelector('[data-field="year"]').value = d.year || "";
    row.querySelector('[data-field="note"]').value = d.note || "";
  });

  peopleEditIndex = index;
  peopleEditPhoto = o.photo || "";
  const currentPhotoEl = document.getElementById("people-roster-current-photo");
  currentPhotoEl.textContent = `현재 사진: ${o.photo} (그대로 두려면 비워두세요)`;
  currentPhotoEl.hidden = false;

  document.getElementById("people-roster-form-title").textContent = "재학생 / Post Doc. 수정";
  document.getElementById("people-roster-submit-btn").textContent = "수정 완료";
  document.getElementById("people-roster-cancel-edit").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelPeopleEdit() {
  peopleEditIndex = null;
  peopleEditPhoto = "";
  const form = document.getElementById("people-roster-form");
  form.reset();
  form.photo.required = true;
  document.getElementById("people-roster-current-photo").hidden = true;
  document.getElementById("degree-rows").innerHTML = "";
  addDegreeRow();
  document.getElementById("people-roster-form-title").textContent = "재학생 / Post Doc. 추가";
  document.getElementById("people-roster-submit-btn").textContent = "추가하기";
  document.getElementById("people-roster-cancel-edit").hidden = true;
}

async function submitPeopleRosterForm(e) {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  await withBusy(button, async () => {
    const category = form.category.value;
    const name = form.name.value.trim();
    const role = form.role.value.trim();
    const admissionYear = form.admissionYear.value.trim();
    const admissionSeason = form.admissionSeason.value;
    const email = form.email.value.trim();
    const degrees = collectDegreeRows();
    const photoFile = form.photo.files[0];

    if (!name) throw new Error("이름을 입력해주세요.");

    let photo;
    if (photoFile) {
      const desired = sanitizeFileName(`${name}${extOf(photoFile.name)}`);
      const finalName = await uniqueFileName("People", desired);
      await writeBinaryFile(`People/${finalName}`, photoFile);
      photo = `People/${finalName}`;
    } else if (peopleEditIndex !== null) {
      photo = peopleEditPhoto;
    } else {
      throw new Error("사진을 선택해주세요.");
    }

    const entry = { category, photo, name, role, admissionYear, admissionSeason, email, degrees };
    const source = await readTextFile(DATA_FILES.people);

    if (peopleEditIndex !== null) {
      const newSource = AdminCore.updateEntryAt(source, "PEOPLE", peopleEditIndex, AdminCore.formatPeopleEntry(entry));
      await writeTextFile(DATA_FILES.people, newSource);
      cancelPeopleEdit();
      await refreshPeopleLists();
      showToast(`"${name}"님 정보를 수정했습니다.`);
      return;
    }

    const newSource = AdminCore.insertEntry(source, "PEOPLE", AdminCore.formatPeopleEntry(entry));
    await writeTextFile(DATA_FILES.people, newSource);

    form.reset();
    document.getElementById("degree-rows").innerHTML = "";
    addDegreeRow();
    await refreshPeopleLists();
    showToast(`"${name}"님을 추가했습니다.`);
  });
}

async function startEditAlumni(index) {
  const source = await readTextFile(DATA_FILES.people);
  const entries = AdminCore.listEntries(source, "ALUMNI");
  const entry = entries[index];
  if (!entry || !entry.obj) return;
  const o = entry.obj;
  const form = document.getElementById("people-alumni-form");

  form.name.value = o.name || "";
  form.program.value = o.program;
  form.year.value = o.year || "";
  form.current.value = o.current || "";
  form.season.value = o.season || "";

  alumniEditIndex = index;
  document.getElementById("people-alumni-form-title").textContent = "졸업생(Alumni) 수정";
  document.getElementById("people-alumni-submit-btn").textContent = "수정 완료";
  document.getElementById("people-alumni-cancel-edit").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelAlumniEdit() {
  alumniEditIndex = null;
  const form = document.getElementById("people-alumni-form");
  form.reset();
  document.getElementById("people-alumni-form-title").textContent = "졸업생(Alumni) 추가";
  document.getElementById("people-alumni-submit-btn").textContent = "추가하기";
  document.getElementById("people-alumni-cancel-edit").hidden = true;
}

async function submitAlumniForm(e) {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  await withBusy(button, async () => {
    const name = form.name.value.trim();
    const program = form.program.value;
    const year = form.year.value.trim();
    const season = form.season.value.trim();
    const current = form.current.value.trim();
    if (!name) throw new Error("이름을 입력해주세요.");

    const entry = { name, program, year, season, current };
    const source = await readTextFile(DATA_FILES.people);

    if (alumniEditIndex !== null) {
      const newSource = AdminCore.updateEntryAt(source, "ALUMNI", alumniEditIndex, AdminCore.formatAlumniEntry(entry));
      await writeTextFile(DATA_FILES.people, newSource);
      cancelAlumniEdit();
      await refreshPeopleLists();
      showToast(`"${name}"님 정보를 수정했습니다.`);
      return;
    }

    const newSource = AdminCore.insertEntry(source, "ALUMNI", AdminCore.formatAlumniEntry(entry));
    await writeTextFile(DATA_FILES.people, newSource);

    form.reset();
    await refreshPeopleLists();
    showToast(`"${name}"님을 졸업생 목록에 추가했습니다.`);
  });
}

async function startEditStaff(index) {
  const source = await readTextFile(DATA_FILES.people);
  const entries = AdminCore.listEntries(source, "STAFF");
  const entry = entries[index];
  if (!entry || !entry.obj) return;
  const o = entry.obj;
  const form = document.getElementById("people-staff-form");

  form.name.value = o.name || "";
  form.role.value = o.role || "";
  form.admissionYear.value = o.admissionYear || "";
  form.admissionSeason.value = o.admissionSeason || "";
  form.photo.value = "";

  staffEditIndex = index;
  staffEditPhoto = o.photo || "";
  const currentPhotoEl = document.getElementById("people-staff-current-photo");
  if (o.photo) {
    currentPhotoEl.textContent = `현재 사진: ${o.photo} (그대로 두려면 비워두세요)`;
    currentPhotoEl.hidden = false;
  } else {
    currentPhotoEl.hidden = true;
  }

  document.getElementById("people-staff-form-title").textContent = "직원(Staff) 수정";
  document.getElementById("people-staff-submit-btn").textContent = "수정 완료";
  document.getElementById("people-staff-cancel-edit").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelStaffEdit() {
  staffEditIndex = null;
  staffEditPhoto = "";
  const form = document.getElementById("people-staff-form");
  form.reset();
  document.getElementById("people-staff-current-photo").hidden = true;
  document.getElementById("people-staff-form-title").textContent = "직원(Staff) 추가";
  document.getElementById("people-staff-submit-btn").textContent = "추가하기";
  document.getElementById("people-staff-cancel-edit").hidden = true;
}

async function submitStaffForm(e) {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  await withBusy(button, async () => {
    const name = form.name.value.trim();
    const role = form.role.value.trim();
    const admissionYear = form.admissionYear.value.trim();
    const admissionSeason = form.admissionSeason.value;
    const photoFile = form.photo.files[0];
    if (!name) throw new Error("이름을 입력해주세요.");

    let photo = staffEditIndex !== null ? staffEditPhoto : "";
    if (photoFile) {
      const desired = sanitizeFileName(`${name}${extOf(photoFile.name)}`);
      const finalName = await uniqueFileName("People", desired);
      await writeBinaryFile(`People/${finalName}`, photoFile);
      photo = `People/${finalName}`;
    }

    const entry = { name, photo, role, admissionYear, admissionSeason };
    const source = await readTextFile(DATA_FILES.people);

    if (staffEditIndex !== null) {
      const newSource = AdminCore.updateEntryAt(source, "STAFF", staffEditIndex, AdminCore.formatStaffEntry(entry));
      await writeTextFile(DATA_FILES.people, newSource);
      cancelStaffEdit();
      await refreshPeopleLists();
      showToast(`"${name}"님 정보를 수정했습니다.`);
      return;
    }

    const newSource = AdminCore.insertEntry(source, "STAFF", AdminCore.formatStaffEntry(entry));
    await writeTextFile(DATA_FILES.people, newSource);

    form.reset();
    await refreshPeopleLists();
    showToast(`"${name}"님을 직원 목록에 추가했습니다.`);
  });
}

async function deletePeopleEntry(varName, index, refreshFn, label) {
  if (!confirm(`${label}에서 삭제할까요? (사진 파일은 지워지지 않습니다)`)) return;
  const source = await readTextFile(DATA_FILES.people);
  const newSource = AdminCore.deleteEntryAt(source, varName, index);
  await writeTextFile(DATA_FILES.people, newSource);
  if (varName === "PEOPLE" && peopleEditIndex !== null) cancelPeopleEdit();
  if (varName === "ALUMNI" && alumniEditIndex !== null) cancelAlumniEdit();
  if (varName === "STAFF" && staffEditIndex !== null) cancelStaffEdit();
  await refreshFn();
  showToast("삭제했습니다.");
}

// ---------------------------------------------------------------------
// Publication
// ---------------------------------------------------------------------

function renderPublicationList(entries) {
  const list = document.getElementById("publication-list");
  if (!entries.length) {
    list.innerHTML = `<p class="admin-empty">아직 등록된 논문이 없습니다.</p>`;
    return;
  }
  list.innerHTML = entries
    .slice()
    .reverse()
    .map((e) => {
      const o = e.obj;
      if (!o) return `<div class="admin-item admin-item--error">읽기 오류: ${e.error}</div>`;
      return `
        <div class="admin-item" data-index="${e.index}">
          <div class="admin-item__main">
            <span class="admin-item__title">${escapeHtml(o.title)}</span>
            <span class="admin-item__meta">${escapeHtml(String(o.year))} · ${escapeHtml(o.journal || "")}</span>
          </div>
          <div class="admin-item__actions">
            <button type="button" class="admin-item__edit" data-action="edit-publication" data-index="${e.index}">수정</button>
            <button type="button" class="admin-item__delete" data-action="delete-publication" data-index="${e.index}">삭제</button>
          </div>
        </div>
      `;
    })
    .join("");
}

async function refreshPublicationList() {
  const source = await readTextFile(DATA_FILES.publication);
  const entries = AdminCore.listEntries(source, "PUBLICATIONS");
  renderPublicationList(entries);
  return entries;
}

let publicationEditIndex = null;
let publicationEditImage = "";

async function startEditPublication(index) {
  const source = await readTextFile(DATA_FILES.publication);
  const entries = AdminCore.listEntries(source, "PUBLICATIONS");
  const entry = entries[index];
  if (!entry || !entry.obj) return;
  const o = entry.obj;
  const form = document.getElementById("publication-form");

  form.year.value = o.year || "";
  form.title.value = o.title || "";
  form.authors.value = o.authors || "";
  form.journal.value = o.journal || "";
  form.doiUrl.value = o.doiUrl || "";
  form.image.required = false;
  form.image.value = "";

  publicationEditIndex = index;
  publicationEditImage = o.image || "";
  const currentImageEl = document.getElementById("publication-current-image");
  currentImageEl.textContent = `현재 이미지: ${o.image} (그대로 두려면 비워두세요)`;
  currentImageEl.hidden = false;

  document.getElementById("publication-form-title").textContent = "논문 수정";
  document.getElementById("publication-submit-btn").textContent = "수정 완료";
  document.getElementById("publication-cancel-edit").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelPublicationEdit() {
  publicationEditIndex = null;
  publicationEditImage = "";
  const form = document.getElementById("publication-form");
  form.reset();
  form.image.required = true;
  document.getElementById("publication-current-image").hidden = true;
  document.getElementById("publication-form-title").textContent = "새 논문 추가";
  document.getElementById("publication-submit-btn").textContent = "추가하기";
  document.getElementById("publication-cancel-edit").hidden = true;
}

async function submitPublicationForm(e) {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  await withBusy(button, async () => {
    const year = Number(form.year.value);
    const title = form.title.value.trim();
    const authors = form.authors.value.trim();
    const journal = form.journal.value.trim();
    const doiUrl = form.doiUrl.value.trim();
    const imageFile = form.image.files[0];

    if (!title) throw new Error("논문 제목을 입력해주세요.");
    if (!year) throw new Error("연도를 입력해주세요.");

    let image;
    if (imageFile) {
      const desired = sanitizeFileName(`${title}${extOf(imageFile.name)}`);
      const finalName = await uniqueFileName("Publication", desired);
      await writeBinaryFile(`Publication/${finalName}`, imageFile);
      image = `Publication/${finalName}`;
    } else if (publicationEditIndex !== null) {
      image = publicationEditImage;
    } else {
      throw new Error("대표 이미지를 선택해주세요.");
    }

    const entry = { year, image, title, authors, journal, doiUrl };
    const source = await readTextFile(DATA_FILES.publication);

    if (publicationEditIndex !== null) {
      const newSource = AdminCore.updateEntryAt(source, "PUBLICATIONS", publicationEditIndex, AdminCore.formatPublicationEntry(entry));
      await writeTextFile(DATA_FILES.publication, newSource);
      cancelPublicationEdit();
      await refreshPublicationList();
      showToast(`"${title}" 논문을 수정했습니다.`);
      return;
    }

    const newSource = AdminCore.insertEntry(source, "PUBLICATIONS", AdminCore.formatPublicationEntry(entry));
    await writeTextFile(DATA_FILES.publication, newSource);

    form.reset();
    await refreshPublicationList();
    showToast(`"${title}" 논문을 추가했습니다.`);
  });
}

async function deletePublicationEntry(index) {
  if (!confirm("이 논문을 삭제할까요? (이미지 파일은 지워지지 않습니다)")) return;
  const source = await readTextFile(DATA_FILES.publication);
  const newSource = AdminCore.deleteEntryAt(source, "PUBLICATIONS", index);
  await writeTextFile(DATA_FILES.publication, newSource);
  if (publicationEditIndex !== null) cancelPublicationEdit();
  await refreshPublicationList();
  showToast("삭제했습니다.");
}

// ---------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function refreshAll() {
  await refreshNewsList();
  await refreshPeopleLists();
  await refreshPublicationList();
}

function initTabs() {
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach((t) => t.classList.toggle("is-active", t === tab));
      document.querySelectorAll(".admin-panel").forEach((p) => p.classList.toggle("is-active", p.dataset.panel === tab.dataset.tab));
    });
  });

  document.querySelectorAll(".admin-subtab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const group = tab.closest(".admin-subtabs").dataset.group;
      document.querySelectorAll(`.admin-subtabs[data-group="${group}"] .admin-subtab`).forEach((t) => t.classList.toggle("is-active", t === tab));
      document.querySelectorAll(`.admin-subpanel[data-group="${group}"]`).forEach((p) => p.classList.toggle("is-active", p.dataset.subpanel === tab.dataset.subtab));
    });
  });
}

function initEventDelegation() {
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const index = Number(btn.dataset.index);
    switch (btn.dataset.action) {
      case "delete-news":
        deleteNewsEntry(index);
        break;
      case "delete-people":
        deletePeopleEntry("PEOPLE", index, refreshPeopleLists, "재학생 명단");
        break;
      case "delete-alumni":
        deletePeopleEntry("ALUMNI", index, refreshPeopleLists, "졸업생 명단");
        break;
      case "delete-staff":
        deletePeopleEntry("STAFF", index, refreshPeopleLists, "직원 명단");
        break;
      case "delete-publication":
        deletePublicationEntry(index);
        break;
      case "edit-news":
        startEditNews(index);
        break;
      case "edit-people":
        startEditPeople(index);
        break;
      case "edit-alumni":
        startEditAlumni(index);
        break;
      case "edit-staff":
        startEditStaff(index);
        break;
      case "edit-publication":
        startEditPublication(index);
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initEventDelegation();
  addDegreeRow();

  document.getElementById("pick-folder").addEventListener("click", async (e) => {
    const button = e.target;
    await withBusy(button, () => pickFolder());
  });

  document.getElementById("news-form").addEventListener("submit", submitNewsForm);
  document.getElementById("news-images").addEventListener("change", (e) => renderNewsImageRows(e.target.files));
  document.getElementById("people-roster-form").addEventListener("submit", submitPeopleRosterForm);
  document.getElementById("people-alumni-form").addEventListener("submit", submitAlumniForm);
  document.getElementById("people-staff-form").addEventListener("submit", submitStaffForm);
  document.getElementById("publication-form").addEventListener("submit", submitPublicationForm);
  document.getElementById("add-degree-row").addEventListener("click", addDegreeRow);

  document.getElementById("news-cancel-edit").addEventListener("click", cancelNewsEdit);
  document.getElementById("people-roster-cancel-edit").addEventListener("click", cancelPeopleEdit);
  document.getElementById("people-alumni-cancel-edit").addEventListener("click", cancelAlumniEdit);
  document.getElementById("people-staff-cancel-edit").addEventListener("click", cancelStaffEdit);
  document.getElementById("publication-cancel-edit").addEventListener("click", cancelPublicationEdit);
});
