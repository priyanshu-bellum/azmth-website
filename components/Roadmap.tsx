
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

const MILESTONES = [
  { year: '2025', title: 'B2B Platform Live', desc: 'Scale enterprise customer base.', status: 'current' },
  { year: 'Early 2026', title: 'Consumer App Launch', desc: 'Introduce personalised AI assistant.', status: 'future' },
  { year: 'Late 2026', title: 'AI Hardware Ecosystem', desc: 'First-gen earbuds and wearables.', status: 'future' },
  { year: '2028', title: 'Humanoid Integration', desc: 'R&D for physical-world AI assistance.', status: 'future' },
  { year: '2029-2030', title: 'Frontier Technologies', desc: 'B-Cap and nano-biotech applications.', status: 'future' },
];

const Roadmap: React.FC = () => {
  return (
    <div className="relative py-20 overflow-x-auto hide-scrollbar">
      <div className="min-w-[1000px] px-12 relative">
        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
        
        <div className="flex justify-between relative z-10">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center w-48"
            >
              <div className={`
                w-4 h-4 rounded-full mb-6 border-2 
                ${m.status === 'current' ? 'bg-[#B85C38] border-[#B85C38]' : 'bg-black border-white/20'}
              `} />
              
              <span className={`font-mono text-sm mb-2 ${m.status === 'current' ? 'text-[#B85C38]' : 'text-gray-500'}`}>
                {m.year}
              </span>
              <h4 className="font-heading font-black text-white uppercase text-sm mb-2 tracking-tight">
                {m.title}
              </h4>
              <p className="text-[10px] text-gray-500 font-mono leading-relaxed px-4">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
