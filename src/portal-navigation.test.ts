import { describe, expect, it } from 'vitest'
import { defaultPortalSection, portalSectionsForRole, resolvePortalSection } from './portal-navigation'

describe('role portal navigation', () => {
  it('gives caregivers a Task map homepage and a separate Create task page', () => {
    expect(portalSectionsForRole('caregiver').map((section) => ({ id: section.id, label: section.label }))).toEqual([
      { id: 'tasks', label: 'Task map' },
      { id: 'create', label: 'Create task' },
    ])
    expect(defaultPortalSection('caregiver')).toBe('tasks')
  })

  it('gives volunteers separate discovery, task record and recognition pages', () => {
    expect(portalSectionsForRole('volunteer').map((section) => ({ id: section.id, label: section.label }))).toEqual([
      { id: 'tasks', label: 'Find tasks' },
      { id: 'my-tasks', label: 'My tasks' },
      { id: 'recognition', label: 'Recognition & receipts' },
    ])
  })

  it('falls back to the role homepage when a section belongs to another role', () => {
    expect(defaultPortalSection('caregiver')).toBe('tasks')
    expect(defaultPortalSection('volunteer')).toBe('tasks')
    expect(resolvePortalSection('volunteer', 'create')).toBe('tasks')
  })
})
