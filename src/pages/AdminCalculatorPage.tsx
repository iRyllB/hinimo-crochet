import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { AdminAccessPolicy } from '../domain/SiteRouter'
import { getContactMessages } from '../lib/supabase'

const accessPolicy = new AdminAccessPolicy()
const savedProjectsKey = 'hinimo-worth-calculator-projects'

type CalculatorForm = {
  projectName: string
  currency: string
  materials: number
  hours: number
  minutes: number
  laborRate: number
  overhead: number
  markup: number
  marketplaceFee: number
}

type SavedProject = CalculatorForm & {
  id: string
  total: number
  createdAt: string
}

const defaultForm: CalculatorForm = {
  projectName: 'New crochet project',
  currency: 'PHP',
  materials: 0,
  hours: 0,
  minutes: 0,
  laborRate: 120,
  overhead: 8,
  markup: 20,
  marketplaceFee: 6.5,
}

const money = (value: number, currency: string) => `${currency === 'PHP' ? '₱' : '$'}${value.toFixed(2)}`

function readSavedProjects(): SavedProject[] {
  try {
    const saved = window.localStorage.getItem(savedProjectsKey)
    return saved ? JSON.parse(saved) as SavedProject[] : []
  } catch {
    return []
  }
}

function AdminCalculatorPage() {
  const [form, setForm] = useState<CalculatorForm>(defaultForm)
  const [projects, setProjects] = useState<SavedProject[]>(readSavedProjects)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)

  useEffect(() => {
    accessPolicy.canAccess().then((authorized) => {
      if (!authorized) {
        window.location.href = '/admin/login'
        return
      }
      setIsAuthorized(true)
      return getContactMessages().then((messages) => setUnreadMessageCount(messages.filter((message) => message.status === 'unread').length))
    }).catch(() => {
      window.location.href = '/admin/login'
    }).finally(() => setIsCheckingAccess(false))
  }, [])

  const calculation = useMemo(() => {
    const labor = (form.hours + form.minutes / 60) * form.laborRate
    const directCost = form.materials + labor
    const overhead = directCost * (form.overhead / 100)
    const markedCost = directCost + overhead
    const markup = markedCost * (form.markup / 100)
    const beforeFee = markedCost + markup
    const marketplaceFee = beforeFee * (form.marketplaceFee / 100)
    return {
      labor,
      overhead,
      markup,
      marketplaceFee,
      total: beforeFee + marketplaceFee,
      profit: markup - marketplaceFee,
    }
  }, [form])

  const updateForm = <K extends keyof CalculatorForm>(field: K, value: CalculatorForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const saveProjects = (nextProjects: SavedProject[]) => {
    setProjects(nextProjects)
    window.localStorage.setItem(savedProjectsKey, JSON.stringify(nextProjects))
  }

  const saveProject = () => {
    const project: SavedProject = {
      ...form,
      id: crypto.randomUUID(),
      total: calculation.total,
      createdAt: new Date().toISOString(),
    }
    saveProjects([project, ...projects].slice(0, 8))
  }

  const duplicateProject = (project: SavedProject) => {
    setForm({ ...project, projectName: `${project.projectName} copy` })
  }

  const handleSignOut = async () => {
    await accessPolicy.signOut()
    window.location.href = '/admin/login'
  }

  if (isCheckingAccess || !isAuthorized) return null

  return (
    <div className="admin-layout">
      <AdminSidebar activeMenu="Worth calculator" onSignOut={handleSignOut} unreadMessageCount={unreadMessageCount} />
      <main className="admin-main">
        <div className="admin-calculator-topbar">Worth Calculator <span>⌕ Search anything... <b>↗</b></span></div>
        <div className="admin-content admin-calculator-content">
          <div className="admin-heading-row">
            <div><p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> THE PRICE IS RIGHT</p><h1>WORTH<br /><em>CALCULATOR.</em></h1></div>
            <button className="admin-add-button" type="button" onClick={() => setForm(defaultForm)}>+ NEW QUOTATION</button>
          </div>
          <div className="admin-calculator-grid">
            <section className="admin-calculator-panel">
              <div className="admin-calculator-panel-heading"><span>DEFAULT PRICE RULES</span><p>Set the numbers you want to use for this quote.</p></div>
              <label>PROJECT NAME<input value={form.projectName} onChange={(event) => updateForm('projectName', event.target.value)} /></label>
              <label>CURRENCY<select value={form.currency} onChange={(event) => updateForm('currency', event.target.value)}><option value="PHP">PHP (₱)</option><option value="USD">USD ($)</option></select></label>
              <label>MATERIALS<input type="number" min="0" step="0.01" value={form.materials} onChange={(event) => updateForm('materials', Number(event.target.value))} /></label>
              <div className="admin-calculator-field-row">
                <label>HOURS<input type="number" min="0" value={form.hours} onChange={(event) => updateForm('hours', Number(event.target.value))} /></label>
                <label>MINUTES<input type="number" min="0" max="59" value={form.minutes} onChange={(event) => updateForm('minutes', Number(event.target.value))} /></label>
              </div>
              <label>LABOR RATE / HOUR<input type="number" min="0" step="0.01" value={form.laborRate} onChange={(event) => updateForm('laborRate', Number(event.target.value))} /></label>
              <div className="admin-calculator-field-row">
                <label>OVERHEAD %<input type="number" min="0" step="0.1" value={form.overhead} onChange={(event) => updateForm('overhead', Number(event.target.value))} /></label>
                <label>MARKUP %<input type="number" min="0" step="0.1" value={form.markup} onChange={(event) => updateForm('markup', Number(event.target.value))} /></label>
              </div>
              <label>MARKETPLACE FEE %<input type="number" min="0" step="0.1" value={form.marketplaceFee} onChange={(event) => updateForm('marketplaceFee', Number(event.target.value))} /></label>
              <button className="admin-login-submit" type="button" onClick={saveProject}>SAVE QUOTATION <span>→</span></button>
            </section>
            <section className="admin-calculator-panel admin-saved-projects">
              <div className="admin-calculator-panel-heading"><span><i /> SAVED PROJECTS<h2>RECENT QUOTES</h2></span><small>{projects.length} saved</small></div>
              {projects.length === 0 && <p className="admin-calculator-empty">Saved quotations will appear here.</p>}
              {projects.map((project) => <div className="admin-saved-project" key={project.id}><span><strong>{project.projectName}</strong><small>{project.hours}h {project.minutes}m · {project.currency}</small></span><b>{money(project.total, project.currency)}</b><button type="button" onClick={() => duplicateProject(project)}>DUPLICATE</button></div>)}
            </section>
          </div>
          <section className="admin-calculator-summary">
            <div><span>ESTIMATED PRICE</span><strong>{money(calculation.total, form.currency)}</strong></div>
            <div><span>ACTUAL TIME</span><strong>{form.hours}h {form.minutes}m</strong></div>
            <div><span>FINAL PROFIT</span><strong className="admin-calculator-profit">{money(calculation.profit, form.currency)}</strong></div>
            <div className="admin-calculator-breakdown"><small>Materials {money(form.materials, form.currency)}</small><small>Labor {money(calculation.labor, form.currency)}</small><small>Overhead {money(calculation.overhead, form.currency)}</small><small>Fees {money(calculation.marketplaceFee, form.currency)}</small></div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminCalculatorPage
