import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'rk-auth-storage' }
  )
);

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'rk-cart-storage' }
  )
);

interface UIState {
  isAuthOpen: boolean;
  isCartOpen: boolean;
  toggleAuth: (open?: boolean) => void;
  toggleCart: (open?: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAuthOpen: false,
  isCartOpen: false,
  toggleAuth: (open) => set((state) => ({ isAuthOpen: open ?? !state.isAuthOpen })),
  toggleCart: (open) => set((state) => ({ isCartOpen: open ?? !state.isCartOpen })),
}));

interface ShowroomState {
  isLocked: boolean;
  setLocked: (locked: boolean) => void;
  interactable: string | null;
  setInteractable: (id: string | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  movementMode: 'free' | 'auto';
  setMovementMode: (mode: 'free' | 'auto') => void;
  keyboard: {
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    interact: boolean;
  };
  setKeyboard: (key: string, pressed: boolean) => void;
}

interface MeasurementState {
  measurements: any[];
  setMeasurements: (measurements: any[]) => void;
  recommendedSizing: { width: number; height: number } | null;
  setRecommendedSizing: (sizing: { width: number; height: number } | null) => void;
}

export const useMeasurementStore = create<MeasurementState>((set) => ({
  measurements: [],
  setMeasurements: (measurements) => set({ measurements }),
  recommendedSizing: null,
  setRecommendedSizing: (sizing) => set({ recommendedSizing: sizing }),
}));

export const useStore = create<ShowroomState>((set) => ({
  isLocked: false,
  setLocked: (locked) => set({ isLocked: locked }),
  interactable: null,
  setInteractable: (id) => set({ interactable: id }),
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  movementMode: 'free',
  setMovementMode: (mode) => set({ movementMode: mode }),
  keyboard: {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    interact: false,
  },
  setKeyboard: (key, pressed) => set((state) => {
    let action = '';
    switch (key) {
      case 'KeyW': case 'ArrowUp': action = 'moveForward'; break;
      case 'KeyS': case 'ArrowDown': action = 'moveBackward'; break;
      case 'KeyA': case 'ArrowLeft': action = 'moveLeft'; break;
      case 'KeyD': case 'ArrowRight': action = 'moveRight'; break;
      case 'KeyE': action = 'interact'; break;
    }
    if (!action) return state;
    return { keyboard: { ...state.keyboard, [action]: pressed } };
  }),
}));
