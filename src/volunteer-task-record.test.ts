import { describe, expect, it } from 'vitest'
import { volunteerTaskRecord, type VolunteerTaskRecordInput } from './volunteer-task-record'

const task = (overrides: Partial<VolunteerTaskRecordInput> & Pick<VolunteerTaskRecordInput, 'id' | 'scheduledAt' | 'status'>): VolunteerTaskRecordInput => ({
  title: `Task ${overrides.id}`,
  volunteer: 'Maya T.',
  confirmedVolunteers: ['Maya T.'],
  ...overrides,
})

describe('volunteer task record', () => {
  it('includes only tasks assigned to or confirmed for the volunteer', () => {
    const records = volunteerTaskRecord([
      task({ id: 'assigned', scheduledAt: '2026-08-16T10:00:00.000Z', status: 'Matched', volunteer: 'Maya T.', confirmedVolunteers: [] }),
      task({ id: 'confirmed', scheduledAt: '2026-08-16T11:00:00.000Z', status: 'Matched', volunteer: '', confirmedVolunteers: ['Maya T.'] }),
      task({ id: 'someone-else', scheduledAt: '2026-08-16T12:00:00.000Z', status: 'Matched', volunteer: 'Arjun L.', confirmedVolunteers: ['Arjun L.'] }),
    ], 'Maya T.', '2026-08-16T10:30:00.000Z')

    expect(records.map((record) => record.id)).toEqual(['assigned', 'confirmed'])
  })

  it('labels and orders present, future and past tasks for the table', () => {
    const records = volunteerTaskRecord([
      task({ id: 'past', scheduledAt: '2026-08-15T08:00:00.000Z', status: 'Done' }),
      task({ id: 'future-later', scheduledAt: '2026-08-18T08:00:00.000Z', status: 'Matched' }),
      task({ id: 'present', scheduledAt: '2026-08-16T09:00:00.000Z', status: 'Matched' }),
      task({ id: 'future-sooner', scheduledAt: '2026-08-17T08:00:00.000Z', status: 'Matched' }),
    ], 'Maya T.', '2026-08-16T10:30:00.000Z')

    expect(records.map(({ id, timeline }) => ({ id, timeline }))).toEqual([
      { id: 'present', timeline: 'Present' },
      { id: 'future-sooner', timeline: 'Future' },
      { id: 'future-later', timeline: 'Future' },
      { id: 'past', timeline: 'Past' },
    ])
  })
})
