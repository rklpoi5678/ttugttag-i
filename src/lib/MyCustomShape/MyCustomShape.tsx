// src/lib/shapes/MyCustomShape/MyCustomShape.ts

import {
	Geometry2d,
	 HTMLContainer,
	type RecordProps,
	Rectangle2d,
	ShapeUtil,
	T,
	type TLBaseShape,
	type TLResizeInfo,
	resizeBox,
} from 'tldraw'

// [1] 사용자 정의 도형의 타입 정의
export type ICustomShape = TLBaseShape<
	'my-custom-shape', // 고유한 도형 타입 이름
	{
		w: number // 너비
		h: number // 높이
		text: string // 도형에 표시될 텍스트
	}
>

// [2] MyShapeUtil 클래스 정의
export class MyShapeUtil extends ShapeUtil<ICustomShape> {
	// [a] 도형의 타입 이름 설정 (필수)
	static override type = 'my-custom-shape' as const

	// [b] 도형의 속성(props) 정의 (필수)
	// T.number, T.string 등은 Tldraw의 타입 유틸리티입니다.
	static override props: RecordProps<ICustomShape> = {
		w: T.number,
		h: T.number,
		text: T.string,
	}

	// [c] 도형의 기본 속성 반환 (필수)
	getDefaultProps(): ICustomShape['props'] {
		return {
			w: 120, // 기본 너비
			h: 80,  // 기본 높이
			text: 'Custom Shape', // 기본 텍스트
		}
	}

	// [d] 도형의 시각적 형태를 정의하는 Geometry2d 반환 (필수)
	getGeometry(shape: ICustomShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true, // 채워진 형태로 표시
		})
	}

	// [e] 도형의 동작 설정 (선택 사항이지만, 크기 조절 등을 위해 필요)
	override canEdit() {
		return false // 도형을 더블 클릭해도 편집 모드로 들어가지 않음
	}

	override canResize() {
		return true // 도형 크기 조절 가능
	}

	override isAspectRatioLocked() {
		return false // 가로세로 비율 고정 안 함
	}

	// [f] 도형이 리사이즈될 때 호출되는 함수 (필수)
	// resizeBox는 Tldraw에서 제공하는 유틸리티로, 기본적인 박스 리사이즈를 처리합니다.
	override onResize(shape: ICustomShape, info: TLResizeInfo<ICustomShape>) {
		return resizeBox(shape, info)
	}

	// [g] 도형의 시각적 컴포넌트 렌더링 (필수)
	component(shape: ICustomShape) {
		return (
			// HTMLContainer를 사용하여 HTML/CSS 스타일링 적용 가능
			<HTMLContainer 
				id={shape.id} // 고유 ID 설정 (Tldraw 내부적으로 필요)
				style={{ 
					backgroundColor: 'var(--color-yellow-300)', // Tldraw 테마 색상 활용
					color: 'var(--color-text)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '4px',
					border: '1px solid var(--color-yellow-500)',
					fontSize: '0.875rem',
					padding: '8px',
					boxSizing: 'border-box',
					pointerEvents: 'none' // Tldraw가 이벤트를 처리하도록
				}}
			>
				{shape.props.text}
			</HTMLContainer>
		)
	}

	// [h] 도형의 선택 테두리나 스냅 가이드 등을 그릴 때 사용 (필수)
	// 일반적으로 component와 동일한 크기와 모양의 SVG 요소를 반환합니다.
	indicator(shape: ICustomShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}