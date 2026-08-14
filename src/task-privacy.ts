export type TaskContactInput = {
  id: string
  silent: boolean
  caregiverName: string
  caregiverPhone: string
}

export type VolunteerTaskContact = {
  displayName: string
  contactNumber: string
  contactVisible: boolean
  communication: string
}

export function taskContactForVolunteer(input: TaskContactInput): VolunteerTaskContact {
  if (input.silent) {
    return {
      displayName: `Care request ${input.id}`,
      contactNumber: 'Hidden',
      contactVisible: false,
      communication: 'Checklist only',
    }
  }

  return {
    displayName: input.caregiverName.trim(),
    contactNumber: input.caregiverPhone.trim(),
    contactVisible: true,
    communication: 'Direct follow-up available',
  }
}

export function validateTaskContact(silent: boolean, caregiverName: string, caregiverPhone: string): string {
  if (silent) return ''
  if (!caregiverName.trim()) return 'Add the caregiver name before posting a non-silent task.'
  if (!caregiverPhone.trim()) return 'Add a contact number before posting a non-silent task.'
  return ''
}
