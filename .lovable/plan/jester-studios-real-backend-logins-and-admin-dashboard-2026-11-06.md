# Jester Studios: real backend, logins and admin dashboard

The public site stays as it is now (dark red glitch style, all current sections). Everything below is added on top of it.

## What you'll get

**1. Visitors, accounts and admin login**
- Anyone can browse the whole site without an account.
- New "Sign in" button in the menu: create an account with email and password, confirm your email, reset a forgotten password, log out.
- Separate "Admin Login" page in the same dark glitch style. Only accounts you mark as admin get in. Normal users who type the admin address are turned away. Admin rights are checked on the server for every action, not just hidden in the page.

**2. Admin dashboard (/admin)**
- **Overview:** total users, published items, images, videos, and recent admin activity.
- **Site text:** edit headings and descriptions (hero, about, project, progress %, teaser text), save as draft, preview, publish.
- **Image library:** upload, replace, rename, delete and reorder the screenshots. This covers the Small Glimpse, Before/After and Builds slider pictures.
- **Videos & trailers:** upload Teaser 1, Teaser 2 and Final Trailer with thumbnails, titles and descriptions. Each one switches from "Coming Soon" to playable when you publish it.
- **Team:** add, edit, remove and reorder team cards (name, role, bio, photo, section).
- **Publishing:** draft, publish or unpublish each item. Changes go live without editing code. Older saved versions are kept and can be restored.
- **Activity log:** records who changed what and when.

**3. More motion**
- Smooth fade and slide transitions between the site, the sign-in pages and the dashboard.
- The menu highlights the section you're currently looking at.
- Mobile menu with a slide-out animation.
- Parallax on the hero.
- Content pops in one after another within each group.
- All motion respects the "reduce motion" phone and computer setting.

**4. Security check**
- Upload limits: images up to 10 MB, videos up to 200 MB, safe file types only.
- Limits on repeated login attempts.
- Every input is checked on the server.
- A full security scan runs at the end, and anything it finds gets fixed.

## Needed from you
- **The email address that should be the first admin.** It must be a real address you can sign in with. You create the account with your own password, and I give it admin rights from the back end, so your password is never written into the site.
- A new Discord invite link and your Roblox group link (still outstanding).

## Not included
- Scheduled publishing and two-step login for admins can come later if you want them.

## Technical details
- Enable Lovable Cloud: auth (email/password, verification, reset), Postgres, Storage buckets (`site-images`, `site-videos`, public read for published files only, write for admins only).
- Tables: `user_roles` (app_role enum, `has_role` security-definer function), `profiles`, `site_content` (key, value JSON, status draft/published, version), `content_versions`, `media` (filename, type, size, storage path, uploaded_by), `team_members`, `videos`, `admin_activity`. RLS: public SELECT on published rows; admin-only writes via `has_role`.
- Server functions with `requireSupabaseAuth` and admin role checks for all mutations, plus zod validation. Public reads go through a loader with a publishable client.
- Routes: `/login`, `/signup`, `/reset-password`, `/admin-login`, `_authenticated/admin/*` (overview, content, images, videos, team, activity).
- The homepage reads published content from the database and falls back to the current hard-coded data, which gets seeded into the database in the migration.
- Then: run the security scan and an end-to-end Playwright test as visitor, user and admin.
