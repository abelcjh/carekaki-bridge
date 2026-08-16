import type { Role } from './app-state'

export type PortalSectionId = 'tasks' | 'create' | 'my-tasks' | 'recognition'

export type PortalSection = {
  id: PortalSectionId
  label: string
  description: string
}

const portalSections: Record<Role, readonly PortalSection[]> = {
  caregiver: [
    { id: 'tasks', label: 'Task map', description: 'View your published tasks and volunteer confirmations' },
    { id: 'create', label: 'Create task', description: 'Publish a new practical support request' },
  ],
  volunteer: [
    { id: 'tasks', label: 'Find tasks', description: 'Map, filters and direct task confirmation' },
    { id: 'my-tasks', label: 'My tasks', description: 'Past, present and upcoming assigned tasks' },
    { id: 'recognition', label: 'Recognition & receipts', description: 'Your completed service and private records' },
  ],
}

export function portalSectionsForRole(role: Role): readonly PortalSection[] {
  return portalSections[role]
}

export function defaultPortalSection(role: Role): PortalSectionId {
  return portalSections[role][0].id
}

export function resolvePortalSection(role: Role, requested: PortalSectionId): PortalSectionId {
  return portalSections[role].some((section) => section.id === requested)
    ? requested
    : defaultPortalSection(role)
}
