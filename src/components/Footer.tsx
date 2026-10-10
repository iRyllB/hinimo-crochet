function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-frame">
        <a className="brand-link" href="/" aria-label="Cozy Loop Club home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-loop brand-loop-one" />
            <span className="brand-loop brand-loop-two" />
          </span>
          <span className="brand-name">BRANDNAME</span>
        </a>
        <p className="footer-copy">Made slowly, with lots of love. © 2024 Cozy Loop Club</p>
        <a className="back-to-top" href="#top">
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  )
}

export default Footer
