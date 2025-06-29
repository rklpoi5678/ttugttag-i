// src/components/sketches/BentoMenuTool.ts
import { StateNode, createShapeId, type TLPointerEvent } from 'tldraw';
import { getUiTemplateById } from '@/lib/uiTempates'; // 템플릿 데이터를 가져옴
import type { BentoMenuShape } from '@/lib/MyThirtyTwoCustomTool/BentoMenuShape'; // 해당 도형 타입 임포트

export class BentoMenuTool extends StateNode {
  static override id = 'bento-menu-tool';
  static override initial = 'idle';
  static override children = () => [Idle];

  onPointerDown: TLPointerEvent = ({ point }) => {
    if (!this.editor) return;

    const template = getUiTemplateById("bento-menu"); // 중앙 템플릿에서 데이터 가져오기

    if (!template || template.type !== 'bento-menu') {
        console.error("Bento menu template not found or invalid type.");
        return;
    }

    const shapeToCreate: BentoMenuShape = {
      id: createShapeId(),
      type: 'bento-menu', // 정의한 커스텀 도형 타입
      x: point.x,
      y: point.y,
      props: {
        ...template.defaultProps,
      },
    };

    this.editor.createShape(shapeToCreate);
    console.log('Created Bento Menu shape:', shapeToCreate);
    this.editor.setCurrentTool('select');
  };
}

class Idle extends StateNode {}