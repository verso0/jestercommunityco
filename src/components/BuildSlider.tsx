import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export type Slide = { src: string; caption: string; description: string; tag: string };

export function BuildSlider({ slides, onOpen }: { slides: Slide[]; onOpen: (s: Slide) => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const count = slides.length;
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(t);
  }, [paused, count]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(index + 1); if (e.key === "ArrowLeft") go(index - 1); }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Konnect Us builds"
    >
      <div
        className="overflow-hidden rounded-2xl glass p-2"
        onPointerDown={(e) => { startX.current = e.clientX; }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
          startX.current = null;
        }}
      >
        <div className="flex transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((s, i) => (
            <div key={s.src} className="relative w-full shrink-0" aria-hidden={i !== index}>
              <button onClick={() => onOpen(s)} className="group relative block w-full overflow-hidden rounded-xl" aria-label={`Open ${s.caption}`} tabIndex={i === index ? 0 : -1}>
                <img src={s.src} alt={s.caption} loading="lazy" draggable={false}
                  className={`aspect-video w-full bg-background object-contain transition duration-[1200ms] ${i === index ? "scale-100 opacity-100" : "scale-110 opacity-40"}`} />
                <span className="absolute inset-0 flex items-center justify-center text-transparent transition group-hover:bg-background/30 group-hover:text-neon"><ZoomIn size={40} /></span>
              </button>
              <div className={`px-4 py-4 transition-all duration-700 ${i === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.tag === "BEFORE" ? "bg-amber/15 text-amber" : "bg-neon/15 text-neon"}`}>{s.tag}</span>
                <p className="mt-2 font-bold">{s.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => go(index - 1)} aria-label="Previous build" className="glass absolute left-3 top-[40%] rounded-full p-3 hover:text-neon"><ChevronLeft /></button>
      <button onClick={() => go(index + 1)} aria-label="Next build" className="glass absolute right-3 top-[40%] rounded-full p-3 hover:text-neon"><ChevronRight /></button>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {slides.map((s, i) => (
          <button key={s.src} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-neon" : "w-2.5 bg-muted"}`} />
        ))}
      </div>
    </div>
  );
}
