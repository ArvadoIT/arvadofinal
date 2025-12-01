"use client";

import Lenis from "lenis";
import { useEffect } from "react";

type LenisInstance = InstanceType<typeof Lenis>;

const SCROLL_OFFSET = -96;

function focusTarget(element: HTMLElement) {
  if (!element) return;
  const previousTabIndex = element.getAttribute("tabindex");

  if (previousTabIndex === null) {
    element.setAttribute("tabindex", "-1");
  }

  element.focus({ preventScroll: true });

  if (previousTabIndex === null) {
    element.removeAttribute("tabindex");
  }
}

function scrollToHash(lenis: LenisInstance, hash: string, behaviour: "instant" | "smooth" = "smooth") {
  if (!hash || hash === "#") return;
  const targetId = decodeURIComponent(hash.replace("#", ""));
  const target = document.getElementById(targetId);
  if (!target) return;

  const options =
    behaviour === "instant"
      ? { offset: SCROLL_OFFSET, immediate: true }
      : { offset: SCROLL_OFFSET, duration: 0.9, easing: (t: number) => 1 - Math.pow(1 - t, 3) };

  lenis.scrollTo(target, options);
  if (behaviour !== "instant") {
    window.history.pushState(null, "", `#${targetId}`);
    requestAnimationFrame(() => focusTarget(target));
  }
}

// Global Lenis instance for scroll control
let lenisInstance: LenisInstance | null = null;

export function getLenisInstance(): LenisInstance | null {
  return lenisInstance;
}

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // Defer Lenis initialization significantly to reduce initial load lag
    const initTimer = setTimeout(() => {
      const lenis = new Lenis({
        lerp: 0.12, // Slightly higher lerp for better performance
        smoothWheel: true,
        duration: 1.0, // Reduced duration for snappier feel
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.8, // Reduced for better performance
        touchMultiplier: 1.5, // Reduced for better performance
        infinite: false, // Disable infinite scroll for performance
        syncTouch: false, // Disable touch sync for better performance
      });

      lenisInstance = lenis;

      // Ensure we start at the top when Lenis initializes
      lenis.scrollTo(0, { immediate: true });

      let frame: number;
      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);

      const handleAnchorClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;
        const anchor = target.closest<HTMLAnchorElement>("a[href^='#']");
        if (!anchor || anchor.hasAttribute("data-lenis-ignore")) return;

        const hash = anchor.getAttribute("href");
        if (!hash || hash === "#" || hash.length < 2) return;

        const destination = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!destination) return;

        event.preventDefault();
        scrollToHash(lenis, hash, "smooth");
      };

      const handleHashChange = () => {
        scrollToHash(lenis, window.location.hash, "smooth");
      };

      document.addEventListener("click", handleAnchorClick);
      window.addEventListener("hashchange", handleHashChange);

      if (window.location.hash) {
        requestAnimationFrame(() => scrollToHash(lenis, window.location.hash, "instant"));
      }

      return () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("click", handleAnchorClick);
        window.removeEventListener("hashchange", handleHashChange);
        lenis.destroy();
        lenisInstance = null;
      };
    }, 500); // 500ms delay to allow initial render to complete

    return () => {
      clearTimeout(initTimer);
    };
  }, [enabled]);
}

