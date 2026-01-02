
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WIRE_COLOR = "rgba(255, 255, 255, 0.25)";
const GLOW_ORANGE = "#B1492C";
const GLOW_WHITE = "#FFFFFF";

interface CircuitPathProps {
  d: string;
  duration: number;
  delay: number;
  color: string;
}

const CircuitPath: React.FC<CircuitPathProps> = ({ d, duration, delay, color }) => (
  <g>
    <path d={d} fill="none" stroke={WIRE_COLOR} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
      animate={{ 
        pathLength: [0, 0.2, 0],
        pathOffset: [0, 1],
        opacity: [0, 1, 0]
      }}
      transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
    />
  </g>
);

const CircuitBoard = () => {
  const paths = useMemo(() => [
    { d: "M 0 200 H 1920", dur: 10, del: 0, col: GLOW_WHITE },
    { d: "M 0 540 H 1920", dur: 14, del: 2, col: GLOW_ORANGE },
    { d: "M 0 880 H 1920", dur: 12, del: 4, col: GLOW_WHITE },
    { d: "M 480 0 V 1080", dur: 15, del: 1, col: GLOW_WHITE },
    { d: "M 960 0 V 1080", dur: 18, del: 3, col: GLOW_ORANGE },
    { d: "M 1440 0 V 1080", dur: 13, del: 5, col: GLOW_WHITE },
    { d: "M 100 100 L 300 100 V 400 H 600", dur: 9, del: 0, col: GLOW_ORANGE },
    { d: "M 1820 100 L 1620 100 V 400 H 1320", dur: 11, del: 2, col: GLOW_WHITE },
    { d: "M 480 200 L 960 540 L 1440 200", dur: 12, del: 2, col: GLOW_ORANGE },
  ], []);

  return (
    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {paths.map((p, i) => <CircuitPath key={i} {...p} duration={p.dur} delay={p.del} color={p.col} />)}
    </svg>
  );
};

const FluidBackground: React.FC<{ state: 'intro' | 'cleared' }> = ({ state }) => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <CircuitBoard />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(177,73,44,0.05)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-screen pointer-events-none" />
    </div>
  );
};

export default FluidBackground;
