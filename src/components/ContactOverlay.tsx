type ContactOverlayProps = {
  isOpen: boolean
  onClose: () => void
}

function ContactOverlay({ isOpen, onClose }: ContactOverlayProps) {
  if (!isOpen) return null

  return (
    <div className="contact-overlay" role="presentation" onClick={onClose}>
      <section
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close contact dialog">×</button>
        <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> LET'S CONNECT</p>
        <h2 id="contact-modal-title">LET'S TALK<br /><em>HANDMADE.</em></h2>
        <p>My works are available by inquiry only. Contact me first so we can discuss availability, details, and any custom requests before arranging your order.</p>
        <div className="contact-details">
          <a href="mailto:hello@hinimocrochet.com">✉ hello@hinimocrochet.com</a>
          <a href="tel:+639171234567">☎ +63 917 123 4567</a>
        </div>
        <div className="social-links" aria-label="Social media links">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
          <a href="mailto:hello@hinimocrochet.com" aria-label="Email">✉</a>
        </div>
        <a className="hero-button hero-button-primary" href="mailto:hello@hinimocrochet.com">SEND AN INQUIRY <span aria-hidden="true">→</span></a>
      </section>
    </div>
  )
}

export default ContactOverlay
