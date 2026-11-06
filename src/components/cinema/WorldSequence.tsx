import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Shot } from "@/lib/site-data";

/** Published project frames form a single scroll-linked environment. */
export function WorldSequence({ shots, onOpen }: { shots: Shot[]; onOpen: (shot: Shot) => void }) {
  const frames = [shots[1], shots[4], shots[2]].filter((shot): shot is Shot => Boolean(shot));
  if (!frames.length) return null;
  return (
    <section className="world-sequence" data-world aria-label="Inside Konnect Us">
      <div className="world-stage">
        {frames.map((shot, i) => (
          <div className="world-layer" data-world-layer key={shot.src}>
            <img src={shot.src} alt={shot.caption} loading="lazy" />
            <div className="world-shade" />
            <div className="world-caption">
              <span className="world-index">0{i + 1} / 0{frames.length} — KONNECT US</span>
              <h2>{["STAY A", "GET", "FIND YOUR"][i]}<br /><em>{["little longer.", "lost together.", "own corner."][i]}</em></h2>
              <div className="world-caption-foot"><p>{shot.caption}</p><Button variant="ghost" size="icon" aria-label={`Explore ${shot.caption}`} onClick={() => onOpen(shot)}><ArrowUpRight /></Button></div>
            </div>
          </div>
        ))}
        <div className="world-progress" aria-hidden="true"><span data-world-progress /></div>
      </div>
    </section>
  );
}