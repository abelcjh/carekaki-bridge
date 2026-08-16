# CareKaki Bridge — product standards & comparable research

*Updated: 16 August 2026. This is a design and operating-model benchmark, not a claim of clinical validation. Caregiver and AH stakeholder testing remains required before any pilot.*

## Design principle adopted

CareKaki should feel like a **high-trust caregiver activation layer**, rather than a generic gig marketplace or a care directory. The winning interaction is: **one small bounded ask → a suitable, trained person → an accountable completion record**.

The current prototype applies six leading-product standards:

1. **Reduce cognitive load before adding choice.** Start with a pre-filled practical request and progressively disclose task details. This follows caregiver-marketplace work that prioritises clarity, pacing and predictable next actions under stress.
2. **Make trust legible at the point of action.** Volunteer skill / role fit, task scope, moderation, completion receipts and clinical escalation are visible rather than buried in a policy page.
3. **Use a real volunteer operations layer.** Recruit, screen, brief, skill-tag, match, recognise and measure. A volunteer board without this operating model would be unsafe and unreliable.
4. **Separate help from treatment.** CareKaki supports navigation, logistics, technology and companionship. It does not provide medical advice, personal care or emergency response.
5. **Separate the interfaces and authority.** Caregivers control requests, volunteers control which eligible tasks they offer to help with, and an AH admin controls accounts, sensitive matches, disclosure and escalation.
6. **Reward contribution without gaming care.** Points may acknowledge approved effort, reliability and contribution; verified service time and reflection may be submitted for partner-school VIA approval. Urgent tasks are admin-triaged rather than made into higher public bounties.

## August 2026 research update — what changed after the deeper benchmark

The newest pass reviewed public Singapore LinkedIn material, Reddit language, official Singapore evidence and related winning/finalist projects. X could not be retrieved defensibly, so **no X-derived claim is made**.

### Strongest local signals

- [MOM’s 2026 parliamentary answer](https://www.mom.gov.sg/newsroom/parliament-questions-and-replies/2026/0224-written-answer-to-pq-on-mandating-eldercare-leave) reports that men were 40.1% of residents outside the labour force due to caring for parents in 2025, up from 27.8% in 2021. This establishes a material male-caregiving context, not a preference for this product.
- The [NCSS–SMU volunteer-experience study](https://ink.library.smu.edu.sg/lien_reports/19) surveyed 180 volunteers across 112 social-service agencies and identified enjoyment, exposure, impact, connectedness and flexibility as qualities of a good volunteer experience. CareKaki therefore profiles skill, availability and role preference rather than relying on points alone.
- [MOE’s VIA definition](https://www.moe.gov.sg/education-in-sg/our-programmes/values-in-action) centres meaningful contribution, student ownership and reflection. The prototype now labels time as verified service pending partner approval; it does not claim authority to award VIA.
- [Let’s Kaypoh](https://www.build.gov.sg/bfg2024/lets-kaypoh/) is the strongest Singapore pilot comparator: its SASCO West Coast AAC pilot facilitated 10 senior visits by 20 volunteers. Its reported barriers — commitment, language and time — support nearby, bounded and flexible task design.

### What related winners visibly prove

Related caregiver, discharge and social-impact winners repeatedly demonstrate one complete transaction instead of a broad feature list: a specific ask becomes an accepted action, a staff dashboard records it, and a completion or escalation follows. CareKaki’s judge path therefore remains **ask → scope check → offer → admin confirmation → completion receipt**, plus a visible unsafe-request redirect.

The defensible differentiation is a **hospital-governed, socially pseudonymous ask-to-closure system** for practical caregiver burdens. It is not another resource directory, family calendar, generic volunteer board or points app.

### Incentive correction adopted

- No urgency bonus and no higher reward for caregiver distress, diagnosis or risk.
- No public individual leaderboard. The volunteer surface uses private progression and an opt-in aggregate team goal.
- Points may recognise approved effort, inconvenience, training, reliability, continuity or leadership only after safety eligibility.
- Service time is verified after completion and reflection; VIA recognition remains subject to partner-school approval.
- A volunteer’s offer is never an automatic assignment. The hospital administrator retains human override and the reason for sensitive-task routing.

### Social evidence caveat

Reddit supports only directional hypotheses: practical delegation may feel lower-pressure than publicly narrating distress; broad caregiving burdens benefit from decomposition into bounded tasks; and points/leaderboards can create exploitation or gaming concerns. The available posts are not representative of Singapore male caregivers. X was inaccessible during this pass, so its sentiment is not inferred.

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
- Added a **Silent Task** control as the core inclusion mechanism rather than a minor feature, with explicit identity fields hidden from volunteers.
- Split the demo into caregiver, volunteer and AH-admin interfaces so account administration, matching authority and privacy custody are visible.
- Added varied categories, skill readiness, private progress, verified service-time estimates, reliability and an opt-in team goal.
- Added urgent and task-specific female-support routing as an admin-reviewed safeguarding flow, never as permission for personal or clinical care.
- Framed safety as a visible promise: allowed / prohibited / escalation.
- Kept the live judge path: create a private task, offer help for an eligible task, approve or redirect it in the AH-admin queue, administer accounts and complete a matched task.

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

## Extended implementation standard — research synthesis

### 1. A task is a contract, not a public plea

Caregiver-support products such as [Give InKind](https://www.giveinkind.com/features) and [Lotsa Helping Hands](https://lotsahelpinghands.com/how-it-works) turn help into specific time-bound activities with instructions, claim status and reminders. This validates the CareKaki task-first model.

**Proposed state machine:**

`Draft → Submitted → Safety / scope check → Matching → Offered → Accepted → In progress → Completed → Recipient confirmation / coordinator review → Closed`

Branch states: `Needs AH referral`, `Withdrawn`, `No suitable volunteer`, `Cancelled`, `Incident / safeguarding review`.

Each operational transition should retain actor, timestamp, reason and the minimum information disclosed. A **claim is not automatically an assignment**: direct claim is suitable only for low-risk, generic tasks; an in-person or sensitive task moves from “Request to help” to coordinator confirmation.

### 2. Match transparently, after eligibility gates

[Connect@TOUCH](https://play.google.com/store/apps/details?id=sg.vm.touchvolunteer.tebs.pro&hl=en_US), [VolunteerMatch](https://www.volunteermatch.org/volunteers/services/) and [CiviVolunteer](https://docs.civicrm.org/volunteer/en/latest/) show the durable pattern: browse/filter by locality, schedule, role and capability, with a coordinator able to intervene.

CareKaki should hard-filter before ranking:

- active / screened volunteer status;
- safe-task category and completed micro-training;
- availability and travel-radius band;
- language and accessibility preference;
- safeguarding, capacity, block and supervision constraints.

Then present an explainable recommendation — *“available Tuesday, trained for Digital Help, near your area”* — alongside manual choice / coordinator help. Do not pitch opaque AI matching. Exact address, diagnosis and personal circumstance remain hidden until an approved assignment and just-in-time consent.

### 3. Use a visible Trust Passport, not a magical safety badge

[CareProtect](https://www.care.com/about/safety/) and volunteer-onboarding platforms treat checks as one element of a continuing safety system. The suggested Trust Passport is: **Identity checked · Orientation complete · Safeguarding / Silent Task training complete · eligible task tiers · expiry / renewal status**. It must say “screened, trained and coordinator-supported”, not “guaranteed safe”.

A practical tiering pattern:

| Tier | Example | Allocation |
|---|---|---|
| 1 | remote/digital navigation, general public-event support | coordinator approval or low-risk self-claim |
| 2 | public pickup/drop-off, wayfinding, appointment reminders | coordinator-confirmed |
| 3 | private / in-home interaction, if policy permits it | named adult supervision and explicit safeguarding controls |
| Out of scope | medication administration, clinical advice, personal care, transfers/lifting, cash/financial handling, emergency response | **do not match; refer / escalate** |

For an initial encounter or a higher-vulnerability request, use coordinator review, optional recipient approval, mentor/paired support where policy requires it, arrival/departure check-ins and a short private comfort/safety follow-up.

### 4. Singapore data, safeguarding and referral boundary

Singapore’s [PDPC social-service guidance](https://www.pdpc.gov.sg/-/media/files/pdpc/pdf-files/advisory-guidelines/advisory-guidelines-for-the-social-service-sector_18-january-2024.pdf) says the social-service agency remains responsible for volunteers acting on its behalf; its [volunteer guide](https://file.go.gov.sg/pdpaguideforvolunteer.pdf) supports data minimisation, explicit consent, training, secure disposal and incident reporting. This is programme guidance, not legal advice.

Design consequence:

- pre-match show zone / transport burden, not a full address;
- collect only task-relevant details; reveal contact/address only to the approved helper via explicit consent;
- no photos or social posts; no personal WhatsApp account as the record for sensitive instructions;
- coordinator owns retention/deletion, incident review and escalation;
- model professional/community pathways as a separate consent-based **referral lane**, rather than pretending that a volunteer completion equals a clinical/service referral.

[Open Referral HSDS](https://github.com/openreferral/specification) is the useful future data model for a provider directory: `organization`, `service`, `location` and `service_at_location`, kept separate from volunteer tasks.

### 5. Accessibility is part of safety

The public [WCAG 2.2](https://www.w3.org/TR/WCAG22/) baseline is relevant to caregivers and older recipients: generous targets (design critical actions at 44×44px or larger), no colour-only status, visible keyboard focus, plain-language errors, no drag-only workflow, zoom/reflow support and review/edit/cancel before submission. Use accessible primitives (e.g. [React Aria](https://react-spectrum.adobe.com/react-aria/) or [Radix](https://www.radix-ui.com/primitives)) when the prototype becomes a production application.

### Social evidence limitation, updated

A [Reddit corpus analysis](https://www.mdpi.com/1660-4601/20/3/1933) supports the *hypothesis* that caregiver discourse includes both emotional toll and logistical burdens; it is US-centric and not a prevalence estimate for Singapore. No defensible X-specific finding was recoverable in this research pass, so CareKaki makes **no X-derived claim**. Use social discourse for wording tests only, and validate through AH caregivers and programme staff.

### 6. Singapore support-care volunteering is gated, not an open claim board (10 August 2026)

Singapore’s public [SG Healthcare Corps listing](https://www.volunteer.gov.sg/scheme-detail/?code=SHC-MOH) says Care Volunteers apply only after an information session and training. A current [SGH Nursing Care Buddies listing](https://www.volunteer.gov.sg/volunteer/opportunity/details/?id=9737d219-924a-f111-ac85-027d80ecb760) adds interview, orientation, certified training and defined service-session commitments before hospital-ward support. The tasks in that SGH programme include patient-care activities that remain outside CareKaki’s boundary; it is **not** evidence that CareKaki volunteers should undertake them.

**Product consequence adopted:** the post-request confirmation now makes the three gates visible: coordinator scope check, offer only to a volunteer cleared for that task type, and minimum practical details only after an approved match. This is a prototype transparency improvement, not a claim that CareKaki has an accredited programme, screening process or operational approval. The Ministry of Health’s [caregiving overview](https://www.moh.gov.sg/ageing-well/caregiving/) also describes caregiver support as spanning resources, respite, financial, workplace, training and community-network support; it does not validate this product or replace formal referral pathways.

### 7. Readiness belongs on the opportunity, before assignment (13 August 2026)

AIC’s current [caregiving-support volunteer directory](https://aic.sg/Age-Well/Council-for-Third-Age-C3A/Volunteering-Opportunities/Caregiving-Support-Volunteers) describes trained but role-specific pathways: Caregiving Navigators learn listening, connection and resource navigation, while Community Care Ambassadors receive active-listening, communication, cultural-sensitivity and home-entry guidance. Its [Silver Generation volunteer page](https://www.aic.sg/Age-Well/Silver-Generation-Office/Be-a-volunteer) likewise distinguishes role commitments and preparation, including engagement practice for Silver Generation Ambassadors and foundational training before Silver Guardian deployment. The official examples support task-specific readiness and deployment gates; they do **not** establish which curriculum, checks or task tiers AH should approve for CareKaki.

The [National Giving Study 2025](https://nvpc.org.sg/research/national-giving-study-2025/) adds a nationally representative Singapore signal that time pressures, perceived skill requirements and supportive environments are associated with participation, and recommends flexibility, accessibility and clear communication. It is a cross-sectional giving study, not evidence that a particular CareKaki interaction will increase volunteer uptake or task completion. A February 2026 [Care Community Services Society LinkedIn post](https://www.linkedin.com/posts/ccsscares_sgcares-ccsscares-nvpc-activity-7431548382445338624-jfHa) directionally reinforces readiness beyond matching and trauma-informed communication; as organisational self-reporting, it is not effectiveness or prevalence evidence. No material X or Reddit finding was defensible in this pass.

**Product consequence adopted:** each task now names its minimum role briefing, and the volunteer action is **Offer help**, which enters **Awaiting review** before a separate coordinator-confirmed match. This closes the misleading instant-claim interaction while preserving the existing non-clinical boundary. The labels are illustrative prototype requirements pending AH safeguarding, operations and training approval; they do not represent completed screening or accreditation.

### 8. Readiness must be enforced, not merely displayed (13 August 2026)

The official [HealthStart youth-volunteer listing](https://www.volunteer.gov.sg/volunteer/opportunity/details/?id=56f3992d-16e6-ef11-ac75-0aec74081c56) requires online and in-person training, uses healthcare-professional supervision and separates non-healthcare volunteers from youth-leader responsibilities. The current [AIC caregiving-support volunteer directory](https://aic.sg/Age-Well/Council-for-Third-Age-C3A/Volunteering-Opportunities/Caregiving-Support-Volunteers) likewise describes role-specific training and commitments rather than a universal volunteer entitlement. A Singapore [Workato–IMDA winning volunteer-onboarding system](https://www.workato.com/the-connector/workato-developer-challenge-first-place/) matched skills and values to distinct AWARE roles while retaining human review before final approval. The winner write-up is sponsor self-reporting and informs the proof surface, not an effectiveness claim for CareKaki.

**Product consequence adopted:** readiness is now executable demo logic. The active volunteer has an explicit set of training tags. An open task exposes **Offer to help** only when its required tag is present. A missing tag produces a disabled, reason-labelled state. Urgent or sensitive accompaniment begins behind a separate AH safety lock; an administrator must confirm the bounded non-clinical scope before it reaches the readiness-qualified offer pool. A task-specific female-support preference does not bypass that gate or count as a skill. These tags and decisions remain illustrative pending AH policy, safeguarding and training approval.

### 9. Pseudonymity must cover free text, not only profile fields (13 August 2026)

The [PDPC Advisory Guidelines for the Social Service Sector](https://www.pdpc.gov.sg/-/media/files/pdpc/pdf-files/advisory-guidelines/advisory-guidelines-for-the-social-service-sector_18-january-2024.pdf) say the agency remains responsible for volunteers acting on its behalf, should disclose personal data on a need-to-know basis, and should give each volunteer only an appropriate amount of client data. PDPC’s [Guide to Basic Anonymisation](https://www.pdpc.gov.sg/-/media/files/pdpc/pdf-files/advisory-guidelines/guide-to-basic-anonymisation-(updated-24-july-2024).pdf) also recommends removing direct identifiers and generalising precise location where the detailed attribute is not required. These sources do not certify CareKaki’s implementation or determine AH’s eventual legal basis, retention rules or data-protection design.

**Product consequence adopted:** Silent Task now runs a deterministic privacy preflight over caregiver-entered task text and blocks submission when it finds obvious phone, email, NRIC/FIN, six-digit postal-code/exact-block or explicitly stated personal-name patterns. It explains what to remove and keeps the caregiver in control of the edit. This is a conservative first layer, not anonymisation assurance: indirect identifiers, unusual wording and contextual re-identification still require AH review, policy, consent design and a formal motivated-intruder/re-identification assessment before any pilot.

### 10. An exclusion list must be an executable route, not footer copy (14 August 2026)

Alexandra Hospital's official [C3U page](https://www.ah.com.sg/our-services/community-care-coordination-unit-c3u-at-ah) describes a coordination unit for existing AH patients and caregivers that assesses care needs, supports caregivers and helps people navigate hospital and community care. AH's official [Alex Advocate page](https://www.ah.com.sg/giving/be-our-volunteer) demonstrates that hospital volunteers operate in defined roles alongside care managers and healthcare teams; it does not authorise CareKaki students to perform any listed patient-care task. The [SCDF Emergency Medical Services page](https://www.scdf.gov.sg/home/about-scdf/emergency-medical-services) says to call 995 only for life-threatening emergencies.

**Product consequence adopted:** the existing prohibited-task footer is now enforced in the demo. Deterministic text checks flag possible emergencies, medication/clinical work, personal care, person-lifting/transfers and money handling. A flagged request creates an AH-admin-only formal-service redirect receipt and is structurally absent from the volunteer task list. The administrator can close it only as a formal redirect, not clear it into the offer pool. Possible life-threatening emergencies display a direct 995 instruction and explicitly tell the caregiver not to wait for an admin response. These keyword checks are a conservative prototype safety layer, not clinical triage, diagnosis or an approved AH referral protocol; production rules and wording require AH review and usability testing.

### 11. Recognition must follow verified work and reflection (14 August 2026)

MOE's official [LEAPS 2.0 framework](https://www.moe.gov.sg/-/media/files/programmes/leaps-2-framework.ashx) recognises the planning, service and reflection involved in VIA projects rather than treating an estimated task duration as automatic credit. NVPC's [student-volunteering guide](https://nvpc.org.sg/articles/student-volunteering/) similarly frames meaningful student service around genuine community needs, strengths and reflection. The official [Volunteer.gov.sg volunteer guide](https://www.volunteer.gov.sg/documentconfig/oppdocdownload/6f745b6f-00c4-ee11-ac60-0aec74081c56/352/Volunteer.gov.sg%20Guide%20for%20CIN%20Volunteers.pdf) describes a platform that tracks completed opportunities and volunteering hours across agencies. These sources support a completion-and-review workflow; they do not authorise CareKaki or AH to award school VIA.

Two source-verifiable public-product comparators reinforce the judge-visible pattern. Singapore's [ServeSG](https://www.hack.gov.sg/2024/servesg/) public-service prototype made end-to-end volunteer tracking and verified volunteer data part of its organiser workflow. The official 2025 [Congressional App Challenge Seva winner page](https://www.congressionalappchallenge.us/25-tx02/) identifies unverified hours and lost records as the problem addressed by its volunteer-management and verification product. These are proof-surface comparators, not evidence of CareKaki's effectiveness.

**Product consequence adopted:** a matched volunteer must now enter a short private completion reflection. The resulting minimum-detail receipt exposes no caregiver identity and keeps both service time and impact points pending. AH admin sees a separate completion queue, reviews the record and deliberately verifies it before the volunteer's private totals update. Even then the receipt says that a partner school — not CareKaki — makes any VIA-recognition decision. This is in-memory demo logic pending AH and school policy, dispute handling, retention rules, authorised verifier roles and pilot validation.

### 12. Public information, authentication and operations need separate contexts (14 August 2026)

Volunteer-management products commonly separate public opportunity discovery and programme explanation from authenticated volunteer/coordinator operations. That separation reduces first-visit complexity, prevents task/account controls from looking publicly available, and lets every signed-in workspace lead with the current user's status, next action and exceptions. For CareKaki, it also makes minimum-necessary disclosure legible: public visitors see the service model, an authenticated caregiver sees private requests, an eligible volunteer sees bounded task aliases, and an AH administrator sees safeguarding and account controls.

[NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html) distinguishes authentication (establishing control of an account-bound authenticator), session management and attributes asserted to a relying party. The prototype is not a production authenticator or AH identity provider, so it labels its demo status explicitly. It demonstrates the intended authorization boundary by mapping each demo identity to one role, keeping signed-in identity and assurance visible, removing the old unrestricted role switch and requiring sign-out before changing accounts. A real pilot would still need an AH-approved identity provider, MFA/assurance decision, account recovery, session timeout, audit logs and privacy/security assessment.

[WCAG 2.2 SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) requires at least 4.5:1 contrast for normal text and 3:1 for large text. [WCAG focus guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) supports a clearly visible, sufficiently large focus indicator. The redesign therefore replaces mixed hard-coded light colours with semantic tokens for page, surface, text, muted text, borders, fields, statuses, focus and primary actions in both modes. The lowest normal-text token pair was measured above 4.5:1 after adjustment; all core light and dark status/button pairs are above 6:1. Visual smoke tests cover the public page, sign-in, caregiver, volunteer and AH-admin surfaces at 390px and 1440px.

**Product consequence adopted:** the homepage is now descriptive only; all forms, task cards, receipts and administration are in a separate authenticated portal shell. Authentication fields use explicit labels, `autocomplete` hints, password visibility control, non-destructive error messaging and a clear sign-out. Role authorization is no longer represented by cosmetic homepage tabs. Light/dark preference persists locally, all foreground/background pairs use semantic tokens, and the same theme applies to native form controls via `color-scheme`.

### 13. Time, geography and unfilled capacity need operational states (14 August 2026)

The task-first comparators above treat schedule, locality, capacity and coordinator intervention as operational data rather than decorative labels. The privacy standard also requires different location precision by role: a volunteer can decide whether travel is feasible from a zone or public service point, while an accountable coordinator can access the protected operational point only when programme work requires it. A real pilot still needs AH-approved geocoding, consent, audit, retention and just-in-time disclosure rules.

**Product consequence adopted:** every demo task now stores an absolute creation and scheduled timestamp, formats both in Singapore time and exposes a visibly ticking SGT operations clock. Role-aware Google Maps views display public hospital or meeting points, a protected exact demo point to the caregiver and AH admin, and only a 2 km Queenstown zone to volunteers for home tasks. A deterministic seven-day capacity rule automatically creates an AH notification whenever the confirmed headcount remains below the required count. The alert can move through coordinator sourcing, incremental sourced-volunteer confirmation and resolution, or, only after sourcing has begun, closure with a retained caregiver-facing notice. Google Workspace OAuth is not represented as a Maps Platform credential; this static prototype uses Google Maps embeds and deep links without embedding a secret browser key.

### 14. Conversation language is a task-fit gate, not a profile inference (16 August 2026)

AIC’s current [Silver Generation volunteer page](https://www.aic.sg/Age-Well/Silver-Generation-Office/Be-a-volunteer) makes conversational language an explicit role requirement alongside training and engagement practice. YWCA of Singapore’s official [CaregivHER programme announcement](https://ywca.org.sg/blog/caregivher-programme-launch/) separately confirms a local model of trained, matched volunteers providing regular non-clinical caregiver check-ins. A June 2026 [YWCA LinkedIn recruitment post](https://www.linkedin.com/posts/ywca-singapore_ywcasg-ywcasingapore-womenempowerment-activity-7472860615452213249-SDuI) says those volunteers are paired by language and compatibility and should refer complex concerns to programme staff. The LinkedIn detail is organisational self-reporting and is used only as a directional operating-model signal; neither source validates CareKaki’s language options, matching rule or outcomes.

**Product consequence adopted:** a caregiver can now select a conversation language only when the bounded task needs one, with “No preference” as the default. The requirement appears on the privacy-safe task preview and volunteer/admin task views. Volunteer offers are deterministically disabled when either the required readiness tag or stated conversation language is missing, and the UI names every unmet condition. The prototype does not infer language from a caregiver’s name, ethnicity or free text, does not treat language as a safety credential, and does not claim that the illustrative English/Mandarin volunteer profile represents AH’s workforce. Supported languages, proficiency levels, interpreter pathways and when language should be a hard gate all require AH and caregiver validation.
