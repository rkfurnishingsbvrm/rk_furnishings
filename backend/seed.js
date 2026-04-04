const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const designStyles = ['Royal', 'Modern', 'Minimalist', 'Classic', 'Artisanal', 'Luxury', 'Vintage', 'Contemporary', 'Elite', 'Bespoke'];
const fabricMaterials = ['Velvet', 'Silk', 'Linen', 'Jacquard', 'Cotton Blend', 'Suede', 'Damask', 'Polyester'];
const wallpaperTypes = ['Floral', 'Geometric', 'Textured', 'Metallic', 'Abstract', 'Minimal', 'Damask', 'Nature-inspired'];

const categoriesData = [
    { name: 'Curtains', image: '/images/curtains.png', description: 'Elegant window treatments for every room.' },
    { name: 'Wallpapers', image: '/images/wallpaper.png', description: 'Designer wall coverings with premium textures.' },
    { name: 'Sofa Fabrics', image: '/images/sofa.png', description: 'Durable and stylish fabrics for sofas and furniture.' },
    { name: 'Blinds', image: '/images/inspiration1.png', description: 'Modern and functional window blinds.' },
    { name: 'Flooring', image: '/images/inspiration2.png', description: 'Premium wooden and vinyl flooring solutions.' }
];

const generateProducts = () => {
    const products = [];
    const curtainImages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    categoriesData.forEach((cat) => {
        for (let i = 1; i <= 20; i++) {
            let name, description, materials, colors, images;
            const style = designStyles[Math.floor(Math.random() * designStyles.length)];

            if (cat.name === 'Curtains') {
                const material = fabricMaterials[Math.floor(Math.random() * fabricMaterials.length)];
                name = `${style} ${material} Drapes - Series ${i}`;
                description = `Exquisite ${style.toLowerCase()} curtains made from premium ${material.toLowerCase()}. Tailored specifically for high-end interiors in Bhimavaram.`;
                materials = material;
                images = [`/images/curtains/${curtainImages[(i - 1) % curtainImages.length]}.jpeg`];
                colors = ['Gold', 'Cream', 'Charcoal', 'Navy', 'Maroon'].sort(() => 0.5 - Math.random()).slice(0, 3);
            } else if (cat.name === 'Wallpapers') {
                const type = wallpaperTypes[Math.floor(Math.random() * wallpaperTypes.length)];
                name = `${style} ${type} Wallpaper - Design ${i}`;
                description = `A ${style.toLowerCase()} ${type.toLowerCase()} pattern wallpaper. Adds depth and luxury to any vertical surface. High durability and premium finish.`;
                materials = 'Vinyl / Non-woven';
                images = ['/images/wallpaper.png'];
                colors = ['Metallic', 'Matte White', 'Shadow Gray', 'Pearl'].sort(() => 0.5 - Math.random()).slice(0, 2);
            } else if (cat.name === 'Sofa Fabrics') {
                const material = fabricMaterials[Math.floor(Math.random() * fabricMaterials.length)];
                name = `${style} ${material} Fabric - Collection ${i}`;
                description = `Heavy-duty ${material.toLowerCase()} fabric with a ${style.toLowerCase()} finish. Perfect for sofas, chairs, and custom furniture pieces.`;
                materials = material;
                images = ['/images/sofa.png'];
                colors = ['Beige', 'Emerald', 'Slate', 'Rust', 'Coffee'].sort(() => 0.5 - Math.random()).slice(0, 3);
            } else {
                name = `${style} ${cat.name} Series ${i}`;
                description = `Premium ${cat.name.toLowerCase()} from our ${style.toLowerCase()} collection. Designed for aesthetics and longevity.`;
                materials = 'High-grade Composite';
                images = [cat.image];
                colors = ['Natural', 'Standard'].sort(() => 0.5 - Math.random()).slice(0, 2);
            }

            products.push({
                name,
                category: cat.name,
                description,
                images,
                materials,
                colors,
                is_featured: i <= 5,
            });
        }
    });

    return products;
};

const seedDB = async () => {
    try {
        console.log('🔄 Clearing existing data...');

        // Clear in correct order (products reference categories)
        await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('blog_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('consultations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        console.log('✅ Cleared existing data');

        // Seed categories
        const { data: cats, error: catError } = await supabase
            .from('categories')
            .insert(categoriesData)
            .select();

        if (catError) throw catError;
        console.log(`✅ ${cats.length} categories created`);

        // Seed products in batches of 50
        const products = generateProducts();
        const batchSize = 50;
        let productCount = 0;

        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            const { data, error } = await supabase
                .from('products')
                .insert(batch)
                .select();

            if (error) throw error;
            productCount += data.length;
        }
        console.log(`✅ ${productCount} products created`);

        // Seed blog posts
        const blogPosts = [
            { title: 'The Art of Selecting Velvet Curtains', author: 'Admin', content: 'Velvet curtains bring unmatched richness to any interior...', is_published: true, published_at: '2026-03-08' },
            { title: 'Trending Wallpapers for 2026', author: 'Lead Designer', content: 'This year is all about textured botanicals and metallic geometrics...', is_published: true, published_at: '2026-02-28' },
            { title: 'Understanding Upholstery Maintenance', author: 'Admin', content: 'Proper care extends the life of your upholstery by years...', is_published: true, published_at: '2026-01-15' },
        ];

        const { data: blogs, error: blogError } = await supabase
            .from('blog_posts')
            .insert(blogPosts)
            .select();

        if (blogError) throw blogError;
        console.log(`✅ ${blogs.length} blog posts created`);

        console.log('\n🎉 Database seeded with 100 designs successfully!');
    } catch (error) {
        console.error('❌ Error seeding cloud database:', error.message);
        console.log('🔄 Attempting to seed local database...');
        try {
            const localDb = require('./lib/localDb');
            const products = generateProducts();
            // Assign some IDs for local
            products.forEach((p, idx) => p.id = `local-seed-${idx}`);
            localDb.saveProducts(products);
            console.log('✅ Local database seeded successfully!');
        } catch (localErr) {
            console.error('❌ Failed to seed local database:', localErr.message);
        }
    } finally {
        process.exit();
    }
};

seedDB();

