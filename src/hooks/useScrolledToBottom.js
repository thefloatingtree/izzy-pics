import { useScrollYPosition } from 'react-use-scroll-position'

export function useScrolledToBottom(offset = 0) {
    const scrollY = useScrollYPosition()
    return Boolean(window.innerHeight + scrollY + offset >= document.body.offsetHeight && document.body.offsetHeight)
}