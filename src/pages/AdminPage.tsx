import { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { AdminAccessPolicy } from '../domain/SiteRouter'
import { getContactMessages, getProducts, type ContactMessage } from '../lib/supabase'
import { readArchivedProjects, readSavedProjects, type SavedProject } from '../lib/projects'

const accessPolicy = new AdminAccessPolicy()

function AdminPage() {
  const [latestMessage, setLatestMessage] = useState<ContactMessage | null>(null)
  const [productCount, setProductCount] = useState(0)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [archivedProjectCount, setArchivedProjectCount] = useState(0)
  const [latestFinishedProject, setLatestFinishedProject] = useState<SavedProject | null>(null)
  const [currentProjects, setCurrentProjects] = useState<SavedProject[]>([])
  const [productNames, setProductNames] = useState<string[]>([])
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
        setProductNames(products.slice(0, 3).map((product) => product.name))
        setLatestMessage(messages[0] ?? null)
        setUnreadMessageCount(messages.filter((message) => message.status === 'unread').length)
        const archivedProjects = readArchivedProjects()
        setArchivedProjectCount(archivedProjects.length)
        setLatestFinishedProject(archivedProjects.sort((first, second) => new Date(second.savedAt).getTime() - new Date(first.savedAt).getTime())[0] ?? null)
        setCurrentProjects(readSavedProjects().slice(0, 3))
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
          <section className="admin-stat-grid admin-overview-grid" aria-label="Workspace overviews">
            <article className="admin-stat admin-overview-card admin-overview-products">
              <span>ADD MORE PRODUCTS</span><strong>{productCount}</strong><p>{productNames.length > 0 ? productNames.join(' · ') : 'Catalog is ready for its first listing.'}</p><a href="/admin/products">MANAGE CATALOG <span>→</span></a>
            </article>
            <article className="admin-stat admin-overview-card admin-overview-messages">
              <span>MESSAGE OVERVIEW</span><strong>{unreadMessageCount}</strong><p>{latestMessage ? `${latestMessage.name}: “${latestMessage.message.slice(0, 72)}${latestMessage.message.length > 72 ? '...' : ''}”` : 'No contact messages yet.'}</p><a href="/admin/inbox">OPEN INBOX <span>→</span></a>
            </article>
            <article className="admin-stat admin-overview-card admin-overview-current">
              <span>CURRENT PROJECTS</span><strong>{currentProjects.length}</strong><p>{currentProjects.length > 0 ? currentProjects.map((project) => project.projectName).join(' · ') : 'No projects are currently in progress.'}</p><a href="/admin/calculator">OPEN CALCULATOR <span>→</span></a>
            </article>
            <article className="admin-stat admin-overview-card admin-overview-finished">
              <span>LATEST FINISHED PROJECT</span><strong>{archivedProjectCount}</strong><p>{latestFinishedProject ? `${latestFinishedProject.projectName} · ₱${latestFinishedProject.finalPrice.toFixed(2)}` : 'Finished projects will appear here.'}</p><a href="/admin/archives">VIEW ARCHIVES <span>→</span></a>
            </article>
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
