'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Suspense, useMemo, useRef, memo } from 'react';
import type { Mesh } from 'three';

interface Scene3DProps {
  username: string;
  primaryColor: string;
  rotationSpeed: number;
}

// Simple rotating ring
const RotatingRing = memo(function RotatingRing({ color, speed }: { color: string; speed: number }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * speed * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2, 0.008, 8, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
});

// Single floating shape
const FloatingShape = memo(function FloatingShape({ color, position }: { color: string; position: [number, number, number] }) {
  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh position={position}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </Float>
  );
});

const Scene = memo(function Scene({ primaryColor, rotationSpeed }: { primaryColor: string; rotationSpeed: number }) {
  const positions = useMemo((): [number, number, number][] => [
    [-1.8, 0.6, -1],
    [1.8, -0.4, -0.5],
  ], []);

  return (
    <>
      <ambientLight intensity={0.5} />
      {positions.map((pos, i) => (
        <FloatingShape key={i} color={primaryColor} position={pos} />
      ))}
      <RotatingRing color={primaryColor} speed={rotationSpeed} />
    </>
  );
});

export const Scene3D = memo(function Scene3D({ primaryColor, rotationSpeed }: Scene3DProps) {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          depth: false,
          stencil: false,
        }}
        dpr={1}
        style={{ background: 'transparent' }}
        performance={{ min: 0.3 }}
      >
        <Suspense fallback={null}>
          <Scene primaryColor={primaryColor} rotationSpeed={rotationSpeed} />
        </Suspense>
      </Canvas>
    </div>
  );
});
