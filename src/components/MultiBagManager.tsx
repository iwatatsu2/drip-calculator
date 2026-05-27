import { useState, useEffect } from 'react';
import { calcFlowRate, calcDripsPerMin, calcEndTime, calcRemainingMin, type BagInfo, type DripType } from '../utils/dripCalc';

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const emptyBag = (): BagInfo => ({
  id: crypto.randomUUID(),
  name: '',
  volumeMl: 500,
  timeH: 6,
  startTime: nowHHMM(),
});

const BAG_COLORS = ['#2563EB', '#059669', '#D97706', '#7C3AED'];

export function MultiBagManager() {
  const [bags, setBags] = useState<BagInfo[]>([emptyBag()]);
  const [dripType, setDripType] = useState<DripType>(20);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const addBag = () => {
    if (bags.length >= 4) return;
    const lastBag = bags[bags.length - 1];
    const nextStart = calcEndTime(lastBag.startTime, lastBag.timeH);
    setBags([...bags, { ...emptyBag(), startTime: nextStart }]);
  };

  const removeBag = (id: string) => {
    if (bags.length <= 1) return;
    setBags(bags.filter(b => b.id !== id));
  };

  const updateBag = (id: string, field: keyof BagInfo, value: string | number) => {
    setBags(bags.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  return (
    <div style={{ padding: '20px 16px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
        borderRadius: 14,
        padding: '12px 16px',
        marginBottom: 16,
        border: '1px solid rgba(5,150,105,0.1)',
        fontSize: 13,
        color: '#047857',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>💡</span>
        点滴を順番に登録すると、交換タイミングが一目でわかります
      </div>

      {/* 滴下筒タイプ切替 */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
      }}>
        {([20, 60] as DripType[]).map(t => (
          <button
            key={t}
            onClick={() => setDripType(t)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 12,
              border: dripType === t ? '2px solid #2563EB' : '2px solid #E2E8F0',
              background: dripType === t ? '#EFF6FF' : '#FFF',
              color: dripType === t ? '#2563EB' : '#64748B',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t === 20 ? '成人用（20滴/mL）' : '小児用（60滴/mL）'}
          </button>
        ))}
      </div>

      {bags.map((bag, i) => {
        const endTime = calcEndTime(bag.startTime, bag.timeH);
        const remaining = calcRemainingMin(endTime, now);
        const flow = calcFlowRate(bag.volumeMl, bag.timeH);
        const drips = calcDripsPerMin(bag.volumeMl, bag.timeH, dripType);
        const isUrgent = remaining <= 30;
        const color = BAG_COLORS[i];

        return (
          <div key={bag.id} style={{
            background: '#FFF',
            borderRadius: 20,
            padding: 0,
            marginBottom: 14,
            boxShadow: isUrgent
              ? '0 0 0 2px #F59E0B, 0 4px 16px rgba(245,158,11,0.15)'
              : '0 2px 12px rgba(0,0,0,0.06)',
            border: isUrgent ? 'none' : '1px solid rgba(0,0,0,0.04)',
            overflow: 'hidden',
            animation: 'fadeInUp 0.3s ease',
          }}>
            {/* カラーバー + ヘッダー */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px 10px',
              borderBottom: '1px solid #F1F5F9',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  fontSize: 13,
                  fontWeight: 800,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontWeight: 700, color: '#1E293B', fontSize: 15 }}>
                  {bag.name || `点滴 #${i + 1}`}
                </span>
              </div>
              {bags.length > 1 && (
                <button onClick={() => removeBag(bag.id)} style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: 8,
                }}>
                  削除
                </button>
              )}
            </div>

            {/* 入力フォーム */}
            <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, overflow: 'hidden' }}>
              <div>
                <label style={labelStyle}>薬剤名</label>
                <input
                  value={bag.name}
                  onChange={e => updateBag(bag.id, 'name', e.target.value)}
                  placeholder="例: 生食"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>開始時刻</label>
                <input
                  type="time"
                  value={bag.startTime}
                  onChange={e => updateBag(bag.id, 'startTime', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>輸液量 (mL)</label>
                <input
                  type="number"
                  value={bag.volumeMl}
                  onChange={e => updateBag(bag.id, 'volumeMl', Number(e.target.value))}
                  min={1}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>投与時間 (h)</label>
                <input
                  type="number"
                  value={bag.timeH}
                  onChange={e => updateBag(bag.id, 'timeH', Number(e.target.value))}
                  min={0.5}
                  step={0.5}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 結果バー */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: isUrgent
                ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)'
                : 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
              padding: '12px 18px',
              fontSize: 13,
            }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <span><b style={{ color: '#1E293B' }}>{flow.toFixed(0)}</b> <span style={{ color: '#94A3B8', fontSize: 11 }}>mL/h</span></span>
                <span><b style={{ color: '#1E293B' }}>{drips.toFixed(1)}</b> <span style={{ color: '#94A3B8', fontSize: 11 }}>滴/分</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#64748B', fontSize: 12 }}>
                  {bag.startTime} → <b>{endTime}</b>
                </span>
                <span style={{
                  background: isUrgent ? '#F59E0B' : '#10B981',
                  color: '#FFF',
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  残{remaining}分
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {bags.length < 4 && (
        <button onClick={addBag} style={{
          width: '100%',
          padding: '16px 0',
          borderRadius: 16,
          border: '2px dashed #CBD5E1',
          background: 'rgba(255,255,255,0.6)',
          fontSize: 15,
          color: '#2563EB',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          <span style={{ fontSize: 20, fontWeight: 300 }}>+</span>
          点滴を追加
        </button>
      )}

      {/* タイムライン */}
      {bags.length > 1 && (
        <div style={{
          marginTop: 20,
          background: '#FFF',
          borderRadius: 20,
          padding: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}>
          <div style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#1E293B',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>📅</span>
            タイムライン
          </div>
          {bags.map((bag, i) => {
            const endTime = calcEndTime(bag.startTime, bag.timeH);
            const color = BAG_COLORS[i];
            return (
              <div key={bag.id} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: i < bags.length - 1 ? 0 : 0,
                position: 'relative',
                paddingLeft: 24,
                paddingBottom: i < bags.length - 1 ? 16 : 0,
              }}>
                {/* 縦線 */}
                {i < bags.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: 9,
                    top: 12,
                    width: 2,
                    height: '100%',
                    background: '#E2E8F0',
                  }} />
                )}
                {/* ドット */}
                <div style={{
                  position: 'absolute',
                  left: 4,
                  top: 4,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: color,
                  border: '2px solid #FFF',
                  boxShadow: `0 0 0 2px ${color}30`,
                }} />
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: 12,
                  padding: '10px 14px',
                  flex: 1,
                  fontSize: 13,
                  color: '#475569',
                }}>
                  <b style={{ color: '#1E293B' }}>{bag.startTime}</b>
                  <span style={{ color: '#94A3B8', margin: '0 6px' }}>→</span>
                  <b style={{ color: '#1E293B' }}>{endTime}</b>
                  <span style={{ margin: '0 8px', color: '#94A3B8' }}>|</span>
                  <span>{bag.name || `#${i + 1}`}</span>
                  <span style={{ color: '#94A3B8', marginLeft: 6 }}>
                    ({bag.volumeMl}mL / {bag.timeH}h)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#94A3B8',
  marginBottom: 5,
  display: 'block',
  letterSpacing: '0.3px',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1.5px solid #E2E8F0',
  fontSize: 14,
  boxSizing: 'border-box',
  background: '#FAFBFC',
  WebkitAppearance: 'none',
};
