
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

interface HologramAvatarProps {
  modelUrl: string;
  name?: string;
  role?: string;
  index: number;
  isSelected?: boolean;
}

const HologramAvatar: React.FC<HologramAvatarProps> = ({
  modelUrl,
  isSelected = false
}) => {
  const group = useRef<THREE.Group>(null);
  const glowGroupRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // ✅ Load GLB
  const { scene } = useGLTF(modelUrl);

  // ✅ Clone + Normalize Model
  const processedScene = useMemo(() => {
    if (!scene) return null;

    const clone = SkeletonUtils.clone(scene);

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 0.5;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 19.5 / maxDim;

    clone.scale.setScalar(scale);
    
    const bottomToZeroOffset = -center.y * scale + (size.y * scale / 2);
    
    clone.position.set(
      -center.x * scale,
      bottomToZeroOffset - 2.5, 
      -center.z * scale
    );

    return clone;
  }, [scene]);

  // ✅ Animations
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y += Math.sin(t * 0.25) * 0.002;
      
      if (isSelected) {
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, Math.sin(t * 1.1) * 0.45, 0.05);
      } else {
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.04);
      }
    }

    if (glowGroupRef.current) {
      const pulse = 1.0 + Math.sin(t * (isSelected ? 2.5 : 1.0)) * 0.1;
      glowGroupRef.current.scale.set(pulse, pulse, pulse);
      
      glowGroupRef.current.children.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          mat.opacity = isSelected ? 0.6 : 0.15;
        }
      });
    }

    if (pointLightRef.current) {
      const targetIntensity = isSelected ? 60 : 15;
      pointLightRef.current.intensity = THREE.MathUtils.lerp(pointLightRef.current.intensity, targetIntensity + Math.sin(t * 4) * 5, 0.1);
    }
  });

  if (!processedScene) return null;

  return (
    <group ref={group}>
      {/* 🔹 MODEL */}
      <primitive object={processedScene} />

      {/* 🔹 INTERACTIVE HITBOX (Ensures click detection) */}
      <mesh position={[0, 6, 0]} visible={false}>
        <boxGeometry args={[8, 18, 5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 🔹 LOCALIZED POINT LIGHT */}
      <pointLight
        ref={pointLightRef}
        position={[0, -2.4, 1.2]}
        color="#FF4D00"
        distance={15}
        decay={2}
        intensity={15}
      />

      {/* 🔹 NEOMORPHIC VOLUMETRIC GLOW */}
      <group ref={glowGroupRef} position={[0, -2.5, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.0, 32]} />
          <meshBasicMaterial 
            color="#FF4D00" 
            transparent 
            opacity={0.3} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5.5, 32]} />
          <meshBasicMaterial 
            color="#FF4D00" 
            transparent 
            opacity={0.1} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 🔹 PEDESTAL BASE */}
      <group position={[0, -2.5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.95, 4.05, 64]} />
          <meshBasicMaterial
            color={isSelected ? "#FF4D00" : "#ffffff"}
            transparent
            opacity={isSelected ? 1.0 : 0.2}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <circleGeometry args={[5.0, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
};

export default HologramAvatar;
