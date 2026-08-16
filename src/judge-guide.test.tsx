import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'
import { shouldShowJudgeGuide } from './judge-guide-state'

describe('Expo Go judging guidance', () => {
  it('opens automatically only until the first-visit guide has been dismissed', () => {
    expect(shouldShowJudgeGuide(null)).toBe(true)
    expect(shouldShowJudgeGuide('1')).toBe(false)
  })

  it('shows first-visit instructions, platform-specific scanning steps, the QR, and a persistent reopen button on the homepage', () => {
    const markup = renderToStaticMarkup(<App />)

    expect(markup).toContain('Judge the mobile experience in Expo Go')
    expect(markup).toContain('Install Expo Go')
    expect(markup).toContain('iPhone Camera app')
    expect(markup).toContain('Android Expo Go scanner')
    expect(markup).toContain('ReliefKaki Expo Go QR code')
    expect(markup).toContain('Expo Go guide')
  })
})
