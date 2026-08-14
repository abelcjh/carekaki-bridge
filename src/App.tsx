import { useEffect, useMemo, useState, type FormEvent } from 'react'
import heroImage from './assets/carekaki-hero.png'
import { authenticateDemo, demoAccounts, resolveInitialTheme, type AuthSession, type Role, type Screen, type Theme } from './app-state'
import './App.css'

type TaskStatus = 'Open' | 'Review' | 'Matched' | 'Done'
type Category = 'Errands' | 'Digital help' | 'Wayfinding' | 'Meals & home' | 'Admin & forms' | 'Companionship' | 'Sensitive accompaniment'
type Difficulty = 'Light' | 'Skilled' | 'Weightier'
type PrivacySignal = { label: string; guidance: string }
type ScopeSignal = { label: string; guidance: string; emergency?: boolean }
type CompletionReceipt = {
  submittedAt: string
  reflection: string
  verification: 'Pending AH verification' | 'Verified by AH'
  verifiedAt?: string
}

type Task = {
  id: string
  title: string
  category: Category
  time: string
  zone: string
  silent: boolean
  urgent: boolean
  femalePreferred: boolean
  status: TaskStatus
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

const initialTasks: Task[] = [
  { id: 'CK-204', title: 'Collect discharge essentials from AH pharmacy counter', category: 'Errands', time: 'Today · 7:30 pm', zone: 'AH campus', silent: true, urgent: false, femalePreferred: false, status: 'Open', points: 40, viaHours: 1, difficulty: 'Light', skill: 'Errands ready', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null },
  { id: 'CK-205', title: 'Escort mum from clinic reception to booked taxi pickup', category: 'Sensitive accompaniment', time: 'Today · 5:45 pm', zone: 'AH campus', silent: true, urgent: true, femalePreferred: true, status: 'Open', points: 60, viaHours: 1.5, difficulty: 'Weightier', skill: 'Safeguarding + accompaniment', volunteer: '', safetyCleared: false, referralOnly: false, scopeFlags: [], completion: null },
  { id: 'CK-206', title: 'Set gentle appointment reminders on my phone', category: 'Digital help', time: 'Tomorrow · 8:00 pm', zone: 'Remote', silent: false, urgent: false, femalePreferred: false, status: 'Matched', points: 35, viaHours: 0.5, difficulty: 'Skilled', skill: 'Digital help ready', volunteer: 'Arjun L.', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null },
  { id: 'CK-207', title: 'Help complete a non-clinical transport form', category: 'Admin & forms', time: 'Fri · 4:15 pm', zone: 'Queenstown · 2 km band', silent: true, urgent: false, femalePreferred: false, status: 'Open', points: 50, viaHours: 1, difficulty: 'Skilled', skill: 'Forms briefing', volunteer: '', safetyCleared: true, referralOnly: false, scopeFlags: [], completion: null },
]

const categories: Category[] = ['Errands', 'Digital help', 'Wayfinding', 'Meals & home', 'Admin & forms', 'Companionship', 'Sensitive accompaniment']
const roleCopy: Record<Role, { label: string; eyebrow: string }> = {
  caregiver: { label: 'Caregiver', eyebrow: 'ASK FOR ONE SMALL THING' },
  volunteer: { label: 'Volunteer', eyebrow: 'CHOOSE A TASK THAT FITS' },
  admin: { label: 'AH admin', eyebrow: 'OVERSEE SAFETY & FULFILMENT' },
}
const volunteerReadiness = ['Errands ready', 'Digital help ready', 'Safeguarding + accompaniment']

function findDirectIdentifiers(value: string): PrivacySignal[] {
  const checks: Array<PrivacySignal & { pattern: RegExp }> = [
    { label: 'Phone number', guidance: 'Remove phone numbers; AH keeps contact details in the protected account.', pattern: /(?:\+?65[\s-]?)?(?:[689]\d{3}[\s-]?\d{4})\b/i },
    { label: 'Email address', guidance: 'Remove email addresses; volunteers should not contact you outside CareKaki.', pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
    { label: 'NRIC or FIN', guidance: 'Remove identity numbers. They are never needed in a volunteer task.', pattern: /\b[STFGM]\d{7}[A-Z]\b/i },
    { label: 'Postal code or exact block', guidance: 'Use an approximate zone only; AH releases a meeting point after approval if needed.', pattern: /\b(?:singapore\s*)?\d{6}\b|\b(?:blk|block)\s*\d+[A-Z]?\b/i },
    { label: 'Stated personal name', guidance: 'Remove your or your care recipient’s name; use “me”, “mum”, “dad” or “my family member”.', pattern: /\b(?:my name is|i am|i'm|ask for|contact)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/ },
  ]

  return checks.filter((check) => check.pattern.test(value)).map(({ label, guidance }) => ({ label, guidance }))
}

function findScopeExclusions(value: string): ScopeSignal[] {
  const checks: Array<ScopeSignal & { pattern: RegExp }> = [
    { label: 'Possible emergency', guidance: 'Do not wait for CareKaki. Call 995 now for a life-threatening emergency.', emergency: true, pattern: /\b(?:emergency|unconscious|not breathing|chest pain|stroke|severe bleeding|suicid(?:e|al)|collapsed)\b/i },
    { label: 'Medication or clinical task', guidance: 'Medication, symptoms, wounds, diagnosis and clinical advice must go to qualified staff.', pattern: /\b(?:medicat(?:e|ion)|medicine|pills?|dosage|dose|insulin|injection|inject|wound|diagnos(?:e|is)|clinical advice|medical advice|take blood pressure)\b/i },
    { label: 'Personal care', guidance: 'Bathing, toileting, dressing and other personal care are outside the student-volunteer role.', pattern: /\b(?:bath(?:e|ing)|shower(?:ing)?|toilet(?:ing)?|diaper|nappy|dress(?:ing)?|personal care|feed(?:ing)?)\b/i },
    { label: 'Lifting or transfer', guidance: 'Lifting, carrying or transferring a person requires an appropriate formal care pathway.', pattern: /\b(?:lift|lifting|transfer(?:ring)?|carry)\s+(?:me|mum|mom|dad|father|mother|patient|him|her|my family member)\b/i },
    { label: 'Money handling', guidance: 'Cash, banking, payment and financial transactions are outside volunteer scope.', pattern: /\b(?:cash|bank(?:ing)?|transfer money|pay(?:ment)?|withdraw|atm|credit card|debit card|pin number|financial transaction)\b/i },
  ]

  return checks.filter((check) => check.pattern.test(value)).map(({ label, guidance, emergency }) => ({ label, guidance, emergency }))
}

function Mark() {
  return <div className="mark" aria-label="CareKaki Bridge"><span></span><span></span><span></span></div>
}

function Arrow() { return <span className="arrow">↗</span> }

function Badge({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'green' | 'amber' | 'red' | 'blue' }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  const nextTheme = theme === 'light' ? 'dark' : 'light'
  return <button className="theme-toggle" type="button" onClick={() => onChange(nextTheme)} aria-label={`Switch to ${nextTheme} mode`}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><b>{theme === 'light' ? 'Dark' : 'Light'}</b></button>
}

function PublicHome({ theme, onThemeChange, onOpenPortal }: { theme: Theme; onThemeChange: (theme: Theme) => void; onOpenPortal: () => void }) {
  return <main className="public-page">
    <nav className="public-nav" aria-label="Primary navigation">
      <a className="brand" href="#top"><Mark /><span>carekaki<span className="brand-light">bridge</span></span></a>
      <div className="public-links"><a href="#how-it-works">How it works</a><a href="#safety">Safety</a><a href="#roles">Who it is for</a></div>
      <div className="nav-actions"><ThemeToggle theme={theme} onChange={onThemeChange} /><button className="button button-dark" type="button" onClick={onOpenPortal}>Access portal <Arrow /></button></div>
    </nav>

    <section className="hero public-hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">ALEXANDRA HOSPITAL · CAREGIVER RESPITE PILOT</p>
        <h1>One small ask.<br /><em>One lighter day.</em></h1>
        <p className="lede">CareKaki turns a practical burden into a bounded, privacy-preserving task. Trained student volunteers can offer support while hospital administrators retain oversight.</p>
        <div className="hero-actions"><button className="button button-dark" type="button" onClick={onOpenPortal}>Sign in to CareKaki <Arrow /></button><a className="button-link" href="#how-it-works">See how it works <span>↓</span></a></div>
        <div className="trust-row"><span><b>01</b> private request</span><i></i><span><b>02</b> eligible offer</span><i></i><span><b>03</b> verified receipt</span></div>
      </div>
      <div className="hero-visual">
        <img src={heroImage} alt="A caregiver and student volunteer reviewing a practical checklist together" />
        <div className="image-wash"></div>
        <div className="floating-card"><span className="soft-label">SILENT TASK</span><strong>“No public profile.<br />Just one clear ask.”</strong><div><span className="mini-dot"></span> Identity stays protected from volunteers</div></div>
        <div className="hero-stamp"><span>CAREKAKI</span><b>24</b><span>BRIDGE</span></div>
      </div>
    </section>

    <section className="public-section process-section" id="how-it-works">
      <div className="section-intro"><p className="eyebrow">HOW THE SERVICE WORKS</p><h2>A clear handoff, not an open marketplace.</h2><p>Each person sees only what they need. A volunteer’s offer never becomes an assignment until an AH administrator checks the match.</p></div>
      <ol className="process-grid">
        <li><span>01</span><h3>Ask privately</h3><p>A caregiver chooses a hospital-approved task and can hide identity and contact details from the volunteer view.</p></li>
        <li><span>02</span><h3>Check fit</h3><p>Training, availability, scope and safeguarding are checked before a volunteer can be confirmed.</p></li>
        <li><span>03</span><h3>Complete safely</h3><p>The task closes with a private reflection and an AH-reviewed completion receipt.</p></li>
      </ol>
    </section>

    <section className="role-explainer" id="roles">
      <div className="section-intro compact"><p className="eyebrow">THREE RESPONSIBILITIES</p><h2>One service, three protected workspaces.</h2></div>
      <div className="role-cards">
        <article><span className="role-icon">C</span><p className="eyebrow">CAREGIVER</p><h3>Control the ask</h3><p>Request one bounded practical task, choose privacy settings and follow its status without publishing a personal story.</p></article>
        <article><span className="role-icon">V</span><p className="eyebrow">VOLUNTEER</p><h3>Choose a safe fit</h3><p>See only tasks matched to active readiness, time and skills. Offer to help without bypassing coordinator approval.</p></article>
        <article><span className="role-icon">AH</span><p className="eyebrow">HOSPITAL ADMIN</p><h3>Own the safeguards</h3><p>Triage scope, approve matches, monitor readiness, redirect excluded work and verify completion records.</p></article>
      </div>
    </section>

    <section className="safety-section" id="safety"><div><p className="eyebrow">THE CAREKAKI PROMISE</p><h2>Warmth needs<br /><em>clear edges.</em></h2></div><div className="safety-grid"><article><span>↳</span><h3>We do</h3><p>Errands, meals, reminder setup, wayfinding, basic forms, companionship and bounded accompaniment.</p></article><article><span>×</span><h3>We do not</h3><p>Medication, personal care, clinical advice, lifting or transfers, finances, diagnosis or emergency response.</p></article><article><span>!</span><h3>We escalate</h3><p>Urgent and sensitive requests go to a named AH administrator for review, referral and recovery.</p></article></div></section>

    <section className="access-banner"><div><p className="eyebrow">AUTHENTICATED OPERATIONS</p><h2>Ready to enter your workspace?</h2><p>Caregiver, volunteer and AH-admin tools stay behind a role-bound sign-in.</p></div><button className="button button-dark" type="button" onClick={onOpenPortal}>Access the demo portal <Arrow /></button></section>

    <footer><a className="brand" href="#top"><Mark /><span>carekaki<span className="brand-light">bridge</span></span></a><p>Silent help. Visible relief. Managed with care.</p><span>SparkX⁺Change · Alexandra Hospital · interactive concept demo</span></footer>
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
      <button className="brand brand-button" type="button" onClick={onBack}><Mark /><span>carekaki<span className="brand-light">bridge</span></span></button>
      <div className="nav-actions"><ThemeToggle theme={theme} onChange={onThemeChange} /><button className="button button-outline" type="button" onClick={onBack}>Back to website</button></div>
    </nav>
    <section className="login-layout">
      <div className="login-context"><p className="eyebrow">PROTECTED WORKSPACES</p><h1>Sign in to the role you have been approved for.</h1><p>CareKaki uses role-bound access: caregivers manage private requests, volunteers see eligible tasks, and AH administrators oversee safety and completion.</p><ul><li><span>✓</span> No role switching after sign-in</li><li><span>✓</span> Minimum necessary information by role</li><li><span>✓</span> Clear sign-out and account identity at all times</li></ul><div className="prototype-note"><b>Interactive prototype</b><span>This screen demonstrates authentication and authorization UX. It is not connected to Alexandra Hospital production identity systems.</span></div></div>
      <div className="login-card">
        <div><p className="eyebrow">CAREKAKI ACCESS</p><h2>Welcome back</h2><p>Use a demo profile below, then sign in.</p></div>
        <form onSubmit={signIn} noValidate>
          <label htmlFor="email">Email address<input id="email" name="email" type="email" autoComplete="username" inputMode="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} required /></label>
          <label htmlFor="password">Password<span className="password-field"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-pressed={showPassword}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark full" type="submit">Sign in securely <Arrow /></button>
        </form>
        <div className="demo-access"><span>Choose a demo profile</span>{demoAccounts.map((account, index) => <button type="button" key={account.role} onClick={() => chooseDemo(index)}><b>{account.label}</b><small>{account.role === 'caregiver' ? 'Private requests' : account.role === 'volunteer' ? 'Tasks and service receipts' : 'Triage and account oversight'}</small><em>Use details →</em></button>)}</div>
        <p className="login-help">Need access? In a live pilot, an AH programme administrator would create or approve your account.</p>
      </div>
    </section>
  </main>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [session, setSession] = useState<AuthSession | null>(null)
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme(
    typeof window === 'undefined' ? null : window.localStorage.getItem('carekaki-theme'),
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  ))
  const role: Role = session?.role ?? 'caregiver'
  const [tasks, setTasks] = useState(initialTasks)
  const [isSilent, setIsSilent] = useState(true)
  const [category, setCategory] = useState<Category>('Errands')
  const [request, setRequest] = useState('Pick up a simple dinner and leave it at the ward counter')
  const [femalePreferred, setFemalePreferred] = useState(false)
  const [urgent, setUrgent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedForReferral, setSubmittedForReferral] = useState(false)
  const [privacyBlocked, setPrivacyBlocked] = useState(false)
  const [adminNotice, setAdminNotice] = useState('')
  const [reflections, setReflections] = useState<Record<string, string>>({})
  const [accountState, setAccountState] = useState<Record<string, string>>({ 'MC-204': 'Active', 'VL-031': 'Active', 'VL-044': 'Training due' })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('carekaki-theme', theme)
  }, [theme])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [screen])

  const openCount = tasks.filter((task) => task.status === 'Open').length
  const reviewCount = tasks.filter((task) => task.status === 'Review' || ((task.urgent || task.category === 'Sensitive accompaniment') && !task.safetyCleared)).length
  const completionReceipts = tasks.filter((task) => task.completion)
  const pendingCompletions = completionReceipts.filter((task) => task.completion?.verification === 'Pending AH verification').length
  const verifiedForMaya = tasks.filter((task) => task.volunteer === 'Maya T.' && task.completion?.verification === 'Verified by AH')
  const verifiedPoints = 620 + verifiedForMaya.reduce((total, task) => total + task.points, 0)
  const verifiedHours = 8.5 + verifiedForMaya.reduce((total, task) => total + task.viaHours, 0)
  const points = useMemo(() => {
    const base: Record<Category, number> = { Errands: 40, 'Digital help': 35, Wayfinding: 45, 'Meals & home': 45, 'Admin & forms': 50, Companionship: 55, 'Sensitive accompaniment': 60 }
    return base[category]
  }, [category])
  const viaHours = category === 'Digital help' ? 0.5 : category === 'Sensitive accompaniment' ? 1.5 : 1
  const privacySignals = useMemo(() => isSilent ? findDirectIdentifiers(request) : [], [isSilent, request])
  const scopeSignals = useMemo(() => findScopeExclusions(request), [request])

  function postTask() {
    if (privacySignals.length > 0) {
      setPrivacyBlocked(true)
      return
    }
    const referralOnly = scopeSignals.length > 0
    const newTask: Task = {
      id: `CK-${208 + tasks.length}`,
      title: request,
      category,
      time: referralOnly ? 'AH service redirect' : urgent ? 'Today · urgent review' : 'Next available slot',
      zone: 'Queenstown · approximate zone',
      silent: isSilent,
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
    }
    setTasks([newTask, ...tasks])
    setPrivacyBlocked(false)
    setSubmittedForReferral(referralOnly)
    setSubmitted(true)
  }

  function acceptTask(id: string) {
    setTasks(tasks.map((task) => {
      if (task.id !== id || task.status !== 'Open' || !task.safetyCleared || !volunteerReadiness.includes(task.skill)) return task
      return { ...task, status: 'Review', volunteer: 'Maya T.' }
    }))
  }

  function releaseTask(id: string) {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: 'Open', safetyCleared: true } : task))
    setAdminNotice(`${id} scope cleared: released only to volunteers with the required readiness.`)
  }

  function approveTask(id: string) {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: 'Matched', volunteer: task.volunteer || 'Maya T.' } : task))
    setAdminNotice(`${id} approved: minimum task details released to the cleared volunteer.`)
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
    setAdminNotice(`${id} completion verified: service time and points added to the private record; VIA remains a partner-school decision.`)
  }

  function confirmRedirect(id: string) {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: 'Done' } : task))
    setAdminNotice(`${id} closed with a formal-service redirect receipt; no volunteer details were released.`)
  }

  function toggleAccount(id: string) {
    setAccountState({ ...accountState, [id]: accountState[id] === 'Active' ? 'Paused' : 'Active' })
  }

  if (screen === 'home') {
    return <PublicHome theme={theme} onThemeChange={setTheme} onOpenPortal={() => setScreen(session ? 'portal' : 'login')} />
  }

  if (screen === 'login' || !session) {
    return <LoginPage theme={theme} onThemeChange={setTheme} onBack={() => setScreen('home')} onAuthenticated={(nextSession) => { setSession(nextSession); setScreen('portal') }} />
  }

  return (
    <main className="portal-page">
      <nav className="portal-nav" aria-label="Portal navigation">
        <button className="brand brand-button" type="button" onClick={() => setScreen('home')}><Mark /><span>carekaki<span className="brand-light">bridge</span></span></button>
        <div className="portal-context"><span className="secure-chip"><i></i> AH-supervised demo</span><span className="role-lock">{roleCopy[role].label} workspace</span></div>
        <div className="portal-actions"><ThemeToggle theme={theme} onChange={setTheme} /><button className="button button-outline" type="button" onClick={() => setScreen('home')}>Public website</button><button className="button button-dark" type="button" onClick={() => { setSession(null); setScreen('login') }}>Sign out</button></div>
      </nav>

      <section className="portal-account-bar" aria-label="Signed-in account"><div className="account-dot">{session.name.slice(0, 1)}</div><div><span>Signed in as</span><b>{session.name}</b></div><div className="account-assurance"><span>{session.id}</span><b>{session.assurance}</b></div></section>

      <section className="workspace" id="workspace">
        <header className="workspace-head">
          <div><p className="eyebrow">{roleCopy[role].eyebrow}</p><h2>{role === 'caregiver' ? 'My private request space' : role === 'volunteer' ? 'Tasks matched to my skills' : 'Hospital operations console'}</h2></div>
          <div className="identity-card"><span>{session.id}</span><b>{session.assurance}</b></div>
        </header>

        {role === 'caregiver' && <div className="caregiver-grid">
          <div className="request-card">
            {submitted ? <div className={`success-state ${submittedForReferral ? 'redirected' : ''}`}><span className="success-icon">{submittedForReferral ? '!' : '✓'}</span><p className="eyebrow">{submittedForReferral ? 'VOLUNTEER MATCHING BLOCKED' : 'REQUEST RECEIVED'}</p><h3>{submittedForReferral ? 'This needs the formal AH service lane.' : urgent ? 'An AH admin is reviewing this now.' : 'That is one thing off your plate.'}</h3>{submittedForReferral ? <><p>CareKaki did not publish this request to volunteers. AH admin receives a redirect receipt and can guide it to an appropriate professional or service.</p>{scopeSignals.some((signal) => signal.emergency) && <div className="emergency-callout"><b>Life-threatening emergency?</b><span>Do not wait for an admin response — call SCDF at 995 now.</span></div>}<ol className="request-steps"><li><b>Volunteer offer disabled</b><span>No student can view, offer for or be assigned this request.</span></li><li><b>AH service review</b><span>An administrator confirms the appropriate formal route.</span></li><li><b>Redirect receipt</b><span>The decision closes with an accountable no-volunteer record.</span></li></ol></> : <><p>{isSilent ? 'Volunteers see your task alias, approximate zone and the minimum instructions only. Your name, photo, phone number and care details stay hidden.' : 'Your request is in the moderated matching queue.'}</p><ol className="request-steps"><li><b>Scope check</b><span>Admin confirms the request is bounded and non-clinical.</span></li><li><b>Eligible offer</b><span>Only a trained volunteer with the required skill can offer to help.</span></li><li><b>Protected handoff</b><span>Task details unlock after approval; identity remains hidden in Silent mode.</span></li></ol></>}<button onClick={() => setSubmitted(false)} className="button button-dark">Post another <Arrow /></button></div> : <>
              <div className="form-top"><span>ONE SMALL ASK</span><span>about 30 seconds</span></div>
              <label>What would make today lighter?<textarea value={request} onChange={(event) => { setRequest(event.target.value); setPrivacyBlocked(false) }} /></label>
              <div className="form-row"><label>Task category<select value={category} onChange={(event) => { const next = event.target.value as Category; setCategory(next); if (next !== 'Sensitive accompaniment') setFemalePreferred(false) }}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Volunteer recognition<div className="points-box">{points} <small>impact points · {viaHours}h service estimate</small></div></label></div>
              <button className={`silent-switch ${isSilent ? 'on' : ''}`} onClick={() => { setIsSilent(!isSilent); setPrivacyBlocked(false) }}><span className="switch-knob"></span><span><b>Silent Task</b><small>Volunteer cannot see your identity or contact details</small></span><em>{isSilent ? 'ON' : 'OFF'}</em></button>
              {isSilent && <div className={`privacy-preflight ${privacyBlocked ? 'blocked' : ''}`} aria-live="polite"><div><span>{privacyBlocked ? 'BLOCKED BEFORE POSTING' : 'SILENT TASK PRIVACY PREFLIGHT'}</span><b>{privacySignals.length ? `${privacySignals.length} direct identifier ${privacySignals.length === 1 ? 'type' : 'types'} detected` : 'No obvious direct identifiers detected'}</b></div>{privacySignals.length > 0 ? <ul>{privacySignals.map((signal) => <li key={signal.label}><b>{signal.label}</b><span>{signal.guidance}</span></li>)}</ul> : <p>We check the task text for obvious phone, email, identity-number, exact-location and stated-name patterns. AH still reviews the request before matching.</p>}</div>}
              {scopeSignals.length > 0 && <div className="scope-preflight" aria-live="polite"><div><span>OUTSIDE VOLUNTEER SCOPE</span><b>Will route to AH, never to a volunteer</b></div><ul>{scopeSignals.map((signal) => <li key={signal.label}><b>{signal.label}</b><span>{signal.guidance}</span></li>)}</ul></div>}
              <div className="option-row"><label className="check-option"><input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} /><span><b>Time-sensitive today</b><small>Routes to AH admin triage, not a public urgency bounty.</small></span></label>{category === 'Sensitive accompaniment' && <label className="check-option"><input type="checkbox" checked={femalePreferred} onChange={(event) => setFemalePreferred(event.target.checked)} /><span><b>Female support requested</b><small>For task-specific privacy or comfort; admin checks suitability.</small></span></label>}</div>
              <button className="button button-dark full" onClick={postTask}>{scopeSignals.length ? 'Create AH redirect receipt' : 'Send private request'} <Arrow /></button>
              <p className="form-foot">No medication, personal care, clinical advice, lifting, money handling or emergencies. Those go to the appropriate AH service.</p>
            </>}
          </div>
          <aside className="privacy-panel"><p className="eyebrow">WHAT THE VOLUNTEER SEES</p><div className="anon-profile"><span>C</span><div><b>Care request C-204</b><small>Identity held by AH admin</small></div></div><dl><div><dt>Name / photo</dt><dd>Hidden</dd></div><div><dt>Phone / exact address</dt><dd>Hidden</dd></div><div><dt>Approximate zone</dt><dd>Queenstown · 2 km</dd></div><div><dt>Communication</dt><dd>{isSilent ? 'Checklist only' : 'In-app chat allowed'}</dd></div></dl><div className="privacy-note"><span>✦</span><p><b>Silent means identity-private, not unaccountable.</b> AH can access the protected account only for matching, safety or incident follow-up.</p></div></aside>
        </div>}

        {role === 'volunteer' && <div className="volunteer-view">
          <div className="volunteer-strip"><article><span>PRIVATE PROGRESS</span><b>{verifiedPoints}</b><small>Points after AH verification</small></article><article><span>VERIFIED SERVICE</span><b>{verifiedHours}h</b><small>VIA subject to partner approval</small></article><article><span>RELIABILITY</span><b>96%</b><small>11 of 12 tasks completed</small></article><article className="league-card"><span>OPT-IN TEAM GOAL</span><b>14/20</b><small>SMU Care Crew · completed tasks</small></article></div>
          <div className="section-split"><div><p className="eyebrow">ELIGIBLE FOR YOU</p><h3>Offer help where your training and time fit.</h3></div><div className="skill-pills"><Badge tone="green">✓ Errands ready</Badge><Badge tone="green">✓ Digital help ready</Badge><Badge tone="blue">✓ Safeguarding + accompaniment</Badge><Badge tone="plain">Forms briefing not completed</Badge></div></div>
          <div className="readiness-rule"><span>DETERMINISTIC READINESS GATE</span><p>Every offer checks active training tags first. Sensitive tasks also stay locked until AH clears the exact bounded scope; gender preference never substitutes for readiness.</p></div>
          <div className="task-grid">{tasks.filter((task) => task.status !== 'Done' && !task.referralOnly).map((task) => {
            const isEligible = volunteerReadiness.includes(task.skill)
            const awaitingSafetyReview = !task.safetyCleared && (task.urgent || task.category === 'Sensitive accompaniment')
            return <article className={`volunteer-task ${task.urgent ? 'urgent' : ''} ${!isEligible || awaitingSafetyReview ? 'locked' : ''}`} key={task.id}>
              <div className="task-card-top"><div>{task.silent && <Badge tone="blue">Silent · anonymous</Badge>}{task.urgent && <Badge tone="red">Admin triage</Badge>}{task.femalePreferred && <Badge tone="amber">Female support requested</Badge>}</div><span>{task.id}</span></div>
              <p className="task-category">{task.category} · {task.difficulty}</p><h3>{task.title}</h3><div className="task-facts"><span>◷ {task.time}</span><span>⌖ {task.zone}</span><span>✓ {task.skill}</span></div>
              {task.femalePreferred && <p className="boundary-callout">No personal care or lifting. Admin confirms that the request is a bounded accompaniment task and assigns an appropriately cleared volunteer.</p>}
              {awaitingSafetyReview ? <p className="eligibility-callout review"><b>Locked · AH safety review</b><span>Scope and comfort preference must be cleared before any volunteer can offer.</span></p> : !isEligible ? <p className="eligibility-callout"><b>Not eligible yet</b><span>Complete {task.skill} before this task can be offered.</span></p> : <p className="eligibility-callout ready"><b>Eligible</b><span>Your active readiness tags satisfy this task gate.</span></p>}
              <div className="reward-row"><div><b>{task.points}</b><small>impact points</small></div><div><b>{task.viaHours}h</b><small>service estimate</small></div><div><b>{task.status === 'Open' ? 'Available' : task.status === 'Review' ? 'Offer pending' : 'Matched'}</b><small>{task.status === 'Review' && task.volunteer ? 'Admin confirmation needed' : 'task state'}</small></div></div>
              {task.status === 'Open' && isEligible && task.safetyCleared ? <button className="button button-dark full" onClick={() => acceptTask(task.id)}>Offer to help <Arrow /></button> : task.status === 'Matched' && task.volunteer === 'Maya T.' ? <div className="completion-form"><label>Private completion reflection<textarea aria-label={`Reflection for ${task.id}`} placeholder="What was completed, and was any follow-up needed?" value={reflections[task.id] || ''} onChange={(event) => setReflections({ ...reflections, [task.id]: event.target.value })} /></label><button className="button button-dark full" disabled={!(reflections[task.id] || '').trim()} onClick={() => completeTask(task.id)}>Submit completion receipt <Arrow /></button><small>Hours and points stay pending until AH verifies this record.</small></div> : <button className="button button-muted full" disabled>{awaitingSafetyReview ? 'Locked · AH review first' : !isEligible ? `Locked · ${task.skill} required` : task.status === 'Review' && task.volunteer === 'Maya T.' ? 'Offered · awaiting admin' : task.status}</button>}
            </article>
          })}</div>
          {completionReceipts.filter((task) => task.volunteer === 'Maya T.').length > 0 && <section className="receipt-shelf"><div className="receipt-shelf-head"><div><p className="eyebrow">MY SERVICE RECEIPTS</p><h3>Completion is recorded before recognition.</h3></div><Badge tone={pendingCompletions ? 'amber' : 'green'}>{pendingCompletions ? `${pendingCompletions} awaiting AH` : 'All verified'}</Badge></div>{completionReceipts.filter((task) => task.volunteer === 'Maya T.').map((task) => <article className="service-receipt" key={task.id}><div><span>{task.id} · {task.completion?.submittedAt}</span><b>{task.title}</b><p>“{task.completion?.reflection}”</p></div><div className="receipt-verdict"><Badge tone={task.completion?.verification === 'Verified by AH' ? 'green' : 'amber'}>{task.completion?.verification}</Badge><small>{task.completion?.verification === 'Verified by AH' ? `${task.viaHours}h verified · ${task.points} points recorded` : `${task.viaHours}h and ${task.points} points pending`}</small><em>Partner school decides VIA recognition.</em></div></article>)}</section>}
          <p className="ethics-note">Service time is verified after completion and reflection; partner schools decide whether it qualifies for VIA. Impact points recognise approved effort, reliability and contribution, never urgency, caregiver distress or risk. Progress stays private and team goals reveal no caregiver data.</p>
        </div>}

        {role === 'admin' && <div className="admin-view">
          {adminNotice && <div className="admin-notice">✓ {adminNotice}</div>}
          <div className="admin-metrics"><article><span>OPEN TASKS</span><b>{openCount}</b><small>across approved categories</small></article><article><span>NEEDS REVIEW</span><b>{reviewCount}</b><small>offers + sensitive tasks</small></article><article><span>COMPLETION CHECKS</span><b>{pendingCompletions}</b><small>before time or points post</small></article><article><span>SAFETY INCIDENTS</span><b>0</b><small>illustrative pilot dashboard</small></article></div>
          <div className="admin-columns">
            <section className="admin-panel"><div className="panel-head"><div><p className="eyebrow">TRIAGE & MATCHING</p><h3>One accountable queue</h3></div><Badge tone="red">1 urgent</Badge></div>
              <div className="admin-task-list">{tasks.filter((task) => task.status === 'Review' || ((task.urgent || task.category === 'Sensitive accompaniment') && !task.safetyCleared)).map((task) => <article key={task.id}><div className="admin-task-title"><span>{task.id}</span><div><b>{task.title}</b><small>{task.category} · {task.zone}</small></div></div><div className="admin-flags">{task.silent && <Badge tone="blue">Identity vaulted</Badge>}{task.urgent && <Badge tone="red">Time-sensitive</Badge>}{task.femalePreferred && <Badge tone="amber">Female support preference</Badge>}{task.referralOnly && <Badge tone="red">Formal service only</Badge>}<Badge tone={task.safetyCleared ? 'green' : 'red'}>{task.safetyCleared ? 'Scope cleared' : 'Offer gate locked'}</Badge></div>{task.scopeFlags.length > 0 && <div className="scope-flags">Detected: {task.scopeFlags.join(' · ')}</div>}<p>{task.referralOnly ? 'Volunteer matching is structurally disabled. Confirm the appropriate professional, clinical or emergency route and close an accountable redirect receipt.' : task.femalePreferred ? 'Confirm no personal care, lifting or clinical work. If bounded, release only to volunteers with Safeguarding + accompaniment readiness; otherwise redirect to formal care support.' : 'Confirm scope, volunteer eligibility and minimum-detail release.'}</p><div className="admin-actions">{task.referralOnly ? <button className="button button-dark" onClick={() => confirmRedirect(task.id)}>Confirm formal redirect <Arrow /></button> : task.status === 'Review' && task.volunteer ? <button className="button button-dark" onClick={() => approveTask(task.id)}>Approve match <Arrow /></button> : !task.safetyCleared ? <button className="button button-dark" onClick={() => releaseTask(task.id)}>Clear bounded scope <Arrow /></button> : <button className="button button-outline" onClick={() => setAdminNotice(`${task.id} routed for direct coordinator outreach.`)}>Find suitable volunteer</button>}{!task.referralOnly && <button className="text-action" onClick={() => setAdminNotice(`${task.id} escalated to the AH service lane; volunteer matching paused.`)}>Escalate / redirect</button>}</div></article>)}</div>
            </section>
            <section className="admin-panel"><div className="panel-head"><div><p className="eyebrow">ACCOUNT ADMINISTRATION</p><h3>People, access, readiness</h3></div><Badge tone="green">Protected</Badge></div>
              <div className="account-list">{[{ id: 'MC-204', name: 'Male caregiver account', role: 'Caregiver · identity verified' }, { id: 'VL-031', name: 'Maya Tan', role: 'Volunteer · 4 skill badges' }, { id: 'VL-044', name: 'Arjun Lee', role: 'Volunteer · renewal due' }].map((account) => <article key={account.id}><div className="account-avatar">{account.id.slice(0, 2)}</div><div><b>{account.name}</b><small>{account.id} · {account.role}</small></div><Badge tone={accountState[account.id] === 'Active' ? 'green' : 'amber'}>{accountState[account.id]}</Badge><button onClick={() => toggleAccount(account.id)}>{accountState[account.id] === 'Active' ? 'Pause' : 'Activate'}</button></article>)}</div>
              <div className="vault-note"><span>▣</span><p><b>Need-to-know identity vault</b><br />Volunteers never receive caregiver names, photos, phone numbers or exact addresses for Silent Tasks. Admin access is logged and limited to programme operations and safety follow-up.</p></div>
            </section>
          </div>
          <section className="admin-panel completion-queue"><div className="panel-head"><div><p className="eyebrow">COMPLETION & RECOGNITION</p><h3>Verify the work, then release the record</h3></div><Badge tone={pendingCompletions ? 'amber' : 'green'}>{pendingCompletions ? `${pendingCompletions} pending` : 'Queue clear'}</Badge></div>{completionReceipts.length ? <div className="admin-task-list">{completionReceipts.map((task) => <article key={task.id}><div className="admin-task-title"><span>{task.id}</span><div><b>{task.title}</b><small>{task.volunteer} · submitted {task.completion?.submittedAt}</small></div></div><div className="admin-flags"><Badge tone="blue">No caregiver identity in receipt</Badge><Badge tone={task.completion?.verification === 'Verified by AH' ? 'green' : 'amber'}>{task.completion?.verification}</Badge></div><p className="receipt-reflection">Volunteer reflection: “{task.completion?.reflection}”</p><div className="verification-summary"><span><b>{task.viaHours}h</b> service time</span><span><b>{task.points}</b> impact points</span><span><b>Partner review</b> for VIA</span></div>{task.completion?.verification === 'Pending AH verification' ? <button className="button button-dark" onClick={() => verifyCompletion(task.id)}>Verify completion <Arrow /></button> : <p className="verified-line">✓ Verified {task.completion?.verifiedAt}; private record released for partner-school review.</p>}</article>)}</div> : <div className="empty-queue"><b>No completion receipts yet.</b><span>Completed tasks appear here for AH review before time or points are recorded.</span></div>}</section>
        </div>}
      </section>

      <footer className="portal-footer"><span>CareKaki Bridge · role-bound interactive demo</span><span>Operational data shown here is illustrative.</span></footer>
    </main>
  )
}
