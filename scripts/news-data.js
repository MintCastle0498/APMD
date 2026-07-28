// Single source of truth for News posts. news.html renders every entry in
// full; index.html's Home NEWS section renders the latest 6 as cards. Add a
// post here (with a unique id) and both pages update automatically — there's
// no separate admin/CMS step, this array *is* the content.
//
// Shape of one post:
//   id        unique string, used for the news.html#<id> deep link
//   title     headline
//   tag       one key from NEWS_CATEGORIES below — the "what kind of news"
//             label (Award / Lab Event / Conference / Media Coverage)
//   people    array of names this post is about, or ["APMD"] for the whole
//             lab rather than specific people
//   date      "YYYY-MM-DD" — the post's (start) date
//   dateEnd   optional "YYYY-MM-DD" — only set this if the post covers a
//             span of more than one day (e.g. a multi-day conference); the
//             date renders as a single day whenever this is omitted or
//             equal to `date`
//   images    array of { src, alt, credit } — credit is optional/omit-able,
//             shown as a small caption over the photo when present. One
//             entry is a single photo; more than one gets the swipeable
//             carousel automatically (news-render.js)
//   excerpt   short teaser shown (line-clamped) on the card
//   body      array of paragraph strings for the full news.html post
const NEWS_CATEGORIES = {
  award: { label: "수상", dot: "#f5c400" },
  event: { label: "연구실 행사", dot: "#5b8def" },
  conference: { label: "학회 참석", dot: "#8a63d2" },
  press: { label: "외부보도", dot: "#2bb3a3" },
};

const NEWS_POSTS = [
  {
    id: "janus-metasurface-1",
    title: "빛의 방향에 따라 두 얼굴 야누스같은 메타표면 개발",
    tag: "press",
    people: ["APMD"],
    date: "2026-03-15",
    images: [{ src: "assets/News_Example.png", alt: "야누스 메타표면 개발" }],
    excerpt:
      "메타표면 기술은 기존 기술에 비해 얇고 가벼우며, 나노미터 크기의 인공 구조물을 통해 빛을 정밀하게 제어할 수 있는 광학기술이다. 우리 연구진이 기존 메타표면 기술의 한계를 극복하고 빛의 비대칭 전송을 완벽하게 제어할 수 있는 야누스 메타표면 설계에 성공했다. 이 기술을 응용하여 특정 조건에서만 정보가 해독되어 보안성을 획기적으로 강화하는 방안도 제시했다.",
    body: [
      "메타표면 기술은 기존 기술에 비해 얇고 가벼우며, 나노미터 크기의 인공 구조물을 통해 빛을 정밀하게 제어할 수 있는 광학기술이다. 우리 연구진이 기존 메타표면 기술의 한계를 극복하고 빛의 비대칭 전송을 완벽하게 제어할 수 있는 야누스 메타표면 설계에 성공했다. 이 기술을 응용하여 특정 조건에서만 정보가 해독되어 보안성을 획기적으로 강화하는 방안도 제시했다.",
      "우리 대학 신소재공학과 신종화 교수 연구팀이 빛의 비대칭 전송을 완벽하게 제어할 수 있는 '야누스 메타표면(Janus Metasurface)'을 개발했다고 15일 밝혔다.",
      "방향에 따라 달리 반응하는 비대칭 성질은 과학과 공학의 다양한 분야에서 중요한 역할을 한다. 연구팀이 개발한 '야누스 메타표면'은 양방향에서 서로 다른 기능을 수행할 수 있는 광학 시스템을 구현한다.",
      "마치 로마 신화의 두 얼굴을 가진 야누스처럼, 이 메타표면은 빛이 입사되는 방향에 따라 투과광이 전혀 다른 광학적 반응을 보이며, 하나의 장치로 두 개의 독립적인 광학 시스템(예: 한쪽 방향에서는 확대 렌즈, 다른 방향에서는 편광 카메라로 작동하는 하나의 메타표면)을 운영하는 것과 같은 효과를 발휘한다. 즉, 이 기술을 이용하면 빛의 방향에 따라 서로 다른 두 개의 광학계(e.g. 렌즈와 홀로그램)를 운영하는 효과를 얻을 수 있다.",
      "이는 기존 메타표면 기술에서 해결되지 못한 난제였다. 기존 메타표면 기술은 빛의 세 가지 특성인 세기, 위상, 편광을 입사 방향에 따라 선택적으로 조절하는 데 한계가 있었다.",
      "연구팀은 수학적, 물리적 원리를 바탕으로 이러한 문제를 해결할 방법을 제시했고, 특히 양방향에서 서로 다른 벡터 홀로그램을 실험적으로 구현하는 데 성공했다. 이를 통해 완전한 비대칭 투과 광 제어 기술을 선보였다.",
    ],
  },
  {
    id: "osk-2023",
    title: "OSK 학회 참석",
    tag: "conference",
    people: ["APMD"],
    date: "2023-02-15",
    images: [{ src: "News/230215_OSK학회.jpg", alt: "OSK 학회 참석" }],
    excerpt: "한국광학회(OSK) 학술발표회에 참석했습니다.",
    body: ["한국광학회(OSK) 학술발표회에 참석했습니다."],
  },
  {
    id: "strawberry-2023",
    title: "딸기 파티",
    tag: "event",
    people: ["APMD"],
    date: "2023-04-15",
    images: [{ src: "News/230415_딸기파티.jpg", alt: "딸기 파티" }],
    excerpt: "연구실 딸기 파티를 열었습니다.",
    body: ["연구실 딸기 파티를 열었습니다."],
  },
  {
    id: "workshop-2023",
    title: "연구실 워크숍",
    tag: "event",
    people: ["APMD"],
    date: "2023-06-15",
    images: [{ src: "News/230615_워크샵.jpg", alt: "연구실 워크숍" }],
    excerpt: "연구실 워크숍을 다녀왔습니다.",
    body: ["연구실 워크숍을 다녀왔습니다."],
  },
  {
    id: "piers-2023",
    title: "PIERS 학회 참석",
    tag: "conference",
    people: ["APMD"],
    date: "2023-07-03",
    images: [{ src: "News/230703_PIERS 학회.jpg", alt: "PIERS 학회 참석" }],
    excerpt: "PIERS 학회에 참석했습니다.",
    body: ["PIERS 학회에 참석했습니다."],
  },
  {
    id: "meta-2023",
    title: "META 학회 참석",
    tag: "conference",
    people: ["APMD"],
    date: "2023-07-15",
    images: [{ src: "News/230715_Meta학회.jpg", alt: "META 학회 참석" }],
    excerpt: "META 학회에 참석했습니다.",
    body: ["META 학회에 참석했습니다."],
  },
  {
    id: "osk-2024",
    title: "OSK 학회 참석",
    tag: "conference",
    people: ["APMD"],
    date: "2024-02-15",
    images: [{ src: "News/240215_OSK학회.jpg", alt: "OSK 학회 참석" }],
    excerpt: "한국광학회(OSK) 학술발표회에 참석했습니다.",
    body: ["한국광학회(OSK) 학술발표회에 참석했습니다."],
  },
  {
    id: "strawberry-2024",
    title: "딸기 파티",
    tag: "event",
    people: ["APMD"],
    date: "2024-04-15",
    images: [{ src: "News/240415_딸기파티.jpg", alt: "딸기 파티" }],
    excerpt: "연구실 딸기 파티를 열었습니다.",
    body: ["연구실 딸기 파티를 열었습니다."],
  },
  {
    id: "meta-2024",
    title: "Attendance at META 2024, Toyama",
    tag: "conference",
    people: ["APMD"],
    date: "2024-07-16",
    dateEnd: "2024-07-19",
    images: [{ src: "News/240715_Meta학회.jpg", alt: "META 학회 참석" }],
    excerpt: "Our lab attended META 2024, the 14th International Conference on Metamaterials, Photonic Crystals and Plasmonics, held in Toyama, Japan.",
    body: ["Our lab attended META 2024, the 14th International Conference on Metamaterials, Photonic Crystals and Plasmonics, held in Toyama, Japan, from July 16 to 19, 2024."],
  },
  {
    id: "jo-mingwan-2024",
    title: "Best Poster Award at META 2024",
    tag: "award",
    people: ["조민관"],
    date: "2024-07-16",
    dateEnd: "2024-07-19",
    images: [
      { src: "News/240716_조민관선배(1).jpg", alt: "조민관 선배" },
      { src: "News/240716_조민관선배(2).png", alt: "조민관 선배" },
    ],
    excerpt: "Mingwan Cho received the Best Poster Award at META 2024, the 14th International Conference on Metamaterials, Photonic Crystals and Plasmonics.",
    body: [
      "Mingwan Cho received the Best Poster Award at META 2024, the 14th International Conference on Metamaterials, Photonic Crystals and Plasmonics, held in Toyama, Japan, from July 16 to 19, 2024.",
      "The award-winning poster was titled \"Color arrestor pixels for high-fidelity, high-sensitivity imaging sensors.\"",
    ],
  },
  {
    id: "kim-hyeonhee-2024",
    title: "Excellence Award at 2024 KAIST Optics Group Student Research Poster Competition",
    tag: "award",
    people: ["김현희"],
    date: "2024-07-25",
    images: [{ src: "News/240725_김현희선배.jpg", alt: "김현희 선배", credit: "APMD Lab" }],
    excerpt: "Hyeonhee Kim received the Excellence Award at the 2024 KAIST Optics Group Student Research Poster Competition.",
    body: [
      "Hyeonhee Kim received the Excellence Award at the 2024 KAIST Optics Group Student Research Poster Competition, held on July 25, 2024.",
      "The award-winning poster, titled \"Consensus ADMM for Photonic Design,\" was presented by Hyeonhee Kim of the Department of Materials Science and Engineering.",
    ],
  },
  {
    id: "cleo-2024",
    title: "Attendance at CLEO-PR 2024",
    tag: "conference",
    people: ["APMD"],
    date: "2024-08-04",
    dateEnd: "2024-08-09",
    images: [{ src: "News/240815_CLEO학회.jpg", alt: "CLEO 학회 참석", credit: "APMD Lab" }],
    excerpt: "Our lab attended CLEO-PR 2024, held at Songdo Convensia, Incheon.",
    body: [
      "Our lab attended CLEO-PR 2024 (Conference on Lasers and Electro-Optics Pacific Rim), held from August 4 to 9, 2024, at Songdo Convensia in Incheon, Korea.",
      "The conference was hosted by the Optical Society of Korea (OSK), bringing together researchers from across the Asia-Pacific region to share the latest advances in photonics and optoelectronics.",
    ],
  },
  {
    id: "lee-minyeul-2025",
    title: "Excellent Paper Award at OSK 2025 Winter Annual Meeting",
    tag: "award",
    people: ["이민열"],
    date: "2025-02-14",
    images: [{ src: "News/250214_이민열 선배.jpg", alt: "이민열 선배", credit: "APMD Lab" }],
    excerpt: "Minyeol Lee received the Excellent Paper Award at the OSK (Optical Society of Korea) 2025 Winter Annual Meeting.",
    body: [
      "Minyeol Lee received the Excellent Paper Award at the Optical Society of Korea (OSK) 2025 Winter Annual Meeting, held on February 14, 2025.",
      "The award-winning paper, titled \"Angle- and polarization-insensitive structural color metasurface using the aperiodic tiling,\" was co-authored by Minyeol Lee (KAIST), Suwan Jeon (KIMM), and Prof. Jonghwa Shin (KAIST).",
    ],
  },
  {
    id: "hwang-jisung-2026",
    title: "Excellence Award at 2026 KAIST Optics Group Student Research Poster Competition",
    tag: "award",
    people: ["황지성"],
    date: "2026-05-27",
    images: [{ src: "News/260527_황지성선배.jpg", alt: "황지성 선배", credit: "APMD Lab" }],
    excerpt: "Jisung Hwang received the Excellence Award in the KAIST Optics Group Student Research Poster Competition.",
    body: ["Jisung Hwang received the Excellence Award at the KAIST Optics Group Student Research Poster Competition, held during the 2026 KAIST Optics Night (광학인의 밤) event."],
  },
  {
    id: "optics-society-2026",
    title: "Attendance at Optics and Photonics Congress 2026 (OPC 2026)",
    tag: "conference",
    people: ["APMD"],
    date: "2026-07-19",
    dateEnd: "2026-07-22",
    images: [
      { src: "News/260719_광학회.jpg", alt: "광학회 참석", credit: "APMD Lab" },
      { src: "News/260719_광학회2.jpg", alt: "광학회 참석", credit: "APMD Lab" },
      { src: "News/260719_신종화교수님_1.jpg", alt: "Optics and Photonics Congress 2026 (OPC 2026) 참석", credit: "APMD Lab" },
      { src: "News/260719_신종화교수님_2.jpg", alt: "Optics and Photonics Congress 2026 (OPC 2026) 참석", credit: "APMD Lab" },
      { src: "News/260719_김현희-2.jpg", alt: "Optics and Photonics Congress 2026 (OPC 2026) 참석", credit: "APMD Lab" },
    ],
    excerpt: "Optics and Photonics Congress 2026 (OPC 2026) 참석",
    body: [
      "제주 ICC에서 열린 Optics and Photonics Congress 2026 (OPC 2026)에 참석했습니다.",
      "신종화 교수님은 \"Periodicity, homogeneity and consistency in metasurfaces\"를, 김현희 Ph.D.는 \"Bi-layer metasurfaces as a versatile platform for vectorial light control\"을 주제로 발표를 진행했습니다.",
    ],
  },
  {
    id: "post-20260206",
    title: "Excellent Paper Award at OSK 2026 Winter Annual Meeting",
    tag: "award",
    people: ["김도현"],
    date: "2026-02-06",
    images: [{ src: "News/한국광학회 2026년도 동계 학술발표회 수상.jpg", alt: "한국광학회 2026년도 동계 학술발표회 수상", credit: "APMD Lab" }],
    excerpt: "Dohyun Kim received the Excellent Paper Award at the OSK (Optical Society of Korea) 2026 Winter Annual Meeting.",
    body: [
      "Dohyun Kim received the Excellent Paper Award at the Optical Society of Korea (OSK) 2026 Winter Annual Meeting, held on February 6, 2026.",
      "The award-winning paper, titled \"Fast Differentiable Computation of the Shifted Band-extended Angular Spectrum Method using the Chirp-Z Transform Implemented by Bluestein Method,\" was co-authored by Dohyun Kim and Prof. Jonghwa Shin (KAIST).",
    ],
  },
];
