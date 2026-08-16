import type { Role } from './app-state'

export type OperationalTaskStatus = 'Open' | 'Matched' | 'Done'
export type CapacityState = 'Recruiting' | 'Covered'

export type CapacityTask = {
  id: string
  status: OperationalTaskStatus
  createdAt: string
  volunteersNeeded: number
  confirmedVolunteers: string[]
  capacityState: CapacityState
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

export function confirmVolunteerDirectly<T extends CapacityTask & { volunteer: string }>(task: T, volunteerName: string): T {
  if (task.status !== 'Open' || task.confirmedVolunteers.includes(volunteerName) || task.confirmedVolunteers.length >= task.volunteersNeeded) return task
  const confirmedVolunteers = [...task.confirmedVolunteers, volunteerName]
  const covered = confirmedVolunteers.length >= task.volunteersNeeded
  return {
    ...task,
    status: covered ? 'Matched' : 'Open',
    volunteer: task.volunteer || volunteerName,
    confirmedVolunteers,
    capacityState: covered ? 'Covered' : 'Recruiting',
  }
}

export function taskLocationForRole(location: TaskLocation, _role: Role): VisibleTaskLocation {
  return {
    label: location.exactLabel,
    lat: location.exactLat,
    lng: location.exactLng,
    precision: location.kind === 'home' ? 'Exact task location' : 'Exact service point',
  }
}
