const root = document.documentElement;
root.classList.add('js');

const menuButton = document.querySelector('.menu-btn');
const mobilePanel = document.querySelector('#mobile-panel');

if (menuButton && mobilePanel) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobilePanel.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  mobilePanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobilePanel.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('inview'));
}

const barGroups = document.querySelectorAll('[data-bars]');
if ('IntersectionObserver' in window && !reducedMotion) {
  const barsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
        barsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  barGroups.forEach((group) => barsObserver.observe(group));
} else {
  barGroups.forEach((group) => group.classList.add('inview'));
}

const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && navLinks.length) {
  const activeObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.6] });

  sections.forEach((section) => activeObserver.observe(section));
}

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !mobilePanel || !menuButton) return;
  if (!mobilePanel.classList.contains('open')) return;
  mobilePanel.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.focus();
});
