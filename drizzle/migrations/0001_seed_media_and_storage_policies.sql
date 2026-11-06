insert into public.media(section,url,caption,description,sort_order,published) values
('before','/__l5e/assets-v1/ebbb04e0-023c-4493-a6f5-e05d34ca873e/work-1.jpg','Forest environment — terrain, foliage & props','A quiet corner of a hand-shaped forest. Every tree, rock and patch of foliage is placed manually — no stock terrain. A resting bench with a warm cup of coffee waits under the canopy, showing how we layer small, personal props into big environments to make a world feel lived-in.',0,true),
('before','/__l5e/assets-v1/bc1b2394-302c-4a49-983a-aa8526003d88/work-2.jpg','Beachside café build — models & lighting','A café built right on the shoreline. The building, furniture, counters and signage are all modeled from scratch in Roblox Studio, with custom lighting tuned for a warm, coastal evening mood. This is an example of how we approach complete, explorable buildings — not just decoration.',1,true),
('before','/__l5e/assets-v1/309577ec-f58f-4ab4-8e59-a807432dea2c/work-3.jpg','Park detail — swing, lanterns & custom props','A park scene focused on the little details: a swing set, hanging lanterns and custom props scattered through the greenery. Warm light pools around each lantern to guide the player''s eye — this is the kind of atmosphere work we put into every playable area.',2,true),
('before','/__l5e/assets-v1/cc4b68f4-a266-4d6c-ac72-8ca297511c9a/work-4.jpg','Garden pavilion — modeling & atmosphere','A garden pavilion surrounded by planted greenery, built to test how our models read in full scenes. The structure, plants and surrounding props are all custom — it''s a small snapshot of the modeling and atmosphere pipeline behind our debut game.',3,true),
('after','/__l5e/assets-v1/d3933cf2-1fc1-4e6b-92a9-b6de10b80463/progress-after-full-1.jpg','Updated woodland path — deeper atmosphere & lighting','The updated woodland now uses denser foliage, richer shadows and carefully placed lantern light to turn a simple path and bench into a more immersive nighttime scene.',0,true),
('after','/__l5e/assets-v1/d85deafc-c3ea-449b-ad00-35b78d17b045/progress-after-full-2.jpg','Cherry blossom campfire — a new social space','A new gathering spot framed by glowing cherry trees, layered grass and warm firelight, where players can stop, meet and spend time together.',1,true),
('after','/__l5e/assets-v1/a6bc2e02-2f14-430d-ba77-4aabb0f3cf25/progress-after-full-3.jpg','Garden pavilion — expanded and brought to life','The pavilion area has been expanded with seating, curtains, flowers, string lights and a stronger garden composition, making the build feel more complete and ready to explore.',2,true),
('after','/__l5e/assets-v1/600fe694-fd0f-435b-a869-1e98fd8f65e9/progress-after-full-4.jpg','Romantic garden feature — new interactive detail','This new floral arch and hanging seat add a memorable focal point. Custom flowers, decorative gifts and drifting petals give the area its own personality.',3,true),
('after','/__l5e/assets-v1/d2c9b117-d335-4950-8143-a8367451efaa/progress-after-full-5.jpg','Forest scale update — larger trees and pathways','The forest has gained much larger trees, clearer pathways and more varied lighting, making players feel surrounded by the environment rather than simply walking past it.',4,true),
('after','/__l5e/assets-v1/6ba4089b-9cf2-4b40-8f4d-cf04cf4735d1/progress-after-full-6.jpg','Finished park corner — lighting, seating & planting','A polished park corner combines layered trees, flower beds, a bench and a strong lantern landmark, reflecting the latest pass on atmosphere and environmental detail.',5,true);
update public.team_members set avatar_url='/__l5e/assets-v1/31de56bf-0f3e-48cf-b862-2ab91aa8a3e4/avatar-verso.jpg' where name='VERSO';
update public.team_members set avatar_url='/__l5e/assets-v1/dce1a66f-56a8-4ba8-ac8d-e535d6959c5c/avatar-nyxen.jpg' where name='NYXEN';
update public.team_members set avatar_url='/__l5e/assets-v1/d30ed83b-abf3-4e8a-93dd-face10686e7c/avatar-buddi.jpg' where name='BUDDI';
update public.team_members set avatar_url='/__l5e/assets-v1/04ca2154-c3df-494b-9a9d-8a224c617b95/avatar-groza.jpg' where name='GROZA';
update public.team_members set avatar_url='/__l5e/assets-v1/8155e23a-b305-4582-953a-edf77abdb9d4/avatar-vee.jpg' where name='VEE';
update public.team_members set avatar_url='/__l5e/assets-v1/a3fbc489-7737-41f6-9e69-b165637aabe9/avatar-bacan.jpg' where name='BACAN';
update public.team_members set avatar_url='/__l5e/assets-v1/5448874f-086f-4108-992b-f2e7691f6757/avatar-blade.jpg' where name='BLADE';
update public.team_members set avatar_url='/__l5e/assets-v1/7f4f3de2-76c2-4013-927e-03936d79f405/avatar-sam.jpg' where name='SAM';

create policy "admins manage site media files" on storage.objects for all to authenticated
  using (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'));
create policy "public reads published site media files" on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-media' and (
    exists (select 1 from public.media m where m.storage_path = objects.name and m.published)
    or exists (select 1 from public.videos v where v.published and (v.video_path = objects.name or v.thumbnail_path = objects.name))
    or exists (select 1 from public.team_members t where t.published and t.avatar_url = 'storage:' || objects.name)
  ));
