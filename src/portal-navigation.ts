import type { Role } from './app-state'

export type PortalSectionId = 'tasks' | 'create' | 'recognition' | 'overview' | 'capacity' | 'completions' | 'accounts'

export type PortalSection = {
  id: PortalSectionId
  label: string
  description: string
}

const portalSections: Record<Role, readonly PortalSection[]> = {
  caregiver: [
    { id: 'tasks', label: 'Task map', description: 'View your tasks, statuses and AH updates' },
    { id: 'create', label: 'Create task', description: 'Publish a new practical support request' },
  ],
  volunteer: [
    { id: 'tasks', label: 'Find tasks', description: 'Map, filters and task offers' },
    { id: 'recognition', label: 'Recognition & receipts', description: 'Verified service and completion records' },
  ],
  admin: [
    { id: 'overview', label: 'Operations overview', description: 'Programme workspace directory' },
    { id: 'capacity', label: 'Capacity referrals', description: 'Seven-day sourcing actions' },
    { id: 'completions', label: 'Completion & recognition', description: 'Service verification and recognition data' },
    { id: 'accounts', label: 'Account administration', description: 'People, access and readiness' },
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
