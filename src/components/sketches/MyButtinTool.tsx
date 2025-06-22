// src/lib/tools/MyButtonTool.ts (예시 파일)
import { StateNode, createShapeId, type TLPointerEvent } from 'tldraw';
import type { UiTemplate } from '@/lib/uiTempates'; // template 타입 임포트

export class MyButtonTool extends StateNode {
  static override id = 'my-button-tool'; // 고유 ID
  static override initial = 'idle';
  static override children = () => [Idle];

  // 도구 아이콘에 사용할 템플릿 데이터 (여기서는 예시로 하드코딩)
  // 실제로는 RightSidePanel에서 사용될 데이터와 동일해야 합니다.
  private static template: UiTemplate = {
    id:"common-button",
    name:"버튼",
    icon:"🖲️",
    category:"UI Controls",
    subCategory:"Common",
    type:"geo",
    defaultProps:{
      geo:"rectangle",w:100,h:40,color:"blue",dash:"solid",fill:"solid",size:"m",font:"sans",labelColor:"black",align:"middle",
      richText:{type:"doc",content:[{type:"paragraph",content:[{type:"text",text:"버튼"}]}]},
      scale:1,verticalAlign:"middle",growY:0,url:""
    }
  };

  // 마우스 클릭 시 도형 생성
  onPointerDown:TLPointerEvent= ({ point }) => {
    if (!this.editor) return;

    const template = MyButtonTool.template; // 미리 정의된 템플릿 사용

    const shapeToCreate = {
        id: createShapeId(),
        type: template.type as any, // 'geo' or 'my-custom-shape' 등
        x: point.x, // 클릭된 캔버스 세계 좌표
        y: point.y,
        props: template.defaultProps,
    };
    this.editor.createShape(shapeToCreate);
    console.log('Created shape with MyButtonTool:', shapeToCreate);

    // 도형 생성 후 도구 상태를 다시 'idle'로 설정하거나,
    // 드로잉 도구처럼 계속 도형을 그릴 수 있게 할 수 있습니다.
    this.editor.setCurrentTool('select'); // 다시 'idle' 상태로 돌아감
  };
}

class Idle extends StateNode {
  // Idle 상태에서는 특별한 동작 없음
}