import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'
import { getFooterAwareGuideBottom } from './judge-guide-state'

describe('public homepage service model', () => {
  it('describes immediate publication and direct volunteer confirmation', () => {
    const markup = renderToStaticMarkup(<App />)
    const homeCopy = markup.toLowerCase()

    expect(homeCopy).toContain('in-scope requests publish immediately')
    expect(homeCopy).toContain('confirm a suitable task directly')
    expect(homeCopy).not.toMatch(/\btriage\b/)
    expect(homeCopy).not.toMatch(/\breview\b/)
    expect(homeCopy).not.toMatch(/\bapprove(?:d|s|ing)?\b/)
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
