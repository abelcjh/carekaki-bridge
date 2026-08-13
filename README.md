# CareKaki Bridge

> **Help, on your own terms.** A high-trust, AH-linked caregiver-respite pilot for small, bounded non-clinical tasks.

[Live prototype](https://abelcjh.github.io/carekaki-bridge/) · [Editable V2 deck](https://docs.google.com/presentation/d/1Be8o3WgWZ4HiMO0bN_4A_JVgpNycGeqs/edit) · [Research and standards](./RESEARCH.md)

![CareKaki Bridge hero](./src/assets/carekaki-hero.png)

## What this prototype demonstrates

CareKaki Bridge is not a generic gig app or substitute for clinical care. It is an **activation layer** that makes it easier for caregivers — especially people uncomfortable asking for help — to turn one practical burden into a safely managed request.

### Core experience

1. **Caregiver interface:** post a bounded task across seven practical categories and optionally choose a task-specific comfort preference.
2. **Silent Task:** the volunteer sees a request alias, approximate zone and minimum instructions, never the caregiver's name, photo, phone number or exact address.
3. **Volunteer interface:** offer help only where training, category and time fit; see private progress and a service-time estimate before coordinator confirmation.
4. **Hospital-admin interface:** administer accounts, triage urgent/sensitive requests, approve matches, protect identity and redirect anything outside scope.
5. **Complete visibly:** create an accountable completion / escalation record and volunteer recognition receipt.

## Product standards implemented

- **Caregiver-first UX:** low cognitive load, concrete request language, a single primary action and progressive disclosure.
- **Trust at the point of decision:** task scope, moderation, status, recognition and safety boundaries are visible.
- **Volunteer operations:** recruit → verify → brief → skill-tag → offer → coordinator approval → completion → reflection → recognition, rather than an unmoderated task board.
- **Ethical incentives:** impact points recognise approved effort, reliability and contribution, never urgency or caregiver distress. Service time is verified after completion and reflection; only a partner school can determine VIA recognition. Public individual rankings are deliberately excluded.
- **Sensitive-task routing:** urgency is an admin-triage signal, not a bigger public bounty. A female-support preference is task-specific and never permits personal care, lifting or clinical work.
- **Clinical boundary:** volunteers provide non-clinical practical help only. Symptoms, medication, personal care, lifting, falls, mental-health crisis and medical interpretation are escalated.
- **Pilot accountability:** named operational / escalation owners, daily moderation, task receipts and outcome measurement.

## Interaction demo

The front-end prototype supports:

- switching among separate caregiver, volunteer and AH-admin interfaces;
- creating a private request, toggling **Silent Task**, and setting time-sensitive or task-specific comfort preferences;
- offering help for an eligible task, with assignment held for coordinator approval;
- approving / redirecting a sensitive request and administering caregiver / volunteer account status;
- seeing private progress, verified service time, reliability, an opt-in team goal and explicit safety boundaries.

All data is in-memory demo data; no personal or health data is collected.

## Local development

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Deck

`scripts_make_deck.py` generates `CareKaki_Bridge_pitch_deck_v2.pptx`. The deck is a 12-slide editable PPTX and uses the same visual system as the web experience.

```bash
python3 -m venv .venv
.venv/bin/python -m pip install python-pptx
.venv/bin/python scripts_make_deck.py
```

## Research discipline

See [RESEARCH.md](./RESEARCH.md) for the LinkedIn, GitHub, Singapore-sector and caregiver-marketplace signals used in the redesign, source links, operational standards and explicit evidence caveats.

Before a real pilot, validate the safe-task taxonomy, escalation SOP, data handling, volunteer screening and caregiver measures with AH / clinical stakeholders and caregivers themselves.
