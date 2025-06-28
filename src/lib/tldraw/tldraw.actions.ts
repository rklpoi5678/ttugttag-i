import { computed, type Editor, type TLUiOverrides } from 'tldraw'
import { $currentSlide, getSlides, moveToSlide } from '@/lib/useSlides'

export const customActions: TLUiOverrides['actions'] = (editor, actions) => {
  const $slides = computed('slides', () => getSlides(editor))
  return {
    ...actions,
    'next-slide': {
      id: 'next-slide',
      label: 'Next slide',
      kbd: 'right',
      onSelect() {
        const slides = $slides.get()
        const currentSlide = $currentSlide.get()
        const index = slides.findIndex((s) => s.id === currentSlide?.id)
        const nextSlide = slides[index + 1] ?? currentSlide ?? slides[0]
        if (nextSlide) {
          editor.stopCameraAnimation()
          moveToSlide(editor, nextSlide)
        }
      },
    },
    'previous-slide': {
      id: 'previous-slide',
      label: 'Previous slide',
      kbd: 'left',
      onSelect() {
        const slides = $slides.get()
        const currentSlide = $currentSlide.get()
        const index = slides.findIndex((s) => s.id === currentSlide?.id)
        const previousSlide = slides[index - 1] ?? currentSlide ?? slides[slides.length - 1]
        if (previousSlide) {
          editor.stopCameraAnimation()
          moveToSlide(editor, previousSlide)
        }
      },
    },
  }
}