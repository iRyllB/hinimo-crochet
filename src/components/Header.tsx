import { useEffect, useState } from 'react'
import hinimoHeader from '../assets/hinimo header.png'

const navLinks = ['Home', 'Shop', 'About', 'Feedback']

type HeaderProps = {
  onContact: () => void
}

function Header({ onContact }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - previousScrollY

      setIsScrolled(currentScrollY > 0)
      if (currentScrollY <= 0) {
        setIsHidden(false)
      } else if (Math.abs(scrollDelta) >= 4) {
        setIsHidden(scrollDelta < 0)
      }

      previousScrollY = currentScrollY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}${isHidden ? ' is-hidden' : ''}`}>
      <div className="header-frame">
        <nav className="navigation" aria-label="Main navigation">
          <a className="brand-link" href="/" aria-label="Hinimo Crochet home">
            <img className="brand-logo" src={hinimoHeader} alt="Hinimo Crochet" />
          </a>

          <div className="nav-actions">
            <div className="nav-links">
              {navLinks.map((link) => (
                <a
                  className={link === 'Home' ? 'nav-link active' : 'nav-link'}
                  href={link === 'Home' ? '/' : `/#${link === 'About' ? 'about' : link === 'Feedback' ? 'contact' : link.toLowerCase()}`}
                  key={link}
                >
                  {link}
                </a>
              ))}
            </div>
            <button className="login-link" type="button" onClick={onContact}>
              CONTACT ME
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
