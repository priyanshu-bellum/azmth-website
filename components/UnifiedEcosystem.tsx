
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

const EcosystemNode = ({ label, x, y, size = "md", delay = 0 }: { label: string, x: string, y: string, size?: "sm" | "md", delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    whileTap={{ scale: 0.94, y: 3 }}
    /* Fix: Removed invalid 'whileTap' property from transition object. Framer Motion transition keys must be animatable properties. */
    transition={{ 
      opacity: { delay: 1 + delay },
      scale: { type: "spring", damping: 15, stiffness: 150, delay: 1 + delay },
      y: { type: "spring", damping: 15, stiffness: 150, delay: 1 + delay }
    }}
    style={{ left: x, top: y }}
    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-target origin-center"
  >
    <div className={`
      ${size === 'sm' ? 'px-3 py-1 text-[9px] md:text-[10px]' : 'px-4 py-2 text-[10px] md:text-xs'}
      bg-black/90 backdrop-blur-xl border border-white/20 text-white font-mono uppercase tracking-widest
      rounded-sm whitespace-nowrap group-hover:border-[#B1492C] group-hover:text-[#B1492C] transition-all duration-300 cursor-default
      shadow-[0_0_15px_rgba(0,0,0,0.5)]
    `}>
      {label}
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/5 blur-xl rounded-full -z-10 group-hover:bg-[#B1492C]/20 transition-colors" />
  </motion.div>
);

const ConnectionLines = () => {
  // Map out the node center points for the SVG lines
  const nodes = [
    { x: 15, y: 30 }, { x: 15, y: 60 }, { x: 30, y: 85 }, 
    { x: 50, y: 95 }, { x: 70, y: 85 }, { x: 85, y: 70 }, 
    { x: 85, y: 40 }, { x: 70, y: 15 }
  ];

  return (
    <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="lineGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B1492C" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      {nodes.map((node, i) => (
        <motion.line
          key={i}
          x1="50" y1="50"
          x2={node.x} y2={node.y}
          stroke="url(#lineGrad)"
          strokeWidth="0.15"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 0.8 + (i * 0.1), ease: "easeInOut" }}
        />
      ))}
      <motion.circle 
        cx="50" cy="50" r="48" 
        fill="none" stroke="white" strokeWidth="0.05" 
        strokeDasharray="1 2"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.1, rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};

const UnifiedEcosystem: React.FC = () => {
  return (
    <div className="relative w-full aspect-square max-w-[500px] md:max-w-[700px] mx-auto flex items-center justify-center">
      {/* Central Core */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        /* Fix: Removed invalid 'whileTap' property from transition object. */
        transition={{ 
          scale: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }
        }}
        className="relative z-30 w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#B1492C] flex items-center justify-center text-center p-4 md:p-8 shadow-[0_0_80px_rgba(177,73,44,0.5)] border border-white/20 cursor-target origin-center"
      >
        <div className="font-heading font-black text-white text-xs md:text-base uppercase leading-tight tracking-tighter">
          Unified AI<br/>Operating System
          <span className="block mt-2 text-[7px] md:text-[9px] font-mono opacity-80 tracking-widest">The Intelligence Layer</span>
        </div>
        
        {/* Pulsing Aura */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-[#B1492C] blur-2xl -z-10"
        />
      </motion.div>

      {/* Rotating Circles Layer */}
      {[1, 2, 3].map((layer) => (
        <motion.div
          key={layer}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + (layer * 0.2), duration: 2 }}
          className="absolute inset-0 rounded-full border border-white/[0.05]"
          style={{ margin: `${layer * 10}%` }}
        >
          <motion.div
            animate={{ rotate: layer % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 40 + (layer * 20), repeat: Infinity, ease: "linear" }}
            className="w-full h-full relative"
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/20 rounded-full shadow-[0_0_10px_white]" />
          </motion.div>
        </motion.div>
      ))}

      {/* Nodes based on diagram - Staggered entrance */}
      <EcosystemNode label="Humanoid Integration" x="15%" y="30%" size="sm" delay={0.1} />
      <EcosystemNode label="AI Calling & CRM" x="15%" y="60%" delay={0.2} />
      <EcosystemNode label="Earbuds" x="30%" y="85%" size="sm" delay={0.3} />
      <EcosystemNode label="Wearables" x="50%" y="95%" delay={0.4} />
      <EcosystemNode label="Nano-biotech" x="70%" y="85%" size="sm" delay={0.5} />
      <EcosystemNode label="Glasses" x="85%" y="70%" size="sm" delay={0.6} />
      <EcosystemNode label="Consumer AI App" x="85%" y="40%" delay={0.7} />
      <EcosystemNode label="B-Cap (BCI)" x="70%" y="15%" size="sm" delay={0.8} />

      {/* Connecting Lines with draw animation */}
      <ConnectionLines />

      {/* Layer Labels - Fading in last */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[4%] left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-white/40 whitespace-nowrap">Outer Layer: Frontier Tech</div>
        <div className="absolute top-[16%] left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">Layer 2: Hardware</div>
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">Layer 1: Applications</div>
      </motion.div>
    </div>
  );
};

export default UnifiedEcosystem;
