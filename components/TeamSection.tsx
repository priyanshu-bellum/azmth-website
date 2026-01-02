
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { Suspense, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { X, Cpu, Fingerprint, Activity, ShieldCheck, Zap, Terminal } from 'lucide-react';
import * as THREE from 'three';
import HologramAvatar from './HologramAvatar';

interface TeamMember {
  id: string,
  name: string,
  role: string,
  bio: string,
  modelUrl: string
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: '01', name: 'DRON', role: 'Lead Architect', bio: 'Neural systems & OS Logic. Specialist in distributed AI clusters and ethical governor protocols.', modelUrl: '/Dron.glb' },
  { id: '02', name: 'PRIYANSHU', role: 'Hardware Engineering', bio: 'Strategic hardware integration. Designing the next generation of neural-link peripherals.', modelUrl: '/Priyanshu.glb' },
  { id: '03', name: 'BIPLAB', role: 'Biotech Integration', bio: 'Neural-interface specialist. Bridging the gap between organic synapses and silicon logic.', modelUrl: '/biplab.glb' },
  { id: '04', name: 'AYAN', role: 'Human Factors', bio: 'UX Lead focusing on empathy. Ensuring AI interactions feel natural, safe, and intuitively human.', modelUrl: '/ayan.glb' },
  { id: '05', name: 'NARGIS', role: 'Security Protocol', bio: 'Privacy-first architecture. Developing quantum-resistant encryption for the AZMTH ecosystem.', modelUrl: '/Nrgis.glb' },
  { id: '06', name: 'ALMAS', role: 'Full Stack Engineer', bio: 'Infrastructure lead. Architecting the global CDN and low-latency uplink for real-time AI agents.', modelUrl: '/almas.glb' },
  { id: '07', name: 'AKASH', role: 'Research Scientist', bio: 'Pioneering ML methodologies. Focus on unsupervised learning and self-optimizing neural nets.', modelUrl: '/Akash.glb' },
  { id: '08', name: 'ABHIRUP', role: 'Creative Technologist', bio: 'Artistic technical execution. Merging generative art with functional tech prototypes.', modelUrl: '/Abhirup.glb' },
  { id: '09', name: 'SOUMYAJIT', role: 'Systems Engineer', bio: 'High-performance computing expert. Managing the core compute fabric of the AZMTH OS.', modelUrl: '/Soumyajit.glb' },
  { id: '10', name: 'SIDDHART', role: 'Product Designer', bio: 'Intuitive interface crafting. Design lead for the 2026 hardware lineup.', modelUrl: '/Siddhart.glb' },
  { id: '11', name: 'JAYJIT', role: 'Backend Architect', bio: 'Robust API development. Scaling the intelligence layer for millions of concurrent connections.', modelUrl: '/Jayjit.glb' },
];

// Preload models
TEAM_MEMBERS.forEach(m => useGLTF.preload(m.modelUrl));

const LoadingOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

/**
 * Futuristic Info HUD Overlay - Maximum Transparency
 */
const MemberHUD = ({ member, onClose }: { member: TeamMember, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 pointer-events-auto overflow-hidden"
    >
      {/* ultra-light Backdrop - Allowing background to shine through */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" onClick={onClose} />
      
      {/* Detail Container - Ghost-like translucency */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        className="relative w-full max-w-6xl h-full max-h-[85vh] bg-transparent border border-[#B1492C]/40 shadow-[0_0_80px_rgba(177,73,44,0.05)] flex flex-col md:flex-row overflow-hidden"
      >
        {/* Fine-grained Grid - subtle but present */}
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(#B1492C 1px, transparent 1px), linear-gradient(90deg, #B1492C 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
        
        {/* Subtle Scanlines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        {/* Sharp Glowing Corners - Frame elements */}
        <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#B1492C] shadow-[0_0_15px_#B1492C]" />
        <div className="absolute top-0 left-0 w-[2px] h-12 bg-[#B1492C] shadow-[0_0_15px_#B1492C]" />
        <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-[#B1492C] shadow-[0_0_15px_#B1492C]" />
        <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-[#B1492C] shadow-[0_0_15px_#B1492C]" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 bg-black/40 border border-[#B1492C]/40 text-[#B1492C] hover:bg-[#B1492C] hover:text-white transition-all shadow-xl group rounded-sm backdrop-blur-md"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </button>

        {/* Sidebar Diagnostics - Ghost style */}
        <div className="hidden md:flex w-20 border-r border-[#B1492C]/20 flex-col items-center py-12 gap-10 text-[#B1492C]/50 bg-white/[0.02]">
           <Terminal className="w-5 h-5 animate-pulse" />
           <Activity className="w-5 h-5" />
           <Cpu className="w-5 h-5" />
           <Fingerprint className="w-5 h-5" />
           <div className="flex-1 w-px bg-gradient-to-b from-[#B1492C]/30 to-transparent my-4" />
           <div className="text-[7px] font-mono vertical-text tracking-widest opacity-40">UPLINK_TRANSPARENT</div>
        </div>

        {/* Main Info */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="px-2 py-0.5 border border-[#B1492C]/60 text-[#B1492C] font-mono text-[9px] uppercase tracking-widest bg-black/20">UPLINK: AZMTH_{member.id}</span>
              <div className="flex-1 h-[1px] bg-[#B1492C]/15" />
            </div>

            <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase mb-2 leading-[0.8] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              {member.name}
            </h2>
            
            <p className="text-[#B1492C] font-mono uppercase tracking-[0.4em] text-lg md:text-2xl mb-10 font-black drop-shadow-md">
              {member.role}
            </p>
            
            <p className="text-white text-lg md:text-2xl font-light leading-relaxed max-w-4xl mb-14 border-l-2 border-[#B1492C]/80 pl-8 bg-black/10 py-4 shadow-sm backdrop-blur-[1px]">
              {member.bio}
            </p>

            {/* Technical Detail Grid - Outlined only */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-white/[0.03] border border-[#B1492C]/30 backdrop-blur-[1px]">
              {[
                { label: 'Uplink', value: 'Prime', icon: Zap },
                { label: 'Sync Rate', value: '99.9%', icon: Activity },
                { label: 'Auth Check', value: 'Root', icon: ShieldCheck },
                { label: 'Latency', value: '0.04ms', icon: Terminal }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-3.5 h-3.5 text-[#B1492C]" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#B1492C] opacity-80">{stat.label}</span>
                  </div>
                  <span className="text-xl md:text-2xl text-white font-mono tracking-tighter font-bold drop-shadow-md">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Metadata Footer */}
        <div className="absolute bottom-0 right-0 p-8 flex gap-12 pointer-events-none opacity-40">
           <div className="font-mono text-[9px] text-[#B1492C] leading-tight">
             NODE: AZ-{member.id}<br/>
             ALPHA_LAYER_TRANS
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AnimatedMember = ({ 
  member, 
  index, 
  selectedIndex, 
  onSelect 
}: { 
  member: TeamMember, 
  index: number, 
  selectedIndex: number, 
  onSelect: (idx: number) => void 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const isSelected = selectedIndex === index;
  
  const horizontalSpacing = 9.8;
  const targetX = (index - selectedIndex) * horizontalSpacing;
  const targetZ = isSelected ? 4.5 : -4.0 - Math.pow(Math.abs(index - selectedIndex), 1.2) * 1.2;

  useFrame(() => {
    if (groupRef.current) {
      const lerpSpeed = 0.05; 
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, lerpSpeed);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, lerpSpeed);
      
      const targetRotationY = isSelected ? 0 : (index - selectedIndex) * -0.12;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, lerpSpeed);
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
    >
      <HologramAvatar 
        modelUrl={member.modelUrl} 
        index={index} 
        isSelected={isSelected}
      />
    </group>
  );
};

const TeamSection: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(5);
  const [detailMember, setDetailMember] = useState<TeamMember | null>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setDetailMember(TEAM_MEMBERS[index]);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col justify-center overflow-visible pointer-events-auto">
      <div className="w-full h-full relative overflow-visible z-10">
        <Suspense fallback={<LoadingOverlay />}>
          <Canvas 
            camera={{ position: [0, 4.0, 24], fov: 70 }} 
            dpr={[1, 2]}
            shadows
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ambientLight intensity={2.6} />
            <pointLight position={[0, 40, 50]} intensity={8} />
            <spotLight position={[0, 80, 50]} angle={1.0} penumbra={1} intensity={25} castShadow />
            
            <group position={[0, -8.5, 0]}>
              {TEAM_MEMBERS.map((member, index) => (
                <AnimatedMember 
                  key={member.id} 
                  member={member} 
                  index={index} 
                  selectedIndex={selectedIndex} 
                  onSelect={handleSelect} 
                />
              ))}
            </group>

            <Environment preset="city" />
            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={1000} blur={25} far={200} />
          </Canvas>
        </Suspense>
      </div>

      <AnimatePresence>
        {detailMember && (
          <MemberHUD 
            member={detailMember} 
            onClose={() => setDetailMember(null)} 
          />
        )}
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-5 z-30">
        {TEAM_MEMBERS.map((_, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`h-3 rounded-full transition-all duration-700 border border-white/10 ${selectedIndex === i ? 'bg-[#B1492C] w-32 shadow-[0_0_25px_rgba(177,73,44,0.8)]' : 'bg-white/20 w-8 opacity-30 hover:opacity-60'}`}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none opacity-95" />
    </div>
  );
};

export default TeamSection;
