 'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const loadingTexts = [
  '이름 에너지를 분석하고 있습니다...',
  '생년월일 데이터를 해석하고 있습니다...',
  '성향 패턴을 계산하고 있습니다...',
  '당신만의 인생 청사진을 완성하고 있습니다...',
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
    } catch (e) {
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
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <p className="text-gray-500 mb-6">분석 중 오류가 발생했습니다</p>
        <button
          onClick={() => { setRetrying(false); analyze() }}
          className="bg-black text-white px-8 py-4 rounded-full"
        >
          다시 시도하기
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-8" />
      <p className="text-lg font-medium text-center">{loadingTexts[textIndex]}</p>
    </main>
  )
}
