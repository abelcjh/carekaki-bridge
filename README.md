# CareKaki Bridge

A SparkX⁺Change prototype for Alexandra Hospital's caregiver-respite challenge.

**CareKaki Bridge** is an AH-safe, TaskRabbit-adjacent **youth volunteer programme and task marketplace**. Male caregivers request small practical help without the social friction of asking directly; trained student volunteers claim bounded non-clinical tasks and earn verified VIA-style hours, points and care-service receipts.

## Programme alignment

| Required element | In the prototype |
|---|---|
| Male-friendly caregiver respite | Silent Task, no-call preference and practical task-first framing |
| Youth technology component | Reminder, teleconsult/platform, WhatsApp and support-directory navigation help |
| Volunteer management | Recruit, screen, briefing, skill tag, task match, supervision, recognition/VIA receipt |
| Project management | Named pilot owners, milestones, weekly operating huddle, moderation, escalation and metrics |
| Measurable impact | Tasks completed, silent-task uptake, caregivers supported, repeat use, VIA hours, caregiver confidence/stress and incidents |
| Existing-service integration | AH/C3U and official NUHS/AIC referral/programme pathways, rather than copying clinical services |

## Judge-visible flow

> caregiver has a burden → posts a Silent Task → trained volunteer claims → safety guardrail prevents clinical advice → receipt/points/VIA record → weekly AH operations review.

## Volunteer-management model

1. **Recruit** youth through school/community partners.
2. **Screen and brief** on confidentiality, boundaries, escalation and safeguarding.
3. **Skill-tag** volunteers (tech, errands, escort, admin, companionship).
4. **Match and supervise** through availability, task category, completion receipt and incident route.
5. **Recognise** verified VIA hours, reliability and service portfolio outcomes.

No volunteer may provide medication, wound care, personal care, lifting, diagnosis or mental-health/crisis support. These route to AH professionals and/or official pathways.

## Why this direction

The team’s final solution calls for:

- male caregivers posting different kinds of help tasks;
- a **Silent Task** option to reduce paisehness;
- student-volunteer matching by skill/category;
- gamified VIA/reward incentives;
- heavier tasks earning more points/VIA hours.

NUHS already provides caregiver support information, education, programme matching and referral pathways. CareKaki is the **activation layer**, not a replacement for counselling, medical care or official programme referral: youth can assist with digital setup, wayfinding, registration and reminders while professionals retain clinical responsibility.

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
```

## Demo script

1. Show the programme-fit strip: youth tech enablement, volunteer management, project management and impact.
2. Toggle **Silent Task ON** and create a task.
3. Show the new task on the volunteer board, then claim and complete it.
4. Open **Volunteer Ops**: training gate, skill tags, readiness and reliability.
5. Show **Project Management**: named owners, pilot milestones and measurable impact dashboard.
6. Explain that any clinical concern is escalated, not answered by students.

## Research

See [RESEARCH.md](./RESEARCH.md) for the source audit, NUHS/FormSG findings, local ecosystem fit and validation plan.
