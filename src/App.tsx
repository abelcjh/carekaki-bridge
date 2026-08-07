import { useMemo, useState } from 'react'
import './App.css'

type TaskCategory = 'Errands' | 'Transport' | 'Tech help' | 'Meal support' | 'Companionship' | 'Admin' | 'Home setup'
type TaskStatus = 'Open' | 'Matched' | 'Done'

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
}

const starterTasks: HelpTask[] = [
  {
    id: 'T-1024',
    title: 'Pick up discharge supplies from pharmacy',
    category: 'Errands',
    location: 'Alexandra Hospital, Lobby B',
    time: 'Today, 7:30 PM',
    points: 40,
    viaHours: 1,
    silent: true,
    clinicalRisk: false,
    caregiver: 'Mr L, son caring for father',
    status: 'Open',
    notes: 'No need to call me. Please message when queue number is close.',
  },
  {
    id: 'T-1025',
    title: 'Set up calendar reminders for wound dressing appointments',
    category: 'Tech help',
    location: 'Ward 2 demo bedside',
    time: 'Tomorrow, 8:00 PM',
    points: 25,
    viaHours: 0.5,
    silent: false,
    clinicalRisk: false,
    caregiver: 'Albert, working son',
    status: 'Matched',
    notes: 'Use Google Calendar / WhatsApp reminders only. Clinical questions go to nurse.',
  },
  {
    id: 'T-1026',
    title: 'Walk with caregiver to AIC Link counter after appointment',
    category: 'Admin',
    location: 'AH clinic exit',
    time: 'Fri, 4:15 PM',
    points: 55,
    viaHours: 1.5,
    silent: true,
    clinicalRisk: false,
    caregiver: 'Only-child caregiver',
    status: 'Open',
    notes: 'Caregiver feels paiseh asking family. Just accompany and help take notes.',
  },
]

const categories: TaskCategory[] = ['Errands', 'Transport', 'Tech help', 'Meal support', 'Companionship', 'Admin', 'Home setup']

function App() {
  const [tasks, setTasks] = useState<HelpTask[]>(starterTasks)
  const [silent, setSilent] = useState(true)
  const [category, setCategory] = useState<TaskCategory>('Errands')
  const [title, setTitle] = useState('Buy dinner and leave it at ward counter')
  const [notes, setNotes] = useState('No conversation needed, just message after drop-off')
  const [triageFlag, setTriageFlag] = useState(false)

  const openTasks = tasks.filter((task) => task.status === 'Open')
  const totalVia = tasks.reduce((sum, task) => sum + (task.status === 'Done' ? task.viaHours : 0), 0)
  const silentShare = Math.round((tasks.filter((task) => task.silent).length / tasks.length) * 100)

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
      notes: triageFlag ? 'Flagged: volunteer may only support logistics. Clinical concern escalated to nurse/MSW.' : notes,
    }
    setTasks([newTask, ...tasks])
  }

  function claimTask(id: string) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status: 'Matched' } : task)))
  }

  function completeTask(id: string) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status: 'Done' } : task)))
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">SparkX⁺Change · Alexandra Hospital caregiver respite</p>
          <h1>CareKaki Bridge</h1>
          <p className="hero-copy">
            A silent-help task marketplace where male caregivers can offload small burdens without the
            paisehness of asking, while trained students earn VIA hours through scoped, non-clinical support.
          </p>
          <div className="hero-actions">
            <a href="#request" className="primary">Post a silent task</a>
            <a href="#board" className="secondary">View volunteer board</a>
          </div>
        </div>
        <aside className="impact-card">
          <span>10-second demo loop</span>
          <strong>Need help → post silent task → volunteer claims → AH-safe receipt</strong>
          <p>No therapy labels. No generic resource search. Just practical support caregivers will actually accept.</p>
        </aside>
      </section>

      <section className="stats-grid" aria-label="pilot metrics">
        <div><strong>{openTasks.length}</strong><span>open help requests</span></div>
        <div><strong>{silentShare}%</strong><span>silent / low-contact tasks</span></div>
        <div><strong>{totalVia.toFixed(1)}</strong><span>VIA hours completed</span></div>
        <div><strong>0</strong><span>clinical advice by volunteers</span></div>
      </section>

      <section className="split" id="request">
        <div className="panel form-panel">
          <p className="eyebrow">Caregiver side</p>
          <h2>Request help without needing to explain yourself</h2>
          <label>
            Task title
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Notes shown to volunteer
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <div className="toggle-row">
            <button className={silent ? 'toggle active' : 'toggle'} onClick={() => setSilent(!silent)}>
              {silent ? 'Silent Task ON' : 'Silent Task OFF'}
            </button>
            <button className={triageFlag ? 'toggle danger' : 'toggle'} onClick={() => setTriageFlag(!triageFlag)}>
              {triageFlag ? 'Clinical concern flagged' : 'No clinical concern'}
            </button>
          </div>
          <button className="primary wide" onClick={createTask}>Create request · {suggestedPoints} pts</button>
        </div>

        <div className="panel safety-panel">
          <p className="eyebrow">AH-safe task guardrail</p>
          <h2>Volunteers help with tasks, not treatment</h2>
          <ul>
            <li>Medication, wounds, symptoms, insulin, falls → route to nurse/pharmacist/MSW.</li>
            <li>Allowed: errands, wayfinding, reminder setup, meal pickup, forms, companionship.</li>
            <li>Every task creates a receipt: who helped, what was done, what was escalated.</li>
          </ul>
        </div>
      </section>

      <section className="panel" id="board">
        <div className="section-head">
          <div>
            <p className="eyebrow">Volunteer side</p>
            <h2>Claim OTOT tasks, earn VIA hours, build a verified care portfolio</h2>
          </div>
          <span className="badge">Gamified but bounded</span>
        </div>
        <div className="task-grid">
          {tasks.map((task) => (
            <article className="task-card" key={task.id}>
              <div className="task-topline">
                <span>{task.id}</span>
                <strong className={`status ${task.status.toLowerCase()}`}>{task.status}</strong>
              </div>
              <h3>{task.title}</h3>
              <p>{task.notes}</p>
              <div className="chips">
                <span>{task.category}</span>
                <span>{task.points} pts</span>
                <span>{task.viaHours} VIA hr</span>
                {task.silent && <span>silent</span>}
                {task.clinicalRisk && <span className="risk">escalated</span>}
              </div>
              <dl>
                <div><dt>Caregiver</dt><dd>{task.caregiver}</dd></div>
                <div><dt>When</dt><dd>{task.time}</dd></div>
                <div><dt>Where</dt><dd>{task.location}</dd></div>
              </dl>
              <div className="card-actions">
                {task.status === 'Open' && <button onClick={() => claimTask(task.id)}>Claim task</button>}
                {task.status === 'Matched' && <button onClick={() => completeTask(task.id)}>Mark done</button>}
                {task.status === 'Done' && <span className="done-note">Receipt generated</span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="split">
        <div className="panel">
          <p className="eyebrow">Why it wins</p>
          <h2>Aligned to the final direction</h2>
          <p>
            This MVP centres the team’s TaskRabbit-adjacent idea: different task types, Silent Task mode,
            student incentives, weighted points, and clear categories for different volunteer skills.
          </p>
        </div>
        <div className="panel">
          <p className="eyebrow">Pilot model</p>
          <h2>Start narrow at AH</h2>
          <p>
            Begin with one ward / discharge route, 30 caregivers, trained student volunteers, and a weekly
            exportable receipt dashboard for AH staff to review safety, uptake, and caregiver relief.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
