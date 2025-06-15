// src/components/Toolbox.tsx
import React from 'react';
import { MousePointer2, Type, Square, Circle, Minus, ArrowRight, Image, LayoutPanelLeft } from 'lucide-react';

// 이 컴포넌트만으로 기능을 보여주기 위해, 간단한 Card 컴포넌트들을 정의합니다.
// 실제 프로젝트에서는 shadcn/ui 또는 자체 Card 컴포넌트를 사용하세요.
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-3 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);
const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-3 pt-0 ${className}`}>{children}</div>
);


// UI 요소 데이터 정의
const uiElements = [
  { id: 'select', name: '선택 툴', icon: MousePointer2 },
  { id: 'text', name: '텍스트', icon: Type },
  { id: 'rectangle', name: '사각형', icon: Square },
  { id: 'circle', name: '원', icon: Circle },
  { id: 'line', name: '선', icon: Minus },
  { id: 'arrow', name: '화살표', icon: ArrowRight },
  { id: 'image', name: '이미지', icon: Image },
  { id: 'button', name: '버튼', icon: LayoutPanelLeft }, // 임시 아이콘
];

export default function Toolbox() {
  // 드래그 시작 시 데이터를 설정하는 함수
  const onDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: elementType }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Card className="flex flex-col w-52 min-w-52 max-h-screen overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 rounded-none">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-gray-200">도구 상자</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col p-2 space-y-1">
        {uiElements.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab text-gray-700 dark:text-gray-300 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, item.id)} // 드래그 시작 이벤트
          >
            <item.icon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
            <span>{item.name}</span>
          </div>
        ))}
        {/* '뚝딱 블록' 섹션 추가 예정 */}
        <hr className="my-2 border-gray-200 dark:border-gray-700" />
        <CardTitle className="text-md text-gray-800 dark:text-gray-200 mt-2">뚝딱 블록</CardTitle>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab text-gray-700 dark:text-gray-300 transition-colors">
            <LayoutPanelLeft className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
            <span>로그인 폼</span>
          </div>
          <div className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab text-gray-700 dark:text-gray-300 transition-colors">
            <LayoutPanelLeft className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
            <span>네비게이션 바</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}