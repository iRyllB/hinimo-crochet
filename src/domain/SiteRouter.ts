export type SiteRoute = 'main' | 'admin-login' | 'admin-dashboard' | 'admin-inbox' | 'listings'

export class SiteRouter {
  resolve(pathname: string): SiteRoute {
    const path = pathname.toLowerCase()
    if (path.startsWith('/admin/dashboard')) return 'admin-dashboard'
    if (path.startsWith('/admin/inbox')) return 'admin-inbox'
    if (path.startsWith('/admin/login') || path === '/admin') return 'admin-login'
    if (path.startsWith('/listings')) return 'listings'
    return 'main'
  }
}

export class AdminAccessPolicy {
  async canAccess(): Promise<boolean> {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return Boolean(data.session)
  }

  async signIn(email: string, password: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    return !error
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}
import { supabase } from '../lib/supabase'
