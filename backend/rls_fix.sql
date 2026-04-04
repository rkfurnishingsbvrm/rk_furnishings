
-- RUN THIS IN SUPABASE DASHBOARD > SQL EDITOR:

-- PRODUCTS: Allow all operations for anon/authenticated
CREATE POLICY IF NOT EXISTS "anon_can_select_products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_insert_products" ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_can_update_products" ON public.products FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_delete_products" ON public.products FOR DELETE TO anon, authenticated USING (true);

-- BLOG POSTS: Allow all operations
CREATE POLICY IF NOT EXISTS "anon_can_select_blog_posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_insert_blog_posts" ON public.blog_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_can_update_blog_posts" ON public.blog_posts FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_delete_blog_posts" ON public.blog_posts FOR DELETE TO anon, authenticated USING (true);

-- CONSULTATIONS: Allow all operations
CREATE POLICY IF NOT EXISTS "anon_can_select_consultations" ON public.consultations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_insert_consultations" ON public.consultations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_can_update_consultations" ON public.consultations FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_delete_consultations" ON public.consultations FOR DELETE TO anon, authenticated USING (true);

-- CATEGORIES: Allow read
CREATE POLICY IF NOT EXISTS "anon_can_select_categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
