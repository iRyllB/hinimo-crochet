import './App.css'
import AdminPage from './pages/AdminPage'
import ListingsPage from './pages/ListingsPage'
import MainPage from './pages/MainPage'
import { SiteRouter } from './domain/SiteRouter'

function App() {
  const route = new SiteRouter().resolve(window.location.pathname)
  if (route === 'listings') return <ListingsPage />
  return route === 'admin' ? <AdminPage /> : <MainPage />
}

export default App
