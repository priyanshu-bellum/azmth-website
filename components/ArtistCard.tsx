/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { ServiceItem } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ServiceCardProps {
  artist: ServiceItem; // Keeping prop name generic to minimize refactoring friction, but represents ServiceItem
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ artist: service, onClick }) => {
  return (
    <motion.div
      className="group relative h-[350px] md:h-[400px] w-full overflow-hidden border-b md:border-r border-white/10 bg-black cursor-pointer flex flex-col"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
        {/* Background - subtle tech grid or darkness */}
        <div className="absolute inset-0 bg-neutral-900/50" />
        
        {/* Abstract Image Overlay - heavily muted */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 mix-blend-screen">
             <img src={service.image} alt="" className="w-full h-full object-cover grayscale contrast-125" />
        </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
           <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/60 border border-white/20 px-2 py-1 bg-black/50 backdrop-blur-md">
             {service.phase}
           </span>
           <motion.div
             variants={{
               rest: { opacity: 0.5, scale: 1 },
               hover: { opacity: 1, scale: 1.1, rotate: 45 }
             }}
             className="text-white"
           >
             <ArrowUpRight className="w-5 h-5" />
           </motion.div>
        </div>

        <div>
          <motion.h3 
            className="font-heading text-2xl md:text-3xl font-bold uppercase text-white mb-2"
            variants={{
              rest: { x: 0 },
              hover: { x: 5 }
            }}
          >
            {service.title}
          </motion.h3>
          
          <motion.div 
            className="w-full h-px bg-white/20 my-4 origin-left"
            variants={{
                rest: { scaleX: 0.2 },
                hover: { scaleX: 1 }
            }}
            transition={{ duration: 0.4 }}
          />

          <motion.p 
            className="text-sm font-mono text-gray-400 uppercase tracking-wider"
            variants={{
              rest: { color: '#9ca3af' },
              hover: { color: '#ffffff' }
            }}
          >
            {service.subtitle}
          </motion.p>
        </div>
      </div>
      
      {/* Hover Reveal Background */}
      <motion.div 
        className="absolute inset-0 bg-white mix-blend-difference pointer-events-none"
        initial={{ scaleY: 0 }}
        variants={{
            rest: { scaleY: 0 },
            hover: { scaleY: 1 }
        }}
        transition={{ duration: 0.3, ease: 'circOut' }}
        style={{ originY: 1 }}
      />
    </motion.div>
  );
};

export default ServiceCard;