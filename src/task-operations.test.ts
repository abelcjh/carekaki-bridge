import { describe, expect, it } from 'vitest'
import {
  autoEscalateTasks,
  closeTaskForCapacity,
  formatSingaporeClock,
  formatSingaporeDateTime,
  singaporeInputToIso,
  startCoordinatorSourcing,
  recordSourcedVolunteer,
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
  exactLabel: 'Caregiver home · protected demo point',
  exactLat: 1.2921,
  exactLng: 103.7993,
  privacyRadiusM: 2000,
}

const waitingTask: CapacityTask = {
  id: 'CK-207',
  status: 'Open',
  createdAt: '2026-08-07T08:00:00.000Z',
  volunteersNeeded: 2,
  confirmedVolunteers: [],
  capacityState: 'Recruiting',
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

describe('unmet task capacity lifecycle', () => {
  it('calculates whole waiting days without escalating early', () => {
    expect(taskAgeDays(waitingTask.createdAt, '2026-08-14T07:59:59.000Z')).toBe(6)
    expect(autoEscalateTasks([waitingTask], '2026-08-14T07:59:59.000Z')[0].status).toBe('Open')
  })

  it('automatically escalates at seven days when confirmed capacity is short', () => {
    const [task] = autoEscalateTasks([waitingTask], '2026-08-14T08:00:00.000Z')
    expect(task.status).toBe('Escalated')
    expect(task.capacityState).toBe('AH help required')
    expect(task.escalatedAt).toBe('2026-08-14T08:00:00.000Z')
    expect(task.adminNotification).toContain('0 of 2 volunteers confirmed')
  })

  it('does not escalate a task that already has enough confirmed volunteers', () => {
    const covered = { ...waitingTask, confirmedVolunteers: ['Maya T.', 'Arjun L.'] }
    expect(autoEscalateTasks([covered], '2026-08-15T08:00:00.000Z')[0].status).toBe('Open')
  })

  it('records AH-sourced volunteers and resolves the alert when capacity is reached', () => {
    const escalated = autoEscalateTasks([waitingTask], '2026-08-14T08:00:00.000Z')[0]
    const sourcing = startCoordinatorSourcing(escalated, '2026-08-14T08:05:00.000Z')
    const partlyCovered = recordSourcedVolunteer(sourcing, 'AH sourced · Nur A.')
    expect(partlyCovered.status).toBe('Escalated')
    expect(partlyCovered.confirmedVolunteers).toEqual(['AH sourced · Nur A.'])

    const covered = recordSourcedVolunteer(partlyCovered, 'AH sourced · Joel T.')
    expect(covered.status).toBe('Matched')
    expect(covered.capacityState).toBe('Covered')
    expect(covered.adminNotification).toContain('2 of 2 volunteers confirmed')
  })

  it('lets AH start sourcing and then close an unmet task with a caregiver notice', () => {
    const escalated = autoEscalateTasks([waitingTask], '2026-08-14T08:00:00.000Z')[0]
    expect(closeTaskForCapacity(escalated, '2026-08-14T09:00:00.000Z')).toBe(escalated)

    const sourcing = startCoordinatorSourcing(escalated, '2026-08-14T08:05:00.000Z')
    expect(sourcing.capacityState).toBe('Coordinator sourcing')
    expect(sourcing.sourcingStartedAt).toBe('2026-08-14T08:05:00.000Z')

    const closed = closeTaskForCapacity(sourcing, '2026-08-14T09:00:00.000Z')
    expect(closed.status).toBe('Closed')
    expect(closed.capacityState).toBe('Closed · capacity unavailable')
    expect(closed.caregiverNotice).toContain('could not find enough suitable volunteers')
  })
})

describe('role-aware task geography', () => {
  it('shows volunteers only the privacy-safe caregiver zone', () => {
    expect(taskLocationForRole(exactHome, 'volunteer')).toEqual({
      label: exactHome.publicLabel,
      lat: exactHome.publicLat,
      lng: exactHome.publicLng,
      precision: 'Approximate 2 km zone',
    })
  })

  it('shows the accountable AH administrator the protected operational point', () => {
    expect(taskLocationForRole(exactHome, 'admin')).toEqual({
      label: exactHome.exactLabel,
      lat: exactHome.exactLat,
      lng: exactHome.exactLng,
      precision: 'Protected exact location',
    })
  })
})
