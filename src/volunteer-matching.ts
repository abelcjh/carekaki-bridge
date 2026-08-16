export const taskLanguages = ['No preference', 'English', 'Mandarin', 'Malay', 'Tamil'] as const
export type TaskLanguage = (typeof taskLanguages)[number]

export type VolunteerProfile = {
  readiness: string[]
  languages: string[]
}

export type MatchableTask = {
  requiredSkill: string
  taskLanguage: TaskLanguage
}

export type VolunteerTaskAction = {
  state: 'offer' | 'locked' | 'pending' | 'complete' | 'unavailable'
  label: string
  detail: string
}

export function volunteerMatchGaps(task: MatchableTask, volunteer: VolunteerProfile): string[] {
  const gaps: string[] = []
  if (!volunteer.readiness.includes(task.requiredSkill)) gaps.push(`Complete ${task.requiredSkill}`)
  if (task.taskLanguage !== 'No preference' && !volunteer.languages.includes(task.taskLanguage)) {
    gaps.push(`${task.taskLanguage} conversation needed`)
  }
  return gaps
}

export function volunteerTaskAction(input: {
  status: string
  matchGaps: string[]
  volunteer: string
  confirmedByCurrent?: boolean
}): VolunteerTaskAction {
  if (input.status === 'Matched' && input.volunteer === 'Maya T.') {
    return {
      state: 'complete',
      label: 'Submit completion receipt',
      detail: 'Your reflection will add this task to your private service record.',
    }
  }
  if (input.confirmedByCurrent) {
    return {
      state: 'pending',
      label: 'You are confirmed',
      detail: 'This task is still open because more volunteers are needed.',
    }
  }
  if (input.status !== 'Open') {
    return { state: 'unavailable', label: 'Not open', detail: 'This task is no longer accepting offers.' }
  }
  if (input.matchGaps.length > 0) {
    return { state: 'locked', label: `Locked · ${input.matchGaps[0]}`, detail: input.matchGaps.join(' · ') }
  }
  return {
    state: 'offer',
    label: 'Accept task',
    detail: 'Your readiness and conversation language fit this task.',
  }
}
