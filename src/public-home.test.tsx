import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'
import { getFooterAwareGuideBottom } from './judge-guide-state'

describe('public homepage service model', () => {
  it('describes direct volunteer task selection without hospital approval or triage', () => {
    const markup = renderToStaticMarkup(<App />)
    const homeCopy = markup.toLowerCase()

    expect(homeCopy).toContain('eligible volunteers choose and offer directly')
    expect(homeCopy).toContain('without waiting for hospital staff to approve routine matches')
    expect(homeCopy).not.toMatch(/\btriage\b/)
    expect(homeCopy).not.toMatch(/\breview\b/)
    expect(homeCopy).not.toContain('ah-reviewed')
    expect(homeCopy).not.toContain('checks the match')
    expect(homeCopy).not.toContain('retain oversight')
    expect(homeCopy).not.toContain('review every open task')
  })
})

describe('footer-aware Expo Go launcher position', () => {
  it('uses the normal gap while the footer is below the viewport', () => {
    expect(getFooterAwareGuideBottom(800, 900, 20)).toBe(20)
  })

  it('moves the launcher above a visible footer', () => {
    expect(getFooterAwareGuideBottom(800, 700, 20)).toBe(120)
    expect(getFooterAwareGuideBottom(844, 684, 12)).toBe(172)
  })
})
