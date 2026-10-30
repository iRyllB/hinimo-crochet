import hinimoHeader from '../assets/hinimo header.png'

type AdminSidebarProps = {
  activeMenu: string
  onSignOut: () => void
  unreadMessageCount: number
}

type MenuItem = {
  label: string
  icon: string
  badge?: string
  href?: string
}

const menuGroups: { label: string; items: MenuItem[] }[] = [
  {
    label: 'Sell',
    items: [
      { label: 'Products', icon: '▣' },
      { label: 'Orders', icon: '▰', badge: '3' },
      { label: 'Promotions', icon: '⊠' },
    ],
  },
  {
    label: 'Make & teach',
    items: [
      { label: 'Product catalog', icon: '✦', href: '/admin/products' },
      { label: 'Inventory', icon: '♟', badge: '5' },
      { label: 'Maker time', icon: '◔' },
    ],
  },
  {
    label: 'Community',
    items: [{ label: 'Contact inbox', icon: '▱', badge: '4', href: '/admin/inbox' }],
  },
  {
    label: 'Studio',
    items: [
      { label: 'Worth calculator', icon: '▤' },
      { label: 'Reports', icon: '⌁' },
      { label: 'Settings', icon: '⚙' },
    ],
  },
]

function AdminSidebar({ activeMenu, onSignOut, unreadMessageCount }: AdminSidebarProps) {
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
        {menuGroups.map((group) => (
          <div className="admin-menu-group" key={group.label}>
            <p>{group.label}</p>
            {group.items.map((item) => (
              item.href
                ? <a className={`admin-menu-item${activeMenu === item.label ? ' is-active' : ''}`} href={item.href} key={item.label}>
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                    {item.label === 'Contact inbox'
                      ? unreadMessageCount > 0 && <b>{unreadMessageCount}</b>
                      : item.badge && <b>{item.badge}</b>}
                  </a>
                : <button className="admin-menu-item" type="button" key={item.label} onClick={() => undefined}>
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                    {item.badge && <b>{item.badge}</b>}
                  </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-profile">
        <div className="admin-avatar">H</div>
        <div>
          <strong>Ms. Missy</strong>
          <span>Owner</span>
        </div>
        <button type="button" onClick={onSignOut} aria-label="Sign out">⋮</button>
      </div>
    </aside>
  )
}

export default AdminSidebar
