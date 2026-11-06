import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export type DossierMember = { name: string; role: string; bio: string; avatar?: string | null };

const ROLE_DETAILS: Record<string, { title: string; text: string; duties: string[] }> = {
  FOUNDER: {
    title: "Founder",
    text: "One of the people who started Jester Studios from nothing. Founders set the direction of the studio, decide what we build next and protect the playful-chaos spirit that makes our games feel like ours.",
    duties: ["Shapes the vision and identity of the studio", "Makes the big calls on projects and priorities", "Represents Jester Studios to players and partners"],
  },
  DEVELOPER: {
    title: "Developer",
    text: "Turns ideas into something you can actually play. Developers build, test and fix features inside Roblox Studio, making sure every system works together smoothly.",
    duties: ["Builds and tests gameplay features", "Fixes bugs before players ever find them", "Works with the whole crew to hit deadlines"],
  },
  "MAP DESIGNER": {
    title: "Map Designer",
    text: "Designs the spaces you explore — the layout, the hidden corners, the places where friends gather. A good map makes you want to stay a little longer.",
    duties: ["Plans layouts and player flow", "Builds the environments piece by piece", "Tunes lighting and atmosphere"],
  },
  SCRIPTER: {
    title: "Scripter",
    text: "Writes the code that makes the world come alive — every button, door, system and mechanic runs on their scripts.",
    duties: ["Writes clean, fast Lua scripts", "Builds game systems and mechanics", "Keeps performance smooth for every player"],
  },
  "LEAD SCRIPTER": {
    title: "Lead Scripter",
    text: "Leads the scripting side of the game, making the big technical decisions and keeping all the code working together.",
    duties: ["Designs the core game systems", "Reviews and guides other scripters", "Solves the hardest technical problems"],
  },
  "GUI DESIGNER": {
    title: "GUI Designer",
    text: "Designs the menus, buttons and screens you click — making them clear, good-looking and easy to use.",
    duties: ["Designs in-game menus and HUD", "Keeps the look consistent with the studio style", "Makes the game easy to understand at a glance"],
  },
  "3D MODEL DESIGNER": {
    title: "3D Model Designer",
    text: "Sculpts the objects and scenery of our worlds in 3D, from tiny props to entire buildings.",
    duties: ["Models props, buildings and scenery", "Keeps models detailed but lightweight", "Matches every model to the art style"],
  },
  "3D MODELER": {
    title: "3D Modeler",
    text: "Shapes props and scenes with care, bringing extra polish to every corner of the world.",
    duties: ["Creates 3D props and set pieces", "Polishes details and textures", "Delivers models ready for the map"],
  },
  MANAGER: {
    title: "Manager",
    text: "Keeps the crew organized — who is doing what, and by when. The calm voice that turns chaos into finished work.",
    duties: ["Plans tasks and schedules", "Keeps everyone in sync", "Tracks progress toward release"],
  },
  MODERATOR: {
    title: "Moderator",
    text: "Keeps the community safe, fair and fun. Watches over chats and events so everyone feels welcome.",
    duties: ["Enforces community rules fairly", "Helps players with questions and issues", "Keeps the vibes good in every channel"],
  },
  "SOCIAL MEDIA": {
    title: "Social Media",
    text: "Shares the studio with the world — posts, clips and updates that keep players excited for what's coming.",
    duties: ["Posts updates and behind-the-scenes content", "Grows the community online", "Answers fans and builds hype"],
  },
  "SOCIAL MEDIA MANAGER": {
    title: "Social Media Manager",
    text: "Runs our online presence — the posts, the hype and the community chats. The voice that keeps players in the loop.",
    duties: ["Plans and publishes posts", "Runs community announcements", "Keeps the studio voice consistent"],
  },
  CINEMATOGRAPHER: {
    title: "Cinematographer",
    text: "Frames the world through the camera — finding the angles and shots that make our game look cinematic.",
    duties: ["Shoots in-game cinematics", "Plans camera moves and shots", "Captures footage for teasers and trailers"],
  },
  EDITOR: {
    title: "Editor",
    text: "Cuts the footage together into clips, teasers and trailers with the right rhythm, music and mood.",
    duties: ["Edits teasers and trailers", "Adds effects, sound and pacing", "Delivers clips ready to post"],
  },
  "LEAD EDITOR": {
    title: "Lead Editor",
    text: "Leads the editing of every video the studio releases, setting the style for how Jester Studios looks on screen.",
    duties: ["Leads teaser and trailer edits", "Sets the visual style of our videos", "Reviews every clip before release"],
  },
};

const DECK_INTRO: Record<string, string> = {
  Founders: "A founding member of Jester Studios — part of the small group that dreamed this studio up and keeps it moving.",
  Developers: "Part of the development crew — the hands that build the game inside Roblox Studio every day.",
  "Social Media": "Part of the social media team — the people who show the world what we're making.",
  "Angoor Studios": "An ongoing collaborator from Angoor Studios, working side by side with us on this project.",
};

export function MemberDossier({ member, deck, src, onClose }: { member: DossierMember | null; deck: string; src?: string | null | undefined; onClose: () => void }) {
  const roles = member ? member.role.split("/").map((r) => r.trim().toUpperCase()).filter(Boolean) : [];
  return (
    <Dialog open={!!member} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-primary/40 bg-background p-0">
        {member && (
          <div>
            <div className="relative flex flex-col items-center gap-4 border-b border-border bg-card px-6 pb-8 pt-10 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{deck} · Dossier</span>
              <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-primary/60">
                {src ? <img src={src} alt={`${member.name} avatar`} className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-5xl">🃏</span>}
              </div>
              <DialogTitle className="text-4xl uppercase">{member.name}</DialogTitle>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{roles.join(" · ")}</p>
              <DialogDescription className="max-w-md text-base text-foreground/90">{member.bio}</DialogDescription>
            </div>
            <div className="space-y-8 px-6 py-8">
              <section>
                <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-primary">Place in the team</h4>
                <p className="text-muted-foreground">{DECK_INTRO[deck] ?? "A valued member of the Jester Studios crew."}</p>
              </section>
              {roles.map((r) => {
                const d = ROLE_DETAILS[r];
                if (!d) return null;
                return (
                  <section key={r} className="border-l-2 border-primary/60 pl-4">
                    <h4 className="mb-2 text-2xl uppercase">{d.title}</h4>
                    <p className="mb-3 text-muted-foreground">{d.text}</p>
                    <ul className="space-y-1 text-sm">
                      {d.duties.map((x) => <li key={x}>— {x}</li>)}
                    </ul>
                  </section>
                );
              })}
              <section>
                <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-primary">On the current project</h4>
                <p className="text-muted-foreground">
                  {member.name} is working on our first game, Konnect Us — a cozy world built for hanging out with friends. As an indie team on our first project, everyone wears many hats, and {member.name}'s work as {roles.map((r) => ROLE_DETAILS[r]?.title ?? r).join(", ")} is part of what brings it to life.
                </p>
              </section>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
