const { getSaju } = require('@fullstackfamily/manseryeok')
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const heavenlyStemElement: Record<string, string> = {
  갑: '목', 을: '목', 병: '화', 정: '화', 무: '토',
  기: '토', 경: '금', 신: '금', 임: '수', 계: '수',
}

const earthlyBranchElement: Record<string, string> = {
  자: '수', 축: '토', 인: '목', 묘: '목', 진: '토', 사: '화',
  오: '화', 미: '토', 신: '금', 유: '금', 술: '토', 해: '수',
}

const soundElement: Record<string, string> = {
  ㄱ: '목', ㅋ: '목',
  ㄴ: '화', ㄷ: '화', ㄹ: '화', ㅌ: '화',
  ㅇ: '토', ㅎ: '토',
  ㅅ: '금', ㅈ: '금', ㅊ: '금',
  ㅁ: '수', ㅂ: '수', ㅍ: '수',
}

function extractConsonants(name: string): string[] {
  const consonants: string[] = []
  const 초성 = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
  const 종성 = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
  for (const char of name) {
    const code = char.charCodeAt(0) - 0xAC00
    if (code < 0 || code > 11171) continue
    const cho = 초성[Math.floor(code / 28 / 21)]
    const jong = 종성[code % 28]
    if (cho && cho !== 'ㅇ') consonants.push(cho)
    if (jong) consonants.push(jong)
  }
  return consonants
}

function getLifeNumber(birthdate: string): number {
  const parts = [
    birthdate.substring(0, 4).split('').map(Number).reduce((a, b) => a + b, 0),
    parseInt(birthdate.substring(5, 7)),
    parseInt(birthdate.substring(8, 10)),
  ]
  let sum = parts.reduce((a, b) => a + b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0)
  }
  return sum
}

function getAge(birthdate: string): number {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function calcSajuElements(birthdate: string, birthtime: string, unknownTime: boolean) {
  const scores: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
  try {
    const [year, month, day] = birthdate.split('-').map(Number)
    const hour = unknownTime ? 12 : parseInt(birthtime.split(':')[0])
    const saju = getSaju(year, month, day, hour)
    const pillars = [saju.year, saju.month, saju.day, saju.hour].filter(Boolean)
    for (const pillar of pillars) {
      if (!pillar) continue
      const stem = pillar.toString()[0]
      const branch = pillar.toString()[1]
      if (heavenlyStemElement[stem]) scores[heavenlyStemElement[stem]] += 2
      if (earthlyBranchElement[branch]) scores[earthlyBranchElement[branch]] += 1
    }
  } catch (e) {
    console.error('사주 계산 오류:', e)
  }
  return scores
}

function calcNameElements(name: string) {
  const scores: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
  const consonants = extractConsonants(name)
  for (const c of consonants) {
    if (soundElement[c]) scores[soundElement[c]] += 1
  }
  return scores
}

const weights: Record<number, Record<string, number>> = {
  1:  { 목: 3 }, 2:  { 토: 3 }, 3:  { 화: 3 },
  4:  { 목: 2, 화: 1 }, 5:  { 금: 3 }, 6:  { 수: 3 },
  7:  { 화: 2, 목: 1 }, 8:  { 금: 2, 토: 1 }, 9:  { 수: 2, 토: 1 },
  10: { 토: 3 }, 11: { 금: 2, 화: 1 }, 12: { 목: 3 },
  13: { 화: 2, 토: 1 }, 14: { 수: 3 }, 15: { 토: 2, 수: 1 },
}

function calcDnaElements(answers: Record<string, number>) {
  const scores: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
  for (const [qId, score] of Object.entries(answers)) {
    const w = weights[Number(qId)]
    if (!w) continue
    const multiplier = score / 5
    for (const [el, val] of Object.entries(w)) {
      scores[el] += val * multiplier
    }
  }
  return scores
}

function combineElements(
  dna: Record<string, number>,
  saju: Record<string, number>,
  name: Record<string, number>
) {
  const elements = ['목', '화', '토', '금', '수']
  const dnaMax = Math.max(...Object.values(dna)) || 1
  const sajuMax = Math.max(...Object.values(saju)) || 1
  const nameMax = Math.max(...Object.values(name)) || 1

  const combined: Record<string, number> = {}
  for (const el of elements) {
    const dnaScore = (dna[el] / dnaMax) * 40
    const sajuScore = (saju[el] / sajuMax) * 30
    const nameScore = (name[el] / nameMax) * 20
    combined[el] = dnaScore + sajuScore + nameScore
  }

  const max = Math.max(...Object.values(combined)) || 1
  for (const el of elements) {
    combined[el] = Math.round((combined[el] / max) * 75 + 10)
  }
  return combined
}

function getArchetype(scores: Record<string, number>) {
  const map: Record<string, string> = {
    목: 'Creator', 화: 'Connector', 토: 'Guardian', 금: 'Strategist', 수: 'Thinker',
  }
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  return map[top]
}

function getLifeScore(scores: Record<string, number>) {
  return {
    성장: scores['목'],
    커리어: scores['화'],
    관계: scores['토'],
    재물: scores['금'],
    건강: scores['수'],
  }
}

export async function POST(req: NextRequest) {
  try {
    const { form, answers } = await req.json()

    const dnaElements = calcDnaElements(answers)
    const sajuElements = calcSajuElements(form.birthdate, form.birthtime, form.unknownTime)
    const nameElements = calcNameElements(form.name)
    const lifeNumber = getLifeNumber(form.birthdate)
    const combined = combineElements(dnaElements, sajuElements, nameElements)
    const archetype = getArchetype(combined)
    const lifeScore = getLifeScore(combined)
    const currentAge = getAge(form.birthdate)
    const birthYear = parseInt(form.birthdate.substring(0, 4))

    const prompt = `당신은 수십 년 경력의 사주명리 전문가입니다.
아래 데이터를 바탕으로 ${form.name}님의 인생 리포트를 작성하세요.

[기본 정보]
- 이름: ${form.name}
- 생년월일: ${form.birthdate}
- 현재 나이: ${currentAge}세
- 성별: ${form.gender}
- 결혼 상태: ${form.maritalStatus}
- 유형: ${archetype}
- 인생 수: ${lifeNumber}
- 점수: 성장 ${lifeScore.성장}, 커리어 ${lifeScore.커리어}, 관계 ${lifeScore.관계}, 재물 ${lifeScore.재물}, 건강 ${lifeScore.건강}

[핵심 작성 원칙]
1. 반드시 구체적인 나이와 시기를 명시할 것
   예시: "32세까지는", "${currentAge+3}세부터", "${birthYear+45}년 이후"
2. "맞아, 이게 내 얘기네" 반응이 나오도록 개인화된 내용으로 작성
3. 추상적 표현 금지. 구체적 시기, 상황, 조언을 포함할 것
4. 부정적 단정 금지. "조심하세요", "주의가 필요합니다" 형태로 표현
5. 각 섹션 최소 6~8문장
6. 사주, 오행 단어 절대 사용 금지
7. 반드시 ## 섹션 구분 사용

[섹션 구성]
## 인생 핵심 키워드
한 줄 키워드 + ${form.name}님의 인생을 관통하는 핵심 테마를 구체적으로 설명

## 지금까지 반복해온 패턴
${currentAge}세인 지금까지 반복되어온 구체적인 삶의 패턴. "몇 살 때", "언제부터" 등 시기를 명시

## 타고난 강점
구체적인 상황과 예시를 들어 강점 설명. 어떤 환경에서 빛나는지 포함

## 조심해야 할 부분과 극복법
약점을 구체적 상황으로 설명하고 실질적 극복 방법 제시

## 연애와 결혼운
결혼 상태 "${form.maritalStatus}"에 맞게 작성.
- 미혼: 몇 세까지 인연이 없었던 이유, 몇 세부터 좋은 인연이 오는지, 어떤 유형의 사람이 잘 맞는지 구체적으로
- 연애 중: 현재 관계의 특성, 결혼 시기, 주의할 점
- 기혼: 배우자와의 관계 패턴, 몇 세 이후 더 안정되는지, 주의할 시기
- 답하고 싶지 않음: 인간관계 전반의 패턴과 시기

## 재물운과 커리어
몇 세까지 어려웠는지, 몇 세부터 좋아지는지, 언제가 전성기인지, 노후 재물 흐름까지 구체적 시기로 설명

## 3년 후 (${currentAge+3}세)
${currentAge+3}세의 구체적인 삶의 모습. 커리어, 관계, 재물 각각 어떻게 변하는지

## 5년 후 (${currentAge+5}세)
${currentAge+5}세의 구체적인 삶의 모습과 중요한 선택 포인트

## 10년 후 (${currentAge+10}세)
${currentAge+10}세의 삶. 지금 어떤 준비를 해야 그 모습에 가까워지는지

## 평생 조심해야 할 것
구체적인 상황과 나이대별로 반복될 수 있는 함정. 특히 ${currentAge}세 이후 주의할 점

## 이번 생의 인생 과제
${form.name}님이 이번 생에 완성해야 할 깊은 인생 과제. 나이별 단계적 과제 포함`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
    })

    const report = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({
      archetype,
      lifeScore,
      combined,
      lifeNumber,
      report,
      name: form.name,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '분석 실패' }, { status: 500 })
  }
}