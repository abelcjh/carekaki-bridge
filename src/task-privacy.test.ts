import { describe, expect, it } from 'vitest'
import { taskContactForVolunteer, validateTaskContact } from './task-privacy'

describe('task contact disclosure', () => {
  it('keeps caregiver identity and contact hidden for a Silent Task', () => {
    expect(taskContactForVolunteer({
      id: 'CK-208',
      silent: true,
      caregiverName: 'Marcus Lim',
      caregiverPhone: '+65 9123 4567',
    })).toEqual({
      displayName: 'Task 208',
      contactNumber: 'Hidden',
      contactVisible: false,
      communication: 'Checklist only',
    })
  })

  it('shows the caregiver name and contact number when Silent Task is off', () => {
    expect(taskContactForVolunteer({
      id: 'CK-208',
      silent: false,
      caregiverName: '  Marcus Lim ',
      caregiverPhone: ' +65 9123 4567 ',
    })).toEqual({
      displayName: 'Marcus Lim',
      contactNumber: '+65 9123 4567',
      contactVisible: true,
      communication: 'Direct follow-up available',
    })
  })

  it('requires both a name and contact number for a non-silent task', () => {
    expect(validateTaskContact(true, '', '')).toBe('')
    expect(validateTaskContact(false, '', '+65 9123 4567')).toBe('Add the caregiver name before posting a non-silent task.')
    expect(validateTaskContact(false, 'Marcus Lim', '')).toBe('Add a contact number before posting a non-silent task.')
    expect(validateTaskContact(false, 'Marcus Lim', '+65 9123 4567')).toBe('')
  })
})
