import { describe, expect, it } from 'vitest'
import { defaultPortalSection, portalSectionsForRole, resolvePortalSection } from './portal-navigation'

describe('role portal navigation', () => {
  it('gives caregivers one page for their task list and one for creating a request', () => {
    expect(portalSectionsForRole('caregiver').map((section) => section.id)).toEqual(['tasks', 'create'])
  })

  it('gives volunteers separate task discovery and recognition pages', () => {
    expect(portalSectionsForRole('volunteer').map((section) => section.id)).toEqual(['tasks', 'recognition'])
  })

  it('gives AH administrators separate operational pages including account administration', () => {
    expect(portalSectionsForRole('admin').map((section) => section.id)).toEqual([
      'overview',
      'capacity',
      'completions',
      'accounts',
    ])
    expect(portalSectionsForRole('admin').find((section) => section.id === 'accounts')?.label).toBe('Account administration')
  })

  it('falls back to the role homepage when a section belongs to another role', () => {
    expect(defaultPortalSection('caregiver')).toBe('tasks')
    expect(defaultPortalSection('volunteer')).toBe('tasks')
    expect(defaultPortalSection('admin')).toBe('overview')
    expect(resolvePortalSection('admin', 'create')).toBe('overview')
    expect(resolvePortalSection('volunteer', 'accounts')).toBe('tasks')
  })
})
