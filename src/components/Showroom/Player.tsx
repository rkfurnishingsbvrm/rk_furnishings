import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { Vector3 } from "three";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useStore } from "../../store/useStore";

const SPEED = 4;

export const Player = () => {
  const { camera } = useThree();
  const selectedProduct = useStore((state) => state.selectedProduct);
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 2, 0],
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

  const { moveForward, moveBackward, moveLeft, moveRight } = useStore((state) => state.keyboard);

  useFrame(() => {
    // Sync camera with physics body
    camera.position.copy(new Vector3(pos.current[0], pos.current[1] + 0.75, pos.current[2]));

    // Disable movement if UI is open or selection exists
    if (selectedProduct) {
        api.velocity.set(0, velocity.current[1], 0);
        return;
    }

    const direction = new Vector3();
    const frontVector = new Vector3(
      0,
      0,
      Number(moveBackward) - Number(moveForward)
    );
    const sideVector = new Vector3(
      Number(moveLeft) - Number(moveRight),
      0,
      0
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyQuaternion(camera.quaternion);

    api.velocity.set(direction.x, velocity.current[1], direction.z);
    
    // Simple head bobbing
    if (moveForward || moveBackward || moveLeft || moveRight) {
        camera.position.y += Math.sin(Date.now() * 0.01) * 0.05;
    }
  });

  return <mesh ref={ref as any} />;
};

