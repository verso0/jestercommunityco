CREATE OR REPLACE FUNCTION public.grant_listed_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND lower(NEW.email) IN ('kalubhai2464@gmail.com','namrahkhann15@gmail.com','hfzutssst@gmail.com','oooyesyesyesyes@gmail.com') THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.grant_listed_admin() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS on_auth_user_admin_grant ON auth.users;
CREATE TRIGGER on_auth_user_admin_grant AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_listed_admin();
INSERT INTO public.user_roles(user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE email_confirmed_at IS NOT NULL AND lower(email) IN ('kalubhai2464@gmail.com','namrahkhann15@gmail.com','hfzutssst@gmail.com','oooyesyesyesyes@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;