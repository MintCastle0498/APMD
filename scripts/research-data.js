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
    image: "Research/Vectorial Holography.jpg",
    topic: "Vectorial Holography",
    summary:
      "Encoding and reconstructing light's full vector state — amplitude, phase, and polarization — using bi-layer metasurfaces to enable multiplexed, high-security optical holography with total angular momentum control.",
    detail: {
      body: [
        "Conventional holography reconstructs a scalar wavefront — intensity and phase — but light also carries polarization, and encoding the full vector state of a wavefront means controlling amplitude, phase, and polarization independently at every point of the hologram. A single-layer metasurface generally can't do all three at once for an arbitrary input state.",
        "Building on a bi-layer metasurface platform capable of complete, independent control over transmitted light's amplitude, phase, and polarization, this work realizes vectorial holograms that reconstruct different images depending on the illumination's polarization or propagation direction, and extends the encoded degrees of freedom to arbitrary total angular momentum states — enabling multiplexed, high-security optical encryption beyond what scalar holography allows.",
      ],
      publications: [
        "Arbitrary Total Angular Momentum Vectorial Holography Using Bi-Layer Metasurfaces",
        "Bidirectional Vectorial Holography Using Bi-Layer Metasurfaces and Its Application to Optical Encryption",
      ],
    },
  },
  {
    image: "Research/Bi-Layer Metasurfaces.jpg",
    topic: "Bi-Layer Metasurfaces",
    summary:
      "A platform architecture using two stacked metasurface layers to achieve complete, independent control over the amplitude, phase, and polarization of transmitted coherent light.",
    detail: {
      body: [
        "Amplitude, phase, and polarization together fully define a coherent light wave. Independently controlling all three at subwavelength resolution has traditionally meant stacking multiple bulky optical elements — lenses, polarizers, waveplates — and a single-layer metasurface can shape some of these properties, but not all of them at once for an arbitrary input state.",
        "This platform stacks two metasurface layers so the combined structure achieves complete, independent control over the amplitude, phase, and polarization of transmitted coherent light. Because that control is complete rather than partial, the platform also serves as the underlying building block for other lines of work in the lab, including vectorial holography.",
      ],
      publications: ["Universal metasurfaces for complete linear control of coherent light transmission"],
    },
  },
  {
    image: "Research/Large-Area Nanofabrication.jpg",
    topic: "Large-Area Nanofabrication",
    summary:
      "Scalable patterning techniques, including proximity-field and interference lithography, for realizing nanophotonic structures over macroscopic areas at low cost.",
    detail: {
      body: [
        "A nanophotonic design only matters if it can actually be manufactured, and the highest-resolution nanofabrication techniques — electron-beam lithography, focused ion beam milling — are inherently serial and slow, making them impractical for structures that need to cover macroscopic areas.",
        "This work develops parallel, scalable patterning techniques — including proximity-field nanopatterning and interference lithography — that replicate complex, high-resolution photonic structures over wafer-scale or larger areas in a single exposure, at a fraction of the cost and time of direct-write methods, while still reaching the subwavelength feature sizes nanophotonic devices require.",
      ],
      publications: [
        "Spectrally Encoded Proximity-Field Nanopatterning",
        "Realization of all two-dimensional Bravais lattices with metasurface-based interference lithography",
        "Ultralarge Area Sub-10nm Plasmonic Nanogap Array by Block Copolymer Self-Assembly for Reliable High-Sensitivity SERS",
      ],
    },
  },
  {
    image: "Research/Tunable Metasurface.jpg",
    topic: "Tunable Metasurfaces",
    summary:
      "Metasurfaces whose optical response can be dynamically reconfigured post-fabrication via external stimuli such as carrier injection, mechanical strain, or phase-change materials.",
    detail: {
      body: [
        "Most metasurfaces are fixed the moment they're fabricated — their nanostructure geometry sets one, permanent optical response. Many applications instead need that response to change after fabrication: a lens that refocuses, a window that changes transparency, a filter that switches color.",
        "This work builds metasurfaces whose response can be reconfigured post-fabrication through an external stimulus — carrier injection into a semiconductor layer, mechanical strain or compression, or an applied bias — rather than requiring a new device for every desired state, spanning applications from reconfigurable laser focusing to compression-sensitive smart windows.",
      ],
      publications: [
        "Three-dimensionally reconfigurable focusing of laser by mechanically tunable metalens doublet with built-in holograms for alignment",
        "Tunable metamaterials with carrier-induced effective permittivity for active control of electromagnetic fields in semiconductor manufacturing device",
        "Compression-Sensitive Smart Windows: Inclined Pores for Dynamic Transparency Changes",
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
        "Designing a nanophotonic device conventionally means guessing a structure, simulating its optical response, and iterating by hand — a process that scales poorly as the number of design parameters grows. Inverse design flips this around: starting from a target optical response and letting an algorithm search for the structure that produces it.",
        "This work applies machine learning and optimization algorithms — including generative adversarial networks, topology optimization, and, more recently, large language models — to automate and accelerate that search for both multilayer thin-film stacks and metasurfaces, turning manual trial-and-error into automated, data-driven design.",
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
        "Every object radiates heat as thermal infrared light. One engineered to emit strongly in the narrow band where the atmosphere is transparent to space, while reflecting sunlight, can lose more heat to the cold sky than it absorbs from the sun and its surroundings — cooling below ambient air temperature with no energy input at all.",
        "This work designs the spectral and directional emission properties behind that passive cooling effect, and extends it beyond the plain white or metallic-looking coatings the effect usually requires — to full-color, photoluminescence-based, and angle-selective radiative cooling surfaces, so the technology isn't limited to applications where a specific color or an unobstructed daytime view of the sky isn't required.",
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
