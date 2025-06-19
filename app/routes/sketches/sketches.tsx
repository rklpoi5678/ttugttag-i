import { Tldraw, type TLComponents, useEditor, useValue, type TLEditorSnapshot} from 'tldraw';
import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'
import 'tldraw/tldraw.css'
import { ShapeList } from '@/components/sketches/ShapeList'
import '../../../styles/layer.panel.css'
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
        <div className='layer-panel-title'>레이어</div>
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
  const assetUrls = getAssetUrlsByMetaUrl()
 

  return (
    <div style={{ position: 'fixed', inset: 0}}>
      <Tldraw 
        persistenceKey='layer-panel-examle'
        components={componets}
        getShapeVisibility={(s) =>
          s.meta.force_show ? 'visible' : s.meta.hidden ? 'hidden' : 'inherit'
        }
        assetUrls={assetUrls}
        // snapshot={snapshot as any as TLEditorSnapshot}
      />
    </div>
  );
}
