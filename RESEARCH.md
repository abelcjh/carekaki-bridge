# Research alignment — CareKaki Bridge final solution

This note keeps the web/social research aligned with the team's **FINAL Solution**: a TaskRabbit-adjacent app where male caregivers post scoped tasks and trained student volunteers accept them, with Silent Task mode to reduce paisehness and VIA/points to sustain volunteering.

## Research-backed thesis

Caregivers in Singapore do not only need more information. They need easier conversion from “I know help exists” to “I can accept help now without shame, cost shock, or complex coordination.” For male caregivers, the solution should feel practical, task-focused, flexible, and competence-preserving.

CareKaki Bridge therefore positions respite as **small task relief**:

> “Post one specific non-clinical task, optionally silent. A trained student volunteer claims it. AH sees a receipt and any clinical concern is escalated.”

## Key evidence and source anchors

| Evidence | Why it supports the final solution | Source |
|---|---|---|
| Only 50.09% of caregivers knew of respite resources; 82.83% of those aware had never used respite. | Awareness alone is insufficient. A task marketplace reduces activation friction and lets caregivers request concrete help instead of navigating a service directory. | SMU ROSA 2025 caregiver profile: https://rosa.smu.edu.sg/sites/rosa.smu.edu.sg/files/Briefs/Mar25/Profiles%20and%20well-being%20of%20caregivers%20in%20Singapore.pdf |
| Family caregivers of older adults in Singapore average 33 care hours/week; about 26% receive no family/MDW help; only 5% attended caregiver training. | There is real burden and low training/support uptake. Small practical tasks can relieve overloaded caregivers even before formal respite is arranged. | Duke-NUS CARE TraCE Research Brief 16: https://www.duke-nus.edu.sg/docs/librariesprovider3/research-policy-brief-docs/a-profile-of-family-caregivers-of-older-adults-in-singapore7d8bce89778d432b95b446254d2a2b4a.pdf |
| Social service agencies report caregivers hold back from help due to stigma, lack of awareness, duty/filial piety, and not identifying as caregivers. | Silent Task mode directly targets paisehness and duty-framed reluctance. Use “care captain / son lead” language instead of forcing emotional caregiver labels. | CNA caregiver stress article: https://www.channelnewsasia.com/singapore/caregivers-more-seeking-financial-aid-support-groups-5237006 |
| Male caregivers benefit from flexible, practical, solution-oriented support; terminology like “partner” may encourage participation. | A TaskRabbit-style interface fits male caregivers better than a counselling/support-group-first experience. | Male caregivers scoping review, 2025: https://link.springer.com/article/10.1007/s44250-025-00285-9 |
| Male carers may be reluctant to step back; fear perceived failure/loss of control; education-based collaborative support is preferred. | CareKaki Bridge keeps caregivers in control: they choose the task, silence level, category, and helper. | Male family carers’ formal support meta-ethnography: https://onlinelibrary.wiley.com/doi/10.1111/scs.12919 |
| Carer Matters Singapore enrolled 550 caregivers through hospital-to-home workflow with needs assessment, training, tele-support, and community links. | The platform should plug into AH workflow and produce receipts/escalations, not exist as a standalone consumer app. | BMC Carer Matters RE-AIM paper: https://link.springer.com/article/10.1186/s12913-022-08317-3 |
| AH C3U coordinates across inpatient, outpatient, urgent care, nursing home, homecare for existing patients/caregivers/community partners. | AH has a natural owner/integration surface for caregiver task receipts and escalation. | AH C3U page: https://www.ah.com.sg/our-services/community-care-coordination-unit-c3u-at-ah |
| Existing caregiver options include CTG/HCG, AIC Link, day care, respite services, home care, MDW support; some involve wait time/cost/process. | CareKaki Bridge fills the gap between “formal service exists” and “caregiver needs light help tonight.” | AIC / MOH caregiver pages: https://aic.sg/Caregiving-Support/Knowing-Available-Care-Options and https://www.moh.gov.sg/managing-expenses/keeping-healthcare-affordable/help-for-caregiver/ |
| Similar platforms exist: Herewith, Lotsa Helping Hands, Rally, Our Caring Circle, Whimble. | Validate that task/help coordination is a known pattern, but our differentiation is Singapore/AH-specific, male-sensitive, silent task mode, VIA volunteer ops, and clinical guardrails. | Herewith App Store, Lotsa Helping Hands, Rally, Whimble, Our Caring Circle |

## Competitor / analogous product scan

| Product | What it does | What we borrow | What we do differently |
|---|---|---|---|
| Herewith | Book trusted local helpers for seniors for one-time tasks and ongoing help. | Help request creation, flexible booking, categories, helper profiles. | We use trained students/VIA instead of paid caregivers, with AH clinical escalation boundaries. |
| Lotsa Helping Hands | Coordinate meals, rides, visits, updates, and emotional support. | Task claiming and community help board. | We optimize for male caregiver paisehness via silent tasks and practical language. |
| Rally | Create a support circle, add tasks, share link, helpers claim tasks. | Simple task breakdown and claim flow. | We connect to hospital workflow and student incentives. |
| Whimble | On-demand disability support when routine systems fail. | On-demand gap-filling framing. | We focus on non-clinical respite tasks and volunteer governance. |
| Our Caring Circle | Family task coordination for elder care. | Shared responsibility and task receipts. | We reach beyond family when family support is absent or hard to ask. |

## Product requirements derived from research

1. **Silent Task mode**: default low-contact request flow, with “no call needed” templates.
2. **Practical categories**: errands, transport/escort, meal support, tech help, forms/admin, companionship, home setup.
3. **Safety gate**: any medication, symptoms, wound, insulin, fall, or clinical question must be escalated to nurse/pharmacist/MSW.
4. **Volunteer incentives**: points, VIA hours, badges, team ranking, task difficulty tiers.
5. **Caregiver control**: caregiver chooses task, timing, silence level, and whether to reveal identity/details.
6. **AH receipt dashboard**: task posted, claimed, completed, declined, escalated, follow-up owner.
7. **Pilot wedge**: one AH ward/discharge route first; 20–30 caregivers; trained students; weekly staff review.

## Pitch line

CareKaki Bridge turns caregiver respite from a hard-to-ask emotional request into one silent, specific, AH-safe task that a trained student can actually complete.
