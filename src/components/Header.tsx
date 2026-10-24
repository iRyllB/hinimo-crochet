import { useEffect, useState } from 'react'
import hinimoLogo from '../assets/hinimo.png'

const navLinks = ['Home', 'Shop', 'Worth', 'About', 'Contact']

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
            <img className="brand-logo" src={hinimoLogo} alt="Hinimo Crochet" />
          </a>

          <div className="nav-actions">
            <div className="nav-links">
              {navLinks.map((link) => (
                <a
                  className={link === 'Home' ? 'nav-link active' : 'nav-link'}
                  href={link === 'Home' ? '/' : `/#${link.toLowerCase()}`}
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
