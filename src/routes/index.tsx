import { createFileRoute } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { MessageCircle, Camera, Heart, Rocket, Gamepad2, Handshake, Coffee, Sparkles, ArrowRight } from "lucide-react";

const DISCORD = "https://discord.gg/";
const INSTAGRAM = "https://instagram.com/";
const ROBLOX = "https://www.roblox.com/groups";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jester Studios — Indie Roblox Game Development" },
      { name: "description", content: "Six independent creators building fresh, memorable Roblox worlds. Join the Discord, support, or invest in Jester Studios." },
      { property: "og:title", content: "Jester Studios — Playful Chaos. Serious Passion." },
      { property: "og:description", content: "Six independent creators building fresh, memorable Roblox worlds from the ground up." },
    ],
  }),
  component: Index,
});

const team = [
  { name: "[Name] / Sagi", role: "Lead Scripter", bio: "Turns wild ideas into working systems. Calm under pressure, chaotic in brainstorms." },
  { name: "[Name]", role: "3D Modeler", bio: "Sculpts every prop and character with obsessive detail. Will debate low-poly vs. high-poly for hours." },
  { name: "[Name]", role: "Level Designer", bio: "Builds worlds that beg to be explored. Loves hidden secrets and sneaky shortcuts." },
  { name: "[Name]", role: "UI/UX Artist", bio: "Makes every button feel satisfying to press. Color palettes are a personality trait." },
  { name: "[Name]", role: "Animator", bio: "Brings everything to life with bounce and swagger. Has strong opinions about squash and stretch." },
  { name: "[Name]", role: "Community Manager", bio: "The voice of the team and friend to every player. Runs playtests and keeps the vibes high." },
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

function Index() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden">
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
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-neon/20 blur-[120px]" />
        <div className="floaty pointer-events-none absolute right-[10%] top-1/4 hidden text-7xl lg:block">🎲</div>
        <div className="floaty pointer-events-none absolute left-[8%] bottom-1/4 hidden text-6xl lg:block" style={{ animationDelay: "2s" }}>🎮</div>
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <Reveal>
            <span className="glass inline-block rounded-full px-4 py-1.5 text-sm text-muted-foreground">🃏 Jester Studios • Indie Roblox Development</span>
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
            <div className="rounded-2xl bg-surface p-8 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"><Rocket size={16} /> Debut Game • Active Development</span>
              <h2 className="mt-6 text-3xl font-extrabold sm:text-5xl">[Konnect Us / <span className="text-amber">Classified</span>]</h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Our inaugural Roblox experience is underway. Focused on snappy mechanics, collaborative multiplayer fun, and high replayability.</p>
              <div className="mt-8">
                <div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">Development progress</span><span className="font-bold text-neon">35%</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-neon via-primary to-amber" />
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="rounded-lg border border-amber/50 px-3 py-1.5 text-sm font-bold text-amber">COMING SOON</span>
                <a href={DISCORD} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-neon hover:underline">Sneak peeks on Discord <ArrowRight size={16} /></a>
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
            <Reveal className="glass glow-hover rounded-2xl p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15 text-amber"><Coffee /></div>
              <h3 className="mt-5 text-xl font-bold">Community Support & Donations</h3>
              <p className="mt-3 text-muted-foreground">Tip or donate directly to help cover tools, plugins, and development coffee. Every bit keeps the lights on.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn href={ROBLOX} variant="amber"><Gamepad2 size={18} /> Donate via Robux / Group Store</Btn>
                <Btn href="https://ko-fi.com/" variant="ghost"><Heart size={18} /> Ko-fi / Patreon</Btn>
              </div>
            </Reveal>
            <Reveal delay={150} className="glass glow-hover rounded-2xl p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary"><Handshake /></div>
              <h3 className="mt-5 text-xl font-bold">Future Project Investment & Partnerships</h3>
              <p className="mt-3 text-muted-foreground">Interested in sponsoring or investing in our debut game or future roadmap? We're open to strategic partners who believe in indie talent.</p>
              <div className="mt-6"><Btn href="mailto:hello@jestercommunity.co"><Sparkles size={18} /> Contact for Investment</Btn></div>
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
              <Reveal key={m.role} delay={(i % 3) * 120} className="glass glow-hover rounded-2xl p-7 text-center">
                <div className="heartbeat mx-auto h-24 w-24 rounded-full" style={{ ["--d" as string]: i }}>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-neon/60 text-3xl">🃏</div>
                </div>
                <h3 className="mt-6 text-lg font-bold">{m.name}</h3>
                <span className="mt-2 inline-block rounded-full bg-amber/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber">{m.role}</span>
                <p className="mt-4 text-sm text-muted-foreground">{m.bio}</p>
                <div className="mt-5 flex justify-center gap-3">
                  <a href={DISCORD} target="_blank" rel="noreferrer" aria-label="Discord" className="rounded-lg border border-border p-2 text-muted-foreground transition hover:border-primary hover:text-primary"><MessageCircle size={18} /></a>
                  <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-lg border border-border p-2 text-muted-foreground transition hover:border-neon hover:text-neon"><Camera size={18} /></a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="px-5 pb-28">
        <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary/40 via-surface to-neon/20 p-10 text-center sm:p-16 border border-border">
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
            <a href={INSTAGRAM} className="hover:text-neon">Instagram</a>
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
