// Home's "Applications" cards — hover/focus already reveal the glass
// drawer via pure CSS (:hover/:focus-visible in styles.css); this only
// covers what CSS can't: a tap-to-toggle fallback on touch (no :hover to
// rely on there) and the same scroll-in-view reveal as .news-card/
// .research-card.
(function () {
  const cards = document.querySelectorAll(".application-card");
  if (!cards.length) return;

  const isTouch = window.matchMedia("(hover: none)").matches;
  if (isTouch) {
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const wasOpen = card.classList.contains("is-open");
        cards.forEach((c) => c.classList.remove("is-open"));
        if (!wasOpen) card.classList.add("is-open");
      });
    });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 80}ms`;
    revealObserver.observe(card);
  });
})();
