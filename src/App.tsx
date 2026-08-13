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
}

const initialTasks: Task[] = [
  { id: 'CK-204', title: 'Collect discharge essentials from AH pharmacy counter', category: 'Errands', time: 'Today · 7:30 pm', zone: 'AH campus', silent: true, urgent: false, femalePreferred: false, status: 'Open', points: 40, viaHours: 1, difficulty: 'Light', skill: 'Errands ready', volunteer: '' },
  { id: 'CK-205', title: 'Escort mum from clinic reception to booked taxi pickup', category: 'Sensitive accompaniment', time: 'Today · 5:45 pm', zone: 'AH campus', silent: true, urgent: true, femalePreferred: true, status: 'Open', points: 90, viaHours: 1.5, difficulty: 'Weightier', skill: 'Safeguarding + accompaniment', volunteer: '' },
  { id: 'CK-206', title: 'Set gentle appointment reminders on my phone', category: 'Digital help', time: 'Tomorrow · 8:00 pm', zone: 'Remote', silent: false, urgent: false, femalePreferred: false, status: 'Matched', points: 30, viaHours: 0.5, difficulty: 'Skilled', skill: 'Digital help ready', volunteer: 'Arjun L.' },
  { id: 'CK-207', title: 'Help complete a non-clinical transport form', category: 'Admin & forms', time: 'Fri · 4:15 pm', zone: 'Queenstown · 2 km band', silent: true, urgent: false, femalePreferred: false, status: 'Open', points: 55, viaHours: 1, difficulty: 'Skilled', skill: 'Forms briefing', volunteer: '' },
]

const categories: Category[] = ['Errands', 'Digital help', 'Wayfinding', 'Meals & home', 'Admin & forms', 'Companionship', 'Sensitive accompaniment']
const roleCopy: Record<Role, { label: string; eyebrow: string }> = {
  caregiver: { label: 'Caregiver', eyebrow: 'ASK FOR ONE SMALL THING' },
  volunteer: { label: 'Volunteer', eyebrow: 'CHOOSE A TASK THAT FITS' },
  admin: { label: 'AH admin', eyebrow: 'OVERSEE SAFETY & FULFILMENT' },
}

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
  const reviewCount = tasks.filter((task) => task.status === 'Review' || task.urgent).length
  const points = useMemo(() => {
    const base: Record<Category, number> = { Errands: 40, 'Digital help': 30, Wayfinding: 45, 'Meals & home': 45, 'Admin & forms': 55, Companionship: 60, 'Sensitive accompaniment': 75 }
    return base[category] + (urgent ? 15 : 0)
  }, [category, urgent])
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
    }
    setTasks([newTask, ...tasks])
    setSubmitted(true)
  }

  function acceptTask(id: string) {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: 'Review', volunteer: 'Maya T.' } : task))
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
            {submitted ? <div className="success-state"><span className="success-icon">✓</span><p className="eyebrow">REQUEST RECEIVED</p><h3>{urgent ? 'An AH admin is reviewing this now.' : 'That is one thing off your plate.'}</h3><p>{isSilent ? 'Volunteers see your task alias, approximate zone and the minimum instructions only. Your name, photo, phone number and care details stay hidden.' : 'Your request is in the moderated matching queue.'}</p><ol className="request-steps"><li><b>Scope check</b><span>Admin confirms the request is bounded and non-clinical.</span></li><li><b>Eligible acceptance</b><span>Only a trained volunteer with the required skill can accept.</span></li><li><b>Protected handoff</b><span>Task details unlock after approval; identity remains hidden in Silent mode.</span></li></ol><button onClick={() => setSubmitted(false)} className="button button-dark">Post another <Arrow /></button></div> : <>
              <div className="form-top"><span>ONE SMALL ASK</span><span>about 30 seconds</span></div>
              <label>What would make today lighter?<textarea value={request} onChange={(event) => setRequest(event.target.value)} /></label>
              <div className="form-row"><label>Task category<select value={category} onChange={(event) => { const next = event.target.value as Category; setCategory(next); if (next !== 'Sensitive accompaniment') setFemalePreferred(false) }}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Volunteer recognition<div className="points-box">{points} <small>points · {viaHours} VIA hr{viaHours === 1 ? '' : 's'}</small></div></label></div>
              <button className={`silent-switch ${isSilent ? 'on' : ''}`} onClick={() => setIsSilent(!isSilent)}><span className="switch-knob"></span><span><b>Silent Task</b><small>Volunteer cannot see your identity or contact details</small></span><em>{isSilent ? 'ON' : 'OFF'}</em></button>
              <div className="option-row"><label className="check-option"><input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} /><span><b>Time-sensitive today</b><small>Routes to AH admin triage, not a public urgency bounty.</small></span></label>{category === 'Sensitive accompaniment' && <label className="check-option"><input type="checkbox" checked={femalePreferred} onChange={(event) => setFemalePreferred(event.target.checked)} /><span><b>Female support requested</b><small>For task-specific privacy or comfort; admin checks suitability.</small></span></label>}</div>
              <button className="button button-dark full" onClick={postTask}>Send private request <Arrow /></button>
              <p className="form-foot">No medication, personal care, clinical advice, lifting, money handling or emergencies. Those go to the appropriate AH service.</p>
            </>}
          </div>
          <aside className="privacy-panel"><p className="eyebrow">WHAT THE VOLUNTEER SEES</p><div className="anon-profile"><span>C</span><div><b>Care request C-204</b><small>Identity held by AH admin</small></div></div><dl><div><dt>Name / photo</dt><dd>Hidden</dd></div><div><dt>Phone / exact address</dt><dd>Hidden</dd></div><div><dt>Approximate zone</dt><dd>Queenstown · 2 km</dd></div><div><dt>Communication</dt><dd>{isSilent ? 'Checklist only' : 'In-app chat allowed'}</dd></div></dl><div className="privacy-note"><span>✦</span><p><b>Silent means identity-private, not unaccountable.</b> AH can access the protected account only for matching, safety or incident follow-up.</p></div></aside>
        </div>}

        {role === 'volunteer' && <div className="volunteer-view">
          <div className="volunteer-strip"><article><span>IMPACT POINTS</span><b>620</b><small>Level 3 · Steady Kaki</small></article><article><span>VERIFIED VIA</span><b>8.5h</b><small>Based on completed time</small></article><article><span>RELIABILITY</span><b>96%</b><small>11 of 12 tasks completed</small></article><article className="league-card"><span>OPT-IN TEAM LEAGUE</span><b>#2</b><small>SMU Care Crew · no caregiver data shown</small></article></div>
          <div className="section-split"><div><p className="eyebrow">ELIGIBLE FOR YOU</p><h3>Accept what fits your training and time.</h3></div><div className="skill-pills"><Badge tone="green">✓ Errands</Badge><Badge tone="green">✓ Digital help</Badge><Badge tone="blue">✓ Safeguarding</Badge><Badge tone="amber">Accompaniment supervised</Badge></div></div>
          <div className="task-grid">{tasks.filter((task) => task.status !== 'Done').map((task) => <article className={`volunteer-task ${task.urgent ? 'urgent' : ''}`} key={task.id}>
            <div className="task-card-top"><div>{task.silent && <Badge tone="blue">Silent · anonymous</Badge>}{task.urgent && <Badge tone="red">Admin triage</Badge>}{task.femalePreferred && <Badge tone="amber">Female support requested</Badge>}</div><span>{task.id}</span></div>
            <p className="task-category">{task.category} · {task.difficulty}</p><h3>{task.title}</h3><div className="task-facts"><span>◷ {task.time}</span><span>⌖ {task.zone}</span><span>✓ {task.skill}</span></div>
            {task.femalePreferred && <p className="boundary-callout">No personal care or lifting. Admin confirms that the request is a bounded accompaniment task and assigns an appropriately cleared volunteer.</p>}
            <div className="reward-row"><div><b>{task.points}</b><small>impact points</small></div><div><b>{task.viaHours}h</b><small>verified VIA</small></div><div><b>{task.status === 'Open' ? 'Available' : task.status === 'Review' ? 'Acceptance pending' : 'Matched'}</b><small>{task.status === 'Review' && task.volunteer ? 'Admin confirmation needed' : 'task state'}</small></div></div>
            {task.status === 'Open' ? <button className="button button-dark full" onClick={() => acceptTask(task.id)}>Accept task <Arrow /></button> : task.status === 'Matched' && task.volunteer === 'Maya T.' ? <button className="button button-dark full" onClick={() => completeTask(task.id)}>Mark complete <Arrow /></button> : <button className="button button-muted full" disabled>{task.status === 'Review' && task.volunteer === 'Maya T.' ? 'Accepted · awaiting admin' : task.status}</button>}
          </article>)}</div>
          <p className="ethics-note">VIA hours follow verified service and training time. Difficulty and inconvenience affect impact points, not fabricated service hours. Rankings are opt-in and never reveal caregiver identities or sensitive task details.</p>
        </div>}

        {role === 'admin' && <div className="admin-view">
          {adminNotice && <div className="admin-notice">✓ {adminNotice}</div>}
          <div className="admin-metrics"><article><span>OPEN TASKS</span><b>{openCount}</b><small>across approved categories</small></article><article><span>NEEDS REVIEW</span><b>{reviewCount}</b><small>acceptances + sensitive tasks</small></article><article><span>ACTIVE VOLUNTEERS</span><b>18</b><small>5 skill groups</small></article><article><span>SAFETY INCIDENTS</span><b>0</b><small>illustrative pilot dashboard</small></article></div>
          <div className="admin-columns">
            <section className="admin-panel"><div className="panel-head"><div><p className="eyebrow">TRIAGE & MATCHING</p><h3>One accountable queue</h3></div><Badge tone="red">1 urgent</Badge></div>
              <div className="admin-task-list">{tasks.filter((task) => task.status === 'Review' || task.urgent).map((task) => <article key={task.id}><div className="admin-task-title"><span>{task.id}</span><div><b>{task.title}</b><small>{task.category} · {task.zone}</small></div></div><div className="admin-flags">{task.silent && <Badge tone="blue">Identity vaulted</Badge>}{task.urgent && <Badge tone="red">Time-sensitive</Badge>}{task.femalePreferred && <Badge tone="amber">Female support preference</Badge>}</div><p>{task.femalePreferred ? 'Confirm no personal care, lifting or clinical work. Route to a suitably trained female volunteer, or redirect to formal care support if the need crosses scope.' : 'Confirm scope, volunteer eligibility and minimum-detail release.'}</p><div className="admin-actions">{task.status === 'Review' && task.volunteer ? <button className="button button-dark" onClick={() => approveTask(task.id)}>Approve match <Arrow /></button> : <button className="button button-outline" onClick={() => setAdminNotice(`${task.id} routed for direct coordinator outreach.`)}>Find suitable volunteer</button>}<button className="text-action" onClick={() => setAdminNotice(`${task.id} escalated to the AH service lane; volunteer matching paused.`)}>Escalate / redirect</button></div></article>)}</div>
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
        <div className="principle-grid"><article><span className="number">01</span><h3>Caregiver controls the ask</h3><p>Choose a varied practical task, hide identity, minimise conversation and request task-specific support preferences.</p></article><article><span className="number">02</span><h3>Volunteer chooses the fit</h3><p>Accept unpaid OTOT tasks by skill, time and category; earn verified VIA, points, rewards and opt-in team recognition.</p></article><article><span className="number">03</span><h3>Hospital owns the risk</h3><p>Administer accounts, approve sensitive matches, protect identity, redirect unsafe requests and retain an accountable receipt.</p></article></div>
      </section>

      <section className="safety-section"><div><p className="eyebrow">THE CAREKAKI PROMISE</p><h2>Warmth needs<br /><em>clear edges.</em></h2></div><div className="safety-grid"><article><span>↳</span><h3>We do</h3><p>Errands, meals, reminder setup, wayfinding, basic forms, companionship and bounded accompaniment.</p></article><article><span>×</span><h3>We do not</h3><p>Medication, personal care, clinical advice, lifting or transfers, finances, diagnosis or emergency response.</p></article><article><span>!</span><h3>We escalate</h3><p>Urgent and sensitive requests go to a named AH admin for fit, scope, referral and no-show recovery.</p></article></div></section>

      <section className="pilot-banner"><div><p className="eyebrow">THE JUDGE-VISIBLE LOOP</p><h2>Ask → accept →<br />approve → receipt.</h2></div><div className="pilot-metrics"><span><b>3</b> role-specific views</span><span><b>7</b> practical categories</span><span><b>0</b> identity fields shown to volunteers</span></div></section>

      <footer><a className="brand" href="#top"><Mark /><span>carekaki<span className="brand-light">bridge</span></span></a><p>Silent help. Visible relief. Managed with care.</p><span>SparkX⁺Change · Alexandra Hospital · interactive concept demo</span></footer>
    </main>
  )
}
