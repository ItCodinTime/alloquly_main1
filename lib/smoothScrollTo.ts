const defaultDuration = 1200;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function smoothScrollTo(hash: string, duration = defaultDuration) {
  if (typeof window === "undefined") return;
  if (!hash.startsWith("#")) return;
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;

  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    window.scrollTo({ top: startY + distance * eased, left: 0, behavior: "auto" });
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
