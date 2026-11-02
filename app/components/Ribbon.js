"use client";
import { useEffect, useRef } from "react";

// The words ribbon drifts on its own and picks up speed (and direction) from the page scroll.
export default function Ribbon() {
  const track = useRef(null);
  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.animation = "none";
    const BASE = 38; // px per second when idle
    let x = 0, boost = 0, last = performance.now(), lastY = window.scrollY, frame;
    const onScroll = () => {
      const y = window.scrollY, dy = y - lastY; lastY = y;
      boost = Math.max(-900, Math.min(900, boost + dy * 3.5));
    };
    const tick = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const period = el.firstChild ? el.firstChild.getBoundingClientRect().width : 0;
      const speed = BASE + boost;
      x -= speed * dt;
      if (period) { while (x <= -period) x += period; while (x > 0) x -= period; }
      boost *= Math.pow(.04, dt);
      const skew = Math.max(-6, Math.min(6, -boost / 170));
      el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, []);
  return <div className="curiosityRibbon" aria-hidden="true"><div ref={track}>{Array.from({ length: 4 }, (_, i) => <span key={i}>MADE WITH CURIOSITY <i>✳</i> MADE WITH CURIOSITY <i>✳</i> MADE WITH CURIOSITY <i>✳</i></span>)}</div></div>;
}
