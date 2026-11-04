import { useEffect, useState } from 'react'

function ReturnToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 240)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <button
      className="mobile-return-to-top"
      type="button"
      aria-label="Return to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ^
    </button>
  )
}

export default ReturnToTopButton
