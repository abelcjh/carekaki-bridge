export type TaskContactInput = {
  caregiverName: string
  caregiverPhone: string
}

export type VolunteerTaskContact = {
  displayName: string
  contactNumber: string
}

export function taskContactForVolunteer(input: TaskContactInput): VolunteerTaskContact {
  return {
    displayName: input.caregiverName.trim(),
    contactNumber: input.caregiverPhone.trim(),
  }
}

export function validateTaskContact(caregiverName: string, caregiverPhone: string): string {
  if (!caregiverName.trim()) return 'Add the caregiver name before posting the task.'
  if (!caregiverPhone.trim()) return 'Add a contact number before posting the task.'
  return ''
}
