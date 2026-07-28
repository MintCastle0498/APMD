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
    people: ["정준교", "김현희"],
    date: "2024-10-15",
    images: [
      {
        src: "News/빛의 방향에 따라 두 얼굴 야누스같은 메타표면 개발​.jpg",
        alt: "(왼쪽부터) 신소재공학과 정준교 박사, 김현희 박사과정, 신종화 교수",
        credit: "KAIST",
      },
    ],
    excerpt:
      "메타표면 기술은 기존 기술에 비해 얇고 가벼우며, 나노미터 크기의 인공 구조물을 통해 빛을 정밀하게 제어할 수 있는 광학기술이다. 우리 연구진이 기존 메타표면 기술의 한계를 극복하고 빛의 비대칭 전송을 완벽하게 제어할 수 있는 야누스 메타표면 설계에 성공했다. 이 기술을 응용하여 특정 조건에서만 정보가 해독되어 보안성을 획기적으로 강화하는 방안도 제시했다.",
    body: [
      "메타표면 기술은 기존 기술에 비해 얇고 가벼우며, 나노미터 크기의 인공 구조물을 통해 빛을 정밀하게 제어할 수 있는 광학기술이다. 우리 연구진이 기존 메타표면 기술의 한계를 극복하고 빛의 비대칭 전송을 완벽하게 제어할 수 있는 야누스 메타표면 설계에 성공했다. 이 기술을 응용하여 특정 조건에서만 정보가 해독되어 보안성을 획기적으로 강화하는 방안도 제시했다.",
      "우리 대학 신소재공학과 신종화 교수 연구팀이 빛의 비대칭 전송을 완벽하게 제어할 수 있는 '야누스 메타표면(Janus Metasurface)'을 개발했다.",
      "방향에 따라 달리 반응하는 비대칭 성질은 과학과 공학의 다양한 분야에서 중요한 역할을 한다. 연구팀이 개발한 '야누스 메타표면'은 양방향에서 서로 다른 기능을 수행할 수 있는 광학 시스템을 구현한다.",
      "마치 로마 신화의 두 얼굴을 가진 야누스처럼, 이 메타표면은 빛이 입사되는 방향에 따라 투과광이 전혀 다른 광학적 반응을 보이며, 하나의 장치로 두 개의 독립적인 광학 시스템(예: 한쪽 방향에서는 확대 렌즈, 다른 방향에서는 편광 카메라로 작동하는 하나의 메타표면)을 운영하는 것과 같은 효과를 발휘한다. 즉, 이 기술을 이용하면 빛의 방향에 따라 서로 다른 두 개의 광학계(e.g. 렌즈와 홀로그램)를 운영하는 효과를 얻을 수 있다.",
      "이는 기존 메타표면 기술에서 해결되지 못한 난제였다. 기존 메타표면 기술은 빛의 세 가지 특성인 세기, 위상, 편광을 입사 방향에 따라 선택적으로 조절하는 데 한계가 있었다.",
      "연구팀은 수학적, 물리적 원리를 바탕으로 이러한 문제를 해결할 방법을 제시했고, 특히 양방향에서 서로 다른 벡터 홀로그램을 실험적으로 구현하는 데 성공했다. 이를 통해 완전한 비대칭 투과 광 제어 기술을 선보였다.",
      "연구팀은 또한 이번 메타표면 기술을 기반으로 새로운 광학 암호화 기술을 개발했다. 야누스 메타표면을 통해 입사 방향과 편광 상태에 따라 서로 다른 이미지를 생성하는 벡터 홀로그램을 구현해, 특정 조건에서만 정보가 해독되는 보안성을 획기적으로 강화한 광학 암호화 시스템을 선보였다.",
      "신종화 교수는 \"이번 연구를 통해 광학 분야의 오랜 난제였던 빛의 세기, 위상, 편광의 완전한 비대칭 투과 제어가 가능하게 됐고, 이를 바탕으로 다양한 응용 광학 소자의 개발 가능성이 열렸다\"며, \"메타표면 기술의 잠재력을 최대한 활용해 기존 한계를 뛰어넘는 고도화된 광학 암호화 외에도 증강현실(AR), 홀로그램 디스플레이, 그리고 자율주행 차의 LiDAR(라이다) 시스템 등 다양한 분야에 응용되도록 광학 소자들을 지속적으로 개발할 계획\"이라고 말했다.",
      "신소재공학과 김현희 박사과정생과 정준교 박사가 공동 제1저자로 참여한 이번 연구는 국제 학술지 '어드밴스드 머티리얼스(Advanced Materials)'에 게재됐다.",
    ],
  },
  {
    id: "osk-2023",
    title: "Attendance at OSK 34th General Assembly & 2023 Winter Annual Meeting",
    tag: "conference",
    people: ["APMD"],
    date: "2023-02-14",
    dateEnd: "2023-02-17",
    images: [{ src: "News/230215_OSK학회.jpg", alt: "OSK 학회 참석", credit: "APMD Lab" }],
    excerpt: "Our lab attended the OSK 34th General Assembly and 2023 Winter Annual Meeting, held at BEXCO Convention Hall, Busan.",
    body: ["Our lab attended the 34th General Assembly and 2023 Winter Annual Meeting of the Optical Society of Korea (OSK), held at BEXCO Convention Hall, Busan, from February 14 to 17, 2023."],
  },
  {
    id: "strawberry-2023",
    title: "Lab Strawberry Party 2023",
    tag: "event",
    people: ["APMD"],
    date: "2023-04-03",
    images: [{ src: "News/230415_딸기파티.jpg", alt: "딸기 파티", credit: "APMD Lab" }],
    excerpt: "Our lab held a strawberry party in April 2023.",
    body: ["Our lab enjoyed a strawberry party together on April 3, 2023."],
  },
  {
    id: "workshop-2023",
    title: "Inverse Design Workshop with Prof. Min Seok Jang & Prof. Hamza Kurt",
    tag: "event",
    people: ["APMD"],
    date: "2023-06-23",
    images: [{ src: "News/230615_워크샵.jpg", alt: "연구실 워크숍" }],
    excerpt: "Our lab held an Inverse Design Workshop with Prof. Min Seok Jang and Prof. Hamza Kurt.",
    body: ["Our lab held an Inverse Design Workshop on June 23, 2023, together with the research groups of Prof. Min Seok Jang and Prof. Hamza Kurt."],
  },
  {
    id: "piers-2023",
    title: "Attendance at PIERS 2023, Prague",
    tag: "conference",
    people: ["APMD"],
    date: "2023-07-03",
    dateEnd: "2023-07-06",
    images: [{ src: "News/230703_PIERS 학회.jpg", alt: "PIERS 학회 참석", credit: "APMD Lab" }],
    excerpt: "Our lab attended PIERS 2023 (Photonics and Electromagnetics Research Symposium), held in Prague.",
    body: ["Our lab attended PIERS 2023, the Photonics and Electromagnetics Research Symposium, held in Prague, Czech Republic, from July 3 to 6, 2023."],
  },
  {
    id: "meta-2023",
    title: "Attendance at META 2023, Paris",
    tag: "conference",
    people: ["APMD"],
    date: "2023-07-18",
    dateEnd: "2023-07-21",
    images: [{ src: "News/230715_Meta학회.jpg", alt: "META 학회 참석", credit: "APMD Lab" }],
    excerpt: "Our lab attended META 2023, the 13th International Conference on Metamaterials, Photonic Crystals and Plasmonics, held in Paris.",
    body: ["Our lab attended META 2023, the 13th International Conference on Metamaterials, Photonic Crystals and Plasmonics, held in Paris, France, from July 18 to 21, 2023."],
  },
  {
    id: "osk-2024",
    title: "Attendance at OSK 35th General Assembly & 2024 Winter Annual Meeting",
    tag: "conference",
    people: ["APMD"],
    date: "2024-02-14",
    dateEnd: "2024-02-16",
    images: [{ src: "News/240215_OSK학회.jpg", alt: "OSK 학회 참석", credit: "APMD Lab" }],
    excerpt: "Our lab attended the OSK 35th General Assembly and 2024 Winter Annual Meeting, held at Suwon Convention Center.",
    body: ["Our lab attended the 35th General Assembly and 2024 Winter Annual Meeting of the Optical Society of Korea (OSK), held at Suwon Convention Center from February 14 to 16, 2024."],
  },
  {
    id: "strawberry-2024",
    title: "Lab Strawberry Party 2024",
    tag: "event",
    people: ["APMD"],
    date: "2024-04-02",
    images: [{ src: "News/240415_딸기파티.jpg", alt: "딸기 파티", credit: "APMD Lab" }],
    excerpt: "Our lab held a strawberry party in April 2024.",
    body: ["Our lab enjoyed a strawberry party together on April 2, 2024."],
  },
  {
    id: "meta-2024",
    title: "Attendance at META 2024, Toyama",
    tag: "conference",
    people: ["APMD"],
    date: "2024-07-16",
    dateEnd: "2024-07-19",
    images: [{ src: "News/240715_Meta학회.jpg", alt: "META 학회 참석", credit: "APMD Lab" }],
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
      { src: "News/240716_조민관선배(1).jpg", alt: "조민관 선배", credit: "APMD Lab" },
      { src: "News/240716_조민관선배(2).png", alt: "조민관 선배", credit: "APMD Lab" },
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
  {
    id: "press-tam-hologram-2026",
    title: "'빛이 곧 열쇠가 된다' 신개념 홀로그램 기술 개발...복제 어려운 보안 구현",
    tag: "press",
    people: ["정준교"],
    date: "2026-05-06",
    images: [
      {
        src: "News/'빛이 곧 열쇠가 된다' 신개념 홀로그램 기술 개발... 복제 어려운 보안 구현.png",
        alt: "(왼쪽부터) 정준교 박사, 신종화 교수",
        credit: "KAIST",
      },
    ],
    excerpt:
      "빛의 움직임을 '열쇠'처럼 활용해, 특정 조건에서만 정보가 드러나는 신개념 홀로그램이 개발됐다. 기존 광통신과 보안 기술의 한계를 동시에 극복할 수 있는 새로운 접근으로 주목된다.",
    body: [
      "빛의 움직임을 '열쇠'처럼 활용해, 특정 조건에서만 정보가 드러나는 신개념 홀로그램(빛의 정보를 이용해 물체가 실제로 있는 것처럼 입체적으로 보이게 만드는 기술)이 개발됐다. 기존 광통신과 보안 기술의 한계를 동시에 극복할 수 있는 새로운 접근으로 주목된다.",
      "신소재공학과 신종화 교수 연구팀이 빛의 '총 각운동량(Total Angular Momentum, TAM)'을 정보 선택의 핵심 열쇠로 활용해, 입사하는 빛의 상태에 따라 서로 다른 입체 영상을 구현하는 차세대 벡터 홀로그램 메타표면을 개발했다.",
      "기존에는 빛의 진동 방향을 의미하는 '편광'이나, 빛이 나선형으로 꼬이며 진행하는 성질인 '궤도 각운동량(Orbital Angular Momentum, OAM)'을 각각 활용하는 연구는 활발히 진행돼 왔다. 그러나 이 두 가지 성질을 하나의 소자에서 서로 독립적으로 제어하는 것은 광학 분야에서 오랫동안 해결되지 않은 난제로 여겨져 왔다.",
      "이를 해결하기 위해 연구팀은 머리카락 굵기보다 훨씬 작은 나노 구조물을 정밀하게 설계해 두 층으로 쌓은 '이중층(Bi-layer) 메타표면'을 구현했다.",
      "이 소자는 빛의 편광과 꼬임 정도가 결합된 '총 각운동량(TAM)'을 마치 복잡한 암호 열쇠처럼 활용한다. 즉, 특정한 방식으로 진동하고 특정한 횟수만큼 꼬인 빛이 들어올 때만 소자가 반응해 숨겨진 정보를 재현하는 방식이다. 이 기술을 적용하면 겉으로는 동일해 보이는 빛이라도, 정해진 '빛의 열쇠'가 없으면 정보를 읽을 수 없어 높은 보안성을 확보할 수 있다.",
      "또한 빛의 꼬임 상태(OAM)는 이론적으로 매우 다양한 값을 가질 수 있어, 하나의 빛에 실을 수 있는 정보량을 크게 늘릴 수 있다. 이를 통해 기존보다 훨씬 많은 데이터를 동시에 전송하는 초고용량 광통신 기술로의 확장도 가능하다.",
      "특히 이번 연구는 단순한 입체 영상 구현을 넘어, 영상의 각 지점마다 빛의 진동 방향(편광)까지 정밀하게 제어하는 '벡터 홀로그램'을 구현했다는 점에서 의미가 크다.",
      "신종화 교수는 \"이번 연구는 빛의 핵심 성질인 편광과 꼬임을 하나의 독립적인 정보 키로 결합해 자유자재로 활용할 수 있음을 입증한 사례\"라며 \"복제 어려운 보안 시스템과 초고속·초고용량 광학 통신 기술의 핵심 플랫폼으로 발전할 것\"이라고 말했다.",
      "이번 연구는 정준교 박사가 제1저자로 참여했으며, 국제 학술지 '어드밴스드 머티리얼스(Advanced Materials)'에 게재됐다.",
    ],
  },
  {
    id: "press-safety-lab-2024",
    title: "4개 연구실, ′안전관리 우수연구실′ 인증 취득",
    tag: "press",
    people: ["APMD"],
    date: "2024-02-13",
    images: [
      {
        src: "News/4개 연구실, ′안전관리 우수연구실′ 인증 취득​.jpg",
        alt: "2023 안전관리 우수연구실 인증 취득한 4개 연구실 및 학교 관계자들",
        credit: "KAIST",
      },
    ],
    excerpt:
      "우리 연구실을 포함한 KAIST 4개 연구실이 과학기술정보통신부가 주관하는 '2023 안전관리 우수연구실 인증'을 취득했다.",
    body: [
      "우리 대학 4개 연구실이 과학기술정보통신부가 주관하는 '2023 안전관리 우수연구실 인증'을 취득했다. 정부가 2013년 도입한 '안전관리 우수연구실 인증제'는 대학이나 연구기관 등에 설치된 과학기술 분야 연구실이 자율적으로 안전관리 역량을 강화할 수 있도록 마련한 제도로, 안전관리 활동이 우수한 연구실에 전문가의 심사를 통한 인증을 부여한다.",
      "이번에 신규 인증을 취득한 연구실은 ① 고분자 에너지 전자 연구실(김범준 교수, 생명화학공학과), ② 고등 광 재료 및 소자 연구실(신종화 교수, 신소재공학과), ③ 지속가능촉매연구실(박윤수 교수, 화학과), ④ 무기합성 연구실(백윤정 교수, 화학과) 등 총 4개다.",
      "해당 연구실들은 연구실 안전 환경 시스템 분야(30점), 연구실 안전 환경 활동 수준 분야(50점), 연구실 안전관리 관계자 안전의식 분야(20점) 등 세 가지 심사 항목에서 각 분야 배점의 80% 이상을 득점하고 80점 이상의 총점을 얻어 우수 연구실로 선정됐다.",
      "인증서 수여식은 2024년 2월 13일 오후 3시에 열렸으며, 이동만 교학부총장, 양재영 행정처장 등 보직자들과 해당 연구실 관계자들이 참여했다.",
    ],
  },
  {
    id: "press-universal-metasurface-2022",
    title: "빛을 완전히 조절할 수 있는 메타렌즈 개발",
    tag: "press",
    people: ["장태용", "정준교"],
    date: "2022-12-02",
    images: [
      {
        src: "News/빛을 완전히 조절할 수 있는 메타렌즈 개발​_1.jpg",
        alt: "유니버설 메타표면을 통해 구현한 삼차원 벡터 홀로그램",
        credit: "KAIST",
      },
      {
        src: "News/빛을 완전히 조절할 수 있는 메타렌즈 개발​_2.jpg",
        alt: "유니버설 메타표면 기반 편광 의존적인 선형 광학계와 양자 CNOT 게이트 계산 결과",
        credit: "KAIST",
      },
    ],
    excerpt:
      "우리 대학 신소재공학과 신종화 교수 연구팀이 빛의 세 가지 주요 특성인 세기, 위상, 편광을 동시에 모두 조절할 수 있는 유니버설 메타표면(universal metasurface)을 개발했다.",
    body: [
      "우리 대학 신소재공학과 신종화 교수 연구팀이 빛의 세 가지 주요 특성인 세기, 위상, 편광을 동시에 모두 조절할 수 있는 유니버설 메타표면(universal metasurface)을 개발했다.",
      "단일 소자로 빛의 세기, 위상, 편광을 모두 자유로이 조절할 수 있는 기술은 갈릴레이가 망원경으로 목성의 위성을 관측했던 광학 분야의 시초부터 제임스웹 망원경으로 130억 년 전 우주를 볼 수 있게 된 현재까지 풀리지 않는 난제로 남아있었다.",
      "이러한 메타표면은 현재 안경 두께의 천 분의 일인 수 마이크로미터 수준의 얇은 두께만으로도 렌즈의 역할을 할 수 있을 뿐만 아니라, 편광판, 컬러필터 등 기존 다른 광학 부품들의 기능도 동시에 수행할 가능성을 갖고 있어서 OLED 등 현재 상용 디스플레이의 두께를 현저히 줄이거나 동영상 홀로그램, 증강현실(AR) 글래스, 라이다(LiDAR) 등의 새로운 응용에도 널리 적용될 수 있는 다재다능한 기술로 관심을 받고 있다.",
      "연구팀은 행렬과 관련된 수학적 원리에 착안해, 밀접한 두 층으로 이뤄진 유전체 메타표면이 빛의 세 가지 주요한 특성을 완벽히 조절할 수 있음을 이론적으로 밝히고, 이를 실험적으로 규명했다. 특히, 기존에 단일 소자로 불가능했던 벡터 홀로그램들을 제안하고 최초로 구현하는 데 성공했다.",
      "연구진은 유니버설 메타표면과 일반 렌즈의 조합만으로 임의의 편광 선택적인 선형 광학계의 구현이 가능함을 이론적으로 입증했다. 한 가지 예시로 연구팀은 확률론적 양자 CNOT 게이트 배열을 유니버설 메타표면과 렌즈만을 사용해 만들 수 있음을 보였으며, 이러한 원리는 양자 광학뿐만 아니라 광 통신, 광 신경망을 이용한 기계학습 기반 안면인식 등 여러 분야에서 활용될 수 있을 것으로 기대된다.",
      "신종화 교수는 \"이번 연구를 통해 광학 분야의 오랜 난제였던 빛의 세기, 위상, 편광의 완전한 조절을 해결했을 뿐만 아니라, 이를 바탕으로 모든 편광 선택적인 선형 광학계 구현이 이론적으로 가능함을 밝혔다\"며, \"이번 연구에서 제안한 메타표면의 가능성을 활용하여 기존 한계를 극복한 응용 광소자를 적극적으로 개발할 계획\"이라고 말했다.",
      "신소재공학과 장태용 박사와 정준교 박사과정생이 공동 제1저자로 참여한 이번 연구는 국제 학술지 '어드밴스드 머티리얼스(Advanced Materials)'에 게재됐다.",
    ],
  },
  {
    id: "press-3d-lithography-2022",
    title: "차세대 반도체 나노구조 공정을 혁신하는 새로운 3차원 노광 공정 개발",
    tag: "press",
    people: ["남상현", "김명준", "김나영"],
    date: "2022-05-27",
    images: [
      {
        src: "News/차세대 반도체 나노구조 공정을 혁신하는 새로운 3차원 노광 공정 개발​.jpg",
        alt: "(왼쪽부터) 전석우 교수, 신종화 교수, 김명준 박사과정, 김나영 박사과정, 남상현 박사",
        credit: "KAIST",
      },
      {
        src: "News/차세대 반도체 나노구조 공정을 혁신하는 새로운 3차원 노광 공정 개발​_1.jpg",
        alt: "역설계 연산을 활용해 목표 소재를 구현하는 패터닝 기술 모식도",
        credit: "KAIST",
      },
      {
        src: "News/차세대 반도체 나노구조 공정을 혁신하는 새로운 3차원 노광 공정 개발​_2.jpg",
        alt: "사각배열의 나노채널 구현 공정 모식도 및 시뮬레이션 결과",
        credit: "KAIST",
      },
    ],
    excerpt:
      "우리 대학 신소재공학과 전석우 교수와 신종화 교수 공동연구팀이 차세대 반도체 공정 핵심기술인 3차원의 나노구조를 단일 노광으로 효율적으로 제작하는 방법을 개발했다.",
    body: [
      "우리 대학 신소재공학과 전석우 교수와 신종화 교수 공동연구팀이 차세대 반도체 공정 핵심기술인 3차원의 나노구조를 단일 노광으로 효율적으로 제작하는 방법을 개발했다. 노광 공정이란 빛을 이용해 실리콘 웨이퍼에 전자 회로를 새기는 공정을 말한다.",
      "이번 연구 성과는 갈수록 복잡해지는 반도체 구조와 배선구조 등을 기존 2차원 평면 노광 방식으로 건물을 한층 한층 제작하듯이 진행하던 방식에 비해 훨씬 더 낮은 비용과 공정으로 제작할 수 있는 근거를 마련한 획기적인 연구 결과로 판단된다.",
      "전석우 교수와 신종화 교수가 교신저자로, 남상현 박사와 김명준, 김나영 박사과정이 공동 제1저자로 참여한 이번 연구는 국제 학술지 '사이언스 어드밴시스(Science Advances)'에 게재됐다.",
      "공동연구팀은 수반행렬 방법(Adjoint method) 기반 역설계 알고리즘을 활용해, 적은 연산으로 원하는 형태의 나노 홀로그램을 생성하는 위상 마스크의 격자구조를 효율적으로 찾아내는 방법론을 제시했다. 이는 기존의 반도체 리소그래피 공정에 적용됐으며, 연구팀은 광감응성 물질에 단 한 번의 빛을 쏘아 목표하는 나노 홀로그램을 형성하고, 물질화해 원하는 3차원 나노구조를 단 한 번의 노광으로 구현할 수 있음을 실험적으로 증명했다.",
      "다양한 3차원 패터닝 공정 가운데, 근접장 나노패터닝(PnP, Proximity-field nanoPatterning)은 단일 노광으로 주기적인 3차원의 나노구조를 정확하고 생산성 있게 구현할 수 있다. 하지만, 현재까지 주기적인 위상 마스크 패턴을 활용해 구현할 수 있는 구조의 자유도는 제한돼왔으며, 이를 극복하기 위해서는 감광물질에 원하는 형태의 홀로그램을 구현하는 위상 마스크의 디자인을 계산하는 과정이 필요하다.",
      "이렇게 제작된 3차원의 나노구조는 원자층 증착법을 활용해 구조에 따라 물질의 주입 및 치환으로 다양한 소재를 원하는 구조로 제작할 가능성을 열어준다. 이번 기술이 차세대 반도체 소자인 GAA(Gate All Around) 소자나 3차원 반도체 집적기술에 적용된다면 차세대 반도체 역량 강화에 크게 이바지할 것으로 기대된다.",
    ],
  },
  {
    id: "press-bone-metamaterial-2020",
    title: "뼈의 단단함을 모사해 광학적 특성을 매우 증대시킨 신물질 개발",
    tag: "press",
    people: ["장태용"],
    date: "2020-06-09",
    images: [
      {
        src: "News/뼈의 단단함을 모사해 광학적 특성을 매우 증대시킨 신물질 개발​_1.png",
        alt: "신소재공학과 신종화 교수, 장태용 박사과정",
        credit: "KAIST",
      },
      {
        src: "News/뼈의 단단함을 모사해 광학적 특성을 매우 증대시킨 신물질 개발​_2.png",
        alt: "광학적 거대 비선형성을 갖는 메타물질과 동물 뼈의 구조 비교",
        credit: "KAIST",
      },
      {
        src: "News/뼈의 단단함을 모사해 광학적 특성을 매우 증대시킨 신물질 개발​_3.png",
        alt: "메타물질의 비선형 특성을 나타낸 도식",
        credit: "KAIST",
      },
    ],
    excerpt:
      "우리 연구진이 동물 뼈가 그의 구성성분인 단백질보다 수천 배 단단할 수 있는 생체역학적 원리를 모사해 광학적 비선형성이 기존 물질 대비 수천에서 수십억 배나 큰 신물질을 개발했다.",
    body: [
      "우리 연구진이 동물 뼈가 그의 구성성분인 단백질보다 수천 배 단단할 수 있는 생체역학적 원리를 모사해 광학적 비선형성이 기존 물질 대비 수천에서 수십억 배나 큰 신물질을 개발했다.",
      "비선형성이란 입력값과 출력값이 비례관계에 있지 않은 성질인데, 광학에서 큰 비선형성을 확보할 경우 빛의 속도로 동작하는 인공 신경망이나 초고속 통신용 광 스위치 등의 광소자를 구현할 수 있다.",
      "우리 대학 신소재공학과 신종화 교수 연구팀은 벽돌을 엇갈려 담을 쌓는 것과 같이 나노 금속판을 3차원 공간에서 엇갈리게 배열하면 물질의 광학적 비선형성이 매우 크게 증대될 수 있음을 확인했다. 이번 연구를 통해 발견한 비선형성 증대원리는 광학뿐만 아니라 역학, 전자기학, 유체역학, 열역학 등 다양한 물리 분야에도 적용이 가능하다.",
      "신 교수 연구팀은 물질의 근본적인 전기적 특성인 유전분극(물체가 전기를 띠는 현상)을 매우 크게 조절하는 방법을 고안했다. 나노 금속판이 3차원에서 엇갈려 배열돼있으면 국소분극이 공간을 촘촘하게 채우면서, 마치 시냇물이 모여서 강이 되듯, 전체적으로 매우 큰 분극을 만들게 된다는 점에 착안했다.",
      "연구팀은 이번에 고안한 메타물질이 시간적으로 짧은 광신호에 대해서도 큰 비선형 효과를 얻을 수 있음을 통해 기존보다 효율적이면서도 더 빠른 광소자 구현이 가능함을 확인했다. 이 소자는 비슷한 신호 시간을 가지는 기존 소자보다 에너지 효율이 약 8배 뛰어나고, 비슷한 에너지 효율을 가지는 기존 소자보다도 신호 시간은 약 10배 정도 짧다.",
      "신종화 교수는 \"레이저의 발명이 '센 빛'을 최초로 만든 것이라면 이번 연구성과는 '센 물질', 즉 광대역에서 매우 큰 유전분극 증대율을 보이는 물질을 최초로 발견하고 증명한 연구라는 점에서 의미가 크다\"며 \"기계학습을 위한 초고속 인공 신경망 등 다양한 광 응용 소자의 구현을 위해 후속 연구를 진행하고 있다\"고 말했다.",
      "KAIST 신소재공학과 장태용 박사과정이 제1저자로 참여한 이번 연구는 국제 학술지 '커뮤니케이션즈 피직스(Communications Physics)'에 게재됐다.",
    ],
  },
];
