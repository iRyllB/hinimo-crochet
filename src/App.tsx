import './App.css'

const navLinks = ['Home', 'Shop', 'Worth', 'About', 'Contact']

function App() {
  return (
    <div className="site">
      <header className="site-header">
        <div className="header-frame">
          <nav className="navigation" aria-label="Main navigation">
            <a className="brand-link" href="/" aria-label="Cozy Loop Club home">
              <span className="brand-mark" aria-hidden="true">
                <span className="brand-loop brand-loop-one" />
                <span className="brand-loop brand-loop-two" />
              </span>
              <span className="brand-name">BRANDNAME</span>
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
            </div>
          </nav>
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              HAPPY TO SERVE YOU!
            </p>
            <h1>CROCHET WITH COLOR.</h1>
            <p className="hero-description">
              Make sweet little things with cozy yarn, happy hands, and a whole
              lot of color.
            </p>
            <div className="hero-actions">
              <a className="hero-button hero-button-primary" href="#shop">
                START CROCHETING <span aria-hidden="true">→</span>
              </a>
              <a className="hero-button hero-button-secondary" href="#worth">
                DISCOVER OUR WORTH <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="hero-art" aria-label="A cheerful crocheted bear relaxing on an orange blanket" role="img">
            <span className="sparkle sparkle-one" aria-hidden="true">✦</span>
            <span className="sparkle sparkle-two" aria-hidden="true">✦</span>
            <span className="art-arch" aria-hidden="true" />
            <span className="art-sun art-sun-large" aria-hidden="true" />
            <span className="art-sun art-sun-small" aria-hidden="true" />
            <span className="art-leaf art-leaf-one" aria-hidden="true" />
            <span className="art-leaf art-leaf-two" aria-hidden="true" />
            <span className="art-blanket" aria-hidden="true" />
            <span className="bear">
              <span className="bear-ear bear-ear-left" />
              <span className="bear-ear bear-ear-right" />
              <span className="bear-head">
                <span className="bear-eye bear-eye-left" />
                <span className="bear-eye bear-eye-right" />
                <span className="bear-muzzle">⌣</span>
              </span>
              <span className="bear-body" />
              <span className="bear-arm bear-arm-left" />
              <span className="bear-arm bear-arm-right" />
            </span>
            <span className="art-flower art-flower-green" aria-hidden="true" />
            <span className="art-flower art-flower-yellow" aria-hidden="true" />
            <span className="art-badge">WE<br />BARE<br />BEAR</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
