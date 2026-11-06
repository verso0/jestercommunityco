import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Camera, Heart, Handshake, Coffee, Copy, Check, Hammer, X, ZoomIn } from "lucide-react";
import { useCinema } from "@/components/cinema/useCinema";
import { Compare, Eyebrow, Loader, Magnetic, Split, Words } from "@/components/cinema/parts";
import workShot1 from "@/assets/work-1.jpg.asset.json";
import workShot2 from "@/assets/work-2.jpg.asset.json";
import workShot3 from "@/assets/work-3.jpg.asset.json";
import workShot4 from "@/assets/work-4.jpg.asset.json";
import { HorrorFX, WatchingEyes } from "@/components/HorrorFX";
import avGroza from "@/assets/avatar-groza.jpg.asset.json";
import avBuddi from "@/assets/avatar-buddi.jpg.asset.json";
import avBlade from "@/assets/avatar-blade.jpg.asset.json";
import avBacan from "@/assets/avatar-bacan.jpg.asset.json";
import avVee from "@/assets/avatar-vee.jpg.asset.json";
import avHamza from "@/assets/avatar-hamza.jpg.asset.json";
import avNyxen from "@/assets/avatar-nyxen.jpg.asset.json";
import avVerso from "@/assets/avatar-verso.jpg.asset.json";
import avSam from "@/assets/avatar-sam.jpg.asset.json";
import avApril from "@/assets/avatar-april.jpg.asset.json";
import progressAfter1 from "@/assets/progress-after-full-1.jpg.asset.json";
import progressAfter2 from "@/assets/progress-after-full-2.jpg.asset.json";
import progressAfter3 from "@/assets/progress-after-full-3.jpg.asset.json";
import progressAfter4 from "@/assets/progress-after-full-4.jpg.asset.json";
import progressAfter5 from "@/assets/progress-after-full-5.jpg.asset.json";
import progressAfter6 from "@/assets/progress-after-full-6.jpg.asset.json";
import { Link } from "@tanstack/react-router";
import { useSiteData } from "@/lib/site-data";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const AVATARS: Record<string, string> = {
  GROZA: avGroza.url, BUDDI: avBuddi.url, BLADE: avBlade.url, BACAN: avBacan.url, VEE: avVee.url,
  HAMZA: avHamza.url, NYXEN: avNyxen.url, VERSO: avVerso.url, SAM: avSam.url, APRIL: avApril.url,
};

const DISCORD = "https://discord.gg/wXTNsqUJm";
const INSTAGRAM = "https://www.instagram.com/jestercommunity.co/";

const workShots = [
  {
    src: workShot1.url,
    caption: "Forest environment — terrain, foliage & props",
    description:
      "A quiet corner of a hand-shaped forest. Every tree, rock and patch of foliage is placed manually — no stock terrain. A resting bench with a warm cup of coffee waits under the canopy, showing how we layer small, personal props into big environments to make a world feel lived-in.",
  },
  {
    src: workShot2.url,
    caption: "Beachside café build — models & lighting",
    description:
      "A café built right on the shoreline. The building, furniture, counters and signage are all modeled from scratch in Roblox Studio, with custom lighting tuned for a warm, coastal evening mood. This is an example of how we approach complete, explorable buildings — not just decoration.",
  },
  {
    src: workShot3.url,
    caption: "Park detail — swing, lanterns & custom props",
    description:
      "A park scene focused on the little details: a swing set, hanging lanterns and custom props scattered through the greenery. Warm light pools around each lantern to guide the player's eye — this is the kind of atmosphere work we put into every playable area.",
  },
  {
    src: workShot4.url,
    caption: "Garden pavilion — modeling & atmosphere",
    description:
      "A garden pavilion surrounded by planted greenery, built to test how our models read in full scenes. The structure, plants and surrounding props are all custom — it's a small snapshot of the modeling and atmosphere pipeline behind our debut game.",
  },
];

const updatedProgressShots = [
  { src: progressAfter1.url, caption: "Updated woodland path — deeper atmosphere & lighting", description: "The updated woodland now uses denser foliage, richer shadows and carefully placed lantern light to turn a simple path and bench into a more immersive nighttime scene." },
  { src: progressAfter2.url, caption: "Cherry blossom campfire — a new social space", description: "A new gathering spot framed by glowing cherry trees, layered grass and warm firelight, where players can stop, meet and spend time together." },
  { src: progressAfter3.url, caption: "Garden pavilion — expanded and brought to life", description: "The pavilion area has been expanded with seating, curtains, flowers, string lights and a stronger garden composition, making the build feel more complete and ready to explore." },
  { src: progressAfter4.url, caption: "Romantic garden feature — new interactive detail", description: "This new floral arch and hanging seat add a memorable focal point. Custom flowers, decorative gifts and drifting petals give the area its own personality." },
  { src: progressAfter5.url, caption: "Forest scale update — larger trees and pathways", description: "The forest has gained much larger trees, clearer pathways and more varied lighting, making players feel surrounded by the environment rather than simply walking past it." },
  { src: progressAfter6.url, caption: "Finished park corner — lighting, seating & planting", description: "A polished park corner combines layered trees, flower beds, a bench and a strong lantern landmark, reflecting the latest pass on atmosphere and environmental detail." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jester Studios — Indie Roblox Game Development" },
      { name: "description", content: "Six independent creators building fresh, memorable Roblox worlds. Join the Discord, support, or invest in Jester Studios." },
      { property: "og:title", content: "Jester Studios — Playful Chaos. Serious Passion." },
      { property: "og:description", content: "Six independent creators building fresh, memorable Roblox worlds from the ground up." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type TeamMember = { name: string; role: string; bio: string; avatar?: string | null };

const founders: TeamMember[] = [
  { name: "VERSO", role: "FOUNDER", bio: "Crafts models with obsessive detail by day, keeps the community smiling by night. The friendly bridge between the studio and its players." },
  { name: "NYXEN", role: "FOUNDER", bio: "Keeps everyone organized and on schedule, then jumps straight into modeling. The planner with an artist's eye for worlds that beg to be explored." },
  { name: "BUDDI", role: "FOUNDER", bio: "Defines the look of everything — shapes, colors, style. A perfectionist who won't ship a model until it feels exactly right." },
  { name: "GROZA", role: "FOUNDER", bio: "Keeps the community safe, fair, and fun. Calm, sharp, and always paying attention — the guardian of the vibes." },
  { name: "VEE", role: "FOUNDER", bio: "Helped start the studio and still shapes how the world sees it. Creative, quick, and always thinking about the next big moment for Jester Studios." },
];

const developers: TeamMember[] = [
  { name: "VEE", role: "DEVELOPER/CINEMATOGRAPHER/EDITOR", bio: "Builds alongside the team, frames the world through the camera, then cuts it all together — making sure every scene looks as good in-game as it does in the edit." },
  { name: "VERSO", role: "DEVELOPER/MAP DESIGNER/SCRIPTER/GUI DESIGNER", bio: "Touches every layer of the game — builds the map, writes scripts, and designs the menus you click. The all-rounder who turns ideas into playable reality." },
  { name: "NYXEN", role: "DEVELOPER/MANAGER", bio: "Codes features by day and keeps the whole crew on schedule by night. The organized mind that turns chaos into deadlines met." },
  { name: "BUDDI", role: "DEVELOPER/MAP DESIGNER/3D MODEL DESIGNER", bio: "Shapes the world in 3D — designs the map and models every corner of it. A perfectionist who won't ship a scene until it feels exactly right." },
  { name: "GROZA", role: "MODERATOR", bio: "Keeps the community safe, fair, and fun. Calm, sharp, and always paying attention — the guardian of the vibes." },
];

const socialTeam: TeamMember[] = [
  { name: "VEE", role: "SOCIAL MEDIA/DEVELOPER/CINEMATOGRAPHER/EDITOR", bio: "Shoots the cinematics, edits the clips and shares them with the world — the eye behind how Jester Studios looks online." },
  { name: "GROZA", role: "SOCIAL MEDIA MANAGER", bio: "Runs the posts, the hype and the community chats. Calm, sharp and always online — the voice that keeps players in the loop." },
];

const collaborators: TeamMember[] = [
  { name: "BACAN", role: "SCRIPTER", bio: "Scripting muscle from Angoor Studios. Builds the systems behind the scenes and makes sure every mechanic feels snappy." },
  { name: "BLADE", role: "SCRIPTER", bio: "Also from Angoor Studios. A scripter who loves clean logic and smooth gameplay — if it breaks, Blade has already fixed it." },
  { name: "SAM", role: "3D MODELER", bio: "The modeler from Angoor Studios. Shapes props and scenes with care, bringing extra polish to every corner of our worlds." },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} title="Copy" aria-label={`Copy ${value}`}
      className="shrink-0 rounded-lg border border-border p-2 text-muted-foreground transition hover:border-neon hover:text-neon">
      {copied ? <Check size={16} className="text-neon" /> : <Copy size={16} />}
    </button>
  );
}

function Lightbox({ shot, onClose }: { shot: (typeof workShots)[number]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4 backdrop-blur-md sm:p-8" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="lightbox-card glass relative max-h-full w-full max-w-4xl overflow-y-auto rounded-2xl border border-neon/30 p-3 shadow-[0_0_60px_-10px_var(--neon)] sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close picture" className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background/80 p-2 text-muted-foreground transition hover:border-neon hover:text-neon">
          <X size={18} />
        </button>
        <img src={shot.src} alt={shot.caption} className="w-full rounded-xl object-contain" />
        <div className="px-2 pb-2 pt-4 sm:px-3">
          <p className="flex items-center gap-2 font-bold text-neon"><Hammer size={15} className="shrink-0" /> {shot.caption}</p>
          <p className="mt-3 text-muted-foreground">{shot.description}</p>
        </div>
      </div>
    </div>
  );
}

function JesterCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursor.dataset["visible"] = "true";

        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        document.documentElement.style.setProperty("--mouse-x", `${x}`);
        document.documentElement.style.setProperty("--mouse-y", `${y}`);
        document.documentElement.style.setProperty("--px", `${event.clientX}px`);
        document.documentElement.style.setProperty("--py", `${event.clientY}px`);
      });
    };
    const hide = () => { cursor.dataset["visible"] = "false"; };
    const show = () => { cursor.dataset["visible"] = "true"; };

    const burst = (event: PointerEvent) => {
      for (let k = 0; k < 8; k++) {
        const p = document.createElement("span");
        p.className = "click-spark";
        p.textContent = ["✦", "★", "♦", "🃏"][k % 4] ?? "✦";
        p.style.left = `${event.clientX}px`;
        p.style.top = `${event.clientY}px`;
        const a = (k / 8) * Math.PI * 2;
        p.style.setProperty("--dx", `${Math.cos(a) * 60}px`);
        p.style.setProperty("--dy", `${Math.sin(a) * 60}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 700);
      }
    };
    window.addEventListener("pointerdown", burst);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", burst);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
    };
  }, []);

  return <div ref={cursorRef} className="jester-cursor" aria-hidden="true"><span>🃏</span></div>;
}

function TarotCard({ m, i, total }: { m: TeamMember; i: number; total: number }) {
  const src = m.avatar ?? AVATARS[m.name];
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="tarot"
      style={{ ["--i" as string]: i }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -14}deg`);
        ref.current!.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
        ref.current!.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        ref.current!.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      onPointerLeave={() => { ref.current!.style.setProperty("--rx", "0deg"); ref.current!.style.setProperty("--ry", "0deg"); }}
    >
      <div className="tarot-inner">
        <span className="tarot-num">{toRoman(i + 1)} / {toRoman(total)}</span>
        <div className="tarot-portrait">
          {src ? <img src={src} alt={`${m.name} avatar`} loading="lazy" /> : <span className="text-5xl">🃏</span>}
          <span className="tarot-scan" aria-hidden="true" />
        </div>
        <h3 className="tarot-name glitch-title" data-text={m.name}>{m.name}</h3>
        <p className="tarot-role">{m.role.split("/").join(" · ")}</p>
        <p className="tarot-bio">{m.bio}</p>
        <span className="tarot-glare" aria-hidden="true" />
      </div>
    </div>
  );
}

function toRoman(n: number) {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n - 1] ?? String(n);
}

function Deck({ title, n, members }: { title: string; n: string; members: TeamMember[] }) {
  return (
    <div className="deck">
      <div className="deck-head" data-rise>
        <span className="deck-n">{n}</span>
        <h3 className="deck-title">{title}</h3>
        <span className="deck-count">{String(members.length).padStart(2, "0")} CARDS</span>
      </div>
      <div className="deck-row" data-rise><div data-stagger className="deck-grid">
        {members.map((m, i) => <TarotCard key={`${title}-${m.name}`} m={m} i={i} total={members.length} />)}
      </div></div>
    </div>
  );
}

function Index() {
  const [openShot, setOpenShot] = useState<(typeof workShots)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: site } = useSiteData();
  const { user, isAdmin } = useAuth();
  const text = (k: string, d: string) => site?.content[k] ?? d;
  const beforeShots = site?.before.length ? site.before : workShots;
  const afterShots = site?.after.length ? site.after : updatedProgressShots;
  const pct = Math.max(0, Math.min(100, Number.parseInt(text("progress_percent", "98"), 10) || 98));
  const team = {
    founders: site?.team.founders.length ? site.team.founders : founders,
    developers: site?.team.developers.length ? site.team.developers : developers,
    social: site?.team.social.length ? site.team.social : socialTeam,
    collaborators: site?.team.collaborators.length ? site.team.collaborators : collaborators,
  };
  const videoSlots = [
    { slot: "teaser1", title: "Teaser 1", description: "", videoUrl: null, thumbUrl: null, published: false },
    { slot: "teaser2", title: "Teaser 2", description: "", videoUrl: null, thumbUrl: null, published: false },
    { slot: "final", title: "Final Trailer", description: "", videoUrl: null, thumbUrl: null, published: false },
  ].map((d) => site?.videos.find((v) => v.slot === d.slot) ?? d);
  const heroBg = afterShots[1]?.src ?? afterShots[0]?.src;
  const pairs = beforeShots.slice(0, 4).map((b, i) => ({ before: b, after: afterShots[i] ?? afterShots[0]! }));
  const allShots = [...beforeShots.map((s) => ({ ...s, tag: "BEFORE" })), ...afterShots.map((s) => ({ ...s, tag: "AFTER" }))];
  const preload = useMemo(() => [heroBg, afterShots[0]?.src, afterShots[2]?.src].filter(Boolean) as string[], [heroBg, afterShots]);
  const finishLoading = useCallback(() => setLoading(false), []);

  useCinema([site, loading]);

  useEffect(() => {
    const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section[id]").forEach((el) => spy.observe(el));
    const bar = document.querySelector<HTMLElement>(".scroll-bar");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { spy.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [site]);

  useEffect(() => { document.body.style.overflow = loading ? "hidden" : ""; }, [loading]);

  const navLinks = [["Story", "about"], ["Project", "project"], ["Progress", "progress"], ["Work", "work"], ["Builds", "builds"], ["Teaser", "teaser"], ["Crew", "team"], ["Support", "support"]];

  return (
    <div className={`site-content cinema ${loading ? "is-loading" : "is-ready"}`}>
      {loading && <Loader srcs={preload} onDone={finishLoading} />}
      <JesterCursor />
      <HorrorFX />
      <div className="mouse-spotlight" aria-hidden="true" />
      <div className="scroll-bar" aria-hidden="true" />
      {openShot && <Lightbox shot={openShot} onClose={() => setOpenShot(null)} />}

      {/* Nav */}
      <header className="cine-nav">
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8">
          <a href="#" className="cine-logo"><span className="cine-logo-mark">🃏</span> JESTER<em>studios</em></a>
          <div className="nav-pill hidden lg:flex">
            {navLinks.map(([l, id]) => (
              <a key={id} href={`#${id}`} className={`nav-pill-link ${activeId === id ? "is-active" : ""}`}>{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && <Link to="/admin" className="nav-chip hidden sm:inline-flex">Dashboard</Link>}
            {user ? (
              <button onClick={() => void supabase.auth.signOut()} className="nav-chip hidden sm:inline-flex">Log out</button>
            ) : (
              <Link to="/login" className="nav-chip hidden sm:inline-flex">Sign in</Link>
            )}
            <a href={DISCORD} target="_blank" rel="noreferrer" className="nav-chip nav-chip-red">Discord</a>
            <button onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className={`burger lg:hidden ${menuOpen ? "open" : ""}`}><span /><span /></button>
          </div>
        </nav>
      </header>
      <div className={`menu-curtain lg:hidden ${menuOpen ? "open" : ""}`}>
        <div className="menu-curtain-inner">
          {navLinks.map(([l, id], i) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} style={{ transitionDelay: `${menuOpen ? 150 + i * 50 : 0}ms` }}>
              <span>{String(i + 1).padStart(2, "0")}</span>{l}
            </a>
          ))}
          <div className="menu-curtain-foot" style={{ transitionDelay: menuOpen ? "600ms" : "0ms" }}>
            {user ? <button onClick={() => void supabase.auth.signOut()}>Log out</button> : <Link to="/login">Sign in</Link>}
            {isAdmin && <Link to="/admin">Dashboard</Link>}
            <Link to="/admin-login">Admin Login</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section data-hero className="hero">
        <div className="hero-bg-wrap">
          {heroBg && <img data-hero-bg src={heroBg} alt="" className="hero-bg" />}
          <div className="hero-veil" />
        </div>
        <div className="hero-grid-floor" aria-hidden="true" />
        <div className="hero-lightning" aria-hidden="true" />
        <div className="hero-heartbeat" aria-hidden="true" />
        <div className="hero-ash" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.73) % 9}s`, animationDuration: `${7 + (i % 6)}s` }} />)}
        </div>
        <div data-hero-left className="hero-frame hero-frame-l mouse-drift" aria-hidden="true">
          {afterShots[0] && <img src={afterShots[0].src} alt="" />}
          <span>FIG. 01 — WOODLAND</span>
        </div>
        <div data-hero-right className="hero-frame hero-frame-r mouse-drift-reverse" aria-hidden="true">
          {afterShots[2] && <img src={afterShots[2].src} alt="" />}
          <span>FIG. 02 — PAVILION</span>
        </div>

        <div className="hero-content">
          <div className="hero-meta">
            <span>EST. 2026</span><span>INDIE ROBLOX STUDIO</span><span>DEBUT: KONNECT US</span>
          </div>
          <WatchingEyes className="hero-eyes" />
          <h1 data-hero-title className="hero-title">
            <span className="hero-line"><Split text="PLAYFUL" delay={0.1} /></span>
            <span className="hero-line hero-line-serif"><Split text="chaos," delay={0.35} className="font-serif-i" /></span>
            <span className="hero-line hero-line-out"><Split text="SERIOUS" delay={0.5} /></span>
            <span className="hero-line"><Split text="PASSION." delay={0.7} className="text-blood" /></span>
          </h1>
          <div className="hero-foot" data-rise>
            <p>Six independent creators building fresh, memorable Roblox worlds from the ground up. Raw talent, zero corporate backing, and big ambitions.</p>
            <div className="flex flex-wrap gap-3">
              <Magnetic href={DISCORD}><MessageCircle size={18} /> Join the Discord</Magnetic>
              <Magnetic href="#support" variant="ghost"><Heart size={18} /> Support & Invest</Magnetic>
            </div>
          </div>
        </div>
        <a href="#about" className="scroll-cue" aria-label="Scroll down"><span /> SCROLL</a>
      </section>

      {/* Story */}
      <section id="about" className="story">
        <div className="story-ghost" data-marquee="1" aria-hidden="true">INDEPENDENT · INDEPENDENT · INDEPENDENT ·</div>
        <div className="mx-auto max-w-[1300px] px-5 sm:px-8">
          <Eyebrow n="01">Our Story</Eyebrow>
          <h2 className="display-xl mt-6"><Split text="100% INDEPENDENT." /><br /><span className="font-serif-i text-blood"><Split text="community powered." delay={0.2} /></span></h2>
          <div className="story-cols">
            <Words className="story-big" text="Jester Studios is a self-funded team of six friends learning, building, and pushing our limits every single day. We don't have corporate budgets, investors, or years of industry experience yet — we have dedication, imagination, and a drive to craft games players genuinely love." />
            <div className="story-side" data-rise>
              <div data-stagger className="space-y-6">
                <p>Every model, line of script, and UI element is built through trial, error, and teamwork. This is the very beginning of our journey, and we're building it out in the open with our community.</p>
                <div className="stat-row">
                  <div><b>06</b><span>Creators</span></div>
                  <div><b>01</b><span>Debut game</span></div>
                  <div><b>00</b><span>Investors</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project */}
      <section id="project" className="project">
        <div className="project-bg">{afterShots[4] && <img data-zoom src={afterShots[4].src} alt="" />}</div>
        <div className="project-veil" />
        <div className="relative mx-auto max-w-[1300px] px-5 sm:px-8">
          <Eyebrow n="02">Debut Game · Active Development</Eyebrow>
          <div className="project-title" data-marquee="-1" aria-hidden="true">KONNECT US KONNECT US KONNECT US</div>
          <div className="project-panel" data-rise>
            <div className="classified-stamp">CLASSIFIED</div>
            <h2 className="display-lg">[Konnect Us / <span className="text-blood">Classified</span>]</h2>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">Our inaugural Roblox experience is underway. Focused on snappy mechanics, collaborative multiplayer fun, and high replayability.</p>
            <div className="project-meter">
              <div className="project-pct"><span data-count={pct}>{pct}</span><i>%</i></div>
              <div className="flex-1">
                <div className="mb-3 flex justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground"><span>Development progress</span><span>{text("project_status", "COMING SOON")}</span></div>
                <div className="meter-track"><div className="meter-fill progress-fill" style={{ width: `${pct}%` }} /></div>
                <div className="meter-ticks">{Array.from({ length: 21 }, (_, i) => <span key={i} />)}</div>
              </div>
            </div>
            <div className="mt-8"><Magnetic href="#progress" variant="ghost"><ZoomIn size={18} /> Check Progress</Magnetic></div>
          </div>
        </div>
      </section>

      {/* Progress compare */}
      <section id="progress" className="progress-sec">
        <div className="mx-auto max-w-[1300px] px-5 sm:px-8">
          <Eyebrow n="03">Konnect Us · Classified</Eyebrow>
          <h2 className="display-xl mt-6"><Split text="THEN" /> <span className="font-serif-i text-muted-foreground"><Split text="&" delay={0.15} /></span> <span className="text-blood"><Split text="NOW" delay={0.25} /></span></h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground" data-rise>See how our first indie game has changed. Drag across each picture: the left side was taken before our latest updates, the right side shows the richer lighting, expanded scenery and added details now in the game.</p>
          <div className="compare-list">
            {pairs.map((p, i) => (
              <div key={p.before.src} className={`compare-item ${i % 2 ? "is-flip" : ""}`}>
                <div data-mask={i % 2 ? "right" : "left"} className="compare-frame"><Compare before={p.before.src} after={p.after.src} label={p.after.caption} /></div>
                <div className="compare-copy" data-rise>
                  <div data-stagger>
                    <span className="compare-n">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-2xl font-bold sm:text-3xl">{p.after.caption}</h3>
                    <p className="mt-4 text-muted-foreground">{p.after.description}</p>
                    <button onClick={() => setOpenShot(p.after)} className="link-arrow mt-6">View full picture <span>→</span></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {afterShots.length > 4 && (
            <div className="extra-after" data-rise><div data-stagger className="grid gap-5 sm:grid-cols-2">
              {afterShots.slice(4).map((s) => (
                <button key={s.src} onClick={() => setOpenShot(s)} className="shot-tile" aria-label={`Open updated view: ${s.caption}`}>
                  <img src={s.src} alt={`Updated Konnect Us build — ${s.caption}`} loading="lazy" />
                  <span className="shot-tile-cap"><b>NEW</b> {s.caption}</span>
                </button>
              ))}
            </div></div>
          )}
        </div>
      </section>

      {/* Work — asymmetric collage */}
      <section id="work" className="work-sec">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="work-head">
            <div>
              <Eyebrow n="04">Our Work</Eyebrow>
              <h2 className="display-lg mt-6"><Split text="A SMALL GLIMPSE" /><br /><span className="font-serif-i text-blood"><Split text="of how we work" delay={0.2} /></span></h2>
            </div>
            <p className="max-w-md text-muted-foreground" data-rise>{text("work_intro", "These earlier shots come straight from our current project, before our latest updates — a small example of how we started and how we work. Keep in mind: we're fully indie, and this is our very first game.")}</p>
          </div>
          <div className="collage">
            {beforeShots.slice(0, 4).map((shot, i) => (
              <button key={shot.src} onClick={() => setOpenShot(shot)} className={`collage-item collage-${i}`} aria-label={`Open ${shot.caption}`}>
                <div data-mask={i % 2 ? "right" : "up"} className="collage-mask">
                  <img data-zoom src={shot.src} alt={`Work in progress by Jester Studios — ${shot.caption}`} loading="lazy" />
                </div>
                <span className="collage-cap"><i>{String(i + 1).padStart(2, "0")}</i>{shot.caption}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Builds — pinned horizontal reel */}
      <section id="builds" data-hscroll className="reel">
        <div className="reel-head">
          <Eyebrow n="05">Build Timeline</Eyebrow>
          <h2 className="display-lg mt-4">EARLIER BUILDS <span className="font-serif-i text-blood">to</span> LATEST</h2>
          <p className="reel-hint">Keep scrolling — the reel slides sideways. Tap any frame to open it.</p>
        </div>
        <div data-track className="reel-track">
          {allShots.map((s, i) => (
            <button key={`${s.tag}-${s.src}`} data-hcard onClick={() => setOpenShot(s)} className="reel-card" aria-label={`Open ${s.caption}`}>
              <div className="reel-img"><img src={s.src} alt={s.caption} loading="lazy" /></div>
              <div className="reel-meta">
                <span className={s.tag === "BEFORE" ? "tag-before" : "tag-after"}>{s.tag}</span>
                <span className="reel-idx">{String(i + 1).padStart(2, "0")} / {String(allShots.length).padStart(2, "0")}</span>
              </div>
              <p className="reel-cap">{s.caption}</p>
            </button>
          ))}
          <div className="reel-end"><span className="font-serif-i">to be continued…</span></div>
        </div>
      </section>

      {/* Teasers */}
      <section id="teaser" className="teaser-sec">
        <div className="mx-auto max-w-[1300px] px-5 sm:px-8">
          <Eyebrow n="06">Official Teasers · Konnect Us</Eyebrow>
          <h2 className="display-xl mt-6"><Split text="SIGNAL" /> <span className="text-blood font-serif-i"><Split text="incoming" delay={0.2} /></span></h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground" data-rise>{text("teaser_intro", "Something is brewing in the park. Stay tuned — our teasers and the final trailer are on the way.")}</p>
          <div className="teaser-grid" data-rise><div data-stagger className="contents">
            {videoSlots.map((v, i) => (
              <div key={v.slot} className={`film ${v.videoUrl ? "film-live" : ""} ${i === 2 ? "film-wide" : ""}`}>
                {v.videoUrl ? (
                  <video src={v.videoUrl} poster={v.thumbUrl ?? undefined} controls playsInline preload="none" className="film-video" aria-label={v.title} />
                ) : (
                  <>
                    {afterShots[(i * 2 + 1) % afterShots.length] && <img src={afterShots[(i * 2 + 1) % afterShots.length]!.src} alt="" className="film-poster" />}
                    <div className="film-static" />
                    <div className="film-rec"><i /> NO SIGNAL</div>
                  </>
                )}
                <div className="film-info">
                  <span className="film-n">REEL {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="film-title">{v.title}</h3>
                  <span className={v.videoUrl ? "tag-after" : "tag-before"}>{v.videoUrl ? "OUT NOW" : "COMING SOON"}</span>
                </div>
              </div>
            ))}
          </div></div>
        </div>
      </section>

      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }, (_, k) => (
            <span key={k}>KONNECT US ✦ COMING SOON ✦ JESTER STUDIOS ✦ {pct}% BUILT ✦ INDIE & PROUD ✦ JOIN THE CREW ✦&nbsp;</span>
          ))}
        </div>
      </div>

      {/* Team */}
      <section id="team" className="crew">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow n="07">The Crew</Eyebrow>
          <h2 className="display-xl mt-6"><Split text="MEET THE" /> <span className="text-blood font-serif-i"><Split text="jesters" delay={0.2} /></span></h2>
          <p className="mt-6 max-w-xl text-muted-foreground" data-rise>Every card is a real person. Hover or tap one to look closer.</p>
          <Deck title="Founders" n="I" members={team.founders} />
          <Deck title="Developers" n="II" members={team.developers} />
          <Deck title="Social Media" n="III" members={team.social} />
        </div>
      </section>

      {/* Collaboration */}
      <section id="collab" className="crew crew-collab">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow n="08">Ongoing Collaboration</Eyebrow>
          <h2 className="display-lg mt-6">IN PARTNERSHIP WITH <span className="text-blood font-serif-i">Angoor Studios</span></h2>
          <p className="mt-6 max-w-xl text-muted-foreground" data-rise>Talented creators we're teaming up with on current and future projects.</p>
          <Deck title="Angoor Studios" n="IV" members={team.collaborators} />
        </div>
      </section>

      {/* Support */}
      <section id="support" className="support-sec">
        <div className="mx-auto max-w-[1300px] px-5 sm:px-8">
          <Eyebrow n="09">Back the Vision</Eyebrow>
          <h2 className="display-xl mt-6"><Split text="FEED THE" /> <span className="text-blood font-serif-i"><Split text="jester" delay={0.2} /></span></h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground" data-rise>{text("support_intro", "Help us bridge the gap. Your support directly funds server costs, custom assets, 3D models, and the development of our upcoming games.")}</p>
          <div className="support-grid">
            <div className="ledger" data-rise>
              <div className="ledger-head"><Coffee size={18} /> Community Support & Donations</div>
              <p className="px-6 pt-4 text-sm text-muted-foreground">All support goes straight into development — servers, assets, and tools. Pick any channel below.</p>
              {[
                { flag: "🇵🇰", label: "Pakistan", items: [{ name: "EasyPaisa", value: "", note: "Currently unavailable" }, { name: "JazzCash", value: "", note: "Currently unavailable" }] },
                { flag: "🇮🇳", label: "India", items: [{ name: "UPI", value: "", note: "Currently unavailable" }] },
                { flag: "🌍", label: "International", items: [{ name: "Tether USDT — BNB Smart Chain (BEP20)", value: "0x66c8F05B7E7D80baDb7b55609424deE89fc848D3", note: "" }] },
              ].map((group) => (
                <div key={group.label} className="ledger-group">
                  <p className="ledger-label">{group.flag} {group.label}</p>
                  {group.items.map((item) => (
                    <div key={item.name} className={`ledger-row ${item.value ? "is-live" : ""}`}>
                      <div className="min-w-0">
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="break-all font-mono text-xs text-muted-foreground">{item.value || item.note}</p>
                      </div>
                      {item.value ? <CopyButton value={item.value} /> : <span className="ledger-off">OFFLINE</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="invest" data-rise>
              {afterShots[3] && <img data-zoom src={afterShots[3].src} alt="" className="invest-bg" />}
              <div className="invest-veil" />
              <div className="relative">
                <Handshake size={28} className="text-blood" />
                <h3 className="mt-5 text-3xl font-bold sm:text-4xl">Future Project Investment & Partnerships</h3>
                <p className="mt-4 text-muted-foreground">Interested in sponsoring or investing in our debut game or future roadmap? We're open to strategic partners who believe in indie talent.</p>
                <div className="mt-8"><Magnetic href={INSTAGRAM}><Camera size={18} /> Contact for Investment</Magnetic></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="finale">
        <div className="finale-bg">{afterShots[5] && <img data-zoom src={afterShots[5].src} alt="" />}</div>
        <div className="finale-veil" />
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <Eyebrow>The door is open</Eyebrow>
          <h2 className="display-xl mt-6"><Split text="PLAYTESTS." /><br /><Split text="DEVLOGS." delay={0.15} /><br /><span className="text-blood font-serif-i"><Split text="feedback." delay={0.3} /></span></h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground" data-rise>Join our Discord to get early playtest access, read developer logs, and help shape our games in live feedback sessions.</p>
          <div className="mt-10 flex justify-center"><Magnetic href={DISCORD}><MessageCircle size={18} /> Join the Discord</Magnetic></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cine-footer">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="footer-links">
            <a href={DISCORD} target="_blank" rel="noreferrer">Discord ↗</a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="#support">Support/Invest</a>
            <Link to="/admin-login">Admin Login</Link>
          </div>
          <div className="footer-word" aria-hidden="true">JESTER</div>
          <div className="footer-base">
            <p>© {new Date().getFullYear()} Jester Studios • jestercommunity.co</p>
            <p>Jester Studios is an independent game development group not affiliated with Roblox Corporation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
