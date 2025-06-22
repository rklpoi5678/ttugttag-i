// src/utils/uiTemplates.ts

import type {
    TLShape, TLGeoShapeProps, TLTextShapeProps,
    // TLDefaultColorStyle, TLDefaultFillStyle, TLDefaultDashStyle, TLDefaultSizeStyle,
    // TLDefaultFontStyle, TLDefaultHorizontalAlignStyle, TLDefaultVerticalAlignStyle,
    // TLGeoShapeGeoStyle, TLRichText // 정확한 타입을 임포트하지 않아도 TS가 추론하게 할 수 있지만, 명시하면 더 좋습니다.
} from 'tldraw';

// UI 템플릿의 타입을 정의합니다.
export type UiTemplate = {
    id: string;
    name: string;
    icon: string;
    category: string;
    subCategory?: string;
    type: string;
    defaultProps: Record<string, any>;
    getChildren?: (x: number, y: number) => TLShape[];
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
        icon: '🖲️',
        category: 'UI Controls',
        subCategory: 'Common',
        type: 'geo', // TLGeoShape 타입 유지
        defaultProps: {
            geo: 'rectangle', // TLGeoShapeProps에 필수적인 'geo' 속성
            w: 100,
            h: 40,
            color: 'blue',
            // label: '버튼', // <-- TLGeoShapeProps에 'label' 속성은 없습니다. 제거합니다.

            dash: 'solid',
            fill: 'solid',
            size: 'm',
            font: 'sans',
            labelColor: 'black',
            align: 'middle',
            // richText를 사용하여 라벨 텍스트를 정의합니다.
            richText: { // <-- 변경: '버튼' 텍스트를 포함하는 TLRichText 구조로 변경
                type: 'doc',
                content: [{
                    type: 'paragraph',
                    content: [{ type: 'text', text: '버튼' }]
                }]
            },
            scale: 1,
            verticalAlign: 'middle',
            growY: 0,
            url: '',
        } as TLGeoShapeProps, // <-- TLGeoShapeProps로 명시적 타입 캐스팅
    },
    {
        id: 'common-text',
        name: '텍스트',
        icon: '🅰️',
        category: 'UI Controls',
        subCategory: 'Common',
        type: 'text', // TLTextShape 타입
        defaultProps: {
            text: '텍스트 입력', // 실제 텍스트 내용
            size: 'm',
            color: 'black',
            font: 'sans',

            textAlign: 'middle',
            autoSize: true,
            w: 100,
            h: 30,
            // TLTextShapeProps도 richText를 사용합니다.
            richText: { // <-- 변경: '텍스트 입력' 텍스트를 포함하는 TLRichText 구조로 변경
                type: 'doc',
                content: [{
                    type: 'paragraph',
                    content: [{ type: 'text', text: '텍스트 입력' }]
                }]
            },
            scale: 1,
        } as TLTextShapeProps,
    },
    // MyCustomShape 템플릿은 현재 논의에서 제외
];