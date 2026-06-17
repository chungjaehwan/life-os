export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A0F2E 0%, #1A0A2E 50%, #0A1A2E 100%)' }}>
      
      {/* 별 배경 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* 달 장식 */}
      <div className="absolute top-8 right-8 text-6xl opacity-80">🌙</div>
      <div className="absolute top-16 left-8 text-4xl opacity-60">✨</div>
      <div className="absolute bottom-16 right-16 text-4xl opacity-60">⭐</div>
      <div className="absolute bottom-8 left-8 text-5xl opacity-70">☁️</div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center max-w-lg">
        {/* 상단 장식 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-16" style={{ background: '#C9A84C' }}></div>
          <span className="text-2xl">🔮</span>
          <div className="h-px w-16" style={{ background: '#C9A84C' }}></div>
        </div>

        <p className="text-sm tracking-widest mb-2" style={{ color: '#C9A84C' }}>AI 인생 분석</p>
        
        <h1 className="text-4xl font-bold mb-4 text-white" style={{ textShadow: '0 0 20px rgba(201,168,76,0.5)' }}>
          당신의 운명을<br />알고 싶으신가요?
        </h1>
        
        <p className="mb-8 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          이름과 생년월일로 당신의<br />
          인생 패턴과 운명의 흐름을 분석합니다
        </p>

        {/* 사신수 장식 */}
        <div className="flex justify-center gap-6 mb-8 text-3xl">
          <span title="청룡">🐉</span>
          <span title="백호">🐯</span>
          <span title="주작">🦅</span>
          <span title="현무">🐢</span>
        </div>

        <a href="/analyze"
          className="inline-block px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
            color: '#0A0F2E',
            boxShadow: '0 0 20px rgba(201,168,76,0.4)',
          }}>
          지금 바로 알아보기 →
        </a>

        <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          엔터테인먼트 목적의 서비스입니다
        </p>
      </div>
    </main>
  )
}