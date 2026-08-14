# CareKaki Bridge

> **Help, on your own terms.** A high-trust, AH-linked caregiver-respite pilot for small, bounded non-clinical tasks.

[Live prototype](https://abelcjh.github.io/carekaki-bridge/) · [Editable V2 deck](https://docs.google.com/presentation/d/1Be8o3WgWZ4HiMO0bN_4A_JVgpNycGeqs/edit) · [Research and standards](./RESEARCH.md)

![CareKaki Bridge hero](./src/assets/carekaki-hero.png)

## What this prototype demonstrates

CareKaki Bridge is not a generic gig app or substitute for clinical care. It is an **activation layer** that makes it easier for caregivers — especially people uncomfortable asking for help — to turn one practical burden into a safely managed request.

### Core experience

1. **Public website:** explains the service, roles, lifecycle and safety boundaries without exposing operational forms, task queues or account controls.
2. **Role-bound sign-in:** demo authentication maps each approved identity to exactly one caregiver, volunteer or AH-admin workspace; there is no post-login role switch.
3. **Caregiver interface:** post a bounded task across seven practical categories and optionally choose a task-specific comfort preference.
4. **Silent Task:** a deterministic preflight blocks obvious direct identifiers in free text before posting; the volunteer then sees a request alias, approximate zone and minimum instructions, never the caregiver's structured name, photo, phone number or exact address.
5. **Volunteer interface:** a deterministic readiness gate permits offers only when the active volunteer has the task's required training tag; see private progress and a service-time estimate before coordinator confirmation.
6. **Hospital-admin interface:** administer accounts, triage urgent/sensitive requests, approve matches, protect identity and redirect anything outside scope. A deterministic scope gate keeps medication, personal care, clinical advice, lifting/transfers, money handling and emergencies off the volunteer surface.
7. **Complete visibly:** a matched volunteer submits a private reflection; hours and points remain pending until AH verifies the completion receipt, after which the record can go to the partner school for its own VIA decision.

## Product standards implemented

- **Caregiver-first UX:** low cognitive load, concrete request language, a single primary action and progressive disclosure.
- **Privacy before matching:** Silent Task checks for obvious phone, email, NRIC/FIN, postal-code/exact-block and stated-name patterns before submission, while keeping AH human review as the authority for indirect or contextual disclosure risk.
- **Trust at the point of decision:** task scope, moderation, status, recognition and safety boundaries are visible.
- **Volunteer operations:** recruit → verify → brief → skill-tag → offer → coordinator approval → completion → reflection → recognition, rather than an unmoderated task board.
- **Ethical incentives:** impact points recognise approved effort, reliability and contribution, never urgency or caregiver distress. Service time is verified after completion and reflection; only a partner school can determine VIA recognition. Public individual rankings are deliberately excluded.
- **Sensitive-task routing:** urgency is an admin-triage signal, not a bigger public bounty. A female-support preference is task-specific and never permits personal care, lifting or clinical work.
- **Enforced readiness:** sensitive or urgent tasks start locked, AH must clear their bounded scope, and even then only a volunteer with the exact required readiness tag can offer. Missing training produces an explicit disabled state rather than a cosmetic badge.
- **Clinical boundary:** volunteers provide non-clinical practical help only. Symptoms, medication, personal care, lifting, falls, mental-health crisis and medical interpretation are escalated.
- **Executable service redirect:** excluded request text creates an AH-admin-only redirect receipt; it cannot enter the volunteer offer pool. Life-threatening wording also displays the official SCDF 995 direction without asking the caregiver to wait for admin review.
- **Verified completion:** task completion creates a minimum-detail receipt rather than instant credit. AH review is the deterministic release gate for service time and private impact points; the product does not award VIA.
- **Pilot accountability:** named operational / escalation owners, daily moderation, task receipts and outcome measurement.
- **Information architecture:** descriptive content lives on the public website; authenticated operations live in a separate portal shell with persistent account identity, role assurance and sign-out.
- **Authentication honesty:** the static prototype demonstrates sign-in and authorization UX but explicitly says it is not connected to AH production identity systems.
- **Accessible themes:** light and dark modes use semantic colour tokens for every surface, field, status and control. Normal-text token pairs are checked against the WCAG 2.2 AA 4.5:1 contrast threshold, and keyboard focus uses a visible 3px outline.

## Interaction demo

The front-end prototype supports:

- entering through a descriptive public website, then signing in with one of three role-bound demo accounts;
- returning to the public website without exposing operational controls, or signing out to change demo identity;
- creating a private request, toggling **Silent Task**, and setting time-sensitive or task-specific comfort preferences;
- seeing an ineligible task remain disabled, releasing a sensitive task through AH review, and offering only after both safety and readiness gates pass;
- approving / redirecting a sensitive request and administering caregiver / volunteer account status;
- submitting a completion reflection, seeing its time and points remain pending, and having AH verify the receipt before the private progress record updates;
- seeing private progress, verified service time, reliability, an opt-in team goal and explicit safety boundaries.

All data is in-memory demo data; no personal or health data is collected.

## Local development

```bash
npm install
npm run dev
npm test
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
