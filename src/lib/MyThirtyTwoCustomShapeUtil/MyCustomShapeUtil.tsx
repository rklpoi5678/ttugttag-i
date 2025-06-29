import { ShapeUtil, useEditor } from 'tldraw';
import { type AccordionShape, AccordionShapeProps } from '@/lib/MyThirtyTwoCustomShape/MyCustomShape'; // 정의한 도형 타입 임포트
import { ChevronDown } from 'lucide-react'; // 아이콘 임포트
import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * @class AccordionShapeUtil
 * @extends ShapeUtil<AccordionShape>
 * @description
 * Tldraw 캔버스에 AccordionShape를 렌더링하고 상호작용하는 방법을 정의합니다.
 */
export class AccordionShapeUtil extends ShapeUtil<AccordionShape> {
  static override type = 'accordion' as const; // 도형의 고유 타입
  static override props = AccordionShapeProps; // 정의한 속성 스키마

  /**
   * @method getDefaultProps
   * @description
   * 새 AccordionShape가 생성될 때의 기본 속성을 반환합니다.
   * @returns {AccordionShape['props']} 기본 속성 객체
   */
  override getDefaultProps(): AccordionShape['props'] {
    return {
      title: '새 아코디언',
      content: '여기에 새 아코디언의 내용을 입력하세요.',
      isOpen: false, // 기본적으로 접힌 상태
      w: 250, // 기본 너비
      h: 50,  // 기본 높이 (접힌 상태)
    };
  }

  override canEdit(_shape: AccordionShape): boolean {
    return true;
  }

  override canResize(_shape: AccordionShape): boolean {
    return true;
  }

  override isAspectRatioLocked(_shape: AccordionShape): boolean {
    return true;
  }

  /**
   * @method component
   * @description
   * 도형의 React 컴포넌트를 렌더링합니다.
   * @param {AccordionShape} shape - 렌더링할 AccordionShape 객체입니다.
   * @returns {JSX.Element} 아코디언 UI를 렌더링하는 React 요소입니다.
   */
  override component(shape: AccordionShape) {
    const { title, content, isOpen, id, w, h } = shape.props;
    const editor = useEditor(); // 에디터 인스턴스에 접근

    // 아코디언 내용의 실제 높이를 측정하기 위한 ref
    const contentBodyRef = useRef<HTMLDivElement>(null);

    // 아코디언 토글 핸들러
    const handleToggle = useCallback(() => {
      editor.updateShape({
        id: shape.id,
        type: 'accordion',
        props: {
          isOpen: !isOpen,
        },
      });
    }, [editor, shape.id, isOpen]);

    // 도형의 높이를 동적으로 조정 (내용 길이에 따라)
    useLayoutEffect(() => {
      if (!contentBodyRef.current) return;

      const headerHeight = 40; // 헤더의 고정 높이 (padding, border 포함 예상)
      const contentPadding = 10; // 내용 영역의 상하 패딩 (실제 CSS와 일치해야 함)
      const actualContentHeight = contentBodyRef.current.scrollHeight; // 내용의 실제 스크롤 높이

      // 아코디언의 총 높이 계산
      const newHeight = isOpen ? headerHeight + actualContentHeight + contentPadding * 2 : headerHeight;

      // 에디터에 도형의 크기 업데이트 요청
      // 이렇게 해야 Tldraw의 선택 상자와 리사이즈 핸들이 정확히 그려집니다.
      editor.updateShape({
        id: shape.id,
        type: 'accordion',
        props: { h: newHeight, w: w }, // 너비는 유지하고 높이만 업데이트
      });
    }, [editor, shape.id, isOpen, w, content]); // isOpen 상태나 내용이 변경될 때마다 다시 계산

    return (
      // `pointerEvents: 'all'`은 Tldraw 캔버스에서 이 DOM 요소가 클릭 이벤트를 받을 수 있도록 합니다.
      <div
        className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        style={{
          width: w,
          height: h, // Tldraw에서 받은 높이 적용 (애니메이션을 위해 CSS transition 필요)
          pointerEvents: 'all',
          overflow: 'hidden', // 내용이 넘칠 경우 숨김
        }}
      >
        {/* 아코디언 헤더 */}
        <button
          onClick={handleToggle}
          className="flex items-center justify-between w-full px-4 py-2 font-semibold text-left
                     bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white
                     border-b border-gray-200 dark:border-gray-600 cursor-pointer
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          style={{ height: '40px' }} // 헤더 고정 높이
        >
          <span className="text-sm font-semibold truncate">{title}</span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {/* 아코디언 내용 */}
        <div
          ref={contentBodyRef}
          className={`overflow-hidden transition-all duration-300 ease-in-out`}
          // 실제 높이는 contentBodyRef.current.scrollHeight로 계산되고,
          // CSS `height` 속성은 Tldraw가 업데이트하는 `h` prop에 따라 조절됩니다.
          // 여기서 `height`는 `grid-rows` 트릭 대신 실제 픽셀 값으로 애니메이션됩니다.
          style={{
            height: isOpen ? 'auto' : '0px', // 'auto'로 하면 높이 애니메이션이 부자연스러울 수 있음.
                                            // 대신 max-height 트릭을 사용하거나, useLayoutEffect에서 정확한 픽셀 높이를 반영
                                            // (현재 useLayoutEffect에서 h를 업데이트하므로 여기서는 max-height가 더 안전)
            maxHeight: isOpen ? '500px' : '0px', // 충분히 큰 값으로 설정
            opacity: isOpen ? 1 : 0,
            padding: isOpen ? '10px 15px' : '0 15px', // 패딩 조건부 적용
            paddingBottom: isOpen ? '10px' : '0px', // 하단 패딩도 애니메이션에 포함
            display: 'block', // 'block'으로 설정하여 텍스트 줄바꿈 보장
          }}
        >
          <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  /**
   * @method indicator
   * @description
   * 도형이 선택되었을 때 표시될 지시자(테두리, 리사이즈 핸들 등)를 정의합니다.
   * `null`을 반환하면 Tldraw의 기본 지시자가 사용됩니다.
   * @param {AccordionShape} shape - 현재 도형 객체입니다.
   * @returns {JSX.Element | null} 지시자 React 요소 또는 null
   */
  override indicator(shape: AccordionShape) {
    // 도형의 너비와 높이를 사용하여 기본 선택 상자를 그립니다.
    // 이는 Tldraw의 기본 indicator가 해주는 역할을 보완합니다.
    const { w, h } = shape.props;
    return <rect width={w} height={h} fill="none" stroke="blue" strokeWidth={2} />;
  }
}
