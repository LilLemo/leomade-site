"use client";

import { useEffect, useRef } from "react";

// A thin line that fills as the page is read.
export function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    let frame;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--read", max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const request = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", request); window.removeEventListener("resize", request); };
  }, []);
  return <div className="scrollProgress" ref={bar} aria-hidden="true" />;
}

// Blocks marked with data-reveal rise into place once. Without JS or with reduced motion, they are simply there.
export function RevealObserver() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      io.unobserve(entry.target);
    }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.height && rect.top < window.innerHeight) el.classList.add("revealed");
      else io.observe(el);
    });
    root.classList.add("revealReady");
    return () => { io.disconnect(); root.classList.remove("revealReady"); };
  }, []);
  return null;
}
