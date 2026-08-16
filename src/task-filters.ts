export type Coordinates = { lat: number; lng: number }

export type FilterableTask = {
  id: string
  category: string
  status: string
  createdAt: string
  lat: number
  lng: number
  locationLabel: string
}

export type TaskMapFilters = {
  category: string
  status: string
  openedFrom: string
  openedTo: string
  locationMode: 'All' | 'Own location' | 'Specific location'
  specificLocation: string
  radiusKm: 'All' | string
  specificAnchor?: Coordinates | null
}

function singaporeDate(value: string): string {
  const instant = new Date(value)
  return new Date(instant.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export function distanceKm(first: Coordinates, second: Coordinates): number {
  const earthRadiusKm = 6371
  const toRadians = (degrees: number) => degrees * Math.PI / 180
  const latitudeDelta = toRadians(second.lat - first.lat)
  const longitudeDelta = toRadians(second.lng - first.lng)
  const firstLatitude = toRadians(first.lat)
  const secondLatitude = toRadians(second.lat)
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

export function taskDisplayLabel(id: string): string {
  return `Task ${id.replace(/^[^-]+-/, '')}`
}

export function filterTaskMap<T extends FilterableTask>(tasks: T[], filters: TaskMapFilters, ownLocation: Coordinates | null): T[] {
  const radius = filters.radiusKm === 'All' ? null : Number(filters.radiusKm)
  const locationQuery = filters.specificLocation.trim().toLowerCase()
  const distanceAnchor = filters.locationMode === 'Own location' ? ownLocation : filters.specificAnchor ?? null

  return tasks.filter((task) => {
    if (filters.category !== 'All' && task.category !== filters.category) return false
    if (filters.status !== 'All' && task.status !== filters.status) return false

    const openedDate = singaporeDate(task.createdAt)
    if (filters.openedFrom && openedDate < filters.openedFrom) return false
    if (filters.openedTo && openedDate > filters.openedTo) return false

    if (filters.locationMode === 'Specific location' && locationQuery && radius === null
      && !task.locationLabel.toLowerCase().includes(locationQuery)) return false

    if (filters.locationMode === 'Specific location' && locationQuery && radius !== null && !distanceAnchor) return false

    if (filters.locationMode !== 'All' && radius !== null) {
      if (!distanceAnchor) return false
      if (distanceKm(distanceAnchor, { lat: task.lat, lng: task.lng }) > radius) return false
    }

    return true
  })
}
