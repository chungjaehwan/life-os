export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-2">당신은 어떤 사람인가요?</h1>
      <p className="text-gray-500 mb-8">이름, 생년월일, 성향 데이터를 분석해 당신만의 인생 패턴을 발견합니다</p>
      <a href="/analyze" className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800">
        지금 시작하기 →
      </a>
    </main>
  )
}