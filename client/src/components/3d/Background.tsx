import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export default function Background() {
  const group = useRef<Group>(null);
  
  // Simple animation for the background
  useFrame((_, delta) => {
    if (group.current) {
      // Gentle rotation of the entire scene
      group.current.rotation.y += delta * 0.05;
    }
  });
  
  // Create a simple school-themed background
  return (
    <group ref={group}>
      {/* Create a simple grid of colored spheres */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i % 5) * 2 - 4;
        const y = Math.floor(i / 5) * 2 - 4;
        const color = [
          '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#A855F7', '#EC4899'
        ][i % 6];
        
        return (
          <mesh key={i} position={[x, y, -5]} scale={0.5}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
      
      {/* Add some larger geometric shapes */}
      <mesh position={[0, 0, -10]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[10, 10, 0.1]} />
        <meshStandardMaterial color="#4338ca" opacity={0.1} transparent={true} />
      </mesh>
      
      <mesh position={[5, -5, -8]} rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[2, 0.5, 16, 100]} />
        <meshStandardMaterial color="#60a5fa" opacity={0.7} transparent={true} />
      </mesh>
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />
    </group>
  );
}
