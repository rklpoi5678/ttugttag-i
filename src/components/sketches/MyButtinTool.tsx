import { StateNode, createShapeId, type TLPointerEvent } from 'tldraw';
import type { UiTemplate } from '@/lib/uiTempates'; // template 타입 임포트

/**
 * @class MyButtonTool
 * @extends StateNode
 * @description 
 * 사용자가 캔버스에서 버튼을 생성할 수 있도록 하는 tldraw 사용자 정의 도구
 * 클릭된 위치에 미리 정의된 속성을 가진 'geo' 타입의 도형(버튼)을 생성
 */
export class MyButtonTool extends StateNode {
  /**
   * @static
   * @property {string} id - 도구의 고유 식별자입니다.
   */
  static override id = 'my-button-tool'; // 고유 ID

  /**
   * @static
   * @property {string} inital - 도구의 초기 상태입니다.
   */
  static override initial = 'idle';

  /**
   * @static
   * @property {Function} children - 이 도구가 가질 수 있는 자식 상태를 정의합니다.
   */
  static override children = () => [Idle];

  /**
   * @private
   * @static
   * @property {uiTempate} template - 생성될 버튼 도형의 기본 속성을 정의하는 템플릿입니다.
   * 실제 버튼 예시와 가장 가깝도록 속성을 조절하였습니다
   * `richText` 속성 내에 텍스트 내용을 정의하여 버튼 라벨을 설정합니다.
   */
  private static template: UiTemplate = {
    id:"common-button",
    name:"버튼",
    icon:"🖲️", // 아이콘은 현재 텍스트 이모지로 사용
    category:"UI Controls",
    subCategory:"Common",
    type:"geo", // 'geo' 타입은 사각, 원 등 기본적인 기하 도형을 나타냄
    defaultProps:{
      geo:"rectangle", // 사각형 형태의 버튼
      w:100, // 기본 너비
      h:40, // 기본 높이
      color:"blue", // 버튼 외곽선 및 텍스트 색상
      dash:"solid", // 실선 테두리
      fill:"solid", // 단색 채우기
      size:"m", // 중간 크기
      font:"sans", // 폰트 스타일
      labelColor:"black",
      align:"middle", // 텍스트 수평 정렬
      verticalAlign:"middle", // 텍스트 수직 정렬
      // `richText`를 사용하여 버튼 내 텍스트 정의
      richText:{type:"doc",content:[{type:"paragraph",content:[{type:"text",text:"버튼"}]}]},
      scale:1, // 기본 스케일
      growY:0, // 세로 확장
      url:"" //연결된 URL (선택사항)
    }
  };

  /**
   * @method onPointerDown
   * @param {TLPointerEvent} event - 포인터 이벤트 객체
   * @description
   * 마우스 포인터가 다운될 때 호출되는 이벤트 핸들러입니다.
   * 클릭된 위치에 새로운 버튼 도형을 생성하고, 현재 도구를 'select'도구로 변경합니다.
   */
  onPointerDown:TLPointerEvent= ({ point }) => {
    if (!this.editor) return;

    const template = MyButtonTool.template; // 미리 정의된 템플릿 사용

    /**
     * 캔버스에 생성할 도형의 속성을 정의합니다.
     * `createShapeId()`을 사용하여 고유한 ID를 생성합니다.
     * 클릭된 `Point.x`와 `Point.y`를 사용하여 도형의 배치를 설정합니다.
     * `props`는 미리 정의된 템플릿의 `defaultProps`를 사용합니다.
     */
    const shapeToCreate = {
        id: createShapeId(), //고유한 ID생성
        type: template.type as any, // 템플릿에 정의된 도형 타입('geo'))
        x: point.x, // 마우스 클릭된 캔버스 세계 좌표 x
        y: point.y, // 마우스 클릭된 캔버스 세계 좌표 y
        props: {
            ...template.defaultProps,
            // 필요시 여기에 런타임에 결정되는 추가 prop를 오버라이드 할수있습니다.
        },
    };

    //도형을 생성합니다.
    this.editor.createShape(shapeToCreate);
    console.log('Created shape with MyButtonTool:', shapeToCreate);

    // 도형 생성 후 ,사용자가 도형을 바로 선택하거나 이동할 수 있도록 'select'도구로 전환합니다.
    this.editor.setCurrentTool('select');
  };
}

/**
 * @class Idle
 * @extends StateNode
 * @description
 * `MyButtonTool`의 `idle` 상태를 나타내는 내부 클래스입니다.
 * 이 상태에서는 특별한 로직이나 이벤트 핸들링이 없습니다.
 */
class Idle extends StateNode {
  // Idle 상태에서는 특별한 동작 없음
}