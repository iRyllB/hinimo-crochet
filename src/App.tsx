import './App.css'
import AdminPage from './pages/AdminPage'
import MainPage from './pages/MainPage'
import { SiteRouter } from './domain/SiteRouter'

function App() {
  const route = new SiteRouter().resolve(window.location.pathname)
  return route === 'admin' ? <AdminPage /> : <MainPage />
}

export default App
