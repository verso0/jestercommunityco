create table public.content_drafts (
  key text primary key references public.site_content(key) on delete cascade,
  draft text not null default '' check (length(draft) <= 5000),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.content_drafts to authenticated;
grant all on public.content_drafts to service_role;
alter table public.content_drafts enable row level security;
create policy "admins manage drafts" on public.content_drafts for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
insert into public.content_drafts(key, draft) select key, draft from public.site_content;
update public.site_content set draft = '';
comment on column public.site_content.draft is 'DEPRECATED: drafts live in content_drafts (admin-only)';
create trigger log_content_drafts after insert or update or delete on public.content_drafts for each row execute function public.log_admin_activity();
