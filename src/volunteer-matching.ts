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
