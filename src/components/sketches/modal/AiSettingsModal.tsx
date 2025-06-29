import React, { useCallback, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { type AiComponentProps } from '@/lib/tldraw/hooks/useAIGeneration';

/**
 * @typedef {Object} AiSettingsModalProps
 * @property {() => void} onClose - 모달을 닫을 때 호출될 콜백 함수입니다.
 * @property {string | null} apiKey - 현재 Gemini API 키입니다.
 * @property {React.Dispatch<React.SetStateAction<string | null>>} setApiKey - API 키를 설정하는 함수입니다.
 * @property {string} selectedModel - 현재 선택된 Gemini 모델입니다.
 * @property {React.Dispatch<React.SetStateAction<string>>} setSelectedModel - 모델을 설정하는 함수입니다.
 * @property {boolean} isLoading - AI 생성 작업이 진행 중인지 여부를 나타냅니다.
 * @property {(prompt: string, editor: Editor, includeCurrentView?: boolean) => Promise<void>} generate - AI 생성을 트리거하는 함수입니다.
 * (모달 내에서는 직접 generate를 호출하지 않지만, AiComponentProps 타입에 포함되어 있어 전달)
 */
interface AiSettingsModalProps extends AiComponentProps {
  onClose: () => void;
}

/**
 * @function AiSettingsModal
 * @description
 * Tldraw의 'Make Real' 기능과 유사하게, AI 생성 설정을 위한 모달 컴포넌트입니다.
 * API 키 입력, AI 모델 선택 등의 UI를 제공합니다.
 * @param {AiSettingsModalProps} props - 모달을 닫기 위한 onClose 함수와 AiComponentProps를 받습니다.
 * @returns {JSX.Element} AI 설정 모달 UI
 */
const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  onClose,
  apiKey,
  setApiKey,
  selectedModel,
  setSelectedModel,
  isLoading, // 로딩 상태는 모달 내 버튼 비활성화에 사용될 수 있습니다.
}) => {
  // 모달 외부 클릭 시 닫기
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const models = ['gemini-2.0-flash', 'gemini-1.5-flash']; // 사용 가능한 AI 모델 목록

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col max-h-[90vh] overflow-hidden p-6"
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            사용할 AI 서비스의 API 키를 입력하고 모델을 선택하세요.
                        <br />
            이 키는 브라우저에 임시로 저장됩니다.
          </p>

          <div>
            <label htmlFor="gemini-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gemini API Key
            </label>
            <input
              id="gemini-api-key"
              type="password"
              value={apiKey || ''}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="여기에 Gemini API 키를 입력하세요"
            />
          </div>

          <div>
            <label htmlFor="ai-model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              AI 모델
            </label>
            <select
              id="ai-model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            >
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* 저장 버튼 (선택 사항: API 키를 로컬 스토리지에 저장하는 기능 등을 추가할 수 있습니다) */}
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose} // 설정 완료 후 모달 닫기
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSettingsModal;
