# ReliefKaki

> **Help, on your own terms.** A caregiver-to-volunteer prototype for small, bounded, non-clinical tasks.

[Live prototype](https://abelcjh.github.io/reliefkaki/) · [Research and standards](./RESEARCH.md)

![ReliefKaki hero](./src/assets/reliefkaki-hero.png)

## What this prototype demonstrates

ReliefKaki helps caregivers turn one practical burden into a clear volunteer task. It is not a clinical-care service, an emergency channel or a generic gig marketplace.

### Core experience

1. **Public website:** explains the service, lifecycle and safety boundaries without exposing operational task data.
2. **Role-bound sign-in:** each demo identity opens exactly one caregiver or volunteer workspace; there is no post-login role switch.
3. **Caregiver task map:** the caregiver homepage shows only that caregiver’s tasks and exact service locations, with category, status, date, typed-location and kilometre-radius filters.
4. **Separate task creation:** caregivers create a task from its own focused view. In-scope tasks publish immediately to the volunteer task board.
5. **Automatic scope boundary:** deterministic text checks stop medication, personal care, clinical advice, lifting/transfers, money handling and emergency requests before publication, then show qualified-service or SCDF 995 guidance.
6. **Complete task details:** caregiver name, contact number, instructions, conversation language, time and exact service location are shown to eligible volunteers while the task is open and unexpired.
7. **Direct volunteer confirmation:** task-specific readiness and conversation-language rules determine eligibility. A suitable volunteer can accept directly, and multi-volunteer tasks remain open until the required headcount is reached.
8. **Private completion record:** a matched volunteer submits a reflection. Service time and impact points are then recorded in the volunteer’s private workspace; partner schools independently decide whether service qualifies for VIA.
9. **Live location control:** an opt-in settings toggle uses browser geolocation only while the page is open, enabling distance filtering without storing live coordinates in this static prototype.

Hospitals remain valid task and service locations. They do not sit between caregiver publication and volunteer confirmation.

## Product standards implemented

- **Caregiver-first UX:** low cognitive load, concrete language, one primary action and progressive disclosure.
- **Map-first task management:** caregivers can inspect and filter their own geographically distributed tasks without mixing task creation into the homepage.
- **Direct lifecycle:** `Open → Matched → Done`; there is no intermediate staff queue.
- **Executable safety boundary:** out-of-scope text cannot create a volunteer task. Emergency wording displays direct SCDF 995 guidance.
- **Readiness enforcement:** volunteers see an explicit disabled reason when a required skill tag or conversation language is missing.
- **Ethical incentives:** points never increase with urgency, caregiver distress or risk. Public individual leaderboards are excluded.
- **Time and geography:** task creation and scheduled times render in `Asia/Singapore`; Google Maps embeds and deep links use exact demo service points.
- **Privacy honesty:** the interface previews the complete details shared with volunteers and keeps recognition data private to the volunteer.
- **Authentication honesty:** this static prototype demonstrates role-bound sign-in UX but is not connected to a production identity provider.
- **Accessible themes:** light and dark modes use semantic tokens, visible focus treatment and contrast-checked text/background pairs.

## Interaction demo

The front-end supports:

- signing in with caregiver or volunteer demo identities;
- viewing the caregiver’s own map-first task dashboard;
- creating an in-scope task and seeing the immediate **Task published** confirmation;
- stopping an out-of-scope request before publication and displaying appropriate guidance;
- browsing all open, unexpired volunteer tasks with full coordination details;
- accepting a task directly when readiness and language fit;
- keeping a multi-volunteer task open until enough volunteers confirm;
- submitting a completion reflection and seeing the private service record update;
- filtering maps by category, status, date, typed place and distance from optional live location.

All prototype data is in memory; no real personal or health data is collected.

## Local development

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Research discipline

See [RESEARCH.md](./RESEARCH.md) for the Singapore-sector, caregiver-product, volunteer-readiness, privacy and accessibility sources informing the prototype. The file separates source evidence from product decisions and does not claim clinical validation.

Before a real pilot, validate the safe-task taxonomy, data handling, volunteer onboarding, safeguarding, incident response and caregiver outcomes with relevant programme, legal, clinical and caregiver stakeholders.
