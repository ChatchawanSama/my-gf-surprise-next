'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

export default function MatchPage() {
  const matchRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [matchedAt, setMatchedAt] = useState<Date | null>(null);

  const searchParams = useSearchParams();
  const t = searchParams.get('t');

  useEffect(() => {
    setMatchedAt(t ? new Date(Number(t)) : new Date());

    // Confetti
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });

    // Hearts animation
    const interval = setInterval(() => spawnHearts(6), 800);
    return () => clearInterval(interval);
  }, [t]);

  // autoplay audio on match
  useEffect(() => {
    audioRef.current?.play().catch(() => {
      console.warn('Autoplay failed. User interaction might be required.');
    });
  }, []);

  function spawnHearts(n: number) {
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div');
      el.textContent = '💖';
      el.style.position = 'fixed';
      el.style.bottom = '-30px';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.fontSize = 18 + Math.random() * 28 + 'px';
      el.style.pointerEvents = 'none';
      el.style.transition = `transform ${3 + Math.random() * 2}s ease-out, opacity ${3 + Math.random() * 2}s ease-out`;
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translateY(-70vh) rotate(${Math.random() * 360}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 5000);
    }
  }

  async function saveOrShare() {
    if (!matchRef.current) return;
    const canvas = await html2canvas(matchRef.current, { scale: 2 });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const filesArray = [new File([blob], 'match.png', { type: 'image/png' })];
      // Web Share API
      // @ts-ignore
      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        try {
          // @ts-ignore
          await navigator.share({ files: filesArray, title: "It's a Match!", text: 'We matched!' });
          return;
        } catch (err) {
          console.warn('Share failed', err);
        }
      }
      // fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'match.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 to-pink-500">
      <audio ref={audioRef} src="/love.mp3" loop />
      <div ref={matchRef} className="bg-white/90 p-6 rounded-3xl shadow-2xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-pink-600">💘 It's a Match! 💘</h1>
        <p className="mt-2 text-sm text-pink-500">You said yes ✨</p>
        <div className="mt-4">
          <img src="/couple.jpg" alt="Couple" className="mx-auto rounded-2xl w-64 h-64 object-cover shadow-xl" />
        </div>
        <div className="mt-4">
          <p className="font-medium text-pink-600">{matchedAt ? matchedAt.toLocaleString() : ''}</p>
          <p className="text-xs text-pink-500">Since that moment 💞</p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={saveOrShare} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow">
            Save / Share
          </button>
        </div>
      </div>
    </div>
  );
}
