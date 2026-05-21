import { useState, useMemo } from 'react';
import { calcFlowRate, calcDripsPerMin, calcDripInterval, type DripType } from '../utils/dripCalc';
import { useMetronome } from '../hooks/useMetronome';
import { DripAnimation } from './DripAnimation';
import { FlowRatePicker } from './SlotPicker';

type InputMode = 'volume' | 'flow';

export function DripCalculator() {
  const [mode, setMode] = useState<InputMode>('volume');

  // 流速直接入力モード
  const [flowRate, setFlowRate] = useState(80);

  // 輸液量+時間モード
  const [volume, setVolume] = useState(500);
  const [timeH, setTimeH] = useState(6);

  const [dripType, setDripType] = useState<DripType>(20);
  const { isPlaying, start, stop } = useMetronome();

  const effectiveFlow = mode === 'flow' ? flowRate : (timeH > 0 ? calcFlowRate(volume, timeH) : 0);
  const dripsPerMin = useMemo(() => {
    if (mode === 'flow') {
      return effectiveFlow * dripType / 60;
    }
    return calcDripsPerMin(volume, timeH, dripType);
  }, [mode, effectiveFlow, volume, timeH, dripType]);
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
      {/* 左右2カラム入力 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        marginBottom: 16,
      }}>
        {/* 左: 量×時間 */}
        <div
          onClick={() => { setMode('volume'); stop(); }}
          style={{
            ...panelStyle,
            border: mode === 'volume' ? '2px solid #2563EB' : '2px solid transparent',
            boxShadow: mode === 'volume'
              ? '0 2px 12px rgba(37,99,235,0.15), 0 1px 3px rgba(0,0,0,0.04)'
              : '0 2px 12px rgba(0,0,0,0.06)',
            opacity: mode === 'volume' ? 1 : 0.55,
            cursor: 'pointer',
          }}
        >
          <div style={panelHeaderStyle}>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: mode === 'volume' ? '#2563EB' : '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              量×時間
            </span>
          </div>

          <label style={labelStyle}>輸液量 (mL)</label>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
            {[100, 250, 500, 1000].map(v => (
              <button
                key={v}
                onClick={e => { e.stopPropagation(); setVolume(v); setMode('volume'); stop(); }}
                style={{
                  ...chipSmallStyle,
                  ...(volume === v && mode === 'volume' ? chipActiveStyle : chipInactiveStyle),
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <label style={labelStyle}>時間 (h)</label>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 6, 8, 12, 24].map(h => (
              <button
                key={h}
                onClick={e => { e.stopPropagation(); setTimeH(h); setMode('volume'); stop(); }}
                style={{
                  ...chipSmallStyle,
                  ...(timeH === h && mode === 'volume' ? chipActiveStyle : chipInactiveStyle),
                }}
              >
                {h}
              </button>
            ))}
          </div>

          {mode === 'volume' && (
            <div style={{
              marginTop: 12,
              background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
              borderRadius: 10,
              padding: '8px 10px',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 11, color: '#64748B' }}>流速 </span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#1D4ED8' }}>
                {effectiveFlow.toFixed(1)}
              </span>
              <span style={{ fontSize: 11, color: '#64748B' }}> mL/h</span>
            </div>
          )}
        </div>

        {/* 右: 流速 */}
        <div
          onClick={() => { setMode('flow'); stop(); }}
          style={{
            ...panelStyle,
            border: mode === 'flow' ? '2px solid #2563EB' : '2px solid transparent',
            boxShadow: mode === 'flow'
              ? '0 2px 12px rgba(37,99,235,0.15), 0 1px 3px rgba(0,0,0,0.04)'
              : '0 2px 12px rgba(0,0,0,0.06)',
            opacity: mode === 'flow' ? 1 : 0.55,
            cursor: 'pointer',
          }}
        >
          <div style={panelHeaderStyle}>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: mode === 'flow' ? '#2563EB' : '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              流速
            </span>
          </div>

          <FlowRatePicker
            value={flowRate}
            onChange={v => { setFlowRate(v); setMode('flow'); stop(); }}
          />
        </div>
      </div>

      {/* 滴下筒 */}
      <div style={cardStyle}>
        <label style={labelStyle}>滴下筒タイプ</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {([20, 60] as DripType[]).map(d => (
            <button
              key={d}
              onClick={() => { setDripType(d); stop(); }}
              style={{
                ...chipSmallStyle,
                flex: 1,
                padding: '10px 8px',
                fontSize: 13,
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
          <ResultValue label="流速" value={effectiveFlow.toFixed(1)} unit="mL/h" />
          <div style={{ width: 1, background: 'rgba(59,130,246,0.15)', margin: '4px 0' }} />
          <ResultValue label="滴下数" value={dripsPerMin.toFixed(1)} unit="滴/分" highlight />
          <div style={{ width: 1, background: 'rgba(59,130,246,0.15)', margin: '4px 0' }} />
          <ResultValue label="間隔" value={intervalSec.toFixed(1)} unit="秒/滴" />
        </div>

        <DripAnimation intervalSec={intervalSec} isPlaying={isPlaying} />

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

const panelStyle: React.CSSProperties = {
  background: '#FFF',
  borderRadius: 18,
  padding: 14,
  transition: 'all 0.2s ease',
  minWidth: 0,
  overflow: 'hidden',
};

const panelHeaderStyle: React.CSSProperties = {
  marginBottom: 12,
  textAlign: 'center',
};

const cardStyle: React.CSSProperties = {
  background: '#FFF',
  borderRadius: 20,
  padding: 18,
  marginBottom: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
  border: '1px solid rgba(0,0,0,0.04)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#64748B',
  marginBottom: 6,
  display: 'block',
  letterSpacing: '0.3px',
};

const chipSmallStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 8,
  border: 'none',
  fontSize: 12,
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
