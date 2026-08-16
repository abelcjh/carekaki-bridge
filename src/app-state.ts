export type Role = 'caregiver' | 'volunteer' | 'admin'
export type Theme = 'light' | 'dark'
export type Screen = 'home' | 'login' | 'portal'

export type DemoAccount = {
  role: Role
  label: string
  email: string
  password: string
  name: string
  id: string
  assurance: string
}

export type AuthSession = Pick<DemoAccount, 'role' | 'email' | 'name' | 'id' | 'assurance'>

export const demoAccounts: DemoAccount[] = [
  {
    role: 'caregiver',
    label: 'Caregiver demo',
    email: 'caregiver@carekaki.demo',
    password: 'carekaki',
    name: 'Marcus Lim',
    id: 'C-204',
    assurance: 'Anonymous to volunteers',
  },
  {
    role: 'volunteer',
    label: 'Volunteer demo',
    email: 'maya@carekaki.demo',
    password: 'carekaki',
    name: 'Maya Tan',
    id: 'VL-031',
    assurance: 'Identity and training verified',
  },
  {
    role: 'admin',
    label: 'AH admin demo',
    email: 'admin@carekaki.demo',
    password: 'carekaki',
    name: 'AH-C3U Admin',
    id: 'AH-018',
    assurance: 'Account administrator',
  },
]

export function authenticateDemo(email: string, password: string): AuthSession | null {
  const normalizedEmail = email.trim().toLowerCase()
  const account = demoAccounts.find((candidate) => candidate.email === normalizedEmail && candidate.password === password)
  if (!account) return null
  const { role, email: accountEmail, name, id, assurance } = account
  return { role, email: accountEmail, name, id, assurance }
}

export function resolveInitialTheme(savedTheme: string | null, systemPrefersDark: boolean): Theme {
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return systemPrefersDark ? 'dark' : 'light'
}
