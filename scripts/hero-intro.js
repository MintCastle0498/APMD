// Home hero intro: before the header/title/subtitle reveal, a burst of
// bright streaks flies in from off-screen, all around, and converges into
// a single point that tracks the real pointer live — every streak's
// transform/opacity is computed and written fresh each animation frame
// here, in JS, rather than via a CSS @keyframes animation. That's a
// deliberate choice, not a style preference: an earlier CSS-keyframe
// version had two real bugs traced back to letting CSS itself own the
// motion —
//
// 1. Each streak's resting position read the LIVE --spot-x/--spot-y
//    custom properties script.js's pointer-follow effect updates on every
//    pointermove. There's no property to animate a "resting position"
//    change with, so moving the mouse mid-intro snapped the whole
//    scattered formation to a new anchor instantly — it read as streaks
//    appearing and disappearing in place, not flying anywhere. The current
//    live-tracking below (see liveTargetX/Y) still ends up following the
//    pointer, but through a damped, per-frame lerp toward it — smooth
//    retargeting, not a snap — which is the actual difference.
// 2. A shared CSS `perspective` has its own vanishing point (its own
//    center, by default) independent of wherever each streak was actually
//    anchored — the "3D" depth scaling and the 2D convergence point
//    disagreed with each other instead of reinforcing the same motion,
//    which is why it didn't read as 3D at all. The fix is computing a
//    manual depth scale from the same per-frame progress value that also
//    drives position — position and depth literally can't disagree with
//    each other when one function computes both every frame.
//
// Gated on body.hero-intro (only index.html's <body> carries it — see its
// own comment there) so this never runs on any other page, and skipped
// entirely for reduced-motion/touch, the same convention script.js's own
// hero pointer effect uses.
const heroIntroRoot = document.querySelector('[data-hero-intro]');

if (heroIntroRoot && document.body.classList.contains('hero-intro')) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  const hero = document.querySelector('.hero');
  const heroContent = hero ? hero.querySelector('.hero__content') : null;
  const spotlight = hero ? hero.querySelector('.hero__spotlight') : null;
  // Lives OUTSIDE .site-header (a sibling, not a descendant — see its own
  // comment in styles.css), so it needs its own reference here rather than
  // coming along for free with anything scoped to the header.
  const logo = document.querySelector('.site-header__logo');

  // Reveals the header/title immediately via the same CSS classes the real
  // intro ends with — removing the lights container (rather than just
  // hiding it) keeps a bunch of finished, no-longer-animating elements out
  // of the DOM instead of lingering invisibly. Also drops the pointermove
  // listener below, so tracking the live target doesn't keep running
  // pointlessly after there's nothing left to converge, and clears the
  // inline opacity/filter step() was writing every frame so .hero__content/
  // .hero__spotlight/.site-header__logo fall back to their normal,
  // un-gated CSS afterward instead of staying stuck at whatever inline
  // value they last had.
  let onPointerMove = null;
  function finishIntro() {
    document.body.classList.add('hero-intro-ready');
    heroIntroRoot.remove();
    if (onPointerMove) window.removeEventListener('pointermove', onPointerMove);
    if (heroContent) {
      heroContent.style.removeProperty('opacity');
      heroContent.style.removeProperty('filter');
    }
    if (logo) {
      logo.style.removeProperty('opacity');
      logo.style.removeProperty('filter');
    }
    if (spotlight) spotlight.style.removeProperty('opacity');
  }

  if (reducedMotion || isTouch || !hero) {
    finishIntro();
  } else {
    const heroRect = hero.getBoundingClientRect();
    // Default convergence point — matches .hero__spotlight's own CSS
    // fallback (50%/40%) — used until (and smoothly blended away from,
    // see liveTargetX/Y below, once) a real pointermove reports where the
    // pointer actually is.
    const defaultX = heroRect.width * 0.5;
    const defaultY = heroRect.height * 0.4;

    // desired* is set directly, instantly, by the listener below — live,
    // un-smoothed, wherever the real pointer currently is. live* is what
    // every streak actually converges toward, and only ever moves a
    // fraction of the way toward desired* each frame (see the lerp in
    // step() below) — that damping is what turns "the pointer jumped" into
    // a smooth redirect instead of the snap the old version had.
    let desiredX = defaultX;
    let desiredY = defaultY;
    let liveX = defaultX;
    let liveY = defaultY;

    onPointerMove = (event) => {
      const r = hero.getBoundingClientRect();
      const px = event.clientX - r.left;
      const py = event.clientY - r.top;
      if (px < 0 || py < 0 || px > r.width || py > r.height) return;
      desiredX = px;
      desiredY = py;
    };
    window.addEventListener('pointermove', onPointerMove);

    // Star Wars hyperspace-jump amounts, not a sparse handful — enough to
    // actually fill the screen with streaks rather than read as a few
    // dozen isolated ones. Raised to 250 (was 180, then 150, briefly 200
    // before that) now that box-shadow is gone and sizeScale is capped at
    // a size that held up (see below) — those two were the real GPU cost,
    // not the count on its own.
    const LIGHT_COUNT = 250;
    // How close (in real screen pixels) a streak has to get to the live
    // target before it's fully cut — see distToTarget below.
    const DISAPPEAR_RADIUS = 30;
    // Brightness starts ramping down once a streak is this close, reaching
    // 0 exactly at DISAPPEAR_RADIUS — a visible dim-then-vanish, not an
    // instant cut with no brightness change beforehand.
    const FADE_START_RADIUS = 120;
    // Half the hero's own diagonal, not a flat guessed number — the
    // minimum radius at which EVERY direction (not just toward the
    // nearest edge) lands outside the hero's own box, on any aspect
    // ratio, is exactly half the diagonal. The random multiplier on top
    // pushes starts even further out, at varying distances, rather than
    // lining every streak up on one perfect circle.
    const halfDiagonal = Math.hypot(heroRect.width, heroRect.height) / 2;

    const lights = [];

    for (let i = 0; i < LIGHT_COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'hero__intro-light';
      // Thinner still, aiming at the reference photo (a classic hyperspace
      // starfield: crisp, thin, mostly-white radiating lines, not thick
      // colored bars) — set once here, independent of the per-frame scale
      // this file animates on top of.
      const widthPx = 3 + Math.random() * 3;
      const heightPx = 30 + Math.random() * 26;
      el.style.width = `${widthPx.toFixed(1)}px`;
      el.style.height = `${heightPx.toFixed(0)}px`;
      // Narrow warm-gold band (was a full 0–360 rainbow) — the reference
      // photo's streaks are essentially monochrome (white, a hint of
      // blue); styles.css's own low saturation on top of this keeps that
      // "almost white" read while still favoring the site's own warm
      // accent over literally switching to blue, which the reference is.
      el.style.setProperty('--hue', (40 + Math.random() * 20).toFixed(0));
      heroIntroRoot.appendChild(el);

      // Full circle (not flattened to the hero's own wide/short aspect —
      // the point of using half-diagonal as the radius floor is exactly
      // so every angle still lands off-screen without needing to squash
      // the circle to compensate), so streaks arrive from every direction
      // — corners included — using the whole screen, not a cluster near
      // the middle.
      const angle = Math.random() * Math.PI * 2;
      const radius = halfDiagonal * (1 + Math.random() * 0.7);
      const startX = defaultX + Math.cos(angle) * radius;
      const startY = defaultY + Math.sin(angle) * radius;

      lights.push({
        el,
        widthPx,
        heightPx,
        startX,
        startY,
        // Each light's own start is offset by its index times a fixed
        // stagger, plus a little randomness — a shared start would arrive
        // as one synchronized pulse; staggering is what actually reads as
        // "one by one" gathering in, per the original ask.
        delay: i * 10 + Math.random() * 16,
        // Longer than a short-range version's, since these now travel much
        // further (half the hero's diagonal or more) — the same duration
        // over a longer distance would have just read as faster, not more
        // dramatic. Shortened from 900-1750ms to 700-1350ms for overall
        // faster streaks.
        duration: 700 + Math.random() * 650,
        // Ease-IN-OUT exponent (see the eased formula in step() below) —
        // was a pure ease-IN (t^power, no deceleration ever), which kept
        // accelerating all the way to t=1. That made the final approach
        // the single fastest moment of the whole flight: real per-frame
        // distance-to-target could jump from "clearly still approaching"
        // to "already inside DISAPPEAR_RADIUS" in one frame, so the fade
        // read as "it reached the point, then vanished" instead of
        // "it slowed and faded before getting there." Mirroring the curve
        // to decelerate through the second half fixes both — slower final
        // approach reads as smoother motion, and gives the disappear
        // check several real frames inside the radius to actually be seen
        // fading, not just one.
        power: 1.6 + Math.random() * 1.8,
        prevX: startX,
        prevY: startY,
        done: false,
      });
    }

    let startTime = null;
    let remaining = lights.length;

    function step(now) {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;

      // Damped toward wherever the pointer actually is right now — a
      // fixed fraction of the remaining gap per frame, not the whole gap,
      // so a jump in desiredX/Y bends every streak's own path smoothly
      // rather than teleporting the target (and everything converging on
      // it) there instantly.
      liveX += (desiredX - liveX) * 0.06;
      liveY += (desiredY - liveY) * 0.06;

      // Overall convergence progress: the average of every individual
      // streak's own 0–1 progress (not-yet-started counts as 0) — this is
      // what the real spotlight and the title/subtitle fade-in below both
      // key off of, so "the point brightens" and "the text appears as it
      // brightens" are one continuous relationship, and the spotlight
      // itself is the only thing that visibly brightens — no separate
      // circle/glow shape fading in on top of it.
      let progressSum = 0;
      lights.forEach((light) => {
        const localT = (elapsed - light.delay) / light.duration;
        progressSum += Math.min(Math.max(localT, 0), 1);
      });
      const p = progressSum / lights.length;

      if (spotlight) spotlight.style.opacity = p.toFixed(3);

      // Doesn't start moving until the point is already 35% built up —
      // "the text gradually appears AS it brightens," not from the very
      // first, still-barely-visible streak. The logo uses this exact same
      // textP value (not its own separately-tuned one) specifically so it
      // reveals at the same pace as the title/subtitle, per the ask — both
      // are also slowed by the same CSS transition on top of this (see
      // styles.css), which is what actually makes the reveal read as slow
      // rather than however fast textP itself climbs.
      const textP = Math.min(Math.max((p - 0.35) / 0.65, 0), 1);
      if (heroContent) {
        heroContent.style.opacity = textP.toFixed(3);
        heroContent.style.filter = `blur(${((1 - textP) * 10).toFixed(1)}px)`;
      }
      if (logo) {
        logo.style.opacity = textP.toFixed(3);
        logo.style.filter = `blur(${((1 - textP) * 10).toFixed(1)}px)`;
      }

      lights.forEach((light) => {
        if (light.done) return;

        const localT = (elapsed - light.delay) / light.duration;
        // Hasn't started yet — stays at rest (opacity: 0 in styles.css),
        // nothing to compute or write this frame.
        if (localT < 0) return;

        const t = Math.min(localT, 1);
        // Symmetric ease-in-out: accelerates through the first half,
        // decelerates back down through the second — unlike a plain
        // t^power (see the comment on light.power above), this has its
        // speed peak in the MIDDLE of the flight and approaches zero
        // again as t -> 1, instead of peaking exactly at arrival.
        const eased =
          t < 0.5
            ? Math.pow(2 * t, light.power) / 2
            : 1 - Math.pow(2 * (1 - t), light.power) / 2;

        // Recomputed from the CURRENT live target every frame (not the
        // target at creation time) — this is what makes an in-flight
        // streak's own path visibly bend/redirect as the pointer moves,
        // rather than just its final destination differing. The target
        // itself IS the exact same pixel for every streak (see the
        // opacity fade-out below for how the "all colliding at one point"
        // look actually gets avoided — not by changing where they're
        // headed).
        const x = light.startX + (liveX - light.startX) * eased;
        const y = light.startY + (liveY - light.startY) * eased;

        // This frame's actual on-screen displacement — real, measured
        // motion, not a value assumed from the target angle at creation
        // time. Both the streak's rotation and its motion-blur stretch
        // below are driven by this, so a streak visually points and
        // elongates along wherever it is ACTUALLY currently heading, even
        // while its target is still moving.
        const dx = x - light.prevX;
        const dy = y - light.prevY;
        const speed = Math.hypot(dx, dy);
        // Rotates the element's own default "points down" orientation to
        // face (dx, dy) instead — verified algebraically (rotate()'s
        // clockwise-in-a-Y-down-system matrix applied to the default
        // downward-pointing vector), not guessed. Falls back to facing the
        // target directly (liveX/Y - x/y) rather than a hardcoded 0 when
        // per-frame motion is too small to measure reliably — a fixed 0
        // (always "straight down") used to apply for a streak's first few
        // frames, which is also exactly when sizeScale is at its biggest;
        // a huge shape aimed the wrong way read as already reaching toward
        // the target immediately at spawn, before it had actually moved.
        const dtx = liveX - x;
        const dty = liveY - y;
        const angleDeg =
          (Math.atan2(-(speed > 0.05 ? dx : dtx), speed > 0.05 ? dy : dty) * 180) / Math.PI;

        // Big at the start, shrinking the whole way toward the target —
        // size just goes down monotonically as a streak approaches the
        // center. 20x and 10x both caused real stutter; 6x is the size
        // that held up (now with box-shadow removed too, see styles.css).
        const sizeScale = 6 - (6 - 0.1) * eased;
        // Motion-blur elongation, tied to this frame's REAL speed (capped)
        // rather than a fixed schedule — a streak that's barely moving yet
        // stays short; one that's screaming toward the target stretches
        // hard. Raised the cap (7 -> 12) and lowered the divisor (6 -> 5)
        // so streaks both reach their max stretch at a slightly lower
        // speed AND that max is a longer trail.
        const stretch = 1 + Math.min(speed / 5, 12);

        // Distance-based, not time/eased-based — those were tried earlier
        // and, with many overlapping streaks each already running blur +
        // a blend mode, a fade driven by time/eased read as "the overall
        // cluster is hazier," not as that specific streak visibly dimming.
        // A fade driven by real on-screen distance-to-target instead (here)
        // reads correctly because it's tied to the same geometry the
        // disappearance itself is tied to: brightness ramps down from
        // FADE_START_RADIUS to 0 exactly at DISAPPEAR_RADIUS, so a streak
        // visibly dims as it closes in rather than cutting instantly from
        // full brightness to gone.
        //
        // (x, y) is where the streak's LEADING TIP should be — the same
        // point this distance check tests — not its center. styles.css
        // pivots rotate()/scale() at the element's bottom-center (the
        // opaque, leading end of the gradient) instead of the default
        // center specifically so this holds regardless of how long a
        // streak has stretched: growing it via scale() only extends it
        // BACKWARD from that fixed pivot, never past it. The translate()
        // below still has to land that bottom-center pivot at (x, y)
        // itself, which means subtracting the pivot's own offset within
        // the untransformed box (half the width, and the FULL height,
        // since top:0/left:0 place the box's top-left — not its
        // bottom-center — at the local origin) before scale/rotate ever
        // apply.
        const distToTarget = Math.hypot(x - liveX, y - liveY);
        let opacity = t < 0.08 ? t / 0.08 : 1;
        const fade = Math.min(
          Math.max((distToTarget - DISAPPEAR_RADIUS) / (FADE_START_RADIUS - DISAPPEAR_RADIUS), 0),
          1
        );
        opacity = Math.min(opacity, fade);

        light.el.style.opacity = opacity;
        light.el.style.transform =
          `translate(${(x - light.widthPx / 2).toFixed(1)}px, ${(y - light.heightPx).toFixed(1)}px) ` +
          `rotate(${angleDeg.toFixed(1)}deg) ` +
          `scale(${sizeScale.toFixed(2)}, ${(sizeScale * stretch).toFixed(2)})`;

        light.prevX = x;
        light.prevY = y;

        if (t >= 1) {
          light.done = true;
          remaining -= 1;
          // Once the very last streak has actually arrived — tracked here
          // directly, not a separately hand-tuned timeout that could drift
          // out of sync with the real per-light delay/duration values above
          // — p is already at (or essentially at) 1 by this point, so the
          // spotlight/text are already at full opacity; this just hands
          // off to the header's own drop-in reveal after a beat.
          if (remaining === 0) {
            setTimeout(finishIntro, 150);
          }
        }
      });

      if (remaining > 0) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }
}
