# Research alignment — CareKaki Bridge final solution

This note keeps the web/social research aligned with the team's **FINAL Solution** and SparkX⁺Change requirements: CareKaki Bridge is a TaskRabbit-adjacent, **managed youth-volunteer programme** where male caregivers post scoped tasks and trained volunteers accept them. Silent Task mode reduces paisehness; volunteer operations, project governance, and AH escalation make the concept pilotable.

## Research-backed thesis

Caregivers in Singapore do not only need more information. They need easier conversion from “I know help exists” to “I can accept help now without shame, cost shock, or complex coordination.” For male caregivers, the service should feel practical, task-focused, flexible, and competence-preserving.

> **CareKaki Bridge:** “Post one specific non-clinical task, optionally silent. A trained youth volunteer claims it. AH sees a receipt and any clinical concern is escalated.”

## Programme-fit requirements

| SparkX⁺Change requirement | CareKaki implementation | Evidence shown in the prototype/pitch |
|---|---|---|
| Male-friendly, low-emotional-barrier caregiver respite | Silent Task, no-call preference, practical “one task” language, caregiver controls timing/details | Silent Task request flow and low-contact task templates |
| Integrate current programmes, rather than duplicate them | AH/C3U staff review queue; task receipts can route caregivers to NUHS/AH programmes, AIC Link, education or support services | “Activation layer, not another directory” |
| Youth tech component | Youth volunteers set up calendar/medication reminders *without medical advice*, teleconsult access, WhatsApp and directory navigation | Tech-help category plus scoped safety gate |
| Volunteer management | Recruit → screen → AH briefing → skill-tag → match → supervision → VIA receipt/recognition | Volunteer roster, training gate, reliability and verified VIA hours |
| Project management | Named pilot owners, weekly operations huddle, task moderation, escalation SOP, milestone plan and impact dashboard | Project-control panel and pilot plan |
| Measurable impact | Track caregivers supported, task completion, silent-task uptake, repeat requests, VIA hours, caregiver confidence/stress, escalation and incidents | Six-month dashboard; target is directional until validated with AH |

## Key evidence and source anchors

| Evidence | Why it supports the final solution | Source |
|---|---|---|
| Only 50.09% of caregivers knew of respite resources; 82.83% of those aware had never used respite. | Awareness alone is insufficient. A concrete task workflow reduces activation friction. | SMU ROSA 2025 caregiver profile: https://rosa.smu.edu.sg/sites/rosa.smu.edu.sg/files/Briefs/Mar25/Profiles%20and%20well-being%20of%20caregivers%20in%20Singapore.pdf |
| Family caregivers of older adults in Singapore average 33 care hours/week; about 26% receive no family/MDW help; only 5% attended caregiver training. | Small practical tasks can relieve overloaded caregivers while youth offer hands-on tech enablement. | Duke-NUS CARE TraCE Research Brief 16: https://www.duke-nus.edu.sg/docs/librariesprovider3/research-policy-brief-docs/a-profile-of-family-caregivers-of-older-adults-in-singapore7d8bce89778d432b95b446254d2a2b4a.pdf |
| Caregivers may hold back due to stigma, duty/filial piety, and not identifying as caregivers. | Silent Task mode addresses help-seeking friction without demanding emotional disclosure. | CNA: https://www.channelnewsasia.com/singapore/caregivers-more-seeking-financial-aid-support-groups-5237006 |
| Male caregivers benefit from flexible, practical, solution-oriented support. | The task marketplace is a better fit than counselling/support-group-first onboarding. | 2025 scoping review: https://link.springer.com/article/10.1007/s44250-025-00285-9 |
| Carer Matters enrolled caregivers through hospital-to-home workflow with needs assessment, training, tele-support and community links. | CareKaki should plug into hospital workflow with staff ownership; it cannot be a standalone unmoderated board. | BMC RE-AIM paper: https://link.springer.com/article/10.1186/s12913-022-08317-3 |
| AH C3U coordinates existing patients, caregivers and community partners across care settings. | C3U/AH is a plausible pilot referral and escalation surface to validate with the hospital. | AH C3U: https://www.ah.com.sg/our-services/community-care-coordination-unit-c3u-at-ah |

## NUHS and FormSG findings — how to use them correctly

The NUHS Patient & Caregiver Support page links caregivers to information, education, support and practical services. It includes the **Patient & Caregiver Support for Psychosocial and Emotional Well-being** pathway and routes users to a FormSG questionnaire to receive recommendations for relevant support groups, programmes and counselling/services.

This is valuable evidence that the ecosystem already provides counselling, nutrition/exercise education, peer support and formal programmes. **CareKaki should not copy these clinical or psychosocial services.** It should act as the assisted activation layer:

1. a caregiver posts a bounded task, such as “help me find and register for a caregiver exercise/nutrition session” or “set reminders for a programme”;
2. a trained youth volunteer handles navigation, digital setup, accompaniment/wayfinding or forms;
3. counselling, psychosocial need, medical questions and programme suitability remain with NUHS/AH professionals and the official referral form.

The FormSG link is therefore **not a public task intake form** and should not be repurposed. It is an official matching/referral pathway; CareKaki can direct the caregiver to it and record only a non-sensitive “referred” receipt.

Sources reviewed:
- NUHS Patient & Caregiver Support: https://www.nuhs.edu.sg/patient-care/patient-and-caregiver-support
- Official support-matching form: https://form.gov.sg/63a005bdb8509f0012092f9a

## Product requirements derived from research and programme brief

1. **Silent Task mode**: low-contact request flow with “no call needed” templates.
2. **Practical categories**: errands, escort/transport, meal support, tech help, forms/admin, companionship and home setup.
3. **Youth tech enablement**: reminders, teleconsult/platform setup, directory navigation and programme registration support; never clinical judgement.
4. **Safety gate**: medication, symptoms, wounds, insulin, falls, mental-health crisis or programme suitability → nurse/pharmacist/MSW/official referral.
5. **Volunteer operations**: screening, AH safeguarding briefing, skill tags, availability, moderation, supervision, completion receipts, VIA/recognition and incident route.
6. **Project controls**: named owners; task service-level expectation; weekly operations huddle; escalation log; caregiver feedback; milestone and risk review.
7. **Caregiver control**: choose task, timing, silence level and details revealed.
8. **AH receipt dashboard**: posted, claimed, completed, declined, escalated, follow-up owner and referral status.
9. **Pilot wedge**: one AH ward/discharge route; 20–30 caregivers; recruited youth cohort; weekly staff review.

## Impact and validation plan

The organisers’ 30% burnout-reduction goal is an **aspirational six-month outcome**, not a claim we can make before a pilot. Baseline and weekly/fortnightly caregiver confidence or stress measures must be agreed with AH. Near-term proof metrics are: task acceptance, silent-task uptake, repeat use, completed micro-respite hours, programme/referral activation, volunteer retention/VIA hours, caregiver confidence and zero clinical-advice incidents.

## Pitch line

CareKaki Bridge turns caregiver respite from a hard-to-ask emotional request into one silent, specific, AH-safe task — delivered by a trained youth volunteer, managed as a real programme, and measured for caregiver relief.
