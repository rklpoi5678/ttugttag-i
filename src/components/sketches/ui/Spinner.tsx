/**
 * @function Spinner
 * @description
 * 간단한 로딩 스피너 컴포넌트입니다.
 * @returns {JSX.Element} 스피너 UI
 */
export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  );
}
