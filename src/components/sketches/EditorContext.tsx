import React, { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 고유 ID 생성을 위해 uuid 설치: bun add uuid @types/uuid

// 캔버스 요소의 기본 타입 정의
export interface CanvasElement {
  id: string;
  type: 'rect' | 'circle' | 'text'; // 추가될 다른 도형 타입
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation?: number;
  // 기타 속성...
}

// 에디터 컨텍스트의 타입 정의
interface EditorContextType {
  elements: CanvasElement[];
  addElement: (type: CanvasElement['type']) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const addElement = (type: CanvasElement['type']) => {
    const newElement: CanvasElement = {
      id: uuidv4(),
      type,
      x: 50,
      y: 50,
      fill: '#ADD8E6', // Light Blue
      stroke: 'black',
      strokeWidth: 2,
      rotation: 0,
    };

    if (type === 'rect') {
      newElement.width = 100;
      newElement.height = 100;
    } else if (type === 'circle') {
      newElement.radius = 50;
    } else if (type === 'text') {
      newElement.text = '새 텍스트';
      newElement.width = 150; // 텍스트를 위한 기본 너비
      newElement.height = 30; // 텍스트를 위한 기본 높이
      newElement.fill = 'black'; // 텍스트 색상은 검정으로
      newElement.stroke = '';
      newElement.strokeWidth = 0;
    }

    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id); // 새로 추가된 요소를 선택
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  return (
    <EditorContext.Provider
      value={{
        elements,
        addElement,
        updateElement,
        selectedElementId,
        setSelectedElementId,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};