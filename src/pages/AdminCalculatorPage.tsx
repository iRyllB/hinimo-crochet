import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { AdminAccessPolicy } from '../domain/SiteRouter'
import { getContactMessages } from '../lib/supabase'

const accessPolicy = new AdminAccessPolicy()
const savedProjectsKey = 'hinimo-worth-calculator-projects-v2'

type CalculatorForm = {
  projectName: string
  yarnCost: number
  yarnUsed: number
  stuffingCost: number
  accessoriesCost: number
  packagingCost: number
  hours: number
  minutes: number
  laborRate: number
  difficulty: number
  overhead: number
  profitMargin: number
  marketplaceFee: number
}

type Calculation = {
  materials: number
  labor: number
  overhead: number
  profit: number
  netPrice: number
  platformFee: number
  finalPrice: number
}

type SavedProject = CalculatorForm & {
  id: string
  finalPrice: number
  savedAt: string
}

const defaultForm: CalculatorForm = {
  projectName: 'New crochet project',
  yarnCost: 0,
  yarnUsed: 0,
  stuffingCost: 0,
  accessoriesCost: 0,
  packagingCost: 0,
  hours: 0,
  minutes: 0,
  laborRate: 120,
  difficulty: 1,
  overhead: 5,
  profitMargin: 25,
  marketplaceFee: 6.5,
}

const money = (value: number) => `₱${value.toFixed(2)}`

function readSavedProjects(): SavedProject[] {
  try {
    const saved = window.localStorage.getItem(savedProjectsKey)
    if (!saved) return []
    const projects = JSON.parse(saved) as SavedProject[]
    return Array.isArray(projects) ? projects : []
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

  const calculation = useMemo<Calculation>(() => {
    const materials = form.yarnCost + form.stuffingCost + form.accessoriesCost + form.packagingCost
    const labor = (form.hours + form.minutes / 60) * form.laborRate * form.difficulty
    const directCost = materials + labor
    const productionSubtotal = directCost / (1 - form.overhead / 100)
    const overhead = productionSubtotal - directCost
    const profit = directCost * (form.profitMargin / 100)
    const netPrice = productionSubtotal + profit
    const feeRate = Math.min(Math.max(form.marketplaceFee, 0), 99.99) / 100
    const finalPrice = netPrice / (1 - feeRate)

    return { materials, labor, overhead, profit, netPrice, platformFee: finalPrice - netPrice, finalPrice }
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
      finalPrice: calculation.finalPrice,
      savedAt: new Date().toISOString(),
    }
    saveProjects([project, ...projects].slice(0, 8))
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
            <div><p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> KNOW YOUR WORTH</p><h1>WORTH<br /><em>CALCULATOR.</em></h1></div>
          </div>
          <div className="admin-calculator-grid">
            <section className="admin-calculator-panel">
              <div className="admin-calculator-panel-heading"><span>PROJECT INPUTS</span><p>Price your crochet work fairly.</p></div>
              <label>PROJECT NAME<input value={form.projectName} onChange={(event) => updateForm('projectName', event.target.value)} /></label>
              <div className="admin-calculator-section-label">MATERIALS</div>
              <div className="admin-calculator-field-row">
                <label>YARN COST (PHP)<input type="number" min="0" step="0.01" value={form.yarnCost} onChange={(event) => updateForm('yarnCost', Number(event.target.value))} /></label>
                <label>YARN USED (G / SKEINS)<input type="number" min="0" step="0.01" value={form.yarnUsed} onChange={(event) => updateForm('yarnUsed', Number(event.target.value))} /></label>
              </div>
              <div className="admin-calculator-field-row">
                <label>STUFFING / POLYFILL<input type="number" min="0" step="0.01" value={form.stuffingCost} onChange={(event) => updateForm('stuffingCost', Number(event.target.value))} /></label>
                <label>ACCESSORIES<input type="number" min="0" step="0.01" value={form.accessoriesCost} onChange={(event) => updateForm('accessoriesCost', Number(event.target.value))} /></label>
              </div>
              <label>PACKAGING COST (PHP)<input type="number" min="0" step="0.01" value={form.packagingCost} onChange={(event) => updateForm('packagingCost', Number(event.target.value))} /></label>
              <div className="admin-calculator-section-label">LABOR & RULES</div>
              <div className="admin-calculator-field-row">
                <label>HOURS<input type="number" min="0" step="1" value={form.hours} onChange={(event) => updateForm('hours', Number(event.target.value))} /></label>
                <label>MINUTES (0–59)<input type="number" min="0" max="59" step="1" value={form.minutes} onChange={(event) => updateForm('minutes', Number(event.target.value))} /></label>
              </div>
              <div className="admin-calculator-field-row">
                <label>RATE / HOUR (PHP)<input type="number" min="0" step="1" value={form.laborRate} onChange={(event) => updateForm('laborRate', Number(event.target.value))} /></label>
                <label>DIFFICULTY MULTIPLIER<input type="number" min="0.1" step="0.05" value={form.difficulty} onChange={(event) => updateForm('difficulty', Number(event.target.value))} /></label>
              </div>
              <div className="admin-calculator-field-row">
                <label>OVERHEAD %<input type="number" min="0" max="99" step="0.1" value={form.overhead} onChange={(event) => updateForm('overhead', Number(event.target.value))} /></label>
                <label>PROFIT MARGIN %<input type="number" min="0" step="0.1" value={form.profitMargin} onChange={(event) => updateForm('profitMargin', Number(event.target.value))} /></label>
              </div>
              <label>MARKETPLACE FEE %<input type="number" min="0" max="99.99" step="0.1" value={form.marketplaceFee} onChange={(event) => updateForm('marketplaceFee', Number(event.target.value))} /></label>
              <button className="admin-login-submit" type="button" onClick={saveProject}>SAVE PROJECT <span>→</span></button>
            </section>
            <section className="admin-calculator-panel admin-saved-projects">
              <div className="admin-calculator-panel-heading"><span><i /> SAVED PROJECTS<h2>RECENT QUOTES</h2></span><small>{projects.length} saved</small></div>
              {projects.length === 0 && <p className="admin-calculator-empty">Saved projects will appear here.</p>}
              {projects.map((project) => (
                <button className="admin-saved-project" type="button" key={project.id} onClick={() => setForm(project)}>
                  <span><strong>{project.projectName}</strong><small>{project.hours}h {project.minutes}m · {project.yarnUsed}g yarn</small></span>
                  <b>{money(project.finalPrice)}</b>
                  <small>OPEN →</small>
                </button>
              ))}
            </section>
          </div>
          <section className="admin-calculator-summary" aria-label="Worth calculation summary">
            <div><span>MATERIALS</span><strong>{money(calculation.materials)}</strong></div>
            <div><span>LABOR</span><strong>{money(calculation.labor)}</strong></div>
            <div><span>OVERHEAD</span><strong>{money(calculation.overhead)}</strong></div>
            <div><span>NET PROFIT</span><strong className="admin-calculator-profit">{money(calculation.profit)}</strong></div>
            <div><span>PLATFORM FEES</span><strong>{money(calculation.platformFee)}</strong></div>
            <div className="admin-calculator-final-price"><span>FINAL SUGGESTED PRICE</span><strong>{money(calculation.finalPrice)}</strong></div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminCalculatorPage
