# CareKaki Bridge — product standards & comparable research

*Updated: 7 August 2026. This is a design and operating-model benchmark, not a claim of clinical validation. Caregiver and AH stakeholder testing remains required before any pilot.*

## Design principle adopted

CareKaki should feel like a **high-trust caregiver activation layer**, rather than a generic gig marketplace or a care directory. The winning interaction is: **one small bounded ask → a suitable, trained person → an accountable completion record**.

The current prototype applies four leading-product standards:

1. **Reduce cognitive load before adding choice.** Start with a pre-filled practical request and progressively disclose task details. This follows caregiver-marketplace work that prioritises clarity, pacing and predictable next actions under stress.
2. **Make trust legible at the point of action.** Volunteer skill / role fit, task scope, moderation, completion receipts and clinical escalation are visible rather than buried in a policy page.
3. **Use a real volunteer operations layer.** Recruit, screen, brief, skill-tag, match, recognise and measure. A volunteer board without this operating model would be unsafe and unreliable.
4. **Separate help from treatment.** CareKaki supports navigation, logistics, technology and companionship. It does not provide medical advice, personal care or emergency response.

## Source signals

| Surface | Comparable / source | Signal adopted | Source / caveat |
|---|---|---|---|
| Care marketplace UX | AARP Caregiver Marketplace case study | High-trust caregiver experiences should reduce cognitive load, use clear hierarchy, progressive disclosure and a path from learn → ask → act. | [Case study](https://aminswessi.com/aarp.html). A design case study, not independent effectiveness evidence. |
| Care marketplace UX | Like Family redesign case study | Pre-filled activity templates, trust signals, message prompts and reputation cues reduced posting friction; the case study reports higher posting, messaging and bookings after redesign. | [Case study](https://www.jesstong.com/like-family-matchmaking). Reported by the designer; do not treat outcomes as independently audited. |
| Volunteer management | Kambeo / LinkedIn product listing | Opportunity posting, application approval, scheduling, communication and verified volunteer hours are baseline coordinator capabilities. | [LinkedIn product page](https://www.linkedin.com/products/gigitmarketplace-volunteer-management/). Vendor / product description. |
| Volunteer operations | NCSS Volunteer Management | Volunteer management is a strategic function; Singapore’s sector uses Volunteer Centres to match community contributors to needs. | [NCSS](https://www.ncss.gov.sg/programmes/people/volunteer-management/). Local operating context. |
| Caregiver support | CaringSG CAREadvisory + CAREbuddy | Review / triage before matching, clear service boundaries, a baseline and closure measure, trained helpers and stated non-emergency limits build trust. | [CAREadvisory](https://caring.sg/careadvisory/), [CAREbuddy](https://caring.sg/carebuddy/), [training](https://caring.sg/caregiver-volunteer-training/). Adjacent target group, not AH validation. |
| GitHub implementation patterns | OpenVolunteerPlatform | Secure roles, forms, real-time updates, task management, scheduling, reporting and coordinator views are reusable architectural patterns for a future operational build. | [GitHub](https://github.com/aerogear/OpenVolunteerPlatform). Engineering reference, not a healthcare safety standard. |
| GitHub implementation patterns | codeforgood volunteer matching platform | Skill, location and availability matching; verified profiles; reviews; calendar integration and analytics are practical backlog patterns. | [GitHub](https://github.com/codeforgood-org/volunteer-matching-platform). Community repo; audit before reuse. |

## Social research method: LinkedIn, X and Reddit

- **LinkedIn:** used for public product and volunteer-operations material; it is useful for category and operating-model signals but is mostly company / professional self-reporting.
- **X:** public, searchable signals are treated as directional only. No individual post or trend should be presented as caregiver evidence.
- **Reddit:** used only for qualitative language and friction hypotheses, never prevalence or clinical claims. The product must validate these hypotheses through local caregiver interviews and AH staff review.

## What changed in the prototype

- Replaced a dense dashboard aesthetic with a calm editorial hierarchy: one main action, large type, restrained palette, generous whitespace and recognisable task cards.
- Added a **Silent Task** control as the core inclusion mechanism rather than a minor feature.
- Changed task browsing from a card wall to a scan-friendly, status-filtered task board with scope, time, points and moderation cues.
- Framed safety as a visible promise: allowed / prohibited / escalation.
- Kept the live demo interaction: post a task, toggle Silent Task, filter tasks, claim a task and complete a task.

## Pilot standards to validate with AH

1. Named AH operational owner and clinical escalation owner.
2. Approved safe-task taxonomy and prohibited-task rule set.
3. Volunteer screening, confidentiality acknowledgement and scenario-based briefing.
4. Daily moderation / matching rhythm, and an escalation SLA.
5. Completion receipt fields: task, volunteer, action, outcome, escalation, reviewer.
6. Baseline and follow-up caregiver measure. Track uptake, silent-task share, completion, repeat use, volunteer retention, caregiver confidence / burden, and **zero volunteer clinical-advice incidents**.

## Deliberately not claimed

- No claim that the UI, incentive system or Silent Task flow improves wellbeing without a local pilot.
- No claim that social-media discussions represent Singapore caregivers.
- No claim that volunteers replace clinicians, counsellors, family support, AIC, NUHS or AH pathways.
