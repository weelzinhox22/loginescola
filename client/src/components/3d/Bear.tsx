import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { Group, Mesh } from "three";

interface BearProps {
  isWatchingPassword: boolean;
}

export default function Bear({ isWatchingPassword }: BearProps) {
  const group = useRef<Group>(null);
  const leftPaw = useRef<Mesh>(null);
  const rightPaw = useRef<Mesh>(null);
  const leftEye = useRef<Mesh>(null);
  const rightEye = useRef<Mesh>(null);
  const head = useRef<Mesh>(null);
  
  // Animate bear based on isWatchingPassword state
  useEffect(() => {
    if (isWatchingPassword && leftPaw.current && rightPaw.current) {
      // Animate paws to cover eyes
      gsap.to(leftPaw.current.position, {
        x: -0.15,
        y: 0.55,
        z: 0.45,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      
      gsap.to(rightPaw.current.position, {
        x: 0.15,
        y: 0.55,
        z: 0.45,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      
      // Head tilts down slightly when covering eyes
      if (head.current) {
        gsap.to(head.current.rotation, {
          x: 0.3,
          duration: 0.5
        });
      }
    } else {
      // Return paws to original position
      if (leftPaw.current) {
        gsap.to(leftPaw.current.position, {
          x: -0.5,
          y: 0,
          z: 0.2,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
      }
      
      if (rightPaw.current) {
        gsap.to(rightPaw.current.position, {
          x: 0.5,
          y: 0,
          z: 0.2,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
      }
      
      // Head looks back up
      if (head.current) {
        gsap.to(head.current.rotation, {
          x: 0,
          duration: 0.5
        });
      }
    }
  }, [isWatchingPassword]);
  
  // Gentle idle animation
  useFrame((_, delta) => {
    if (group.current && !isWatchingPassword) {
      group.current.rotation.y += Math.sin(delta) * 0.01;
      
      if (head.current) {
        head.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
      }
    }
  });
  
  return (
    <group ref={group} position={[0, -1, 0]} scale={2}>
      {/* Bear body - brown sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Bear head - slightly larger brown sphere */}
      <mesh position={[0, 0.5, 0]} ref={head}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Bear ears */}
      <mesh position={[-0.25, 0.8, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh position={[0.25, 0.8, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Bear snout */}
      <mesh position={[0, 0.4, 0.3]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      
      {/* Bear nose */}
      <mesh position={[0, 0.4, 0.5]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Bear eyes */}
      <mesh position={[-0.15, 0.55, 0.35]} ref={leftEye}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      <mesh position={[0.15, 0.55, 0.35]} ref={rightEye}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Bear paws */}
      <mesh position={[-0.5, 0, 0.2]} ref={leftPaw}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh position={[0.5, 0, 0.2]} ref={rightPaw}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Bear legs */}
      <mesh position={[-0.3, -0.5, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh position={[0.3, -0.5, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}
