
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FluidBackground from './components/FluidBackground';
import UnifiedEcosystem from './components/UnifiedEcosystem';
import TeamSection from './components/TeamSection';
import TargetCursor from './components/TargetCursor';
import AIChat from './components/AIChat';

const AnimatedWord: React.FC<{ 
  children: React.ReactNode, 
  id: string,
  index: number,
  lineLength: number,
  isClearing: boolean,
  isTarget: boolean,
  onSelect: (rect: DOMRect, text: string) => void
}> = ({ children, id, index, lineLength, isClearing, isTarget, onSelect }) => {
  const isLeftSide = index < lineLength / 2;
  const containerRef = useRef<HTMLSpanElement>(null);
  const [initialWidth, setInitialWidth] = useState<number | string>('auto');

  useEffect(() => {
    if (containerRef.current && !isClearing) {
      setInitialWidth(containerRef.current.offsetWidth);
    }
  }, [children, isClearing]);

  const handleInteraction = () => {
    if (containerRef.current) {
      const text = (children as string).replace(/[,]/g, '').trim();
      onSelect(containerRef.current.getBoundingClientRect(), text);
    }
  };

  return (
    <motion.span 
      ref={containerRef}
      whileTap={!isClearing ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={(e) => {
        e.stopPropagation();
        handleInteraction();
      }}
      style={{ 
        width: isTarget && isClearing ? undefined : initialWidth,
        display: 'inline-flex',
        justifyContent: 'center',
        overflow: isTarget && isClearing ? 'hidden' : 'visible',
        position: 'relative'
      }}
      animate={isClearing ? (
        isTarget ? {
          width: 0,
          transition: { duration: 1.0, ease: [0.45, 0, 0.55, 1] }
        } : {
          x: isLeftSide ? -2500 : 2500,
          y: (Math.random() - 0.5) * 600,
          opacity: 0,
          filter: "blur(12px)",
          transition: { 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: Math.random() * 0.1 
          }
        }
      ) : {}}
      className={`inline-block relative z-20 cursor-target origin-center whitespace-nowrap ${isTarget && isClearing ? 'is-imploding' : ''}`}
    >
      <span className="px-[0.15em] flex items-center justify-center min-w-max">
        {children}
      </span>

      {isTarget && isClearing && (
        <>
          <div className="absolute top-[-20%] bottom-[-20%] left-0 w-[2px] bg-[#B1492C] z-40 shadow-[0_0_15px_rgba(177,73,44,0.8)]" />
          <div className="absolute top-[-20%] bottom-[-20%] right-0 w-[2px] bg-[#B1492C] z-40 shadow-[0_0_15px_rgba(177,73,44,0.8)]" />
        </>
      )}
    </motion.span>
  );
};

const ConvergingHeader: React.FC<{ variant?: 'default' | 'team' }> = ({ variant = 'default' }) => {
  // ✅ Changed team color from #00f2ff to #B1492C
  const color = '#B1492C';
  const label = variant === 'team' ? 'TEAM' : 'ECOSYSTEM';
  return (
    <div className="fixed top-8 md:top-12 left-0 w-full flex justify-center pointer-events-none z-[60]">
      <div className="flex gap-4 font-heading font-black text-3xl md:text-6xl uppercase tracking-tighter" style={{ color: color }}>
        <motion.span
          initial={{ x: "-100vw", y: "-20vh", opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          AI
        </motion.span>
        <motion.span
          initial={{ x: "100vw", y: "-20vh", opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
};

const FullScreenReveal: React.FC<{ 
  pivotPoint: { x: number, y: number } | null,
  onComplete: () => void,
  variant?: 'default' | 'team'
}> = ({ pivotPoint, onComplete, variant = 'default' }) => {
  if (!pivotPoint) return null;

  const accentColor = variant === 'team' ? '#B1492C' : '#B1492C'; // Ensuring orange for both
  const pivotDuration = 0.2;
  const stretchDelay = 0.2;
  const stretchDuration = 0.3;
  const shutterDelay = 0.35; 
  const shutterDuration = 0.6;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      <motion.div 
        initial={{ 
          left: pivotPoint.x,
          top: pivotPoint.y,
          width: 2, 
          height: 60, 
          rotate: 0,
          translateX: "-50%",
          translateY: "-50%",
          opacity: 1 
        }}
        animate={{ 
          rotate: 90,
          height: 5000, 
          width: 2,
          opacity: [1, 1, 0]
        }}
        transition={{ 
          rotate: { duration: pivotDuration, ease: "circOut" },
          height: { delay: stretchDelay, duration: stretchDuration, ease: [0.22, 1, 0.36, 1] },
          width: { delay: stretchDelay, duration: stretchDuration, ease: "linear" },
          opacity: { delay: shutterDelay + 0.1, duration: 0.1 }
        }}
        style={{ backgroundColor: accentColor, boxShadow: `0 0 30px ${accentColor}` }}
        className="absolute z-[110]"
      />

      <motion.div 
        initial={{ height: pivotPoint.y, top: 0, borderBottomWidth: 0 }}
        animate={{ 
          top: -pivotPoint.y,
          borderBottomWidth: 1 
        }}
        transition={{ 
          top: { duration: shutterDuration, ease: [0.77, 0, 0.175, 1], delay: shutterDelay },
          borderBottomWidth: { duration: 0.01, delay: shutterDelay }
        }}
        style={{ borderBottomColor: `${accentColor}80` }}
        className="absolute left-0 right-0 bg-black"
      />

      <motion.div 
        initial={{ height: `calc(100vh - ${pivotPoint.y}px)`, bottom: 0, borderTopWidth: 0 }}
        animate={{ 
          bottom: `calc(-100vh + ${pivotPoint.y}px)`,
          borderTopWidth: 1 
        }}
        transition={{ 
          bottom: { duration: shutterDuration, ease: [0.77, 0, 0.175, 1], delay: shutterDelay },
          borderTopWidth: { duration: 0.01, delay: shutterDelay }
        }}
        onAnimationComplete={onComplete}
        style={{ borderTopColor: `${accentColor}80` }}
        className="absolute left-0 right-0 bg-black"
      />
    </div>
  );
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<'intro' | 'cleared' | 'revealing' | 'final'>('intro');
  const [revealVariant, setRevealVariant] = useState<'default' | 'team'>('default');
  const [clickedWordKey, setClickedWordKey] = useState<string | null>(null);
  const [pivotPoint, setPivotPoint] = useState<{ x: number, y: number } | null>(null);

  const handleWordSelect = (key: string, rect: DOMRect, text: string) => {
    if (appState !== 'intro') return;
    
    if (text.toLowerCase().includes('human-centric')) {
      setRevealVariant('team');
    } else {
      setRevealVariant('default');
    }

    setClickedWordKey(key);
    setPivotPoint({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setAppState('cleared');
  };

  useEffect(() => {
    if (appState === 'cleared') {
      const timer = setTimeout(() => {
        setAppState('revealing');
      }, 800); 
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const sentence1 = "A Unified, Human-centric".split(' ');
  const sentence2 = "AI Ecosystem".split(' ');

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center overflow-hidden select-none relative bg-black ${appState === 'final' ? '' : 'px-4 md:px-12'}`}>
      <TargetCursor targetSelector=".cursor-target" spinDuration={3} />
      
      <FluidBackground state={appState === 'intro' ? 'intro' : 'cleared'} />
      
      {appState === 'revealing' && (
        <FullScreenReveal 
          pivotPoint={pivotPoint} 
          onComplete={() => setAppState('final')} 
          variant={revealVariant}
        />
      )}

      <AnimatePresence>
        {appState === 'final' && (
          <div className="w-full h-full relative">
            <ConvergingHeader variant={revealVariant} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              className="relative z-10 w-full h-full flex items-center justify-center"
            >
              {revealVariant === 'team' ? (
                <div className="w-full h-screen">
                   <TeamSection />
                </div>
              ) : (
                <div className="max-w-6xl mx-auto pt-20">
                  <UnifiedEcosystem />
                </div>
              )}
            </motion.div>
            <AIChat />
          </div>
        )}
      </AnimatePresence>

      <div className={`w-full max-w-screen-2xl mx-auto text-center relative z-10 ${(appState === 'intro' || appState === 'cleared') ? '' : 'hidden'}`}>
        <AnimatePresence>
          {(appState === 'intro' || appState === 'cleared') && (
            <motion.div 
              key="intro-content"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`${appState === 'intro' ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
              <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-7xl lg:text-[6.5vw] leading-[1.05] tracking-tight uppercase">
                <div className="text-white flex flex-wrap justify-center md:whitespace-nowrap">
                  {sentence1.map((word, i) => {
                    const key = `s1-${i}`;
                    return (
                      <AnimatedWord 
                        key={key}
                        id={key}
                        index={i} 
                        lineLength={sentence1.length} 
                        isClearing={appState === 'cleared'}
                        isTarget={clickedWordKey === key}
                        onSelect={(rect, text) => handleWordSelect(key, rect, text)}
                      >
                        {word}
                      </AnimatedWord>
                    );
                  })}
                </div>
                
                <span className="relative inline-block mt-2 md:mt-4">
                  <span className="text-[#B1492C] relative z-20 block drop-shadow-[0_0_15px_rgba(177,73,44,0.3)]">
                    {sentence2.map((word, i) => {
                      const key = `s2-${i}`;
                      return (
                        <AnimatedWord 
                          key={key}
                          id={key}
                          index={i} 
                          lineLength={sentence2.length} 
                          isClearing={appState === 'cleared'}
                          isTarget={clickedWordKey === key}
                          onSelect={(rect, text) => handleWordSelect(key, rect, text)}
                        >
                          {word}
                        </AnimatedWord>
                      );
                    })}
                  </span>
                </span>
              </h1>
              
              <motion.p 
                animate={appState === 'cleared' ? { opacity: 0, y: 150 } : { opacity: 0.4 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mt-8 font-mono text-[10px] uppercase tracking-[0.5em] text-white"
              >
                {appState === 'intro' ? 'Target title to initialize uplink' : 'Deconstructing Target...'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
