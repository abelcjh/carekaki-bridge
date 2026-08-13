import { useMemo, useState } from 'react'
import heroImage from './assets/carekaki-hero.png'
import './App.css'

type TaskStatus = 'Open' | 'Review' | 'Matched' | 'Done'
type Category = 'Errands' | 'Tech set-up' | 'Wayfinding' | 'Meals & home'

type Task = {
  id: string
  title: string
  category: Category
  time: string
  location: string
  silent: boolean
  status: TaskStatus
  points: number
  volunteer: string
}

const initialTasks: Task[] = [
  { id: 'CK-1024', title: 'Collect discharge essentials', category: 'Errands', time: 'Today · 7:30 pm', location: 'AH Lobby B', silent: true, status: 'Open', points: 40, volunteer: '' },
  { id: 'CK-1025', title: 'Set gentle appointment reminders', category: 'Tech set-up', time: 'Tomorrow · 8:00 pm', location: 'Remote / bedside', silent: false, status: 'Matched', points: 25, volunteer: 'Arjun L.' },
  { id: 'CK-1026', title: 'Walk with me to AIC Link', category: 'Wayfinding', time: 'Fri · 4:15 pm', location: 'AH Clinic Exit', silent: true, status: 'Open', points: 55, volunteer: '' },
]

const categories: Category[] = ['Errands', 'Tech set-up', 'Wayfinding', 'Meals & home']

const readinessByCategory: Record<Category, string> = {
  Errands: 'Orientation + errands briefing',
  'Tech set-up': 'Orientation + digital-help briefing',
  Wayfinding: 'Orientation + wayfinding briefing',
  'Meals & home': 'Orientation + home-support briefing',
}

function Mark() {
  return <div className="mark" aria-label="CareKaki Bridge"><span></span><span></span><span></span></div>
}

function Arrow() { return <span className="arrow">↗</span> }

export default function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [isSilent, setIsSilent] = useState(true)
  const [category, setCategory] = useState<Category>('Errands')
  const [request, setRequest] = useState('Pick up a simple dinner and leave it at the ward counter')
  const [submitted, setSubmitted] = useState(false)
  const [filter, setFilter] = useState<'All' | TaskStatus>('All')

  const visibleTasks = filter === 'All' ? tasks : tasks.filter((task) => task.status === filter)
  const openCount = tasks.filter((task) => task.status === 'Open').length
  const silentRate = Math.round((tasks.filter((task) => task.silent).length / tasks.length) * 100)
  const points = useMemo(() => (category === 'Wayfinding' ? 55 : category === 'Tech set-up' ? 25 : category === 'Meals & home' ? 35 : 40) + (isSilent ? 10 : 0), [category, isSilent])

  function postTask() {
    const newTask: Task = {
      id: `CK-${1027 + tasks.length}`,
      title: request,
      category,
      time: 'Next available slot',
      location: 'AH / recovery route',
      silent: isSilent,
      status: 'Open',
      points,
      volunteer: '',
    }
    setTasks([newTask, ...tasks])
    setSubmitted(true)
  }

  function advanceTask(task: Task) {
    setTasks(tasks.map((item) => {
      if (item.id !== task.id) return item
      if (item.status === 'Open') return { ...item, status: 'Review', volunteer: 'Maya T.' }
      if (item.status === 'Matched') return { ...item, status: 'Done' }
      return item
    }))
  }

  return (
    <main>
      <nav className="nav-shell">
        <a className="brand" href="#top"><Mark /><span>carekaki<span className="brand-light">bridge</span></span></a>
        <div className="nav-links"><a href="#how">How it works</a><a href="#tasks">Task board</a><a href="#safety">Safety</a></div>
        <a className="nav-cta" href="#request">Post a task <Arrow /></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">ALEXANDRA HOSPITAL · CAREGIVER RESPITE PILOT</p>
          <h1>Help, on your<br /><em>own terms.</em></h1>
          <p className="lede">A quiet, practical way for caregivers to offload one thing today — matched with trained youth volunteers, never clinical care.</p>
          <div className="hero-actions"><a className="button button-dark" href="#request">Post a silent task <Arrow /></a><a className="text-link" href="#how">See how it works <span>↓</span></a></div>
          <div className="trust-row"><span><b>01</b> one small ask</span><i></i><span><b>02</b> a trusted match</span><i></i><span><b>03</b> visible relief</span></div>
        </div>
        <div className="hero-visual">
          <img src={heroImage} alt="A caregiver and youth volunteer reviewing a practical checklist together" />
          <div className="image-wash"></div>
          <div className="floating-card"><span className="soft-label">QUIETLY DONE</span><strong>“No call needed.<br />Just message me.”</strong><div><span className="mini-dot"></span> Silent Task enabled</div></div>
          <div className="hero-stamp"><span>CAREKAKI</span><b>24</b><span>BRIDGE</span></div>
        </div>
      </section>

      <section className="principles" id="how">
        <p className="eyebrow">DESIGNED FOR REAL LIFE</p>
        <div className="section-heading"><h2>Not another place<br />to explain yourself.</h2><p>CareKaki turns the invisible load into a clear next action. Pick a small task. Keep it low-contact. Know exactly what happens next.</p></div>
        <div className="principle-grid">
          <article><span className="number">01</span><h3>Task-first</h3><p>Choose from familiar, concrete asks — an errand, a form, a reminder, a route.</p></article>
          <article><span className="number">02</span><h3>Silence is a setting</h3><p>No call, no small talk, no need to share more than you want to.</p></article>
          <article><span className="number">03</span><h3>Safe by design</h3><p>Trained volunteers help with logistics. Care concerns go straight back to the care team.</p></article>
        </div>
      </section>

      <section className="request-section" id="request">
        <div className="request-aside"><p className="eyebrow">CAREGIVER REQUEST</p><h2>What would make<br /><em>today</em> lighter?</h2><p>Start with a small, practical task. You can change the details later — this is only a safe first step.</p><div className="side-note"><span>✦</span><p><b>Silent Task</b><br />A private, low-contact request. Your volunteer sees only what is needed to help.</p></div></div>
        <div className="request-card">
          {submitted ? <div className="success-state"><span>✓</span><p className="eyebrow">REQUEST RECEIVED</p><h3>That is one thing off your plate.</h3><p>Your request is now in the moderated queue. We will only surface it to volunteers cleared for this task type.</p><ol className="request-steps" aria-label="What happens next"><li><b>Scope check</b><span>A coordinator checks that the ask is safe and non-clinical.</span></li><li><b>Suitable match</b><span>Only a volunteer cleared for this task type can be offered the request.</span></li><li><b>Minimum details</b><span>Practical contact or location details are shared only after an approved match.</span></li></ol><button onClick={() => setSubmitted(false)} className="button button-dark">Post another <Arrow /></button></div> : <>
            <div className="form-top"><span>01 / 01</span><span>about 30 seconds</span></div>
            <label>What do you need help with?<textarea value={request} onChange={(event) => setRequest(event.target.value)} /></label>
            <div className="form-row"><label>Task type<select value={category} onChange={(event) => setCategory(event.target.value as Category)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Suggested recognition <div className="points-box">{points} <small>points</small></div></label></div>
            <button className={`silent-switch ${isSilent ? 'on' : ''}`} onClick={() => setIsSilent(!isSilent)}><span className="switch-knob"></span><span><b>Silent Task</b><small>No call or conversation expected</small></span><em>{isSilent ? 'ON' : 'OFF'}</em></button>
            <button className="button button-dark full" onClick={postTask}>Place my request <Arrow /></button>
            <p className="form-foot">Non-clinical help only. For symptoms, medication, falls or distress, please speak with your care team.</p>
          </>}
        </div>
      </section>

      <section className="board-section" id="tasks">
        <div className="board-top"><div><p className="eyebrow">VOLUNTEER TASK BOARD</p><h2>Small asks.<br /><em>Real relief.</em></h2></div><div className="board-summary"><b>{openCount}</b><span>tasks ready<br />for a match</span></div></div>
        <div className="filter-row">{(['All', 'Open', 'Review', 'Matched', 'Done'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'filter active' : 'filter'}>{item}</button>)}<span className="filter-note"><span className="mini-dot"></span> coordinator-confirmed matches</span></div>
        <div className="task-stack">{visibleTasks.map((task) => <article className="task-row" key={task.id}><div className="task-index"><span>{task.id}</span><b>{task.silent ? 'S' : '·'}</b></div><div className="task-main"><div className="task-meta"><span>{task.category}</span><span>{task.location}</span><span>{task.time}</span></div><h3>{task.title}</h3><p className="task-readiness">Required: {readinessByCategory[task.category]}</p></div><div className="task-reward"><b>{task.points}</b><span>points</span></div><div className="task-status"><span className={`status ${task.status.toLowerCase()}`}>{task.status === 'Review' ? 'Awaiting review' : task.status}</span>{task.volunteer && <small>{task.status === 'Done' ? 'Receipt issued' : task.status === 'Review' ? 'Offer received' : task.volunteer}</small>}</div><button className="task-action" onClick={() => advanceTask(task)} disabled={task.status === 'Review' || task.status === 'Done'}>{task.status === 'Open' ? 'Offer help' : task.status === 'Review' ? 'Coordinator review' : task.status === 'Matched' ? 'Complete' : 'Done'} <Arrow /></button></article>)}</div>
      </section>

      <section className="safety-section" id="safety">
        <div><p className="eyebrow">THE CAREKAKI PROMISE</p><h2>Warmth needs<br /><em>clear edges.</em></h2></div>
        <div className="safety-grid"><article><span>↳</span><h3>We do</h3><p>Errands, meals, reminder setup, wayfinding, basic forms, companionship and home organisation.</p></article><article><span>×</span><h3>We do not</h3><p>Medication, wound care, lifting, personal care, diagnosis, medical interpretation or crisis support.</p></article><article><span>!</span><h3>We escalate</h3><p>Every concern has a named AH-linked owner, an incident route and an accountable receipt.</p></article></div>
      </section>

      <section className="pilot-banner"><div><p className="eyebrow">ONE NARROW PILOT. DONE WELL.</p><h2>Built with caregivers,<br />not just for them.</h2></div><div className="pilot-metrics"><span><b>{silentRate}%</b> silent task uptake</span><span><b>0</b> clinical advice incidents</span><span><b>20–30</b> caregiver pilot cohort</span></div></section>

      <footer><a className="brand" href="#top"><Mark /><span>carekaki<span className="brand-light">bridge</span></span></a><p>Silent help. Visible relief. Managed with care.</p><span>SparkX⁺Change · Alexandra Hospital</span></footer>
    </main>
  )
}
