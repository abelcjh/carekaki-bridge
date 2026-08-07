# CareKaki Bridge

> **Help, on your own terms.** A high-trust, AH-linked caregiver-respite pilot for small, bounded non-clinical tasks.

[Live prototype](https://abelcjh.github.io/carekaki-bridge/) · [Editable V2 deck](https://docs.google.com/presentation/d/1Be8o3WgWZ4HiMO0bN_4A_JVgpNycGeqs/edit) · [Research and standards](./RESEARCH.md)

![CareKaki Bridge hero](./src/assets/carekaki-hero.png)

## What this prototype demonstrates

CareKaki Bridge is not a generic gig app or substitute for clinical care. It is an **activation layer** that makes it easier for caregivers — especially people uncomfortable asking for help — to turn one practical burden into a safely managed request.

### Core experience

1. **Post a bounded task** — errands, tech setup, wayfinding, meals/home help.
2. **Choose Silent Task** — no call or conversation expected; only operational details are shared.
3. **Match safely** — youth volunteers are screened, briefed and matched by task scope, skill and time.
4. **Complete visibly** — an accountable completion / escalation record and volunteer recognition are created.

## Product standards implemented

- **Caregiver-first UX:** low cognitive load, concrete request language, a single primary action and progressive disclosure.
- **Trust at the point of decision:** task scope, moderation, status, recognition and safety boundaries are visible.
- **Volunteer operations:** recruit → brief → skill-tag → match → recognise, rather than an unmoderated task board.
- **Clinical boundary:** volunteers provide non-clinical practical help only. Symptoms, medication, personal care, lifting, falls, mental-health crisis and medical interpretation are escalated.
- **Pilot accountability:** named operational / escalation owners, daily moderation, task receipts and outcome measurement.

## Interaction demo

The front-end prototype supports:

- creating a new request and toggling **Silent Task**;
- filtering the task board by status;
- claiming an open task and completing a matched task;
- seeing pilot-facing safety and impact logic.

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
