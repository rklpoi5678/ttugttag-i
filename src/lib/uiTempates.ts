/**
 * uiTempatest는 Tldraw 캔버스에 추가할 수 있는 모든 UI컴포넌트의 템플릿데이터만 모아두는 곳입니다
 * 즉, 컴포넌트의 이름, 아이콘, 카테고리, 그리고 defaultProps와 같은 순수한 데이터만 담습니다.
 */
import type {
    TLShape, TLGeoShapeProps, TLTextShapeProps,
    // TLDefaultColorStyle, TLDefaultFillStyle, TLDefaultDashStyle, TLDefaultSizeStyle,
    // TLDefaultFontStyle, TLDefaultHorizontalAlignStyle, TLDefaultVerticalAlignStyle,
    // TLGeoShapeGeoStyle, TLRichText // 정확한 타입을 임포트하지 않아도 TS가 추론하게 할 수 있지만, 명시하면 더 좋습니다.
} from 'tldraw';

// UI 템플릿의 타입을 정의합니다.
export type UiTemplate = {
    id: string; // 고유 ID (common-button, accordion-interactive, bento-menu등)
    name: string; // 사용자에게 표시될 이름
    icon: string; // 툴바에 표시될 아이콘 아이콘 (Lucide Icon 이름 또는 이모지)
    category: string; // 카테고리(UI Controls, Layout, Navigation등)
    subCategory?: string; // 세부 카테고리
    type: 'geo' | 'geo-group'| 'text' | 'accordion' | 'bento-menu' | 'custom-shape-type'; // Tldraw 도형 타입
    defaultProps: Record<string, any>; // 해당 도형 타입에 따른 기본 속성 (TLGeoShapeProps, TLTextShapeProps 등)
    getChildren?: (x: number, y: number) => TLShape[]; // 자식여부
    prompt?: string; // AI 생성용 프롬프트 (선택 사항입니다.)
};

export const mainCategories = ['UI Controls'];
export const subCategories: Record<string, string[]> = {
    'UI Controls': ['Common'],
};

export function getSubCategories(mainCat: string): string[] {
    return subCategories[mainCat] || [];
}

const defaultBaseShapeProps = {
    rotation: 0,
    parentId: 'page:page',
    isLocked: false,
    opacity: 1,
    meta: {},
};


// UI 템플릿 데이터
export const uiTemplates: UiTemplate[] = [
    {
        id: 'common-button',
        name: '버튼',
        icon: 'Square', // Lucide-react Icon (예시)
        category: 'UI Controls',
        subCategory: 'Common',
        type: 'geo', // TLGeoShape 타입 유지 (geo 도형을 활용)
        defaultProps: {
            // TLGeoShapeProps에 필수적인 'geo' 속성
            geo: 'rectangle', w: 100, h: 40, color: 'blue', fill: 'solid',
            dash: 'solid', size: 'm', font: 'sans', labelColor: 'black', align: 'middle',
            richText: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '버튼' }] }]}, // 텍스트 정의
            scale: 1, verticalAlign: 'middle', growY: 0, url: '',
        } as TLGeoShapeProps, // <-- TLGeoShapeProps로 명시적 타입 캐스팅
    },
    {
        id: 'accordion-interactive',
        name: '아코디언',
        icon: 'PanelBottom',
        category: 'UI Controls',
        subCategory: 'Common',
        type: 'accordion', // 사용자 정의 TLTextShape 타입
        defaultProps: {
            title: '아코디언 제목', content: "아코디언 내용", isOpen: false
        } as unknown as TLTextShapeProps,
    },
    {
        id: "accordion-model",
        name: "아코디언 모형",
        icon: "PanelBottomClose", // Lucide-react Icon (예시)
        category: "UI Controls",
        type: "geo-group", // 여러 geo 도형을 그룹화하여 생성함을 나타내는 사용자 정의 타입 (툴에서 해석)
        defaultProps: { // 이 경우는 툴에서 이 정보를 파싱하여 여러 geo 도형을 생성
          header: { geo: "rectangle", w: 200, h: 40, richText: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "헤더" }] }] }, color: "light-blue" },
          content: { geo: "rectangle", w: 200, h: 80, richText: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "내용" }] }] }, color: "grey" },
        }
      },
      {
        id: "bento-menu",
        name: "벤토 메뉴",
        icon: "Grid", // Lucide-react Icon (예시)
        category: "Layout",
        type: "bento-menu", // 사용자 정의 'bento-menu' 도형 타입
        defaultProps: {
          items: [{ text: "Item 1", icon: "home" }, { text: "Item 2", icon: "settings" }],
          columns: 2, gap: 16
        }
      },
    // ... 30개 이상의 다른 UI 컴포넌트 템플릿
];

export const getUiTemplateById = (id: string): UiTemplate | undefined => {
    return uiTemplates.find(template => template.id === id);
};