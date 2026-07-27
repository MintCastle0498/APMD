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
    images: [{ src: "News_Example.png", alt: "야누스 메타표면 개발" }],
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
    title: "META 학회 참석",
    tag: "conference",
    people: ["APMD"],
    date: "2024-07-15",
    images: [{ src: "News/240715_Meta학회.jpg", alt: "META 학회 참석" }],
    excerpt: "META 학회에 참석했습니다.",
    body: ["META 학회에 참석했습니다."],
  },
  {
    id: "jo-mingwan-2024",
    // Placeholder: only the photos and the date/name are known — fill in
    // what this was actually about (award? send-off? milestone?).
    title: "조민관 선배 (설명 추가 필요)",
    tag: "event",
    people: ["조민관"],
    date: "2024-07-16",
    images: [
      { src: "News/240716_조민관선배(1).jpg", alt: "조민관 선배" },
      { src: "News/240716_조민관선배(2).png", alt: "조민관 선배" },
    ],
    excerpt: "사진 설명을 추가해 주세요.",
    body: ["사진 설명을 추가해 주세요."],
  },
  {
    id: "kim-hyeonhee-2024",
    title: "김현희 선배 (설명 추가 필요)",
    tag: "event",
    people: ["김현희"],
    date: "2024-07-25",
    images: [{ src: "News/240725_김현희선배.jpg", alt: "김현희 선배" }],
    excerpt: "사진 설명을 추가해 주세요.",
    body: ["사진 설명을 추가해 주세요."],
  },
  {
    id: "cleo-2024",
    title: "CLEO 학회 참석",
    tag: "conference",
    people: ["APMD"],
    date: "2024-08-15",
    images: [{ src: "News/240815_CLEO학회.jpg", alt: "CLEO 학회 참석" }],
    excerpt: "CLEO 학회에 참석했습니다.",
    body: ["CLEO 학회에 참석했습니다."],
  },
  {
    id: "lee-minyeul-2025",
    title: "이민열 선배 (설명 추가 필요)",
    tag: "event",
    people: ["이민열"],
    date: "2025-02-14",
    images: [{ src: "News/250214_이민열 선배.jpg", alt: "이민열 선배" }],
    excerpt: "사진 설명을 추가해 주세요.",
    body: ["사진 설명을 추가해 주세요."],
  },
  {
    id: "hwang-jisung-2026",
    title: "황지성 선배 (설명 추가 필요)",
    tag: "event",
    people: ["황지성"],
    date: "2026-05-27",
    images: [{ src: "News/260527_황지성선배.jpg", alt: "황지성 선배" }],
    excerpt: "사진 설명을 추가해 주세요.",
    body: ["사진 설명을 추가해 주세요."],
  },
  {
    id: "optics-society-2026",
    title: "광학회 참석",
    tag: "conference",
    people: ["APMD"],
    date: "2026-07-19",
    images: [
      { src: "News/260719_광학회.jpg", alt: "광학회 참석", credit: "APMD Lab" },
      { src: "News/260719_광학회2.jpg", alt: "광학회 참석", credit: "APMD Lab" },
    ],
    excerpt: "광학회에 참석했습니다.",
    body: ["광학회에 참석했습니다."],
  },
  {
    id: "kim-hyeonhee-2026",
    title: "김현희 선배 (설명 추가 필요)",
    tag: "event",
    people: ["김현희"],
    date: "2026-07-21",
    images: [{ src: "News/260721_김현희선배.JPG", alt: "김현희 선배" }],
    excerpt: "사진 설명을 추가해 주세요.",
    body: ["사진 설명을 추가해 주세요."],
  },
  {
    id: "lab-gathering-2026-07-21",
    // Placeholder: six photos shared the same day/batch (KakaoTalk export),
    // which strongly suggests one shared event — but what it actually was
    // isn't known from the filenames alone.
    title: "연구실 행사 (설명 추가 필요)",
    tag: "event",
    people: ["APMD"],
    date: "2026-07-21",
    images: [
      { src: "News/KakaoTalk_20260721_173124903.jpg", alt: "연구실 행사" },
      { src: "News/KakaoTalk_20260721_173126030.jpg", alt: "연구실 행사" },
      { src: "News/KakaoTalk_20260721_173127345.jpg", alt: "연구실 행사" },
      { src: "News/KakaoTalk_20260721_173128528.jpg", alt: "연구실 행사" },
      { src: "News/KakaoTalk_20260721_173129758.jpg", alt: "연구실 행사" },
      { src: "News/KakaoTalk_20260721_173131297.jpg", alt: "연구실 행사" },
    ],
    excerpt: "사진 설명을 추가해 주세요.",
    body: ["사진 설명을 추가해 주세요."],
  },
];
