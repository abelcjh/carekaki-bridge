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

describe('volunteer task-map actions', () => {
  it('offers an eligible open task directly from the map detail', () => {
    expect(volunteerTaskAction({ status: 'Open', safetyCleared: true, matchGaps: [], volunteer: '' })).toEqual({
      state: 'offer',
      label: 'Offer to help',
      detail: 'Active readiness and conversation language fit this task.',
    })
  })

  it('keeps an uncleared task locked for AH safety review', () => {
    expect(volunteerTaskAction({ status: 'Open', safetyCleared: false, matchGaps: [], volunteer: '' })).toEqual({
      state: 'locked',
      label: 'Locked · AH review first',
      detail: 'Scope must be cleared before any volunteer can offer.',
    })
  })

  it('explains the first readiness gap instead of offering', () => {
    expect(volunteerTaskAction({ status: 'Open', safetyCleared: true, matchGaps: ['Complete Forms briefing'], volunteer: '' })).toEqual({
      state: 'locked',
      label: 'Locked · Complete Forms briefing',
      detail: 'Complete Forms briefing',
    })
  })

  it('keeps the signed-in volunteer pending offer on the map', () => {
    expect(volunteerTaskAction({ status: 'Review', safetyCleared: true, matchGaps: [], volunteer: 'Maya T.' })).toEqual({
      state: 'pending',
      label: 'Offered · awaiting admin',
      detail: 'AH confirmation is needed before assignment.',
    })
  })

  it('does not offer an escalated task twice after this volunteer has offered', () => {
    expect(volunteerTaskAction({ status: 'Escalated', safetyCleared: true, matchGaps: [], volunteer: 'Maya T.' })).toEqual({
      state: 'pending',
      label: 'Offered · awaiting admin',
      detail: 'AH confirmation is needed before assignment.',
    })
  })

  it('shows a partially staffed task as confirmed instead of offering again', () => {
    expect(volunteerTaskAction({ status: 'Open', safetyCleared: true, matchGaps: [], volunteer: 'Maya T.', confirmedByCurrent: true })).toEqual({
      state: 'pending',
      label: 'You are confirmed',
      detail: 'This task is still open because more volunteers are needed.',
    })
  })

  it('opens completion for the signed-in volunteer after matching', () => {
    expect(volunteerTaskAction({ status: 'Matched', safetyCleared: true, matchGaps: [], volunteer: 'Maya T.' })).toEqual({
      state: 'complete',
      label: 'Submit completion receipt',
      detail: 'Hours and points remain pending until AH verifies the record.',
    })
  })
})
