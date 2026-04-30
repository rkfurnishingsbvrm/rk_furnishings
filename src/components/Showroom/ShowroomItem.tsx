import { useBox } from "@react-three/cannon";
import { useStore } from "../../store/useStore";
import { useFrame } from "@react-three/fiber";
import { useState, useRef, Suspense } from "react";
import * as THREE from "three";
import { useKeyboard } from "../../hooks/useKeyboard";
import { Html, useTexture } from "@react-three/drei";

interface ShowroomItemProps {
  id: string;
  category: string;
  position: [number, number, number];
  rotation: [number, number, number];
  args: [number, number, number];
  color?: string;
  name: string;
  description: string;
  image?: string;
}

const ShelfStack = ({ url, args, segments = 6 }: { url: string, args: [number, number, number], segments?: number }) => {
  const texture = useTexture(url);
  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }

  return (
    <group>
      {Array.from({ length: segments }).map((_, i) => (
        <mesh key={i} position={[0, 0, (i * (args[2] / (segments * 1.2)))]} castShadow receiveShadow>
          <boxGeometry args={[args[0], args[1], 0.1]} />
          <meshStandardMaterial 
            map={texture} 
            color="#fff" 
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
};

const TexturedSurface = ({ url, args }: { url: string, args: [number, number, number] }) => {
  const texture = useTexture(url);
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial map={texture} color="#fff" roughness={0.4} metalness={0.1} />
    </mesh>
  );
};

export const ShowroomItem = ({ id, category, position, rotation, args, color = "#fff", name, description, image }: ShowroomItemProps) => {
  const [ref] = useBox(() => ({ type: "Static", position, rotation, args })) as any;
  const [hovered, setHovered] = useState(false);
  const { interactable, setInteractable, setSelectedProduct } = useStore();
  const interact = useStore((state) => state.keyboard.interact);

  const groupRef = useRef<THREE.Group>(null);
  const posVector = new THREE.Vector3(...position);

  useFrame((state) => {
    const distance = state.camera.position.distanceTo(posVector);
    const isClose = distance < 12;

    if (isClose !== hovered) {
        setHovered(isClose);
        if (isClose) setInteractable(id);
        else if (interactable === id) setInteractable(null);
    }

    if (isClose && interact) {
        setSelectedProduct({
            _id: id,
            name,
            description,
            category,
            images: image ? [image] : [],
            isFeatured: false,
            style: 'Bespoke'
        });
    }

    if (groupRef.current) {
        // Smooth lerped animation for scale and rotation when approaching
        const targetScale = isClose ? 1.05 : 1;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        
        const targetRotY = rotation[1];
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <group ref={ref}>
        <Suspense fallback={<mesh><boxGeometry args={args}/><meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} /></mesh>}>
           {image ? (
              (category === "Sofa Fabrics" || category === "Carpets & Rugs") ? (
                <ShelfStack url={image} args={args} />
              ) : (
                <TexturedSurface url={image} args={args} />
              )
           ) : (

             <mesh castShadow receiveShadow>
               <boxGeometry args={args} />
               <meshStandardMaterial color={color} roughness={0.2} metalness={1} emissive="#D4AF37" emissiveIntensity={hovered ? 0.3 : 0} />
             </mesh>
           )}
        </Suspense>
        
        {/* Modern Minimal Indicator */}
        <Html position={[0, args[1] / 2 + 1, 0]} center transform style={{ pointerEvents: 'none', transition: 'all 0.5s', opacity: hovered ? 1 : 0.4 }}>
            <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-all">
                <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20 shadow-2xl backdrop-blur-3xl animate-pulse">
                     <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,1)]" />
                </div>
                <div className="bg-black/90 text-white px-5 py-2 rounded-full border border-gold/10 backdrop-blur-xl flex items-center gap-3">
                    <span className="text-[7px] text-gold font-black uppercase tracking-[0.6em] whitespace-nowrap">{name}</span>
                </div>
            </div>
        </Html>
      </group>
    </group>
  );
};
