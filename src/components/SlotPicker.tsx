import { useRef, useEffect, useCallback } from 'react';

const ITEM_H = 48;
const VISIBLE = 5;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** 単一桁ホイール */
function DigitWheel({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startScroll = useRef(0);
  const isDragging = useRef(false);

  const scrollToIdx = useCallback((i: number, smooth = true) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: i * ITEM_H,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  useEffect(() => { scrollToIdx(value, false); }, []);

  const snap = () => {
    if (!containerRef.current) return;
    const top = containerRef.current.scrollTop;
    const i = Math.round(top / ITEM_H);
    const clamped = Math.max(0, Math.min(9, i));
    if (clamped !== value) onChange(clamped);
    scrollToIdx(clamped);
  };

  const handleScroll = () => {
    if (!containerRef.current || isDragging.current) return;
    const top = containerRef.current.scrollTop;
    const i = Math.round(top / ITEM_H);
    const clamped = Math.max(0, Math.min(9, i));
    if (clamped !== value) onChange(clamped);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScroll.current = containerRef.current?.scrollTop ?? 0;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    containerRef.current.scrollTop = startScroll.current - (e.clientY - startY.current);
  };

  const onPointerUp = () => {
    isDragging.current = false;
    snap();
  };

  return (
    <div style={{
      position: 'relative',
      height: ITEM_H * VISIBLE,
      flex: 1,
      minWidth: 0,
      userSelect: 'none',
      touchAction: 'none',
    }}>
      {/* グラデーションマスク */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H * 2,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0))',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_H * 2,
        background: 'linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0))',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          height: '100%',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          scrollSnapType: 'y mandatory',
          cursor: 'grab',
        }}
      >
        <div style={{ height: ITEM_H * 2 }} />
        {DIGITS.map(d => (
          <div
            key={d}
            onClick={() => { onChange(d); scrollToIdx(d); }}
            style={{
              height: ITEM_H,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scrollSnapAlign: 'center',
              fontSize: d === value ? 32 : 20,
              fontWeight: d === value ? 800 : 400,
              color: d === value ? '#1E293B' : '#CBD5E1',
              transition: 'all 0.15s',
            }}
          >
            {d}
          </div>
        ))}
        <div style={{ height: ITEM_H * 2 }} />
      </div>
    </div>
  );
}

/** 3桁の流速ピッカー (0〜999 mL/h) */
export function FlowRatePicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const clamped = Math.max(0, Math.min(999, Math.round(value)));
  const hundreds = Math.floor(clamped / 100);
  const tens = Math.floor((clamped % 100) / 10);
  const ones = clamped % 10;

  const update = (h: number, t: number, o: number) => {
    const v = h * 100 + t * 10 + o;
    onChange(Math.max(1, v)); // 最低1mL/h
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        position: 'relative',
      }}>
        {/* 選択枠（3桁を横断） */}
        <div style={{
          position: 'absolute',
          top: ITEM_H * 2,
          left: 0,
          right: 0,
          height: ITEM_H,
          background: 'rgba(37,99,235,0.06)',
          borderTop: '2px solid rgba(37,99,235,0.2)',
          borderBottom: '2px solid rgba(37,99,235,0.2)',
          borderRadius: 12,
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        <DigitWheel value={hundreds} onChange={h => update(h, tens, ones)} />
        <DigitWheel value={tens} onChange={t => update(hundreds, t, ones)} />
        <DigitWheel value={ones} onChange={o => update(hundreds, tens, o)} />
      </div>

      {/* 単位ラベル */}
      <div style={{
        textAlign: 'center',
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: 600,
        marginTop: 4,
        letterSpacing: '0.5px',
      }}>
        mL/h
      </div>
    </div>
  );
}
