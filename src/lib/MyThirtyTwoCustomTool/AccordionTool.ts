import { StateNode, createShapeId, type TLPointerEvent } from 'tldraw';
import type{ AccordionShape } from '@/lib/MyThirtyTwoCustomShape/MyCustomShape'; // 정의한 아코디언 도형 타입 임포트
import { getUiTemplateById } from '@/lib/uiTempates'; // 템플릿 데이터 가져오기 (선택 사항)

/**
 * @class AccordionTool
 * @extends StateNode
 * @description
 * 사용자가 캔버스에서 클릭하여 아코디언 도형을 생성할 수 있도록 하는 tldraw 사용자 정의 도구입니다.
 * 클릭된 위치에 미리 정의된 속성을 가진 'accordion' 타입의 도형을 생성합니다.
 */
export class AccordionTool extends StateNode {
  static override id = 'accordion-tool'; // 고유 ID
  static override initial = 'idle';
  static override children = () => [Idle];

  /**
   * @private
   * @static
   * @property {UiTemplate | undefined} template - uiTemplates에서 가져올 아코디언 템플릿입니다.
   * (여기서는 'accordion-interactive' ID를 가정합니다)
   */
  private static template = getUiTemplateById('accordion-interactive');

  /**
   * @method onPointerDown
   * @param {TLPointerEvent} event - 포인터 이벤트 객체입니다.
   * @description
   * 마우스 포인터가 다운될 때 호출되는 이벤트 핸들러입니다.
   * 클릭된 위치에 새로운 아코디언 도형을 생성하고, 현재 도구를 'select' 도구로 변경합니다.
   */
  onPointerDown: TLPointerEvent = ({ point }) => {
    if (!this.editor) return;

    // 템플릿이 정의되어 있지 않거나, 타입이 맞지 않으면 경고 후 종료
    if (!AccordionTool.template || AccordionTool.template.type !== 'accordion') {
      console.error("아코디언 템플릿을 찾을 수 없거나 타입이 일치하지 않습니다.");
      // 기본 속성으로 대체하거나 사용자에게 오류를 알릴 수 있습니다.
      // 이 경우, tool을 'select'로 다시 설정하는 것이 좋습니다.
      this.editor.setCurrentTool('select');
      return;
    }

    // 생성할 아코디언 도형의 속성을 정의합니다.
    const shapeToCreate: AccordionShape = {
      id: createShapeId(), // 고유한 ID 생성
      type: 'accordion', // 정의한 아코디언 도형 타입
      x: point.x, // 마우스 클릭된 캔버스 세계 좌표 x
      y: point.y, // 마우스 클릭된 캔버스 세계 좌표 y
      props: {
        ...AccordionTool.template.defaultProps, // 템플릿의 기본 props 사용
        // 필요시 런타임에 결정되는 추가 prop을 오버라이드할 수 있습니다.
      } as AccordionShape['props'], // 타입 단언
    };

    // 도형을 생성합니다.
    this.editor.createShape(shapeToCreate);
    console.log('Created Accordion shape with AccordionTool:', shapeToCreate);

    // 도형 생성 후, 사용자가 도형을 바로 선택하거나 이동할 수 있도록 'select' 도구로 전환합니다.
    this.editor.setCurrentTool('select');
  };
}

/**
 * @class Idle
 * @extends StateNode
 * @description
 * `AccordionTool`의 `idle` 상태를 나타내는 내부 클래스입니다.
 * 이 상태에서는 특별한 로직이나 이벤트 핸들링이 없습니다.
 */
class Idle extends StateNode {
  // Idle 상태에서는 특별한 동작 없음
}
