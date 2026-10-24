export type SiteRoute = 'main' | 'admin'

export class SiteRouter {
  resolve(pathname: string): SiteRoute {
    return pathname.toLowerCase().startsWith('/admin') ? 'admin' : 'main'
  }
}

export class AdminAccessPolicy {
  canAccess(): boolean {
    return false
  }
}
