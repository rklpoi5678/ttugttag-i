import { useEditor} from 'tldraw'

export default function ExportCanvasButton() {
  const editor = useEditor()

  return (
    <button
        style={{
            pointerEvents: 'all',
            fontSize: 18,
            backgroundColor: 'thistle',
            color: 'white', // Changed text color to white for better contrast
            padding: '10px 20px', // Added some padding
            borderRadius: '5px', // Rounded corners
            border: 'none', // Removed default border
            cursor: 'pointer', // Indicates it's clickable
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow
            transition: 'background-color 0.3s ease', // Smooth transition on hover
        }}
        onClick={async () => {
            const shapeIds = editor.getCurrentPageShapeIds()
            if (shapeIds.size === 0) return alert('캔버스에 요소가 없습니다.')
            const { blob } = await editor.toImage([...shapeIds], { format: 'png', background: false })

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = '스케치.jpg'
            link.click()
            URL.revokeObjectURL(link.href)
        }}
    >
        이미지로 내보내기
    </button>
)
}