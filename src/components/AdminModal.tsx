import type { ReactNode } from 'react'

type AdminModalProps = {
  title: string
  eyebrow?: string
  onClose: () => void
  children: ReactNode
}

function AdminModal({ title, eyebrow, onClose, children }: AdminModalProps) {
  return (
    <div className="admin-message-overlay" role="presentation" onClick={onClose}>
      <section className="admin-message-dialog admin-reusable-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onClick={(event) => event.stopPropagation()}>
        <button className="admin-message-dialog-close" type="button" onClick={onClose} aria-label={`Close ${title}`}>×</button>
        {eyebrow && <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> {eyebrow}</p>}
        <h2 id="admin-modal-title">{title}</h2>
        {children}
      </section>
    </div>
  )
}

export default AdminModal
