import { useEffect, useState } from 'react'
import hinimoHeader from '../assets/hinimo header.png'

const navLinks = ['Home', 'About', 'Shop', 'Contact']

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
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
                  href={link === 'Home' ? '/' : `/#${link === 'About' ? 'about' : link.toLowerCase()}`}
                  key={link}
                >
                  {link}
                </a>
              ))}
            </div>
            <a className="login-link" href="/#login">
              LOG IN
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
