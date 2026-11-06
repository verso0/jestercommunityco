drop policy if exists "public reads site content" on public.site_content;
create policy "public reads published site content" on public.site_content for select to anon, authenticated
  using (published is not null or public.has_role(auth.uid(), 'admin'));
drop policy if exists "public reads videos" on public.videos;
create policy "public reads published videos" on public.videos for select to anon, authenticated
  using (published or public.has_role(auth.uid(), 'admin'));
drop policy if exists "public reads published site media files" on storage.objects;