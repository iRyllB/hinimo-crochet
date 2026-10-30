import { useEffect, useRef, useState } from 'react'

type FloatingMobileMenuProps = {
  onContact: () => void
  onHome: () => void
}

type MenuPosition = {
  left: number
  top: number
}

const positionStorageKey = 'hinimo-floating-menu-position'
const hintStorageKey = 'hinimo-floating-menu-hint-seen'
const indicatorSize = 48
const edgeGap = 16

function getDefaultPosition(): MenuPosition {
  return {
    left: Math.max(edgeGap, window.innerWidth - indicatorSize - edgeGap),
    top: Math.max(edgeGap, window.innerHeight * 0.48),
  }
}

function clampPosition(position: MenuPosition): MenuPosition {
  return {
    left: Math.min(Math.max(edgeGap, position.left), window.innerWidth - indicatorSize - edgeGap),
    top: Math.min(Math.max(edgeGap, position.top), window.innerHeight - indicatorSize - edgeGap),
  }
}

function readStoredPosition(): MenuPosition {
  try {
    const storedPosition = window.localStorage.getItem(positionStorageKey)
    if (!storedPosition) return getDefaultPosition()
    return clampPosition(JSON.parse(storedPosition) as MenuPosition)
  } catch {
    return getDefaultPosition()
  }
}

function FloatingMobileMenu({ onContact, onHome }: FloatingMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<MenuPosition>(readStoredPosition)
  const [showHint, setShowHint] = useState(() => !window.sessionStorage.getItem(hintStorageKey))
  const dragState = useRef<{ pointerId: number; offsetX: number; offsetY: number; moved: boolean } | null>(null)

  useEffect(() => {
    if (showHint) {
      window.sessionStorage.setItem(hintStorageKey, 'true')
    }

    const handleResize = () => setPosition((currentPosition) => clampPosition(currentPosition))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showHint])

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragState.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - position.left,
      offsetY: event.clientY - position.top,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const currentDrag = dragState.current
    if (!currentDrag || currentDrag.pointerId !== event.pointerId) return

    const nextPosition = clampPosition({
      left: event.clientX - currentDrag.offsetX,
      top: event.clientY - currentDrag.offsetY,
    })
    if (Math.abs(nextPosition.left - position.left) > 3 || Math.abs(nextPosition.top - position.top) > 3) {
      currentDrag.moved = true
    }
    setPosition(nextPosition)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const currentDrag = dragState.current
    if (!currentDrag || currentDrag.pointerId !== event.pointerId) return

    dragState.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
    window.localStorage.setItem(positionStorageKey, JSON.stringify(position))
    if (!currentDrag.moved) setIsOpen((open) => !open)
  }

  const handleNavigation = (action: () => void) => {
    setIsOpen(false)
    action()
  }

  return (
    <div className={`floating-mobile-menu${isOpen ? ' is-open' : ''}`} style={{ left: position.left, top: position.top }}>
      {showHint && !isOpen && (
        <p className="floating-mobile-menu-hint" role="status">
          Tap this arrow to open the menu
          <button type="button" onClick={() => setShowHint(false)} aria-label="Dismiss menu hint">×</button>
        </p>
      )}
      {isOpen && (
        <nav className="floating-mobile-menu-panel" aria-label="Mobile navigation">
          <a href="/" onClick={(event) => { event.preventDefault(); handleNavigation(onHome) }}>Home</a>
          <a href="/#shop" onClick={() => setIsOpen(false)}>Shop</a>
          <a href="/#about" onClick={() => setIsOpen(false)}>About</a>
          <a href="/#contact" onClick={() => setIsOpen(false)}>Feedback</a>
          <a href="/listings" onClick={() => setIsOpen(false)}>Full Catalog</a>
          <button type="button" onClick={() => handleNavigation(onContact)}>Contact Me</button>
        </nav>
      )}
      <button
        className="floating-mobile-menu-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span aria-hidden="true">{isOpen ? '←' : '→'}</span>
      </button>
    </div>
  )
}

export default FloatingMobileMenu
