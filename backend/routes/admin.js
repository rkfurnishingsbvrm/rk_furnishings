const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const localDb = require('../lib/localDb');

router.get('/stats', async (req, res) => {
    let stats = { totalProducts: 0, totalBlogPosts: 0, recentConsultations: 0 };
    
    try {
        const [productsRes, blogRes, consultationsRes] = await Promise.all([
            supabase.from('products').select('id', { count: 'exact', head: true }),
            supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
            supabase.from('consultations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);
        
        if (productsRes.error || blogRes.error || consultationsRes.error) {
            throw new Error('Supabase stats error');
        }

        stats.totalProducts = productsRes.count || 0;
        stats.totalBlogPosts = blogRes.count || 0;
        stats.recentConsultations = consultationsRes.count || 0;
    } catch (dbErr) {
        console.log('🔄 Dashboard Stats: Switching to local fallback. Reason:', dbErr.message);
        try {
            stats.totalProducts = localDb.getProducts().length;
            stats.totalBlogPosts = localDb.getBlogPosts().length;
            stats.recentConsultations = localDb.getConsultations().filter(c => c.status === 'pending').length;
        } catch (localErr) {
            console.error('❌ Failed to compute local stats:', localErr.message);
        }
    }

    res.status(200).json(stats);
});

router.get('/settings', (req, res) => {
    try {
        const settings = localDb.getSettings();
        res.status(200).json(settings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

router.post('/settings', (req, res) => {
    try {
        const { adminPassword, contactNumber, supportEmail } = req.body;
        const currentSettings = localDb.getSettings();
        
        const newSettings = {
            adminPassword: adminPassword || currentSettings.adminPassword,
            contactNumber: contactNumber || currentSettings.contactNumber,
            supportEmail: supportEmail || currentSettings.supportEmail
        };
        
        localDb.saveSettings(newSettings);
        res.status(200).json({ message: 'Settings saved successfully', settings: newSettings });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save settings' });
    }
});


module.exports = router;
