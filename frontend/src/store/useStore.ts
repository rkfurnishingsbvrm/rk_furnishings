import { create } from 'zustand';

interface ShowroomState {
  isLocked: boolean;
  setLocked: (locked: boolean) => void;
  interactable: string | null;
  setInteractable: (id: string | null) => void;
  selectedProduct: any | null;
  setSelectedProduct: (product: any | null) => void;
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
