// src/components/PropertiesPanel.tsx
import React from 'react';
import { useEditor } from '@/components/sketches/EditorContext';

export default function PropertiesPanel() {
  const { elements, selectedElementId, updateElement } = useEditor();
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!selectedElement) return;
    const { name, value, type } = e.target;

    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) return; // 숫자가 아니면 업데이트 안 함
    }

    updateElement(selectedElement.id, { [name]: parsedValue });
  };

  if (!selectedElement) {
    return (
      <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">속성 패널</h2>
        <p className="text-gray-500 dark:text-gray-400">요소를 선택하여 속성을 편집하세요.</p>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 flex-shrink-0 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">속성 편집</h2>
      <div className="space-y-4 text-gray-900 dark:text-white">
        <div>
          <label htmlFor="elementId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID:</label>
          <input
            type="text"
            id="elementId"
            value={selectedElement.id}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 p-2"
          />
        </div>

        {selectedElement.type === 'text' && (
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">텍스트 내용:</label>
            <textarea
              id="text"
              name="text"
              value={selectedElement.text || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 p-2"
              rows={3}
            />
          </div>
        )}

        {/* X, Y 위치는 모든 도형에 공통 */}
        <div>
          <label htmlFor="x" className="block text-sm font-medium text-gray-700 dark:text-gray-300">X:</label>
          <input
            type="number"
            id="x"
            name="x"
            value={selectedElement.x}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 p-2"
          />
        </div>
        <div>
          <label htmlFor="y" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Y:</label>
          <input
            type="number"
            id="y"
            name="y"
            value={selectedElement.y}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 p-2"
          />
        </div>

        {/* 너비(width), 높이(height)는 사각형과 텍스트에 표시 */}
        {(selectedElement.type === 'rect' || selectedElement.type === 'text') && (
          <>
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-300">너비:</label>
              <input
                type="number"
                id="width"
                name="width"
                value={selectedElement.width || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 p-2"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">높이:</label>
              <input
                type="number"
                id="height"
                name="height"
                value={selectedElement.height || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 p-2"
              />
            </div>
          </>
        )}

        {/* 반지름(radius)은 원에만 표시 */}
        {selectedElement.type === 'circle' && (
          <div>
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300">반지름:</label>
            <input
              type="number"
              id="radius"
              name="radius"
              value={selectedElement.radius || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 p-2"
            />
          </div>
        )}

        {/* 채우기 색상, 테두리 색상, 테두리 두께, 회전은 모든 도형에 공통 */}
        <div>
          <label htmlFor="fill" className="block text-sm font-medium text-gray-700 dark:text-gray-300">채우기 색상:</label>
          <input
            type="color"
            id="fill"
            name="fill"
            value={selectedElement.fill}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1 h-10"
          />
        </div>
        <div>
          <label htmlFor="stroke" className="block text-sm font-medium text-gray-700 dark:text-gray-300">테두리 색상:</label>
          <input
            type="color"
            id="stroke"
            name="stroke"
            value={selectedElement.stroke}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1 h-10"
          />
        </div>
        <div>
          <label htmlFor="strokeWidth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">테두리 두께:</label>
          <input
            type="number"
            id="strokeWidth"
            name="strokeWidth"
            value={selectedElement.strokeWidth}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 p-2"
          />
        </div>
        <div>
          <label htmlFor="rotation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">회전 (deg):</label>
          <input
            type="number"
            id="rotation"
            name="rotation"
            value={selectedElement.rotation || 0}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 p-2"
          />
        </div>
      </div>
    </aside>
  );
}