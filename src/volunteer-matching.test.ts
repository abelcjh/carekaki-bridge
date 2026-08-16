import { describe, expect, it } from 'vitest'
import { volunteerMatchGaps } from './volunteer-matching'

const profile = {
  readiness: ['Errands ready', 'Digital help ready'],
  languages: ['English', 'Mandarin'],
}

describe('task language and readiness matching', () => {
  it('allows an offer when both readiness and a required language fit', () => {
    expect(volunteerMatchGaps({ requiredSkill: 'Errands ready', taskLanguage: 'Mandarin' }, profile)).toEqual([])
  })

  it('does not turn no language preference into a matching gate', () => {
    expect(volunteerMatchGaps({ requiredSkill: 'Digital help ready', taskLanguage: 'No preference' }, profile)).toEqual([])
  })

  it('explains every unmet requirement before an offer', () => {
    expect(volunteerMatchGaps({ requiredSkill: 'Forms briefing', taskLanguage: 'Malay' }, profile)).toEqual([
      'Complete Forms briefing',
      'Malay conversation needed',
    ])
  })
})
