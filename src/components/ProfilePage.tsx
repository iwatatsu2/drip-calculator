const links = [
  { icon: '🌐', label: '公式サイト', url: 'https://driwatatsu.readdy.co' },
  { icon: '🏥', label: '医療アプリまとめ', url: 'https://medapp-market.vercel.app' },
  { icon: '📷', label: 'Instagram', url: 'https://www.instagram.com/dr.iwatatsu/' },
  { icon: '𝕏', label: 'X (Twitter)', url: 'https://x.com/KenKyu1019799' },
  { icon: '📝', label: 'note', url: 'https://note.com/dr_iwatatsu' },
  { icon: '📊', label: 'antaaスライド', url: 'https://slide.antaa.jp/profile/mtzDnleJ6DYJ' },
];

export function ProfilePage({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ padding: '24px 16px 40px' }}>
      {/* 戻るボタン */}
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: '#2563EB',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          padding: '4px 0',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        ← 戻る
      </button>

      {/* プロフィールカード */}
      <div style={{
        background: '#FFF',
        borderRadius: 20,
        padding: '32px 24px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.04)',
        textAlign: 'center',
      }}>
        {/* アイコン */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto 16px',
          boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
        }}>
          <img
            src="/dr-iwatatsu.png"
            alt="Dr. いわたつ"
            style={{
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              height: '200%',
            }}
          />
        </div>

        <div style={{ fontSize: 20, fontWeight: 800, color: '#1E293B' }}>
          Dr. いわたつ
        </div>
        <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
          岩本 達也｜糖尿病・内分泌 専門医・指導医
        </div>
      </div>

      {/* 自己紹介文 */}
      <div style={{
        background: '#FFF',
        borderRadius: 16,
        padding: '20px',
        marginTop: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.04)',
      }}>
        <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.8, margin: 0 }}>
          糖尿病・内分泌の専門医として日々診療に取り組みながら、「現場で本当に使えるツールを自分の手で作る」をモットーにWebアプリを開発しています。
        </p>
        <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.8, margin: '12px 0 0' }}>
          点滴の滴下速度調整や腎機能別の薬用量チェックなど、忙しい病棟業務をサポートするツールを無料で公開中。看護師さんの「これ便利！」が何よりの励みです。
        </p>
      </div>

      {/* リンク一覧 */}
      <div style={{
        background: '#FFF',
        borderRadius: 16,
        padding: '8px',
        marginTop: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.04)',
      }}>
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              textDecoration: 'none',
              color: '#1E293B',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 12,
              transition: 'background 0.15s',
              borderBottom: i < links.length - 1 ? '1px solid #F1F5F9' : 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: 18 }}>{link.icon}</span>
            <span style={{ flex: 1 }}>{link.label}</span>
            <span style={{ color: '#94A3B8', fontSize: 16 }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
