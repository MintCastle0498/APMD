document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('[data-nav]').forEach((link) => {
  if (link.getAttribute('href') === currentPage) {
    link.setAttribute('aria-current', 'page');
  }
});

const navToggle = document.querySelector('.site-header__toggle');
const siteNav = document.querySelector('.site-header__nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('[data-research-focus-toggle]').forEach((button) => {
  const section = button.closest('.professor__research-focus');
  button.addEventListener('click', () => {
    const isOpen = section.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

// Contact form's Professor/Lab manager buttons pick who the message goes
// to — a mutually exclusive pair (like radio buttons), not independent
// toggles, so selecting one always clears the other. The chosen button's
// own data-recipient value ("professor" / "lab-manager") is what the
// submit handler below looks up an access key for. Lab manager starts
// selected (see contact.html) — most messages are logistics, not
// research questions for the professor directly, so it's the more likely
// default rather than leaving nothing chosen.
const recipientButtons = document.querySelectorAll('[data-recipient]');
let selectedRecipient = 'lab-manager';

// The submit button's "Send message to <name>" — see its own comment in
// styles.css for why the slot's width is set here in JS rather than left
// to size itself: it needs to animate between the two names' (different)
// widths, not jump.
const recipientSlot = document.querySelector('[data-recipient-slot]');
const recipientNameEls = recipientSlot ? recipientSlot.querySelectorAll('[data-recipient-name]') : [];

function showRecipientName(recipient) {
  if (!recipientSlot) return;
  let activeEl = null;
  recipientNameEls.forEach((el) => {
    const isActive = el.dataset.recipientName === recipient;
    el.classList.toggle('is-active', isActive);
    if (isActive) activeEl = el;
  });
  if (activeEl) {
    recipientSlot.style.width = `${activeEl.scrollWidth}px`;
  }
}

showRecipientName(selectedRecipient);

recipientButtons.forEach((button) => {
  button.addEventListener('click', () => {
    recipientButtons.forEach((other) => {
      const isSelected = other === button;
      other.classList.toggle('is-selected', isSelected);
      other.setAttribute('aria-pressed', String(isSelected));
    });
    selectedRecipient = button.dataset.recipient;
    showRecipientName(selectedRecipient);
  });
});

// Actually sends the message — no backend of our own, so this posts
// straight to Web3Forms (https://web3forms.com), a third-party form-relay
// service: you give it an "access key" tied to one destination inbox, it
// emails that inbox on your behalf. Two keys because Professor and Lab
// manager are two different real inboxes — one access key per destination.
//
// Lab manager has its own real inbox's key now. Professor is still the
// TEMPORARY placeholder key, shared with the old testing setup, until
// the Professor's own key (gotten the same way, at https://web3forms.com/)
// replaces it too.
const WEB3FORMS_ACCESS_KEYS = {
  professor: 'c56435ba-d755-4759-989b-391c689dec46',
  'lab-manager': 'fba3896b-53b9-4add-9e77-b6d48f31d9e6',
};

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const statusEl = contactForm.querySelector('[data-contact-status]');
  const submitButton = contactForm.querySelector('.contact-form__button--submit');

  function setStatus(message, kind) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.state = kind || '';
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    if (!selectedRecipient) {
      setStatus('Please choose Professor or Lab manager first.', 'error');
      return;
    }

    const accessKey = WEB3FORMS_ACCESS_KEYS[selectedRecipient];
    if (!accessKey || accessKey.startsWith('REPLACE_WITH_')) {
      setStatus('This form isn’t connected to a real inbox yet. See script.js.', 'error');
      return;
    }

    const formData = new FormData(contactForm);
    const payload = {
      access_key: accessKey,
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      subject: `[Lab Contact] ${formData.get('name')}`,
    };

    submitButton.disabled = true;
    setStatus('Sending…', 'sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        setStatus('Message sent. Thank you!', 'success');
        contactForm.reset();
        // Back to the same Lab manager default the form loads with,
        // not neither button selected — see the default's own comment
        // above.
        recipientButtons.forEach((button) => {
          const isSelected = button.dataset.recipient === 'lab-manager';
          button.classList.toggle('is-selected', isSelected);
          button.setAttribute('aria-pressed', String(isSelected));
        });
        selectedRecipient = 'lab-manager';
        showRecipientName(selectedRecipient);
      } else {
        setStatus('Something went wrong. Please try again.', 'error');
      }
    } catch (error) {
      setStatus('Network error. Please try again. (This may not work on the KAIST campus network.)', 'error');
    } finally {
      submitButton.disabled = false;
    }
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// No real pointer ever hovers a touch screen — every effect below that's
// keyed off pointermove/mouse position is pointless there (there's nothing
// to react to, it just sits frozen at its CSS resting default), and the
// scroll-linked parallax further down is a well-known source of visible
// jitter on mobile browsers specifically (their compositor scrolls the
// page on a separate thread from the one recalculating this transform, and
// the address bar hiding/showing mid-scroll keeps nudging the viewport
// height it's implicitly tied to) — skipping both here is the same
// "@media (hover: none)" convention styles.css already uses for the News
// carousel's touch-only fallbacks, just read from JS.
const isTouch = window.matchMedia('(hover: none)').matches;

// Home hero: a spotlight follows the pointer, and the title's text-shadow
// (several layers, see styles.css) is pushed away from it so the heading
// reads as lit type casting a long trail, not flat text with a soft blur.
// The text itself never moves (no transform on the title/content) — only
// the shadow shifts, and the spotlight glow.
//
// Listens on window (not the .hero element) so the effect doesn't cut out
// the moment the cursor crosses onto the fixed header — the header sits
// visually on top of the hero but is a separate element, so a listener
// scoped to .hero would fire 'pointerleave' the instant the pointer entered
// it. Instead every pointermove on the page is checked against the hero's
// own bounding box, and only cleared once the pointer is truly outside it
// (below the fold, off-screen, etc).
const hero = document.querySelector('.hero');
if (hero && !isTouch) {
  const heroTitle = hero.querySelector('.hero__title');
  const MAX_SHADOW = 22;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function clearHeroEffect() {
    hero.style.removeProperty('--spot-x');
    hero.style.removeProperty('--spot-y');
    hero.style.removeProperty('--shadow-x');
    hero.style.removeProperty('--shadow-y');
  }

  window.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      clearHeroEffect();
      return;
    }

    hero.style.setProperty('--spot-x', `${x}px`);
    hero.style.setProperty('--spot-y', `${y}px`);

    if (heroTitle) {
      const titleRect = heroTitle.getBoundingClientRect();
      const titleCenterX = titleRect.left + titleRect.width / 2 - rect.left;
      const titleCenterY = titleRect.top + titleRect.height / 2 - rect.top;
      const dx = clamp(((titleCenterX - x) / rect.width) * MAX_SHADOW * 2.4, -MAX_SHADOW, MAX_SHADOW);
      const dy = clamp(((titleCenterY - y) / rect.height) * MAX_SHADOW * 2.4, -MAX_SHADOW, MAX_SHADOW);
      hero.style.setProperty('--shadow-x', `${dx.toFixed(1)}px`);
      hero.style.setProperty('--shadow-y', `${dy.toFixed(1)}px`);
    }
  });

  document.documentElement.addEventListener('pointerleave', clearHeroEffect);
}

// The logo's A/M/D contrast is plain CSS now (.apmd-blend: white fill +
// mix-blend-mode: difference, see styles.css) — no JS involved. Difference-
// blending white against whatever's behind it IS its own inverse, so it
// reads dark on a light background and light on a dark one automatically,
// continuously, on every page, with no scroll listener or per-page markup
// needed to decide anything.
// Shared by every full-bleed hero (Home's .hero, Research's .research-hero
// — only one ever exists on a given page) so each gets the same "the
// sheet below scrolls at normal speed, the hero drags behind it" parallax,
// without duplicating this listener per page.
const parallaxHeroes = document.querySelectorAll('.hero, .research-hero');
if (parallaxHeroes.length && !reducedMotion && !isTouch) {
  const HERO_SCROLL_SPEED = 0.3; // hero's own parallax: 1 = normal page speed, lower drags more
  let ticking = false;

  function updateHeroParallax() {
    const offset = `translateY(${(window.scrollY * (1 - HERO_SCROLL_SPEED)).toFixed(1)}px)`;
    parallaxHeroes.forEach((el) => {
      el.style.transform = offset;
    });
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateHeroParallax);
      }
    },
    { passive: true }
  );
  updateHeroParallax();
}

// Real momentum ("flick and glide") wheel scrolling, the kind touch/trackpad
// devices already do natively: wheel input adds to a velocity rather than
// jumping the scroll position directly, and each frame the velocity is
// applied to the real scroll position and decays by friction — so it tracks
// input immediately while scrolling and keeps coasting, decelerating, once
// it stops. Skipped for prefers-reduced-motion and touch (touch already has
// native momentum; this only listens for 'wheel', which touch doesn't fire).
if (!reducedMotion) {
  const FRICTION = 0.92;
  const WHEEL_GAIN = 0.15;
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  let velocity = 0;
  let raf = null;

  function tick() {
    if (Math.abs(velocity) >= 0.05) {
      const before = document.documentElement.scrollTop;
      const next = Math.min(Math.max(before + velocity, 0), maxScroll());
      document.documentElement.scrollTop = next;
      if (next === before) velocity = 0; // hit the top/bottom
    }
    velocity *= FRICTION;
    if (Math.abs(velocity) < 0.05) {
      velocity = 0;
      raf = null;
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      velocity += Math.min(Math.max(event.deltaY, -100), 100) * WHEEL_GAIN;
      if (!raf) raf = requestAnimationFrame(tick);
    },
    { passive: false }
  );
}
