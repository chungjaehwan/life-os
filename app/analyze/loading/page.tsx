'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const loadingTexts = [
  '이름의 기운을 읽고 있습니다...',
  '생년월일의 흐름을 해석하고 있습니다...',
  '운명의 패턴을 계산하고 있습니다...',
  '당신만의 인생 지도를 완성하고 있습니다...',
]

export default function LoadingPage() {
  const router = useRouter()
  const [textIndex, setTextIndex] = useState(0)
  const [error, setError] = useState(false)
  const [retrying, setRetrying] = useState(false)

  const analyze = async () => {
    setError(false)
    try {
      const form = JSON.parse(localStorage.getItem('lifeosForm') || '{}')
      const answers = JSON.parse(localStorage.getItem('lifeosAnswers') || '{}')

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, answers }),
      })

      if (!res.ok) throw new Error('분석 실패')

      const data = await res.json()
      localStorage.setItem('lifeosResult', JSON.stringify(data))
      router.push('/result')
    } catch {
      if (!retrying) {
        setRetrying(true)
        setTimeout(() => analyze(), 2000)
      } else {
        setError(true)
      }
    }
  }

  useEffect(() => {
    analyze()
    const interval = setInterval(() => {
      setTextIndex(prev => (prev < loadingTexts.length - 1 ? prev + 1 : prev))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: 'linear-gradient(135deg, #0A0F2E 0%, #1A0A2E 50%, #0A1A2E 100%)' }}>
        <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>분석 중 오류가 발생했습니다</p>
        <button
          onClick={() => { setRetrying(false); analyze() }}
          className="px-8 py-4 rounded-full font-bold"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080)', color: '#0A0F2E' }}>
          다시 시도하기
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: 'linear-gradient(135deg, #0A0F2E 0%, #1A0A2E 50%, #0A1A2E 100%)' }}>

      {/* 별 배경 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="text-6xl mb-8 animate-spin" style={{ animationDuration: '3s' }}>🔮</div>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-px w-16" style={{ background: '#C9A84C' }}></div>
          <span style={{ color: '#C9A84C' }}>✨</span>
          <div className="h-px w-16" style={{ background: '#C9A84C' }}></div>
        </div>
        <p className="text-lg font-medium" style={{ color: '#C9A84C' }}>{loadingTexts[textIndex]}</p>
        <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>잠시만 기다려주세요...</p>
      </div>
    </main>
  )
}