'use client';

import { Variants, motion } from 'framer-motion';

export interface BarProps {
  progress: number;
  className: string;
  trackWidth: number;
  cap?: 'round' | 'inherit' | 'butt' | 'square';
}

export interface ProgressBarProps extends Omit<BarProps, 'progress'> {
  size: number;
  bars: BarProps[];
}

export function ProgressBar({ size, bars, trackWidth, className }: ProgressBarProps) {
  const center = size / 2;
  const widest = Math.max(trackWidth, ...bars.map((bar) => bar.trackWidth));
  const radius = center - widest;

  return (
    <motion.svg
      className="rotate-[-90deg]"
      style={{ width: size, height: size }}
      viewBox={`0 0 ${size} ${size}`}
      initial="hidden"
      animate="visible"
    >
      <ProgressBarCircle
        skipAnimation
        center={center}
        radius={radius}
        progress={1}
        className={className}
        trackWidth={trackWidth}
        index={0}
      />
      {bars
        .slice()
        .sort((a, b) => b.progress - a.progress)
        .map((bar, i) => (
          <ProgressBarCircle
            key={i}
            center={center}
            radius={radius}
            progress={bar.progress}
            className={bar.className}
            trackWidth={bar.trackWidth}
            cap={bar.cap}
            index={i}
          />
        ))}
    </motion.svg>
  );
}

interface ProgressBarCircleProps extends BarProps {
  center: number;
  radius: number;
  index: number;
  skipAnimation?: boolean;
}

function ProgressBarCircle({
  center,
  radius,
  index,
  skipAnimation,
  progress,
  className,
  trackWidth,
  cap = 'round',
}: ProgressBarCircleProps) {
  const draw = {
    hidden: {
      pathLength: skipAnimation ? progress : 0,
      opacity: 0,
    },
    visible: (i: number) => {
      const delay = i * 0.5;
      return {
        pathLength: progress,
        opacity: 1,
        transition: {
          pathLength: { delay, type: 'spring', duration: 1, bounce: 0 },
          opacity: { delay, duration: 0.01 },
        },
      };
    },
  } satisfies Variants;

  return (
    <motion.circle
      variants={draw}
      custom={index}
      cx={center}
      cy={center}
      r={radius}
      className={className}
      fill="transparent"
      stroke="currentColor"
      strokeWidth={trackWidth}
      strokeLinecap={cap}
    />
  );
}
