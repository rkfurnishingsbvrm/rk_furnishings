const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const localDb = require('../lib/localDb');

// GET all published blog posts (public)
router.get('/', async (req, res) => {
    let data = [];
    try {
        const { data: cloudData, error } = await supabase
            .from('blog_posts')
            .select('id, title, author, published_at, created_at')
            .eq('is_published', true)
            .order('published_at', { ascending: false });
        
        if (error || !cloudData || cloudData.length === 0) {
            throw new Error(error ? error.message : 'No data');
        }
        data = cloudData;
    } catch (dbErr) {
        console.log('🔄 Blog: Switching to local fallback. Reason:', dbErr.message);
        try {
            data = localDb.getBlogPosts().filter(p => p.is_published);
            data.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
        } catch (localErr) {
            console.error('❌ Failed to fetch local blog posts:', localErr.message);
            data = [];
        }
    }
    res.status(200).json(data);
});


// GET all posts including drafts (admin)
router.get('/admin/all', async (req, res) => {
    try {
        let data, error;
        try {
            const result = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });
            data = result.data;
            error = result.error;
            if (error) throw error;
            if (!data || data.length === 0) throw new Error('No cloud data');
        } catch (dbErr) {
            data = localDb.getBlogPosts();
            data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all blog posts', error: error.message });
    }
});

// GET single post by id
router.get('/:id', async (req, res) => {
    try {
        let data, error;
        try {
            const result = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', req.params.id)
                .single();
            data = result.data;
            error = result.error;
            if (error) throw error;
            if (!data) throw new Error('Not found');
        } catch (dbErr) {
            data = localDb.getBlogPosts().find(p => p.id === req.params.id);
        }
        if (!data) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post', error: error.message });
    }
});

// POST create blog post (admin)
router.post('/', async (req, res) => {
    try {
        const { title, author, content, is_published } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        let newPost;
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .insert([{
                    title,
                    author: author || 'Admin',
                    content: content || '',
                    is_published: is_published || false,
                    published_at: is_published ? new Date().toISOString() : null,
                }])
                .select()
                .single();
            if (error) throw error;
            newPost = data;
        } catch (dbErr) {
            const posts = localDb.getBlogPosts();
            newPost = {
                id: `blog-${Date.now()}`,
                title, author: author || 'Admin', content: content || '',
                is_published: is_published || false,
                published_at: is_published ? new Date().toISOString() : null,
                created_at: new Date().toISOString()
            };
            posts.unshift(newPost);
            localDb.saveBlogPosts(posts);
        }
        res.status(201).json({ message: 'Blog post created', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog post', error: error.message });
    }
});

// PUT update blog post (admin)
router.put('/:id', async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.is_published && !updates.published_at) {
            updates.published_at = new Date().toISOString();
        }

        let updatedPost;
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .update(updates)
                .eq('id', req.params.id)
                .select()
                .single();
            if (error) throw error;
            updatedPost = data;
        } catch (dbErr) {
            const posts = localDb.getBlogPosts();
            const index = posts.findIndex(p => p.id === req.params.id);
            if (index === -1) return res.status(404).json({ message: 'Post not found' });
            posts[index] = { ...posts[index], ...updates };
            localDb.saveBlogPosts(posts);
            updatedPost = posts[index];
        }
        res.status(200).json({ message: 'Blog post updated', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog post', error: error.message });
    }
});

// DELETE blog post (admin)
router.delete('/:id', async (req, res) => {
    try {
        try {
            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', req.params.id);
            if (error) throw error;
        } catch (dbErr) {
            const posts = localDb.getBlogPosts();
            const filtered = posts.filter(p => p.id !== req.params.id);
            localDb.saveBlogPosts(filtered);
        }
        res.status(200).json({ message: 'Blog post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog post', error: error.message });
    }
});

module.exports = router;

