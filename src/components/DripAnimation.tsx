import { useEffect, useState } from 'react';

interface Props {
  intervalSec: number;
  isPlaying: boolean;
}

export function DripAnimation({ intervalSec, isPlaying }: Props) {
  const [dropKey, setDropKey] = useState(0);

  useEffect(() => {
    if (!isPlaying || intervalSec <= 0) return;
    const id = setInterval(() => setDropKey(k => k + 1), intervalSec * 1000);
    return () => clearInterval(id);
  }, [isPlaying, intervalSec]);

  const duration = Math.min(intervalSec * 0.8, 1.2);

  return (
    <div style={{
      position: 'relative',
      width: 80,
      height: 160,
      margin: '8px auto',
    }}>
      {/* 上チューブ */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 6,
        height: 24,
        background: 'linear-gradient(180deg, #CBD5E1, #94A3B8)',
        borderRadius: 3,
        top: 0,
      }} />

      {/* 滴下チャンバー - ガラス風 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 36,
        height: 70,
        border: '2.5px solid #94A3B8',
        borderRadius: 18,
        top: 22,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(147,197,253,0.08))',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        {/* ハイライト */}
        <div style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: 6,
          height: 20,
          background: 'rgba(255,255,255,0.5)',
          borderRadius: 3,
        }} />

        {/* 液面 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '30%',
          background: 'linear-gradient(180deg, rgba(59,130,246,0.2), rgba(59,130,246,0.45))',
          borderRadius: '0 0 16px 16px',
        }}>
          {/* 水面の波紋 */}
          {isPlaying && (
            <div
              key={`ripple-${dropKey}`}
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 8,
                height: 3,
                borderRadius: '50%',
                background: 'rgba(59,130,246,0.3)',
                animation: 'ripple 0.6s ease-out forwards',
                animationDelay: `${duration}s`,
              }}
            />
          )}
        </div>

        {/* ドロップ */}
        {isPlaying && (
          <div
            key={dropKey}
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 10,
              height: 13,
              background: 'linear-gradient(180deg, #60A5FA, #2563EB)',
              borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
              top: 4,
              animation: `dropFall ${duration}s ease-in forwards`,
              boxShadow: '0 2px 4px rgba(37,99,235,0.3)',
            }}
          />
        )}
      </div>

      {/* 下チューブ */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 6,
        height: 68,
        background: 'linear-gradient(180deg, #94A3B8, #CBD5E1)',
        borderRadius: 3,
        top: 92,
      }} />

      {/* チューブ先端 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 10,
        height: 6,
        background: '#94A3B8',
        borderRadius: '0 0 5px 5px',
        top: 154,
      }} />
    </div>
  );
}
