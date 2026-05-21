import { useState } from 'react';
import { DripCalculator } from './components/DripCalculator';
import { MultiBagManager } from './components/MultiBagManager';
import { QuickReference } from './components/QuickReference';

type Page = 'calc' | 'multi' | 'ref';

const tabs: { key: Page; icon: string; label: string }[] = [
  { key: 'calc', icon: '♪', label: 'メトロノーム' },
  { key: 'multi', icon: '⚡', label: '複数本管理' },
  { key: 'ref', icon: '📋', label: '早見表' },
];

function App() {
  const [page, setPage] = useState<Page>('calc');

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      minHeight: '100dvh',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 0 60px rgba(0,0,0,0.08)',
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)',
        padding: '24px 24px 20px',
        color: '#FFF',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 装飾的な背景パターン */}
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -10,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>
              💧
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                点滴メトロノーム
              </h1>
              <p style={{ fontSize: 11, margin: '2px 0 0', opacity: 0.7, letterSpacing: '0.5px' }}>
                IV Drip Rate Calculator
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* タブ */}
      <div style={{
        display: 'flex',
        padding: '0 8px',
        background: '#FFF',
        borderBottom: '1px solid #E2E8F0',
      }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setPage(t.key)}
            style={{
              flex: 1,
              padding: '14px 0 12px',
              border: 'none',
              background: 'none',
              fontSize: 13,
              fontWeight: page === t.key ? 700 : 500,
              color: page === t.key ? '#2563EB' : '#94A3B8',
              borderBottom: page === t.key ? '3px solid #2563EB' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      <div style={{ animation: 'fadeInUp 0.3s ease' }} key={page}>
        {page === 'calc' && <DripCalculator />}
        {page === 'multi' && <MultiBagManager />}
        {page === 'ref' && <QuickReference />}
      </div>

      {/* フッター */}
      <div style={{
        textAlign: 'center',
        padding: '24px 16px 32px',
        fontSize: 11,
        color: '#94A3B8',
        lineHeight: 1.6,
      }}>
        医療従事者の業務補助ツールです<br />
        実際の投与は必ず医師の指示に従ってください
      </div>
    </div>
  );
}

export default App;
