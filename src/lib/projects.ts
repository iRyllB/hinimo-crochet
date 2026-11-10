export const savedProjectsKey = 'hinimo-worth-calculator-projects-v2'
export const archivedProjectsKey = 'hinimo-worth-calculator-archives-v1'

export type CalculatorForm = {
  projectName: string
  clientName: string
  clientEmail: string
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

export type SavedProject = CalculatorForm & {
  id: string
  finalPrice: number
  savedAt: string
}

function readProjects(key: string): SavedProject[] {
  try {
    const saved = window.localStorage.getItem(key)
    if (!saved) return []
    const projects = JSON.parse(saved) as SavedProject[]
    return Array.isArray(projects) ? projects : []
  } catch {
    return []
  }
}

export const readSavedProjects = () => readProjects(savedProjectsKey)
export const readArchivedProjects = () => readProjects(archivedProjectsKey)

export function writeProjects(key: string, projects: SavedProject[]) {
  window.localStorage.setItem(key, JSON.stringify(projects))
}
