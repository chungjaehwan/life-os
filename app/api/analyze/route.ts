import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getSaju } from '@fullstackfamily/manseryeok'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// 천간 오행
const heavenlyStemElement: Record<string, string> = {
  갑: '목', 을: '목', 병: '화', 정: '화', 무: '토',
  기: '토', 경: '금', 신: '금', 임: '수', 계: '수',
}

// 지지 오행
const earthlyBranchElement: Record<string, string> = {
  자: '수', 축: '토', 인: '목', 묘: '목', 진: '토', 사: '화',
  오: '화', 미: '토', 신: '금', 유: '금', 술: '토', 해: '수',
}

// 발음오행
const soundElement: Record<string, string> = {
  ㄱ: '목', ㅋ: '목',
  ㄴ: '화', ㄷ: '화', ㄹ: '화', ㅌ: '화',
  ㅇ: '토', ㅎ: '토',
  ㅅ: '금', ㅈ: '금', ㅊ: '금',
  ㅁ: '수', ㅂ: '수', ㅍ: '수',
}

// 한글 초성/종성 추출
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

// 수비학 Life Number
function getLifeNumber(birthdate: string): number {
  const digits = birthdate.replace(/-/g, '').split('').map(Number)
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

// 사주 오행 계산
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

// 발음오행 계산
function calcNameElements(name: string) {
  const scores: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
  const consonants = extractConsonants(name)
  for (const c of consonants) {
    if (soundElement[c]) scores[soundElement[c]] += 1
  }
  return scores
}

// Life DNA 오행 계산
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

// 전체 오행 합산
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

  // 정규화 (10~85)
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

    // 엔진 계산
    const dnaElements = calcDnaElements(answers)
    const sajuElements = calcSajuElements(form.birthdate, form.birthtime, form.unknownTime)
    const nameElements = calcNameElements(form.name)
    const lifeNumber = getLifeNumber(form.birthdate)
    const combined = combineElements(dnaElements, sajuElements, nameElements)
    const archetype = getArchetype(combined)
    const lifeScore = getLifeScore(combined)

    const prompt = `당신은 인생 패턴 분석 전문가입니다.
아래 데이터를 기반으로 사용자의 Destiny Report를 작성하세요.

[입력 데이터]
- 이름: ${form.name}
- 생년월일: ${form.birthdate}
- 성별: ${form.gender}
- 결혼 상태: ${form.maritalStatus}
- 유형: ${archetype}
- 인생 수: ${lifeNumber}
- 점수: 성장 ${lifeScore.성장}, 커리어 ${lifeScore.커리어}, 관계 ${lifeScore.관계}, 재물 ${lifeScore.재물}, 건강 ${lifeScore.건강}

[작성 규칙]
1. 각 섹션을 최소 6~8문장 이상 충분히 깊고 구체적으로 작성
2. "당신은 ~한 사람입니다" 체 유지
3. 부정적 단정 표현 절대 금지
4. 각 섹션은 반드시 ## 제목으로 구분
5. 결혼 상태에 따라 연애/결혼 섹션 다르게 작성
6. 점수 데이터를 반드시 분석에 반영
7. 사주, 오행 등의 단어는 절대 사용 금지

[섹션 구성]
## 인생 핵심 키워드
## 반복해온 인생 패턴
## 강점
## 약점과 극복 힌트
## 연애와 결혼 패턴
## 재물과 커리어 흐름
## 3년 후
## 5년 후
## 10년 후
## 평생 조심해야 할 것
## 인생 과제`

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