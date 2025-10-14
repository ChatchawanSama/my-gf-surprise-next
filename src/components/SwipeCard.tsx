import { motion } from 'framer-motion';

interface SwipeCardProps {
  text: string;
  onSwipe: (direction: 'left' | 'right') => void;
}

export default function SwipeCard({ text, onSwipe }: SwipeCardProps) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.3}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) onSwipe('right');
        else if (info.offset.x < -100) onSwipe('left');
      }}
      className="bg-white p-6 rounded-3xl shadow-xl text-center w-80 cursor-grab"
    >
      <p className="text-xl font-bold text-pink-600">{text}</p>
    </motion.div>
  );
}
