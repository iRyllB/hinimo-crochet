import type { ContactMessage } from '../lib/supabase'

type AdminMessageOverlayProps = {
  message: ContactMessage
  onClose: () => void
  onMarkAsRead: () => void
}

function AdminMessageOverlay({ message, onClose, onMarkAsRead }: AdminMessageOverlayProps) {
  return (
    <div className="admin-message-overlay" role="presentation" onClick={onClose}>
      <section
        className="admin-message-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-message-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="admin-message-dialog-close" type="button" onClick={onClose} aria-label="Close message">×</button>
        <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> CONTACT NOTE</p>
        <div className="admin-message-dialog-heading">
          <h2 id="admin-message-dialog-title">{message.name}</h2>
          <span className="admin-message-status">{message.status === 'unread' ? 'NEW' : 'READ'}</span>
        </div>
        <a className="admin-message-dialog-email" href={`mailto:${message.email}`}>{message.email}</a>
        <p className="admin-message-dialog-date">{new Date(message.created_at).toLocaleString()}</p>
        <blockquote>{message.message}</blockquote>
        <div className="admin-message-dialog-actions">
          <a className="hero-button hero-button-primary" href={`mailto:${message.email}`}>REPLY BY EMAIL <span aria-hidden="true">→</span></a>
          {message.status === 'unread' && <button className="admin-message-read-button" type="button" onClick={onMarkAsRead}>MARK AS READ</button>}
        </div>
      </section>
    </div>
  )
}

export default AdminMessageOverlay
