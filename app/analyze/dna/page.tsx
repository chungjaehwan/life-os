'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const questions = [
  { id: 1, text: '새로운 아이디어를 떠올리는 걸 즐긴다' },
  { id: 2, text: '한번 시작한 일은 반드시 끝낸다' },
  { id: 3, text: '사람들 앞에서 말하는 게 자연스럽다' },
  { id: 4, text: '계획보다 즉흥적으로 움직이는 편이다' },
  { id: 5, text: '팀에서 자연스럽게 리더 역할을 맡는다' },
  { id: 6, text: '혼자 있는 시간이 에너지 충전이 된다' },
  { id: 7, text: '위험을 감수하고 새로운 도전을 즐긴다' },
  { id: 8, text: '규칙과 원칙을 중요하게 생각한다' },
  { id: 9, text: '상대방 감정을 빠르게 파악하는 편이다' },
  { id: 10, text: '안정된 환경이 자유로운 환경보다 편하다' },
  { id: 11, text: '경쟁 상황에서 오히려 집중력이 올라간다' },
  { id: 12, text: '상상하고 창작하는 활동을 좋아한다' },
  { id: 13, text: '사람들과 어울릴 때 에너지가 생긴다' },
  { id: 14, text: '감보다 데이터와 논리로 결정한다' },
  { id: 15, text: '오래된 관계를 소중하게 유지한다' },
]

const labels = ['전혀 아니다', '아닌 편', '보통', '그런 편', '매우 그렇다']

export default function DnaPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const isComplete = Object.keys(answers).length === questions.length
  const progress = (Object.keys(answers).length / questions.length) * 100

  const handleSubmit = () => {
    if (!isComplete) return
    localStorage.setItem('lifeosAnswers', JSON.stringify(answers))
    router.push('/analyze/loading')
  }

  return (
    <main className="min-h-screen p-6 relative"
      style={{ background: 'linear-gradient(135deg, #0A0F2E 0%, #1A0A2E 50%, #0A1A2E 100%)' }}>

      {/* 별 배경 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">

        <div className="flex items-center justify-center gap-2 mb-4 mt-2">
          <div className="h-px w-12" style={{ background: '#C9A84C' }}></div>
          <span className="text-xl">✨</span>
          <div className="h-px w-12" style={{ background: '#C9A84C' }}></div>
        </div>

        <h1 className="text-xl font-bold text-center mb-1 text-white">성향 분석</h1>
        <p className="text-center text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>약 3분 소요됩니다</p>

        {/* 프로그레스 바 */}
        <div className="w-full rounded-full h-1.5 mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #C9A84C, #F0D080)' }} />
        </div>

        {questions.map(q => (
          <div key={q.id} className="mb-6 rounded-xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <p className="text-sm mb-4 text-white">{q.id}. {q.text}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button key={score}
                  onClick={() => setAnswers({ ...answers, [q.id]: score })}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: answers[q.id] === score
                      ? 'linear-gradient(135deg, #C9A84C, #F0D080)'
                      : 'rgba(255,255,255,0.07)',
                    color: answers[q.id] === score ? '#0A0F2E' : 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(201,168,76,0.2)',
                  }}>
                  {score}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span>{labels[0]}</span>
              <span>{labels[4]}</span>
            </div>
          </div>
        ))}

        <button onClick={handleSubmit} disabled={!isComplete}
          className="w-full py-4 rounded-full font-bold text-lg transition-all hover:scale-105 disabled:opacity-30 mt-4 mb-8"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
            color: '#0A0F2E',
            boxShadow: '0 0 20px rgba(201,168,76,0.3)',
          }}>
          운명 분석 시작 →
        </button>

      </div>
    </main>
  )
}