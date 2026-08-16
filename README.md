# CareKaki Bridge

> **Help, on your own terms.** A high-trust, AH-linked caregiver-respite pilot for small, bounded non-clinical tasks.

[Live prototype](https://abelcjh.github.io/carekaki-bridge/) · [Editable V2 deck](https://docs.google.com/presentation/d/1Be8o3WgWZ4HiMO0bN_4A_JVgpNycGeqs/edit) · [Research and standards](./RESEARCH.md)

![CareKaki Bridge hero](./src/assets/carekaki-hero.png)

## What this prototype demonstrates

CareKaki Bridge is not a generic gig app or substitute for clinical care. It is an **activation layer** that makes it easier for caregivers — especially people uncomfortable asking for help — to turn one practical burden into a safely managed request.

### Core experience

1. **Public website:** explains the service, roles, lifecycle and safety boundaries without exposing operational forms, task queues or account controls.
2. **Role-bound sign-in:** demo authentication maps each approved identity to exactly one caregiver, volunteer or AH-admin workspace; there is no post-login role switch.
3. **Caregiver interface:** a map-first homepage shows only the caregiver's own tasks and exact service locations, with category, status, opened-date, typed-location and kilometre-radius filters. Task creation remains available as a separate view from the map header.
4. **Live location control:** an opt-in settings toggle uses the browser's live geolocation only while the page is open, enabling distance filtering from the caregiver's current position without storing it in the prototype.
5. **Silent Task:** a deterministic preflight blocks obvious direct identifiers in free text before posting; the volunteer then sees a request alias, privacy-safe map zone and minimum instructions, never the caregiver's structured name, photo, phone number or exact home point.
6. **Volunteer interface:** a deterministic readiness gate permits offers only when the active volunteer has the task's required training tag; see a ticking Singapore operations clock, scheduled task time, waiting age, Google map and confirmed-capacity count before coordinator confirmation.
7. **Hospital-admin interface:** administer accounts, triage urgent/sensitive requests, approve matches, access protected operational map points and redirect anything outside scope. A deterministic scope gate keeps medication, personal care, clinical advice, lifting/transfers, money handling and emergencies off the volunteer surface.
8. **Seven-day capacity lifecycle:** any unfinished task with fewer confirmed people than required is automatically referred to the AH capacity queue after seven days. AH can begin coordinator sourcing, record each sourced volunteer, resolve the alert when capacity is met, or close an unmet request after sourcing and issue a caregiver-facing notice.
9. **Complete visibly:** a matched volunteer submits a private reflection; hours and points remain pending until AH verifies the completion receipt, after which the record can go to the partner school for its own VIA decision.

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
- **Time and geography:** every task stores an absolute scheduled instant and creation time, renders them in `Asia/Singapore`, and exposes a live second-by-second SGT clock. Google Maps embeds use verified service-point or zone coordinates; Silent home tasks disclose only a 2 km zone to volunteers while the caregiver and accountable AH admin can access the protected demo point.
- **Capacity escalation:** insufficient confirmed capacity at seven elapsed days creates a deterministic AH notification. Closure is disabled until coordinator sourcing has begun, and closing creates a retained caregiver notice rather than silently removing the task.
- **Maps credential boundary:** the prototype uses Google Maps embeds and deep links without a browser API key. Google Workspace OAuth is not treated as a Google Maps Platform credential; a production Maps JavaScript API integration would require its own domain-restricted key and billing controls.
- **Pilot accountability:** named operational / escalation owners, daily moderation, task receipts and outcome measurement.
- **Information architecture:** descriptive content lives on the public website; authenticated operations live in a separate portal shell with persistent account identity, role assurance and sign-out.
- **Authentication honesty:** the static prototype demonstrates sign-in and authorization UX but explicitly says it is not connected to AH production identity systems.
- **Accessible themes:** light and dark modes use semantic colour tokens for every surface, field, status and control. Normal-text token pairs are checked against the WCAG 2.2 AA 4.5:1 contrast threshold, and keyboard focus uses a visible 3px outline.

## Interaction demo

The front-end prototype supports:

- entering through a descriptive public website, then signing in with one of three role-bound demo accounts;
- returning to the public website without exposing operational controls, or signing out to change demo identity;
- creating a private request, toggling **Silent Task**, choosing a Singapore task time and selecting a hospital, protected home, public meeting point or remote location;
- watching the SGT clock tick, selecting every task on a role-aware Google map and comparing scheduled time, waiting age and confirmed headcount;
- seeing an insufficient eight-day task appear automatically in AH capacity notifications, starting coordinator sourcing, recording sourced volunteers, resolving the alert, or closing it and viewing the caregiver notice;
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
