import { useEffect } from "react";

/**
 * One motion engine for the whole site. Elements opt in with data attributes:
 *  data-split      → child .ch spans rise in, staggered, when scrolled into view
 *  data-parallax=n → moves vertically at speed n while scrolling
 *  data-mask       → clip-path wipe reveal tied to scroll
 *  data-zoom       → image settles from 1.35x to 1x while scrolling
 *  data-words      → .w spans light up one by one as you scroll (pinned)
 *  data-count=n    → counts up to n
 *  data-hscroll    → pins the section and slides [data-track] sideways
 *  data-rise       → fades/slides up when it enters (children stagger with data-stagger)
 *  data-marquee=n  → slides horizontally with scroll at speed n
 */
export function useCinema(deps: unknown[] = []) {
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"), import("gsap/ScrollTrigger"), import("lenis"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let lenis: InstanceType<typeof Lenis> | null = null;
      const anchors: Array<{ anchor: HTMLAnchorElement; handler: (event: MouseEvent) => void }> = [];
      const tick = (t: number) => lenis?.raf(t * 1000);
      if (!reduce) {
        lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
          const handler = (e: MouseEvent) => {
            const id = a.getAttribute("href");
            if (!id) return;
            const el = id === "#" ? document.body : document.querySelector(id);
            if (!el) return;
            e.preventDefault();
            lenis?.scrollTo(el as HTMLElement, { offset: -70, duration: 1.6 });
          };
          a.addEventListener("click", handler);
          anchors.push({ anchor: a, handler });
        });
      }

      const ctx = gsap.context(() => {
        if (reduce) {
          gsap.set("[data-split] .ch, [data-rise], [data-rise] [data-stagger] > *", { opacity: 1, y: 0 });
          return;
        }
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          gsap.fromTo(el.querySelectorAll(".ch"), { yPercent: 115, rotate: 8, opacity: 0 }, {
            yPercent: 0, rotate: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.028,
            delay: Number(el.dataset['split']) || 0,
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          const kids = el.querySelectorAll("[data-stagger] > *");
          const targets = kids.length ? kids : [el];
          gsap.fromTo(targets, { y: 35, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const s = Number(el.dataset['parallax']) || 0.2;
          gsap.to(el, { yPercent: -100 * s, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-marquee]").forEach((el) => {
          const s = Number(el.dataset['marquee']) || 1;
          gsap.fromTo(el, { xPercent: s > 0 ? 0 : -30 }, { xPercent: s > 0 ? -30 : 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
          const dir = el.dataset['mask'];
          const from = dir === "left" ? "inset(0 100% 0 0)" : dir === "right" ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)";
          gsap.fromTo(el, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.out", duration: 1.4, scrollTrigger: { trigger: el, start: "top 85%" } });
        });
        gsap.utils.toArray<HTMLElement>("[data-zoom]").forEach((el) => {
          gsap.fromTo(el, { scale: 1.35 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const o = { v: 0 };
          gsap.to(o, { v: Number(el.dataset['count']), duration: 2.4, ease: "power3.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); }, scrollTrigger: { trigger: el, start: "top 85%" } });
        });
        gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
          gsap.fromTo(el.querySelectorAll(".w"), { opacity: 0.6 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 70%", scrub: true } });
        });
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
          gsap.utils.toArray<HTMLElement>("[data-world]").forEach((section) => {
            const layers = section.querySelectorAll<HTMLElement>("[data-world-layer]");
            if (layers.length < 2) return;
            gsap.set(layers, { zIndex: (i) => i + 1 });
            gsap.set(Array.from(layers).slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
            const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "+=180%", pin: true, scrub: 1, invalidateOnRefresh: true } });
            layers.forEach((layer, i) => {
              if (i > 0) timeline.to(layer, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" }, i);
              timeline.fromTo(layer.querySelector("img"), { scale: 1.08 }, { scale: 1, duration: 1.5, ease: "none" }, i);
            });
            timeline.fromTo(section.querySelector("[data-world-progress]"), { scaleX: 0 }, { scaleX: 1, duration: timeline.duration(), ease: "none" }, 0);
          });
          gsap.utils.toArray<HTMLElement>("[data-hscroll]").forEach((sec) => {
            const track = sec.querySelector<HTMLElement>("[data-track]");
            if (!track) return;
            const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
            const tween = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: sec, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 } });
            track.querySelectorAll<HTMLElement>("[data-hcard]").forEach((card) => {
              gsap.fromTo(card, { y: 24 }, { y: 0, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "left 65%", scrub: true } });
            });
          });
        });
        // Hero exit: layers drift apart as you scroll away
        const hero = document.querySelector<HTMLElement>("[data-hero]");
        if (hero) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
          tl.to("[data-hero-bg]", { yPercent: 12 }, 0)
            .to("[data-hero-title]", { yPercent: -15, opacity: 0 }, 0)
            .to("[data-hero-left]", { xPercent: -60, rotate: -14, opacity: 0 }, 0)
            .to("[data-hero-right]", { xPercent: 60, rotate: 14, opacity: 0 }, 0);
        }
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      cleanup = () => {
        window.removeEventListener("load", onLoad);
        ctx.revert();
        anchors.forEach(({ anchor, handler }) => anchor.removeEventListener("click", handler));
        gsap.ticker.remove(tick);
        lenis?.destroy();
      };
    })();
    return () => { cancelled = true; cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
