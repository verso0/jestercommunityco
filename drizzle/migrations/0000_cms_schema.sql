create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- Site text: draft + published values per key
create table public.site_content (
  key text primary key check (key ~ '^[a-z0-9_]{1,60}$'),
  label text not null default '',
  draft text not null default '' check (length(draft) <= 5000),
  published text check (length(published) <= 5000),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;
create policy "public reads site content" on public.site_content for select to anon, authenticated using (true);
create policy "admins write site content" on public.site_content for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.content_versions (
  id uuid primary key default gen_random_uuid(),
  content_key text not null references public.site_content(key) on delete cascade,
  value text not null,
  created_at timestamptz not null default now(),
  created_by uuid
);
grant select, insert on public.content_versions to authenticated;
grant all on public.content_versions to service_role;
alter table public.content_versions enable row level security;
create policy "admins manage versions" on public.content_versions for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Image library
create table public.media (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('before','after','work')),
  url text not null,
  storage_path text,
  file_name text not null default '',
  file_type text not null default 'image/jpeg',
  file_size bigint not null default 0,
  caption text not null default '' check (length(caption) <= 200),
  description text not null default '' check (length(description) <= 2000),
  sort_order int not null default 0,
  published boolean not null default false,
  uploaded_by uuid,
  created_at timestamptz not null default now()
);
grant select on public.media to anon, authenticated;
grant insert, update, delete on public.media to authenticated;
grant all on public.media to service_role;
alter table public.media enable row level security;
create policy "public reads published media" on public.media for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "admins write media" on public.media for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Team
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('founders','developers','social','collaborators')),
  name text not null check (length(name) between 1 and 40),
  role text not null default '' check (length(role) <= 120),
  bio text not null default '' check (length(bio) <= 600),
  avatar_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.team_members to anon, authenticated;
grant insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;
create policy "public reads published team" on public.team_members for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "admins write team" on public.team_members for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Videos / trailers
create table public.videos (
  slot text primary key check (slot in ('teaser1','teaser2','final')),
  title text not null,
  description text not null default '' check (length(description) <= 2000),
  video_url text,
  video_path text,
  thumbnail_url text,
  thumbnail_path text,
  sort_order int not null default 0,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
grant select on public.videos to anon, authenticated;
grant insert, update, delete on public.videos to authenticated;
grant all on public.videos to service_role;
alter table public.videos enable row level security;
create policy "public reads videos" on public.videos for select to anon, authenticated using (true);
create policy "admins write videos" on public.videos for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Activity log (written only by triggers)
create table public.admin_activity (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid,
  action text not null,
  target_table text not null,
  target_id text,
  created_at timestamptz not null default now()
);
grant select on public.admin_activity to authenticated;
grant all on public.admin_activity to service_role;
alter table public.admin_activity enable row level security;
create policy "admins read activity" on public.admin_activity for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.log_admin_activity()
returns trigger language plpgsql security definer set search_path = public as $$
declare rid text;
begin
  if tg_op = 'DELETE' then rid := coalesce(to_jsonb(old)->>'id', to_jsonb(old)->>'key', to_jsonb(old)->>'slot');
  else rid := coalesce(to_jsonb(new)->>'id', to_jsonb(new)->>'key', to_jsonb(new)->>'slot'); end if;
  insert into public.admin_activity(admin_id, action, target_table, target_id) values (auth.uid(), lower(tg_op), tg_table_name, rid);
  return coalesce(new, old);
end $$;

create trigger log_site_content after insert or update or delete on public.site_content for each row execute function public.log_admin_activity();
create trigger log_media after insert or update or delete on public.media for each row execute function public.log_admin_activity();
create trigger log_team after insert or update or delete on public.team_members for each row execute function public.log_admin_activity();
create trigger log_videos after insert or update or delete on public.videos for each row execute function public.log_admin_activity();

-- Stats for the dashboard (admins only)
create or replace function public.admin_stats()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  return json_build_object(
    'users', (select count(*) from auth.users),
    'published_content', (select count(*) from public.site_content where published is not null),
    'images', (select count(*) from public.media),
    'videos', (select count(*) from public.videos where video_url is not null)
  );
end $$;
revoke execute on function public.admin_stats() from anon, public;
grant execute on function public.admin_stats() to authenticated;

-- Seed current site data
insert into public.site_content(key, label, draft, published, published_at) values
 ('progress_percent', 'Development progress (%)', '98', '98', now()),
 ('project_status', 'Project status badge', 'COMING SOON', 'COMING SOON', now()),
 ('teaser_intro', 'Teasers section description', 'Something is brewing in the park. Stay tuned — our teasers and the final trailer are on the way.', 'Something is brewing in the park. Stay tuned — our teasers and the final trailer are on the way.', now()),
 ('work_intro', 'Small Glimpse description', 'These earlier shots come straight from our current project, before our latest updates — a small example of how we started and how we work. Keep in mind: we''re fully indie, and this is our very first game.', 'These earlier shots come straight from our current project, before our latest updates — a small example of how we started and how we work. Keep in mind: we''re fully indie, and this is our very first game.', now()),
 ('support_intro', 'Support section description', 'Help us bridge the gap. Your support directly funds server costs, custom assets, 3D models, and the development of our upcoming games.', 'Help us bridge the gap. Your support directly funds server costs, custom assets, 3D models, and the development of our upcoming games.', now());

insert into public.videos(slot, title, sort_order) values ('teaser1','Teaser 1',0),('teaser2','Teaser 2',1),('final','Final Trailer',2);

insert into public.team_members(section, name, role, bio, sort_order) values
 ('founders','VERSO','FOUNDER','Crafts models with obsessive detail by day, keeps the community smiling by night. The friendly bridge between the studio and its players.',0),
 ('founders','NYXEN','FOUNDER','Keeps everyone organized and on schedule, then jumps straight into modeling. The planner with an artist''s eye for worlds that beg to be explored.',1),
 ('founders','BUDDI','FOUNDER','Defines the look of everything — shapes, colors, style. A perfectionist who won''t ship a model until it feels exactly right.',2),
 ('founders','GROZA','FOUNDER','Keeps the community safe, fair, and fun. Calm, sharp, and always paying attention — the guardian of the vibes.',3),
 ('founders','VEE','FOUNDER','Helped start the studio and still shapes how the world sees it. Creative, quick, and always thinking about the next big moment for Jester Studios.',4),
 ('developers','VEE','DEVELOPER/CINEMATOGRAPHER/EDITOR','Builds alongside the team, frames the world through the camera, then cuts it all together — making sure every scene looks as good in-game as it does in the edit.',0),
 ('developers','VERSO','DEVELOPER/MAP DESIGNER/SCRIPTER/GUI DESIGNER','Touches every layer of the game — builds the map, writes scripts, and designs the menus you click. The all-rounder who turns ideas into playable reality.',1),
 ('developers','NYXEN','DEVELOPER/MANAGER','Codes features by day and keeps the whole crew on schedule by night. The organized mind that turns chaos into deadlines met.',2),
 ('developers','BUDDI','DEVELOPER/MAP DESIGNER/3D MODEL DESIGNER','Shapes the world in 3D — designs the map and models every corner of it. A perfectionist who won''t ship a scene until it feels exactly right.',3),
 ('developers','GROZA','MODERATOR','Keeps the community safe, fair, and fun. Calm, sharp, and always paying attention — the guardian of the vibes.',4),
 ('social','VEE','SOCIAL MEDIA/DEVELOPER/CINEMATOGRAPHER/EDITOR','Shoots the cinematics, edits the clips and shares them with the world — the eye behind how Jester Studios looks online.',0),
 ('social','GROZA','SOCIAL MEDIA MANAGER','Runs the posts, the hype and the community chats. Calm, sharp and always online — the voice that keeps players in the loop.',1),
 ('collaborators','BACAN','SCRIPTER','Scripting muscle from Angoor Studios. Builds the systems behind the scenes and makes sure every mechanic feels snappy.',0),
 ('collaborators','BLADE','SCRIPTER','Also from Angoor Studios. A scripter who loves clean logic and smooth gameplay — if it breaks, Blade has already fixed it.',1),
 ('collaborators','SAM','3D MODELER','The modeler from Angoor Studios. Shapes props and scenes with care, bringing extra polish to every corner of our worlds.',2);
