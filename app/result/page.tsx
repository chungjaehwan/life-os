'use client'

import { useEffect, useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const archetypeInfo = {
  Creator:    { emoji: '🌱', desc: '세상에 없던 것을 만들어내는 사람', color: '#2D6A4F' },
  Connector:  { emoji: '🔥', desc: '사람과 사람 사이를 잇는 사람', color: '#E76F51' },
  Guardian:   { emoji: '🌍', desc: '주변을 안정적으로 지키는 사람', color: '#8B5E3C' },
  Strategist: { emoji: '⚔️', desc: '목표를 향해 치밀하게 나아가는 사람', color: '#1D3557' },
  Thinker:    { emoji: '💧', desc: '깊이 생각하고 본질을 꿰뚫는 사람', color: '#457B9D' },
}

function parseReport(report: string) {
  const cleaned = report
    .replace(/^#[^#\n]*\n/gm, '')
    .replace(/---/g, '')
    .trim()
  const sections = cleaned.split(/^## /m).filter(Boolean)
  return sections.map(section => {
    const lines = section.trim().split('\n')
    const title = lines[0].trim().replace(/#{1,3}\s*/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim()
    const content = lines.slice(1).join('\n')
      .replace(/#{1,3}\s*/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/---/g, '')
      .trim()
    return { title, content }
  })
}

export default function ResultPage() {
  const [result, setResult] = useState<any>(null)
  const [tab, setTab] = useState('type')

  useEffect(() => {
    const data = localStorage.getItem('lifeosResult')
    if (data) setResult(JSON.parse(data))
  }, [])

  if (!result) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">결과를 불러오는 중...</p>
      </main>
    )
  }

  const info = archetypeInfo[result.archetype] || archetypeInfo['Creator']
  const chartData = Object.entries(result.lifeScore).map(([name, value]) => ({ name, value }))
  const sections = parseReport(result.report)

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="w-full max-w-lg mx-auto">

        <div className="rounded-2xl p-8 text-white text-center mb-6" style={{ backgroundColor: info.color }}>
          <p className="text-5xl mb-3">{info.emoji}</p>
          <h1 className="text-3xl font-bold mb-2">{result.archetype}</h1>
          <p className="text-white/80">{info.desc}</p>
          <p className="text-white/60 text-sm mt-2">{result.name}님의 유형</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('type')} className={`flex-1 py-3 rounded-lg font-medium ${tab === 'type' ? 'bg-black text-white' : 'border border-gray-300'}`}>
            내 유형
          </button>
          <button onClick={() => setTab('report')} className={`flex-1 py-3 rounded-lg font-medium ${tab === 'report' ? 'bg-black text-white' : 'border border-gray-300'}`}>
            상세 분석
          </button>
        </div>

        {tab === 'type' && (
          <div>
            <h2 className="text-lg font-bold mb-4">Life Score</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <Radar dataKey="value" stroke={info.color} fill={info.color} fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {chartData.map(({ name, value }) => (
                <div key={name} className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">{name}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'report' && (
          <div className="space-y-4">
            {sections.map(({ title, content }, i) => (
              <div key={i} className="border rounded-xl p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: info.color }}>{title}</h3>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{content}</p>
              </div>
            ))}
          </div>
        )}

        <a href="/analyze" className="block w-full text-center bg-black text-white py-4 rounded-full text-lg font-medium mt-8">
          새로 분석하기
        </a>

      </div>
    </main>
  )
}