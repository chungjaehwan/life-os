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
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">기본 정보 입력</h1>

        {/* 이름 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">이름</label>
          <input
            type="text"
            placeholder="홍길동"
            maxLength={5}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* 생년월일 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">생년월일</label>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            maxLength={10}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.birthdate}
            onChange={e => setForm({ ...form, birthdate: e.target.value })}
          />
        </div>

        {/* 출생시간 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">출생시간</label>
          <input
            type="text"
            placeholder="HH:MM"
            maxLength={5}
            disabled={form.unknownTime}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
            value={form.birthtime}
            onChange={e => setForm({ ...form, birthtime: e.target.value })}
          />
          <label className="flex items-center mt-2 text-sm text-gray-500 cursor-pointer">
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
          <label className="block text-sm font-medium mb-1">성별</label>
          <div className="flex gap-3">
            {['남', '여'].map(g => (
              <button
                key={g}
                onClick={() => setForm({ ...form, gender: g })}
                className={`flex-1 py-3 rounded-lg border text-sm font-medium ${
                  form.gender === g ? 'bg-black text-white border-black' : 'border-gray-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 결혼상태 */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-1">현재 상태</label>
          <div className="grid grid-cols-2 gap-3">
            {['미혼', '연애 중', '기혼', '답하고 싶지 않음'].map(s => (
              <button
                key={s}
                onClick={() => setForm({ ...form, maritalStatus: s })}
                className={`py-3 rounded-lg border text-sm font-medium ${
                  form.maritalStatus === s ? 'bg-black text-white border-black' : 'border-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full bg-black text-white py-4 rounded-full text-lg font-medium disabled:bg-gray-300"
        >
          다음 →
        </button>
      </div>
    </main>
  )
}
