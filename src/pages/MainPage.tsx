import Footer from '../components/Footer'
import Header from '../components/Header'
import HeroArtwork from '../components/HeroArtwork'
import MainSections from '../components/MainSections'
import ContactOverlay from '../components/ContactOverlay'
import { useState } from 'react'

function MainPage() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <div className="site" id="top">
      <Header onContact={() => setIsContactOpen(true)} />
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> HAPPY TO SERVE YOU!</p>
              <h1>CROCHET<br />WITH COLOR.</h1>
              <p className="hero-description">Make sweet little things with cozy yarn, happy hands, and a whole lot of color.</p>
              <div className="hero-actions">
                <a className="hero-button hero-button-primary" href="#shop">MY ITEMS <span aria-hidden="true">→</span></a>
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
