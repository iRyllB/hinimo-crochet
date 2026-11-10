import { useState } from 'react'

type ContactOverlayProps = {
  isOpen: boolean
  onClose: () => void
}

const contactEmail = 'hello@hinimocrochet.com'
const inquirySubject = 'Hinimo Crochet inquiry'
const inquiryBody = 'Hi! I would like to ask about one of your crochet pieces.'

function getComposeUrl(provider: 'gmail' | 'outlook') {
  const params = new URLSearchParams({
    to: contactEmail,
    su: inquirySubject,
    body: inquiryBody,
  })

  if (provider === 'gmail') {
    return `https://mail.google.com/mail/?view=cm&fs=1&${params.toString()}`
  }

  return `https://outlook.live.com/mail/0/deeplink/compose?${params.toString().replace('su=', 'subject=')}`
}

function ContactOverlay({ isOpen, onClose }: ContactOverlayProps) {
  const [isEmailChooserOpen, setIsEmailChooserOpen] = useState(false)

  if (!isOpen) return null

  const showEmailChooser = () => setIsEmailChooserOpen(true)

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
          <button className="contact-email-link" type="button" onClick={showEmailChooser}>✉ {contactEmail}</button>
          <a href="tel:+639171234567">☎ +63 917 123 4567</a>
        </div>
        <div className="social-links" aria-label="Social media links">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
          <button type="button" onClick={showEmailChooser} aria-label="Email">✉</button>
        </div>
        <button className="hero-button hero-button-primary" type="button" onClick={showEmailChooser}>SEND AN INQUIRY <span aria-hidden="true">→</span></button>
        {isEmailChooserOpen && (
          <div className="email-chooser" role="dialog" aria-modal="true" aria-labelledby="email-chooser-title">
            <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> CHOOSE YOUR EMAIL</p>
            <h3 id="email-chooser-title">OPEN WITH</h3>
            <p>Select an email service to start your inquiry.</p>
            <div className="email-chooser-actions">
              <a className="email-provider-button" href={getComposeUrl('gmail')} target="_blank" rel="noreferrer" onClick={onClose}>Gmail</a>
              <a className="email-provider-button" href={getComposeUrl('outlook')} target="_blank" rel="noreferrer" onClick={onClose}>Microsoft Outlook</a>
            </div>
            <button className="email-chooser-cancel" type="button" onClick={() => setIsEmailChooserOpen(false)}>Cancel</button>
          </div>
        )}
      </section>
    </div>
  )
}

export default ContactOverlay
