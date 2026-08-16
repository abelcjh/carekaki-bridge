# ReliefKaki — product standards and comparable research

*Updated: 16 August 2026. This is a design and operating-model benchmark, not a claim of clinical validation or programme accreditation.*

## Current product principle

ReliefKaki is a **caregiver-to-volunteer activation layer** for small, bounded, non-clinical tasks. The core journey is:

`one clear caregiver request → automatic scope boundary → eligible volunteer accepts directly → completion reflection and private record`

Caregiver tasks publish immediately when they pass deterministic scope rules. Hospitals may be task locations, but they are not a task-processing stage.

## Standards applied

1. **Reduce cognitive load.** Start with one practical request and progressively disclose details.
2. **Make task fit legible.** Category, instructions, timing, language, location and readiness requirements appear at the decision point.
3. **Enforce the non-clinical boundary.** Medication, personal care, clinical advice, lifting/transfers, money handling and emergencies cannot become volunteer tasks.
4. **Use direct, deterministic matching.** An open task can be accepted when volunteer readiness and conversation language fit. Multi-volunteer tasks remain open until capacity is covered.
5. **Disclose necessary coordination data clearly.** Caregivers preview the exact details shared with volunteers before publication.
6. **Record completion privately.** Reflection, estimated service time and impact points stay in the volunteer workspace. Partner schools make any VIA determination independently.
7. **Avoid incentive harm.** Urgency, caregiver distress and risk never increase points. There is no public individual leaderboard.
8. **Keep prototype claims honest.** In-memory authentication, keyword rules and sample data demonstrate interactions; they are not production security, clinical triage or accredited screening.

## Source signals

| Surface | Comparable / source | Signal used | Caveat |
|---|---|---|---|
| Care marketplace UX | [AARP Caregiver Marketplace case study](https://aminswessi.com/aarp.html) | Clear hierarchy, progressive disclosure and a learn-to-action path can reduce posting friction. | Designer case study, not independently audited effectiveness evidence. |
| Care marketplace UX | [Like Family redesign case study](https://www.jesstong.com/like-family-matchmaking) | Task templates, trust cues and clear message prompts can support action under stress. | Reported by the designer. |
| Volunteer experience | [NCSS–SMU volunteer-experience study](https://ink.library.smu.edu.sg/lien_reports/19) | Enjoyment, exposure, impact, connectedness and flexibility matter to volunteer experience. | Surveyed 180 volunteers across 112 social-service agencies; not a ReliefKaki evaluation. |
| Singapore giving | [NVPC National Giving Study 2025](https://nvpc.org.sg/research/national-giving-study-2025/) | Time pressure, perceived skill requirements and supportive environments support flexible, clearly explained opportunities. | Cross-sectional giving study. |
| Local pilot comparator | [Let’s Kaypoh](https://www.build.gov.sg/bfg2024/lets-kaypoh/) | Nearby, bounded opportunities can address commitment, language and time barriers. | Small reported pilot, not equivalent to ReliefKaki. |
| Volunteer readiness | [AIC caregiving-support volunteering](https://aic.sg/Age-Well/Council-for-Third-Age-C3A/Volunteering-Opportunities/Caregiving-Support-Volunteers) | Volunteer roles need clear preparation, communication expectations and boundaries. | Does not define ReliefKaki’s curriculum or task taxonomy. |
| Service reflection | [MOE VIA overview](https://www.moe.gov.sg/education-in-sg/our-programmes/values-in-action) | Meaningful service includes student ownership and reflection. | ReliefKaki does not award VIA. |
| Data handling | [PDPC social-service guidance](https://www.pdpc.gov.sg/-/media/files/pdpc/pdf-files/advisory-guidelines/advisory-guidelines-for-the-social-service-sector_18-january-2024.pdf) | Collect and disclose only task-relevant data, with clear purpose and safeguards. | General Singapore guidance, not legal advice for this prototype. |
| Emergency boundary | [SCDF Emergency Medical Services](https://www.scdf.gov.sg/home/about-scdf/emergency-medical-services) | Life-threatening wording should direct people to 995 immediately. | Keyword detection is not emergency assessment. |
| Accessibility | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Visible focus, sufficient contrast, plain errors, zoom/reflow and non-colour status cues are baseline requirements. | Conformance requires broader formal testing. |
| Volunteer software patterns | [OpenVolunteerPlatform](https://github.com/aerogear/OpenVolunteerPlatform) | Secure roles, forms, scheduling, task state and reporting are useful implementation patterns. | Engineering reference, not a healthcare standard. |

## Evidence discipline

- **LinkedIn and vendor pages:** useful for product/category signals, treated as organisational self-reporting.
- **Reddit:** useful only for qualitative wording and friction hypotheses, never prevalence or clinical claims.
- **X:** no defensible source was recovered in the research pass, so no X-derived claim is made.
- **Official sources:** used for Singapore context and boundaries, not as endorsements of ReliefKaki.
- **Case studies and award pages:** demonstrate interaction and proof-surface patterns, not causal effectiveness.

## Current lifecycle

### In-scope request

`Draft → automatic scope check → Open → volunteer confirmation(s) → Matched → Done`

- Publication occurs immediately after client-side validation and the automatic exclusion check.
- Open tasks are visible to eligible volunteers until the scheduled time passes or the required headcount is covered.
- A volunteer cannot confirm twice.
- Missing readiness or a required conversation language creates an explicit disabled state.
- For tasks needing more than one volunteer, each eligible confirmation updates capacity while the task stays open.

### Out-of-scope request

`Draft → automatic exclusion detected → Not published → qualified-service or emergency guidance`

- The request is never added to the volunteer task pool.
- No task record is created for the blocked draft in this in-memory prototype.
- Possible life-threatening wording displays direct SCDF 995 guidance.
- The rules are conservative prototype keywords, not diagnosis, clinical triage or a referral protocol.

### Completion

`Matched → volunteer reflection → Done → private service record`

The record contains the task label, completion timestamp, reflection, estimated service time and impact points. It contains no separate caregiver identity field. Partner schools independently decide whether service qualifies for VIA.

## Privacy and task disclosure

Open volunteer tasks currently show full instructions, caregiver contact details and the exact service location because those details are required for coordination in this prototype. The caregiver sees that disclosure in the live preview before publishing.

A production pilot still needs:

- a clear lawful basis or consent model;
- role and access controls;
- retention and deletion rules;
- secure authentication and session management;
- audit and incident handling;
- geocoding and map-provider controls;
- usability testing of disclosure language;
- a formal data-protection and safeguarding assessment.

## Deliberately not claimed

- No claim that the UI or direct-matching flow improves wellbeing without a real pilot.
- No claim that volunteers replace clinicians, counsellors, family support or formal services.
- No claim that keyword checks can assess clinical urgency or safeguarding risk.
- No claim that illustrative readiness tags represent accredited training.
- No claim that prototype points or time records constitute VIA.
- No claim that social-media discussion represents Singapore caregivers.

## Validation before a real pilot

1. Safe-task taxonomy and exclusion wording.
2. Volunteer identity, onboarding, readiness and renewal requirements.
3. Caregiver disclosure, consent and data-minimisation design.
4. Safeguarding, incident and emergency procedures.
5. Task expiry, cancellation, withdrawal and no-show handling.
6. Completion-record disputes and correction procedures.
7. Caregiver outcomes, volunteer retention and zero clinical-advice incidents.
8. Accessibility testing with caregivers and volunteers across devices.
