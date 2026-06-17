 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const questions = [
  { id: 1, text: '새로운 아이디어를 떠올리는 걸 즐긴다', element: '목' },
  { id: 2, text: '한번 시작한 일은 반드시 끝낸다', element: '토' },
  { id: 3, text: '사람들 앞에서 말하는 게 자연스럽다', element: '화' },
  { id: 4, text: '계획보다 즉흥적으로 움직이는 편이다', element: '목' },
  { id: 5, text: '팀에서 자연스럽게 리더 역할을 맡는다', element: '금' },
  { id: 6, text: '혼자 있는 시간이 에너지 충전이 된다', element: '수' },
  { id: 7, text: '위험을 감수하고 새로운 도전을 즐긴다', element: '화' },
  { id: 8, text: '규칙과 원칙을 중요하게 생각한다', element: '금' },
  { id: 9, text: '상대방 감정을 빠르게 파악하는 편이다', element: '수' },
  { id: 10, text: '안정된 환경이 자유로운 환경보다 편하다', element: '토' },
  { id: 11, text: '경쟁 상황에서 오히려 집중력이 올라간다', element: '금' },
  { id: 12, text: '상상하고 창작하는 활동을 좋아한다', element: '목' },
  { id: 13, text: '사람들과 어울릴 때 에너지가 생긴다', element: '화' },
  { id: 14, text: '감보다 데이터와 논리로 결정한다', element: '수' },
  { id: 15, text: '오래된 관계를 소중하게 유지한다', element: '토' },
]

const labels = ['전혀 아니다', '아닌 편이다', '보통', '그런 편이다', '매우 그렇다']

export default function DnaPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const isComplete = Object.keys(answers).length === questions.length

  const handleSubmit = () => {
    if (!isComplete) return
    localStorage.setItem('lifeosAnswers', JSON.stringify(answers))
    router.push('/analyze/loading')
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-center">성향 분석</h1>
        <p className="text-gray-500 text-sm text-center mb-2">약 3분 소요됩니다</p>

        {/* 프로그레스 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-black h-2 rounded-full transition-all"
            style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
          />
        </div>

        {questions.map(q => (
          <div key={q.id} className="mb-8">
            <p className="font-medium mb-3">{q.id}. {q.text}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  onClick={() => setAnswers({ ...answers, [q.id]: score })}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                    answers[q.id] === score
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{labels[0]}</span>
              <span>{labels[4]}</span>
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="w-full bg-black text-white py-4 rounded-full text-lg font-medium disabled:bg-gray-300 mt-4"
        >
          분석 시작 →
        </button>
      </div>
    </main>
  )
}
