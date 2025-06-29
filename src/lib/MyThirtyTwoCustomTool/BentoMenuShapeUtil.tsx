// src/lib/BentoMenuShape/BentoMenuShapeUtil.tsx
import { ShapeUtil, useEditor, react } from 'tldraw';
import { BentoMenuShape, BentoMenuShapeProps } from './BentoMenuShape';
// Lucide Icons를 동적으로 임포트하거나 매핑하는 로직이 필요할 수 있습니다.
import * as LucideIcons from 'lucide-react'; // 모든 아이콘을 가져옴

export class BentoMenuShapeUtil extends ShapeUtil<BentoMenuShape> {
  static override type = 'bento-menu' as const;
  static override props = BentoMenuShapeProps;

  override getDefaultProps(): BentoMenuShape['props'] {
    return {
      items: [{ text: 'New Item', icon: 'zap' }],
      columns: 2,
      gap: 16,
    };
  }

  override component(shape: BentoMenuShape) {
    const { items, columns, gap } = shape.props;
    // ... (렌더링 로직)
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        width: 'fit-content', // 필요에 따라 너비 조정
        pointerEvents: 'all', // 인터랙션 허용
        // ... 기타 스타일
      }}>
        {items.map((item, i) => {
          const IconComponent = item.icon ? (LucideIcons as any)[item.icon] : null;
          return (
            <div key={i} style={{
              backgroundColor: item.backgroundColor,
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '80px',
              minHeight: '80px',
            }}>
              {IconComponent && <IconComponent size={24} />}
              <span style={{ marginTop: '5px', fontSize: '14px' }}>{item.text}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // getBounds, indicator 등 필요한 다른 메서드 구현
}