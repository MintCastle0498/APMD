// One entry per student/researcher. `category` is the only field that
// decides which People-page section a card files under — it must match one
// of the `data-people-grid` values in people.html (postdoc/phd/ms/integrated).
// `degrees` follows the same shape as the Professor's Past Degree rows.
//
// Real names/roles/photos below — admissionYear/admissionSeason/email/
// degrees are still the placeholder template values (unknown for now) and
// should be replaced with each person's real info once that's available.
const PEOPLE = [
  {
    category: "postdoc",
    photo: "People/Jung, Joonkyo.jpg",
    name: "Dr. Jung, Joonkyo",
    role: "Post Doc. Researcher",
    admissionYear: "2023",
    admissionSeason: "Fall",
    email: "kyo2531@kaist.ac.kr",
    degrees: [
      { label: "Ph.D.", major: "Materials Science and Engineering", university: "KAIST", year: "2023" },
      { label: "M.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2018" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "Yonsei University", year: "2016" },
    ],
  },
  {
    category: "postdoc",
    photo: "People/Cho, Mingwan.jpg",
    name: "Dr. Cho, Mingwan",
    role: "Post Doc. Researcher",
    admissionYear: "2025",
    admissionSeason: "Fall",
    email: "whalsrhks56@kaist.ac.kr",
    degrees: [
      { label: "Ph.D.", major: "Materials Science and Engineering", university: "KAIST", year: "2025" },
      { label: "M.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2019" },
      { label: "B.S.", major: "Chemical Engineering", university: "UNIST", year: "2017" },
    ],
  },
  {
    category: "postdoc",
    photo: "People/Kim, Hyeonhee.jpg",
    name: "Dr. Kim, Hyeonhee",
    role: "Post Doc. Researcher",
    admissionYear: "2026",
    admissionSeason: "Spring",
    email: "khh0106l@kaist.ac.kr",
    degrees: [
      { label: "Ph.D.", major: "Materials Science and Engineering", university: "KAIST", year: "2026" },
      { label: "M.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2022" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "Korea University", year: "2020" },
    ],
  },
  {
    category: "phd",
    photo: "People/Park, Hyeonjin.jpg",
    name: "Park, Hyeonjin",
    role: "Ph. D. Student",
    admissionYear: "2020",
    admissionSeason: "Spring",
    email: "phj1870@kaist.ac.kr",
    degrees: [
      { label: "M.S.", major: "Materials Science and Engineering", university: "APMD University", year: "2020" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2018" },
    ],
  },
  {
    category: "phd",
    photo: "People/Park, Junhyung.jpg",
    name: "Park, Junhyung",
    role: "Ph. D. Student",
    admissionYear: "2021",
    admissionSeason: "Spring",
    email: "ekdldkqkr@kaist.ac.kr",
    degrees: [
      { label: "M.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2021" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "Yonsei University", year: "2019" },
    ],
  },
  {
    category: "phd",
    photo: "People/Lee, Minyeul.jpg",
    name: "Lee, Minyeul",
    role: "Ph. D. Student",
    admissionYear: "2023",
    admissionSeason: "Spring",
    email: "min6660656@kaist.ac.kr",
    degrees: [
      { label: "M.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2023" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2021" },
    ],
  },
  {
    category: "phd",
    photo: "People/Hyeong, Yun.jpg",
    name: "Hyeong, Yun",
    role: "Ph. D. Student",
    admissionYear: "2024",
    admissionSeason: "Spring",
    email: "j_hy@kaist.ac.kr",
    degrees: [
      { label: "M.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2023" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "Yonsei University", year: "2021" },
    ],
  },
  {
    category: "phd",
    photo: "People/Hwang, Jisung.jpg",
    name: "Hwang, Jisung",
    role: "Ph. D. Student",
    admissionYear: "2024",
    admissionSeason: "Spring",
    email: "wirevine@kaist.ac.kr",
    degrees: [
      { label: "M.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2024" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2022", note: "Double Major in Electrical Engineering, Minor in Physics" },
    ],
  },
  {
    category: "phd",
    photo: "People/Lee, Seungchul.jpg",
    name: "Lee, Seungchul",
    role: "Ph. D. Student",
    admissionYear: "2024",
    admissionSeason: "Fall",
    email: "sclee@kaist.ac.kr",
    degrees: [
      { label: "M.S.", major: "Materials Science and Engineering", university: "GIST", year: "2020" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "GIST", year: "2018" },
    ],
  },
  {
    category: "phd",
    photo: "People/Noh, Changgyun.jpg",
    name: "Noh, Changgyun",
    role: "Ph. D. Student",
    admissionYear: "2025",
    admissionSeason: "Spring",
    email: "noh980331@kaist.ac.kr",
    degrees: [
      { label: "M.S.", major: "Materials Science and Engineering", university: "APMD University", year: "2025" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "Ajou University", year: "2023" },
    ],
  },
  {
    category: "phd",
    photo: "People/Kim, Minki.jpg",
    name: "Kim, Minki",
    role: "Ph. D. Student",
    admissionYear: "2026",
    admissionSeason: "Fall",
    email: "minki99@kaist.ac.kr",
    degrees: [
      { label: "M.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2026" },
      { label: "B.S.", major: "Materials Science and Engineering", university: "Korea University", year: "2024" },
    ],
  },
  {
    category: "ms",
    photo: "People/Kim, Jongmin.jpg",
    name: "Kim, Jongmin",
    role: "M.S. Student",
    admissionYear: "2025",
    admissionSeason: "Spring",
    email: "kjm272@kaist.ac.kr",
    degrees: [
      { label: "B.S.", major: "Materials Science and Engineering", university: "Hanyang University", year: "2025" },
    ],
  },
  {
    category: "ms",
    photo: "People/Choi, Sung min.jpg",
    name: "Choi, Sungmin",
    role: "M.S. Student",
    admissionYear: "2026",
    admissionSeason: "Spring",
    email: "choism0498@kaist.ac.kr",
    degrees: [
      { label: "B.S.", major: "Materials Science and Engineering", university: "KAIST", year: "2026", note: "Double Major in Industrial Design" },
    ],
  },
  {
    category: "integrated",
    photo: "People/Kim, Dohyun.jpg",
    name: "Kim, Dohyun",
    role: "M.S. - Ph. D. Student",
    admissionYear: "2025",
    admissionSeason: "Spring",
    email: "photonics@kaist.ac.kr",
    degrees: [
      { label: "B.S.", major: "Physics", university: "Inha University", year: "2024" },
    ],
  },
];

// Alumni cards are just 2-3 lines of text (name / program+year / current
// position) — no photo, no hover-expand. `season` and `current` are left
// "" where unknown — alumniCardMarkup (people-render.js) omits a field's
// row/span entirely rather than render an empty one (same pattern as the
// Staff cards' admissionYear/admissionSeason).
const ALUMNI = [
  { name: "Kim, Hyowook", program: "Ph.D.", year: "2018", season: "", current: "ASML" },
  { name: "Choe, Meensoo", program: "M.S.", year: "2015", season: "", current: "LG Innotek" },
  { name: "Chung, Kyungjae", program: "Post Doc.", year: "2014.03–2015.10", season: "", current: "Samsung Electronics" },
  { name: "Lee, Nayeon", program: "M.S.", year: "2016", season: "", current: "Apple" },
  { name: "Nam, Sanghyeon", program: "M.S.", year: "2016", season: "", current: "Samsung Electronics" },
  { name: "Kim, Juyoung", program: "Ph.D.", year: "2015", season: "", current: "Electronics and Telecommunications Research Institute (ETRI)" },
  { name: "Mun, Jeongho", program: "Ph.D.", year: "2016", season: "", current: "Samsung Electronics" },
  { name: "Park, Junha", program: "M.S.", year: "2018", season: "", current: "Applied Materials Korea" },
  { name: "Kang, Seokyoung", program: "M.S.", year: "2018", season: "", current: "SK Hynix" },
  { name: "Heo, Minsung", program: "Ph.D.", year: "2019", season: "", current: "Samsung Electronics" },
  { name: "Kim, Jonguk", program: "Ph.D.", year: "2019", season: "", current: "Samsung Electronics" },
  { name: "Kim, Reehyang", program: "Ph.D.", year: "2019", season: "", current: "Samsung Display" },
  { name: "Chang, Taeyong", program: "Ph.D.", year: "2021", season: "", current: "Postdoc, Nanyang Technological University" },
  { name: "Yun, Kyunsun", program: "M.S.", year: "2021", season: "", current: "LG Energy Solution" },
  { name: "Jeon, Suwan", program: "Ph.D.", year: "2022", season: "", current: "Korea Institute of Machinery and Materials (KIMM)" },
  { name: "Baucour, Arthur", program: "Ph.D.", year: "2023", season: "", current: "ASML" },
  { name: "Chang, Gunho", program: "M.S.", year: "2023", season: "", current: "Ph.D. Candidate, Seoul National University" },
  { name: "Kim, Nayoung", program: "Ph.D.", year: "2023", season: "", current: "Samsung Display" },
  { name: "Kim, Myungjoon", program: "Ph.D.", year: "2023", season: "", current: "Postdoc, Cornell University" },
  { name: "Harding, Joseph", program: "M.S.", year: "2024", season: "", current: "Samsung SDI" },
  { name: "Yerezhep, Bakytgul", program: "M.S.", year: "2024", season: "", current: "" },
  { name: "Yoon, Jeongbin", program: "M.S.", year: "2025", season: "", current: "Samsung Electronics" },
  { name: "Kang, Seungkyu", program: "Ph.D.", year: "2025", season: "", current: "Korea Electronics Technology Institute (KETI)" },
  { name: "Min, Seokhwan", program: "Ph.D.", year: "2025", season: "", current: "Postdoc, Cornell University" },
  { name: "Chen, Qiang", program: "Ph.D.", year: "2026", season: "", current: "Contemporary Amperex Technology (CATL)" },
];

// Staff cards reuse the student-card layout but render as static (no
// button, no hover payoff, no divider/extra info) — see staffCardMarkup in
// people-render.js. Leaving admissionYear/admissionSeason empty (as here)
// omits that row entirely instead of rendering an empty gap.
const STAFF = [
  {
    name: "김남희",
    photo: "assets/Staff_profile.svg",
    role: "Tel. 042 - 350 - 5314",
    admissionYear: "",
    admissionSeason: "",
  },
];
