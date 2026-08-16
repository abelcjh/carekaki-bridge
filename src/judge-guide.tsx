import { useEffect, useRef, type RefObject } from 'react'
import expoQrCode from './assets/reliefkaki-expo-qr.png'
import { expoGoDeepLink, getFooterAwareGuideBottom } from './judge-guide-state'

export function JudgeExpoGuide({ open, onOpen, onDismiss, footerRef }: { open: boolean; onOpen: () => void; onDismiss: () => void; footerRef?: RefObject<HTMLElement | null> }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleModalKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss()
        return
      }
      if (event.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleModalKeys)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleModalKeys)
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus()
    }
  }, [open, onDismiss])

  useEffect(() => {
    const trigger = triggerRef.current
    const footer = footerRef?.current
    if (!trigger || !footer) return

    const updateTriggerBottom = () => {
      const gap = window.matchMedia('(max-width: 720px)').matches ? 12 : 20
      trigger.style.bottom = `${getFooterAwareGuideBottom(window.innerHeight, footer.getBoundingClientRect().top, gap)}px`
    }

    updateTriggerBottom()
    window.addEventListener('scroll', updateTriggerBottom, { passive: true })
    window.addEventListener('resize', updateTriggerBottom)

    return () => {
      window.removeEventListener('scroll', updateTriggerBottom)
      window.removeEventListener('resize', updateTriggerBottom)
      trigger.style.removeProperty('bottom')
    }
  }, [footerRef])

  const openFromTrigger = () => {
    returnFocusRef.current = triggerRef.current
    onOpen()
  }

  return <>
    <button ref={triggerRef} className="judge-guide-trigger" type="button" onClick={openFromTrigger} aria-haspopup="dialog" aria-expanded={open} aria-controls="judge-guide-dialog">
      <span aria-hidden="true">▦</span>
      <span><b>Expo Go guide</b><small>QR + judge instructions</small></span>
    </button>

    {open && <div className="judge-guide-overlay" role="presentation" onClick={onDismiss}>
      <section ref={dialogRef} id="judge-guide-dialog" className="judge-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="judge-guide-title" aria-describedby="judge-guide-summary" tabIndex={-1}>
        <button ref={closeRef} className="judge-guide-close" type="button" aria-label="Close Expo Go guide">×</button>
        <div className="judge-guide-copy">
          <p className="eyebrow">MOBILE JUDGING PREVIEW</p>
          <h2 id="judge-guide-title">Judge the mobile experience in Expo Go</h2>
          <p id="judge-guide-summary">ReliefKaki’s judge-ready mobile preview takes about a minute to open.</p>
          <ol className="judge-guide-steps">
            <li><span>1</span><div><b>Install Expo Go</b><small>Get the Expo Go app from the Apple App Store or Google Play.</small></div></li>
            <li><span>2</span><div><b>Scan this QR code</b><small>Use the <strong>iPhone Camera app</strong> or the <strong>Android Expo Go scanner</strong>.</small></div></li>
            <li><span>3</span><div><b>Open ReliefKaki</b><small>Allow Expo Go to open the preview, then wait briefly for the project to load.</small></div></li>
          </ol>
          <a className="button button-dark judge-guide-direct" href={expoGoDeepLink}>On this phone? Open directly in Expo Go <span className="arrow">↗</span></a>
        </div>
        <div className="judge-guide-qr-panel">
          <div className="judge-guide-qr-frame"><img src={expoQrCode} alt="ReliefKaki Expo Go QR code" width="1200" height="1200" /></div>
          <b>Scan with your phone</b>
          <span>Expo SDK 54 · judging channel</span>
        </div>
        <p className="judge-guide-dismiss">Click anywhere to continue. Reopen this guide anytime from the button at the bottom right.</p>
      </section>
    </div>}
  </>
}
