import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import AdminModal from '../components/AdminModal'
import { AdminAccessPolicy } from '../domain/SiteRouter'
import { getContactMessages } from '../lib/supabase'
import { readArchivedProjects, type SavedProject } from '../lib/projects'

type ProjectSort = 'newest' | 'oldest'

function AdminArchivesPage() {
  const [projects, setProjects] = useState<SavedProject[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<ProjectSort>('newest')
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const accessPolicy = useMemo(() => new AdminAccessPolicy(), [])

  useEffect(() => {
    accessPolicy.canAccess().then((authorized) => {
      if (!authorized) {
        window.location.href = '/admin/login'
        return
      }
      setIsAuthorized(true)
      setProjects(readArchivedProjects())
      return getContactMessages().then((messages) => setUnreadMessageCount(messages.filter((message) => message.status === 'unread').length))
    }).catch(() => {
      window.location.href = '/admin/login'
    }).finally(() => setIsLoading(false))
  }, [accessPolicy])

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    return projects
      .filter((project) => !query || [project.projectName, project.clientName, project.clientEmail].some((value) => value.toLowerCase().includes(query)))
      .sort((first, second) => {
        const difference = new Date(first.savedAt).getTime() - new Date(second.savedAt).getTime()
        return sort === 'newest' ? -difference : difference
      })
  }, [projects, search, sort])

  const handleSignOut = async () => {
    await accessPolicy.signOut()
    window.location.href = '/admin/login'
  }

  if (isLoading || !isAuthorized) return null

  return (
    <div className="admin-layout">
      <AdminSidebar activeMenu="Project archives" onSignOut={handleSignOut} unreadMessageCount={unreadMessageCount} />
      <main className="admin-main">
        <div className="admin-content admin-inbox-content">
          <div className="admin-heading-row">
            <div><p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" /> FINISHED WITH CARE</p><h1>PROJECT<br /><em>ARCHIVES.</em></h1></div>
          </div>
          <div className="admin-inbox-controls">
            <label className="admin-inbox-search">SEARCH PROJECTS<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Project name or client" /></label>
            <label className="admin-inbox-sort">SORT BY<select value={sort} onChange={(event) => setSort(event.target.value as ProjectSort)}><option value="newest">Newest to Oldest</option><option value="oldest">Oldest to Newest</option></select></label>
          </div>
          {projects.length === 0 && <p className="admin-feedback">Completed projects will appear here.</p>}
          {projects.length > 0 && filteredProjects.length === 0 && <p className="admin-feedback">No projects match your search.</p>}
          <div className="admin-archive-list">
            {filteredProjects.map((project) => (
              <article className="admin-archive-project" key={project.id}>
                <div><h2>{project.projectName}</h2><p>{project.clientName || 'No client attached'} · Completed {new Date(project.savedAt).toLocaleDateString()}</p></div>
                <strong>₱{project.finalPrice.toFixed(2)}</strong>
                <button className="admin-message-button admin-message-open-button" type="button" onClick={() => setSelectedProject(project)}>VIEW PROJECT →</button>
              </article>
            ))}
          </div>
        </div>
      </main>
      {selectedProject && (
        <AdminModal title={selectedProject.projectName} eyebrow="ARCHIVED PROJECT" onClose={() => setSelectedProject(null)}>
          <p className="admin-project-client">{selectedProject.clientName || 'No client attached'}{selectedProject.clientEmail && ` · ${selectedProject.clientEmail}`}</p>
          <div className="admin-project-detail-grid">
            <span><small>FINAL PRICE</small><b>₱{selectedProject.finalPrice.toFixed(2)}</b></span>
            <span><small>YARN USED</small><b>{selectedProject.yarnUsed}g</b></span>
            <span><small>TIME</small><b>{selectedProject.hours}h {selectedProject.minutes}m</b></span>
            <span><small>LABOR RATE</small><b>₱{selectedProject.laborRate.toFixed(2)}</b></span>
            <span><small>DIFFICULTY</small><b>{selectedProject.difficulty}×</b></span>
            <span><small>COMPLETED</small><b>{new Date(selectedProject.savedAt).toLocaleDateString()}</b></span>
          </div>
        </AdminModal>
      )}
    </div>
  )
}

export default AdminArchivesPage
