
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const ORANGE_COLOR = '#B1492C';

const CustomCursor: React.FC<{ onDetonate?: () => void, isExploded: boolean }> = ({ onDetonate, isExploded }) => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const rotation = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const rotationSpring = useSpring(rotation, { damping: 15, stiffness: 100 });

  const [isHovering, setIsHovering] = useState(false);
  const [proximityState, setProximityState] = useState({ dist: 999, isBlinking: false, isTouching: false });

  const attractionPoints = useRef<{ x: number, y: number, isTrigger: boolean }[]>([]);

  useEffect(() => {
    const updateAttractionPoints = () => {
      const elements = document.querySelectorAll('.attraction-point');
      attractionPoints.current = Array.from(elements).map(el => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          isTrigger: el.classList.contains('trigger-point')
        };
      });
    };

    updateAttractionPoints();
    window.addEventListener('resize', updateAttractionPoints);
    window.addEventListener('scroll', updateAttractionPoints);

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);

      if (attractionPoints.current.length > 0) {
        let minDist = Infinity;
        let nearestPoint = attractionPoints.current[0];

        attractionPoints.current.forEach(point => {
          const dist = Math.sqrt(Math.pow(point.x - clientX, 2) + Math.pow(point.y - clientY, 2));
          if (dist < minDist) {
            minDist = dist;
            nearestPoint = point;
          }
          
          // Trigger check when compass touches the "ECOSYSTEM" center
          if (point.isTrigger && dist < 15 && !isExploded) {
            onDetonate?.();
          }
        });

        const angleRad = Math.atan2(nearestPoint.y - clientY, nearestPoint.x - clientX);
        const angleDeg = angleRad * (180 / Math.PI);
        rotation.set(angleDeg + 90);

        const blinkThreshold = 250;
        const touchThreshold = 30;

        setProximityState({
          dist: minDist,
          isBlinking: minDist < blinkThreshold && minDist > touchThreshold,
          isTouching: minDist <= touchThreshold
        });
      }

      const target = e.target as HTMLElement;
      setIsHovering(!!(target.closest('button') || target.closest('a') || target.closest('[data-hover="true"]')));
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', updateAttractionPoints);
      window.removeEventListener('scroll', updateAttractionPoints);
    };
  }, [isExploded, onDetonate]);

  const blinkDuration = Math.max(0.05, Math.min(0.6, (proximityState.dist / 250) * 0.6));

  return (
    <AnimatePresence>
      {!isExploded && (
        <motion.div
          exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
          className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center mix-blend-difference"
          style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        >
          <motion.div
            className="relative w-12 h-12 border-2 border-white rounded-full flex items-center justify-center"
            animate={{ scale: isHovering ? 1.4 : 1, borderWidth: isHovering ? '1px' : '2px' }}
          >
            <motion.div className="relative w-full h-full flex items-center justify-center" style={{ rotate: rotationSpring }}>
              <motion.div 
                className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] absolute top-1"
                animate={{
                  borderBottomColor: (proximityState.isBlinking || proximityState.isTouching) ? ORANGE_COLOR : '#FFFFFF',
                  opacity: proximityState.isTouching ? [1, 0, 1] : (proximityState.isBlinking ? [1, 0, 1] : 1),
                }}
                transition={{
                  opacity: (proximityState.isBlinking || proximityState.isTouching) ? {
                    repeat: Infinity,
                    duration: blinkDuration,
                    ease: "linear"
                  } : { duration: 0.2 }
                }}
              />
              <motion.div className="w-1 h-1 rounded-full bg-white" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;
