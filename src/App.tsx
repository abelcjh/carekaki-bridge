import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import heroImage from './assets/reliefkaki-hero.png'
import { authenticateDemo, demoAccounts, resolveInitialTheme, type AuthSession, type Role, type Screen, type Theme } from './app-state'
import { JudgeExpoGuide } from './judge-guide'
import { judgeGuideStorageKey, shouldShowJudgeGuide } from './judge-guide-state'
import { defaultPortalSection, portalSectionsForRole, resolvePortalSection, type PortalSectionId } from './portal-navigation'
import { taskContactForVolunteer, validateTaskContact } from './task-contact'
import { filterTaskMap, openVolunteerTasks, taskDisplayLabel, type Coordinates, type TaskMapFilters } from './task-filters'
import { taskLanguages, volunteerMatchGaps, volunteerTaskAction, type TaskLanguage } from './volunteer-matching'
import {
  autoEscalateTasks,
  closeTaskForCapacity,
  formatSingaporeClock,
  formatSingaporeDateTime,
  recordSourcedVolunteer,
  singaporeInputFromDate,
  singaporeInputToIso,
  startCoordinatorSourcing,
  taskLocationForRole,
  taskWaitLabel,
  type CapacityTask,
  type TaskLocation,
} from './task-operations'
import './App.css'
type Category = 'Errands' | 'Digital help' | 'Wayfinding' | 'Meals & home' | 'Admin & forms' | 'Companionship' | 'Sensitive accompaniment'
type Difficulty = 'Light' | 'Skilled' | 'Weightier'
type ScopeSignal = { label: string; guidance: string; emergency?: boolean }
type CompletionReceipt = {
  submittedAt: string
  reflection: string
  verification: 'Pending AH verification' | 'Verified by AH'
  verifiedAt?: string
}

type Task = CapacityTask & {
  title: string
  category: Category
  language: TaskLanguage
  scheduledAt: string
  location: TaskLocation
  ownerId: string
  caregiverName: string
  caregiverPhone: string
  urgent: boolean
  femalePreferred: boolean
  points: number
  viaHours: number
  difficulty: Difficulty
  skill: string
  volunteer: string
  safetyCleared: boolean
  referralOnly: boolean
  scopeFlags: string[]
  completion: CompletionReceipt | null
}

type LocationKey = 'ah' | 'home' | 'redhill' | 'remote' | 'tiongBahru' | 'commonwealth' | 'bukitMerah' | 'ghimMoh' | 'telokBlangah' | 'queenstownLibrary'

const locationCatalog: Record<LocationKey, TaskLocation> = {
  ah: {
    kind: 'hospital', publicLabel: 'Alexandra Hospital · main campus', publicLat: 1.2867939, publicLng: 103.8011061,
    exactLabel: 'Alexandra Hospital · 378 Alexandra Road', exactLat: 1.2867939, exactLng: 103.8011061, privacyRadiusM: 0,
  },
  home: {
    kind: 'home', publicLabel: 'Queenstown · 2 km privacy zone', publicLat: 1.2892, publicLng: 103.7845,
    exactLabel: 'Caregiver home · Queenstown (demo)', exactLat: 1.2921, exactLng: 103.7993, privacyRadiusM: 2000,
  },
  redhill: {
    kind: 'meeting-point', publicLabel: 'Redhill MRT · public meeting point', publicLat: 1.2897035, publicLng: 103.8166333,
    exactLabel: 'Redhill MRT Station · Exit A', exactLat: 1.2897035, exactLng: 103.8166333, privacyRadiusM: 0,
  },
  remote: {
    kind: 'remote', publicLabel: 'Remote · no travel required', publicLat: 1.3521, publicLng: 103.8198,
    exactLabel: 'Remote task · online handoff', exactLat: 1.3521, exactLng: 103.8198, privacyRadiusM: 0,
  },
  tiongBahru: {
    kind: 'meeting-point', publicLabel: 'Tiong Bahru Plaza', publicLat: 1.2863, publicLng: 103.8271,
    exactLabel: 'Tiong Bahru Plaza · main entrance', exactLat: 1.2863, exactLng: 103.8271, privacyRadiusM: 0,
  },
  commonwealth: {
    kind: 'home', publicLabel: 'Commonwealth · 2 km privacy zone', publicLat: 1.3100, publicLng: 103.7900,
    exactLabel: 'Caregiver home · Commonwealth Drive (demo)', exactLat: 1.3065, exactLng: 103.8006, privacyRadiusM: 2000,
  },
  bukitMerah: {
    kind: 'meeting-point', publicLabel: 'Bukit Merah Community Hub', publicLat: 1.2824, publicLng: 103.8172,
    exactLabel: 'Bukit Merah Community Hub · lobby', exactLat: 1.2824, exactLng: 103.8172, privacyRadiusM: 0,
  },
  ghimMoh: {
    kind: 'meeting-point', publicLabel: 'Ghim Moh Market', publicLat: 1.3110, publicLng: 103.7882,
    exactLabel: 'Ghim Moh Market & Food Centre', exactLat: 1.3110, exactLng: 103.7882, privacyRadiusM: 0,
  },
  telokBlangah: {
    kind: 'meeting-point', publicLabel: 'Telok Blangah MRT', publicLat: 1.2707, publicLng: 103.8098,
    exactLabel: 'Telok Blangah MRT · Exit A', exactLat: 1.2707, exactLng: 103.8098, privacyRadiusM: 0,
  },
  queenstownLibrary: {
    kind: 'meeting-point', publicLabel: 'Queenstown Public Library', publicLat: 1.2987, publicLng: 103.8055,
    exactLabel: 'Queenstown Public Library · entrance', exactLat: 1.2987, exactLng: 103.8055, privacyRadiusM: 0,
  },
}

const initialisedAt = Date.now()
const hoursFromInitialisation = (hours: number) => new Date(initialisedAt + hours * 60 * 60 * 1000).toISOString()

const initialTasks: Task[] = [
  { id: 'CK-204', title: 'Collect discharge essentials from AH pharmacy counter', category: 'Errands', language: 'English', scheduledAt: hoursFromInitialisation(3), createdAt: hoursFromInitialisation(-2), location: locationCatalog.ah, ownerId: 'C-204', caregiverName: 'Marcus Lim', caregiverPhone: '+65 9123 4567', urgent: false, femalePreferred: false, status: 'Open', points: 40, viaHours: 1, difficulty: 'Light', skill: 'Errands ready', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 1, confirmedVolunteers: [], capacityState: 'Recruiting' },
  { id: 'CK-205', title: 'Escort mum from clinic reception to booked taxi pickup', category: 'Sensitive accompaniment', language: 'Mandarin', scheduledAt: hoursFromInitialisation(1.25), createdAt: hoursFromInitialisation(-5), location: locationCatalog.ah, ownerId: 'C-204', caregiverName: 'Marcus Lim', caregiverPhone: '+65 9123 4567', urgent: true, femalePreferred: true, status: 'Open', points: 60, viaHours: 1.5, difficulty: 'Weightier', skill: 'Safeguarding + accompaniment', volunteer: '', safetyCleared: false, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 2, confirmedVolunteers: [], capacityState: 'Recruiting' },
  { id: 'CK-206', title: 'Set gentle appointment reminders on my phone', category: 'Digital help', language: 'No preference', scheduledAt: hoursFromInitialisation(-26), createdAt: hoursFromInitialisation(-32), location: locationCatalog.remote, ownerId: 'C-204', caregiverName: 'Marcus Lim', caregiverPhone: '+65 9123 4567', urgent: false, femalePreferred: false, status: 'Done', points: 35, viaHours: 0.5, difficulty: 'Skilled', skill: 'Digital help ready', volunteer: 'Arjun L.', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: { submittedAt: '15 Aug 2026 · 3:45 pm SGT', reflection: 'We set three clear reminders and tested each alert together.', verification: 'Verified by AH', verifiedAt: '15 Aug 2026 · 4:20 pm SGT' }, volunteersNeeded: 1, confirmedVolunteers: ['Arjun L.'], capacityState: 'Covered' },
  { id: 'CK-207', title: 'Help complete a non-clinical transport form', category: 'Admin & forms', language: 'Malay', scheduledAt: hoursFromInitialisation(6), createdAt: hoursFromInitialisation(-8 * 24), location: locationCatalog.home, ownerId: 'C-204', caregiverName: 'Marcus Lim', caregiverPhone: '+65 9123 4567', urgent: false, femalePreferred: false, status: 'Open', points: 50, viaHours: 1, difficulty: 'Skilled', skill: 'Forms briefing', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 2, confirmedVolunteers: [], capacityState: 'Recruiting' },
  { id: 'CK-208', title: 'Pick up soft-food groceries for the weekend', category: 'Meals & home', language: 'English', scheduledAt: hoursFromInitialisation(28), createdAt: hoursFromInitialisation(-30), location: locationCatalog.tiongBahru, ownerId: 'C-205', caregiverName: 'Siti Noor', caregiverPhone: '+65 9000 0205', urgent: false, femalePreferred: false, status: 'Open', points: 45, viaHours: 1, difficulty: 'Light', skill: 'Meals & home ready', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 1, confirmedVolunteers: [], capacityState: 'Recruiting' },
  { id: 'CK-209', title: 'Show me how to join a telehealth call', category: 'Digital help', language: 'English', scheduledAt: hoursFromInitialisation(50), createdAt: hoursFromInitialisation(-48), location: locationCatalog.commonwealth, ownerId: 'C-206', caregiverName: 'Daniel Tan', caregiverPhone: '+65 9000 0206', urgent: false, femalePreferred: false, status: 'Open', points: 35, viaHours: 0.5, difficulty: 'Skilled', skill: 'Digital help ready', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 1, confirmedVolunteers: [], capacityState: 'Recruiting' },
  { id: 'CK-210', title: 'Collect printed caregiver programme information', category: 'Errands', language: 'No preference', scheduledAt: hoursFromInitialisation(72), createdAt: hoursFromInitialisation(-54), location: locationCatalog.bukitMerah, ownerId: 'C-207', caregiverName: 'Priya Nair', caregiverPhone: '+65 9000 0207', urgent: false, femalePreferred: false, status: 'Open', points: 40, viaHours: 1, difficulty: 'Light', skill: 'Errands ready', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 1, confirmedVolunteers: [], capacityState: 'Recruiting' },
  { id: 'CK-211', title: 'Buy simple breakfast items from the market', category: 'Meals & home', language: 'Mandarin', scheduledAt: hoursFromInitialisation(-5), createdAt: hoursFromInitialisation(-30), location: locationCatalog.ghimMoh, ownerId: 'C-204', caregiverName: 'Marcus Lim', caregiverPhone: '+65 9123 4567', urgent: false, femalePreferred: false, status: 'Done', points: 45, viaHours: 1, difficulty: 'Light', skill: 'Meals & home ready', volunteer: 'Maya T.', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: { submittedAt: '16 Aug 2026 · 11:10 am SGT', reflection: 'I followed the written list and confirmed the handoff at the agreed meeting point.', verification: 'Pending AH verification' }, volunteersNeeded: 1, confirmedVolunteers: ['Maya T.'], capacityState: 'Covered' },
  { id: 'CK-212', title: 'Meet me at the station and guide me to the shuttle', category: 'Wayfinding', language: 'English', scheduledAt: hoursFromInitialisation(32), createdAt: hoursFromInitialisation(-96), location: locationCatalog.telokBlangah, ownerId: 'C-204', caregiverName: 'Marcus Lim', caregiverPhone: '+65 9123 4567', urgent: false, femalePreferred: false, status: 'Open', points: 45, viaHours: 1, difficulty: 'Light', skill: 'Wayfinding ready', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 1, confirmedVolunteers: [], capacityState: 'Recruiting' },
  { id: 'CK-213', title: 'Help scan and organise two appointment letters', category: 'Admin & forms', language: 'English', scheduledAt: hoursFromInitialisation(44), createdAt: hoursFromInitialisation(-120), location: locationCatalog.queenstownLibrary, ownerId: 'C-207', caregiverName: 'Priya Nair', caregiverPhone: '+65 9000 0207', urgent: false, femalePreferred: false, status: 'Open', points: 50, viaHours: 1, difficulty: 'Skilled', skill: 'Forms briefing', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 1, confirmedVolunteers: [], capacityState: 'Recruiting' },
  { id: 'CK-214', title: 'Sit with dad while I make two essential calls nearby', category: 'Companionship', language: 'Mandarin', scheduledAt: hoursFromInitialisation(30), createdAt: hoursFromInitialisation(-144), location: locationCatalog.home, ownerId: 'C-204', caregiverName: 'Marcus Lim', caregiverPhone: '+65 9123 4567', urgent: false, femalePreferred: false, status: 'Open', points: 55, viaHours: 1, difficulty: 'Weightier', skill: 'Safeguarding + accompaniment', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 2, confirmedVolunteers: ['Nur A.'], capacityState: 'Recruiting' },
  { id: 'CK-215', title: 'Return a borrowed mobility aid to the hospital desk', category: 'Errands', language: 'No preference', scheduledAt: hoursFromInitialisation(78), createdAt: hoursFromInitialisation(-168), location: locationCatalog.ah, ownerId: 'C-204', caregiverName: 'Marcus Lim', caregiverPhone: '+65 9123 4567', urgent: false, femalePreferred: false, status: 'Open', points: 40, viaHours: 1, difficulty: 'Light', skill: 'Errands ready', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null, volunteersNeeded: 1, confirmedVolunteers: [], capacityState: 'Recruiting' },
]

const categories: Category[] = ['Errands', 'Digital help', 'Wayfinding', 'Meals & home', 'Admin & forms', 'Companionship', 'Sensitive accompaniment']
const roleCopy: Record<Role, { label: string; eyebrow: string }> = {
  caregiver: { label: 'Caregiver', eyebrow: '' },
  volunteer: { label: 'Volunteer', eyebrow: 'CHOOSE A TASK THAT FITS' },
  admin: { label: 'AH admin', eyebrow: 'OVERSEE SAFETY & FULFILMENT' },
}
const volunteerReadiness = ['Errands ready', 'Digital help ready', 'Safeguarding + accompaniment']
const volunteerLanguages = ['English', 'Mandarin']

function findScopeExclusions(value: string): ScopeSignal[] {
  const checks: Array<ScopeSignal & { pattern: RegExp }> = [
    { label: 'Possible emergency', guidance: 'Do not wait for ReliefKaki. Call 995 now for a life-threatening emergency.', emergency: true, pattern: /\b(?:emergency|unconscious|not breathing|chest pain|stroke|severe bleeding|suicid(?:e|al)|collapsed)\b/i },
    { label: 'Medication or clinical task', guidance: 'Medication, symptoms, wounds, diagnosis and clinical advice must go to qualified staff.', pattern: /\b(?:medicat(?:e|ion)|medicine|pills?|dosage|dose|insulin|injection|inject|wound|diagnos(?:e|is)|clinical advice|medical advice|take blood pressure)\b/i },
    { label: 'Personal care', guidance: 'Bathing, toileting, dressing and other personal care are outside the student-volunteer role.', pattern: /\b(?:bath(?:e|ing)|shower(?:ing)?|toilet(?:ing)?|diaper|nappy|dress(?:ing)?|personal care|feed(?:ing)?)\b/i },
    { label: 'Lifting or transfer', guidance: 'Lifting, carrying or transferring a person requires an appropriate formal care pathway.', pattern: /\b(?:lift|lifting|transfer(?:ring)?|carry)\s+(?:me|mum|mom|dad|father|mother|patient|him|her|my family member)\b/i },
    { label: 'Money handling', guidance: 'Cash, banking, payment and financial transactions are outside volunteer scope.', pattern: /\b(?:cash|bank(?:ing)?|transfer money|pay(?:ment)?|withdraw|atm|credit card|debit card|pin number|financial transaction)\b/i },
  ]

  return checks.filter((check) => check.pattern.test(value)).map(({ label, guidance, emergency }) => ({ label, guidance, emergency }))
}

function Mark() {
  return <div className="mark" aria-label="ReliefKaki"><span></span><span></span><span></span></div>
}

function Arrow() { return <span className="arrow">↗</span> }

type LegalDocument = 'privacy' | 'terms'

function InstagramIcon() {
  return <svg className="instagram-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.25" /><circle className="instagram-dot" cx="17.4" cy="6.7" r="1" /></svg>
}

function LegalNotice({ kind, onClose }: { kind: LegalDocument; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  const isPrivacy = kind === 'privacy'
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Use'

  return <div className="legal-overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}>
    <section className="legal-dialog" role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <header className="legal-head">
        <div><span>RELIEFKAKI · LEGAL</span><h2 id="legal-title">{title}</h2><p>Effective 16 August 2026</p></div>
        <button ref={closeRef} type="button" aria-label={`Close ${title}`} onClick={onClose}>×</button>
      </header>
      <div className="legal-content">
        {isPrivacy ? <>
          <p className="legal-summary"><b>Your privacy matters.</b> ReliefKaki is currently an interactive concept demo for the SparkX⁺Change caregiver-respite project. It is not connected to Alexandra Hospital production systems and should not be used to submit real personal, medical or emergency information.</p>
          <section><h3>1. What this policy covers</h3><p>This policy explains how the ReliefKaki demo handles information when you browse the website, explore a demo workspace, use location-based task filtering or follow an external link.</p></section>
          <section><h3>2. Information handled by the demo</h3><ul><li><b>Information you enter:</b> text and selections entered into task forms are used to demonstrate the interface. They remain in the page’s temporary browser state and are not submitted to a ReliefKaki backend.</li><li><b>Theme preference:</b> your light or dark mode choice is saved in your browser’s local storage.</li><li><b>Optional location:</b> if you enable “Track my location,” the browser supplies approximate coordinates while the page is open so tasks can be filtered by distance. ReliefKaki does not store those coordinates.</li><li><b>Standard technical data:</b> the website host and embedded or linked services may receive normal request data such as IP address, browser type and access time under their own policies.</li></ul></section>
          <section><h3>3. How information is used</h3><p>Information is used only to operate the demo experience, display complete task details, apply requested preferences, calculate distance filters and protect the service against misuse. The demo does not sell personal information or use it for advertising.</p></section>
          <section><h3>4. Third-party services</h3><p>ReliefKaki is hosted on GitHub Pages and embeds Google Maps for location previews. The Instagram link opens an external SparkX⁺Change account. GitHub, Google and Instagram may process technical data under their own privacy terms. Opening those services is optional.</p></section>
          <section><h3>5. Sharing and retention</h3><p>The current demo has no ReliefKaki account database and does not retain task-form entries after the page is refreshed or closed. Browser preferences remain on your device until you clear site data. We may disclose information if required by law or necessary to protect users and the service, but the current demo is not designed to receive sensitive records.</p></section>
          <section><h3>6. Your choices and safety</h3><ul><li>Do not enter real names, phone numbers, addresses, identity numbers, medical details or confidential care information.</li><li>Keep location tracking off unless you want to test the distance filter. You can disable it at any time in Settings or through your browser permissions.</li><li>Clear this site’s local storage to remove the saved theme preference.</li><li>Never use Instagram direct messages to send health or other sensitive personal information.</li></ul></section>
          <section><h3>7. Future pilots and policy changes</h3><p>A live pilot would require separate approvals, security controls, data-retention rules and a revised privacy notice before real participant data is collected. We may update this policy as the concept develops and will change the effective date when we do.</p></section>
          <section><h3>8. Contact</h3><p>For general privacy questions about this concept, contact SparkX⁺Change through its official Instagram profile. Please do not include personal, medical or emergency information in your message.</p></section>
        </> : <>
          <p className="legal-summary"><b>Please use this demo responsibly.</b> These Terms of Use govern access to the ReliefKaki concept website. By using it, you agree to these terms. If you do not agree, please stop using the site.</p>
          <section><h3>1. Concept-demo status</h3><p>ReliefKaki is an interactive prototype created for the SparkX⁺Change caregiver-respite project. It is not an operational Alexandra Hospital service, does not create a caregiver-volunteer relationship and cannot arrange real care, transport, appointments or volunteer assignments.</p></section>
          <section><h3>2. Not medical or emergency support</h3><p>The site does not provide medical advice, diagnosis, treatment, personal care or emergency response. Do not rely on it for urgent decisions. In Singapore, call <b>995</b> for a life-threatening emergency or contact an appropriate qualified service provider.</p></section>
          <section><h3>3. Demo access and acceptable use</h3><ul><li>Use only the supplied fictional demo profiles and non-sensitive sample information.</li><li>Do not attempt to identify, contact or impersonate real caregivers, volunteers, hospital staff or other people.</li><li>Do not probe for vulnerabilities, disrupt the site, automate abusive traffic, upload malicious material or bypass access controls.</li><li>Do not present demo outputs, task statuses, maps, points or receipts as real hospital or volunteer records.</li></ul></section>
          <section><h3>4. Privacy and submitted content</h3><p>You are responsible for content you enter. Do not submit real personal, health, financial or confidential information. The current demo processes entries temporarily in your browser as described in the Privacy Policy.</p></section>
          <section><h3>5. Intellectual property</h3><p>The ReliefKaki name, interface, written content, graphics and project materials are owned by or licensed to SparkX⁺Change unless otherwise stated. You may view and demonstrate the site for personal, educational and evaluation purposes. You may not copy, sell, publish, remove notices from or create misleading derivative uses of the materials without permission.</p></section>
          <section><h3>6. Third-party services and links</h3><p>Maps, hosting and social links are provided by third parties. Their terms and privacy policies apply when you use them. ReliefKaki is not responsible for the availability, accuracy or practices of external services.</p></section>
          <section><h3>7. Availability and disclaimer</h3><p>The site is provided “as is” and “as available” for concept evaluation. Features may be changed, suspended or removed without notice. To the fullest extent permitted by law, SparkX⁺Change disclaims implied warranties and is not liable for loss arising from reliance on demo content, unavailable features or misuse of the site.</p></section>
          <section><h3>8. Suspension, changes and governing law</h3><p>Access may be restricted for misuse or security reasons. We may update these terms as the project develops. These terms are governed by the laws of Singapore, and any dispute is subject to the jurisdiction of the Singapore courts.</p></section>
          <section><h3>9. Contact</h3><p>For general questions or permission requests, contact SparkX⁺Change through its official Instagram profile. Do not send sensitive personal or health information through Instagram.</p></section>
        </>}
      </div>
      <div className="legal-foot"><a href="https://www.instagram.com/spark.x.change/" target="_blank" rel="noreferrer"><InstagramIcon /> @spark.x.change</a><button className="button button-dark" type="button" onClick={onClose}>I understand</button></div>
    </section>
  </div>
}

function SiteFooter({ portal = false }: { portal?: boolean }) {
  const [legalDocument, setLegalDocument] = useState<LegalDocument | null>(null)
  const year = new Date().getFullYear()

  return <>
    <footer className={`site-footer ${portal ? 'portal-footer' : ''}`}>
      <div className="footer-brand"><a className="brand" href="#top"><Mark /><span>relief<span className="brand-light">kaki</span></span></a><span>Clear tasks. Visible relief. Managed with care.</span></div>
      <div className="footer-meta"><b>© {year} SparkX⁺Change. All rights reserved.</b><span>ReliefKaki · Alexandra Hospital · interactive concept demo</span></div>
      <nav className="footer-links" aria-label="Legal and social links"><button type="button" onClick={() => setLegalDocument('privacy')}>Privacy Policy</button><button type="button" onClick={() => setLegalDocument('terms')}>Terms of Use</button><a href="https://www.instagram.com/spark.x.change/" target="_blank" rel="noreferrer" aria-label="SparkX Change on Instagram"><InstagramIcon /><span>Instagram</span></a></nav>
    </footer>
    {legalDocument && <LegalNotice kind={legalDocument} onClose={() => setLegalDocument(null)} />}
  </>
}

function Badge({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'green' | 'amber' | 'red' | 'blue' }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  const nextTheme = theme === 'light' ? 'dark' : 'light'
  return <button className="theme-toggle" type="button" onClick={() => onChange(nextTheme)} aria-label={`Switch to ${nextTheme} mode`}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><b>{theme === 'light' ? 'Dark' : 'Light'}</b></button>
}

function SingaporeClock({ now }: { now: Date }) {
  return <div className="singapore-clock" aria-label="Current Singapore time"><span><i></i> LIVE · SINGAPORE</span><time dateTime={now.toISOString()}>{formatSingaporeClock(now)}</time></div>
}

function SettingsIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z" /><path d="M19.1 13.7c.05-.55.05-1.05 0-1.6l2-1.55-2-3.45-2.5 1a8.3 8.3 0 0 0-1.4-.8L14.85 4h-4l-.4 3.3c-.5.2-.95.5-1.4.8l-2.5-1-2 3.45 2.05 1.55c-.05.55-.05 1.05 0 1.6l-2.05 1.55 2 3.45 2.5-1c.45.35.9.6 1.4.8l.4 3.3h4l.35-3.3c.5-.2.95-.45 1.4-.8l2.5 1 2-3.45-2-1.55Z" /></svg>
}

type LocationTrackingStatus = 'off' | 'requesting' | 'active' | 'blocked' | 'unavailable'

function locationTrackingCopy(status: LocationTrackingStatus) {
  if (status === 'active') return 'Live location is updating'
  if (status === 'requesting') return 'Waiting for location permission'
  if (status === 'blocked') return 'Location access is blocked'
  if (status === 'unavailable') return 'Location tracking is unavailable'
  return 'Location tracking is off'
}

function PortalMenu({ role, activeSection, onSelect }: { role: Role; activeSection: PortalSectionId; onSelect: (section: PortalSectionId) => void }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const sections = portalSectionsForRole(role)

  useEffect(() => {
    if (!open) return
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('keydown', closeWithEscape)
    return () => document.removeEventListener('keydown', closeWithEscape)
  }, [open])

  return <>
    <button ref={triggerRef} className="portal-menu-trigger" type="button" aria-label="Open workspace menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="portal-section-menu" onClick={() => setOpen(true)}><span></span><span></span><span></span></button>
    {open && <div className="portal-menu-layer">
      <button className="portal-menu-scrim" type="button" aria-label="Close workspace menu" onClick={() => setOpen(false)}></button>
      <aside className="portal-menu-drawer" id="portal-section-menu" role="dialog" aria-modal="true" aria-labelledby="portal-menu-title">
        <div className="portal-menu-head"><div><span>{roleCopy[role].label.toUpperCase()} WORKSPACE</span><h2 id="portal-menu-title">Sections</h2></div><button type="button" aria-label="Close workspace menu" onClick={() => setOpen(false)}>×</button></div>
        <nav className="portal-section-links" aria-label={`${roleCopy[role].label} sections`}>{sections.map((section, index) => <button type="button" key={section.id} className={activeSection === section.id ? 'active' : ''} aria-current={activeSection === section.id ? 'page' : undefined} onClick={() => { onSelect(section.id); setOpen(false) }}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{section.label}</b><small>{section.description}</small></div><em>→</em></button>)}</nav>
        <p className="portal-menu-foot">Each section opens as its own focused workspace page.</p>
      </aside>
    </div>}
  </>
}

function AccountSettings({ session, role, onHome, onSignOut, trackOwnLocation, trackingStatus, onTrackOwnLocationChange }: { session: AuthSession; role: Role; onHome: () => void; onSignOut: () => void; trackOwnLocation: boolean; trackingStatus: LocationTrackingStatus; onTrackOwnLocationChange: (enabled: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeWithEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [open])

  return <div className="account-settings" ref={rootRef}>
    <button ref={triggerRef} className="settings-trigger" type="button" aria-label="Open profile and settings" aria-haspopup="dialog" aria-expanded={open} aria-controls="profile-settings-panel" onClick={() => setOpen((current) => !current)}><SettingsIcon /></button>
    {open && <section className="settings-popover" id="profile-settings-panel" role="dialog" aria-labelledby="profile-settings-title">
      <div className="settings-popover-head"><div><span>ACCOUNT</span><h2 id="profile-settings-title">Profile & settings</h2></div><button type="button" aria-label="Close profile and settings" onClick={() => setOpen(false)}>×</button></div>
      <div className="profile-summary"><div className="profile-avatar">{session.name.slice(0, 1)}</div><div><b>{session.name}</b><span>{session.email}</span></div></div>
      <dl className="profile-details">
        <div><dt>Account ID</dt><dd>{session.id}</dd></div>
        <div><dt>Workspace</dt><dd>{roleCopy[role].label}</dd></div>
        <div><dt>Privacy</dt><dd>{session.assurance}</dd></div>
      </dl>
      <label className="location-tracking-setting">
        <span><b>Track my location</b><small>{locationTrackingCopy(trackingStatus)}</small></span>
        <input type="checkbox" checked={trackOwnLocation} onChange={(event) => onTrackOwnLocationChange(event.target.checked)} />
      </label>
      <p className="location-tracking-note">Used only while this page is open to filter tasks by distance from you.</p>
      <div className="profile-actions"><button className="button button-dark" type="button" onClick={onHome}>Back to homepage <Arrow /></button><button className="button button-outline" type="button" onClick={onSignOut}>Sign out</button></div>
    </section>}
  </div>
}

type VolunteerMapTools = {
  verifiedPoints: number
  verifiedHours: number
  reflections: Record<string, string>
  onAcceptTask: (id: string) => void
  onReflectionChange: (id: string, value: string) => void
  onCompleteTask: (id: string) => void
}

function DatabaseRoadmapNotice({ role }: { role: 'caregiver' | 'volunteer' }) {
  return <aside className={`database-roadmap ${role}`} aria-label="Planned shared task database">
    <span className="database-roadmap-icon" aria-hidden="true">▤</span>
    <div><p>NEXT IMPLEMENTATION · SHARED TASK DATABASE</p><b>{role === 'caregiver' ? 'Every caregiver request will feed one live volunteer task pool.' : 'This map will read every approved caregiver request from one live source.'}</b><small>{role === 'caregiver' ? 'For production, we will securely store requests from all caregiver accounts in a shared database, then synchronise approved, open tasks to the volunteer dashboard in real time.' : 'For production, a secure shared database will keep caregiver-created tasks, volunteer offers and status updates synchronised in real time. This prototype currently demonstrates that flow with representative in-browser data.'}</small></div>
    <Badge tone="blue">Planned data layer</Badge>
  </aside>
}

function TaskMap({ tasks, role, now, ownLocation, trackingStatus, onCreateTask, volunteerTools }: { tasks: Task[]; role: Role; now: Date; ownLocation: Coordinates | null; trackingStatus: LocationTrackingStatus; onCreateTask?: () => void; volunteerTools?: VolunteerMapTools }) {
  const [selectedId, setSelectedId] = useState('')
  const [filters, setFilters] = useState<TaskMapFilters>({ category: 'All', status: 'All', openedFrom: '', openedTo: '', locationMode: 'All', specificLocation: '', radiusKm: 'All' })
  const availableTasks = tasks.filter((task) => !task.referralOnly)
  const visibleTasks = availableTasks.map((task) => ({ task, location: taskLocationForRole(task.location, role) }))
  const categoryOptions = Array.from(new Set(visibleTasks.map(({ task }) => task.category)))
  const statusOptions = Array.from(new Set(visibleTasks.map(({ task }) => task.status)))
  const locationOptions = Array.from(new Set(visibleTasks.filter(({ task }) => task.location.kind !== 'remote').map(({ location }) => location.label)))
  const normalizedLocation = filters.specificLocation.trim().toLowerCase()
  const specificMatch = visibleTasks.find(({ location }) => normalizedLocation && (location.label.toLowerCase() === normalizedLocation || location.label.toLowerCase().includes(normalizedLocation)))
  const filteredModels = filterTaskMap(visibleTasks.map(({ task, location }) => ({
    ...task,
    lat: location.lat,
    lng: location.lng,
    locationLabel: location.label,
  })), { ...filters, specificAnchor: specificMatch ? { lat: specificMatch.location.lat, lng: specificMatch.location.lng } : null }, ownLocation)
  const mapTasks = filteredModels.map((model) => model as Task & { lat: number; lng: number; locationLabel: string })
  const selectedTask = mapTasks.find((task) => task.id === selectedId) ?? mapTasks[0]
  const selectedLocation = selectedTask ? taskLocationForRole(selectedTask.location, role) : null
  const isRemote = selectedTask?.location.kind === 'remote'
  const mapUrl = selectedTask && selectedLocation ? `https://maps.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&z=16&output=embed` : ''
  const mapsLink = selectedLocation ? `https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}` : ''
  const updateFilter = <K extends keyof TaskMapFilters>(key: K, value: TaskMapFilters[K]) => setFilters((current) => ({ ...current, [key]: value }))
  const selectedMatchGaps = selectedTask && role === 'volunteer' ? volunteerMatchGaps(
    { requiredSkill: selectedTask.skill, taskLanguage: selectedTask.language },
    { readiness: volunteerReadiness, languages: volunteerLanguages },
  ) : []
  const selectedAction = selectedTask && role === 'volunteer' ? volunteerTaskAction({
    status: selectedTask.status,
    safetyCleared: selectedTask.safetyCleared,
    matchGaps: selectedMatchGaps,
    volunteer: selectedTask.volunteer,
    confirmedByCurrent: selectedTask.confirmedVolunteers.includes('Maya T.'),
  }) : null
  const selectedContact = selectedTask && role === 'volunteer' ? taskContactForVolunteer({ caregiverName: selectedTask.caregiverName, caregiverPhone: selectedTask.caregiverPhone }) : null

  return <section className="task-map-section" aria-labelledby="task-map-title">
    <div className="task-map-head"><div><h3 id="task-map-title">{role === 'volunteer' ? 'Volunteer task map' : role === 'admin' ? 'Operations task map' : 'Your task map'}</h3><p>{role === 'caregiver' ? 'Filter your tasks, select one from the scrollable list, and see its exact service location.' : role === 'volunteer' ? 'Your single place to browse every unexpired caregiver task, check fit and offer to help.' : 'Filter tasks and review each accountable operational location.'}</p></div><div className="task-map-head-actions"><Badge tone="green">{mapTasks.length} of {availableTasks.length} tasks</Badge>{onCreateTask && <button className="button button-outline compact-button" type="button" onClick={onCreateTask}>Create a task</button>}</div></div>
    <div className="task-map-filters" aria-label="Task filters">
      <label>Category<select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}><option>All</option>{categoryOptions.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label>Status<select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}><option>All</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
      <label>Opened from<input type="date" value={filters.openedFrom} onChange={(event) => updateFilter('openedFrom', event.target.value)} /></label>
      <label>Opened to<input type="date" value={filters.openedTo} min={filters.openedFrom || undefined} onChange={(event) => updateFilter('openedTo', event.target.value)} /></label>
      <label>Location<select value={filters.locationMode} onChange={(event) => updateFilter('locationMode', event.target.value as TaskMapFilters['locationMode'])}><option>All</option><option>Own location</option><option>Specific location</option></select></label>
      {filters.locationMode === 'Specific location' && <label className="specific-location-filter">Specific location<input list="task-location-options" type="search" placeholder="e.g. Redhill MRT" value={filters.specificLocation} onChange={(event) => updateFilter('specificLocation', event.target.value)} /><datalist id="task-location-options">{locationOptions.map((location) => <option key={location} value={location} />)}</datalist></label>}
      <label>Within<select value={filters.radiusKm} onChange={(event) => updateFilter('radiusKm', event.target.value)} disabled={filters.locationMode === 'All'}><option>All</option><option value="1">1 km</option><option value="2">2 km</option><option value="5">5 km</option><option value="10">10 km</option><option value="20">20 km</option></select></label>
      {filters.locationMode === 'Own location' && <p className={`filter-location-status ${trackingStatus}`}>{trackingStatus === 'active' ? '● Using your live location' : trackingStatus === 'off' ? 'Enable location tracking in settings to use this filter.' : locationTrackingCopy(trackingStatus)}</p>}
      <button className="clear-filters" type="button" onClick={() => setFilters({ category: 'All', status: 'All', openedFrom: '', openedTo: '', locationMode: 'All', specificLocation: '', radiusKm: 'All' })}>Clear filters</button>
    </div>
    {selectedTask && selectedLocation ? <div className="task-map-layout">
      <div className="task-map-list" role="list" aria-label="Select a task location">{mapTasks.map((task) => {
        const location = taskLocationForRole(task.location, role)
        const selected = task.id === selectedTask.id
        return <button type="button" role="listitem" className={selected ? 'selected' : ''} key={task.id} onClick={() => setSelectedId(task.id)} aria-pressed={selected}>
          <span><b>{taskDisplayLabel(task.id)}</b><em>{task.status}</em></span>
          <strong>{task.title}</strong>
          <small>◷ {formatSingaporeDateTime(task.scheduledAt)}</small>
          <small>⌖ {location.label}</small>
          {role === 'volunteer' && <small>☎ {task.caregiverName} · {task.caregiverPhone}</small>}
          {role === 'volunteer' && <small>✦ {task.points} impact points · {task.viaHours}h service estimate</small>}
          <small>◎ {task.confirmedVolunteers.length}/{task.volunteersNeeded} confirmed · {taskWaitLabel(task.createdAt, now)}</small>
        </button>
      })}</div>
      <div className="google-map-panel">
        {isRemote ? <div className="remote-map-state"><span>⌂</span><h4>Remote task</h4><p>No travel or caregiver address is required. The task is completed through an approved online handoff.</p></div> : <iframe title={`Google Map for ${taskDisplayLabel(selectedTask.id)}: ${selectedLocation.label}`} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
        <div className="map-caption"><div><span>{selectedLocation.precision}</span><b>{selectedLocation.label}</b><small>{formatSingaporeDateTime(selectedTask.scheduledAt)} · {selectedTask.confirmedVolunteers.length} of {selectedTask.volunteersNeeded} volunteers confirmed</small></div>{!isRemote && <a href={mapsLink} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>}</div>
      </div>
    </div> : <div className="task-map-empty"><b>No tasks match these filters.</b><span>Try widening the date or distance, or choose All.</span></div>}
    {role === 'volunteer' && selectedTask && selectedLocation && selectedAction && selectedContact && volunteerTools && <article className="volunteer-map-detail" aria-live="polite">
      <div className="volunteer-map-detail-copy">
        <div className="task-card-top"><div>{selectedTask.urgent && <Badge tone="red">Admin triage</Badge>}{selectedTask.femalePreferred && <Badge tone="amber">Female support requested</Badge>}<Badge tone={selectedAction.state === 'offer' ? 'green' : selectedAction.state === 'locked' ? 'amber' : 'blue'}>{selectedAction.state === 'offer' ? 'Eligible to offer' : selectedAction.label}</Badge></div><span>{taskDisplayLabel(selectedTask.id)} · {selectedTask.status}</span></div>
        <p className="task-category">{selectedTask.category} · {selectedTask.difficulty}</p>
        <h4>{selectedTask.title}</h4>
        <div className="selected-task-facts"><span>◷ {formatSingaporeDateTime(selectedTask.scheduledAt)}</span><span>⌖ {selectedLocation.label}</span><span>◉ {selectedTask.language === 'No preference' ? 'Any conversation language' : `${selectedTask.language} conversation`}</span><span>✓ {selectedTask.skill}</span></div>
        <div className="task-contact map-task-contact"><span>CAREGIVER CONTACT</span><b>{selectedContact.displayName}</b><a href={`tel:${selectedContact.contactNumber.replace(/\s/g, '')}`}>{selectedContact.contactNumber}</a><small>Complete contact details are shown here for task coordination.</small></div>
        {selectedTask.femalePreferred && <p className="boundary-callout">No personal care or lifting. AH confirms that this is a bounded accompaniment task before releasing offers.</p>}
      </div>
      <div className="volunteer-map-decision">
        <p className="eyebrow">TASK VALUE & ACTION</p>
        <div className="map-reward-row"><div><b>{selectedTask.points}</b><small>impact points after AH verification</small></div><div><b>{selectedTask.viaHours}h</b><small>estimated service time</small></div><div><b>{selectedTask.confirmedVolunteers.length}/{selectedTask.volunteersNeeded}</b><small>volunteers confirmed</small></div></div>
        <div className={`map-eligibility ${selectedAction.state}`}><b>{selectedAction.state === 'offer' ? 'Ready to help' : selectedAction.label}</b><span>{selectedAction.detail}</span></div>
        {selectedAction.state === 'offer' ? <button className="button button-dark full map-offer-button" type="button" onClick={() => volunteerTools.onAcceptTask(selectedTask.id)}>Offer to help <Arrow /></button> : selectedAction.state === 'complete' ? <div className="completion-form map-completion-form"><label>Private completion reflection<textarea aria-label={`Reflection for ${taskDisplayLabel(selectedTask.id)}`} placeholder="What was completed, and was any follow-up needed?" value={volunteerTools.reflections[selectedTask.id] || ''} onChange={(event) => volunteerTools.onReflectionChange(selectedTask.id, event.target.value)} /></label><button className="button button-dark full" type="button" disabled={!(volunteerTools.reflections[selectedTask.id] || '').trim()} onClick={() => volunteerTools.onCompleteTask(selectedTask.id)}>Submit completion receipt <Arrow /></button><small>Hours and points stay pending until AH verifies this record.</small></div> : <button className="button button-muted full" type="button" disabled>{selectedAction.label}</button>}
      </div>
    </article>}
  </section>
}

function PublicHome({ theme, onThemeChange, onOpenPortal }: { theme: Theme; onThemeChange: (theme: Theme) => void; onOpenPortal: () => void }) {
  const [judgeGuideOpen, setJudgeGuideOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      return shouldShowJudgeGuide(window.localStorage.getItem(judgeGuideStorageKey))
    } catch {
      return true
    }
  })
  const dismissJudgeGuide = useCallback(() => {
    try {
      window.localStorage.setItem(judgeGuideStorageKey, '1')
    } catch {
      // The guide still closes when browser storage is unavailable.
    }
    setJudgeGuideOpen(false)
  }, [])

  return <main className="public-page">
    <nav className="public-nav" aria-label="Primary navigation">
      <a className="brand" href="#top"><Mark /><span>relief<span className="brand-light">kaki</span></span></a>
      <div className="public-links"><a href="#how-it-works">How it works</a><a href="#safety">Safety</a><a href="#roles">Who it is for</a></div>
      <div className="nav-actions"><ThemeToggle theme={theme} onChange={onThemeChange} /><button className="button button-dark" type="button" onClick={onOpenPortal}>Access portal <Arrow /></button></div>
    </nav>

    <section className="hero public-hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">ALEXANDRA HOSPITAL · CAREGIVER RESPITE PILOT</p>
        <h1>One small ask.<br /><em>One lighter day.</em></h1>
        <p className="lede">ReliefKaki turns a practical burden into a bounded task with clear instructions, contact details and location. Trained student volunteers can offer support while hospital administrators retain oversight.</p>
        <div className="hero-actions"><button className="button button-dark" type="button" onClick={onOpenPortal}>Sign in to ReliefKaki <Arrow /></button><a className="button-link" href="#how-it-works">See how it works <span>↓</span></a></div>
        <div className="trust-row"><span><b>01</b> complete request</span><i></i><span><b>02</b> eligible offer</span><i></i><span><b>03</b> verified receipt</span></div>
      </div>
      <div className="hero-visual">
        <img src={heroImage} alt="A caregiver and student volunteer reviewing a practical checklist together" />
        <div className="image-wash"></div>
        <div className="floating-card"><span className="soft-label">OPEN TASK BOARD</span><strong>“One clear ask.<br />Every detail ready.”</strong><div><span className="mini-dot"></span> Volunteers can review the full task before offering</div></div>
        <div className="hero-stamp"><span>RELIEF</span><b>24</b><span>KAKI</span></div>
      </div>
    </section>

    <section className="public-section process-section" id="how-it-works">
      <div className="section-intro"><p className="eyebrow">HOW THE SERVICE WORKS</p><h2>A clear handoff, not an unmoderated marketplace.</h2><p>Volunteers can review every open task and its complete details. An offer becomes an assignment only after an AH administrator checks the match.</p></div>
      <ol className="process-grid">
        <li><span>01</span><h3>Ask clearly</h3><p>A caregiver posts the complete instructions, contact details, timing and exact service location.</p></li>
        <li><span>02</span><h3>Check fit</h3><p>Training, availability, scope and safeguarding are checked before a volunteer can be confirmed.</p></li>
        <li><span>03</span><h3>Complete safely</h3><p>The task closes with a private reflection and an AH-reviewed completion receipt.</p></li>
      </ol>
    </section>

    <section className="role-explainer" id="roles">
      <div className="section-intro compact"><p className="eyebrow">THREE RESPONSIBILITIES</p><h2>One service, three protected workspaces.</h2></div>
      <div className="role-cards">
        <article><span className="role-icon">C</span><p className="eyebrow">CAREGIVER</p><h3>Control the ask</h3><p>Post one bounded practical task with the full instructions, contact details and location, then follow its status.</p></article>
        <article><span className="role-icon">V</span><p className="eyebrow">VOLUNTEER</p><h3>Choose a safe fit</h3><p>Filter and map every unexpired open task from all caregivers, then offer where your readiness fits.</p></article>
        <article><span className="role-icon">AH</span><p className="eyebrow">HOSPITAL ADMIN</p><h3>Own the safeguards</h3><p>Triage scope, approve matches, monitor readiness, redirect excluded work and verify completion records.</p></article>
      </div>
    </section>

    <section className="safety-section" id="safety"><div><p className="eyebrow">THE RELIEFKAKI PROMISE</p><h2>Warmth needs<br /><em>clear edges.</em></h2></div><div className="safety-grid"><article><span>↳</span><h3>We do</h3><p>Errands, meals, reminder setup, wayfinding, basic forms, companionship and bounded accompaniment.</p></article><article><span>×</span><h3>We do not</h3><p>Medication, personal care, clinical advice, lifting or transfers, finances, diagnosis or emergency response.</p></article><article><span>!</span><h3>We escalate</h3><p>Urgent and sensitive requests go to a named AH administrator for review, referral and recovery.</p></article></div></section>

    <section className="access-banner"><div><p className="eyebrow">AUTHENTICATED OPERATIONS</p><h2>Ready to enter your workspace?</h2><p>Caregiver, volunteer and AH-admin tools stay behind a role-bound sign-in.</p></div><button className="button button-dark" type="button" onClick={onOpenPortal}>Access the demo portal <Arrow /></button></section>

    <SiteFooter />
    <JudgeExpoGuide open={judgeGuideOpen} onOpen={() => setJudgeGuideOpen(true)} onDismiss={dismissJudgeGuide} />
  </main>
}

function LoginPage({ theme, onThemeChange, onBack, onAuthenticated }: { theme: Theme; onThemeChange: (theme: Theme) => void; onBack: () => void; onAuthenticated: (session: AuthSession) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const session = authenticateDemo(email, password)
    if (!session) {
      setError('Those demo details do not match an account. Choose a demo profile below and try again.')
      return
    }
    setError('')
    onAuthenticated(session)
  }

  function chooseDemo(index: number) {
    const account = demoAccounts[index]
    setEmail(account.email)
    setPassword(account.password)
    setError('')
    document.getElementById('email')?.focus()
  }

  return <main className="login-page">
    <nav className="public-nav login-nav" aria-label="Sign-in navigation">
      <button className="brand brand-button" type="button" onClick={onBack}><Mark /><span>relief<span className="brand-light">kaki</span></span></button>
      <div className="nav-actions"><ThemeToggle theme={theme} onChange={onThemeChange} /><button className="button button-outline" type="button" onClick={onBack}>Back to website</button></div>
    </nav>
    <section className="login-layout">
      <div className="login-context"><p className="eyebrow">PROTECTED WORKSPACES</p><h1>Sign in to the role you have been approved for.</h1><p>ReliefKaki uses role-bound access: caregivers create task requests, volunteers browse every open task, and AH administrators oversee safety and completion.</p><ul><li><span>✓</span> No role switching after sign-in</li><li><span>✓</span> Complete task details for volunteers</li><li><span>✓</span> Clear sign-out and account identity at all times</li></ul><div className="prototype-note"><b>Interactive prototype</b><span>This screen demonstrates authentication and authorization UX. It is not connected to Alexandra Hospital production identity systems.</span></div></div>
      <div className="login-card">
        <div><p className="eyebrow">RELIEFKAKI ACCESS</p><h2>Welcome back</h2><p>Use a demo profile below, then sign in.</p></div>
        <form onSubmit={signIn} noValidate>
          <label htmlFor="email">Email address<input id="email" name="email" type="email" autoComplete="username" inputMode="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} required /></label>
          <label htmlFor="password">Password<span className="password-field"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-pressed={showPassword}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark full" type="submit">Sign in securely <Arrow /></button>
        </form>
        <div className="demo-access"><span>Choose a demo profile</span>{demoAccounts.map((account, index) => <button type="button" key={account.role} onClick={() => chooseDemo(index)}><b>{account.label}</b><small>{account.role === 'caregiver' ? 'Create and track requests' : account.role === 'volunteer' ? 'Open tasks and recognition' : 'Triage and account oversight'}</small><em>Use details →</em></button>)}</div>
        <p className="login-help">Need access? In a live pilot, an AH programme administrator would create or approve your account.</p>
      </div>
    </section>
    <SiteFooter />
  </main>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [session, setSession] = useState<AuthSession | null>(null)
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme(
    typeof window === 'undefined' ? null : window.localStorage.getItem('reliefkaki-theme'),
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  ))
  const role: Role = session?.role ?? 'caregiver'
  const [portalSection, setPortalSection] = useState<PortalSectionId>('tasks')
  const activePortalSection = resolvePortalSection(role, portalSection)
  const currentPortalPage = portalSectionsForRole(role).find((section) => section.id === activePortalSection) ?? portalSectionsForRole(role)[0]
  const [now, setNow] = useState(() => new Date())
  const [tasks, setTasks] = useState<Task[]>(() => autoEscalateTasks(initialTasks, new Date().toISOString()))
  const [trackOwnLocation, setTrackOwnLocation] = useState(false)
  const [trackingStatus, setTrackingStatus] = useState<LocationTrackingStatus>('off')
  const [ownLocation, setOwnLocation] = useState<Coordinates | null>(null)
  const [category, setCategory] = useState<Category>('Errands')
  const [language, setLanguage] = useState<TaskLanguage>('No preference')
  const [request, setRequest] = useState('Pick up a simple dinner and leave it at the ward counter')
  const [scheduledInput, setScheduledInput] = useState(() => singaporeInputFromDate(Date.now() + 3 * 60 * 60 * 1000))
  const [locationKey, setLocationKey] = useState<LocationKey>('ah')
  const [scheduleError, setScheduleError] = useState('')
  const [caregiverName, setCaregiverName] = useState('Marcus Lim')
  const [caregiverPhone, setCaregiverPhone] = useState('+65 9123 4567')
  const [contactError, setContactError] = useState('')
  const [femalePreferred, setFemalePreferred] = useState(false)
  const [urgent, setUrgent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedForReferral, setSubmittedForReferral] = useState(false)
  const [adminNotice, setAdminNotice] = useState('')
  const [reflections, setReflections] = useState<Record<string, string>>({})
  const [accountState, setAccountState] = useState<Record<string, string>>({ 'MC-204': 'Active', 'VL-031': 'Active', 'VL-044': 'Training due' })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('reliefkaki-theme', theme)
  }, [theme])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [screen, activePortalSection])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const reconcile = () => {
      const timestamp = new Date().toISOString()
      setTasks((current) => {
        const next = autoEscalateTasks(current, timestamp)
        return next.some((task, index) => task !== current[index]) ? next : current
      })
    }
    const timer = window.setInterval(reconcile, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!trackOwnLocation) {
      setTrackingStatus('off')
      setOwnLocation(null)
      return
    }
    if (!navigator.geolocation) {
      setTrackingStatus('unavailable')
      return
    }
    setTrackingStatus('requesting')
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setOwnLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        setTrackingStatus('active')
      },
      (error) => {
        setOwnLocation(null)
        setTrackingStatus(error.code === error.PERMISSION_DENIED ? 'blocked' : 'unavailable')
      },
      { enableHighAccuracy: true, maximumAge: 15_000, timeout: 15_000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [trackOwnLocation])

  const capacityAlerts = tasks.filter((task) => task.status === 'Escalated')
  const closedCapacityTasks = tasks.filter((task) => task.status === 'Closed' && task.caregiverNotice && task.ownerId === (session?.id ?? 'C-204'))
  const openCount = tasks.filter((task) => task.status === 'Open' || task.status === 'Escalated').length
  const volunteerMarketplaceTasks = openVolunteerTasks(tasks, now.toISOString())
  const volunteerDashboardTasks = tasks.filter((task) =>
    volunteerMarketplaceTasks.some((openTask) => openTask.id === task.id)
    || (task.volunteer === 'Maya T.' && (task.status === 'Review' || task.status === 'Matched')),
  )
  const completionReceipts = tasks.filter((task) => task.completion)
  const pendingCompletions = completionReceipts.filter((task) => task.completion?.verification === 'Pending AH verification').length
  const verifiedCompletions = completionReceipts.filter((task) => task.completion?.verification === 'Verified by AH')
  const verifiedServiceHours = verifiedCompletions.reduce((total, task) => total + task.viaHours, 0)
  const verifiedRecognitionPoints = verifiedCompletions.reduce((total, task) => total + task.points, 0)
  const verifiedForMaya = tasks.filter((task) => task.volunteer === 'Maya T.' && task.completion?.verification === 'Verified by AH')
  const verifiedPoints = 620 + verifiedForMaya.reduce((total, task) => total + task.points, 0)
  const verifiedHours = 8.5 + verifiedForMaya.reduce((total, task) => total + task.viaHours, 0)
  const points = useMemo(() => {
    const base: Record<Category, number> = { Errands: 40, 'Digital help': 35, Wayfinding: 45, 'Meals & home': 45, 'Admin & forms': 50, Companionship: 55, 'Sensitive accompaniment': 60 }
    return base[category]
  }, [category])
  const viaHours = category === 'Digital help' ? 0.5 : category === 'Sensitive accompaniment' ? 1.5 : 1
  const scopeSignals = useMemo(() => findScopeExclusions(request), [request])
  const nextTaskId = `CK-${204 + tasks.length}`
  const draftContact = taskContactForVolunteer({ caregiverName, caregiverPhone })
  const draftScheduleLabel = useMemo(() => {
    try { return formatSingaporeDateTime(singaporeInputToIso(scheduledInput)) } catch { return 'Choose a valid Singapore time' }
  }, [scheduledInput])
  const draftVolunteerLocation = taskLocationForRole(locationCatalog[locationKey], 'volunteer')

  function postTask() {
    let scheduledAt = ''
    try {
      scheduledAt = singaporeInputToIso(scheduledInput)
    } catch {
      setScheduleError('Choose a valid date and time in Singapore time.')
      return
    }
    if (new Date(scheduledAt).getTime() <= Date.now()) {
      setScheduleError('Choose a future task time in Singapore time.')
      return
    }
    setScheduleError('')
    const nextContactError = validateTaskContact(caregiverName, caregiverPhone)
    if (nextContactError) {
      setContactError(nextContactError)
      return
    }
    const referralOnly = scopeSignals.length > 0
    const newTask: Task = {
      id: nextTaskId,
      title: request,
      category,
      language,
      scheduledAt,
      createdAt: new Date().toISOString(),
      location: locationCatalog[locationKey],
      ownerId: session?.id ?? 'C-204',
      caregiverName: caregiverName.trim(),
      caregiverPhone: caregiverPhone.trim(),
      urgent,
      femalePreferred: femalePreferred && category === 'Sensitive accompaniment',
      status: referralOnly || urgent || category === 'Sensitive accompaniment' ? 'Review' : 'Open',
      points: referralOnly ? 0 : points,
      viaHours: referralOnly ? 0 : viaHours,
      difficulty: referralOnly || urgent || category === 'Sensitive accompaniment' ? 'Weightier' : category === 'Digital help' ? 'Skilled' : 'Light',
      skill: referralOnly ? 'Formal AH service required' : category === 'Sensitive accompaniment' ? 'Safeguarding + accompaniment' : `${category} ready`,
      volunteer: '',
      safetyCleared: !referralOnly && !urgent && category !== 'Sensitive accompaniment',
      referralOnly,
      scopeFlags: scopeSignals.map((signal) => signal.label),
      completion: null,
      volunteersNeeded: category === 'Sensitive accompaniment' ? 2 : 1,
      confirmedVolunteers: [],
      capacityState: 'Recruiting',
    }
    setTasks([newTask, ...tasks])
    setContactError('')
    setSubmittedForReferral(referralOnly)
    setSubmitted(true)
  }

  function acceptTask(id: string) {
    setTasks(tasks.map((task) => {
      const matchGaps = volunteerMatchGaps(
        { requiredSkill: task.skill, taskLanguage: task.language },
        { readiness: volunteerReadiness, languages: volunteerLanguages },
      )
      if (task.id !== id || !['Open', 'Escalated'].includes(task.status) || !task.safetyCleared || matchGaps.length > 0 || task.confirmedVolunteers.includes('Maya T.')) return task
      return { ...task, status: task.status === 'Escalated' ? 'Escalated' : 'Review', volunteer: 'Maya T.' }
    }))
  }

  function releaseTask(id: string) {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: 'Open', safetyCleared: true } : task))
    setAdminNotice(`${taskDisplayLabel(id)} scope cleared: released only to volunteers with the required readiness.`)
  }

  function approveTask(id: string) {
    setTasks(tasks.map((task) => {
      if (task.id !== id) return task
      const volunteer = task.volunteer || 'Maya T.'
      const confirmedVolunteers = task.confirmedVolunteers.includes(volunteer) ? task.confirmedVolunteers : [...task.confirmedVolunteers, volunteer]
      const covered = confirmedVolunteers.length >= task.volunteersNeeded
      return { ...task, status: covered ? 'Matched' : 'Open', volunteer, confirmedVolunteers, capacityState: covered ? 'Covered' : 'Recruiting' }
    }))
    setAdminNotice(`${taskDisplayLabel(id)} approved: confirmed capacity was updated and minimum task details released.`)
  }

  function startCapacitySourcing(id: string) {
    setTasks((current) => current.map((task) => task.id === id ? startCoordinatorSourcing(task, new Date().toISOString()) : task))
    setAdminNotice(`${taskDisplayLabel(id)}: AH coordinator sourcing started. The task stays open while suitable volunteers are contacted.`)
  }

  function addSourcedVolunteer(id: string) {
    setTasks((current) => current.map((task) => task.id === id ? recordSourcedVolunteer(task, `AH sourced · volunteer ${task.confirmedVolunteers.length + 1}`) : task))
    setAdminNotice(`${taskDisplayLabel(id)}: one suitable volunteer was confirmed by AH; the capacity count has been updated.`)
  }

  function closeCapacityTask(id: string) {
    setTasks((current) => current.map((task) => task.id === id ? closeTaskForCapacity(task, new Date().toISOString()) : task))
    setAdminNotice(`${taskDisplayLabel(id)} closed because enough suitable volunteers could not be found. The caregiver has been notified.`)
  }

  function completeTask(id: string) {
    const reflection = (reflections[id] || '').trim()
    if (!reflection) return
    setTasks(tasks.map((task) => task.id === id ? {
      ...task,
      status: 'Done',
      completion: {
        submittedAt: '14 Aug 2026 · 4:42 pm',
        reflection,
        verification: 'Pending AH verification',
      },
    } : task))
    setReflections({ ...reflections, [id]: '' })
  }

  function verifyCompletion(id: string) {
    setTasks(tasks.map((task) => task.id === id && task.completion ? {
      ...task,
      completion: {
        ...task.completion,
        verification: 'Verified by AH',
        verifiedAt: '14 Aug 2026 · 4:55 pm',
      },
    } : task))
    setAdminNotice(`${taskDisplayLabel(id)} completion verified: service time and points added to the private record; VIA remains a partner-school decision.`)
  }

  function confirmRedirect(id: string) {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: 'Done' } : task))
    setAdminNotice(`${taskDisplayLabel(id)} closed with a formal-service redirect receipt; no volunteer details were released.`)
  }

  function toggleAccount(id: string) {
    setAccountState({ ...accountState, [id]: accountState[id] === 'Active' ? 'Paused' : 'Active' })
  }

  if (screen === 'home') {
    return <PublicHome theme={theme} onThemeChange={setTheme} onOpenPortal={() => setScreen(session ? 'portal' : 'login')} />
  }

  if (screen === 'login' || !session) {
    return <LoginPage theme={theme} onThemeChange={setTheme} onBack={() => setScreen('home')} onAuthenticated={(nextSession) => { setSession(nextSession); setPortalSection(defaultPortalSection(nextSession.role)); setScreen('portal') }} />
  }

  return (
    <main className="portal-page">
      <nav className="portal-nav" aria-label="Portal navigation">
        <div className="portal-nav-left"><PortalMenu role={role} activeSection={activePortalSection} onSelect={setPortalSection} /><button className="brand brand-button" type="button" onClick={() => setScreen('home')}><Mark /><span>relief<span className="brand-light">kaki</span></span></button></div>
        <div className="portal-context"><span className="secure-chip"><i></i> AH-supervised demo</span><span className="role-lock">{roleCopy[role].label} workspace</span></div>
        <div className="portal-actions"><ThemeToggle theme={theme} onChange={setTheme} /><AccountSettings session={session} role={role} trackOwnLocation={trackOwnLocation} trackingStatus={trackingStatus} onTrackOwnLocationChange={setTrackOwnLocation} onHome={() => setScreen('home')} onSignOut={() => { setSession(null); setScreen('login') }} /></div>
      </nav>

      {role !== 'caregiver' && <section className="realtime-ops-bar" aria-label="Live Singapore task operations"><SingaporeClock now={now} /><div><span>OPEN NOW <b>{openCount}</b></span><span>7-DAY ALERTS <b>{capacityAlerts.length}</b></span></div></section>}

      <section className="workspace" id="workspace">
        <header className={`workspace-head ${role === 'caregiver' ? 'caregiver-workspace-head' : ''}`}>
          <div><p className="eyebrow">{roleCopy[role].label.toUpperCase()} WORKSPACE</p><h2>{currentPortalPage.label}</h2><p className="portal-page-description">{currentPortalPage.description}</p></div>
          {role !== 'caregiver' && <div className="identity-card"><span>{session.id}</span><b>{session.assurance}</b></div>}
        </header>
        {((role === 'caregiver' || role === 'volunteer') && activePortalSection === 'tasks') && <DatabaseRoadmapNotice role={role} />}
        {((role === 'caregiver' && activePortalSection === 'tasks') || (role === 'volunteer' && activePortalSection === 'tasks')) && <TaskMap
          tasks={role === 'caregiver' ? tasks.filter((task) => task.ownerId === session.id) : role === 'volunteer' ? volunteerDashboardTasks : tasks}
          role={role}
          now={now}
          ownLocation={ownLocation}
          trackingStatus={trackingStatus}
          onCreateTask={role === 'caregiver' ? () => setPortalSection('create') : undefined}
          volunteerTools={role === 'volunteer' ? {
            verifiedPoints,
            verifiedHours,
            reflections,
            onAcceptTask: acceptTask,
            onReflectionChange: (id, value) => setReflections((current) => ({ ...current, [id]: value })),
            onCompleteTask: completeTask,
          } : undefined}
        />}

        {role === 'caregiver' && activePortalSection === 'create' && closedCapacityTasks.length > 0 && <section className="caregiver-alerts" aria-live="polite"><div><span>AH CAPACITY UPDATE</span><b>{closedCapacityTasks.length} task {closedCapacityTasks.length === 1 ? 'was' : 'were'} closed</b></div>{closedCapacityTasks.map((task) => <article key={task.id}><Badge tone="red">{taskDisplayLabel(task.id)} · Closed</Badge><p>{task.caregiverNotice}</p><small>Closed {task.closedAt ? formatSingaporeDateTime(task.closedAt) : 'by AH'} · your original task remains in your private record</small></article>)}</section>}

        {role === 'caregiver' && activePortalSection === 'create' && <><button type="button" className="back-to-task-map" onClick={() => setPortalSection('tasks')}>← Back to your task map</button><div className="caregiver-grid">
          <div className="request-card">
            {submitted ? <div className={`success-state ${submittedForReferral ? 'redirected' : ''}`}>
              <span className="success-icon">{submittedForReferral ? '!' : '✓'}</span>
              <p className="eyebrow">{submittedForReferral ? 'VOLUNTEER MATCHING BLOCKED' : 'REQUEST RECEIVED'}</p>
              <h3>{submittedForReferral ? 'This needs the formal AH service lane.' : urgent ? 'An AH admin is reviewing this now.' : 'That is one thing off your plate.'}</h3>
              {submittedForReferral ? <>
                <p>ReliefKaki did not publish this request to volunteers. AH admin receives a redirect receipt and can guide it to an appropriate professional or service.</p>
                {scopeSignals.some((signal) => signal.emergency) && <div className="emergency-callout"><b>Life-threatening emergency?</b><span>Do not wait for an admin response, call SCDF at 995 now.</span></div>}
                <ol className="request-steps"><li><b>Volunteer offer disabled</b><span>No student can view, offer for or be assigned this request.</span></li><li><b>AH service review</b><span>An administrator confirms the appropriate formal route.</span></li><li><b>Redirect receipt</b><span>The decision closes with an accountable no-volunteer record.</span></li></ol>
              </> : <>
                <p>Volunteers can now review the complete request, your contact details and the exact task location.</p>
                <ol className="request-steps"><li><b>Scope check</b><span>Admin confirms the request is bounded and non-clinical.</span></li><li><b>Open task board</b><span>Every active volunteer can see the request while it remains open and unexpired.</span></li><li><b>Moderated handoff</b><span>Admin confirms a suitable volunteer before the task is assigned.</span></li></ol>
              </>}
              <button onClick={() => setSubmitted(false)} className="button button-dark">Post another <Arrow /></button>
            </div> : <>
              <div className="form-top"><span>ONE SMALL ASK</span><span>about 30 seconds</span></div>
              <label>What would make today lighter?<textarea value={request} onChange={(event) => setRequest(event.target.value)} /></label>
              <div className="form-row"><label>Task category<select value={category} onChange={(event) => { const next = event.target.value as Category; setCategory(next); if (next !== 'Sensitive accompaniment') setFemalePreferred(false) }}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>
              <div className="schedule-row"><label>When is help needed? <small>Singapore time</small><input type="datetime-local" min={singaporeInputFromDate(now.getTime() + 60_000)} value={scheduledInput} onChange={(event) => { setScheduledInput(event.target.value); setScheduleError('') }} /></label><label>Where is the task?<select value={locationKey} onChange={(event) => setLocationKey(event.target.value as LocationKey)}><option value="ah">Alexandra Hospital</option><option value="home">My home · exact location</option><option value="redhill">Redhill MRT meeting point</option><option value="tiongBahru">Tiong Bahru Plaza</option><option value="commonwealth">Commonwealth Drive home</option><option value="bukitMerah">Bukit Merah Community Hub</option><option value="ghimMoh">Ghim Moh Market</option><option value="telokBlangah">Telok Blangah MRT</option><option value="queenstownLibrary">Queenstown Public Library</option><option value="remote">Remote · no travel</option></select></label></div>
              <div className="language-preference"><label>Conversation language <small>if needed</small><select value={language} onChange={(event) => setLanguage(event.target.value as TaskLanguage)}>{taskLanguages.map((item) => <option key={item}>{item}</option>)}</select></label><p>Choose a language only when the task needs conversation. It is shown to every volunteer as part of the complete task details.</p></div>
              {scheduleError && <p className="form-error schedule-error" role="alert">{scheduleError}</p>}
              <div className="contact-fields"><label>Caregiver name<input value={caregiverName} onChange={(event) => { setCaregiverName(event.target.value); setContactError('') }} placeholder="Name shown to every volunteer" /></label><label>Contact number<input type="tel" inputMode="tel" value={caregiverPhone} onChange={(event) => { setCaregiverPhone(event.target.value); setContactError('') }} placeholder="Number shown to every volunteer" /></label></div>
              {contactError && <p className="form-error contact-error" role="alert">{contactError}</p>}
              {scopeSignals.length > 0 && <div className="scope-preflight" aria-live="polite"><div><span>OUTSIDE VOLUNTEER SCOPE</span><b>Will route to AH, never to a volunteer</b></div><ul>{scopeSignals.map((signal) => <li key={signal.label}><b>{signal.label}</b><span>{signal.guidance}</span></li>)}</ul></div>}
              <div className="option-row"><label className="check-option"><input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} /><span><b>Time-sensitive today</b><small>Routes to AH admin triage, not a public urgency bounty.</small></span></label>{category === 'Sensitive accompaniment' && <label className="check-option"><input type="checkbox" checked={femalePreferred} onChange={(event) => setFemalePreferred(event.target.checked)} /><span><b>Female support requested</b><small>For task-specific privacy or comfort; admin checks suitability.</small></span></label>}</div>
              <button className="button button-dark full" onClick={postTask}>{scopeSignals.length ? 'Create AH redirect receipt' : 'Publish complete task'} <Arrow /></button>
              <p className="form-foot">No medication, personal care, clinical advice, lifting, money handling or emergencies. Those go to the appropriate AH service.</p>
            </>}
          </div>
          <aside className="task-preview-panel">
            <p className="eyebrow">LIVE VOLUNTEER TASK CARD</p>
            <div className="caregiver-profile"><span>{(caregiverName.trim().slice(0, 1) || 'C').toUpperCase()}</span><div><b>{draftContact.displayName || 'Caregiver name'}</b><small>Contact details shown with the task</small></div></div>
            <div className="live-task-preview"><span>{category} · {urgent ? 'Admin triage' : draftScheduleLabel}</span><h3>{request.trim() || 'Your task request will appear here'}</h3><small>⌖ {draftVolunteerLocation.label}</small></div>
            <dl><div><dt>Name</dt><dd>{caregiverName.trim() || 'Required'}</dd></div><div><dt>Contact number</dt><dd>{draftContact.contactNumber || 'Required'}</dd></div><div><dt>Location</dt><dd>{draftVolunteerLocation.label}</dd></div><div><dt>Task language</dt><dd>{language === 'No preference' ? 'Any language' : language}</dd></div></dl>
            <div className="task-sharing-note"><span>✓</span><p><b>Complete details are shared with volunteers.</b> Every active volunteer can review the instructions, caregiver contact and exact task location while this task is open and unexpired.</p></div>
          </aside>
        </div></>}

        {role === 'volunteer' && activePortalSection === 'recognition' && <div className="volunteer-view volunteer-receipts-view">
          <section className="volunteer-recognition-page" aria-label="Volunteer recognition summary">
            <div className="map-recognition-head"><div><p className="eyebrow">MY VOLUNTEER RECORD</p><h3>Verified service and readiness.</h3></div><Badge tone="blue">Volunteer only</Badge></div>
            <div className="volunteer-strip"><article><span>VERIFIED IMPACT</span><b>{verifiedPoints}</b><small>Points after AH verification</small></article><article><span>VERIFIED SERVICE</span><b>{verifiedHours}h</b><small>VIA subject to partner approval</small></article><article><span>RELIABILITY</span><b>96%</b><small>11 of 12 tasks completed</small></article><article className="league-card"><span>OPT-IN TEAM GOAL</span><b>14/20</b><small>SMU Care Crew · completed tasks</small></article></div>
            <div className="map-readiness"><span>YOUR ACTIVE FIT</span><div className="skill-pills"><Badge tone="green">✓ Errands ready</Badge><Badge tone="green">✓ Digital help ready</Badge><Badge tone="blue">✓ Safeguarding + accompaniment</Badge><Badge tone="plain">Forms briefing not completed</Badge><Badge tone="green">English</Badge><Badge tone="green">Mandarin</Badge></div></div>
          </section>
          {completionReceipts.filter((task) => task.volunteer === 'Maya T.').length > 0 && <section className="receipt-shelf"><div className="receipt-shelf-head"><div><p className="eyebrow">MY SERVICE RECEIPTS</p><h3>Completion is recorded before recognition.</h3></div><Badge tone={pendingCompletions ? 'amber' : 'green'}>{pendingCompletions ? `${pendingCompletions} awaiting AH` : 'All verified'}</Badge></div>{completionReceipts.filter((task) => task.volunteer === 'Maya T.').map((task) => <article className="service-receipt" key={task.id}><div><span>{taskDisplayLabel(task.id)} · {task.completion?.submittedAt}</span><b>{task.title}</b><p>“{task.completion?.reflection}”</p></div><div className="receipt-verdict"><Badge tone={task.completion?.verification === 'Verified by AH' ? 'green' : 'amber'}>{task.completion?.verification}</Badge><small>{task.completion?.verification === 'Verified by AH' ? `${task.viaHours}h verified · ${task.points} points recorded` : `${task.viaHours}h and ${task.points} points pending`}</small><em>Partner school decides VIA recognition.</em></div></article>)}</section>}
          <p className="ethics-note">Service time is verified after completion and reflection; partner schools decide whether it qualifies for VIA. Impact points recognise approved effort, reliability and contribution, never urgency, caregiver distress or risk. Progress stays private and team goals reveal no caregiver data.</p>
        </div>}

        {role === 'admin' && <div className="admin-view">
          {adminNotice && <div className="admin-notice">✓ {adminNotice}</div>}
          {activePortalSection === 'capacity' && <section className="capacity-alert-panel" aria-label="Seven-day capacity notifications"><div className="capacity-alert-head"><div><p className="eyebrow">AUTOMATIC 7-DAY REFERRALS</p><h3>AH capacity notifications</h3><p>Tasks still below the confirmed headcount after seven days are referred here automatically. AH can source suitable people or close the request with a caregiver notice.</p></div><Badge tone={capacityAlerts.length ? 'red' : 'green'}>{capacityAlerts.length ? `${capacityAlerts.length} action required` : 'Queue clear'}</Badge></div>{capacityAlerts.length > 0 ? <div className="capacity-alert-list">{capacityAlerts.map((task) => { const place = taskLocationForRole(task.location, 'admin'); return <article key={task.id}><div className="capacity-alert-title"><div><span>{taskDisplayLabel(task.id)} · {taskWaitLabel(task.createdAt, now)}</span><b>{task.title}</b></div><Badge tone="red">{task.confirmedVolunteers.length}/{task.volunteersNeeded} confirmed</Badge></div><p>{task.adminNotification}</p><dl><div><dt>Task time</dt><dd>{formatSingaporeDateTime(task.scheduledAt)}</dd></div><div><dt>Protected location</dt><dd>{place.label}</dd></div><div><dt>AH action</dt><dd>{task.capacityState}</dd></div></dl><div className="admin-actions">{task.capacityState === 'AH help required' && <button className="button button-dark" onClick={() => startCapacitySourcing(task.id)}>Start AH sourcing <Arrow /></button>}{task.capacityState === 'Coordinator sourcing' && <><button className="button button-dark" onClick={() => addSourcedVolunteer(task.id)}>Record sourced volunteer <Arrow /></button><button className="button button-outline danger" onClick={() => closeCapacityTask(task.id)}>Close · capacity unavailable</button></>}{task.volunteer && <button className="button button-outline" onClick={() => approveTask(task.id)}>Approve pending offer</button>}</div></article>})}</div> : <div className="empty-queue"><b>No overdue capacity gaps.</b><span>New seven-day referrals appear here with the task age, schedule, exact operational location and confirmed headcount.</span></div>}</section>}
          {activePortalSection === 'overview' && <><section className="admin-overview-intro"><p className="eyebrow">AH ADMINISTRATION</p><h3>Focused workspaces for programme operations.</h3><p>Use the three-line menu or the page links below to move between capacity referrals, completion and recognition records, and account administration. Each area opens as its own page.</p></section>
          <section className="admin-section-directory" aria-label="Administration sections"><div className="panel-head"><div><p className="eyebrow">ADMINISTRATION MENU</p><h3>Choose one focused work queue</h3></div><Badge tone="blue">3 sections</Badge></div><div className="admin-directory-grid">{portalSectionsForRole('admin').filter((section) => section.id !== 'overview').map((section) => <button type="button" key={section.id} onClick={() => setPortalSection(section.id)}><span>{section.label}</span><small>{section.description}</small><em>Open page →</em></button>)}</div></section></>}
          {false && <section className="admin-panel"><div className="panel-head"><div><p className="eyebrow">TRIAGE & MATCHING</p><h3>One accountable queue</h3></div><Badge tone="red">1 urgent</Badge></div>
              <div className="admin-task-list">{tasks.filter((task) => task.status === 'Review' || ((task.urgent || task.category === 'Sensitive accompaniment') && !task.safetyCleared)).map((task) => <article key={task.id}><div className="admin-task-title"><span>{taskDisplayLabel(task.id)}</span><div><b>{task.title}</b><small>{task.category} · {task.language === 'No preference' ? 'Any language' : task.language} · {taskLocationForRole(task.location, 'admin').label}</small></div></div><div className="admin-flags">{task.urgent && <Badge tone="red">Time-sensitive</Badge>}{task.femalePreferred && <Badge tone="amber">Female support preference</Badge>}{task.referralOnly && <Badge tone="red">Formal service only</Badge>}<Badge tone={task.safetyCleared ? 'green' : 'red'}>{task.safetyCleared ? 'Scope cleared' : 'Offer gate locked'}</Badge></div>{task.scopeFlags.length > 0 && <div className="scope-flags">Detected: {task.scopeFlags.join(' · ')}</div>}<p>{task.referralOnly ? 'Volunteer matching is structurally disabled. Confirm the appropriate professional, clinical or emergency route and close an accountable redirect receipt.' : task.femalePreferred ? 'Confirm no personal care, lifting or clinical work. If bounded, release only to volunteers with Safeguarding + accompaniment readiness; otherwise redirect to formal care support.' : 'Confirm scope, volunteer eligibility and complete task details.'}</p><div className="admin-actions">{task.referralOnly ? <button className="button button-dark" onClick={() => confirmRedirect(task.id)}>Confirm formal redirect <Arrow /></button> : task.status === 'Review' && task.volunteer ? <button className="button button-dark" onClick={() => approveTask(task.id)}>Approve match <Arrow /></button> : !task.safetyCleared ? <button className="button button-dark" onClick={() => releaseTask(task.id)}>Clear bounded scope <Arrow /></button> : <button className="button button-outline" onClick={() => setAdminNotice(`${taskDisplayLabel(task.id)} routed for direct coordinator outreach.`)}>Find suitable volunteer</button>}{!task.referralOnly && <button className="text-action" onClick={() => setAdminNotice(`${taskDisplayLabel(task.id)} escalated to the AH service lane; volunteer matching paused.`)}>Escalate / redirect</button>}</div></article>)}</div>
          </section>}
          {activePortalSection === 'accounts' && <section className="admin-panel account-administration-page"><div className="panel-head"><div><p className="eyebrow">ACCOUNT ADMINISTRATION</p><h3>People, access, readiness</h3></div><Badge tone="green">Protected</Badge></div>
              <div className="account-list">{[{ id: 'MC-204', name: 'Male caregiver account', role: 'Caregiver · identity verified' }, { id: 'VL-031', name: 'Maya Tan', role: 'Volunteer · 4 skill badges' }, { id: 'VL-044', name: 'Arjun Lee', role: 'Volunteer · renewal due' }].map((account) => <article key={account.id}><div className="account-avatar">{account.id.slice(0, 2)}</div><div><b>{account.name}</b><small>{account.id} · {account.role}</small></div><Badge tone={accountState[account.id] === 'Active' ? 'green' : 'amber'}>{accountState[account.id]}</Badge><button onClick={() => toggleAccount(account.id)}>{accountState[account.id] === 'Active' ? 'Pause' : 'Activate'}</button></article>)}</div>
              <div className="vault-note"><span>▣</span><p><b>Verified task contacts</b><br />Caregiver names, contact numbers and exact task locations are included in every open volunteer task. Admin access and match decisions remain logged for programme operations and safety follow-up.</p></div>
          </section>}
          {activePortalSection === 'completions' && <section className="admin-panel completion-queue"><div className="admin-completion-summary"><article><span>SUBMITTED RECORDS</span><b>{completionReceipts.length}</b><small>completion receipts in this demo</small></article><article><span>VERIFIED BY AH</span><b>{verifiedCompletions.length}</b><small>approved service records</small></article><article><span>AWAITING REVIEW</span><b>{pendingCompletions}</b><small>before recognition is released</small></article><article><span>VERIFIED SERVICE</span><b>{verifiedServiceHours.toFixed(1)}h</b><small>subject to partner-school review</small></article><article><span>IMPACT RECORDED</span><b>{verifiedRecognitionPoints}</b><small>verified recognition points</small></article></div><div className="panel-head"><div><p className="eyebrow">COMPLETION & RECOGNITION</p><h3>Verify the work, then release the record</h3></div><Badge tone={pendingCompletions ? 'amber' : 'green'}>{pendingCompletions ? `${pendingCompletions} pending` : 'Queue clear'}</Badge></div>{completionReceipts.length ? <div className="admin-task-list">{completionReceipts.map((task) => <article key={task.id}><div className="admin-task-title"><span>{taskDisplayLabel(task.id)}</span><div><b>{task.title}</b><small>{task.volunteer} · submitted {task.completion?.submittedAt}</small></div></div><div className="admin-flags"><Badge tone="blue">No caregiver identity in receipt</Badge><Badge tone={task.completion?.verification === 'Verified by AH' ? 'green' : 'amber'}>{task.completion?.verification}</Badge></div><p className="receipt-reflection">Volunteer reflection: “{task.completion?.reflection}”</p><div className="verification-summary"><span><b>{task.viaHours}h</b> service time</span><span><b>{task.points}</b> impact points</span><span><b>Partner review</b> for VIA</span></div>{task.completion?.verification === 'Pending AH verification' ? <button className="button button-dark" onClick={() => verifyCompletion(task.id)}>Verify completion <Arrow /></button> : <p className="verified-line">✓ Verified {task.completion?.verifiedAt}; private record released for partner-school review.</p>}</article>)}</div> : <div className="empty-queue"><b>No completion receipts yet.</b><span>Completed tasks appear here for AH review before time or points are recorded.</span></div>}</section>}
        </div>}
      </section>

      <SiteFooter portal />
    </main>
  )
}
