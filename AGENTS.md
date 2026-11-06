<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep project progress imagery in the shared lightbox data shape so every gallery uses one accessible viewing experience.
- Homepage reads published content from Lovable Cloud tables (site_content, media, team_members, videos) via `src/lib/site-data.ts`, falling back to hard-coded arrays in `index.tsx` so the page never renders empty.
- Admin writes go straight from the browser client; security is enforced by RLS `has_role(auth.uid(),'admin')` policies, not by the `/admin` route gate. Roles live only in `user_roles`.
- Uploaded files live in the private `site-media` bucket (workspace blocks public buckets); stored refs are `storage:<path>` or `storage_path` and are resolved to signed URLs. Anon can read only files referenced by published rows.
- Unpublished text drafts live in admin-only `content_drafts`; `site_content.draft` is deprecated.
- Activity log rows are written by database triggers, never by client code.
