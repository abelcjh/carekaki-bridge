import type { Role } from './app-state'
import { taskDisplayLabel } from './task-filters'

export type OperationalTaskStatus = 'Open' | 'Review' | 'Matched' | 'Done' | 'Escalated' | 'Closed'
export type CapacityState = 'Recruiting' | 'AH help required' | 'Coordinator sourcing' | 'Covered' | 'Closed · capacity unavailable'

export type CapacityTask = {
  id: string
  status: OperationalTaskStatus
  createdAt: string
  volunteersNeeded: number
  confirmedVolunteers: string[]
  capacityState: CapacityState
  escalatedAt?: string
  sourcingStartedAt?: string
  closedAt?: string
  adminNotification?: string
  caregiverNotice?: string
}

export type TaskLocation = {
  kind: 'hospital' | 'home' | 'meeting-point' | 'remote'
  publicLabel: string
  publicLat: number
  publicLng: number
  exactLabel: string
  exactLat: number
  exactLng: number
  privacyRadiusM: number
}

export type VisibleTaskLocation = {
  label: string
  lat: number
  lng: number
  precision: string
}

function singaporeParts(value: string | number | Date, includeSeconds: boolean) {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Singapore',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...(includeSeconds ? { second: '2-digit' } : {}),
  }
  const parts = new Intl.DateTimeFormat('en-SG', options).formatToParts(new Date(value))
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ''
  return {
    weekday: get('weekday'),
    day: get('day'),
    month: get('month'),
    year: get('year'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
    dayPeriod: get('dayPeriod').toLowerCase(),
  }
}

export function formatSingaporeClock(value: string | number | Date): string {
  const part = singaporeParts(value, true)
  return `${part.weekday}, ${part.day} ${part.month} ${part.year} · ${part.hour}:${part.minute}:${part.second} ${part.dayPeriod} SGT`
}

export function formatSingaporeDateTime(value: string | number | Date): string {
  const part = singaporeParts(value, false)
  return `${part.weekday}, ${part.day} ${part.month} · ${part.hour}:${part.minute} ${part.dayPeriod} SGT`
}

export function singaporeInputToIso(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error('Expected a Singapore local date and time')
  return new Date(`${value}:00+08:00`).toISOString()
}

export function singaporeInputFromDate(value: string | number | Date): string {
  const shifted = new Date(new Date(value).getTime() + 8 * 60 * 60 * 1000)
  return shifted.toISOString().slice(0, 16)
}

export function taskAgeDays(createdAt: string, now: string | number | Date): number {
  const elapsed = new Date(now).getTime() - new Date(createdAt).getTime()
  return Math.max(0, Math.floor(elapsed / (24 * 60 * 60 * 1000)))
}

export function taskWaitLabel(createdAt: string, now: string | number | Date): string {
  const elapsedMs = Math.max(0, new Date(now).getTime() - new Date(createdAt).getTime())
  const days = Math.floor(elapsedMs / (24 * 60 * 60 * 1000))
  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} waiting`
  const hours = Math.max(1, Math.floor(elapsedMs / (60 * 60 * 1000)))
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} waiting`
}

export function autoEscalateTasks<T extends CapacityTask>(tasks: T[], now: string): T[] {
  return tasks.map((task) => {
    const hasCapacity = task.confirmedVolunteers.length >= task.volunteersNeeded
    const isFinal = task.status === 'Done' || task.status === 'Closed'
    if (hasCapacity || isFinal || task.status === 'Escalated' || taskAgeDays(task.createdAt, now) < 7) return task
    return {
      ...task,
      status: 'Escalated',
      capacityState: 'AH help required',
      escalatedAt: now,
      adminNotification: `${taskDisplayLabel(task.id)} has waited 7 days with ${task.confirmedVolunteers.length} of ${task.volunteersNeeded} volunteers confirmed. Coordinator action is required.`,
    }
  })
}

export function startCoordinatorSourcing<T extends CapacityTask>(task: T, now: string): T {
  if (task.status !== 'Escalated' || task.confirmedVolunteers.length >= task.volunteersNeeded) return task
  return {
    ...task,
    capacityState: 'Coordinator sourcing',
    sourcingStartedAt: now,
    adminNotification: `${taskDisplayLabel(task.id)}: AH coordinator outreach is active for the remaining ${task.volunteersNeeded - task.confirmedVolunteers.length} volunteer place(s).`,
  }
}

export function recordSourcedVolunteer<T extends CapacityTask>(task: T, volunteerName: string): T {
  if (task.status !== 'Escalated' || task.capacityState !== 'Coordinator sourcing') return task
  if (task.confirmedVolunteers.length >= task.volunteersNeeded || task.confirmedVolunteers.includes(volunteerName)) return task
  const confirmedVolunteers = [...task.confirmedVolunteers, volunteerName]
  const covered = confirmedVolunteers.length >= task.volunteersNeeded
  return {
    ...task,
    status: covered ? 'Matched' : 'Escalated',
    confirmedVolunteers,
    capacityState: covered ? 'Covered' : 'Coordinator sourcing',
    adminNotification: covered
      ? `${taskDisplayLabel(task.id)}: ${confirmedVolunteers.length} of ${task.volunteersNeeded} volunteers confirmed. Capacity alert resolved.`
      : `${taskDisplayLabel(task.id)}: ${confirmedVolunteers.length} of ${task.volunteersNeeded} volunteers confirmed; AH sourcing continues.`,
  }
}

export function closeTaskForCapacity<T extends CapacityTask>(task: T, now: string): T {
  if (task.status !== 'Escalated' || task.capacityState !== 'Coordinator sourcing' || task.confirmedVolunteers.length >= task.volunteersNeeded) return task
  return {
    ...task,
    status: 'Closed',
    capacityState: 'Closed · capacity unavailable',
    closedAt: now,
    adminNotification: `${taskDisplayLabel(task.id)} closed after coordinator sourcing did not secure enough suitable volunteers.`,
    caregiverNotice: `We are sorry. CareKaki and the AH coordinator could not find enough suitable volunteers for ${taskDisplayLabel(task.id)}, so this task has been closed. Please contact the AH care team if you still need support.`,
  }
}

export function taskLocationForRole(location: TaskLocation, role: Role): VisibleTaskLocation {
  const canSeeProtectedPoint = role === 'admin' || role === 'caregiver' || location.kind !== 'home'
  if (canSeeProtectedPoint) {
    return {
      label: location.exactLabel,
      lat: location.exactLat,
      lng: location.exactLng,
      precision: location.kind === 'home' ? (role === 'caregiver' ? 'Exact task location' : 'Protected exact location') : 'Exact service point',
    }
  }
  return {
    label: location.publicLabel,
    lat: location.publicLat,
    lng: location.publicLng,
    precision: location.privacyRadiusM ? `Approximate ${location.privacyRadiusM / 1000} km zone` : 'Public service point',
  }
}
