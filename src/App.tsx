import { useMemo, useState } from 'react'
import heroImage from './assets/carekaki-hero.png'
import './App.css'

type Role = 'caregiver' | 'volunteer' | 'admin'
type TaskStatus = 'Open' | 'Review' | 'Matched' | 'Done'
type Category = 'Errands' | 'Digital help' | 'Wayfinding' | 'Meals & home' | 'Admin & forms' | 'Companionship' | 'Sensitive accompaniment'
type Difficulty = 'Light' | 'Skilled' | 'Weightier'

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
}

const initialTasks: Task[] = [
  { id: 'CK-204', title: 'Collect discharge essentials from AH pharmacy counter', category: 'Errands', time: 'Today · 7:30 pm', zone: 'AH campus', silent: true, urgent: false, femalePreferred: false, status: 'Open', points: 40, viaHours: 1, difficulty: 'Light', skill: 'Errands ready', volunteer: '', safetyCleared: true },
  { id: 'CK-205', title: 'Escort mum from clinic reception to booked taxi pickup', category: 'Sensitive accompaniment', time: 'Today · 5:45 pm', zone: 'AH campus', silent: true, urgent: true, femalePreferred: true, status: 'Open', points: 60, viaHours: 1.5, difficulty: 'Weightier', skill: 'Safeguarding + accompaniment', volunteer: '', safetyCleared: false },
  { id: 'CK-206', title: 'Set gentle appointment reminders on my phone', category: 'Digital help', time: 'Tomorrow · 8:00 pm', zone: 'Remote', silent: false, urgent: false, femalePreferred: false, status: 'Matched', points: 35, viaHours: 0.5, difficulty: 'Skilled', skill: 'Digital help ready', volunteer: 'Arjun L.', safetyCleared: true },
  { id: 'CK-207', title: 'Help complete a non-clinical transport form', category: 'Admin & forms', time: 'Fri · 4:15 pm', zone: 'Queenstown · 2 km band', silent: true, urgent: false, femalePreferred: false, status: 'Open', points: 50, viaHours: 1, difficulty: 'Skilled', skill: 'Forms briefing', volunteer: '', safetyCleared: true },
]

const categories: Category[] = ['Errands', 'Digital help', 'Wayfinding', 'Meals & home', 'Admin & forms', 'Companionship', 'Sensitive accompaniment']
const roleCopy: Record<Role, { label: string; eyebrow: string }> = {
  caregiver: { label: 'Caregiver', eyebrow: 'ASK FOR ONE SMALL THING' },
  volunteer: { label: 'Volunteer', eyebrow: 'CHOOSE A TASK THAT FITS' },
  admin: { label: 'AH admin', eyebrow: 'OVERSEE SAFETY & FULFILMENT' },
}
const volunteerReadiness = ['Errands ready', 'Digital help ready', 'Safeguarding + accompaniment']

function Mark() {
  return <div className="mark" aria-label="CareKaki Bridge"><span></span><span></span><span></span></div>
}

function Arrow() { return <span className="arrow">↗</span> }

function Badge({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'green' | 'amber' | 'red' | 'blue' }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

export default function App() {
  const [role, setRole] = useState<Role>('caregiver')
  const [tasks, setTasks] = useState(initialTasks)
  const [isSilent, setIsSilent] = useState(true)
  const [category, setCategory] = useState<Category>('Errands')
  const [request, setRequest] = useState('Pick up a simple dinner and leave it at the ward counter')
  const [femalePreferred, setFemalePreferred] = useState(false)
  const [urgent, setUrgent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [adminNotice, setAdminNotice] = useState('')
  const [accountState, setAccountState] = useState<Record<string, string>>({ 'MC-204': 'Active', 'VL-031': 'Active', 'VL-044': 'Training due' })

  const openCount = tasks.filter((task) => task.status === 'Open').length
  const reviewCount = tasks.filter((task) => task.status === 'Review' || ((task.urgent || task.category === 'Sensitive accompaniment') && !task.safetyCleared)).length
  const points = useMemo(() => {
    const base: Record<Category, number> = { Errands: 40, 'Digital help': 35, Wayfinding: 45, 'Meals & home': 45, 'Admin & forms': 50, Companionship: 55, 'Sensitive accompaniment': 60 }
    return base[category]
  }, [category])
  const viaHours = category === 'Digital help' ? 0.5 : category === 'Sensitive accompaniment' ? 1.5 : 1

  function postTask() {
    const newTask: Task = {
      id: `CK-${208 + tasks.length}`,
      title: request,
      category,
      time: urgent ? 'Today · urgent review' : 'Next available slot',
      zone: 'Queenstown · approximate zone',
      silent: isSilent,
      urgent,
      femalePreferred: femalePreferred && category === 'Sensitive accompaniment',
      status: urgent || category === 'Sensitive accompaniment' ? 'Review' : 'Open',
      points,
      viaHours,
      difficulty: urgent || category === 'Sensitive accompaniment' ? 'Weightier' : category === 'Digital help' ? 'Skilled' : 'Light',
      skill: category === 'Sensitive accompaniment' ? 'Safeguarding + accompaniment' : `${category} ready`,
      volunteer: '',
      safetyCleared: !urgent && category !== 'Sensitive accompaniment',
    }
    setTasks([newTask, ...tasks])
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
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: 'Done' } : task))
  }

  function toggleAccount(id: string) {
    setAccountState({ ...accountState, [id]: accountState[id] === 'Active' ? 'Paused' : 'Active' })
  }

  return (
    <main>
      <nav className="nav-shell">
        <a className="brand" href="#top"><Mark /><span>carekaki<span className="brand-light">bridge</span></span></a>
        <div className="role-switch" aria-label="Choose interface">
          {(Object.keys(roleCopy) as Role[]).map((item) => <button key={item} className={role === item ? 'active' : ''} onClick={() => setRole(item)}><span>{item === 'caregiver' ? '01' : item === 'volunteer' ? '02' : '03'}</span>{roleCopy[item].label}</button>)}
        </div>
        <div className="secure-chip"><span></span> AH-supervised demo</div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">ALEXANDRA HOSPITAL · CAREGIVER RESPITE PILOT</p>
          <h1>Help, on your<br /><em>own terms.</em></h1>
          <p className="lede">Male caregivers ask for one bounded, practical task. Trained students step in. Hospital admins keep every match safe and accountable.</p>
          <div className="hero-actions"><button className="button button-dark" onClick={() => { setRole('caregiver'); document.getElementById('workspace')?.scrollIntoView() }}>Open caregiver view <Arrow /></button><button className="text-link button-link" onClick={() => { setRole('volunteer'); document.getElementById('workspace')?.scrollIntoView() }}>I want to volunteer <span>↓</span></button></div>
          <div className="trust-row"><span><b>01</b> anonymous ask</span><i></i><span><b>02</b> trained match</span><i></i><span><b>03</b> admin receipt</span></div>
        </div>
        <div className="hero-visual">
          <img src={heroImage} alt="A caregiver and youth volunteer reviewing a practical checklist together" />
          <div className="image-wash"></div>
          <div className="floating-card"><span className="soft-label">SILENT TASK</span><strong>“No name. No call.<br />Just one clear ask.”</strong><div><span className="mini-dot"></span> Identity protected from volunteers</div></div>
          <div className="hero-stamp"><span>CAREKAKI</span><b>24</b><span>BRIDGE</span></div>
        </div>
      </section>

      <section className="workspace" id="workspace">
        <header className="workspace-head">
          <div><p className="eyebrow">{roleCopy[role].eyebrow}</p><h2>{role === 'caregiver' ? 'My private request space' : role === 'volunteer' ? 'Tasks matched to my skills' : 'Hospital operations console'}</h2></div>
          <div className="identity-card"><span>{role === 'caregiver' ? 'C-204' : role === 'volunteer' ? 'Maya T.' : 'AH-C3U Admin'}</span><b>{role === 'caregiver' ? 'Anonymous to volunteers' : role === 'volunteer' ? 'Identity + training verified' : 'Account administrator'}</b></div>
        </header>

        {role === 'caregiver' && <div className="caregiver-grid">
          <div className="request-card">
            {submitted ? <div className="success-state"><span className="success-icon">✓</span><p className="eyebrow">REQUEST RECEIVED</p><h3>{urgent ? 'An AH admin is reviewing this now.' : 'That is one thing off your plate.'}</h3><p>{isSilent ? 'Volunteers see your task alias, approximate zone and the minimum instructions only. Your name, photo, phone number and care details stay hidden.' : 'Your request is in the moderated matching queue.'}</p><ol className="request-steps"><li><b>Scope check</b><span>Admin confirms the request is bounded and non-clinical.</span></li><li><b>Eligible offer</b><span>Only a trained volunteer with the required skill can offer to help.</span></li><li><b>Protected handoff</b><span>Task details unlock after approval; identity remains hidden in Silent mode.</span></li></ol><button onClick={() => setSubmitted(false)} className="button button-dark">Post another <Arrow /></button></div> : <>
              <div className="form-top"><span>ONE SMALL ASK</span><span>about 30 seconds</span></div>
              <label>What would make today lighter?<textarea value={request} onChange={(event) => setRequest(event.target.value)} /></label>
              <div className="form-row"><label>Task category<select value={category} onChange={(event) => { const next = event.target.value as Category; setCategory(next); if (next !== 'Sensitive accompaniment') setFemalePreferred(false) }}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Volunteer recognition<div className="points-box">{points} <small>impact points · {viaHours}h service estimate</small></div></label></div>
              <button className={`silent-switch ${isSilent ? 'on' : ''}`} onClick={() => setIsSilent(!isSilent)}><span className="switch-knob"></span><span><b>Silent Task</b><small>Volunteer cannot see your identity or contact details</small></span><em>{isSilent ? 'ON' : 'OFF'}</em></button>
              <div className="option-row"><label className="check-option"><input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} /><span><b>Time-sensitive today</b><small>Routes to AH admin triage, not a public urgency bounty.</small></span></label>{category === 'Sensitive accompaniment' && <label className="check-option"><input type="checkbox" checked={femalePreferred} onChange={(event) => setFemalePreferred(event.target.checked)} /><span><b>Female support requested</b><small>For task-specific privacy or comfort; admin checks suitability.</small></span></label>}</div>
              <button className="button button-dark full" onClick={postTask}>Send private request <Arrow /></button>
              <p className="form-foot">No medication, personal care, clinical advice, lifting, money handling or emergencies. Those go to the appropriate AH service.</p>
            </>}
          </div>
          <aside className="privacy-panel"><p className="eyebrow">WHAT THE VOLUNTEER SEES</p><div className="anon-profile"><span>C</span><div><b>Care request C-204</b><small>Identity held by AH admin</small></div></div><dl><div><dt>Name / photo</dt><dd>Hidden</dd></div><div><dt>Phone / exact address</dt><dd>Hidden</dd></div><div><dt>Approximate zone</dt><dd>Queenstown · 2 km</dd></div><div><dt>Communication</dt><dd>{isSilent ? 'Checklist only' : 'In-app chat allowed'}</dd></div></dl><div className="privacy-note"><span>✦</span><p><b>Silent means identity-private, not unaccountable.</b> AH can access the protected account only for matching, safety or incident follow-up.</p></div></aside>
        </div>}

        {role === 'volunteer' && <div className="volunteer-view">
          <div className="volunteer-strip"><article><span>PRIVATE PROGRESS</span><b>620</b><small>Level 3 · Steady Kaki</small></article><article><span>VERIFIED SERVICE</span><b>8.5h</b><small>VIA subject to partner approval</small></article><article><span>RELIABILITY</span><b>96%</b><small>11 of 12 tasks completed</small></article><article className="league-card"><span>OPT-IN TEAM GOAL</span><b>14/20</b><small>SMU Care Crew · completed tasks</small></article></div>
          <div className="section-split"><div><p className="eyebrow">ELIGIBLE FOR YOU</p><h3>Offer help where your training and time fit.</h3></div><div className="skill-pills"><Badge tone="green">✓ Errands ready</Badge><Badge tone="green">✓ Digital help ready</Badge><Badge tone="blue">✓ Safeguarding + accompaniment</Badge><Badge tone="plain">Forms briefing not completed</Badge></div></div>
          <div className="readiness-rule"><span>DETERMINISTIC READINESS GATE</span><p>Every offer checks active training tags first. Sensitive tasks also stay locked until AH clears the exact bounded scope; gender preference never substitutes for readiness.</p></div>
          <div className="task-grid">{tasks.filter((task) => task.status !== 'Done').map((task) => {
            const isEligible = volunteerReadiness.includes(task.skill)
            const awaitingSafetyReview = !task.safetyCleared && (task.urgent || task.category === 'Sensitive accompaniment')
            return <article className={`volunteer-task ${task.urgent ? 'urgent' : ''} ${!isEligible || awaitingSafetyReview ? 'locked' : ''}`} key={task.id}>
              <div className="task-card-top"><div>{task.silent && <Badge tone="blue">Silent · anonymous</Badge>}{task.urgent && <Badge tone="red">Admin triage</Badge>}{task.femalePreferred && <Badge tone="amber">Female support requested</Badge>}</div><span>{task.id}</span></div>
              <p className="task-category">{task.category} · {task.difficulty}</p><h3>{task.title}</h3><div className="task-facts"><span>◷ {task.time}</span><span>⌖ {task.zone}</span><span>✓ {task.skill}</span></div>
              {task.femalePreferred && <p className="boundary-callout">No personal care or lifting. Admin confirms that the request is a bounded accompaniment task and assigns an appropriately cleared volunteer.</p>}
              {awaitingSafetyReview ? <p className="eligibility-callout review"><b>Locked · AH safety review</b><span>Scope and comfort preference must be cleared before any volunteer can offer.</span></p> : !isEligible ? <p className="eligibility-callout"><b>Not eligible yet</b><span>Complete {task.skill} before this task can be offered.</span></p> : <p className="eligibility-callout ready"><b>Eligible</b><span>Your active readiness tags satisfy this task gate.</span></p>}
              <div className="reward-row"><div><b>{task.points}</b><small>impact points</small></div><div><b>{task.viaHours}h</b><small>service estimate</small></div><div><b>{task.status === 'Open' ? 'Available' : task.status === 'Review' ? 'Offer pending' : 'Matched'}</b><small>{task.status === 'Review' && task.volunteer ? 'Admin confirmation needed' : 'task state'}</small></div></div>
              {task.status === 'Open' && isEligible && task.safetyCleared ? <button className="button button-dark full" onClick={() => acceptTask(task.id)}>Offer to help <Arrow /></button> : task.status === 'Matched' && task.volunteer === 'Maya T.' ? <button className="button button-dark full" onClick={() => completeTask(task.id)}>Mark complete <Arrow /></button> : <button className="button button-muted full" disabled>{awaitingSafetyReview ? 'Locked · AH review first' : !isEligible ? `Locked · ${task.skill} required` : task.status === 'Review' && task.volunteer === 'Maya T.' ? 'Offered · awaiting admin' : task.status}</button>}
            </article>
          })}</div>
          <p className="ethics-note">Service time is verified after completion and reflection; partner schools decide whether it qualifies for VIA. Impact points recognise approved effort, reliability and contribution, never urgency, caregiver distress or risk. Progress stays private and team goals reveal no caregiver data.</p>
        </div>}

        {role === 'admin' && <div className="admin-view">
          {adminNotice && <div className="admin-notice">✓ {adminNotice}</div>}
          <div className="admin-metrics"><article><span>OPEN TASKS</span><b>{openCount}</b><small>across approved categories</small></article><article><span>NEEDS REVIEW</span><b>{reviewCount}</b><small>volunteer offers + sensitive tasks</small></article><article><span>ACTIVE VOLUNTEERS</span><b>18</b><small>5 skill groups</small></article><article><span>SAFETY INCIDENTS</span><b>0</b><small>illustrative pilot dashboard</small></article></div>
          <div className="admin-columns">
            <section className="admin-panel"><div className="panel-head"><div><p className="eyebrow">TRIAGE & MATCHING</p><h3>One accountable queue</h3></div><Badge tone="red">1 urgent</Badge></div>
              <div className="admin-task-list">{tasks.filter((task) => task.status === 'Review' || ((task.urgent || task.category === 'Sensitive accompaniment') && !task.safetyCleared)).map((task) => <article key={task.id}><div className="admin-task-title"><span>{task.id}</span><div><b>{task.title}</b><small>{task.category} · {task.zone}</small></div></div><div className="admin-flags">{task.silent && <Badge tone="blue">Identity vaulted</Badge>}{task.urgent && <Badge tone="red">Time-sensitive</Badge>}{task.femalePreferred && <Badge tone="amber">Female support preference</Badge>}<Badge tone={task.safetyCleared ? 'green' : 'red'}>{task.safetyCleared ? 'Scope cleared' : 'Offer gate locked'}</Badge></div><p>{task.femalePreferred ? 'Confirm no personal care, lifting or clinical work. If bounded, release only to volunteers with Safeguarding + accompaniment readiness; otherwise redirect to formal care support.' : 'Confirm scope, volunteer eligibility and minimum-detail release.'}</p><div className="admin-actions">{task.status === 'Review' && task.volunteer ? <button className="button button-dark" onClick={() => approveTask(task.id)}>Approve match <Arrow /></button> : !task.safetyCleared ? <button className="button button-dark" onClick={() => releaseTask(task.id)}>Clear bounded scope <Arrow /></button> : <button className="button button-outline" onClick={() => setAdminNotice(`${task.id} routed for direct coordinator outreach.`)}>Find suitable volunteer</button>}<button className="text-action" onClick={() => setAdminNotice(`${task.id} escalated to the AH service lane; volunteer matching paused.`)}>Escalate / redirect</button></div></article>)}</div>
            </section>
            <section className="admin-panel"><div className="panel-head"><div><p className="eyebrow">ACCOUNT ADMINISTRATION</p><h3>People, access, readiness</h3></div><Badge tone="green">Protected</Badge></div>
              <div className="account-list">{[{ id: 'MC-204', name: 'Male caregiver account', role: 'Caregiver · identity verified' }, { id: 'VL-031', name: 'Maya Tan', role: 'Volunteer · 4 skill badges' }, { id: 'VL-044', name: 'Arjun Lee', role: 'Volunteer · renewal due' }].map((account) => <article key={account.id}><div className="account-avatar">{account.id.slice(0, 2)}</div><div><b>{account.name}</b><small>{account.id} · {account.role}</small></div><Badge tone={accountState[account.id] === 'Active' ? 'green' : 'amber'}>{accountState[account.id]}</Badge><button onClick={() => toggleAccount(account.id)}>{accountState[account.id] === 'Active' ? 'Pause' : 'Activate'}</button></article>)}</div>
              <div className="vault-note"><span>▣</span><p><b>Need-to-know identity vault</b><br />Volunteers never receive caregiver names, photos, phone numbers or exact addresses for Silent Tasks. Admin access is logged and limited to programme operations and safety follow-up.</p></div>
            </section>
          </div>
        </div>}
      </section>

      <section className="principles">
        <p className="eyebrow">ONE SERVICE · THREE CLEAR RESPONSIBILITIES</p>
        <div className="principle-grid"><article><span className="number">01</span><h3>Caregiver controls the ask</h3><p>Choose a varied practical task, hide identity, minimise conversation and request task-specific support preferences.</p></article><article><span className="number">02</span><h3>Volunteer chooses the fit</h3><p>Offer help for unpaid OTOT tasks by skill, time and category; build private progress through verified contribution.</p></article><article><span className="number">03</span><h3>Hospital owns the risk</h3><p>Administer accounts, approve sensitive matches, protect identity, redirect unsafe requests and retain an accountable receipt.</p></article></div>
      </section>

      <section className="safety-section"><div><p className="eyebrow">THE CAREKAKI PROMISE</p><h2>Warmth needs<br /><em>clear edges.</em></h2></div><div className="safety-grid"><article><span>↳</span><h3>We do</h3><p>Errands, meals, reminder setup, wayfinding, basic forms, companionship and bounded accompaniment.</p></article><article><span>×</span><h3>We do not</h3><p>Medication, personal care, clinical advice, lifting or transfers, finances, diagnosis or emergency response.</p></article><article><span>!</span><h3>We escalate</h3><p>Urgent and sensitive requests go to a named AH admin for fit, scope, referral and no-show recovery.</p></article></div></section>

      <section className="pilot-banner"><div><p className="eyebrow">THE JUDGE-VISIBLE LOOP</p><h2>Ask → offer →<br />approve → receipt.</h2></div><div className="pilot-metrics"><span><b>3</b> role-specific views</span><span><b>7</b> practical categories</span><span><b>0</b> identity fields shown to volunteers</span></div></section>

      <footer><a className="brand" href="#top"><Mark /><span>carekaki<span className="brand-light">bridge</span></span></a><p>Silent help. Visible relief. Managed with care.</p><span>SparkX⁺Change · Alexandra Hospital · interactive concept demo</span></footer>
    </main>
  )
}
