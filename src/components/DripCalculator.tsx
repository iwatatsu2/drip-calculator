import { useState, useMemo } from 'react';
import { calcFlowRate, calcDripsPerMin, calcDripInterval, type DripType } from '../utils/dripCalc';
import { useMetronome } from '../hooks/useMetronome';
import { DripAnimation } from './DripAnimation';

export function DripCalculator() {
  const [volume, setVolume] = useState(500);
  const [timeH, setTimeH] = useState(6);
  const [dripType, setDripType] = useState<DripType>(20);
  const { isPlaying, start, stop } = useMetronome();

  const flowRate = useMemo(() => calcFlowRate(volume, timeH), [volume, timeH]);
  const dripsPerMin = useMemo(() => calcDripsPerMin(volume, timeH, dripType), [volume, timeH, dripType]);
  const intervalSec = useMemo(() => calcDripInterval(dripsPerMin), [dripsPerMin]);

  const handleToggle = () => {
    if (isPlaying) {
      stop();
    } else {
      start(intervalSec);
    }
  };

  return (
    <div style={{ padding: '20px 16px' }}>
      {/* 入力エリア */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <span style={{ fontSize: 15, marginRight: 6 }}>⚙️</span>
          設定
        </div>

        <label style={labelStyle}>輸液量 (mL)</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          {[100, 250, 500, 1000].map(v => (
            <button
              key={v}
              onClick={() => { setVolume(v); stop(); }}
              style={{
                ...chipStyle,
                ...(volume === v ? chipActiveStyle : chipInactiveStyle),
              }}
            >
              {v}
            </button>
          ))}
          <input
            type="number"
            value={volume}
            onChange={e => { setVolume(Number(e.target.value)); stop(); }}
            style={numInputStyle}
            min={1}
          />
        </div>

        <label style={labelStyle}>投与時間</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 6, 8, 12, 24].map(h => (
            <button
              key={h}
              onClick={() => { setTimeH(h); stop(); }}
              style={{
                ...chipStyle,
                ...(timeH === h ? chipActiveStyle : chipInactiveStyle),
              }}
            >
              {h}h
            </button>
          ))}
        </div>

        <label style={labelStyle}>滴下筒タイプ</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {([20, 60] as DripType[]).map(d => (
            <button
              key={d}
              onClick={() => { setDripType(d); stop(); }}
              style={{
                ...chipStyle,
                flex: 1,
                padding: '10px 8px',
                ...(dripType === d ? chipActiveStyle : chipInactiveStyle),
              }}
            >
              {d === 20 ? '成人用 20滴/mL' : '小児用 60滴/mL'}
            </button>
          ))}
        </div>
      </div>

      {/* 結果カード */}
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '1px solid rgba(59,130,246,0.15)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 8 }}>
          <ResultValue label="流速" value={flowRate.toFixed(1)} unit="mL/h" />
          <div style={{ width: 1, background: 'rgba(59,130,246,0.15)', margin: '4px 0' }} />
          <ResultValue label="滴下数" value={dripsPerMin.toFixed(1)} unit="滴/分" highlight />
          <div style={{ width: 1, background: 'rgba(59,130,246,0.15)', margin: '4px 0' }} />
          <ResultValue label="間隔" value={intervalSec.toFixed(1)} unit="秒/滴" />
        </div>

        {/* アニメーション */}
        <DripAnimation intervalSec={intervalSec} isPlaying={isPlaying} />

        {/* 再生ボタン */}
        <button
          onClick={handleToggle}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '16px 0',
            borderRadius: 14,
            border: 'none',
            fontSize: 17,
            fontWeight: 700,
            cursor: 'pointer',
            color: '#FFF',
            letterSpacing: '0.5px',
            ...(isPlaying
              ? {
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
                }
              : {
                  background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  animation: 'pulse 2s infinite',
                }),
          }}
        >
          {isPlaying ? '■  停止' : '▶  メトロノーム再生'}
        </button>
      </div>
    </div>
  );
}

function ResultValue({ label, value, unit, highlight }: {
  label: string; value: string; unit: string; highlight?: boolean;
}) {
  return (
    <div style={{ flex: 1, padding: '4px 0' }}>
      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{
        fontSize: highlight ? 34 : 28,
        fontWeight: 800,
        color: highlight ? '#1D4ED8' : '#1E40AF',
        lineHeight: 1,
        letterSpacing: '-1px',
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: 500 }}>{unit}</div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#FFF',
  borderRadius: 20,
  padding: 22,
  marginBottom: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
  border: '1px solid rgba(0,0,0,0.04)',
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: '#1E293B',
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#64748B',
  marginBottom: 8,
  display: 'block',
  letterSpacing: '0.3px',
};

const chipStyle: React.CSSProperties = {
  padding: '9px 16px',
  borderRadius: 10,
  border: 'none',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const chipActiveStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
  color: '#FFF',
  boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
};

const chipInactiveStyle: React.CSSProperties = {
  background: '#F1F5F9',
  color: '#475569',
  border: '1px solid #E2E8F0',
};

const numInputStyle: React.CSSProperties = {
  width: 72,
  padding: '9px 10px',
  borderRadius: 10,
  border: '1.5px solid #CBD5E1',
  fontSize: 14,
  textAlign: 'center',
  background: '#FFF',
};
