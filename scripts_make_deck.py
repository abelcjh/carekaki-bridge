from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pathlib import Path

OUT = Path('/home/abel/carekaki-bridge/CareKaki_Bridge_pitch_deck.pptx')
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

NAVY = RGBColor(8, 24, 41)
BLUE = RGBColor(20, 93, 160)
CYAN = RGBColor(113, 215, 255)
PALE = RGBColor(235, 247, 255)
TEXT = RGBColor(27, 45, 65)
MUTED = RGBColor(87, 111, 134)
WHITE = RGBColor(255,255,255)
GREEN = RGBColor(33,128,71)
ORANGE = RGBColor(180,91,25)


def set_bg(slide, color=RGBColor(244, 247, 251)):
    fill = slide.background.fill
    fill.solid(); fill.fore_color.rgb = color

def add_text(slide, text, x, y, w, h, size=24, bold=False, color=TEXT, align=None):
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.clear()
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(size)
    p.font.bold = bold
    p.font.color.rgb = color
    p.font.name = 'Aptos Display' if size >= 28 else 'Aptos'
    if align:
        p.alignment = align
    return box

def add_title(slide, kicker, title, subtitle=None):
    add_text(slide, kicker.upper(), .55, .35, 5.8, .35, 10, True, BLUE)
    add_text(slide, title, .55, .72, 8.0, 1.2, 38, True, NAVY)
    if subtitle:
        add_text(slide, subtitle, .58, 1.82, 8.7, .6, 15, False, MUTED)

def pill(slide, text, x, y, w, color=PALE, font=BLUE):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(.42))
    shape.fill.solid(); shape.fill.fore_color.rgb = color
    shape.line.color.rgb = color
    p = shape.text_frame.paragraphs[0]
    p.text = text
    p.font.size = Pt(11); p.font.bold = True; p.font.color.rgb = font
    p.alignment = PP_ALIGN.CENTER
    return shape

def card(slide, title, body, x, y, w, h, accent=BLUE):
    s = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    s.fill.solid(); s.fill.fore_color.rgb = WHITE
    s.line.color.rgb = RGBColor(219,231,242)
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(.08), Inches(h))
    bar.fill.solid(); bar.fill.fore_color.rgb = accent
    bar.line.color.rgb = accent
    add_text(slide, title, x+.22, y+.18, w-.35, .4, 16, True, NAVY)
    add_text(slide, body, x+.22, y+.66, w-.35, h-.85, 11.8, False, MUTED)

slides = []
# 1 cover
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide, NAVY)
add_text(slide, 'SPARKX⁺CHANGE · ALEXANDRA HOSPITAL CAREGIVER RESPITE', .7, .55, 8, .35, 11, True, CYAN)
add_text(slide, 'CareKaki Bridge', .7, 1.15, 8.5, 1.0, 50, True, WHITE)
add_text(slide, 'Silent-help task marketplace for male caregivers and trained student volunteers', .72, 2.1, 8.0, .65, 21, False, RGBColor(215,236,255))
pill(slide, 'Post one task · claim one task · generate one AH-safe receipt', .75, 3.05, 5.3, CYAN, NAVY)
card(slide, '10-second demo loop', 'Need help → post Silent Task → student claims → task completed → receipt + escalation record', 7.8, 1.0, 4.7, 2.4, CYAN)
card(slide, 'Final team direction', 'TaskRabbit-adjacent app, Silent Task option, different task categories, VIA/reward incentives, weighted points by difficulty.', 7.8, 3.7, 4.7, 2.35, CYAN)

# 2 problem
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide)
add_title(slide, 'Problem', 'Caregivers know help exists, but still do not use it', 'The gap is not only information. It is activation friction: shame, cost, effort, uncertainty, and lack of one clear next action.')
card(slide, 'Respite awareness ≠ respite usage', 'SMU ROSA: only 50.09% of caregivers knew of respite resources; 82.83% of those aware had never used respite.', .7, 2.55, 3.8, 2.0, ORANGE)
card(slide, 'Care load is heavy', 'Duke-NUS CARE TraCE: primary caregivers averaged 33 care hours/week; about 26% had no family/MDW help; only 5% attended caregiver training.', 4.78, 2.55, 3.8, 2.0, BLUE)
card(slide, 'Asking is emotionally expensive', 'CNA reported caregivers may hold back because of stigma, duty/filial piety, and not identifying themselves as caregivers.', 8.85, 2.55, 3.8, 2.0, GREEN)
add_text(slide, 'Insight: make help feel like a concrete task, not a confession of burnout.', 1.05, 5.45, 11.1, .55, 24, True, NAVY, PP_ALIGN.CENTER)

# 3 male caregiver insight
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide)
add_title(slide, 'User insight', 'Male caregivers need help that protects competence', 'Research suggests male caregivers engage better with practical, flexible, solution-oriented support.')
card(slide, 'Practical framing', 'A 2025 male caregiver scoping review recommends solution-oriented, practical language over emotion-first help-seeking frames.', .75, 2.3, 3.7, 2.2, BLUE)
card(slide, 'Control matters', 'Male carers may fear perceived failure or loss of control. CareKaki lets them choose task, silence level, timing, and helper.', 4.85, 2.3, 3.7, 2.2, ORANGE)
card(slide, 'Task-focused approach', 'Male dementia caregiver research finds men often adopt a task-focused approach to gain control over caregiving.', 8.95, 2.3, 3.7, 2.2, GREEN)
add_text(slide, 'Design principle: “I need one task done” is easier to say than “I need emotional support.”', .9, 5.35, 11.5, .55, 24, True, NAVY, PP_ALIGN.CENTER)

# 4 solution
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide, RGBColor(238,247,255))
add_title(slide, 'Solution', 'CareKaki Bridge: Silent Task marketplace', 'Male caregivers post scoped, non-clinical tasks. Trained students claim them for VIA hours, points, and verified care-service receipts.')
card(slide, 'Caregiver app', 'Post help requests, choose category, turn on Silent Task mode, set no-call/no-chat preferences, track completion.', .7, 2.25, 3.8, 2.4, BLUE)
card(slide, 'Volunteer board', 'Students pick OTOT tasks by category, difficulty, location, time, and points/VIA hours.', 4.78, 2.25, 3.8, 2.4, GREEN)
card(slide, 'AH dashboard', 'Staff see task receipts, accepted/declined support, clinical escalations, and follow-up owners.', 8.85, 2.25, 3.8, 2.4, ORANGE)
add_text(slide, 'Positioning: practical respite between “formal services exist” and “I need help tonight.”', 1.05, 5.38, 11.1, .55, 23, True, NAVY, PP_ALIGN.CENTER)

# 5 core loop
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide)
add_title(slide, 'Core loop', 'One silent request becomes measurable relief', 'This is the live demo path judges can understand in 10 seconds.')
steps = [('1', 'Caregiver posts task', 'e.g. “pick up discharge supplies”'), ('2', 'Silent mode lowers paisehness', 'no phone call, minimal explanation'), ('3', 'Volunteer claims task', 'matched by skill/category/time'), ('4', 'Safety gate checks scope', 'clinical issues escalated'), ('5', 'Receipt generated', 'points, VIA, AH follow-up record')]
for i,(n,t,b) in enumerate(steps):
    x=.55+i*2.55
    pill(slide, n, x, 2.35, .55, CYAN, NAVY)
    card(slide, t, b, x, 2.95, 2.25, 1.55, BLUE if i%2==0 else GREEN)
add_text(slide, 'Metric story: silent tasks accepted · micro-respite hours delivered · clinical advice violations = 0.', .85, 5.55, 11.6, .55, 22, True, NAVY, PP_ALIGN.CENTER)

# 6 task categories
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide)
add_title(slide, 'Product design', 'Different tasks for different student skills', 'The app is not “volunteers do everything”. It is a scoped matching layer.')
cats = [('Errands', 'pharmacy queue, supplies, meals'), ('Transport / escort', 'wayfinding, AIC Link, clinic route'), ('Tech help', 'calendar, WhatsApp, teleconsult setup'), ('Admin', 'forms, notes, questions for nurse'), ('Companionship', 'walk, coffee, no-pressure check-in'), ('Home setup', 'non-clinical organisation after discharge')]
for i,(t,b) in enumerate(cats):
    card(slide, t, b, .7+(i%3)*4.05, 2.2+(i//3)*1.65, 3.55, 1.25, [BLUE,GREEN,ORANGE][i%3])
add_text(slide, 'Bigger / less convenient tasks earn more points and VIA hours; unsafe tasks are blocked or escalated.', .95, 5.85, 11.2, .45, 18, True, NAVY, PP_ALIGN.CENTER)

# 7 safety
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide)
add_title(slide, 'Safety and trust', 'Volunteers help with tasks, not treatment', 'The clinical boundary is a product feature, not a disclaimer.')
card(slide, 'Allowed', 'Errands, reminders, meal pickup, wayfinding, form help, companionship, non-clinical tech setup.', .7, 2.35, 3.8, 2.2, GREEN)
card(slide, 'Escalate', 'Medication timing, wound care, symptoms, insulin, falls, mental health crisis, diagnosis, clinical interpretation.', 4.78, 2.35, 3.8, 2.2, ORANGE)
card(slide, 'Receipt', 'Every task logs owner, action, status, volunteer, points, escalation, follow-up staff/team.', 8.85, 2.35, 3.8, 2.2, BLUE)
add_text(slide, 'Trust promise: 0 clinical advice by students, 100% task-level accountability.', 1.05, 5.5, 11.1, .55, 24, True, NAVY, PP_ALIGN.CENTER)

# 8 pilot
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide, RGBColor(245,249,252))
add_title(slide, 'Pilot plan', 'Start narrow, prove uptake, then scale', 'Six-month AH pilot designed for feasibility and judge credibility.')
card(slide, 'Pilot site', 'One ward/discharge route first, e.g. Geriatric Ward 2 or AH-selected caregiver-heavy route.', .75, 2.25, 3.7, 2.1, BLUE)
card(slide, 'Users', '20–30 male/primary caregivers; trained student volunteers; AH nurse/MSW/C3U escalation owners.', 4.85, 2.25, 3.7, 2.1, GREEN)
card(slide, 'Success metrics', 'Task acceptance, silent-task rate, repeat requests, VIA hours, caregiver confidence, escalation safety, staff feasibility.', 8.95, 2.25, 3.7, 2.1, ORANGE)
add_text(slide, 'First proof target: 30 caregivers, 100 completed non-clinical tasks, 0 volunteer clinical-advice incidents.', .9, 5.4, 11.5, .6, 24, True, NAVY, PP_ALIGN.CENTER)

# 9 prototype
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide, NAVY)
add_text(slide, 'PROTOTYPE', .7, .55, 4, .35, 11, True, CYAN)
add_text(slide, 'Working web app is already live', .7, 1.0, 7.2, .75, 36, True, WHITE)
add_text(slide, 'GitHub repo: github.com/abelcjh/carekaki-bridge\nLive demo: abelcjh.github.io/carekaki-bridge/', .75, 1.9, 7.2, .75, 18, False, RGBColor(215,236,255))
card(slide, 'Demo actions built', 'Create Silent Task · claim task · mark done · points/VIA hours · AH-safe clinical flag · volunteer board · pilot metrics.', .75, 3.15, 5.2, 2.0, CYAN)
card(slide, 'Next build sprint', 'Auth roles, receipt export, volunteer leaderboard, caregiver SMS/WhatsApp link, admin dashboard, Supabase backend.', 6.6, 3.15, 5.8, 2.0, CYAN)

# 10 close
slide = prs.slides.add_slide(prs.slide_layouts[6]); set_bg(slide)
add_title(slide, 'Ask / close', 'Make respite as easy as posting one task', 'CareKaki Bridge gives AH a practical, measurable, youth-powered way to help male caregivers accept support.')
card(slide, 'Why now', 'Singapore caregiver burden is rising, respite uptake is low, and AH already has caregiver/community coordination surfaces.', .7, 2.4, 3.8, 2.1, BLUE)
card(slide, 'Why us', 'Youth volunteer supply + AI/full-stack build speed + lived Southeast Asia community execution through Abel/Nyala Labs.', 4.78, 2.4, 3.8, 2.1, GREEN)
card(slide, 'What we need', 'AH pilot owner, volunteer onboarding path, safe task list, escalation SOP, and first caregiver feedback cycle.', 8.85, 2.4, 3.8, 2.1, ORANGE)
add_text(slide, 'CareKaki Bridge: silent help, visible relief.', 1.15, 5.55, 10.9, .6, 28, True, NAVY, PP_ALIGN.CENTER)

prs.save(OUT)
print(OUT)
