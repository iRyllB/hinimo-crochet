export type SiteRoute = 'main' | 'admin-login' | 'admin-dashboard' | 'listings'

export class SiteRouter {
  resolve(pathname: string): SiteRoute {
    const path = pathname.toLowerCase()
    if (path.startsWith('/admin/dashboard')) return 'admin-dashboard'
    if (path.startsWith('/admin/login') || path === '/admin') return 'admin-login'
    if (path.startsWith('/listings')) return 'listings'
    return 'main'
  }
}

const ADMIN_SESSION_KEY = 'hinimo-admin-session'

export class AdminAccessPolicy {
  canAccess(): boolean {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active'
  }

  signIn(email: string, password: string): boolean {
    // Temporary client-side credentials will be replaced by an API/database check.
    const isValid = email.trim().toLowerCase() === 'admin@hinimo.com' && password === 'hinimo-admin'
    if (isValid) sessionStorage.setItem(ADMIN_SESSION_KEY, 'active')
    return isValid
  }

  signOut(): void {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
  }
}
