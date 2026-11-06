import { useEffect, useRef, useState, type ReactNode } from "react";

/** Splits text into masked characters for [data-split] reveals. Screen readers get the plain text. */
export function Split({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span data-split={delay} className={`split notranslate ${className}`} translate="no" aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="split-word" aria-hidden="true">
          {[...word].map((c, ci) => <span key={ci} className="ch">{c}</span>)}
        </span>
      ))}
    </span>
  );
}

/** Words that light up one by one as you scroll. */
export function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p data-words className={className}>
      {text.split(" ").map((w, i) => <span key={i} className="w">{w} </span>)}
    </p>
  );
}

export function Eyebrow({ children, n }: { children: ReactNode; n?: string }) {
  return (
    <p className="eyebrow">
      {n && <span className="eyebrow-n">{n}</span>}
      <span className="eyebrow-line" />
      {children}
    </p>
  );
}

/** Loading screen tied to real image loading progress. */
export function Loader({ srcs, onDone }: { srcs: string[]; onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  useEffect(() => {
    let loaded = 0;
    const total = srcs.length || 1;
    const finish = () => {
      if (done.current) return;
      done.current = true;
      setPct(100);
      setTimeout(() => setLeaving(true), 350);
      setTimeout(onDone, 1250);
    };
    srcs.forEach((s) => {
      const img = new Image();
      img.onload = img.onerror = () => { loaded++; setPct(Math.round((loaded / total) * 100)); if (loaded >= total) finish(); };
      img.src = s;
    });
    const cap = setTimeout(finish, 6000); // never hold visitors hostage
    return () => clearTimeout(cap);
  }, [srcs, onDone]);
  return (
    <div className={`loader ${leaving ? "loader-out" : ""}`} role="status" aria-label={`Loading ${pct}%`}>
      <div className="loader-shutter loader-shutter-top" />
      <div className="loader-shutter loader-shutter-bottom" />
      <div className="loader-core">
        <p className="loader-tag">JESTER STUDIOS // SIGNAL {String(pct).padStart(3, "0")}</p>
        <h2 className="glitch-title loader-logo notranslate" data-text="JESTER">JESTER</h2>
        <div className="loader-bar"><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
        <p className="loader-tag">{pct < 100 ? "WAKING THE JESTER…" : "DON'T LOOK AWAY"}</p>
      </div>
    </div>
  );
}

/** Drag-to-compare: earlier build vs latest build. */
export function Compare({ before, after, label }: { before: string; after: string; label: string }) {
  const [v, setV] = useState(50);
  return (
    <div className="compare" style={{ ["--v" as string]: `${v}%` }}>
      <img src={after} alt={`${label} — after the updates`} loading="lazy" draggable={false} className="compare-img" />
      <img src={before} alt={`${label} — before the updates`} loading="lazy" draggable={false} className="compare-img compare-before" />
      <span className="compare-tag compare-tag-l">BEFORE</span>
      <span className="compare-tag compare-tag-r">AFTER</span>
      <span className="compare-handle" aria-hidden="true"><i>⟷</i></span>
      <input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} aria-label={`Compare ${label} before and after`} className="compare-range" />
    </div>
  );
}

/** Magnetic button: drifts toward the pointer, with a sliding fill. */
export function Magnetic({ href, children, variant = "solid" }: { href: string; children: ReactNode; variant?: "solid" | "ghost" }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const ext = href.startsWith("http");
  return (
    <a
      ref={ref}
      href={href}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noreferrer" : undefined}
      className={`mag-btn mag-${variant}`}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--mx", `${(e.clientX - r.left - r.width / 2) * 0.25}px`);
        ref.current!.style.setProperty("--my", `${(e.clientY - r.top - r.height / 2) * 0.35}px`);
      }}
      onPointerLeave={() => { ref.current!.style.setProperty("--mx", "0px"); ref.current!.style.setProperty("--my", "0px"); }}
    >
      <span className="mag-fill" aria-hidden="true" />
      <span className="mag-label">{children}</span>
    </a>
  );
}
