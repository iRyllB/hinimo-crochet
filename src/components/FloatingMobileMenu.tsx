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
const indicatorSize = 40
const edgeGap = 16
const menuHeight = 330

function getDefaultPosition(): MenuPosition {
  return {
    left: Math.max(edgeGap, window.innerWidth - indicatorSize - edgeGap),
    top: Math.max(edgeGap, window.innerHeight - indicatorSize - 96),
  }
}

function clampPosition(position: MenuPosition): MenuPosition {
  const safeLeft = Number.isFinite(position.left) ? position.left : getDefaultPosition().left
  const safeTop = Number.isFinite(position.top) ? position.top : getDefaultPosition().top
  return {
    left: Math.min(Math.max(edgeGap, safeLeft), Math.max(edgeGap, window.innerWidth - indicatorSize - edgeGap)),
    top: Math.min(Math.max(edgeGap, safeTop), Math.max(edgeGap, window.innerHeight - indicatorSize - edgeGap)),
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
    const handleScroll = () => {
      if (window.scrollY > 120) setShowHint(false)
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
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
    if (!currentDrag.moved) {
      setShowHint(false)
      setIsOpen((open) => !open)
    }
  }

  const handleNavigation = (action: () => void) => {
    setIsOpen(false)
    action()
  }

  const menuSide = position.left + indicatorSize / 2 < window.innerWidth / 2 ? 'left' : 'right'
  const menuVerticalSide = position.top > window.innerHeight - menuHeight - edgeGap ? 'above' : 'below'

  return (
    <div
      className={`floating-mobile-menu floating-mobile-menu-${menuSide} floating-mobile-menu-${menuVerticalSide}${isOpen ? ' is-open' : ''}`}
      style={{ left: position.left, top: position.top }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {showHint && !isOpen && (
        <p className="floating-mobile-menu-hint" role="status">
          Open menu here
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
        <span className="floating-mobile-menu-bars" aria-hidden="true"><i /><i /><i /></span>
      </button>
    </div>
  )
}

export default FloatingMobileMenu
