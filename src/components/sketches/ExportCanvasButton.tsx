import { useEditor} from 'tldraw'
import type { AiComponentProps } from '@/lib/tldraw/hooks/useAIGeneration'
import { Image, Settings, Sparkles } from 'lucide-react'


/**
 * @typedef {Object} ExportCanvasButtonProps
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsAiSettingsModalOpen - AI 설정 모달 열림/닫힘 상태를 설정하는 함수
 * (AiComponentProps의 모든 속성을 포함)
 */
interface ExportCanvasButtonProps extends AiComponentProps {
    setIsAiSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * @function ExportCanvasButton
 * @description
 * 캔버스 내용을 이미지로 내보내거나, AI 설정 모달을 열거나,
 * 현재 캔버스 내용을 기반으로 AI 생성을 트리거하는 통합 버튼 컴포넌트입니다.
 * @param {ExportCanvasButtonProps} props - AI 관련 props 및 모달 제어 함수를 포함합니다.
 * @returns {JSX.Element} 통합된 버튼 그룹 UI
 */
export default function ExportCanvasButton({ setIsAiSettingsModalOpen, apiKey, setApiKey, selectedModel, setSelectedModel, isLoading, generate }: ExportCanvasButtonProps) {
  const editor = useEditor()

    /**
   * 캔버스 내용을 PNG 이미지로 내보내는 함수
   */
  const handleExportAsImage = async () => {
    const shapeIds = editor.getCurrentPageShapeIds()
    if (shapeIds.size === 0) {
        console.warn('캔버스에 요소가 없습니다. 내보낼 요소가 없습니다.') // 추후 사용자 정의 메시지 박스나 토스트 사용권장
        return;
    } 
    const { blob } = await editor.toImage([...shapeIds], { format: 'png', background: false })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = '스케치.png' // PNG 포맷에 맞게 파일 확장자 변경
    link.click()
    URL.revokeObjectURL(link.href)
    }

    /**
     * AI 설정  모달을 여는 함수
    */
    const handleOpenAiSettings = () => {
        setIsAiSettingsModalOpen(true);
    }

    /**
     * 현재 캔버스 내용을 기반으로 AI 생성을 트리거하는 함수
     */
    const handleMakeReal = () => {
        if (!editor || isLoading || !apiKey || !generate) {
            if (!apiKey) {
                console.warn('AI 키가 없습니다. AI 설정창을 엽니다..')
                setIsAiSettingsModalOpen(true); //API키가 없으면 설정 모달 열기
            } else if (isLoading) {
                console.warn('AI 생성 중입니다. 잠시 기다려주세요.')
            }
            return;
        }

        generate('현재 캔버스 내용을 기반으로 와이어프레임을 생성해줘', editor, true); //현재 뷰 포함
    };

return (
    <div className="flex flex-row justify-around gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full">
      {/* 이미지로 내보내기 버튼 */}
      <button
        className="
          flex flex-col items-center justify-center flex-1 min-w-0
          px-2 py-2 text-sm font-semibold
          bg-indigo-600 text-white rounded-md
          shadow-sm hover:bg-indigo-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
          transition-colors duration-300
          transform hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        onClick={handleExportAsImage}
      >
        <Image size={20}/>
        <span className='mt-1 text-xs whitespace-nowrap'>이미지</span>
      </button>

      {/* AI 설정 모달 열기 버튼 */}
      <button
        onClick={handleOpenAiSettings}
        className="
          flex flex-col items-center justify-center flex-1 min-w-0
          px-2 py-2 text-sm font-semibold
          bg-gray-200 text-gray-800 rounded-md
          shadow-sm hover:bg-gray-300
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
          transition-colors duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        disabled={isLoading}
      >
        <Settings size={20}/>
        <span className='mt-1 text-xs whitespace-nowrap'>AI 설정</span>
      </button>

      {/* 'Make Real' AI 생성 시작 버튼 */}
      <button
        onClick={handleMakeReal}
        disabled={isLoading || !apiKey}
        className="
          flex flex-col items-center justify-center flex-1 min-w-0
          px-2 py-2 text-sm font-semibold
          bg-green-600 text-white rounded-md
          shadow-sm hover:bg-green-700
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
          transition-colors duration-300
          transform hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isLoading ? (
          <>
            <Sparkles size={20} className="animate-pulse" /> {/* 로딩 중 아이콘 애니메이션 */}
            <span className="mt-1 text-xs whitespace-nowrap">생성 중...</span>
          </>
        ) : (
          <>
            <Sparkles size={20} /> {/* 아이콘 */}
            <span className="mt-1 text-xs whitespace-nowrap">변환</span> {/* 작은 글씨 */}
          </>
        )}
      </button>
    </div>
  );
}