import { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { AdminAccessPolicy } from '../domain/SiteRouter'
import { getContactMessages, getProducts, type ContactMessage } from '../lib/supabase'
import { readArchivedProjects } from '../lib/projects'

const accessPolicy = new AdminAccessPolicy()

function AdminPage() {
  const [latestMessage, setLatestMessage] = useState<ContactMessage | null>(null)
  const [productCount, setProductCount] = useState(0)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [archivedProjectCount, setArchivedProjectCount] = useState(0)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)

  useEffect(() => {
    accessPolicy.canAccess().then((authorized) => {
      if (!authorized) {
        window.location.href = '/admin/login'
        return
      }
      setIsAuthorized(true)
      return Promise.all([getProducts(), getContactMessages()]).then(([products, messages]) => {
        setProductCount(products.length)
        setLatestMessage(messages[0] ?? null)
        setUnreadMessageCount(messages.filter((message) => message.status === 'unread').length)
        setArchivedProjectCount(readArchivedProjects().length)
      })
    }).catch(() => {
      window.location.href = '/admin/login'
    }).finally(() => setIsCheckingAccess(false))
  }, [])

  if (isCheckingAccess || !isAuthorized) return null

  const handleSignOut = async () => {
    await accessPolicy.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="admin-layout">
      <AdminSidebar activeMenu="Dashboard" onSignOut={handleSignOut} unreadMessageCount={unreadMessageCount} />
      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-heading-row">
            <div><p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> YOUR WORKSPACE</p><h1>GOOD MORNING,<br /><em>MISSY!</em></h1></div>
          </div>
          <section className="admin-feature-grid" aria-label="Implemented workspace features">
            <a className="admin-feature-card admin-feature-card-orange" href="/admin/products">
              <span>CATALOG</span><strong>{productCount}</strong><p>Products available on your public shop.</p><b>MANAGE PRODUCTS →</b>
            </a>
            <a className="admin-feature-card admin-feature-card-pink" href="/admin/inbox">
              <span>CONTACT INBOX</span><strong>{unreadMessageCount}</strong><p>{unreadMessageCount === 1 ? 'note needs your reply.' : 'notes need your reply.'}</p><b>OPEN INBOX →</b>
            </a>
            <a className="admin-feature-card admin-feature-card-yellow" href="/admin/calculator">
              <span>WORTH CALCULATOR</span><strong>₱</strong><p>Price materials, time, labor, and fees fairly.</p><b>CALCULATE A PROJECT →</b>
            </a>
            <a className="admin-feature-card admin-feature-card-green" href="/admin/archives">
              <span>PROJECT ARCHIVES</span><strong>{archivedProjectCount}</strong><p>Completed projects saved for reference.</p><b>VIEW ARCHIVES →</b>
            </a>
          </section>
          <section className="admin-panel admin-dashboard-highlight">
            <div className="admin-panel-heading"><span><i /> LATEST NOTE</span><a href="/admin/inbox">OPEN INBOX →</a></div>
            <blockquote>{latestMessage ? `“${latestMessage.message}”` : 'No notes yet. New contact messages will appear here.'}</blockquote>
            <small>{latestMessage ? `— ${latestMessage.name}, received ${new Date(latestMessage.created_at).toLocaleString()}` : 'Your implemented workspace is ready to use.'}</small>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminPage
