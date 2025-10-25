'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import Image from 'next/image';

function MatchContent() {
    const matchRef = useRef<HTMLDivElement | null>(null);
    const shareCardRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [matchedAt, setMatchedAt] = useState<Date | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);

    const searchParams = useSearchParams();
    const t = searchParams.get('t');

    useEffect(() => {
        setMatchedAt(t ? new Date(Number(t)) : new Date());
        setCurrentUrl(window.location.href);

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
        if (!shareCardRef.current) return;
        setIsGenerating(true);

        try {
            // สร้าง canvas จากการ์ดแชร์
            const canvas = await html2canvas(shareCardRef.current, { 
                scale: 3,
                backgroundColor: null,
                useCORS: true,
                logging: false,
                width: 1080,
                height: 1920
            });

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    setIsGenerating(false);
                    return;
                }
                
                const filesArray = [new File([blob], 'match-story.png', { type: 'image/png' })];
                
                // ตรวจสอบว่า browser รองรับการแชร์ไฟล์หรือไม่
                const canShareFiles = navigator.canShare && navigator.canShare({ files: filesArray });
                
                if (navigator.share && canShareFiles) {
                    // Web Share API (รองรับการแชร์ไฟล์)
                    try {
                        await navigator.share({ 
                            files: filesArray, 
                            title: "It's a Match! 💘", 
                            text: 'Happy Official GF Day! 💕' 
                        });
                        setIsGenerating(false);
                        return;
                    } catch (err) {
                        if ((err as Error).name === 'AbortError') {
                            setIsGenerating(false);
                            return;
                        }
                        console.warn('Share failed', err);
                    }
                }

                // fallback: ดาวน์โหลดแล้วแสดงคำแนะนำ
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'match-story.png';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                
                // แสดง alert แนะนำวิธีแชร์
                setTimeout(() => {
                    alert('รูปถูกบันทึกแล้ว! 📸\n\nวิธีแชร์ไป Instagram Story:\n1. เปิด Instagram\n2. สร้าง Story ใหม่\n3. เลือกรูปจาก Camera Roll\n4. โพสต์ได้เลย! 💕');
                }, 500);
                
                setIsGenerating(false);
            }, 'image/png', 1.0);
        } catch (err) {
            console.error('Failed to generate image', err);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            setIsGenerating(false);
        }
    }

    async function shareVideo() {
        setIsDownloadingVideo(true);
        
        try {
            // Fetch วิดีโอจาก public folder
            const response = await fetch('/intro.mp4');
            const blob = await response.blob();
            const filesArray = [new File([blob], 'our-moment.mp4', { type: 'video/mp4' })];
            
            // ตรวจสอบว่า browser รองรับการแชร์ไฟล์หรือไม่
            const canShareFiles = navigator.canShare && navigator.canShare({ files: filesArray });
            
            if (navigator.share && canShareFiles) {
                try {
                    await navigator.share({ 
                        files: filesArray, 
                        title: "Our Special Moment 💕", 
                        text: 'ดูวิดีโอพิเศษของเราสิ! 💖' 
                    });
                    setIsDownloadingVideo(false);
                    return;
                } catch (err) {
                    if ((err as Error).name === 'AbortError') {
                        setIsDownloadingVideo(false);
                        return;
                    }
                    console.warn('Share failed', err);
                }
            }

            // fallback: ดาวน์โหลดวิดีโอ
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'our-moment.mp4';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            
            setTimeout(() => {
                alert('วิดีโอถูกบันทึกแล้ว! 🎥\n\nวิธีแชร์:\n1. เปิดแอพที่ต้องการแชร์\n2. เลือกวิดีโอจาก Camera Roll\n3. แชร์ได้เลย! 💕');
            }, 500);
            
            setIsDownloadingVideo(false);
        } catch (err) {
            console.error('Failed to share video', err);
            alert('ไม่สามารถโหลดวิดีโอได้ กรุณาลองใหม่');
            setIsDownloadingVideo(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f9a8d4, #ec4899)' }}>
            <audio ref={audioRef} src="/love.mp3" loop />
            
            {/* หน้าจอหลัก */}
            <div ref={matchRef} className="bg-white/90 p-6 rounded-3xl shadow-2xl w-full max-w-lg text-center mx-4">
                <h1 className="text-3xl font-bold text-pink-600">💘 It&apos;s a Match! 💘</h1>
                <p className="mt-2 text-sm text-pink-500">You said yes ✨</p>
                <div className="mt-4">
                    <Image
                        src="/couple.jpg"
                        alt="Couple"
                        width={256}
                        height={256}
                        className="mx-auto rounded-2xl w-64 h-64 object-cover shadow-xl"
                    />
                </div>
                <div className="mt-4">
                    <p className="font-medium text-pink-600">{matchedAt ? matchedAt.toLocaleString('en-GB') : ''}</p>
                    <p className="text-xs text-pink-500">Since that moment 💞</p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                    <button 
                        onClick={saveOrShare} 
                        disabled={isGenerating}
                        className="bg-pink-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-pink-700 transition disabled:opacity-50 font-semibold"
                    >
                        {isGenerating ? '⏳ Generating...' : '📷 Share Card'}
                    </button>
                    <button 
                        onClick={shareVideo} 
                        disabled={isDownloadingVideo}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition disabled:opacity-50 font-semibold"
                    >
                        {isDownloadingVideo ? '⏳ Loading...' : '🎥 Share Video'}
                    </button>
                    <button 
                        onClick={() => setShowQR(true)} 
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition font-semibold"
                    >
                        💝 Scan QR Code
                    </button>
                </div>
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <div 
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setShowQR(false)}
                >
                    <div 
                        className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-pink-600 mb-4">💕 Scan QR Code 💕</h2>
                        <p className="text-sm text-gray-600 mb-6">สแกนเพื่อกลับมาที่หน้านี้อีกครั้ง</p>
                        
                        {/* QR Code จาก API */}
                        <div className="bg-white p-4 rounded-2xl inline-block shadow-lg">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`}
                                alt="QR Code"
                                className="w-64 h-64"
                            />
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-4 break-all">{currentUrl}</p>
                        
                        <div className="mt-6 flex gap-3 justify-center">
                            <button 
                                onClick={async () => {
                                    try {
                                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(currentUrl)}`;
                                        const response = await fetch(qrUrl);
                                        const blob = await response.blob();
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'qr.png';
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                        URL.revokeObjectURL(url);
                                    } catch (err) {
                                        console.error('Failed to download QR', err);
                                        alert('ไม่สามารถดาวน์โหลด QR Code ได้');
                                    }
                                }}
                                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition font-semibold"
                            >
                                💾 Save QR
                            </button>
                            <button 
                                onClick={() => setShowQR(false)}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* การ์ดสำหรับแชร์ (ซ่อนไว้) */}
            <div style={{ position: 'fixed', left: '-99999px', top: 0, pointerEvents: 'none' }}>
                <div 
                    ref={shareCardRef}
                    style={{ 
                        width: '1080px', 
                        height: '1920px',
                        background: 'linear-gradient(to bottom right, #f472b6, #ec4899, #a855f7)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative elements */}
                    <div style={{ position: 'absolute', top: '128px', left: '96px', fontSize: '144px', opacity: 0.3 }}>✨</div>
                    <div style={{ position: 'absolute', top: '256px', right: '160px', fontSize: '128px', opacity: 0.4 }}>💕</div>
                    <div style={{ position: 'absolute', bottom: '256px', left: '160px', fontSize: '128px', opacity: 0.4 }}>💖</div>
                    <div style={{ position: 'absolute', bottom: '128px', right: '96px', fontSize: '144px', opacity: 0.3 }}>✨</div>
                    <div style={{ position: 'absolute', top: '40%', left: '64px', fontSize: '112px', opacity: 0.2 }}>💫</div>
                    <div style={{ position: 'absolute', top: '60%', right: '64px', fontSize: '112px', opacity: 0.2 }}>💫</div>
                    
                    {/* Main content */}
                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px' }}>
                        
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div style={{ fontSize: '120px', marginBottom: '24px' }}>💘</div>
                            <h1 style={{ 
                                fontSize: '100px', 
                                fontWeight: 900, 
                                color: 'white', 
                                lineHeight: 1,
                                marginBottom: '16px',
                                textShadow: '4px 4px 12px rgba(0,0,0,0.3)'
                            }}>
                                It&apos;s a Match!
                            </h1>
                            <p style={{ fontSize: '50px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                                We&apos;re together now 💕
                            </p>
                        </div>

                        {/* Image container */}
                        <div style={{ position: 'relative', marginBottom: '64px' }}>
                            <div style={{ 
                                background: 'white', 
                                borderRadius: '48px', 
                                padding: '48px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                            }}>
                                <div style={{ 
                                    position: 'relative', 
                                    width: '700px', 
                                    height: '700px', 
                                    borderRadius: '32px', 
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}>
                                    <Image
                                        src="/couple.jpg"
                                        alt="Couple"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date info */}
                        <div style={{ 
                            background: 'rgba(255,255,255,0.95)', 
                            backdropFilter: 'blur(10px)',
                            borderRadius: '40px', 
                            padding: '40px 64px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '60px', fontWeight: 700, color: '#ec4899', marginBottom: '8px' }}>
                                {matchedAt ? matchedAt.toLocaleDateString('en-GB', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                }) : ''}
                            </p>
                            <p style={{ fontSize: '48px', fontWeight: 600, color: '#f472b6', marginBottom: '12px' }}>
                                {matchedAt ? matchedAt.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                }) : ''}
                            </p>
                            <p style={{ fontSize: '40px', color: '#f472b6', fontWeight: 500 }}>
                                Since that moment 💞
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '80px', 
                        color: 'rgba(255,255,255,0.7)', 
                        fontSize: '36px',
                        fontWeight: 500
                    }}>
                        Made with 💖
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MatchPage() {
    return (
        <Suspense fallback={<div className="text-center mt-10 text-pink-500">Loading...</div>}>
            <MatchContent />
        </Suspense>
    );
}