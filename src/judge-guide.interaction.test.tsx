// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { judgeGuideStorageKey } from './judge-guide-state'

let root: Root | null = null
let container: HTMLDivElement | null = null

function renderApp() {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root?.render(<App />))
  return container
}

function click(element: Element) {
  act(() => element.dispatchEvent(new MouseEvent('click', { bubbles: true })))
}

function pressKey(key: string, shiftKey = false) {
  act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true })))
}

beforeEach(() => {
  localStorage.clear()
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  })
  Object.defineProperty(window, 'scrollTo', { configurable: true, value: () => {} })
  ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  act(() => root?.unmount())
  root = null
  container?.remove()
  container = null
  document.body.style.overflow = ''
})

describe('Expo Go judge guide interactions', () => {
  it('opens on first visit, dismisses from dialog content, persists dismissal, and reopens from the fixed trigger', () => {
    const view = renderApp()
    expect(view.querySelector('[role="dialog"]')).not.toBeNull()

    click(view.querySelector('#judge-guide-title') as Element)
    expect(view.querySelector('[role="dialog"]')).toBeNull()
    expect(localStorage.getItem(judgeGuideStorageKey)).toBe('1')

    click(view.querySelector('.judge-guide-trigger') as Element)
    expect(view.querySelector('[role="dialog"]')).not.toBeNull()

    pressKey('Escape')
    expect(view.querySelector('[role="dialog"]')).toBeNull()

    act(() => root?.unmount())
    root = null
    container?.remove()
    const revisitedView = renderApp()
    expect(revisitedView.querySelector('[role="dialog"]')).toBeNull()
  })

  it('traps keyboard focus in the modal and restores it to the trigger after closing', () => {
    localStorage.setItem(judgeGuideStorageKey, '1')
    const view = renderApp()
    const trigger = view.querySelector('.judge-guide-trigger') as HTMLButtonElement
    trigger.focus()
    click(trigger)

    const close = view.querySelector('.judge-guide-close') as HTMLButtonElement
    const directLink = view.querySelector('.judge-guide-direct') as HTMLAnchorElement
    expect(document.activeElement).toBe(close)

    pressKey('Tab', true)
    expect(document.activeElement).toBe(directLink)

    pressKey('Tab')
    expect(document.activeElement).toBe(close)

    pressKey('Escape')
    expect(view.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })
})
