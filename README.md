# CareKaki Bridge

A SparkX⁺Change prototype for Alexandra Hospital's caregiver respite challenge.

**CareKaki Bridge** is a TaskRabbit-adjacent, AH-safe task marketplace where male caregivers can request small, practical help without the social friction of asking directly. Student volunteers claim scoped, non-clinical tasks and earn VIA-style hours, points, and portfolio receipts.

## Why this direction

The team's final solution moved toward:

- male caregivers posting different varieties of help tasks;
- a **Silent Task** option to reduce paisehness;
- student volunteer matching by skill/category;
- gamified VIA/reward incentives;
- heavier tasks earning more points/VIA hours.

This prototype turns that into a judge-visible flow:

> caregiver has a burden → posts silent task → volunteer claims → safety guardrail prevents clinical advice → receipt/points generated.

## Evidence-backed design choices

| Product choice | Research reason |
|---|---|
| Silent Task mode | male caregivers are often reluctant to seek help and prefer practical, solution-oriented support |
| Task categories | caregiver needs are heterogeneous: errands, transport, admin, reminders, companionship, home setup |
| VIA/points | makes youth participation operationally sustainable and measurable |
| AH-safe guardrails | volunteers must not provide medication/clinical advice; escalation goes to nurse/pharmacist/MSW |
| Receipt dashboard | AH needs a lightweight operator-visible way to track uptake, risk, and follow-up |

## Local development

```bash
npm install
npm run dev
```

## Build verification

```bash
npm run build
```

## Demo script

1. Show the landing page: “silent-help task marketplace for male caregivers”.
2. Toggle **Silent Task ON** and create a task.
3. Show the new task appearing on the volunteer board.
4. Volunteer claims it and marks it done.
5. Explain that clinical tasks are escalated, not answered by students.
6. Pitch metric: number of silent tasks accepted, VIA hours delivered, and clinical advice violations = 0.

## Rule-clean clinical boundary

CareKaki Bridge is not a medical advice system. It supports logistics, wayfinding, reminders, companionship, and admin help only. Any clinical concern is routed to AH staff.
