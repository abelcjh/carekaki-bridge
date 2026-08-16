import { describe, expect, it } from 'vitest'
import { distanceKm, filterTaskMap, openVolunteerTasks, taskDisplayLabel, type FilterableTask, type TaskMapFilters } from './task-filters'

const tasks: FilterableTask[] = [
  { id: 'CK-204', category: 'Errands', status: 'Open', createdAt: '2026-08-10T00:00:00.000Z', lat: 1.2868, lng: 103.8011, locationLabel: 'Alexandra Hospital' },
  { id: 'CK-205', category: 'Digital help', status: 'Matched', createdAt: '2026-08-12T00:00:00.000Z', lat: 1.2921, lng: 103.7993, locationLabel: 'Caregiver home · Queenstown' },
  { id: 'CK-206', category: 'Errands', status: 'Closed', createdAt: '2026-08-14T00:00:00.000Z', lat: 1.2897, lng: 103.8166, locationLabel: 'Redhill MRT' },
]

const allFilters: TaskMapFilters = {
  category: 'All',
  status: 'All',
  openedFrom: '',
  openedTo: '',
  locationMode: 'All',
  specificLocation: '',
  radiusKm: 'All',
}

describe('caregiver task-map filters', () => {
  it('shows every task when every filter is All', () => {
    expect(filterTaskMap(tasks, allFilters, null)).toEqual(tasks)
  })

  it('filters by category, status and inclusive opened-date range', () => {
    expect(filterTaskMap(tasks, {
      ...allFilters,
      category: 'Errands',
      status: 'Open',
      openedFrom: '2026-08-10',
      openedTo: '2026-08-10',
    }, null).map((task) => task.id)).toEqual(['CK-204'])
  })

  it('filters tasks within a radius of the tracked current location', () => {
    const nearby = filterTaskMap(tasks, {
      ...allFilters,
      locationMode: 'Own location',
      radiusKm: '1',
    }, { lat: 1.2868, lng: 103.8011 })
    expect(nearby.map((task) => task.id)).toEqual(['CK-204', 'CK-205'])
  })

  it('matches a typed location and then applies its radius anchor', () => {
    const nearby = filterTaskMap(tasks, {
      ...allFilters,
      locationMode: 'Specific location',
      specificLocation: 'Redhill MRT',
      radiusKm: '1',
      specificAnchor: { lat: 1.2897, lng: 103.8166 },
    }, null)
    expect(nearby.map((task) => task.id)).toEqual(['CK-206'])
  })

  it('matches only the typed location when distance is All', () => {
    const matching = filterTaskMap(tasks, {
      ...allFilters,
      locationMode: 'Specific location',
      specificLocation: 'Redhill MRT',
      specificAnchor: { lat: 1.2897, lng: 103.8166 },
    }, null)
    expect(matching.map((task) => task.id)).toEqual(['CK-206'])
  })
})

describe('volunteer open-task marketplace', () => {
  it('shows every unexpired open task across caregiver accounts', () => {
    const marketplaceTasks = [
      { id: 'CK-301', ownerId: 'C-204', status: 'Open', scheduledAt: '2026-08-16T04:00:00.000Z', referralOnly: false },
      { id: 'CK-302', ownerId: 'C-205', status: 'Open', scheduledAt: '2026-08-16T05:00:00.000Z', referralOnly: false },
      { id: 'CK-303', ownerId: 'C-206', status: 'Open', scheduledAt: '2026-08-16T01:00:00.000Z', referralOnly: false },
      { id: 'CK-304', ownerId: 'C-207', status: 'Matched', scheduledAt: '2026-08-16T06:00:00.000Z', referralOnly: false },
      { id: 'CK-305', ownerId: 'C-208', status: 'Escalated', scheduledAt: '2026-08-16T07:00:00.000Z', referralOnly: false },
      { id: 'CK-306', ownerId: 'C-209', status: 'Open', scheduledAt: '2026-08-16T08:00:00.000Z', referralOnly: true },
    ]

    expect(openVolunteerTasks(marketplaceTasks, '2026-08-16T02:00:00.000Z').map((task) => task.id)).toEqual([
      'CK-301',
      'CK-302',
      'CK-305',
    ])
  })
})

describe('task display identity', () => {
  it('never exposes the internal CK prefix in user-facing task labels', () => {
    expect(taskDisplayLabel('CK-204')).toBe('Task 204')
    expect(taskDisplayLabel('task-private-id')).toBe('Task private-id')
  })
})

describe('task distance', () => {
  it('calculates geographic distance in kilometres', () => {
    expect(distanceKm({ lat: 1.2868, lng: 103.8011 }, { lat: 1.2897, lng: 103.8166 })).toBeGreaterThan(1)
    expect(distanceKm({ lat: 1.2868, lng: 103.8011 }, { lat: 1.2868, lng: 103.8011 })).toBe(0)
  })
})
