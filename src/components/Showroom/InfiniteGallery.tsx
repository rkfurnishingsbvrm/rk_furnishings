import React, { useMemo, useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { ShowroomItem } from './ShowroomItem';


interface Product {
    id: string;
    _id?: string;
    name: string;
    category: string;
    description: string;
    images?: string[];
    image?: string;
}

const CATEGORIES = ['Sofa Fabrics', 'Wallpapers', 'Blinds', 'Carpets & Rugs', 'Mattresses', 'Flooring'];

export const InfiniteGallery = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const data = await response.json();

                
                if (data && data.length > 0) {
                    const filtered = data.filter((p: any) => p.category !== 'Curtains');
                    setProducts(filtered.map((p: { id: string, _id: string, name: string, category: string, description: string, images?: string[], image?: string }) => ({
                        id: p.id || p._id,
                        name: p.name,
                        category: p.category,
                        description: p.description,
                        image: Array.isArray(p.images) ? p.images[0] : (p.image || '/images/premium/interior_1.png')
                    })));
                } else {
                    setProducts(generateMockLocal());
                }
            } catch (err) {
                console.error('Error fetching products for showroom:', err);
                setProducts(generateMockLocal());
            } finally {
                setLoading(false);
            }
        };

        const generateMockLocal = () => {
            const items: Product[] = [];
            const STYLES = ['Royal', 'Modern', 'Minimalist', 'Classic', 'Artisanal', 'Luxury'];
            
            CATEGORIES.forEach((cat, catIdx) => {
                for (let i = 1; i <= 15; i++) {
                    const style = STYLES[Math.floor(Math.random() * STYLES.length)];
                    items.push({
                        id: `mock-${catIdx}-${i}`,
                        name: `${style} ${cat} Series ${i}`,
                        category: cat,
                        description: `Premium ${style.toLowerCase()} design from our ${cat.toLowerCase()} collection.`,
                        image: '/images/premium/interior_1.png'
                    });
                }
            });
            return items;
        }

        fetchProducts();
    }, []);

    if (loading) return null;

    return (
        <group>
            {products.map((product, index) => {
                // Better dynamic layout for 100+ items
                // Distribute items in a 3D grid/aisles based on category
                const catIndex = CATEGORIES.indexOf(product.category);
                const aisleIndex = catIndex === -1 ? 0 : catIndex;
                
                // Count items in this category
                const categoryProducts = products.filter(p => p.category === product.category);
                const itemInCatIndex = categoryProducts.indexOf(product);
                
                // Position aisles at different Z positions
                const zPos = (aisleIndex - (CATEGORIES.length / 2)) * 18; // Spaced out aisles
                
                // Position items within an aisle along X axis, alternating sides (-Y and +Y for wall mount or just X?)
                // Let's place them along X axis
                const xPos = (itemInCatIndex - (categoryProducts.length / 2)) * 10;
                
                // Some categories (like curtains/wallpapers) might be "wall mounted"
                // For now, let's keep it simple: rows of "canvases" or pedestals.
                
                return (
                    <ShowroomItem 
                        key={product.id}
                        id={product.id}
                        category={product.category}
                        name={product.name}
                        description={product.description}
                        position={[xPos, 5, zPos]} 
                        rotation={[0, 0, 0]} 
                        args={[6, 8, 0.2]} 
                        image={product.image}
                    />
                );
            })}
        </group>
    );
};

