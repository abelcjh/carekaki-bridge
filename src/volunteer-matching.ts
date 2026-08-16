export const taskLanguages = ['No preference', 'English', 'Mandarin', 'Malay', 'Tamil'] as const

export type TaskLanguage = (typeof taskLanguages)[number]

export type VolunteerMatchRequirements = {
  requiredSkill: string
  taskLanguage: TaskLanguage
}

export type VolunteerMatchProfile = {
  readiness: readonly string[]
  languages: readonly string[]
}

export function volunteerMatchGaps(
  requirements: VolunteerMatchRequirements,
  profile: VolunteerMatchProfile,
): string[] {
  const gaps: string[] = []

  if (!profile.readiness.includes(requirements.requiredSkill)) {
    gaps.push(`Complete ${requirements.requiredSkill}`)
  }

  if (
    requirements.taskLanguage !== 'No preference'
    && !profile.languages.includes(requirements.taskLanguage)
  ) {
    gaps.push(`${requirements.taskLanguage} conversation needed`)
  }

  return gaps
}

export type VolunteerTaskActionState = 'offer' | 'locked' | 'pending' | 'complete' | 'unavailable'

export type VolunteerTaskActionInput = {
  status: string
  safetyCleared: boolean
  matchGaps: readonly string[]
  volunteer: string
  currentVolunteer?: string
  confirmedByCurrent?: boolean
}

export type VolunteerTaskActionModel = {
  state: VolunteerTaskActionState
  label: string
  detail: string
}

export function volunteerTaskAction({
  status,
  safetyCleared,
  matchGaps,
  volunteer,
  currentVolunteer = 'Maya T.',
  confirmedByCurrent = false,
}: VolunteerTaskActionInput): VolunteerTaskActionModel {
  if (!safetyCleared) {
    return {
      state: 'locked',
      label: 'Locked · AH review first',
      detail: 'Scope must be cleared before any volunteer can offer.',
    }
  }

  if (matchGaps.length > 0) {
    return {
      state: 'locked',
      label: `Locked · ${matchGaps[0]}`,
      detail: matchGaps.join(' · '),
    }
  }

  if (confirmedByCurrent) {
    return {
      state: 'pending',
      label: 'You are confirmed',
      detail: 'This task is still open because more volunteers are needed.',
    }
  }

  if ((status === 'Review' || status === 'Escalated') && volunteer === currentVolunteer) {
    return {
      state: 'pending',
      label: 'Offered · awaiting admin',
      detail: 'AH confirmation is needed before assignment.',
    }
  }

  if (status === 'Matched' && volunteer === currentVolunteer) {
    return {
      state: 'complete',
      label: 'Submit completion receipt',
      detail: 'Hours and points remain pending until AH verifies the record.',
    }
  }

  if (status === 'Open' || status === 'Escalated') {
    return {
      state: 'offer',
      label: 'Offer to help',
      detail: 'Active readiness and conversation language fit this task.',
    }
  }

  return {
    state: 'unavailable',
    label: status,
    detail: 'This task is not currently accepting volunteer offers.',
  }
}
