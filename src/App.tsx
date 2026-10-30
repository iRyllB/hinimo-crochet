import './App.css'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminInboxPage from './pages/AdminInboxPage'
import AdminProductsPage from './pages/AdminProductsPage'
import ListingsPage from './pages/ListingsPage'
import MainPage from './pages/MainPage'
import { SiteRouter } from './domain/SiteRouter'

function App() {
  const route = new SiteRouter().resolve(window.location.pathname)
  if (route === 'listings') return <ListingsPage />
  if (route === 'admin-login') return <AdminLoginPage />
  if (route === 'admin-inbox') return <AdminInboxPage />
  if (route === 'admin-products') return <AdminProductsPage />
  return route === 'admin-dashboard' ? <AdminPage /> : <MainPage />
}

export default App
