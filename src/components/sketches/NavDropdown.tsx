import React, { useState } from "react";
import type { TLShapePartial, TLShapeId, Editor } from "tldraw";

interface NavDropdownProps {
    id: string;
    buttonText: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: (id: string) => void;
    editor: Editor | null
}

interface UiComponent {
    name: string;
    category: string;
    preview?: string;
    shapes: TLShapePartial[]
}

// =================================================================
// UI 컴포넌트 정의: 여기에 자주 쓰는 UI 32가지 도형 데이터를 정의합니다.
// 실제 프로젝트에서는 이 부분을 별도의 파일로 분리하여 관리하는 것이 좋습니다.
// =================================================================

const UI_COMPONENTS_DATA: UiComponent[] = [
    // --- UI Controls 카테고리 ---
    {
        name: "검색 상자",
        category: "UI Controls",
        shapes: [
            // 사각형
            {
                id: null as any, type: 'geo' as any, x: 0, y: 0, props: {
                    w: 250, h: 45, geo: 'rectangle', color: 'black', fill: 'none', dash: 'solid'
                }
            },
            // 돋보기 아이콘 (대략적인 흉내)
            {
                id: null as any, type: 'geo' as any, x: 10, y: 12, props: {
                    w: 20, h: 20, geo: 'ellipse', color: 'black', fill: 'none', dash: 'solid'
                }
            },
            {
                id: null as any, type: 'geo' as any, x: 25, y: 25, props: {
                    w: 10, h: 10, geo: 'rectangle', color: 'black', fill: 'solid', rotation: Math.PI / 4
                }
            },
            // 플레이스홀더 텍스트
            {
                id: null as any, type: 'text' as any, x: 40, y: 15, props: {
                    text: '검색...', font: 'draw', size: 'm', align: 'start', color: 'grey'
                }
            }
        ]
    },
    {
        name: "기본 버튼",
        category: "UI Controls",
        shapes: [
            {
                id: null as any,    type: 'geo' as any, x: 0, y: 0, props: {
                    w: 120, h: 40, geo: 'rectangle', color: 'blue', labelColor: 'white', fill: 'solid',
                    label: '버튼', font: 'draw', align: 'middle'
                }
            }
        ]
    },
    {
        name: "인풋 필드",
        category: "UI Controls",
        shapes: [
            {
                id: null as any, type: 'geo' as any, x: 0, y: 0, props: {
                    w: 200, h: 40, geo: 'rectangle', color: 'black', fill: 'none', dash: 'dashed',
                    label: '텍스트 입력', font: 'draw', align: 'start'
                }
            },
            {
                id: null as any, type: 'text' as any, x: 10, y: 10, props: {
                    text: '플레이스홀더', color: 'grey', align: 'start'
                }
            }
        ]
    },
    // --- Buttons 카테고리 ---
    {
        name: "기본 버튼 (Blue)",
        category: "Buttons",
        shapes: [
            { id: null as any, type: 'geo' as any, x: 0, y: 0, props: { w: 120, h: 40, geo: 'rectangle', color: 'blue', labelColor: 'white', fill: 'solid', label: '확인', font: 'draw', align: 'middle' } }
        ]
    },
    {
        name: "취소 버튼 (Red)",
        category: "Buttons",
        shapes: [
            { id: null as any, type: 'geo' as any, x: 0, y: 0, props: { w: 120, h: 40, geo: 'rectangle', color: 'red', labelColor: 'white', fill: 'solid', label: '취소', font: 'draw', align: 'middle' } }
        ]
    },
    {
        name: "링크 버튼",
        category: "Buttons",
        shapes: [
            { id: null as any, type: 'text' as any, x: 0, y: 0, props: { text: '더보기', font: 'draw', size: 'm', color: 'blue', align: 'start' } }
        ]
    },
    // --- Forms 카테고리 ---
    {
        name: "간단 로그인 폼",
        category: "Forms",
        shapes: [
            // 배경
            { id: null as any, type: 'geo' as any, x: 0, y: 0, props: { w: 300, h: 250, geo: 'rectangle', color: 'black', fill: 'semi', opacity: 0.1 } },
            // 제목
            { id: null as any, type: 'text' as any, x: 20, y: 20, props: { text: '로그인', font: 'draw', size: 'l', align: 'start', color: 'black' } },
            // 이메일 인풋
            { id: null as any, type: 'geo' as any, x: 20, y: 70, props: { w: 260, h: 40, geo: 'rectangle', color: 'black', fill: 'none', dash: 'dashed', label: '이메일', font: 'draw', align: 'start' } },
            // 비밀번호 인풋
            { id: null as any, type: 'geo' as any, x: 20, y: 120, props: { w: 260, h: 40, geo: 'rectangle', color: 'black', fill: 'none', dash: 'dashed', label: '비밀번호', font: 'draw', align: 'start' } },
            // 로그인 버튼
            { id: null as any, type: 'geo' as any, x: 20, y: 180, props: { w: 260, h: 45, geo: 'rectangle', color: 'blue', labelColor: 'white', fill: 'solid', label: '로그인', font: 'draw', align: 'middle' } }
        ]
    },
    {
        name: "체크박스",
        category: "Forms",
        shapes: [
            { id: null as any, type: 'geo' as any, x: 0, y: 0, props: { w: 20, h: 20, geo: 'rectangle', color: 'black', fill: 'none' } },
            { id: null as any, type: 'text' as any, x: 25, y: 0, props: { text: '옵션 선택', font: 'draw', size: 'm', color: 'black' } }
        ]
    },
    // 더 많은 UI 컴포넌트 추가...
    {
        name: "탭 바",
        category: "Layout", // 카테고리를 'Layout'으로 변경
        shapes: [
            { // 탭 바 배경
                id: null as any, type: 'geo' as any, x: 0, y: 0, props: {
                    w: 300, h: 50, geo: 'rectangle', color: 'black', fill: 'semi', opacity: 0.1
                }
            },
            { // 탭 1
                id: null as any, type: 'geo' as any, x: 0, y: 0, props: {
                    w: 75, h: 30, geo: 'rectangle', color: 'black', fill: 'solid', label: 'One', labelColor: 'white', font: 'draw', align: 'middle'
                }
            },
            { // 탭 2
                id: null as any, type: 'geo' as any, x: 75, y: 0, props: {
                    w: 75, h: 30, geo: 'rectangle', color: 'black', fill: 'none', label: 'Two', font: 'draw', align: 'middle'
                }
            },
            { // 탭 3
                id: null as any, type: 'geo' as any, x: 150, y: 0, props: {
                    w: 75, h: 30, geo: 'rectangle', color: 'black', fill: 'none', label: 'Three', font: 'draw', align: 'middle'
                }
            },
            { // 탭 4
                id: null as any, type: 'geo' as any, x: 225, y: 0, props: {
                    w: 75, h: 30, geo: 'rectangle', color: 'black', fill: 'none', label: 'Four', font: 'draw', align: 'middle'
                }
            }
        ]
    },
    {
        name: "텍스트 영역",
        category: "Layout",
        shapes: [
            {
                id: null as any, type: 'geo' as any, x: 0, y: 0, props: {
                    w: 200, h: 100, geo: 'rectangle', color: 'black', fill: 'none', dash: 'solid'
                }
            },
            {
                id: null as any, type: 'text' as any, x: 10, y: 10, props: {
                    text: '여기에 긴 텍스트를 입력하세요.', font: 'draw', size: 'm', color: 'grey', align: 'start'
                }
            }
        ]
    },
    {
        name: "텍스트 인풋",
        category: "Text",
        shapes: [
            {
                id: null as any, type: 'geo' as any, x: 0, y: 0, props: {
                    w: 150, h: 35, geo: 'rectangle', color: 'black', fill: 'none', dash: 'solid'
                }
            },
            {
                id: null as any, type: 'text' as any, x: 10, y: 8, props: {
                    text: 'Some text', font: 'draw', size: 'm', color: 'black', align: 'start'
                }
            }
        ]
    },
    {
        name: "텍스트 라벨",
        category: "Text",
        shapes: [
            {
                id: null as any, type: 'text' as any, x: 0, y: 0, props: {
                    text: 'A paragraph of text label.\nA second row of label text.', font: 'draw', size: 's', color: 'black', align: 'start'
                }
            }
        ]
    },
    {
        name: "지그재그 선",
        category: "Symbols",
        shapes: [
            {
                id: null as any, type: 'draw' as any, x: 0, y: 0, props: {
                    points: [
                        { x: 0, y: 20, z: 0.5 },
                        { x: 20, y: 0, z: 0.5 },
                        { x: 40, y: 20, z: 0.5 },
                        { x: 60, y: 0, z: 0.5 },
                        { x: 80, y: 20, z: 0.5 },
                        { x: 100, y: 0, z: 0.5 }
                    ],
                    color: 'black', dash: 'draw', size: 'm'
                }
            }
        ]
    },
    {
        name: "물결 블록 텍스트",
        category: "Symbols",
        shapes: [
            {
                id: null as any, type: 'text' as any, x: 0, y: 0, props: {
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    font: 'draw', size: 's', color: 'black', align: 'start', w: 200
                }
            },
            {
                id: null as any, type: 'draw' as any, x: 0, y: 0, props: {
                    points: [
                        { x: 0, y: 5, z: 0.5 }, { x: 50, y: 15, z: 0.5 }, { x: 100, y: 5, z: 0.5 },
                        { x: 150, y: 15, z: 0.5 }, { x: 200, y: 5, z: 0.5 }
                    ], color: 'black', dash: 'draw', size: 's'
                }
            },
            {
                id: null as any, type: 'draw' as any, x: 0, y: 25, props: {
                    points: [
                        { x: 0, y: 5, z: 0.5 }, { x: 50, y: 15, z: 0.5 }, { x: 100, y: 5, z: 0.5 },
                        { x: 150, y: 15, z: 0.5 }, { x: 200, y: 5, z: 0.5 }
                    ], color: 'black', dash: 'draw', size: 's'
                }
            }
        ]
    }
    // ... 여기에 더 많은 UI 컴포넌트들을 추가하세요 (총 32개)
];

const UI_CATEGORIES = Array.from(new Set(UI_COMPONENTS_DATA.map(comp => comp.category)))

const NavDropdown: React.FC<NavDropdownProps> = ({ id, buttonText, children, isOpen, onToggle, editor }) => {
    // "자주 쓰는 UI 32가지" 드롭다운을 위한 로컬 상태
    const [activeCategory, setActiveCategory] = useState(UI_CATEGORIES[0] || ''); // 첫 번째 카테고리로 초기화

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, shapes: TLShapePartial[]) => {
        e.dataTransfer.setData('tldraw/custom-shape', JSON.stringify(shapes));
        e.dataTransfer.effectAllowed = 'copy'
    }
    const handleItemClick = (shapeData: TLShapePartial[]) => {
        if (editor) {
            const { x, y, w, h } = editor.getViewportPageBounds();
            // 화면 중앙에 가깝게 배치하되, 기존 도형과 겹치지 않도록 약간의 오프셋 추가
            const centerX = x + w / 2;
            const centerY = y + h / 2;
            const offsetY = 50; // 예시 오프셋

            const shapesToCreate = shapeData.map((s, index) => ({
                ...s,
                id: editor.createShape(s), // ID가 없으면 새로 생성
                x: (s.x || 0) + centerX - (shapeData.length > 1 ? shapeData[0].props?.w / 2 || 0 : 0), // 그룹의 경우 중앙 정렬
                y: (s.y || 0) + centerY - (shapeData.length > 1 ? shapeData[0].props?.h / 2 || 0 : 0) + offsetY,
            }));

            editor.createShapes(shapesToCreate);
            editor.setSelectedShapes(shapesToCreate.map(s => s.id));
            onToggle(id); // 도형 추가 후 드롭다운 닫기
        } else {
            console.warn("Tldraw editor not available.");
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => onToggle(id)}
                className="
                    px-4 py-2
                    bg-gray-600 hover:bg-gray-700
                    text-white
                    rounded-md
                    cursor-pointer
                    text-base
                    flex items-center gap-1
                    mx-1
                    transition-colors duration-200 ease-in-out
                "
            >
                {buttonText}
                <span className="ml-1">&#9660;</span>
            </button>

            {isOpen && (
                <div className="
                    absolute top-full left-1/2 -translate-x-1/2
                    bg-white
                    border border-gray-300
                    rounded-md
                    shadow-lg
                    mt-1
                    min-w-[700px] max-w-[90vw]
                    max-h-[400px]
                    overflow-hidden
                    z-50
                    p-2
                    flex flex-col
                ">
                    {id === "ui32" ? (
                        <>
                            {/* 카테고리 탭 영역 */}
                            <div className="
                                flex flex-wrap gap-2
                                border-b border-gray-200 pb-2 mb-2
                                overflow-x-auto
                                whitespace-nowrap
                                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
                            ">
                                {UI_CATEGORIES.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`
                                            px-3 py-1 rounded-full text-sm font-medium
                                            ${activeCategory === category
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                            transition-colors duration-200
                                        `}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* 컴포넌트 슬라이드 영역 (가로 스크롤) */}
                            <div className="
                                flex-grow
                                overflow-x-auto overflow-y-hidden
                                whitespace-nowrap
                                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
                                p-1
                            ">
                                {UI_COMPONENTS_DATA
                                    .filter(comp => comp.category === activeCategory)
                                    .map(comp => (
                                        <div
                                            key={comp.name}
                                            onClick={() => handleItemClick(comp.shapes)}
                                            className="
                                                inline-flex flex-col items-center justify-center
                                                p-2 m-1
                                                bg-white hover:bg-gray-50
                                                border border-gray-200 rounded-md
                                                cursor-pointer
                                                transition-colors duration-200
                                                min-w-[120px] h-[100px]
                                                shadow-sm hover:shadow-md
                                            "
                                        >
                                            {/* 여기에 미리보기 이미지/SVG 또는 간단한 사각형을 표시할 수 있습니다 */}
                                            <div className="w-16 h-10 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs text-blue-800 rounded">
                                                {/* 실제 미리보기를 나중에 추가 */}
                                                {comp.name.split(' ')[0]} {/* 이름의 첫 단어만 표시 */}
                                            </div>
                                            <span className="mt-1 text-sm text-gray-700 font-medium whitespace-normal text-center">
                                                {comp.name}
                                            </span>
                                        </div>
                                    ))}
                                {UI_COMPONENTS_DATA.filter(comp => comp.category === activeCategory).length === 0 && (
                                    <p className="text-gray-500 text-sm p-4">이 카테고리에는 아직 UI 컴포넌트가 없습니다.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        // 기존의 다른 드롭다운 내용은 그대로 유지
                        <p className="my-1 text-gray-600">
                            {children || "여기에 Tldraw 도형들이 들어갈 예정입니다."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NavDropdown;