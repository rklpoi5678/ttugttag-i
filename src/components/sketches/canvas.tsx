import React, { useRef, useEffect } from 'react';
import { useEditor, CanvasElement } from '../context/EditorContext';

// --- IMPORTANT: Only import Konva modules on the client-side ---
// We use dynamic imports or conditional requires to prevent Konva's Node.js code
// from being bundled or executed on the server (Cloudflare Workers / Bun SSR).
let Stage: any, Layer: any, Rect: any, Circle: any, Text: any, Transformer: any, KonvaEventObject: any;

// This check ensures Konva is only loaded when `window` object is available (i.e., in a browser).
if (typeof window !== 'undefined') {
  // Use require() for these to avoid static analysis issues during SSR build
  // that might try to resolve 'konva' even if wrapped in 'import'.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ Stage, Layer, Rect, Circle, Text, Transformer } = require('react-konva'));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  KonvaEventObject = require('konva/lib/Node').KonvaEventObject; // Konva types for events
}

// ... (ShapeRenderer component - use 'any' for KonvaEventObject for simplicity with conditional imports) ...
const ShapeRenderer: React.FC<{
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasElement>) => void;
}> = ({ element, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      // Make sure the layer exists before drawing
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    onChange({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    onChange({
      x: node.x(),
      y: node.y(),
      width: element.type === 'text' ? node.width() * scaleX : Math.max(5, node.width() * scaleX),
      height: element.type === 'text' ? node.height() * scaleY : Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  let KonvaShapeComponent: React.ComponentType<any>;
  switch (element.type) {
    case 'rect':
      KonvaShapeComponent = Rect;
      break;
    case 'circle':
      KonvaShapeComponent = Circle;
      break;
    case 'text':
      KonvaShapeComponent = Text;
      break;
    default:
      return null;
  }

  // Only render Konva shapes if Konva components are loaded (i.e., on client)
  if (!KonvaShapeComponent) {
    return null;
  }

  return (
    <>
      <KonvaShapeComponent
        key={element.id}
        {...element}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        ref={shapeRef}
        fontSize={element.type === 'text' ? 20 : undefined}
        width={element.width}
        height={element.height}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default function Canvas() {
  const { elements, updateElement, selectedElementId, setSelectedElementId } = useEditor();
  const stageRef = useRef<any>(null);

  const checkDeselect = (e: any) => {
    // Ensure window and KonvaEventObject are defined
    if (typeof window === 'undefined' || !e.target || !e.target.getStage) return;
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedElementId(null);
    }
  };

  // Crucial: Only render the Konva Stage when in a browser environment
  if (typeof window === 'undefined') {
    return (
      <div className="flex-grow bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-4">
        <p className="text-gray-500 dark:text-gray-400">Loading Canvas...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-50 dark:bg-gray-900 flex justify-center items-center overflow-auto p-4">
      <Stage
        width={window.innerWidth * 0.7}
        height={window.innerHeight * 0.8}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        ref={stageRef}
        className="border border-gray-300 dark:border-gray-600 shadow-lg"
        style={{ background: 'white' }}
      >
        <Layer>
          {elements.map((element) => (
            <ShapeRenderer
              key={element.id}
              element={element}
              isSelected={element.id === selectedElementId}
              onSelect={() => {
                setSelectedElementId(element.id);
              }}
              onChange={(newAttrs) => {
                updateElement(element.id, newAttrs);
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}