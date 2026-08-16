import { describe, expect, it } from 'vitest'
import {
  confirmVolunteerDirectly,
  formatSingaporeClock,
  formatSingaporeDateTime,
  singaporeInputToIso,
  taskAgeDays,
  taskLocationForRole,
  type CapacityTask,
  type TaskLocation,
} from './task-operations'

const exactHome: TaskLocation = {
  kind: 'home',
  publicLabel: 'Queenstown · 2 km privacy zone',
  publicLat: 1.2942,
  publicLng: 103.7861,
  exactLabel: 'Caregiver home · exact demo point',
  exactLat: 1.2921,
  exactLng: 103.7993,
  privacyRadiusM: 2000,
}

const waitingTask: CapacityTask & { volunteer: string } = {
  id: 'CK-207',
  status: 'Open',
  createdAt: '2026-08-07T08:00:00.000Z',
  volunteersNeeded: 1,
  confirmedVolunteers: [],
  capacityState: 'Recruiting',
  volunteer: '',
}

describe('Singapore task time', () => {
  it('formats the live Singapore clock with seconds', () => {
    expect(formatSingaporeClock('2026-08-14T08:30:45.000Z')).toBe('Fri, 14 Aug 2026 · 4:30:45 pm SGT')
  })

  it('formats a task schedule in Singapore time', () => {
    expect(formatSingaporeDateTime('2026-08-15T01:30:00.000Z')).toBe('Sat, 15 Aug · 9:30 am SGT')
  })

  it('converts a Singapore-local scheduling input to an absolute instant', () => {
    expect(singaporeInputToIso('2026-08-15T09:30')).toBe('2026-08-15T01:30:00.000Z')
  })
})

describe('direct task confirmation', () => {
  it('confirms an eligible volunteer directly', () => {
    const matched = confirmVolunteerDirectly(waitingTask, 'Maya T.')
    expect(matched.status).toBe('Matched')
    expect(matched.volunteer).toBe('Maya T.')
    expect(matched.confirmedVolunteers).toEqual(['Maya T.'])
    expect(matched.capacityState).toBe('Covered')
  })

  it('keeps a multi-volunteer task open while recording the direct confirmation', () => {
    const task = { ...waitingTask, volunteersNeeded: 2 }
    const partlyCovered = confirmVolunteerDirectly(task, 'Maya T.')
    expect(partlyCovered.status).toBe('Open')
    expect(partlyCovered.confirmedVolunteers).toEqual(['Maya T.'])
    expect(partlyCovered.capacityState).toBe('Recruiting')
  })

  it('does not confirm the same volunteer twice', () => {
    const matched = confirmVolunteerDirectly(waitingTask, 'Maya T.')
    expect(confirmVolunteerDirectly(matched, 'Maya T.')).toBe(matched)
  })
})

describe('task age and geography', () => {
  it('calculates whole waiting days', () => {
    expect(taskAgeDays(waitingTask.createdAt, '2026-08-14T07:59:59.000Z')).toBe(6)
    expect(taskAgeDays(waitingTask.createdAt, '2026-08-14T08:00:00.000Z')).toBe(7)
  })

  it('shows volunteers the exact task location needed to complete the request', () => {
    expect(taskLocationForRole(exactHome, 'volunteer')).toEqual({
      label: exactHome.exactLabel,
      lat: exactHome.exactLat,
      lng: exactHome.exactLng,
      precision: 'Exact task location',
    })
  })

  it('shows the caregiver their exact task location', () => {
    expect(taskLocationForRole(exactHome, 'caregiver')).toEqual({
      label: exactHome.exactLabel,
      lat: exactHome.exactLat,
      lng: exactHome.exactLng,
      precision: 'Exact task location',
    })
  })
})
