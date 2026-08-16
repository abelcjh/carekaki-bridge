import type { OperationalTaskStatus } from './task-operations'

export type VolunteerTaskTimeline = 'Past' | 'Present' | 'Future'

export type VolunteerTaskRecordInput = {
  id: string
  title: string
  scheduledAt: string
  status: OperationalTaskStatus
  volunteer: string
  confirmedVolunteers: string[]
}

export type VolunteerTaskRecord<T extends VolunteerTaskRecordInput> = T & {
  timeline: VolunteerTaskTimeline
}

const timelineOrder: Record<VolunteerTaskTimeline, number> = {
  Present: 0,
  Future: 1,
  Past: 2,
}

function taskTimeline(task: VolunteerTaskRecordInput, nowMs: number): VolunteerTaskTimeline {
  if (task.status === 'Done') return 'Past'
  return new Date(task.scheduledAt).getTime() > nowMs ? 'Future' : 'Present'
}

export function volunteerTaskRecord<T extends VolunteerTaskRecordInput>(
  tasks: readonly T[],
  volunteerName: string,
  now: string | number | Date,
): Array<VolunteerTaskRecord<T>> {
  const nowMs = new Date(now).getTime()

  return tasks
    .filter((task) => task.volunteer === volunteerName || task.confirmedVolunteers.includes(volunteerName))
    .map((task) => ({ ...task, timeline: taskTimeline(task, nowMs) }))
    .sort((a, b) => {
      const sectionDifference = timelineOrder[a.timeline] - timelineOrder[b.timeline]
      if (sectionDifference !== 0) return sectionDifference
      const timeDifference = new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      return a.timeline === 'Past' ? -timeDifference : timeDifference
    })
}
