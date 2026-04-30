export interface Product {
    _id: string;
    name: string;
    category: string;
    description: string;
    images: string[];
    isFeatured: boolean;
    style: string;
    colors?: string[];
    materials?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Measurement {
  status: string;
  scale_info: {
      pixels_per_cm: number;
      reference_detected: boolean;
  };
  dimensions: {
      width_cm: number;
      height_cm: number;
  };
  bbox: [number, number, number, number] | null;
  img_size: [number, number];
  recommendation?: {
      recommended_width_cm: number;
      recommended_height_cm: number;
      panels: number;
      type: string;
  };
}
