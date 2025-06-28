import { type TLUiOverrides } from 'tldraw'

export const customTools: TLUiOverrides['tools'] = (editor, tools) => {
  tools.slide = {
    id: 'slide',
    icon: 'group',
    label: 'Slide',
    kbd: 's',
    onSelect: () => editor.setCurrentTool('slide'),
  }
  return tools
}