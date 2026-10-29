import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Text, Ring, Progress } from '@react-three/drei';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface InternshipProgressProps {
  progress: number; // 0-100
  totalHours: number;
  completedHours: number;
  currentPhase: string;
  phases: Array<{ name: string; progress: number; color: string }>;
  className?: string;
}

const ProgressRing = ({ progress, color, size = 120 }: { progress: number; color: string; size?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = Date.now();
    const startProgress = animatedProgress;

    const animate = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedProgress(startProgress + (progress - startProgress) * eased);
      if (t < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [progress, animatedProgress]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef} scale={size / 100}>
      <Ring
        radius={0.5}
        thickness={0.08}
        thetaLength={(animatedProgress / 100) * Math.PI * 2}
        color={color}
        opacity={1}
      >
        <meshBasicMaterial />
      </Ring>
      <Ring radius={0.5} thickness={0.08} color='#e2e8f0' opacity={0.2} />
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color='#1e293b'
        anchorX='center'
        anchorY='middle'
        font='Inter'
      >
        {Math.round(animatedProgress)}%
      </Text>
    </group>
  );
};

export function InternshipProgress({ progress, totalHours, completedHours, currentPhase, phases, className }: InternshipProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx('bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50', className)}
    >
      <div className='flex flex-col lg:flex-row items-center justify-between gap-8'>
        <div className='flex items-center gap-6'>
          <div className='relative w-32 h-32'>
            <Canvas
              camera={{ position: [0, 0, 2], fov: 30 }}
              gl={{ antialias: true, alpha: true }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.8} />
              <directionalLight position={[1, 1, 1]} intensity={0.5} />
              <ProgressRing progress={progress} color='#4f46e5' size={120} />
            </Canvas>
          </div>
          <div>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Overall Progress</p>
            <p className='text-3xl font-bold text-slate-900 dark:text-white'>{progress}%</p>
            <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
              {completedHours} / {totalHours} hours completed
            </p>
            <p className='text-sm text-brand-600 dark:text-brand-400 mt-2 font-medium'>
              Current Phase: {currentPhase}
            </p>
          </div>
        </div>

        <div className='w-full lg:w-1/2'>
          <h4 className='text-sm font-medium text-slate-700 dark:text-slate-300 mb-4'>Phase Breakdown</h4>
          <div className='space-y-3'>
            {phases.map((phase, index) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className='space-y-1'
              >
                <div className='flex justify-between text-sm'>
                  <span className='text-slate-700 dark:text-slate-300'>{phase.name}</span>
                  <span className='font-medium text-slate-900 dark:text-white'>{phase.progress}%</span>
                </div>
                <div className='h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: phase.progress + '%' }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className='h-full rounded-full'
                    style={{ backgroundColor: phase.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InternshipProgress;
