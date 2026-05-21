import { calcFlowRate, calcDripsPerMin, calcDripInterval, QUICK_REF } from '../utils/dripCalc';

export function QuickReference() {
  return (
    <div style={{ padding: '20px 16px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
        borderRadius: 14,
        padding: '12px 16px',
        marginBottom: 16,
        border: '1px solid rgba(59,130,246,0.1)',
        fontSize: 13,
        color: '#1D4ED8',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>📊</span>
        成人用 20滴/mL での早見表
      </div>

      {QUICK_REF.map(({ volume, hours }) => (
        <div key={volume} style={{
          background: '#FFF',
          borderRadius: 20,
          marginBottom: 14,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
          overflow: 'hidden',
          animation: 'fadeInUp 0.3s ease',
        }}>
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              color: '#FFF',
              padding: '4px 12px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 800,
            }}>
              {volume}
            </div>
            <span style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>mL</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={thStyle}>時間</th>
                <th style={thStyle}>mL/h</th>
                <th style={{ ...thStyle, color: '#1D4ED8' }}>滴/分</th>
                <th style={thStyle}>秒/滴</th>
              </tr>
            </thead>
            <tbody>
              {hours.map((h, i) => {
                const flow = calcFlowRate(volume, h);
                const drips = calcDripsPerMin(volume, h, 20);
                const interval = calcDripInterval(drips);
                return (
                  <tr key={h} style={{
                    borderBottom: i < hours.length - 1 ? '1px solid #F1F5F9' : 'none',
                    background: i % 2 === 0 ? '#FFF' : '#FAFBFC',
                  }}>
                    <td style={{ ...tdStyle, color: '#64748B', fontWeight: 600 }}>
                      {h >= 1 ? `${h}h` : `${h * 60}min`}
                    </td>
                    <td style={tdStyle}>{flow.toFixed(0)}</td>
                    <td style={{
                      ...tdStyle,
                      fontWeight: 800,
                      color: '#1D4ED8',
                      fontSize: 15,
                    }}>
                      {drips.toFixed(1)}
                    </td>
                    <td style={{ ...tdStyle, color: '#64748B' }}>{interval.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '10px 4px',
  fontWeight: 600,
  fontSize: 12,
  color: '#94A3B8',
  letterSpacing: '0.3px',
};

const tdStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '12px 4px',
  color: '#334155',
};
