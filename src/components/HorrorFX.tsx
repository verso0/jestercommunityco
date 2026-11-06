import { useEffect, useState } from "react";

/** Full-horror ambience: boot intro, film grain, random screen tears, cursor trail, watching eyes. */
export function HorrorFX() {
  const [intro, setIntro] = useState(false);
  const [tear, setTear] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!sessionStorage.getItem("jester-intro") && !reduce) {
      setIntro(true);
      sessionStorage.setItem("jester-intro", "1");
      setTimeout(() => setIntro(false), 2600);
    }
    if (reduce) return;

    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setTear(true);
        setTimeout(() => setTear(false), 260);
        schedule();
      }, 6000 + Math.random() * 9000);
    };
    schedule();

    const fine = window.matchMedia("(pointer: fine)").matches;
    let last = 0;
    const trail = (e: PointerEvent) => {
      const now = performance.now();
      if (!fine || now - last < 45) return;
      last = now;
      const d = document.createElement("span");
      d.className = "blood-trail";
      d.style.left = `${e.clientX}px`;
      d.style.top = `${e.clientY}px`;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 900);
    };
    window.addEventListener("pointermove", trail, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("pointermove", trail); };
  }, []);

  return (
    <>
      <div className="film-grain" aria-hidden="true" />
      {tear && <div className="screen-tear" aria-hidden="true" />}
      {intro && (
        <div className="boot-intro" aria-hidden="true">
          <div className="boot-inner">
            <p className="boot-line">&gt; SIGNAL FOUND</p>
            <p className="boot-line" style={{ animationDelay: ".4s" }}>&gt; WAKING THE JESTER...</p>
            <h2 className="glitch-title boot-logo" data-text="JESTER STUDIOS">JESTER STUDIOS</h2>
            <p className="boot-line" style={{ animationDelay: "1.1s" }}>&gt; DON'T LOOK AWAY</p>
          </div>
        </div>
      )}
    </>
  );
}

/** A pair of eyes that follow the mouse. */
export function WatchingEyes({ className = "" }: { className?: string }) {
  return (
    <div className={`watching-eyes ${className}`} aria-hidden="true">
      <span className="eye"><i /></span>
      <span className="eye"><i /></span>
    </div>
  );
}
