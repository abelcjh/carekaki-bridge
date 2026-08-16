import { describe, expect, it } from 'vitest'
import { authenticateDemo, demoAccounts, resolveInitialTheme } from './app-state'

describe('role-bound demo authentication', () => {
  it('authenticates each published demo account into only its assigned role', () => {
    for (const account of demoAccounts) {
      expect(authenticateDemo(account.email.toUpperCase(), account.password)).toMatchObject({
        role: account.role,
        email: account.email,
        name: account.name,
        id: account.id,
      })
    }
  })

  it('rejects unknown credentials instead of granting a fallback role', () => {
    expect(authenticateDemo('unknown@example.com', 'reliefkaki')).toBeNull()
    expect(authenticateDemo(demoAccounts[0].email, 'wrong-password')).toBeNull()
  })
})

describe('theme preference', () => {
  it('respects an explicit saved preference', () => {
    expect(resolveInitialTheme('light', true)).toBe('light')
    expect(resolveInitialTheme('dark', false)).toBe('dark')
  })

  it('uses the operating-system setting when no preference was saved', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark')
    expect(resolveInitialTheme(null, false)).toBe('light')
  })

  it('ignores corrupted saved values', () => {
    expect(resolveInitialTheme('sepia', true)).toBe('dark')
  })
})
