import { useMemo, useState } from 'react'
import './App.css'

type TaskCategory = 'Errands' | 'Transport' | 'Tech help' | 'Meal support' | 'Companionship' | 'Admin' | 'Home setup'
type TaskStatus = 'Open' | 'Matched' | 'Done'
type VolunteerStatus = 'Ready' | 'Training due' | 'Assigned'

type HelpTask = {
  id: string
  title: string
  category: TaskCategory
  location: string
  time: string
  points: number
  viaHours: number
  silent: boolean
  clinicalRisk: boolean
  caregiver: string
  status: TaskStatus
  notes: string
  owner: string
}

type Volunteer = {
  name: string
  skill: string
  status: VolunteerStatus
  hours: number
  reliability: number
}

const categories: TaskCategory[] = ['Errands', 'Transport', 'Tech help', 'Meal support', 'Companionship', 'Admin', 'Home setup']

const starterTasks: HelpTask[] = [
  { id: 'T-1024', title: 'Pick up discharge supplies from pharmacy', category: 'Errands', location: 'Alexandra Hospital, Lobby B', time: 'Today, 7:30 PM', points: 40, viaHours: 1, silent: true, clinicalRisk: false, caregiver: 'Mr L, son caring for father', status: 'Open', notes: 'No need to call me. Please message when queue number is close.', owner: 'Volunteer Ops Lead' },
  { id: 'T-1025', title: 'Set up calendar reminders for wound dressing appointments', category: 'Tech help', location: 'Ward 2 demo bedside', time: 'Tomorrow, 8:00 PM', points: 25, viaHours: 0.5, silent: false, clinicalRisk: false, caregiver: 'Albert, working son', status: 'Matched', notes: 'Use Google Calendar / WhatsApp reminders only. Clinical questions go to nurse.', owner: 'Student Tech Kaki' },
  { id: 'T-1026', title: 'Walk with caregiver to AIC Link counter after appointment', category: 'Admin', location: 'AH clinic exit', time: 'Fri, 4:15 PM', points: 55, viaHours: 1.5, silent: true, clinicalRisk: false, caregiver: 'Only-child caregiver', status: 'Open', notes: 'Caregiver feels paiseh asking family. Just accompany and help take notes.', owner: 'Volunteer Ops Lead' },
]

const starterVolunteers: Volunteer[] = [
  { name: 'Maya Tan', skill: 'Errands · escort', status: 'Ready', hours: 4.5, reliability: 98 },
  { name: 'Arjun Lim', skill: 'Tech setup · admin', status: 'Assigned', hours: 3, reliability: 100 },
  { name: 'Haziq Rahman', skill: 'Companionship · meal support', status: 'Training due', hours: 0, reliability: 0 },
]

function App() {
  const [tasks, setTasks] = useState<HelpTask[]>(starterTasks)
  const [volunteers, setVolunteers] = useState<Volunteer[]>(starterVolunteers)
  const [silent, setSilent] = useState(true)
  const [category, setCategory] = useState<TaskCategory>('Errands')
  const [title, setTitle] = useState('Buy dinner and leave it at ward counter')
  const [notes, setNotes] = useState('No conversation needed, just message after drop-off')
  const [triageFlag, setTriageFlag] = useState(false)

  const openTasks = tasks.filter((task) => task.status === 'Open')
  const totalVia = tasks.reduce((sum, task) => sum + (task.status === 'Done' ? task.viaHours : 0), 0)
  const silentShare = Math.round((tasks.filter((task) => task.silent).length / tasks.length) * 100)
  const readyVolunteers = volunteers.filter((volunteer) => volunteer.status === 'Ready').length
  const suggestedPoints = useMemo(() => {
    const base = category === 'Transport' ? 70 : category === 'Tech help' ? 30 : category === 'Companionship' ? 35 : 45
    return base + (silent ? 10 : 0) + (triageFlag ? 0 : 5)
  }, [category, silent, triageFlag])

  function createTask() {
    const newTask: HelpTask = {
      id: `T-${1027 + tasks.length}`,
      title,
      category,
      location: 'AH / home recovery route',
      time: 'Next available volunteer slot',
      points: suggestedPoints,
      viaHours: suggestedPoints >= 60 ? 1.5 : suggestedPoints >= 40 ? 1 : 0.5,
      silent,
      clinicalRisk: triageFlag,
      caregiver: 'New male caregiver',
      status: triageFlag ? 'Matched' : 'Open',
      notes: triageFlag ? 'Flagged: volunteer supports logistics only. Clinical concern escalated to nurse/MSW.' : notes,
      owner: triageFlag ? 'AH clinical escalation owner' : 'Volunteer Ops Lead',
    }
    setTasks([newTask, ...tasks])
  }

  function claimTask(id: string) {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: 'Matched', owner: 'Matched volunteer · completion due' } : task))
  }

  function completeTask(id: string) {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status: 'Done', owner: 'Receipt issued · AH review queue' } : task))
  }

  function completeTraining(index: number) {
    setVolunteers(volunteers.map((volunteer, i) => i === index ? { ...volunteer, status: 'Ready', reliability: 100 } : volunteer))
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">SparkX⁺Change · Alexandra Hospital caregiver respite</p>
          <h1>CareKaki Bridge</h1>
          <p className="hero-copy">A silent-help task marketplace where male caregivers offload small burdens without paisehness, while trained youth volunteers deliver scoped support and earn verified VIA hours.</p>
          <div className="hero-actions"><a href="#request" className="primary">Post a silent task</a><a href="#ops" className="secondary">View volunteer ops</a></div>
        </div>
        <aside className="impact-card"><span>Programme-fit loop</span><strong>Request → match → safely complete → measure relief</strong><p>CareKaki turns AH’s existing support and youth recruitment into a managed, measurable caregiver-respite programme.</p></aside>
      </section>

      <section className="stats-grid" aria-label="pilot metrics">
        <div><strong>{openTasks.length}</strong><span>open help requests</span></div>
        <div><strong>{readyVolunteers}</strong><span>trained volunteers ready</span></div>
        <div><strong>{silentShare}%</strong><span>silent / low-contact tasks</span></div>
        <div><strong>{totalVia.toFixed(1)}</strong><span>VIA hours completed</span></div>
      </section>

      <section className="programme-strip"><strong>Programme requirements built in:</strong><span>male-friendly respite</span><span>youth tech enablement</span><span>volunteer management</span><span>project management</span><span>measurable 6-month impact</span></section>

      <section className="split" id="request">
        <div className="panel form-panel">
          <p className="eyebrow">Caregiver side</p><h2>Request help without needing to explain yourself</h2>
          <label>Task title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label>Category<select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Notes shown to volunteer<textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
          <div className="toggle-row"><button className={silent ? 'toggle active' : 'toggle'} onClick={() => setSilent(!silent)}>{silent ? 'Silent Task ON' : 'Silent Task OFF'}</button><button className={triageFlag ? 'toggle danger' : 'toggle'} onClick={() => setTriageFlag(!triageFlag)}>{triageFlag ? 'Clinical concern flagged' : 'No clinical concern'}</button></div>
          <button className="primary wide" onClick={createTask}>Create request · {suggestedPoints} pts</button>
        </div>
        <div className="panel safety-panel"><p className="eyebrow">AH-safe task guardrail</p><h2>Volunteers help with tasks, not treatment</h2><ul><li>Medication, wounds, symptoms, insulin, falls → nurse/pharmacist/MSW.</li><li>Allowed: errands, wayfinding, reminder setup, meal pickup, forms, companionship.</li><li>Every task creates an owner, receipt, and escalation path.</li></ul></div>
      </section>

      <section className="panel" id="board"><div className="section-head"><div><p className="eyebrow">Volunteer side</p><h2>Claim OTOT tasks, earn VIA hours, build a verified care portfolio</h2></div><span className="badge">Gamified but bounded</span></div><div className="task-grid">{tasks.map((task) => <article className="task-card" key={task.id}><div className="task-topline"><span>{task.id}</span><strong className={`status ${task.status.toLowerCase()}`}>{task.status}</strong></div><h3>{task.title}</h3><p>{task.notes}</p><div className="chips"><span>{task.category}</span><span>{task.points} pts</span><span>{task.viaHours} VIA hr</span>{task.silent && <span>silent</span>}{task.clinicalRisk && <span className="risk">escalated</span>}</div><dl><div><dt>Caregiver</dt><dd>{task.caregiver}</dd></div><div><dt>When</dt><dd>{task.time}</dd></div><div><dt>Owner</dt><dd>{task.owner}</dd></div></dl><div className="card-actions">{task.status === 'Open' && <button onClick={() => claimTask(task.id)}>Claim task</button>}{task.status === 'Matched' && <button onClick={() => completeTask(task.id)}>Mark done</button>}{task.status === 'Done' && <span className="done-note">Receipt generated</span>}</div></article>)}</div></section>

      <section className="ops-grid" id="ops">
        <div className="panel"><p className="eyebrow">Volunteer management</p><h2>Recruit, train, deploy, recognise</h2><p>Every youth volunteer moves through a lightweight safe-service pathway before claiming caregiver tasks.</p><div className="roster">{volunteers.map((volunteer, index) => <div className="roster-row" key={volunteer.name}><div><strong>{volunteer.name}</strong><span>{volunteer.skill} · {volunteer.hours} VIA hrs</span></div><span className={`roster-status ${volunteer.status.toLowerCase().replace(' ', '-')}`}>{volunteer.status}</span>{volunteer.status === 'Training due' ? <button onClick={() => completeTraining(index)}>Complete briefing</button> : <small>{volunteer.reliability ? `${volunteer.reliability}% reliable` : 'Awaiting first task'}</small>}</div>)}</div><div className="mini-flow"><span>1. Screen</span><span>2. AH briefing</span><span>3. Skill-tag</span><span>4. Match</span><span>5. VIA receipt</span></div></div>
        <div className="panel"><p className="eyebrow">Project management</p><h2>Run the pilot like an AH programme, not an unowned app</h2><div className="milestones"><div><b>Week 0–2</b><span>Recruit 20 youth volunteers, run safeguarding + escalation briefing.</span><em>Owner: Volunteer Ops</em></div><div><b>Week 3–4</b><span>Launch one discharge route; daily task moderation and receipt review.</span><em>Owner: AH/C3U liaison</em></div><div><b>Month 2–6</b><span>Review uptake, caregiver confidence/stress, repeat requests, and incidents weekly.</span><em>Owner: Impact lead</em></div></div><p className="impact-note">Impact dashboard: caregivers supported · tasks completed · silent-task uptake · VIA hours · caregiver stress/confidence change · clinical incidents = 0.</p></div>
      </section>

      <section className="split"><div className="panel"><p className="eyebrow">Existing support, activated</p><h2>Not another directory</h2><p>NUHS already offers caregiver education, training, resources and tailored support-group/programme matching. CareKaki is the activation layer: a youth volunteer can help a caregiver set reminders, navigate the directory, or attend a practical programme without replacing clinical or counselling support.</p></div><div className="panel"><p className="eyebrow">Pilot model</p><h2>Start narrow at AH</h2><p>One ward/discharge route, 20–30 caregivers, trained youth volunteers, a weekly operations huddle, and an exportable receipt dashboard for AH safety, uptake and caregiver-relief review.</p></div></section>
    </main>
  )
}

export default App
