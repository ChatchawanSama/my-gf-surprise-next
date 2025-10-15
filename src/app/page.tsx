'use client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function IntroPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const [videoEnded, setVideoEnded] = useState(false);
  const [started, setStarted] = useState(false);
  
  // Mailbox animation states
  const [showMailbox, setShowMailbox] = useState(true);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

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

  const handleMailboxClick = () => {
    // Click mailbox -> show envelope
    setShowMailbox(false);
    setTimeout(() => {
      setShowEnvelope(true);
    }, 500);
  };

  const handleEnvelopeClick = () => {
    // Click envelope -> open and show flowers
    setEnvelopeOpened(true);
    
    // Show confetti when flowers appear
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 800);
  };

  const handleStart = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {
      console.warn('User interaction required to play video.');
    });
  };

  return (
    <div className="relative w-screen h-screen bg-pink-200 flex items-center justify-center overflow-hidden">
      
      {/* Mailbox Animation Sequence */}
      {!started && (
        <div className="absolute z-50 flex flex-col items-center gap-8">
          
          {/* Mailbox */}
          <AnimatePresence>
            {showMailbox && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, y: -100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                onClick={handleMailboxClick}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <div className="text-[120px] drop-shadow-2xl animate-bounce">
                  📬
                </div>
                <p className="text-white text-xl font-bold mt-2 text-center drop-shadow-lg">
                  Click me! 💌
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Envelope */}
          <AnimatePresence>
            {showEnvelope && !envelopeOpened && (
              <motion.div
                initial={{ scale: 0, y: -50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                onClick={handleEnvelopeClick}
                className="cursor-pointer hover:scale-110 transition-transform relative"
              >
                <div className="text-[120px] drop-shadow-2xl animate-pulse">
                  💌
                </div>
                <p className="text-white text-xl font-bold mt-2 text-center drop-shadow-lg">
                  Open me! ✨
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Opened Envelope with Flowers */}
          <AnimatePresence>
            {envelopeOpened && (
              <motion.div
                initial={{ scale: 1 }}
                className="relative flex flex-col items-center"
              >
                {/* Rose bouquet (3 roses) - appears first at top */}
                <motion.div 
                  className="relative mb-[-20px] z-30"
                  initial={{ y: 100, opacity: 0, scale: 0 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.4,
                    type: 'spring',
                    stiffness: 150,
                    damping: 12
                  }}
                >
                  {/* Center rose (tallest) */}
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    className="absolute left-1/2 -translate-x-1/2 top-0 text-[80px] drop-shadow-2xl"
                  >
                    🌹
                  </motion.div>

                  {/* Left rose */}
                  <motion.div
                    initial={{ y: 20, x: 0, rotate: 0 }}
                    animate={{ y: 15, x: -50, rotate: -15 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 180 }}
                    className="absolute left-1/2 -translate-x-1/2 top-0 text-[75px] drop-shadow-2xl"
                  >
                    🌹
                  </motion.div>

                  {/* Right rose */}
                  <motion.div
                    initial={{ y: 20, x: 0, rotate: 0 }}
                    animate={{ y: 15, x: 50, rotate: 15 }}
                    transition={{ delay: 0.65, type: 'spring', stiffness: 180 }}
                    className="absolute left-1/2 -translate-x-1/2 top-0 text-[75px] drop-shadow-2xl"
                  >
                    🌹
                  </motion.div>

                  {/* Placeholder for spacing */}
                  <div className="w-[200px] h-[120px]"></div>
                </motion.div>

                {/* Envelope (closed with flap) */}
                <motion.div 
                  className="relative z-20"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 }}
                >
                  {/* Envelope body */}
                  <div className="text-[110px] drop-shadow-2xl">
                    ✉️
                  </div>
                </motion.div>

                {/* "Tap to Start" button */}
                <motion.button
                  initial={{ opacity: 0, y: 30, scale: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                  onClick={handleStart}
                  className="mt-12 bg-pink-500 text-white px-8 py-4 rounded-full shadow-xl text-2xl font-bold animate-bounce hover:bg-pink-600 transition z-40"
                >
                  Tap to Start 💖
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* Video */}
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

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/40 via-transparent to-transparent pointer-events-none" />

      {/* Animated text during video */}
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