
import { useState } from 'react';
import { Link }from 'react-router';

export default function HeroSection() {
  const [isLoginIn, setIsLoginIn] = useState(false);

  // 로그인 상태 확인 로직 (주석 해제 시 사용 가능)
  // useEffect(() => {
  //   const checkLogin = () => {
  //     const stored = localStorage.getItem('isLoggedIn');
  //     setIsLoginIn(stored === 'true');
  //   }
  //   checkLogin();

  //   window.addEventListener('storage', checkLogin);
  //   return () => {
  //     window.removeEventListener('storage', checkLogin);
  //   }
  // }, []);

  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white py-8 sm:py-8 lg:py-8">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        {/* 새로운 소식/이벤트 배너 */}
        {/* <Link
          to="/blog/뚝딱이-v2-출시" // 실제 블로그 또는 업데이트 페이지 경로로 변경하세요.
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-gray-700 dark:text-blue-300 dark:hover:bg-gray-600 transition-colors duration-200"
          role="alert"
        > */}
          <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3 font-semibold">New</span>{' '}
          <span className="text-sm font-medium">뚝딱이 V1.0 출시! 기능을 만나보세요!</span>
        {/* </Link> */}
        </div>

        {/* 메인 헤드라인 */}
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-tight text-center text-white md:text-5xl lg:text-6xl dark:text-white">
          아이디어를 현실로, <br className="hidden sm:inline-block"/>뚝딱이가 만들어 드립니다.
        </h1>
        {/* 서브 문구 */}
        <p className="mb-10 text-lg font-normal text-blue-100 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-300">
          뚝딱이는 강력한 AI 기반 도구로 당신의 업무와 창작 활동을 혁신합니다.
          복잡한 과정은 뚝딱이에게 맡기고, 당신은 아이디어에만 집중하세요.
        </p>

        {/* 액션 버튼 */}
        <div className="flex flex-col mb-12 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Link
            to="/get-started" // 시작하기 페이지 (무료 가입, 대시보드 등으로 연결)
            className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-colors duration-200 shadow-lg"
          >
            뚝딱이 무료로 시작하기
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
          <Link
            to="/demo" // 데모 또는 기능 소개 영상으로 연결
            className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-blue-900 rounded-lg border border-gray-300 hover:bg-blue-50 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-colors duration-200"
          >
            <svg
              className="mr-2 -ml-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
            </svg>
            데모 시작하기
          </Link>
        </div>
    </section>
  );
}