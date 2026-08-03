// One entry per research topic, each with its own real figure in /Research.
//
// `detail` is what research-detail.html renders for that topic's own page:
// `images` (one or more photos/figures, shown in a simple gallery) and
// `body` (one or more paragraphs). Left unset here, both fall back to the
// card's own single `image` and `summary` (see research-detail-render.js) —
// fill either in per-topic once there's more material to show than the
// list card's short excerpt.
const RESEARCH_TOPICS = [
  {
    image: "Research/Vectorial Holography.jpg",
    topic: "Vectorial Holography",
    summary:
      "Encoding and reconstructing light's full vector state — amplitude, phase, and polarization — using bi-layer metasurfaces to enable multiplexed, high-security optical holography with total angular momentum control.",
  },
  {
    image: "Research/Bi-Layer Metasurfaces.jpg",
    topic: "Bi-Layer Metasurfaces",
    summary:
      "A platform architecture using two stacked metasurface layers to achieve complete, independent control over the amplitude, phase, and polarization of transmitted coherent light.",
  },
  {
    image: "Research/Large-Area Nanofabrication.jpg",
    topic: "Large-Area Nanofabrication",
    summary:
      "Scalable patterning techniques, including proximity-field and interference lithography, for realizing nanophotonic structures over macroscopic areas at low cost.",
  },
  {
    image: "Research/Tunable Metasurface.jpg",
    topic: "Tunable Metasurfaces",
    summary:
      "Metasurfaces whose optical response can be dynamically reconfigured post-fabrication via external stimuli such as carrier injection, mechanical strain, or phase-change materials.",
  },
  {
    image: "Research/AI-Driven Inverse Design.jpg",
    topic: "AI-Driven Inverse Design",
    summary:
      "Machine learning and optimization algorithms, including large language models, applied to automate and accelerate the design of nanophotonic devices and metasurfaces.",
  },
  {
    image: "Research/Radiative Cooling.jpg",
    topic: "Radiative Cooling",
    summary:
      "Passive cooling technologies that exploit selective thermal emission and solar reflection to dissipate heat to the cold sky without energy input, extended to full-color and directional designs.",
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
