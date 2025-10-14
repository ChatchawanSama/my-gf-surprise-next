'use client';
import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FaHeart, FaTimes, FaStar } from 'react-icons/fa';

interface Profile {
  name: string;
  image?: string;
  bio: string;
  isFinal?: boolean;
}

const profiles: Profile[] = [
  { name: 'You 💖', image: '/profiles/profile1.jpg', bio: 'เจอกันในทินเดอร์...หัวใจอยู่ตรงนี้' },
  { name: 'You 🥰', image: '/profiles/profile2.jpg', bio: 'ยิ้มนี้ละ ทำใจละลายเลย' },
  { name: 'Aom 😳', image: '/profiles/profile3.jpg', bio: 'ยังไม่เบื่อใช่ไหม? ฉันไม่เลย' },
  { name: '💌', bio: 'Do you want to be my girlfriend?', isFinal: true },
];

export default function SwipePage() {
  const [index, setIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const router = useRouter();
  const current = profiles[index];

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offsetX = info.offset.x;
    if (offsetX > 100) handleSwipe('right');
    else if (offsetX < -100) handleSwipe('left');
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setDragDirection(direction);

    if (current.isFinal) {
      if (direction === 'right') {
        router.push(`/match?t=${Date.now()}`);
      } else {
        Swal.fire({
          title: 'ไม่ได้นะ! 😝',
          text: 'ต้องปัดขวาเท่านั้น 💖',
          icon: 'warning',
          confirmButtonText: 'โอเคก็ได้~ 💕',
          confirmButtonColor: '#ec4899',
        });
        setDragDirection(null);
      }
    } else {
      // ปัดใบถัดไป
      setTimeout(() => {
        setIndex((prev) => Math.min(prev + 1, profiles.length - 1));
        setDragDirection(null);
      }, 300);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 to-pink-400 relative overflow-hidden">
      <div className="relative w-[320px] h-[500px]">
        <AnimatePresence>
          <motion.div
            key={current.name}
            className={`absolute w-full h-full rounded-3xl shadow-2xl overflow-hidden ${
              current.isFinal ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center px-6 text-center' : 'bg-white'
            }`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {current.image ? (
              <>
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-[75%] object-cover rounded-t-3xl"
                />
                <div className="p-4 text-center">
                  <h2 className="text-2xl font-bold text-pink-600">{current.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{current.bio}</p>
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-2">{current.bio}</h2>
                <p className="text-sm opacity-80">Swipe right to say yes 💞</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Buttons สำหรับสามใบแรก */}
      {!current.isFinal && (
        <div className="flex gap-6 mt-6">
          <button
            onClick={() => handleSwipe('left')}
            className="bg-white text-pink-500 p-4 rounded-full shadow-xl active:scale-90 transition"
          >
            <FaTimes size={24} />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="bg-white text-red-500 p-4 rounded-full shadow-xl active:scale-90 transition"
          >
            <FaHeart size={24} />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="bg-white text-blue-400 p-4 rounded-full shadow-xl active:scale-90 transition"
          >
            <FaStar size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
