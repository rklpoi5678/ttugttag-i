import React from 'react';
import Toolbox from '@/components/sketches/toolbox';
import Canvas from '@/components/sketches/canvas';
import PropertiesPanel from '@/components/sketches/propertiesPanel';
import { EditorProvider } from '@/components/sketches/EditorContext'; // EditorProvider 임포트

const Button = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
  >
    {children}
  </button>
);

export default function EditorLayout() {
  return (
    <EditorProvider> {/* EditorProvider로 감싸기 */}
      <div className="flex flex-col h-screen w-full">
        {/* 상단바 (Top Bar) - 프로젝트 이름, 저장, 내보내기, 미리보기 등 */}
        <header className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xl font-bold text-gray-900 dark:text-white">뚝딱이 에디터</div>
          <div className="flex gap-2">
            <Button>저장</Button>
            <Button>미리보기</Button>
            <Button>내보내기</Button>
          </div>
        </header>

        {/* 메인 에디터 영역 - 도구 상자, 캔버스, 속성 패널 */}
        <div className="flex flex-grow overflow-hidden">
          {/* 좌측 도구 상자 */}
          <Toolbox />

          {/* 중앙 캔버스 영역 */}
          <Canvas />

          {/* 우측 속성 패널 */}
          <PropertiesPanel />
        </div>
      </div>
    </EditorProvider>
  );
}