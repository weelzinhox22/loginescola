import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { Group, Mesh, MeshStandardMaterial, Color } from "three";

interface PlantProps {
  growthFactor: number;
}

export default function Plant({ growthFactor }: PlantProps) {
  const pot = useRef<Group>(null);
  const plant = useRef<Group>(null);
  const leaves = useRef<Group>(null);
  
  // Animate plant growth when growthFactor changes
  useEffect(() => {
    if (plant.current && leaves.current) {
      // Scale plant based on growth factor
      gsap.to(plant.current.scale, {
        y: 0.2 + growthFactor * 1.8,
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Scale leaves based on growth factor
      gsap.to(leaves.current.scale, {
        x: 0.8 + growthFactor * 0.5,
        y: 0.8 + growthFactor * 0.5, 
        z: 0.8 + growthFactor * 0.5,
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Change leaf color to be more vibrant as it grows
      const leafMeshes = leaves.current.children;
      for (let i = 0; i < leafMeshes.length; i++) {
        const mesh = leafMeshes[i] as Mesh;
        if (mesh.material) {
          const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          // Handle color animation safely
          if (material instanceof MeshStandardMaterial && material.color) {
            gsap.to(material.color, {
              r: 0.2,
              g: 0.5 + growthFactor * 0.3,
              b: 0.1,
              duration: 0.8
            });
          }
        }
      }
    }
  }, [growthFactor]);
  
  // Gentle swaying animation
  useFrame((_, delta) => {
    if (plant.current) {
      plant.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
    }
    
    if (leaves.current) {
      leaves.current.rotation.z = Math.sin(Date.now() * 0.0015) * 0.03;
    }
  });
  
  return (
    <group position={[0, -1, 0]}>
      {/* Pot */}
      <group ref={pot}>
        {/* Pot body */}
        <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.7, 1, 32]} />
          <meshStandardMaterial color="#964B00" />
        </mesh>
        
        {/* Pot rim */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.5, 0.1, 16, 100]} />
          <meshStandardMaterial color="#964B00" />
        </mesh>
        
        {/* Dirt */}
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.48, 32]} />
          <meshStandardMaterial color="#3B2D1F" />
        </mesh>
      </group>
      
      {/* Plant stem */}
      <group ref={plant} position={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 1, 8]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
        
        {/* Plant leaves */}
        <group ref={leaves} position={[0, 1, 0]} scale={[0.8, 0.8, 0.8]}>
          {/* Leaf 1 */}
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
          
          {/* Leaf 2 */}
          <mesh position={[-0.2, 0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
          
          {/* Leaf 3 */}
          <mesh position={[0, 0.1, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
            <sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
          
          {/* Leaf 4 */}
          <mesh position={[0, 0.2, -0.2]} rotation={[-Math.PI / 4, 0, 0]}>
            <sphereGeometry args={[0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
          
          {/* Top leaf */}
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[0.15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
        </group>
      </group>
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </group>
  );
}
