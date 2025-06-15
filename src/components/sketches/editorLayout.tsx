// src/components/EditorLayout.tsx
import React from 'react';
import Toolbox from './toolbox';
import Canvas from './canvas';
import PropertiesPanel from './propertiesPanel';

// 이 컴포넌트만으로 기능을 보여주기 위해, 간단한 Button 컴포넌트를 정의합니다.
// 실제 프로젝트에서는 shadcn/ui 또는 자체 Button 컴포넌트를 사용하세요.
const Button = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
  >
    {children}
  </button>
);


export default function EditorLayout() {
  // 실제로는 여기에 캔버스 요소들의 전역 상태 관리 로직이 들어갑니다.
  // 예를 들어, Recoil, Zustand, Context API 등을 사용하여
  // Toolbox에서 요소를 추가하고, Canvas에서 선택하며, PropertiesPanel에서 속성을 편집하는
  // 모든 상호작용이 단일 상태를 통해 이루어지도록 합니다.

  // 현재는 선택된 요소가 없다고 가정합니다. (나중에 구현)
  const selectedElement = null; // 선택된 요소 객체 (추후 구현)
  const handleUpdateElement = (id: string, updates: Partial<any>) => {
    console.log(`Element ${id} updated:`, updates);
    // 실제로는 여기에서 캔버스 요소 상태를 업데이트하는 로직이 들어갑니다.
  };

  return (
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
        {/* 캔버스 컴포넌트에 선택된 요소 및 업데이트 함수를 props로 전달할 수 있습니다. */}
        <Canvas />

        {/* 우측 속성 패널 */}
        {/* 속성 패널 컴포넌트에 선택된 요소와 업데이트 함수를 props로 전달합니다. */}
        <PropertiesPanel
        // selectedElement={selectedElement}
        // onUpdateElement={handleUpdateElement}
        />
      </div>
    </div>
  );
}