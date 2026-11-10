import hinimoHeader from '../assets/hinimo header.png'
import { readArchivedProjectsUnreadCount } from '../lib/projects'

type AdminSidebarProps = {
  activeMenu: string
  onSignOut: () => void
  unreadMessageCount: number
  archivedProjectCount?: number
}

const menuItems = [
  { label: 'Product catalog', icon: '✦', href: '/admin/products' },
  { label: 'Contact inbox', icon: '▱', href: '/admin/inbox' },
  { label: 'Worth calculator', icon: '▤', href: '/admin/calculator' },
  { label: 'Project archives', icon: '▥', href: '/admin/archives' },
]

function AdminSidebar({ activeMenu, onSignOut, unreadMessageCount, archivedProjectCount }: AdminSidebarProps) {
  const archiveNotificationCount = archivedProjectCount ?? readArchivedProjectsUnreadCount()

  return (
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/admin/dashboard" aria-label="Hinimo admin dashboard">
        <img src={hinimoHeader} alt="Hinimo Crochet" />
        <span>ADMIN</span>
      </a>
      <nav className="admin-menu" aria-label="Admin menu">
        <a className={`admin-menu-item admin-menu-dashboard${activeMenu === 'Dashboard' ? ' is-active' : ''}`} href="/admin/dashboard">
          <span aria-hidden="true">✦</span> Dashboard
        </a>
        <div className="admin-menu-group">
          <p>Workspace</p>
          {menuItems.map((item) => (
            <a className={`admin-menu-item${activeMenu === item.label ? ' is-active' : ''}`} href={item.href} key={item.label}>
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
              {item.label === 'Contact inbox' && unreadMessageCount > 0 && <b>{unreadMessageCount}</b>}
              {item.label === 'Project archives' && archiveNotificationCount > 0 && <b>{archiveNotificationCount}</b>}
            </a>
          ))}
        </div>
      </nav>
      <button className="admin-sidebar-logout" type="button" onClick={onSignOut}>LOG OUT</button>
    </aside>
  )
}

export default AdminSidebar
