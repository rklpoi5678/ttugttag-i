// src/components/Canvas.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';

// 이 컴포넌트는 실제 UI 요소들의 렌더링과 상호작용을 처리하게 됩니다.
// 현재는 임시 아트보드만 포함되어 있습니다.
interface CanvasProps {
  // 여기에 캔버스에 표시될 요소들 (pages, components)의 데이터가 props로 전달될 수 있습니다.
}

export default function Canvas({}: CanvasProps) {
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const [artboards, setArtboards] = useState([
    { id: 'ab1', name: 'Web Desktop', width: 1440, height: 900, x: 100, y: 100, color: '#f0f0f0' },
    { id: 'ab2', name: 'Mobile App', width: 375, height: 812, x: 1600, y: 100, color: '#f5f5f5' },
    { id: 'ab3', name: 'Tablet Portrait', width: 768, height: 1024, x: 100, y: 1200, color: '#e8e8e8' },
  ]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const scaleFactor = 1.1;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newScale = scale;
    if (e.deltaY < 0) {
      newScale = Math.min(scale * scaleFactor, 3);
    } else {
      newScale = Math.max(scale / scaleFactor, 0.2);
    }

    const newTranslateX = translateX - (mouseX / scale) * (newScale - scale);
    const newTranslateY = translateY - (mouseY / scale) * (newScale - scale);

    setScale(newScale);
    setTranslateX(newTranslateX);
    setTranslateY(newTranslateY);
  }, [scale, translateX, translateY]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.buttons === 1 && (e.metaKey || e.altKey || (e.view?.event instanceof KeyboardEvent && e.view.event.code === 'Space'))) {
      e.preventDefault();
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      canvasRef.current?.style.setProperty('cursor', 'grabbing');
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      e.preventDefault();
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;

      setTranslateX(prev => prev + dx / scale);
      setTranslateY(prev => prev + dy / scale);

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, [isPanning, scale]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    canvasRef.current?.style.setProperty('cursor', 'default');
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault();
      canvasRef.current?.style.setProperty('cursor', 'grab');
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      canvasRef.current?.style.setProperty('cursor', 'default');
      setIsPanning(false);
    }
  }, []);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener('wheel', handleWheel, { passive: false });
      canvasElement.addEventListener('mousedown', handleMouseDown);
      canvasElement.addEventListener('mousemove', handleMouseMove);
      canvasElement.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        canvasElement.removeEventListener('wheel', handleWheel);
        canvasElement.removeEventListener('mousedown', handleMouseDown);
        canvasElement.removeEventListener('mousemove', handleMouseMove);
        canvasElement.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown, handleKeyUp]);

  return (
    <div
      ref={canvasRef}
      className={`flex-grow relative overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, #e0e0e0 1px, transparent 1px),
          linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundAttachment: 'local',
        backgroundColor: 'rgb(243 244 246)',
      }}
    >
      <div
        className="absolute origin-top-left"
        style={{
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          width: '8000px',
          height: '6000px',
        }}
      >
        {artboards.map(ab => (
          <div
            key={ab.id}
            className="absolute shadow-xl border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
            style={{
              width: ab.width,
              height: ab.height,
              left: ab.x,
              top: ab.y,
              backgroundColor: ab.color,
            }}
          >
            <div className="absolute top-0 left-0 right-0 bg-gray-200 dark:bg-gray-700 p-1 text-xs text-gray-700 dark:text-gray-300 font-semibold rounded-t-lg">
              {ab.name} ({ab.width}x{ab.height})
            </div>
            <div className="p-4 pt-8 text-gray-500 dark:text-gray-400">
              <p>이것은 "{ab.name}" 아트보드입니다.</p>
              <div className="mt-4 p-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-center">
                샘플 UI 요소 (버튼)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}