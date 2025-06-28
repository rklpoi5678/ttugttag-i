import { DefaultKeyboardShortcutsDialog, DefaultKeyboardShortcutsDialogContent, DefaultToolbar, DefaultToolbarContent, TldrawUiMenuItem, useIsToolSelected, useTools, type TLComponents } from 'tldraw'
import { LayerAndWireframePanel } from '@/components/sketches/LayerAndWireframePanel'
import RightElementsPanel from '@/components/sketches/RightSidePanel'
import { SlidesPanel } from '@/components/sketches/SlidesPanel'

export const customComponents: TLComponents = {
  QuickActions: null,
  MenuPanel: null,
  Minimap: null,
  StylePanel: RightElementsPanel,
  SharePanel: null,
  HelperButtons: SlidesPanel,
  Toolbar(props) {
    const tools = useTools()
    const isSlideSelected = useIsToolSelected(tools['slide'])
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem {...tools['slide']} isSelected={isSlideSelected} />
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools()
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <TldrawUiMenuItem {...tools['slide']} />
        <DefaultKeyboardShortcutsDialogContent />
      </DefaultKeyboardShortcutsDialog>
    )
  },
  InFrontOfTheCanvas: LayerAndWireframePanel,
}