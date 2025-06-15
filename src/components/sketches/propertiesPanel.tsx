// src/components/PropertiesPanel.tsx
import React, { useState } from 'react';
import { Settings, Ruler, Palette, Type, AlignJustify, CornerUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 이 컴포넌트만으로 기능을 보여주기 위해, 간단한 Card, Input, Slider 컴포넌트들을 정의합니다.
// 실제 프로젝트에서는 shadcn/ui 또는 자체 컴포넌트를 사용하세요.
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

const Input = ({ label, value, onChange, type = 'text', className = '' }: { label?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; className?: string }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-1.5 px-3 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
    />
  </div>
);

const Slider = ({ label, value, onChange, min = 0, max = 100, className = '' }: { label?: string; value: number; onChange: (value: number) => void; min?: number; max?: number; className?: string }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}: {value}</label>}
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 ${className}`}
    />
  </div>
);


interface PropertiesPanelProps {
  // 캔버스에서 현재 선택된 요소의 데이터를 받아올 props
  // 예: selectedElement: { id: string; type: string; x: number; y: number; width: number; height: number; text?: string; color?: string; ... } | null;
  // onUpdateElement: (id: string, updates: Partial<any>) => void;
}

export default function PropertiesPanel({}: PropertiesPanelProps) {
  // 실제로는 selectedElement props를 통해 선택된 요소의 속성을 가져옵니다.
  const [selectedElementProperties, setSelectedElementProperties] = useState({
    x: 100,
    y: 50,
    width: 200,
    height: 40,
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    text: '버튼 텍스트',
    fontSize: 16,
    borderRadius: 8,
    opacity: 100, // 0-100
  });

  const handleChange = (key: keyof typeof selectedElementProperties, value: any) => {
    setSelectedElementProperties(prev => ({ ...prev, [key]: value }));
    // 실제로는 여기서 상위 컴포넌트 (EditorLayout)의 onUpdateElement를 호출하여 캔버스 요소 업데이트
    // onUpdateElement(selectedElement.id, { [key]: value });
  };

  // 선택된 요소가 없을 경우 (나중 구현)
  // if (!selectedElement) {
  //   return (
  //     <Card className="w-64 min-w-64 max-h-screen overflow-y-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 rounded-none">
  //       <CardHeader><CardTitle className="text-lg text-gray-800 dark:text-gray-200">속성</CardTitle></CardHeader>
  //       <CardContent className="p-4 text-gray-500 dark:text-gray-400">
  //         요소를 선택해주세요.
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Card className="flex flex-col w-64 min-w-64 max-h-screen overflow-y-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 rounded-none">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center">
          <Settings className="w-5 h-5 mr-2" /> 속성
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-4">
        {/* 크기 및 위치 */}
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-300"><Ruler className="w-4 h-4 mr-1" /> 크기 및 위치</h4>
          <div className="grid grid-cols-2 gap-2">
            <Input label="X" type="number" value={selectedElementProperties.x} onChange={(e) => handleChange('x', Number(e.target.value))} />
            <Input label="Y" type="number" value={selectedElementProperties.y} onChange={(e) => handleChange('y', Number(e.target.value))} />
            <Input label="W" type="number" value={selectedElementProperties.width} onChange={(e) => handleChange('width', Number(e.target.value))} />
            <Input label="H" type="number" value={selectedElementProperties.height} onChange={(e) => handleChange('height', Number(e.target.value))} />
          </div>
        </div>

        {/* 색상 */}
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-300"><Palette className="w-4 h-4 mr-1" /> 색상</h4>
          <div className="grid grid-cols-2 gap-2">
            <Input label="배경색" type="color" value={selectedElementProperties.backgroundColor} onChange={(e) => handleChange('backgroundColor', e.target.value)} />
            <Input label="글자색" type="color" value={selectedElementProperties.textColor} onChange={(e) => handleChange('textColor', e.target.value)} />
          </div>
        </div>

        {/* 텍스트 속성 (텍스트 요소인 경우) */}
        {selectedElementProperties.text !== undefined && (
          <div>
            <h4 className="text-md font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-300"><Type className="w-4 h-4 mr-1" /> 텍스트</h4>
            <div className="space-y-2">
              <Input label="내용" value={selectedElementProperties.text} onChange={(e) => handleChange('text', e.target.value)} />
              <Input label="크기" type="number" value={selectedElementProperties.fontSize} onChange={(e) => handleChange('fontSize', Number(e.target.value))} />
              {/* <Select label="글꼴" options={['Arial', 'Roboto']} /> */}
              {/* <div className="flex gap-1">
                <Button>B</Button><Button>I</Button><Button>U</Button>
              </div> */}
              <h4 className="text-md font-semibold mt-4 mb-2 flex items-center text-gray-700 dark:text-gray-300"><AlignJustify className="w-4 h-4 mr-1" /> 정렬</h4>
              <div className="grid grid-cols-3 gap-1">
                <Button className="py-1 px-2 text-xs">좌</Button>
                <Button className="py-1 px-2 text-xs">중앙</Button>
                <Button className="py-1 px-2 text-xs">우</Button>
              </div>
            </div>
          </div>
        )}

        {/* 기타 속성 */}
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-300"><CornerUpLeft className="w-4 h-4 mr-1" /> 스타일</h4>
          <div className="space-y-2">
            <Input label="테두리 둥글기" type="number" value={selectedElementProperties.borderRadius} onChange={(e) => handleChange('borderRadius', Number(e.target.value))} />
            <Slider label="불투명도" value={selectedElementProperties.opacity} onChange={(val) => handleChange('opacity', val)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}