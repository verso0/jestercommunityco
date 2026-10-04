import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MessageCircle, Camera, Heart, Rocket, Handshake, Coffee, Copy, Check, Hammer } from "lucide-react";
import workShot1 from "@/assets/work-1.jpg.asset.json";
import workShot2 from "@/assets/work-2.jpg.asset.json";
import workShot3 from "@/assets/work-3.jpg.asset.json";
import workShot4 from "@/assets/work-4.jpg.asset.json";

const DISCORD = "https://discord.gg/wXTNsqUJm";
const INSTAGRAM = "https://www.instagram.com/jestercommunity.co/";
const ROBLOX = "https://www.roblox.com/groups";

const workShots = [
  { src: workShot1.url, caption: "Forest environment — terrain, foliage & props" },
  { src: workShot2.url, caption: "Beachside café build — models & lighting" },
  { src: workShot3.url, caption: "Park detail — swing, lanterns & custom props" },
  { src: workShot4.url, caption: "Garden pavilion — modeling & atmosphere" },
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

const team = [
  { name: "HAMZA", role: "Lead Scripter", bio: "The engine behind the studio. Turns late-night ideas into clean, working systems — and never breaks a sweat doing it. If it runs smoothly, it's his." },
  { name: "VERSO", role: "3D MODELER/COMMUNITY MANAGER", bio: "Crafts models with obsessive detail by day, keeps the community smiling by night. The friendly bridge between the studio and its players." },
  { name: "NYXEN", role: "MANAGER/3D MODLER", bio: "Keeps everyone organized and on schedule, then jumps straight into modeling. The planner with an artist's eye for worlds that beg to be explored." },
  { name: "BUDDI", role: "LEAD MODEL DESIGNER/3D MODELER", bio: "Defines the look of everything — shapes, colors, style. A perfectionist who won't ship a model until it feels exactly right." },
  { name: "GROZA", role: "MODERATOR", bio: "Keeps the community safe, fair, and fun. Calm, sharp, and always paying attention — the guardian of the vibes." },
  { name: "VEE", role: "SOCIAL MEDIA MANAGER", bio: "The voice of Jester Studios. Posts, hype, and announcements — lives online so the community always knows what's coming next." },
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
      });
    };
    const hide = () => { cursor.dataset["visible"] = "false"; };
    const show = () => { cursor.dataset["visible"] = "true"; };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
    };
  }, []);

  return <div ref={cursorRef} className="jester-cursor" aria-hidden="true"><span>🃏</span></div>;
}

function Index() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

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
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="site-content overflow-x-hidden">
      <JesterCursor />
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" className="font-display text-lg font-extrabold">🃏 Jester<span className="text-neon">.</span></a>
          <div className="hidden gap-7 text-sm text-muted-foreground md:flex">
            {[["About", "#about"], ["Project", "#project"], ["Team", "#team"], ["Support", "#support"]].map(([l, h]) => (
              <a key={h} href={h} className="hover:text-neon transition">{l}</a>
            ))}
          </div>
          <a href={DISCORD} target="_blank" rel="noreferrer" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Discord</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center bg-grid pt-24">
        <div className="mouse-drift pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
        <div className="mouse-drift-reverse pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-neon/20 blur-[120px]" />
        <div className="floaty mouse-drift pointer-events-none absolute right-[10%] top-1/4 hidden text-7xl lg:block">🎲</div>
        <div className="floaty mouse-drift-reverse pointer-events-none absolute left-[8%] bottom-1/4 hidden text-6xl lg:block" style={{ animationDelay: "2s" }}>🎮</div>
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <Reveal>
            <span className="glass mouse-tilt inline-block rounded-full px-4 py-1.5 text-sm text-muted-foreground">🃏 Jester Studios • Indie Roblox Development</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-8 text-4xl font-extrabold leading-tight sm:text-6xl md:text-7xl">
              Playful Chaos.<br /><span className="text-gradient">Serious Passion.</span>
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
                <div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">Development progress</span><span className="font-bold text-neon">95%</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-neon via-primary to-amber" />
                </div>
              </div>
              <div className="mt-8">
                <span className="rounded-lg border border-amber/50 px-3 py-1.5 text-sm font-bold text-amber">COMING SOON</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Support */}
      <section id="support" className="bg-surface py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-5xl">Back the Vision: <span className="text-gradient">Invest in Jester Studios</span></h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Help us bridge the gap. Your support directly funds server costs, custom assets, 3D models, and the development of our upcoming games.</p>
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
                      { name: "EasyPaisa", value: "03462972377", note: "" },
                      { name: "JazzCash", value: "", note: "Currently unavailable" },
                    ],
                  },
                  {
                    flag: "🇮🇳",
                    label: "India",
                    items: [
                      { name: "UPI", value: "+918780481953", note: "" },
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
            <h2 className="text-3xl font-extrabold sm:text-5xl">Meet the <span className="text-neon">6 Creators</span></h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={(i % 3) * 120} className="glass glow-hover mouse-tilt rounded-2xl p-7 text-center">
                <div className="heartbeat mx-auto h-24 w-24 rounded-full" style={{ ["--d" as string]: i }}>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-neon/60 text-3xl">🃏</div>
                </div>
                <h3 className="mt-6 text-lg font-bold">{m.name}</h3>
                <span className="mt-2 inline-block rounded-full bg-amber/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber">{m.role}</span>
                <p className="mt-4 text-sm text-muted-foreground">{m.bio}</p>
              </Reveal>
            ))}
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
            <a href={DISCORD} className="hover:text-neon">Discord</a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:text-neon">Instagram</a>
            <a href={ROBLOX} className="hover:text-neon">Roblox Group</a>
            <a href="#support" className="hover:text-neon">Support/Invest</a>
          </div>
          <p>© {new Date().getFullYear()} Jester Studios • jestercommunity.co</p>
          <p className="text-xs opacity-70">Jester Studios is an independent game development group not affiliated with Roblox Corporation.</p>
        </div>
      </footer>
    </div>
  );
}
