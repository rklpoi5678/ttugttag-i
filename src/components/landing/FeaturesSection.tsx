export default function FeaturesSection() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">아이디어를 빠르게 스케치하세요</h2>
          <p className="text-gray-500 sm:text-xl dark:text-gray-400">간단하고 더 빠르게, 당신의 상상을 현실로 만들어낼 도구입니다.</p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          <div>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
              {/* 아이디어 스케치/와이어프레임 아이콘 (예: 펜과 종이 또는 브러시) */}
              <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L9 14.586V3a1 1 0 112 0v11.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">초고속 아이디어 스케치</h3>
            <p className="text-gray-500 dark:text-gray-400">직관적인 도구로 생각나는 즉시 디자인하고, 빠르게 와이어프레임을 만들어보세요.</p>
          </div>
          <div>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
              {/* 반복/피드백 아이콘 (예: 순환 화살표) */}
              <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.121a3 3 0 00.914 2.121L10 12.121V15a1 1 0 11-2 0v-2.121l-3-3A3 3 0 004 8.121V6a1 1 0 011-1h10a1 1 0 011 1v2.121a3 3 0 00.914 2.121L14 12.121V15a1 1 0 11-2 0v-2.121l-3-3A3 3 0 0010 8.121V6a1 1 0 011-1h4a1 1 0 011 1v2.121a3 3 0 00.914 2.121L18 12.121V15a1 1 0 11-2 0v-2.121l-3-3A3 3 0 0014 8.121V6a1 1 0 011-1H5a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">즉각적인 시각화 및 반복</h3>
            <p className="text-gray-500 dark:text-gray-400">코드를 통해 아이디어를 즉시 시각화하고, 빠르게 수정하며 최적의 디자인을 찾아나가세요.</p>
          </div>
          <div>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
              {/* 프로토타입/개발 준비 아이콘 (예: 도구 상자 또는 기어) */}
              <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">실제 개발 준비 완료</h3>
            <p className="text-gray-500 dark:text-gray-400">스케치한 아이디어를 바로 코드로 옮겨 실제 애플리케이션으로 쉽게 발전시키세요.</p>
          </div>
        </div>
      </div>
    </section>
  )
}