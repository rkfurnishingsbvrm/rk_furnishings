const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase'); // uses service key
const localDb = require('../lib/localDb');

// GET all products (admin - all statuses)
router.get('/', async (req, res) => {
    const { category, featured } = req.query;
    let data = [];
    
    try {
        console.log('🔍 Attempting to fetch products from Supabase...');
        let query = supabase.from('products').select('*').order('created_at', { ascending: false });
        if (category) query = query.eq('category', category);
        if (featured !== undefined) query = query.eq('is_featured', featured === 'true');
        
        const { data: cloudData, error } = await query;
        
        if (error || !cloudData || cloudData.length === 0) {
            console.log('⚠️ Supabase fetch was empty or failed. Switching to local fallback.');
            throw new Error(error ? error.message : 'No data');
        }
        
        // Merge cloud data with local data for Curtains and Wallpapers
        const localData = localDb.getProducts();
        
        // 1. Ensure Curtains are merged if missing
        const hasCurtains = cloudData.some(p => p.category === 'Curtains');
        const curtainsToMerge = !hasCurtains ? localData.filter(p => p.category === 'Curtains') : [];
        
        // 2. Ensure E-Joy Wallpapers are merged (since they are local-only for now)
        const hasEJoy = cloudData.some(p => p.name?.includes('E-Joy'));
        const wallpapersToMerge = !hasEJoy ? localData.filter(p => p.category === 'Wallpapers' && p.name?.includes('E-Joy')) : [];
        
        data = [...cloudData, ...curtainsToMerge, ...wallpapersToMerge];
    } catch (dbErr) {
        console.log('🔄 Local fallback triggered. Reason:', dbErr.message);
        try {
            data = localDb.getProducts();
            if (category) data = data.filter(p => p.category === category);
            if (featured !== undefined) data = data.filter(p => p.is_featured === (featured === 'true'));
            
            // Safe sort
            data.sort((a, b) => {
                const dateA = new Date(a.created_at || 0).getTime();
                const dateB = new Date(b.created_at || 0).getTime();
                return dateB - dateA;
            });
        } catch (localErr) {
            console.error('❌ Local fallback failed:', localErr.message);
            data = [];
        }
    }

    res.status(200).json(data);
});


// GET all categories
router.get('/categories', async (req, res) => {
    try {
        let data, error;
        try {
            const result = await supabase.from('categories').select('*').order('name');
            data = result.data;
            error = result.error;
            if (error) throw error;
        } catch (dbErr) {
            data = [
                { name: 'Curtains' }, { name: 'Sofa Fabrics' }, { name: 'Wallpapers' },
                { name: 'Blinds' }, { name: 'Carpets & Rugs' }, { name: 'Mattresses' }, { name: 'Flooring' }
            ];
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// GET single product by id
router.get('/:id', async (req, res) => {
    try {
        let data, error;
        try {
            const result = await supabase.from('products').select('*').eq('id', req.params.id).single();
            data = result.data;
            error = result.error;
            if (error) throw error;
            if (!data) throw new Error('Not found');
        } catch (dbErr) {
            data = localDb.getProducts().find(p => p.id === req.params.id);
        }
        
        if (!data) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// POST create product (admin)
router.post('/', async (req, res) => {
    try {
        const { name, category, description, images, materials, colors, is_featured, price } = req.body;
        if (!name || !category || !description) {
            return res.status(400).json({ message: 'name, category, and description are required' });
        }

        let newProduct;
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([{ 
                    name, category, description, price: price || 0,
                    images: images || [], materials, colors: colors || [], 
                    is_featured: is_featured || false 
                }])
                .select()
                .single();
            if (error) throw error;
            newProduct = data;
        } catch (dbErr) {
            const products = localDb.getProducts();
            newProduct = {
                id: `local-${Date.now()}`,
                name, category, description,
                price: price || 0,
                images: images || [],
                materials,
                colors: colors || [],
                is_featured: is_featured || false,
                created_at: new Date().toISOString()
            };
            products.unshift(newProduct);
            localDb.saveProducts(products);
        }

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// PUT update product (admin)
router.put('/:id', async (req, res) => {
    try {
        let updatedProduct;
        try {
            const { data, error } = await supabase.from('products').update(req.body).eq('id', req.params.id).select().single();
            if (error) throw error;
            updatedProduct = data;
        } catch (dbErr) {
            const products = localDb.getProducts();
            const index = products.findIndex(p => p.id === req.params.id);
            if (index === -1) return res.status(404).json({ message: 'Product not found' });
            products[index] = { ...products[index], ...req.body };
            localDb.saveProducts(products);
            updatedProduct = products[index];
        }
        res.status(200).json({ message: 'Product updated', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// DELETE product (admin)
router.delete('/:id', async (req, res) => {
    try {
        try {
            const { error } = await supabase.from('products').delete().eq('id', req.params.id);
            if (error) throw error;
        } catch (dbErr) {
            const products = localDb.getProducts();
            const filtered = products.filter(p => p.id !== req.params.id);
            localDb.saveProducts(filtered);
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;

