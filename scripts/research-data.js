// One entry per research topic, each with its own real figure in /Research.
//
// `detail` is what research-detail.html renders for that topic's own page:
// `images` (one or more photos/figures, shown in a simple gallery), `body`
// (one or more paragraphs), and `publications` (an optional list of exact
// `title` strings matched against PUBLICATIONS in publication-data.js — see
// research-detail-render.js, which looks each one up to render its citation
// and link to its entry on publication.html). Left unset here, `images` and
// `body` fall back to the card's own single `image` and `summary` (see
// research-detail-render.js); `publications` simply renders no section if
// omitted — fill these in per-topic once there's more material to show than
// the list card's short excerpt.
const RESEARCH_TOPICS = [
  {
    image: "Research/Bi-Layer Metasurfaces.jpg",
    topic: "Metasurface Platforms",
    summary:
      "Two stacked metasurface layers giving complete, independent control over a transmitted beam's amplitude, phase, and polarization, the platform behind the lab's vectorial holography and tunable metasurface work.",
    // Merged from three previously separate topics (Bi-Layer Metasurfaces,
    // Vectorial Holography, Tunable Metasurfaces) — content-wise, the
    // latter two are direct applications/extensions of the bi-layer
    // platform this one leads with, so they read better as one topic than
    // three thin, overlapping ones. See git history before this commit if
    // any of the three ever need to be split back out — nothing here was
    // rewritten, just regrouped and combined into one `images`/`body`/
    // `publications` set.
    detail: {
      images: [
        "Research/Bi-Layer Metasurfaces.jpg",
        "Research/Vectorial Holography.jpg",
        "Research/Tunable Metasurface.jpg",
      ],
      body: [
        "A coherent light wave is fully described by its amplitude, phase, and polarization. A single metasurface layer can shape some of these at once, but not all three independently for an arbitrary input. Stacking two metasurface layers removes that limit: the combined structure gives complete, independent control over transmitted amplitude, phase, and polarization, and it's the platform the lab's vectorial holography and tunable metasurface work below builds on.",
        "Ordinary holograms reconstruct a scalar wavefront, intensity and phase, with no polarization information. Using the bi-layer platform, this group builds holograms that reconstruct different images depending on the illumination's polarization or propagation direction, and extends the encoded degrees of freedom to arbitrary total angular momentum states for multiplexed, high-security optical encryption.",
        "Most metasurfaces are fixed once fabricated, but many applications need the optical response to change afterward: a lens that refocuses, a window that changes transparency, a filter that switches color. These metasurfaces are reconfigured post-fabrication through an external stimulus (carrier injection into a semiconductor layer, mechanical strain or compression, or an applied bias), with applications from reconfigurable laser focusing to compression-sensitive smart windows.",
      ],
      publications: [
        "Universal metasurfaces for complete linear control of coherent light transmission",
        "Arbitrary Total Angular Momentum Vectorial Holography Using Bi-Layer Metasurfaces",
        "Bidirectional Vectorial Holography Using Bi-Layer Metasurfaces and Its Application to Optical Encryption",
        "Three-dimensionally reconfigurable focusing of laser by mechanically tunable metalens doublet with built-in holograms for alignment",
        "Tunable metamaterials with carrier-induced effective permittivity for active control of electromagnetic fields in semiconductor manufacturing device",
        "Compression-Sensitive Smart Windows: Inclined Pores for Dynamic Transparency Changes",
      ],
    },
  },
  {
    image: "Research/Large-Area Nanofabrication.jpg",
    topic: "Large-Area Nanofabrication",
    summary:
      "Scalable patterning techniques, including proximity-field and interference lithography, for realizing nanophotonic structures over macroscopic areas at low cost.",
    detail: {
      body: [
        "High-resolution nanofabrication techniques such as electron-beam lithography and focused ion beam milling are inherently serial, which makes them impractical once a structure needs to cover a macroscopic area. This group develops parallel, wafer-scale patterning methods, including proximity-field nanopatterning and interference lithography, that replicate complex photonic structures over large areas in a single exposure, at a fraction of the cost and time of direct-write methods, while keeping the subwavelength resolution these devices need.",
      ],
      publications: [
        "Spectrally Encoded Proximity-Field Nanopatterning",
        "Realization of all two-dimensional Bravais lattices with metasurface-based interference lithography",
        "Ultralarge Area Sub-10nm Plasmonic Nanogap Array by Block Copolymer Self-Assembly for Reliable High-Sensitivity SERS",
      ],
    },
  },
  {
    image: "Research/AI-Driven Inverse Design.jpg",
    topic: "AI-Driven Inverse Design",
    summary:
      "Machine learning and optimization algorithms, including large language models, applied to automate and accelerate the design of nanophotonic devices and metasurfaces.",
    detail: {
      body: [
        "Nanophotonic devices are conventionally designed by guessing a structure, simulating its optical response, and iterating by hand, which scales poorly as the number of design parameters grows. Inverse design starts instead from a target optical response and searches for the structure that produces it, using machine learning and optimization methods, including generative adversarial networks, topology optimization, and, more recently, large language models, applied to both multilayer thin-film stacks and metasurfaces.",
      ],
      publications: [
        "Nanophotonic device design based on large language models: multilayer and metasurface examples",
        "Inverse design of nanophotonic devices enabled by optimization algorithms and deep learning: recent achievements and future prospects",
        "Data-driven concurrent nanostructure optimization based on conditional generative adverserial networks",
      ],
    },
  },
  {
    image: "Research/Radiative Cooling.jpg",
    topic: "Radiative Cooling",
    summary:
      "Passive cooling technologies that exploit selective thermal emission and solar reflection to dissipate heat to the cold sky without energy input, extended to full-color and directional designs.",
    detail: {
      body: [
        "Every object radiates heat as thermal infrared light. A surface engineered to emit strongly in the narrow band where the atmosphere is transparent to space, while reflecting sunlight, can lose more heat to the sky than it absorbs and cool below ambient temperature with no energy input at all. This group designs the spectral and directional emission behind that effect and extends it beyond the plain white or metallic-looking coatings it usually requires, to full-color, photoluminescence-based, and angle-selective radiative cooling surfaces.",
      ],
      publications: [
        "Daylong sub-ambient radiative cooling with full-color exterior based on thermal radiation and solar decoupling",
        "Directional radiation for optimal radiative cooling",
        "Ideal spectral emissivity for radiative cooling of earthbound objects",
      ],
    },
  },
];

// Derived from the topic name (not a hand-maintained field) so adding a new
// topic above can't accidentally skip giving it a slug/URL — lowercase,
// spaces and anything non-alphanumeric collapsed to single hyphens.
function slugifyResearchTopic(topic) {
  return topic
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findResearchTopicBySlug(slug) {
  return RESEARCH_TOPICS.find((item) => slugifyResearchTopic(item.topic) === slug);
}
