// Pure text/data logic for the admin tool — no File System Access API here,
// nothing browser-specific, so this half can be exercised with plain text
// in and text out (see the test harness that was used to validate this
// against real copies of the data files before this tool was ever pointed
// at the actual repo).
//
// The core problem this solves: news-data.js / people-data.js /
// publication-data.js are hand-formatted JS files, not JSON — there's no
// safe JSON.parse/stringify round trip. Rewriting a whole array from
// scratch every time risks silently reformatting (or breaking) every
// entry that was never touched. Instead, AdminCore.locateArray finds the
// exact source-text span of the target `const NAME = [ ... ]` and of each
// top-level {...} entry inside it, so add/delete only ever touch the exact
// bytes of what's actually changing — every other entry, comment, and
// blank line is left byte-for-byte alone.

const AdminCore = (() => {
  // Scans `const varName = [ ... ]` starting from its opening `[` and
  // returns the index of the matching closing `]`, plus the [start, end)
  // span of every top-level {...} entry directly inside it. "Top-level"
  // means depth === 1 relative to just having stepped inside the outer
  // `[` — anything deeper (a degree row inside `degrees: [...]`, an image
  // inside `images: [...]`) is nested past that and never mistaken for a
  // sibling entry. Strings and comments are scanned over verbatim (their
  // own brackets don't count), so a `}` inside a quoted title can't
  // desync the depth count.
  function locateArray(source, varName) {
    const declRe = new RegExp(`const\\s+${varName}\\s*=\\s*\\[`);
    const m = declRe.exec(source);
    if (!m) throw new Error(`Could not find "const ${varName} = [" in file`);
    const openBracketIndex = m.index + m[0].length - 1;

    let i = openBracketIndex + 1;
    let depth = 1;
    let inString = null;
    let entryStart = null;
    const entries = [];

    while (i < source.length) {
      const ch = source[i];

      if (inString) {
        if (ch === "\\") { i += 2; continue; }
        if (ch === inString) inString = null;
        i += 1;
        continue;
      }
      if (ch === "/" && source[i + 1] === "/") {
        const nl = source.indexOf("\n", i);
        i = nl === -1 ? source.length : nl + 1;
        continue;
      }
      if (ch === "/" && source[i + 1] === "*") {
        const end = source.indexOf("*/", i + 2);
        i = end === -1 ? source.length : end + 2;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        i += 1;
        continue;
      }
      if (ch === "{" || ch === "[" || ch === "(") {
        if (depth === 1 && ch === "{" && entryStart === null) entryStart = i;
        depth += 1;
        i += 1;
        continue;
      }
      if (ch === "}" || ch === "]" || ch === ")") {
        depth -= 1;
        if (depth === 1 && ch === "}" && entryStart !== null) {
          entries.push({ start: entryStart, end: i + 1 });
          entryStart = null;
        }
        if (depth === 0) {
          return { openBracketIndex, closeBracketIndex: i, entries };
        }
        i += 1;
        continue;
      }
      i += 1;
    }
    throw new Error(`"${varName}" array was never closed (ran off the end of the file)`);
  }

  // Real objects, for display/listing only — safe here because the source
  // is always this project's own already-trusted data file, never
  // arbitrary/remote input.
  function evalEntry(raw) {
    // eslint-disable-next-line no-new-func
    return new Function(`"use strict"; return (${raw}\n);`)();
  }

  function listEntries(source, varName) {
    const { entries } = locateArray(source, varName);
    return entries.map(({ start, end }, index) => {
      const raw = source.slice(start, end);
      let obj = null;
      let error = null;
      try {
        obj = evalEntry(raw);
      } catch (e) {
        error = String(e && e.message ? e.message : e);
      }
      return { index, start, end, raw, obj, error };
    });
  }

  // Inserts `entryText` (a "  {\n    ...\n  }" block, no trailing comma)
  // as a new last element of the array, matching this codebase's own
  // "always a trailing comma" style so a later append never has to touch
  // the line above it.
  function insertEntry(source, varName, entryText) {
    const { openBracketIndex, closeBracketIndex } = locateArray(source, varName);
    const inner = source.slice(openBracketIndex + 1, closeBracketIndex);
    const hasContent = inner.trim().length > 0;
    const endsWithComma = /,\s*$/.test(inner);

    let insertion;
    if (!hasContent) {
      insertion = `\n${entryText},\n`;
    } else if (endsWithComma) {
      insertion = `${entryText},\n`;
    } else {
      insertion = `,\n${entryText},\n`;
    }
    return source.slice(0, closeBracketIndex) + insertion + source.slice(closeBracketIndex);
  }

  // Removes exactly one entry's own span, plus the one comma that
  // separated it from its neighbors and the blank space that comes with
  // that comma — so deleting the middle entry of three leaves two clean
  // entries behind, not a stray comma or a gap.
  function deleteEntryAt(source, varName, entryIndex) {
    const { entries } = locateArray(source, varName);
    const target = entries[entryIndex];
    if (!target) throw new Error(`No entry at index ${entryIndex}`);

    let start = target.start;
    let end = target.end;

    const afterMatch = /^[ \t]*,/.exec(source.slice(end, end + 40));
    if (afterMatch) {
      end += afterMatch[0].length;
      if (source[end] === "\n") end += 1;
    }
    // Absorb this entry's own leading indentation (back to the start of
    // its line) so no blank indented line is left behind.
    while (start > 0 && (source[start - 1] === " " || source[start - 1] === "\t")) {
      start -= 1;
    }
    return source.slice(0, start) + source.slice(end);
  }

  // Replaces exactly one entry's own span (the same [start, end) span
  // listEntries/deleteEntryAt use, which excludes the entry's own trailing
  // comma) with newly formatted text — everything before/after it,
  // including that comma, is untouched.
  //
  // entryText already starts with its own "  {" indentation (see the
  // formatters below), so the original line's indentation before
  // target.start has to be walked back and dropped first — same backward
  // scan deleteEntryAt uses — or every edit doubles up another copy of it
  // in front of the freshly-formatted entry.
  function updateEntryAt(source, varName, entryIndex, entryText) {
    const { entries } = locateArray(source, varName);
    const target = entries[entryIndex];
    if (!target) throw new Error(`No entry at index ${entryIndex}`);

    let start = target.start;
    while (start > 0 && (source[start - 1] === " " || source[start - 1] === "\t")) {
      start -= 1;
    }
    return source.slice(0, start) + entryText + source.slice(target.end);
  }

  // ---- Per-collection formatters -----------------------------------
  // Each mirrors this project's own hand-written style for that exact
  // array (verified against the real files, not guessed) — see each
  // data file's own entries for the style being matched.

  function j(v) {
    return JSON.stringify(v);
  }

  function imageLiteral(img) {
    const parts = [`src: ${j(img.src)}`];
    if (img.alt) parts.push(`alt: ${j(img.alt)}`);
    if (img.credit) parts.push(`credit: ${j(img.credit)}`);
    return `{ ${parts.join(", ")} }`;
  }

  function formatNewsEntry(o) {
    const lines = ["  {"];
    lines.push(`    id: ${j(o.id)},`);
    lines.push(`    title: ${j(o.title)},`);
    lines.push(`    tag: ${j(o.tag)},`);
    lines.push(`    people: ${j(o.people)},`);
    lines.push(`    date: ${j(o.date)},`);
    if (o.dateEnd && o.dateEnd !== o.date) {
      lines.push(`    dateEnd: ${j(o.dateEnd)},`);
    }
    if (o.images.length <= 1) {
      lines.push(`    images: [${o.images.map(imageLiteral).join(", ")}],`);
    } else {
      lines.push("    images: [");
      o.images.forEach((img) => lines.push(`      ${imageLiteral(img)},`));
      lines.push("    ],");
    }
    lines.push(`    excerpt: ${j(o.excerpt)},`);
    if (o.body.length <= 1) {
      lines.push(`    body: [${o.body.map(j).join(", ")}],`);
    } else {
      lines.push("    body: [");
      o.body.forEach((p) => lines.push(`      ${j(p)},`));
      lines.push("    ],");
    }
    lines.push("  }");
    return lines.join("\n");
  }

  function degreeLiteral(d) {
    const parts = [
      `label: ${j(d.label)}`,
      `major: ${j(d.major)}`,
      `university: ${j(d.university)}`,
      `year: ${j(d.year)}`,
    ];
    if (d.note) parts.push(`note: ${j(d.note)}`);
    return `{ ${parts.join(", ")} }`;
  }

  function formatPeopleEntry(o) {
    const lines = ["  {"];
    lines.push(`    category: ${j(o.category)},`);
    lines.push(`    photo: ${j(o.photo)},`);
    lines.push(`    name: ${j(o.name)},`);
    lines.push(`    role: ${j(o.role)},`);
    lines.push(`    admissionYear: ${j(o.admissionYear)},`);
    lines.push(`    admissionSeason: ${j(o.admissionSeason)},`);
    lines.push(`    email: ${j(o.email)},`);
    lines.push("    degrees: [");
    (o.degrees || []).forEach((d) => lines.push(`      ${degreeLiteral(d)},`));
    lines.push("    ],");
    lines.push("  }");
    return lines.join("\n");
  }

  function formatAlumniEntry(o) {
    return (
      `  { name: ${j(o.name)}, program: ${j(o.program)}, year: ${j(o.year)}, ` +
      `season: ${j(o.season || "")}, current: ${j(o.current || "")} }`
    );
  }

  function formatStaffEntry(o) {
    const lines = ["  {"];
    lines.push(`    name: ${j(o.name)},`);
    lines.push(`    photo: ${j(o.photo)},`);
    lines.push(`    role: ${j(o.role)},`);
    lines.push(`    admissionYear: ${j(o.admissionYear || "")},`);
    lines.push(`    admissionSeason: ${j(o.admissionSeason || "")},`);
    lines.push("  }");
    return lines.join("\n");
  }

  function formatPublicationEntry(o) {
    const lines = ["  {"];
    lines.push(`    year: ${Number(o.year)},`);
    lines.push(`    image: ${j(o.image)},`);
    lines.push(`    title: ${j(o.title)},`);
    lines.push(`    authors: ${j(o.authors)},`);
    lines.push(`    journal: ${j(o.journal)},`);
    lines.push(`    doiUrl: ${j(o.doiUrl)},`);
    if (o.date) lines.push(`    date: ${j(o.date)},`);
    lines.push("  }");
    return lines.join("\n");
  }

  return {
    locateArray,
    listEntries,
    insertEntry,
    deleteEntryAt,
    updateEntryAt,
    formatNewsEntry,
    formatPeopleEntry,
    formatAlumniEntry,
    formatStaffEntry,
    formatPublicationEntry,
  };
})();

if (typeof module !== "undefined") module.exports = AdminCore;
