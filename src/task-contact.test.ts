import { describe, expect, it } from 'vitest'
import { taskContactForVolunteer, validateTaskContact } from './task-contact'

describe('task contact disclosure', () => {
  it('always shows the caregiver name and contact number to volunteers', () => {
    expect(taskContactForVolunteer({
      caregiverName: '  Marcus Lim ',
      caregiverPhone: ' +65 9123 4567 ',
    })).toEqual({
      displayName: 'Marcus Lim',
      contactNumber: '+65 9123 4567',
    })
  })

  it('requires both a caregiver name and contact number', () => {
    expect(validateTaskContact('', '+65 9123 4567')).toBe('Add the caregiver name before posting the task.')
    expect(validateTaskContact('Marcus Lim', '')).toBe('Add a contact number before posting the task.')
    expect(validateTaskContact('Marcus Lim', '+65 9123 4567')).toBe('')
  })
})
