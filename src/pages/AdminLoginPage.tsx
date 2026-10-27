import { useState } from 'react'
import type { FormEvent } from 'react'
import { AdminAccessPolicy } from '../domain/SiteRouter'
import hinimoHeader from '../assets/hinimo header.png'

function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const accessPolicy = new AdminAccessPolicy()
    if (!accessPolicy.signIn(email, password)) {
      setError('That email or password does not match. Please try again.')
      return
    }
    window.location.href = '/admin/dashboard'
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <a className="admin-login-brand" href="/" aria-label="Return to Hinimo Crochet">
          <img src={hinimoHeader} alt="Hinimo Crochet" />
          <span>ADMIN</span>
        </a>
        <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> PRIVATE WORKSPACE</p>
        <h1 id="admin-login-title">WELCOME<br /><em>BACK.</em></h1>
        <p className="admin-login-intro">Sign in to manage your handmade shop, orders, and creative studio.</p>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">EMAIL ADDRESS</label>
          <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="admin-password">PASSWORD</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button className="admin-login-submit" type="submit">ENTER DASHBOARD <span aria-hidden="true">→</span></button>
        </form>
        <a className="admin-back-link" href="/">← Back to Hinimo Crochet</a>
      </section>
    </main>
  )
}

export default AdminLoginPage
