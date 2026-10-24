import hinimoLogo from '../assets/hinimo.png'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-frame">
        <a className="brand-link" href="/" aria-label="Hinimo Crochet home">
          <img className="brand-logo" src={hinimoLogo} alt="Hinimo Crochet" />
        </a>
        <p className="footer-copy">Made slowly, with lots of love. © 2024 Hinimo Crochet</p>
        <a className="back-to-top" href="#top">
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  )
}

export default Footer
