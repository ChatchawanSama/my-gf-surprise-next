'use client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function IntroPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const [videoEnded, setVideoEnded] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (videoEnded) {
      // Confetti / hearts particles
      const interval = setInterval(() => {
        confetti({
          particleCount: 20,
          spread: 60,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [videoEnded]);

  const handleStart = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {
      console.warn('User interaction required to play video.');
    });
  };

  return (
    <div className="relative w-screen h-screen bg-pink-200 flex items-center justify-center overflow-hidden">
      {!started && (
        <button
          onClick={handleStart}
          className="absolute z-50 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg text-xl animate-bounce"
        >
          Tap to Start 💌
        </button>
      )}

      <video
        ref={videoRef}
        src="/intro.mp4"
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          started ? 'opacity-100' : 'opacity-0'
        }`}
        onEnded={() => setVideoEnded(true)}
        controls={false}
        muted={!started}
      />

      {/* Overlay gradient + sparkle */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/40 via-transparent to-transparent pointer-events-none" />

      {/* Animated text */}
      {started && !videoEnded && (
        <>
          <motion.div
            className="absolute bottom-20 w-full text-center text-white text-4xl font-extrabold drop-shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            💖 Are you ready? 💖
          </motion.div>
          <motion.div
            className="absolute bottom-10 w-full text-center text-white text-xl drop-shadow-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Your surprise awaits ✨
          </motion.div>
        </>
      )}

      {/* Start button after video */}
      {videoEnded && (
        <motion.button
          onClick={() => router.push('/swipe')}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          Start Your Surprise 💌
        </motion.button>
      )}
    </div>
  );
}
