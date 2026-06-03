// src/components/ThreeBackground.tsx
"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate coordinates for 350 particles in 3D space
  const [positions] = useState(() => {
    const pos = new Float32Array(350 * 3);
    for (let i = 0; i < 350 * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 8; // Spread particles
    }
    return pos;
  });

  // Slow rotation loop driven by delta frame timing
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.02;
      ref.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#7c3aed"
        size={0.04}
        sizeAttenuation={true}
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ThreeBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        background: "radial-gradient(circle at 50% 50%, #0c0a1a 0%, #020205 100%)"
      }}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
