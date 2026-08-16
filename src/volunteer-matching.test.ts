import { describe, expect, it } from 'vitest'
import { volunteerMatchGaps, volunteerTaskAction } from './volunteer-matching'

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

describe('direct volunteer task actions', () => {
  it('offers an eligible open task directly from the map detail', () => {
    expect(volunteerTaskAction({ status: 'Open', matchGaps: [], volunteer: '' })).toEqual({
      state: 'offer',
      label: 'Accept task',
      detail: 'Your readiness and conversation language fit this task.',
    })
  })

  it('explains the first readiness gap instead of offering', () => {
    expect(volunteerTaskAction({ status: 'Open', matchGaps: ['Complete Forms briefing'], volunteer: '' })).toEqual({
      state: 'locked',
      label: 'Locked · Complete Forms briefing',
      detail: 'Complete Forms briefing',
    })
  })

  it('shows a partially staffed task as confirmed instead of offering twice', () => {
    expect(volunteerTaskAction({ status: 'Open', matchGaps: [], volunteer: 'Maya T.', confirmedByCurrent: true })).toEqual({
      state: 'pending',
      label: 'You are confirmed',
      detail: 'This task is still open because more volunteers are needed.',
    })
  })

  it('opens completion immediately once the required capacity is filled', () => {
    expect(volunteerTaskAction({ status: 'Matched', matchGaps: [], volunteer: 'Maya T.', confirmedByCurrent: true })).toEqual({
      state: 'complete',
      label: 'Submit completion receipt',
      detail: 'Your reflection will add this task to your private service record.',
    })
  })
})
