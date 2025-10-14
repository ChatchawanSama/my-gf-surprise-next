'use client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Intro() {
  const router = useRouter();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      router.push('/swipe');
    };

    // เมื่อเล่นจบ → ไปหน้า swipe
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [router]);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-200">
      <video
        ref={videoRef}
        src="/intro.mp4"
        className="w-full max-w-lg rounded-3xl shadow-lg"
        controls={false}
      />
      {!playing && (
        <button
          onClick={handlePlay}
          className="mt-4 px-6 py-3 bg-pink-600 text-white rounded-xl shadow-lg text-lg font-semibold"
        >
          🎬 Play Video
        </button>
      )}
    </div>
  );
}
