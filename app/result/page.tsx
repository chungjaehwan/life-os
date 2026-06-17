'use client'

import { useEffect, useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const archetypeInfo = {
  Creator:    { 
    name: '인목형 (仁木型)', 
    desc: '어질고 창의적인 사람', 
    symbol: '🐉',
    color: '#2D6A4F',
    gradient: 'linear-gradient(135deg, #1A3A2A, #2D6A4F)',
  },
  Connector:  { 
    name: '예화형 (禮火型)', 
    desc: '열정적이고 표현력 강한 사람', 
    symbol: '🦅',
    color: '#8B2500',
    gradient: 'linear-gradient(135deg, #5A1500, #C84B00)',
  },
  Guardian:   { 
    name: '신토형 (信土型)', 
    desc: '믿음직하고 안정적인 사람', 
    symbol: '🐢',
    color: '#5C3D00',
    gradient: 'linear-gradient(135deg, #3A2500, #7A5200)',
  },
  Strategist: { 
    name: '의금형 (義金型)', 
    desc: '결단력 있고 원칙적인 사람', 
    symbol: '🐯',
    color: '#1D3557',
    gradient: 'linear-gradient(135deg, #0D1F3A, #1D3557)',
  },
  Thinker:    { 
    name: '지수형 (智水型)', 
    desc: '지혜롭고 직관적인 사람', 
    symbol: '🌊',
    color: '#0A3D5C',
    gradient: 'linear-gradient(135deg, #051A2E, #0A3D5C)',
  },
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
      <main className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0A0F2E 0%, #1A0A2E 50%, #0A1A2E 100%)' }}>
        <p style={{ color: '#C9A84C' }}>결과를 불러오는 중...</p>
      </main>
    )
  }

  const info = archetypeInfo[result.archetype] || archetypeInfo['Creator']
  const chartData = Object.entries(result.lifeScore).map(([name, value]) => ({ name, value }))
  const sections = parseReport(result.report)

  return (
    <main className="min-h-screen p-6 relative"
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

      <div className="relative z-10 w-full max-w-lg mx-auto">

        {/* 상단 장식 */}
        <div className="flex items-center justify-center gap-2 mb-4 mt-2">
          <div className="h-px w-12" style={{ background: '#C9A84C' }}></div>
          <span className="text-xl">✨</span>
          <div className="h-px w-12" style={{ background: '#C9A84C' }}></div>
        </div>

        {/* Archetype 카드 */}
        <div className="rounded-2xl p-8 text-center mb-6 relative overflow-hidden"
          style={{ 
            background: info.gradient,
            border: '1px solid rgba(201,168,76,0.4)',
            boxShadow: '0 0 30px rgba(201,168,76,0.2)',
          }}>
          <div className="absolute top-2 left-4 text-2xl opacity-30">☁️</div>
          <div className="absolute top-4 right-4 text-xl opacity-30">⭐</div>
          <p className="text-6xl mb-3">{info.symbol}</p>
          <p className="text-sm mb-1" style={{ color: '#C9A84C' }}>당신의 유형</p>
          <h1 className="text-2xl font-bold mb-1 text-white">{info.name}</h1>
          <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>{info.desc}</p>
          <div className="h-px w-24 mx-auto my-3" style={{ background: 'rgba(201,168,76,0.4)' }}></div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{result.name}님의 운명</p>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('type')}
            className="flex-1 py-3 rounded-lg font-medium text-sm transition-all"
            style={{
              background: tab === 'type' ? 'linear-gradient(135deg, #C9A84C, #F0D080)' : 'rgba(255,255,255,0.05)',
              color: tab === 'type' ? '#0A0F2E' : '#C9A84C',
              border: '1px solid rgba(201,168,76,0.3)',
            }}>
            ✨ 내 유형
          </button>
          <button onClick={() => setTab('report')}
            className="flex-1 py-3 rounded-lg font-medium text-sm transition-all"
            style={{
              background: tab === 'report' ? 'linear-gradient(135deg, #C9A84C, #F0D080)' : 'rgba(255,255,255,0.05)',
              color: tab === 'report' ? '#0A0F2E' : '#C9A84C',
              border: '1px solid rgba(201,168,76,0.3)',
            }}>
            🔮 운명 분석
          </button>
        </div>

        {/* 탭1: 내 유형 */}
        {tab === 'type' && (
          <div>
            <div className="rounded-xl p-4 mb-4"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <p className="text-center text-sm mb-4" style={{ color: '#C9A84C' }}>⭐ 운명의 흐름 ⭐</p>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={chartData}>
                  <PolarGrid stroke="rgba(201,168,76,0.2)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#C9A84C', fontSize: 12 }} />
                  <Radar dataKey="value" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {chartData.map(({ name, value }) => (
                <div key={name} className="rounded-xl p-4 text-center"
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(201,168,76,0.2)',
                  }}>
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{name}</p>
                  <p className="text-2xl font-bold" style={{ color: '#C9A84C' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 탭2: 운명 분석 */}
        {tab === 'report' && (
          <div className="space-y-4">
            {sections.map(({ title, content }, i) => (
              <div key={i} className="rounded-xl p-5"
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(201,168,76,0.2)',
                }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1" style={{ background: 'rgba(201,168,76,0.3)' }}></div>
                  <h3 className="font-bold text-sm px-2" style={{ color: '#C9A84C' }}>{title}</h3>
                  <div className="h-px flex-1" style={{ background: 'rgba(201,168,76,0.3)' }}></div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 새 분석 버튼 */}
        <a href="/analyze"
          className="block w-full text-center py-4 rounded-full font-bold text-lg mt-8 mb-4 transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
            color: '#0A0F2E',
            boxShadow: '0 0 20px rgba(201,168,76,0.3)',
          }}>
          다시 분석하기
        </a>

        <p className="text-center text-xs mb-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
          엔터테인먼트 목적의 서비스입니다
        </p>

      </div>
    </main>
  )
}