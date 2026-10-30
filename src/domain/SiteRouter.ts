export type SiteRoute = 'main' | 'admin-login' | 'admin-dashboard' | 'admin-inbox' | 'admin-products' | 'listings'

export class SiteRouter {
  resolve(pathname: string): SiteRoute {
    const path = pathname.toLowerCase()
    if (path.startsWith('/admin/dashboard')) return 'admin-dashboard'
    if (path.startsWith('/admin/inbox')) return 'admin-inbox'
    if (path.startsWith('/admin/products')) return 'admin-products'
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

  async signIn(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) return { success: false, message: error.message }
    return { success: true }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}
import { supabase } from '../lib/supabase'
