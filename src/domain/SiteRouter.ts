export type SiteRoute = 'main' | 'admin' | 'listings'

export class SiteRouter {
  resolve(pathname: string): SiteRoute {
    const path = pathname.toLowerCase()
    if (path.startsWith('/admin')) return 'admin'
    if (path.startsWith('/listings')) return 'listings'
    return 'main'
  }
}

export class AdminAccessPolicy {
  canAccess(): boolean {
    return false
  }
}
