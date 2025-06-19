import { Tldraw, type TLComponents, useEditor, useValue} from 'tldraw';
import 'tldraw/tldraw.css'
import { ShapeList } from '@/components/sketches/ShapeList'
import '../../../styles/layer.panel.css'
import { useEffect, useState } from 'react';
// import snapshot from './snapshot.json'

const componets: TLComponents = {
  InFrontOfTheCanvas: () => {
    const editor = useEditor()
    const shapeIds = useValue(
      'shapeIds',
      () => editor.getSortedChildIdsForParent(editor.getCurrentPageId()),
      [editor]
    )
    return (
      <div className='layer-panel'>
        <div className='layer-panel-title'>모양</div>
        <ShapeList 
          shapeIds={shapeIds}
          depth={0}
        />
      </div>
    )
  }
}

export default function ProjectEditorPage() {
  // const store = useSyncDemo({ roomId: 'myapp-abc123'})
 

  return (
    <div className='sketches-editor'>
      <Tldraw 
        // persistenceKey='layer-panel-examle'
        components={componets}
        getShapeVisibility={(s) =>
          s.meta.force_show ? 'visible' : s.meta.hidden ? 'hidden' : 'inherit'
        }
        // snapshot={snapshot as any as TLEditorSnapshot}
      />
    </div>
  );
}
