import { AdminAccessPolicy } from '../domain/SiteRouter'

function AdminPage() {
  const accessPolicy = new AdminAccessPolicy()

  if (!accessPolicy.canAccess()) {
    return (
      <main className="admin-gate">
        <div className="admin-gate-card">
          <span className="admin-lock" aria-hidden="true">✦</span>
          <p className="eyebrow">PRIVATE WORKSPACE</p>
          <h1>ADMIN ACCESS</h1>
          <p>This area is reserved for Hinimo administrators. Authentication will be connected here before dashboard features are added.</p>
          <a className="hero-button hero-button-secondary" href="/">RETURN TO HINIMO</a>
        </div>
      </main>
    )
  }

  return <main className="admin-dashboard"><h1>Hinimo Admin Dashboard</h1></main>
}

export default AdminPage
