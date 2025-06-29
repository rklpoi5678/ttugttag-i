
/**
 * @typedef {Object} ToastProps
 * @property {string | null} message - 표시할 토스트 메시지 (null이면 렌더링되지 않음)
 * @property {() => void} onClose - 토스트 닫기 버튼 클릭 시 호출될 함수
 */
type ToastProps = {
  message: string | null;
  onClose: () => void;
};

/**
 * @function Toast
 * @description
 * 사용자에게 메시지를 표시하는 간단한 토스트 알림 컴포넌트입니다.
 * @param {ToastProps} props - 메시지와 닫기 핸들러를 포함합니다.
 * @returns {JSX.Element | null} 토스트 UI 또는 null (메시지가 없으면)
 */
export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <p className="text-sm">{message}</p>
      {/* 닫기 버튼 (선택 사항) */}
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200 dark:text-gray-600 dark:hover:text-gray-800 focus:outline-none">
          &times;
        </button>
      )}
    </div>
  );
}
