import { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { AdminAccessPolicy } from '../domain/SiteRouter'
import { getContactMessages, updateContactMessageStatus, type ContactMessage } from '../lib/supabase'
import AdminMessageOverlay from '../components/AdminMessageOverlay'

const accessPolicy = new AdminAccessPolicy()

function AdminInboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    accessPolicy.canAccess().then((authorized) => {
      if (!authorized) {
        window.location.href = '/admin/login'
        return
      }
      setIsAuthorized(true)
      return getContactMessages().then(setMessages)
    }).catch(() => setError('Messages could not be loaded. Check your Supabase table and admin access policies.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleSignOut = async () => {
    await accessPolicy.signOut()
    window.location.href = '/admin/login'
  }

  const markAsRead = async (message: ContactMessage) => {
    try {
      await updateContactMessageStatus(message.id, 'read')
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: 'read' } : item))
      setSelectedMessage((current) => current?.id === message.id ? { ...current, status: 'read' } : current)
    } catch {
      setError('The message could not be updated.')
    }
  }

  if (isLoading || !isAuthorized) return null

  return (
    <div className="admin-layout">
      <AdminSidebar activeMenu="Contact inbox" onSignOut={handleSignOut} />
      <main className="admin-main">
        <div className="admin-content admin-inbox-content">
          <div className="admin-heading-row">
            <div><p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> SAY HI BACK</p><h1>CONTACT<br /><em>INBOX.</em></h1></div>
            <button className="admin-add-button" type="button">REPLY TEMPLATES →</button>
          </div>
          {isLoading && <p className="admin-feedback">LOADING NOTES...</p>}
          {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}
          {!isLoading && !error && messages.length === 0 && <p className="admin-feedback">No notes yet. New messages will appear here.</p>}
          <section className="admin-message-list" aria-label="Contact messages">
            {messages.map((message) => (
              <article className={`admin-inbox-message${message.status === 'unread' ? ' is-unread' : ''}`} key={message.id}>
                <div className="admin-inbox-message-heading"><h2>{message.message.length > 42 ? `${message.message.slice(0, 42)}...` : message.message}</h2><span className="admin-message-status">{message.status === 'unread' ? 'NEW' : 'READ'}</span></div>
                <p>From {message.name} · <a href={`mailto:${message.email}`}>{message.email}</a></p>
                <div className="admin-inbox-message-footer"><span>{new Date(message.created_at).toLocaleString()}</span><button type="button" onClick={() => setSelectedMessage(message)}>OPEN →</button></div>
              </article>
            ))}
          </section>
        </div>
      </main>
      {selectedMessage && <AdminMessageOverlay message={selectedMessage} onClose={() => setSelectedMessage(null)} onMarkAsRead={() => markAsRead(selectedMessage)} />}
    </div>
  )
}

export default AdminInboxPage
