import Footer from '../components/Footer'
import Header from '../components/Header'
import HeroArtwork from '../components/HeroArtwork'
import MainSections from '../components/MainSections'
import ContactOverlay from '../components/ContactOverlay'
import { useEffect, useState } from 'react'

function MainPage() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>('.soft-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    )

    revealTargets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="site" id="top">
      <Header
        onContact={() => setIsContactOpen(true)}
        onHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> HAPPY TO SERVE YOU!</p>
              <h1>CROCHET<br />WITH COLOR.</h1>
              <p className="hero-description">A handmade crochet portfolio and creative catalog. Browse the work, then reach out to discuss availability or a custom piece.</p>
              <div className="hero-actions">
                <a className="hero-button hero-button-primary" href="/listings">MY ITEMS <span aria-hidden="true">→</span></a>
              </div>
            </div>
            <HeroArtwork />
          </div>
        </section>
        <MainSections onContact={() => setIsContactOpen(true)} />
      </main>
      <Footer />
      <ContactOverlay isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  )
}

export default MainPage
