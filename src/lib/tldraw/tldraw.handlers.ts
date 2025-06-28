import { Box, createShapeId, type Editor, type TLFrameShape } from 'tldraw'

const INITIAL_VIEW_PADDING = 100;

export function handleEditorMount(
  editor: Editor,
  initialCanvasWidth: number,
  initialCanvasHeight: number,
  setHasUnsavedChanges: (value: boolean) => void
): () => void {
  console.log("Tldraw editor mounted.");

  const currentPageId = editor.getCurrentPageId();
  const frameId = createShapeId('main-canvas-area-frame');

  const initializeFrame = (currentEditor: Editor) => {
    let frameShape = currentEditor.getShape<TLFrameShape>(frameId);
    const currentWidth = frameShape?.props.w || initialCanvasWidth;
    const currentHeight = frameShape?.props.h || initialCanvasHeight;
    const sizeText = `(${Math.round(currentWidth)} x ${Math.round(currentHeight)})`;
    const newFrameName = `작업 영역 ${sizeText}`;

    if (!frameShape) {
      currentEditor.createShape<TLFrameShape>({
        id: frameId,
        parentId: currentPageId,
        type: 'frame',
        x: 0,
        y: 0,
        props: { name: newFrameName, w: initialCanvasWidth, h: initialCanvasHeight },
      });
    } else if (frameShape.props.name !== newFrameName) {
      currentEditor.updateShape({ id: frameId, type: 'frame', props: { name: newFrameName } });
    }

    const customCanvasBounds = new Box(0, 0, currentWidth, currentHeight);
    
    currentEditor.setCameraOptions({
      constraints: {
        behavior: 'contain',
        bounds: customCanvasBounds,
        initialZoom: 'fit-max',
        baseZoom: 'fit-max',
        origin: { x: 0.5, y: 0.5 },
        padding: { x: INITIAL_VIEW_PADDING, y: INITIAL_VIEW_PADDING },
      },
    });

    currentEditor.zoomToBounds(customCanvasBounds, { force: true, animation: { duration: 500 } });
  };
  
  initializeFrame(editor);

  const dispose = editor.store.listen((changes) => {
    let shouldUpdateFrameName = false;
    for (const recordId in changes) {
      const change = changes[recordId];
      if (recordId === frameId && change.type === 'updated') {
        const newShape = change.after as TLFrameShape;
        const oldShape = change.before as TLFrameShape;
        if (newShape.props.w !== oldShape.props.w || newShape.props.h !== oldShape.props.h) {
          shouldUpdateFrameName = true;
          break;
        }
      }
    }
    if (shouldUpdateFrameName) {
      initializeFrame(editor);
    }
    setHasUnsavedChanges(true);
  });

  return () => {
    dispose();
    console.log("Tldraw editor unmounted, store listener disposed");
  };
}