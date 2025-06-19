// src/components/Toolbox.tsx
import React from 'react';
import { useEditor } from '@/components/sketches/EditorContext';

const ToolboxButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
  >
    {children}
  </button>
);

export default function Toolbox() {
  const { addElement } = useEditor();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">도구 상자</h2>
      <div className="space-y-2">
        <ToolboxButton onClick={() => addElement('rect')}>
          사각형 추가
        </ToolboxButton>
        {/* 원, 텍스트 등 다른 도형 버튼은 이전에 추가된 그대로 유지됩니다 */}
        <ToolboxButton onClick={() => addElement('circle')}>
          원 추가
        </ToolboxButton>
        <ToolboxButton onClick={() => addElement('text')}>
          텍스트 추가
        </ToolboxButton>
      </div>
    </aside>
  );
}