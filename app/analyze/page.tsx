'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AnalyzePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    birthdate: '',
    birthtime: '',
    gender: '',
    maritalStatus: '',
    unknownTime: false,
  })

  const isValid =
    form.name &&
    form.birthdate &&
    form.gender &&
    form.maritalStatus &&
    (form.birthtime || form.unknownTime)

  const handleSubmit = () => {
    if (!isValid) return
    localStorage.setItem('lifeosForm', JSON.stringify(form))
    router.push('/analyze/dna')
  }

  return (
    <main className="min-h-screen p-8 relative"
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

      <div className="relative z-10 w-full max-w-md mx-auto">

        <div className="flex items-center justify-center gap-2 mb-6 mt-4">
          <div className="h-px w-12" style={{ background: '#C9A84C' }}></div>
          <span className="text-xl">🔮</span>
          <div className="h-px w-12" style={{ background: '#C9A84C' }}></div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-white">기본 정보 입력</h1>
        <p className="text-center text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          정확한 정보를 입력할수록 정밀한 분석이 가능합니다
        </p>

        {/* 이름 */}
        <div className="mb-4">
          <label className="block text-sm mb-2" style={{ color: '#C9A84C' }}>이름</label>
          <input
            type="text"
            placeholder="홍길동"
            maxLength={5}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,168,76,0.3)' }}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* 생년월일 */}
        <div className="mb-4">
          <label className="block text-sm mb-2" style={{ color: '#C9A84C' }}>생년월일</label>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            maxLength={10}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,168,76,0.3)' }}
            value={form.birthdate}
            onChange={e => setForm({ ...form, birthdate: e.target.value })}
          />
        </div>

        {/* 출생시간 */}
        <div className="mb-4">
          <label className="block text-sm mb-2" style={{ color: '#C9A84C' }}>출생시간</label>
          <input
            type="text"
            placeholder="HH:MM"
            maxLength={5}
            disabled={form.unknownTime}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,168,76,0.3)' }}
            value={form.birthtime}
            onChange={e => setForm({ ...form, birthtime: e.target.value })}
          />
          <label className="flex items-center mt-2 text-sm cursor-pointer" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <input
              type="checkbox"
              className="mr-2"
              checked={form.unknownTime}
              onChange={e => setForm({ ...form, unknownTime: e.target.checked, birthtime: '' })}
            />
            출생시간 모름
          </label>
        </div>

        {/* 성별 */}
        <div className="mb-4">
          <label className="block text-sm mb-2" style={{ color: '#C9A84C' }}>성별</label>
          <div className="flex gap-3">
            {['남', '여'].map(g => (
              <button key={g} onClick={() => setForm({ ...form, gender: g })}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: form.gender === g ? 'linear-gradient(135deg, #C9A84C, #F0D080)' : 'rgba(255,255,255,0.07)',
                  color: form.gender === g ? '#0A0F2E' : 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(201,168,76,0.3)',
                }}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 결혼상태 */}
        <div className="mb-8">
          <label className="block text-sm mb-2" style={{ color: '#C9A84C' }}>현재 상태</label>
          <div className="grid grid-cols-2 gap-3">
            {['미혼', '연애 중', '기혼', '답하고 싶지 않음'].map(s => (
              <button key={s} onClick={() => setForm({ ...form, maritalStatus: s })}
                className="py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: form.maritalStatus === s ? 'linear-gradient(135deg, #C9A84C, #F0D080)' : 'rgba(255,255,255,0.07)',
                  color: form.maritalStatus === s ? '#0A0F2E' : 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(201,168,76,0.3)',
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!isValid}
          className="w-full py-4 rounded-full font-bold text-lg transition-all hover:scale-105 disabled:opacity-30"
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