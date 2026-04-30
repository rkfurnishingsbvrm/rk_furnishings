/**
 * Structured Record for RK Furnishings Curtain Catalog
 * Supporting AI Feature Extraction and AR Visualization
 */

export type CurtainStyle = 
  | 'Modern' 
  | 'Royal' 
  | 'Minimalist' 
  | 'Vintage' 
  | 'Contemporary' 
  | 'Artisanal' 
  | 'Luxury' 
  | 'Classic' 
  | 'Elite' 
  | 'Bespoke';

export type PatternType = 
  | 'Plain' 
  | 'Floral' 
  | 'Textured' 
  | 'Geometric' 
  | 'Abstract' 
  | 'Damask';

export type FabricType = 
  | 'Silk' 
  | 'Velvet' 
  | 'Polyester' 
  | 'Suede' 
  | 'Jacquard' 
  | 'Cotton Blend' 
  | 'Linen' 
  | 'Damask';

export interface CurtainProduct {
  id: string;
  name: string;
  style: CurtainStyle;
  fabric: FabricType;
  pattern: PatternType;
  colors: string[]; // Primary colors for AI matching
  price: string;    // Display price or "Consult Stylist"
  imagePath: string; // Used as poster in 3D viewer
  modelUrl: string;  // GLB model for AR visualization
  description: string;
  isFeatured: boolean;
}

/**
 * Filter Rules for AI Matching Engine
 */
export interface RecommendationRules {
  wallColorMatch: 'complementary' | 'monochromatic' | 'contrast';
  styleAlignment: CurtainStyle[];
  lightSuitability: 'sheer' | 'blackout' | 'balanced';
}
