import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MessageCircle, Camera, Heart, Rocket, Handshake, Coffee, Copy, Check, Hammer, X, ZoomIn } from "lucide-react";
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
import { BuildSlider } from "@/components/BuildSlider";
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

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Btn({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" | "amber" }) {
  const styles = {
    primary: "bg-primary text-primary-foreground shadow-[0_0_30px_-4px_var(--primary)] hover:brightness-110",
    ghost: "glass text-foreground hover:border-neon/60 hover:text-neon",
    amber: "bg-amber text-background hover:brightness-110 shadow-[0_0_30px_-6px_var(--amber)]",
  }[variant];
  const ext = href.startsWith("http");
  return (
    <a href={href} target={ext ? "_blank" : undefined} rel={ext ? "noreferrer" : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold transition hover:-translate-y-0.5 ${styles}`}>
      {children}
    </a>
  );
}

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
        className="reveal in glass mouse-tilt relative max-h-full w-full max-w-4xl overflow-y-auto rounded-2xl border border-neon/30 p-3 shadow-[0_0_60px_-10px_var(--neon)] sm:p-5"
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

function TeamCard({ m, i, perRow = 3 }: { m: TeamMember; i: number; perRow?: 2 | 3 | 4 | 5 }) {
  return (
    <Reveal delay={(i % perRow) * 120} className="team-card glass glow-hover mouse-tilt relative rounded-2xl p-7 text-center">
      <div className="corrupt" aria-hidden="true" />
      <div className="heartbeat mx-auto h-24 w-24 rounded-full" style={{ ["--d" as string]: i }}>
        {(m.avatar ?? AVATARS[m.name]) ? (
          <img src={m.avatar ?? AVATARS[m.name]} alt={`${m.name} avatar`} loading="lazy" className="h-full w-full rounded-full object-cover ring-2 ring-primary/60" />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-neon/60 text-3xl">🃏</div>
        )}
      </div>
      <h3 className="mt-6 text-lg font-bold">{m.name}</h3>
      <span className="mt-2 inline-block rounded-full bg-amber/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber">{m.role}</span>
      <p className="mt-4 text-sm text-muted-foreground">{m.bio}</p>
    </Reveal>
  );
}

function TeamGroup({ title, members, perRow = 3, maxW = "max-w-6xl" }: { title: string; members: TeamMember[]; perRow?: 2 | 3 | 4 | 5; maxW?: string }) {
  const cols = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" }[perRow];
  return (
    <>
      <Reveal className="mt-16 text-center">
        <h3 className="text-2xl font-extrabold text-amber">{title}</h3>
      </Reveal>
      <div className={`${maxW} mx-auto mt-8 grid gap-6 sm:grid-cols-2 ${cols}`}>
        {members.map((m, i) => <TeamCard key={`${title}-${m.name}`} m={m} i={i} perRow={perRow} />)}
      </div>
    </>
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

function Index() {
  const [openShot, setOpenShot] = useState<(typeof workShots)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
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
  // Visitors only receive published slots; fill the rest with "Coming Soon" placeholders.
  const videoSlots = [
    { slot: "teaser1", title: "Teaser 1", description: "", videoUrl: null, thumbUrl: null, published: false },
    { slot: "teaser2", title: "Teaser 2", description: "", videoUrl: null, thumbUrl: null, published: false },
    { slot: "final", title: "Final Trailer", description: "", videoUrl: null, thumbUrl: null, published: false },
  ].map((d) => site?.videos.find((v) => v.slot === d.slot) ?? d);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    const variants = ["rv-up", "rv-left", "rv-right", "rv-zoom", "rv-flip", "rv-blur"];
    document.querySelectorAll(".reveal").forEach((el, i) => {
      if (![...el.classList].some((c) => c.startsWith("rv-"))) el.classList.add(variants[i % variants.length] ?? "rv-up");
      if (!el.classList.contains("in")) io.observe(el);
    });
    const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section[id]").forEach((el) => spy.observe(el));
    const bar = document.querySelector<HTMLElement>(".scroll-bar");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      document.documentElement.style.setProperty("--scroll", `${window.scrollY}`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tilts = [...document.querySelectorAll<HTMLElement>(".mouse-tilt")];
    const cleanups = tilts.map((element) => {
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty("--tilt-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 7}deg`);
        element.style.setProperty("--tilt-y", `${((event.clientY - rect.top) / rect.height - 0.5) * -7}deg`);
      };
      const reset = () => {
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-y", "0deg");
      };
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", reset);
      return () => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", reset);
      };
    });

    return () => {
      io.disconnect();
      spy.disconnect();
      window.removeEventListener("scroll", onScroll);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [site]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  const navLinks = [["About", "about"], ["Project", "project"], ["Progress", "progress"], ["Work", "work"], ["Builds", "builds"], ["Teaser", "teaser"], ["Team", "team"], ["Support", "support"]];

  return (
    <div className="site-content page-enter overflow-x-hidden">
      <JesterCursor />
      <HorrorFX />
      <div className="mouse-spotlight" aria-hidden="true" />
      <div className="scroll-bar" aria-hidden="true" />
      <div className="bg-particles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 1.3) % 12}s`, animationDuration: `${12 + (i % 6) * 3}s`, fontSize: `${12 + (i % 4) * 6}px` }}>
            {["🃏", "✦", "♦", "★", "♣", "♠"][i % 6]}
          </span>
        ))}
      </div>
      {openShot && <Lightbox shot={openShot} onClose={() => setOpenShot(null)} />}
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" className="font-display text-lg font-extrabold">🃏 Jester<span className="text-neon">.</span></a>
          <div className="hidden gap-6 text-sm text-muted-foreground lg:flex">
            {navLinks.map(([l, id]) => (
              <a key={id} href={`#${id}`} className={`nav-link transition hover:text-foreground ${activeId === id ? "is-active text-foreground" : ""}`}>{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && <Link to="/admin" className="hidden rounded-lg border border-amber/60 px-3 py-2 text-sm font-bold text-amber sm:inline-block">Dashboard</Link>}
            {user ? (
              <button onClick={() => void signOut()} className="hidden rounded-lg border border-border px-3 py-2 text-sm font-bold sm:inline-block">Log out</button>
            ) : (
              <Link to="/login" className="hidden rounded-lg border border-border px-3 py-2 text-sm font-bold sm:inline-block">Sign in</Link>
            )}
            <a href={DISCORD} target="_blank" rel="noreferrer" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Discord</a>
            <button onClick={() => setMenuOpen((o) => !o)} aria-label="Open menu" aria-expanded={menuOpen} className="rounded-lg border border-border px-3 py-2 text-sm font-bold lg:hidden">{menuOpen ? "✕" : "☰"}</button>
          </div>
        </nav>
        <div className={`mobile-menu lg:hidden ${menuOpen ? "open" : ""}`}>
          {navLinks.map(([l, id], i) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} style={{ transitionDelay: `${i * 40}ms` }} className={activeId === id ? "text-amber" : ""}>{l}</a>
          ))}
          {user ? <button onClick={() => void signOut()}>Log out</button> : <Link to="/login">Sign in</Link>}
          {isAdmin && <Link to="/admin">Dashboard</Link>}
          <Link to="/admin-login" className="text-amber">Admin Login</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center bg-grid pt-24">
        <div className="mouse-drift pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
        <div className="mouse-drift-reverse pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-neon/20 blur-[120px]" />
        <div className="floaty mouse-drift pointer-events-none absolute right-[10%] top-1/4 hidden text-7xl lg:block">🎲</div>
        <div className="floaty mouse-drift-reverse pointer-events-none absolute left-[8%] bottom-1/4 hidden text-6xl lg:block" style={{ animationDelay: "2s" }}>🎮</div>
        <div className="hero-parallax relative mx-auto max-w-5xl px-5 text-center">
          <WatchingEyes className="mb-8 justify-center" />
          <Reveal>
            <span className="glass mouse-tilt inline-block rounded-full px-4 py-1.5 text-sm text-muted-foreground">🃏 Jester Studios • Indie Roblox Development</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-8 text-4xl font-extrabold leading-tight sm:text-6xl md:text-7xl">
              <span className="glitch-title" data-text="Playful Chaos.">Playful Chaos.</span><br /><span className="glitch-title text-gradient" data-text="Serious Passion.">Serious Passion.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Six independent creators building fresh, memorable Roblox worlds from the ground up. Raw talent, zero corporate backing, and big ambitions.
            </p>
          </Reveal>
          <Reveal delay={300} className="mt-10 flex flex-wrap justify-center gap-4">
            <Btn href={DISCORD}><MessageCircle size={18} /> Join the Discord</Btn>
            <Btn href="#support" variant="ghost"><Heart size={18} /> Support & Invest</Btn>
          </Reveal>
        </div>
      </section>

      <div className="drip-divider relative z-[2]" aria-hidden="true" />
      {/* About */}
      <section id="about" className="bg-surface py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="font-bold uppercase tracking-widest text-amber text-sm">Our Story</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">100% Independent. <span className="text-neon">Community Powered.</span></h2>
          </Reveal>
          <Reveal delay={150} className="space-y-5 text-lg text-muted-foreground">
            <p>Jester Studios is a self-funded team of six friends learning, building, and pushing our limits every single day. We don't have corporate budgets, investors, or years of industry experience yet—we have dedication, imagination, and a drive to craft games players genuinely love.</p>
            <p>Every model, line of script, and UI element is built through trial, error, and teamwork. This is the very beginning of our journey, and we're building it out in the open with our community.</p>
          </Reveal>
        </div>
      </section>

      {/* Project */}
      <section id="project" className="py-28">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal className="glow-border isolate">
            <div className="mouse-tilt rounded-2xl bg-surface p-8 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"><Rocket size={16} /> Debut Game • Active Development</span>
              <h2 className="mt-6 text-3xl font-extrabold sm:text-5xl">[Konnect Us / <span className="text-amber">Classified</span>]</h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Our inaugural Roblox experience is underway. Focused on snappy mechanics, collaborative multiplayer fun, and high replayability.</p>
              <div className="mt-8">
                <div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">Development progress</span><span className="font-bold text-neon">{pct}%</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="progress-fill h-full rounded-full bg-gradient-to-r from-neon via-primary to-amber" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="rounded-lg border border-amber/50 px-3 py-1.5 text-sm font-bold text-amber">{text("project_status", "COMING SOON")}</span>
                <Btn href="#progress" variant="ghost"><ZoomIn size={18} /> Check Progress</Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Development Progress */}
      <section id="progress" className="bg-surface py-28 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <p className="font-bold uppercase tracking-widest text-amber text-sm">Konnect Us • Classified</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">View <span className="text-gradient">Development Progress</span></h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-muted-foreground">See how our first indie game has changed. The first images were taken before our latest updates; the new images show the richer lighting, expanded scenery and added details now in the game.</p>
          </Reveal>

          <Reveal className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-5">
              <div><span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Earlier build</span><h3 className="mt-2 text-2xl font-extrabold">Before the updates</h3></div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">BEFORE</span>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {beforeShots.map((shot, i) => (
              <Reveal key={`before-${shot.src}`} delay={(i % 2) * 120} className="glass glow-hover mouse-tilt group rounded-2xl p-2">
                <button onClick={() => setOpenShot(shot)} className="relative block w-full cursor-pointer overflow-hidden rounded-xl" aria-label={`Open earlier view: ${shot.caption}`}>
                  <img src={shot.src} alt={`Earlier Konnect Us build — ${shot.caption}`} loading="lazy" className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 flex items-center justify-center bg-background/0 text-transparent transition duration-300 group-hover:bg-background/40 group-hover:text-neon"><ZoomIn size={36} /></span>
                </button>
                <p className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground"><Hammer size={14} className="shrink-0 text-amber" /> {shot.caption}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-neon/30 pb-5">
              <div><span className="text-sm font-bold uppercase tracking-widest text-neon">Latest build</span><h3 className="mt-2 text-2xl font-extrabold">After the updates</h3></div>
              <span className="rounded-full bg-neon/15 px-3 py-1 text-xs font-bold text-neon">{pct}% COMPLETE</span>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {afterShots.map((shot, i) => (
              <Reveal key={shot.src} delay={(i % 3) * 100} className="glass glow-hover mouse-tilt group rounded-2xl p-2">
                <button onClick={() => setOpenShot(shot)} className="relative block w-full cursor-pointer overflow-hidden rounded-xl" aria-label={`Open updated view: ${shot.caption}`}>
                  <img src={shot.src} alt={`Updated Konnect Us build — ${shot.caption}`} loading="lazy" className="aspect-video w-full object-contain transition duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 flex items-center justify-center bg-background/0 text-transparent transition duration-300 group-hover:bg-background/40 group-hover:text-neon"><ZoomIn size={34} /></span>
                </button>
                <p className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground"><Rocket size={14} className="shrink-0 text-neon" /> {shot.caption}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">Click any picture to view the environment up close and read what changed.</p>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <p className="font-bold uppercase tracking-widest text-amber text-sm">Our Work</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">A Small Glimpse of <span className="text-gradient">How We Work</span></h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              {text("work_intro", "These earlier shots come straight from our current project, before our latest updates — a small example of how we started and how we work. Keep in mind: we're fully indie, and this is our very first game.")}
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {beforeShots.map((shot, i) => (
              <Reveal key={shot.src} delay={(i % 2) * 120} className="glass glow-hover mouse-tilt group rounded-2xl p-2">
                <button onClick={() => setOpenShot(shot)} className="relative block w-full cursor-pointer overflow-hidden rounded-xl" aria-label={`Open ${shot.caption}`}>
                  <img src={shot.src} alt={`Work in progress by Jester Studios — ${shot.caption}`} loading="lazy"
                    className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 flex items-center justify-center bg-background/0 text-transparent transition duration-300 group-hover:bg-background/40 group-hover:text-neon">
                    <ZoomIn size={36} />
                  </span>
                </button>
                <p className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <Hammer size={14} className="shrink-0 text-neon" /> {shot.caption}
                </p>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">Click any picture to open it up close, with a note about the environment you're looking at.</p>
        </div>
      </section>

      {/* Builds slider */}
      <section id="builds" className="py-28 scroll-mt-20">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal className="text-center">
            <p className="font-bold uppercase tracking-widest text-neon text-sm">Build Timeline</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">Earlier Builds to <span className="text-gradient">Latest Updates</span></h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Slide through every screenshot we've shared — from our first builds to the newest updates. Drag, swipe, use the arrows, or tap a picture to open it.</p>
          </Reveal>
          <Reveal className="mt-12" delay={120}>
            <BuildSlider
              slides={[...beforeShots.map((s) => ({ ...s, tag: "BEFORE" })), ...afterShots.map((s) => ({ ...s, tag: "AFTER" }))]}
              onOpen={(s) => setOpenShot(s)}
            />
          </Reveal>
        </div>
      </section>

      {/* Teasers */}
      <section id="teaser" className="bg-surface py-28 scroll-mt-20">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal className="text-center">
            <p className="font-bold uppercase tracking-widest text-neon text-sm">Official Teasers • Konnect Us</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">Teasers & <span className="text-gradient">Trailer</span></h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{text("teaser_intro", "Something is brewing in the park. Stay tuned — our teasers and the final trailer are on the way.")}</p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {videoSlots.map((v, i) => (
              <Reveal key={v.slot} delay={i * 120} className={`glass glow-hover mouse-tilt rounded-2xl text-center ${v.videoUrl ? "p-2 sm:col-span-3" : "p-8"}`}>
                {v.videoUrl ? (
                  <>
                    <video src={v.videoUrl} poster={v.thumbUrl ?? undefined} controls playsInline preload="none" className="aspect-video w-full rounded-xl bg-background" aria-label={v.title} />
                    <div className="p-4"><h3 className="text-xl font-bold">{v.title}</h3>{v.description && <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{v.description}</p>}<span className="mt-3 inline-block rounded-full bg-foreground/15 px-3 py-1 text-xs font-bold">OUT NOW</span></div>
                  </>
                ) : (
                  <>
                    <div className="floaty mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-2xl">🎬</div>
                    <h3 className="mt-5 text-xl font-bold">{v.title}</h3>
                    <span className="mt-4 inline-block rounded-full bg-amber/15 px-3 py-1 text-xs font-bold text-amber">COMING SOON</span>
                  </>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }, (_, k) => (
            <span key={k}>KONNECT US ✦ COMING SOON ✦ JESTER STUDIOS ✦ {pct}% BUILT ✦ INDIE & PROUD ✦ JOIN THE CREW ✦&nbsp;</span>
          ))}
        </div>
      </div>

      {/* Support */}
      <section id="support" className="bg-surface py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-5xl">Back the Vision: <span className="text-gradient">Invest in Jester Studios</span></h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{text("support_intro", "Help us bridge the gap. Your support directly funds server costs, custom assets, 3D models, and the development of our upcoming games.")}</p>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <Reveal className="glass glow-hover mouse-tilt rounded-2xl p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15 text-amber"><Coffee /></div>
              <h3 className="mt-5 text-xl font-bold">Community Support & Donations</h3>
              <p className="mt-3 text-muted-foreground">All support goes straight into development — servers, assets, and tools. Pick any channel below.</p>
              <div className="mt-6 space-y-5">
                {[
                  {
                    flag: "🇵🇰",
                    label: "Pakistan",
                    items: [
                      { name: "EasyPaisa", value: "", note: "Currently unavailable" },
                      { name: "JazzCash", value: "", note: "Currently unavailable" },
                    ],
                  },
                  {
                    flag: "🇮🇳",
                    label: "India",
                    items: [
                      { name: "UPI", value: "", note: "Currently unavailable" },
                    ],
                  },
                  {
                    flag: "🌍",
                    label: "International",
                    items: [
                      { name: "Tether USDT — BNB Smart Chain (BEP20)", value: "0x66c8F05B7E7D80baDb7b55609424deE89fc848D3", note: "" },
                    ],
                  },
                ].map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{group.flag} {group.label}</p>
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <div key={item.name} className="mouse-tilt flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
                          <div className="min-w-0">
                            <p className="text-sm font-bold">{item.name}</p>
                            <p className="break-all text-sm text-muted-foreground">{item.value || item.note}</p>
                          </div>
                          {item.value && <CopyButton value={item.value} />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={150} className="glass glow-hover mouse-tilt rounded-2xl p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary"><Handshake /></div>
              <h3 className="mt-5 text-xl font-bold">Future Project Investment & Partnerships</h3>
              <p className="mt-3 text-muted-foreground">Interested in sponsoring or investing in our debut game or future roadmap? We're open to strategic partners who believe in indie talent.</p>
              <div className="mt-6"><Btn href={INSTAGRAM}><Camera size={18} /> Contact for Investment</Btn></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-5xl">Meet the <span className="text-neon">Jester Crew</span></h2>
          </Reveal>
          <TeamGroup title="Founders" members={team.founders} perRow={5} maxW="max-w-7xl" />
          <TeamGroup title="Developers" members={team.developers} perRow={3} />
          <TeamGroup title="Social Media" members={team.social} perRow={2} maxW="max-w-4xl" />
        </div>
      </section>

      {/* Ongoing Collaboration */}
      <section id="collab" className="bg-surface py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <p className="font-bold uppercase tracking-widest text-amber text-sm">Ongoing Collaboration</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">In Partnership with <span className="text-gradient">Angoor Studios</span></h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Talented creators we're teaming up with on current and future projects.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.collaborators.map((m, i) => <TeamCard key={m.name} m={m} i={i} perRow={3} />)}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="px-5 pb-28">
        <Reveal className="mouse-tilt relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary/40 via-surface to-neon/20 p-10 text-center sm:p-16 border border-border">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Playtests. Devlogs. Feedback.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">Join our Discord to get early playtest access, read developer logs, and help shape our games in live feedback sessions.</p>
          <div className="mt-8"><Btn href={DISCORD}><MessageCircle size={18} /> Join the Discord</Btn></div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-6">
            <a href={DISCORD} target="_blank" rel="noreferrer" className="hover:text-neon">Discord</a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:text-neon">Instagram</a>
            <a href="#support" className="hover:text-neon">Support/Invest</a>
            <Link to="/admin-login" className="hover:text-neon">Admin Login</Link>
          </div>
          <p>© {new Date().getFullYear()} Jester Studios • jestercommunity.co</p>
          <p className="text-xs opacity-70">Jester Studios is an independent game development group not affiliated with Roblox Corporation.</p>
        </div>
      </footer>
    </div>
  );
}
