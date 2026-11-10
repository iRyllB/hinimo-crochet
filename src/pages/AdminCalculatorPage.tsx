import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { AdminAccessPolicy } from '../domain/SiteRouter'
import { getContactMessages } from '../lib/supabase'
import AdminModal from '../components/AdminModal'
import FeedbackToast from '../components/FeedbackToast'
import { savedProjectsKey, archivedProjectsKey, type CalculatorForm, type SavedProject, readArchivedProjects, readSavedProjects, readArchivedProjectsUnreadCount, writeArchivedProjectsUnreadCount, writeProjects } from '../lib/projects'

const accessPolicy = new AdminAccessPolicy()
type Calculation = {
  materials: number
  labor: number
  overhead: number
  profit: number
  netPrice: number
  platformFee: number
  finalPrice: number
}

const defaultForm: CalculatorForm = {
  projectName: 'New crochet project',
  clientName: '',
  clientEmail: '',
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

function calculateWorth(form: CalculatorForm): Calculation {
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
}

function AdminCalculatorPage() {
  const [form, setForm] = useState<CalculatorForm>(defaultForm)
  const [projects, setProjects] = useState<SavedProject[]>(readSavedProjects)
  const [archivedProjectCount, setArchivedProjectCount] = useState(readArchivedProjectsUnreadCount)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null)
  const [editingProject, setEditingProject] = useState<SavedProject | null>(null)
  const [pendingEditProject, setPendingEditProject] = useState<SavedProject | null>(null)
  const [pendingAction, setPendingAction] = useState<'save' | 'edit' | 'delete' | 'done' | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(timeout)
  }, [toast])

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

  const calculation = useMemo(() => calculateWorth(form), [form])

  const updateForm = <K extends keyof CalculatorForm>(field: K, value: CalculatorForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const saveProjects = (nextProjects: SavedProject[]) => {
    setProjects(nextProjects)
    writeProjects(savedProjectsKey, nextProjects)
  }

  const notifyError = (message: string) => {
    setToast({ type: 'error', message })
  }

  const hasRequiredMaterials = (project: CalculatorForm) => (
    project.yarnCost > 0
    && project.yarnUsed > 0
    && project.stuffingCost > 0
    && project.accessoriesCost > 0
    && project.packagingCost > 0
  )

  const saveProject = () => {
    const projectName = form.projectName.trim()
    if (!projectName) {
      notifyError('Project name is required.')
      setPendingAction(null)
      return
    }
    if (!hasRequiredMaterials(form)) {
      notifyError('Enter a value greater than zero for every required material field.')
      setPendingAction(null)
      return
    }
    if ([...projects, ...readArchivedProjects()].some((project) => project.projectName.trim().toLowerCase() === projectName.toLowerCase())) {
      notifyError('A project with this name already exists.')
      setPendingAction(null)
      return
    }
    const project: SavedProject = {
      ...form,
      projectName,
      id: crypto.randomUUID(),
      finalPrice: calculation.finalPrice,
      savedAt: new Date().toISOString(),
    }
    saveProjects([project, ...projects].slice(0, 8))
    setPendingAction(null)
    setToast({ type: 'success', message: 'Project saved successfully.' })
  }

  const updateSavedProject = () => {
    if (!pendingEditProject) return
    const projectName = pendingEditProject.projectName.trim()
    if (!projectName) {
      notifyError('Project name is required.')
      setPendingAction(null)
      return
    }
    if (!hasRequiredMaterials(pendingEditProject)) {
      notifyError('Enter a value greater than zero for every required material field.')
      setPendingAction(null)
      return
    }
    if ([...projects, ...readArchivedProjects()].some((project) => project.id !== pendingEditProject.id && project.projectName.trim().toLowerCase() === projectName.toLowerCase())) {
      notifyError('A project with this name already exists.')
      setPendingAction(null)
      return
    }
    const updatedProject = { ...pendingEditProject, projectName, finalPrice: calculateWorth(pendingEditProject).finalPrice, savedAt: new Date().toISOString() }
    saveProjects(projects.map((project) => project.id === updatedProject.id ? updatedProject : project))
    setForm(updatedProject)
    setEditingProject(null)
    setPendingEditProject(null)
    setPendingAction(null)
    setToast({ type: 'success', message: 'Project updated successfully.' })
  }

  const deleteProject = () => {
    if (!selectedProject) return
    saveProjects(projects.filter((project) => project.id !== selectedProject.id))
    setSelectedProject(null)
    setPendingAction(null)
    setToast({ type: 'success', message: 'Project deleted successfully.' })
  }

  const completeProject = () => {
    if (!selectedProject) return
    const archivedProjects = (() => {
      try {
        const saved = window.localStorage.getItem(archivedProjectsKey)
        return saved ? JSON.parse(saved) as SavedProject[] : []
      } catch {
        return []
      }
    })()
    writeProjects(archivedProjectsKey, [{ ...selectedProject, savedAt: new Date().toISOString() }, ...archivedProjects])
    const nextUnreadCount = readArchivedProjectsUnreadCount() + 1
    writeArchivedProjectsUnreadCount(nextUnreadCount)
    setArchivedProjectCount(nextUnreadCount)
    saveProjects(projects.filter((project) => project.id !== selectedProject.id))
    setSelectedProject(null)
    setPendingAction(null)
    setToast({ type: 'success', message: 'Project added to Archive' })
  }

  const handleSignOut = async () => {
    await accessPolicy.signOut()
    window.location.href = '/admin/login'
  }

  if (isCheckingAccess || !isAuthorized) return null

  return (
    <div className="admin-layout">
      <AdminSidebar activeMenu="Worth calculator" onSignOut={handleSignOut} unreadMessageCount={unreadMessageCount} archivedProjectCount={archivedProjectCount} />
      <main className="admin-main">
        <div className="admin-content admin-calculator-content">
          <div className="admin-heading-row">
            <div><p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> KNOW YOUR WORTH</p><h1>WORTH<br /><em>CALCULATOR.</em></h1></div>
          </div>
          <div className="admin-calculator-grid">
            <section className="admin-calculator-panel">
              <div className="admin-calculator-panel-heading"><span>PROJECT INPUTS</span><p>Price your crochet work fairly.</p></div>
              <label>PROJECT NAME <span className="admin-required-mark">*</span><input required value={form.projectName} onChange={(event) => updateForm('projectName', event.target.value)} /></label>
              <div className="admin-calculator-field-row">
                <label>CLIENT NAME <span className="admin-optional-mark">(Optional)</span><input value={form.clientName} onChange={(event) => updateForm('clientName', event.target.value)} /></label>
                <label>CLIENT EMAIL <span className="admin-optional-mark">(Optional)</span><input type="email" value={form.clientEmail} onChange={(event) => updateForm('clientEmail', event.target.value)} /></label>
              </div>
              <div className="admin-calculator-section-label">MATERIALS</div>
              <div className="admin-calculator-field-row">
                <label>YARN COST (PHP) <span className="admin-required-mark">*</span><input required type="number" min="0.01" step="0.01" value={form.yarnCost} onChange={(event) => updateForm('yarnCost', Number(event.target.value))} /></label>
                <label>YARN USED (G / SKEINS) <span className="admin-required-mark">*</span><input required type="number" min="0.01" step="0.01" value={form.yarnUsed} onChange={(event) => updateForm('yarnUsed', Number(event.target.value))} /></label>
              </div>
              <div className="admin-calculator-field-row">
                <label>STUFFING / POLYFILL <span className="admin-required-mark">*</span><input required type="number" min="0.01" step="0.01" value={form.stuffingCost} onChange={(event) => updateForm('stuffingCost', Number(event.target.value))} /></label>
                <label>ACCESSORIES <span className="admin-required-mark">*</span><input required type="number" min="0.01" step="0.01" value={form.accessoriesCost} onChange={(event) => updateForm('accessoriesCost', Number(event.target.value))} /></label>
              </div>
              <label>PACKAGING COST (PHP) <span className="admin-required-mark">*</span><input required type="number" min="0.01" step="0.01" value={form.packagingCost} onChange={(event) => updateForm('packagingCost', Number(event.target.value))} /></label>
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
              <button className="admin-login-submit" type="button" onClick={() => setPendingAction('save')}>SAVE PROJECT <span>→</span></button>
            </section>
            <section className="admin-calculator-panel admin-saved-projects">
              <div className="admin-calculator-panel-heading"><span><i /> SAVED PROJECTS</span><small>{projects.length} saved</small></div>
              {projects.length === 0 && <p className="admin-calculator-empty">Saved projects will appear here.</p>}
              {projects.map((project) => (
                <div className="admin-saved-project" key={project.id}>
                  <span><strong>{project.projectName}</strong><small>{project.hours}h {project.minutes}m · {project.yarnUsed}g yarn</small></span>
                  <b>{money(project.finalPrice)}</b>
                  <button className="admin-saved-project-open" type="button" onClick={() => setSelectedProject(project)}>OPEN PROJECT <span>→</span></button>
                </div>
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
      {toast && <FeedbackToast type={toast.type} message={toast.message} />}
      {selectedProject && (
        <AdminModal title={selectedProject.projectName} eyebrow="SAVED PROJECT" onClose={() => setSelectedProject(null)}>
            <div className="admin-message-dialog-heading"><strong className="admin-project-dialog-price">{money(selectedProject.finalPrice)}</strong></div>
            {(selectedProject.clientName || selectedProject.clientEmail) && <p className="admin-project-client">{selectedProject.clientName || 'Client'}{selectedProject.clientEmail && ` · ${selectedProject.clientEmail}`}</p>}
            <div className="admin-project-detail-grid">
              <span><small>MATERIALS</small><b>{money(calculateWorth(selectedProject).materials)}</b></span>
              <span><small>LABOR</small><b>{money(calculateWorth(selectedProject).labor)}</b></span>
              <span><small>OVERHEAD</small><b>{money(calculateWorth(selectedProject).overhead)}</b></span>
              <span><small>NET PROFIT</small><b>{money(calculateWorth(selectedProject).profit)}</b></span>
              <span><small>PLATFORM FEES</small><b>{money(calculateWorth(selectedProject).platformFee)}</b></span>
              <span><small>TIME</small><b>{selectedProject.hours}h {selectedProject.minutes}m</b></span>
            </div>
            <div className="admin-project-dialog-actions">
              <button className="admin-login-submit" type="button" onClick={() => { setEditingProject({ ...defaultForm, ...selectedProject }); setSelectedProject(null) }}>EDIT PROJECT <span>→</span></button>
              <div className="admin-project-status-actions">
                <button className="admin-project-danger-button" type="button" onClick={() => setPendingAction('delete')}>DELETE</button>
                <button className="admin-project-done-button" type="button" onClick={() => setPendingAction('done')}>DONE</button>
              </div>
            </div>
        </AdminModal>
      )}
      {pendingAction && (
        <AdminModal title={pendingAction === 'save' ? 'Save this project?' : pendingAction === 'edit' ? 'Save your changes?' : pendingAction === 'delete' ? 'Delete this project?' : 'Mark project as done?'} eyebrow="CONFIRM ACTION" onClose={() => setPendingAction(null)}>
          <p className="admin-modal-copy">
            {pendingAction === 'save' && 'This quotation will be added to your saved projects.'}
            {pendingAction === 'edit' && 'The saved project will be updated with the values from the edit form.'}
            {pendingAction === 'delete' && 'This project will be permanently removed from your saved projects.'}
            {pendingAction === 'done' && 'This project will move to Project Archives.'}
          </p>
          <div className="admin-modal-actions">
            <button className={`admin-login-submit${pendingAction === 'delete' ? ' admin-project-danger-button' : ''}`} type="button" onClick={pendingAction === 'save' ? saveProject : pendingAction === 'edit' ? updateSavedProject : pendingAction === 'delete' ? deleteProject : completeProject}>CONFIRM <span>→</span></button>
            <button className="admin-message-read-button" type="button" onClick={() => setPendingAction(null)}>CANCEL</button>
          </div>
        </AdminModal>
      )}
      {editingProject && !pendingAction && (
        <AdminModal title="Edit project" eyebrow="PROJECT INPUTS" onClose={() => setEditingProject(null)}>
          <div className="admin-modal-form">
            <label>PROJECT NAME<input value={editingProject.projectName} onChange={(event) => setEditingProject({ ...editingProject, projectName: event.target.value })} /></label>
            <div className="admin-calculator-field-row">
              <label>CLIENT NAME<input value={editingProject.clientName} onChange={(event) => setEditingProject({ ...editingProject, clientName: event.target.value })} /></label>
              <label>CLIENT EMAIL<input type="email" value={editingProject.clientEmail} onChange={(event) => setEditingProject({ ...editingProject, clientEmail: event.target.value })} /></label>
            </div>
            <div className="admin-calculator-field-row">
              <label>YARN COST<input type="number" min="0" value={editingProject.yarnCost} onChange={(event) => setEditingProject({ ...editingProject, yarnCost: Number(event.target.value) })} /></label>
              <label>YARN USED<input type="number" min="0" value={editingProject.yarnUsed} onChange={(event) => setEditingProject({ ...editingProject, yarnUsed: Number(event.target.value) })} /></label>
            </div>
            <div className="admin-calculator-field-row">
              <label>STUFFING<input type="number" min="0" value={editingProject.stuffingCost} onChange={(event) => setEditingProject({ ...editingProject, stuffingCost: Number(event.target.value) })} /></label>
              <label>ACCESSORIES<input type="number" min="0" value={editingProject.accessoriesCost} onChange={(event) => setEditingProject({ ...editingProject, accessoriesCost: Number(event.target.value) })} /></label>
            </div>
            <label>PACKAGING<input type="number" min="0" value={editingProject.packagingCost} onChange={(event) => setEditingProject({ ...editingProject, packagingCost: Number(event.target.value) })} /></label>
            <div className="admin-calculator-field-row">
              <label>HOURS<input type="number" min="0" value={editingProject.hours} onChange={(event) => setEditingProject({ ...editingProject, hours: Number(event.target.value) })} /></label>
              <label>MINUTES<input type="number" min="0" max="59" value={editingProject.minutes} onChange={(event) => setEditingProject({ ...editingProject, minutes: Number(event.target.value) })} /></label>
            </div>
            <div className="admin-calculator-field-row">
              <label>RATE / HOUR<input type="number" min="0" value={editingProject.laborRate} onChange={(event) => setEditingProject({ ...editingProject, laborRate: Number(event.target.value) })} /></label>
              <label>DIFFICULTY<input type="number" min="0.1" step="0.05" value={editingProject.difficulty} onChange={(event) => setEditingProject({ ...editingProject, difficulty: Number(event.target.value) })} /></label>
            </div>
            <div className="admin-calculator-field-row">
              <label>OVERHEAD %<input type="number" min="0" max="99" value={editingProject.overhead} onChange={(event) => setEditingProject({ ...editingProject, overhead: Number(event.target.value) })} /></label>
              <label>PROFIT MARGIN %<input type="number" min="0" value={editingProject.profitMargin} onChange={(event) => setEditingProject({ ...editingProject, profitMargin: Number(event.target.value) })} /></label>
            </div>
            <label>MARKETPLACE FEE %<input type="number" min="0" max="99.99" value={editingProject.marketplaceFee} onChange={(event) => setEditingProject({ ...editingProject, marketplaceFee: Number(event.target.value) })} /></label>
          </div>
          <button className="admin-login-submit" type="button" onClick={() => { setPendingEditProject(editingProject); setEditingProject(null); setPendingAction('edit') }}>REVIEW CHANGES <span>→</span></button>
        </AdminModal>
      )}
    </div>
  )
}

export default AdminCalculatorPage
