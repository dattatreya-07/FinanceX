# FinanceX — Landing Page Master Specification

## 1. PROJECT CONTEXT

This specification is for the EXISTING FinanceX project.

The goal is to enhance the existing public landing page into a premium cinematic, scroll-driven financial experience.

DO NOT rebuild the project from scratch.

First inspect the existing project structure, landing page, components, routes, assets, theme system, animations and existing functionality.

Reuse the existing architecture wherever possible.

---

# 2. CORE PRESERVATION RULE

The following existing components/features are FINAL and MUST be preserved:

- FinanceX Header / Navbar
- FinanceX logo and branding
- Sign In button
- Create Account / Get Started button
- Existing authentication routes
- Existing Footer
- Existing infinity-scroll / market-movement section
- Existing navigation
- Existing theme system
- Existing dark/light mode
- Existing responsive structure
- Existing typography/design tokens
- Existing boot animation
- Existing reusable UI components
- Existing functionality outside the landing-page modification

DO NOT:

- Replace the Header
- Replace the Footer
- Replace the infinity-scroll
- Create duplicate navigation
- Create duplicate authentication pages
- Create a new theme system
- Change existing authentication logic
- Rewrite unrelated project components
- Remove existing finalized animations

The new cinematic experience must integrate into the existing landing page.

---

# 3. MAIN OBJECTIVE

Transform the landing page into a premium cinematic financial story controlled by scrolling.

The visitor should experience:

MONEY
↓
EVOLUTION OF MONEY
↓
FINANCIAL FREEDOM
↓
BREAK THE MONEY MINDSET
↓
THE 1%
↓
RISK
↓
FINANCIAL PRINCIPLES
↓
FINANCEX

The experience should feel like a premium financial documentary combined with a modern fintech website.

It should NOT feel like:

- A normal slideshow
- A generic SaaS landing page
- A stock-market advertisement
- A gambling website
- A luxury lifestyle advertisement
- A cryptocurrency advertisement
- A generic motivational website

---

# 4. CINEMATIC ASSET STRUCTURE

The prepared cinematic frame sequences already exist under:

assets/1
assets/2
assets/3
assets/4
assets/5
assets/6
assets/7

Each sequence is rendered at 25 FPS.

Asset mapping:

| Folder | Meaning |
|---|---|
| assets/1 | Money / Dollar |
| assets/2 | Evolution of Money |
| assets/3 | Financial Freedom |
| assets/4 | Crush Money |
| assets/5 | The 1% |
| assets/6 | Risk |
| assets/7 | Principles / XAUUSD |

IMPORTANT:

Inspect the actual filenames inside each folder.

Do NOT assume filenames such as:

frame001.jpg
frame002.jpg

Automatically detect the available frames and determine their correct ordering.

The supplied assets are the visual source of truth.

---

# 5. TRUE SCROLL-DRIVEN ANIMATION

The landing page MUST use a real scroll-to-frame cinematic system.

This is NOT:

- An autoplay video
- A normal slideshow
- A timed animation
- A simple section-based image switch

The intended relationship is:

scroll position
→ scene progress
→ frame index
→ rendered frame

For each scene:

frameIndex =
floor(sceneProgress * (totalFrames - 1))

Scrolling forward:

→ advances frames

Scrolling backward:

→ reverses frames

Stopping the scroll:

→ freezes the cinematic sequence at the exact current frame.

The animation must remain synchronized with scroll position.

Use:

- requestAnimationFrame
- efficient scroll progress calculation
- minimal React state updates
- direct DOM/canvas/image updates where appropriate

DO NOT trigger a heavy React re-render for every frame.

---

# 6. SCROLL EXPERIENCE

The visitor should feel as though they are physically moving through the video by scrolling.

Requirements:

- Forward scroll advances the animation.
- Reverse scroll reverses the animation.
- Fast scrolling remains stable.
- Slow scrolling provides precise control.
- Trackpad scrolling works.
- Mouse wheel works.
- Touch scrolling works.
- Mobile scrolling works.
- No visible frame jumping.
- No flickering.
- No unnecessary scroll locking.

Do not hijack scrolling in a way that makes the page feel broken.

The user must retain natural control over the page.

---

# 7. SCENE STRUCTURE

## SCENE 01 — MONEY

Asset:

`assets/1`

Purpose:

Introduce money as one of the forces shaping modern life.

Suggested headline:

> Money moves everything.

Supporting text:

> But very few people truly understand how it works.

Keep this scene visually minimal.

The cinematic money imagery should dominate the screen.

---

## SCENE 02 — EVOLUTION OF MONEY

Asset:

`assets/2`

Purpose:

Explain how money evolved.

Suggested headline:

> Money evolved.

Supporting text:

> From barter and coins to paper, banks and digital finance.

The visual transition should communicate the evolution of money.

---

## SCENE 03 — FINANCIAL FREEDOM

Asset:

`assets/3`

Purpose:

Move the story from money itself to what financial understanding enables.

Headline:

> Money is not the destination.

Supporting text:

> Financial freedom is.

Keep this section spacious, calm and emotionally powerful.

Do NOT turn this into a luxury lifestyle section.

---

## SCENE 04 — CRUSH MONEY

Asset:

`assets/4`

Purpose:

Create the major narrative turning point.

Headline:

> Money is a tool.

Supporting text:

> Don't let it become the goal.

The crushing visual should feel symbolic and controlled.

This section transitions the visitor from thinking about money to thinking about mastery.

---

## SCENE 05 — THE 1%

Asset:

`assets/5`

Purpose:

Present the "1%" as a mindset rather than simply wealth.

Headline:

> The 1% is a mindset.

Supporting text:

> Knowledge. Discipline. Decision-making.

Do NOT associate this scene with:

- Luxury cars
- Mansions
- Expensive watches
- Cash piles
- Champagne

The concept is financial intelligence and mastery.

---

## SCENE 06 — RISK

Asset:

`assets/6`

Purpose:

Introduce the reality of financial markets.

Headline:

> Every opportunity has risk.

Supporting text:

> The advantage belongs to those who understand it.

Communicate:

- Uncertainty
- Volatility
- Risk management
- Decision-making

Do NOT create artificial crashes or fear-based visuals.

---

## SCENE 07 — PRINCIPLES

Asset:

`assets/7`

Purpose:

Finish the cinematic story with the principles required for financial and trading mastery.

The visual contains a black-and-white XAUUSD-inspired trading environment.

Introduce the principles progressively:

PATIENCE

DISCIPLINE

FOCUS

CONSISTENCY

RISK MANAGEMENT

MINDSET

Final headline:

> Master the principles.  
> Understand the market.

These words MUST be website typography, not generated into the video frames.

The final frame should naturally transition into the existing FinanceX CTA.

---

# 8. CINEMATIC TRANSITIONS

The seven scenes must feel like ONE continuous financial story.

Transition flow:

assets/1
→ Dollar fills frame
→ assets/2

assets/2
→ Money evolves into digital financial particles
→ assets/3

assets/3
→ Bright/open horizon
→ assets/4

assets/4
→ Crushed dollar disappears into darkness
→ assets/5

assets/5
→ 1% transitions into dark market atmosphere
→ assets/6

assets/6
→ Market structures transition into monochrome chart
→ assets/7

assets/7
→ Chart fades into darkness
→ Existing FinanceX CTA

Use subtle:

- Opacity
- Scale
- Blur
- Parallax
- Crossfade
- Scroll-controlled transitions

Avoid excessive visual effects.

---

# 9. TEXT LAYER

Do NOT generate text inside the frame assets.

All text must be rendered by the website.

Use the existing FinanceX typography and design system.

Text should:

- Have strong contrast.
- Remain readable.
- Animate subtly.
- Appear according to scroll progress.
- Never unnecessarily cover the primary visual.

Possible chapter indicator:

01 / 07
02 / 07
03 / 07
04 / 07
05 / 07
06 / 07
07 / 07

Optional chapter names:

MONEY
EVOLUTION
FREEDOM
MINDSET
RISK
PRINCIPLES

Keep the indicator subtle.

---

# 10. EXISTING INFINITY SCROLL

The existing infinity-scroll / market-movement section is FINAL.

KEEP IT.

Do NOT:

- Remove it.
- Replace it with the cinematic frames.
- Redesign its core behavior.

Integrate the cinematic story around the existing infinity-scroll according to the existing landing-page architecture.

If it is already positioned correctly, preserve its placement.

---

# 11. HEADER AND CTA

Keep the existing FinanceX Header/Navbar.

Existing buttons must continue using existing routes:

- Sign In
- Create Account / Get Started

Do not create new authentication logic.

After the cinematic sequence, transition naturally into the existing FinanceX CTA.

Suggested final content:

Headline:

> Learn finance properly.  
> Then prove it.

Primary CTA:

> Get Started

Secondary CTA:

> Sign In

Reuse existing button components and authentication routes.

---

# 12. VISUAL DESIGN

Overall direction:

- Premium
- Cinematic
- Minimal
- Financial
- Intelligent
- Dark
- Sophisticated

Preferred visual language:

- Deep black
- Charcoal
- Silver
- White
- Restrained FinanceX green
- Restrained FinanceX pink
- Subtle gradients
- Realistic cinematic depth

Avoid:

- Excessive neon
- Excessive particles
- Excessive glassmorphism
- Excessive cards
- Excessive glowing borders
- Random financial icons
- Unnecessary 3D objects
- Visual clutter

The cinematic imagery should remain the hero.

---

# 13. PERFORMANCE

Performance is critical.

Implement:

- Intelligent frame preloading
- Lazy loading
- Image decoding optimization
- requestAnimationFrame
- Minimal React re-renders
- Efficient scroll calculations
- Next-scene preloading
- Memory-conscious frame management

Do NOT load every frame from all seven sequences into memory immediately.

Priority:

1. Load Scene 1.
2. Preload the next scene.
3. Lazy-load later scenes progressively.

The first meaningful visual should appear quickly.

---

# 14. RESPONSIVENESS

Desktop:

Use the full cinematic experience.

Tablet:

Maintain the cinematic experience while adapting typography and spacing.

Mobile:

Optimize frame loading and memory.

Maintain the same narrative while reducing resource usage when necessary.

If a device cannot efficiently handle the complete frame experience, provide an optimized fallback without breaking the landing page.

---

# 15. ACCESSIBILITY

Respect:

`prefers-reduced-motion`

Provide readable text contrast.

The cinematic animation should not be required to understand the core content.

All buttons must remain keyboard accessible.

---

# 16. IMPLEMENTATION PROCESS

Before changing code:

1. Inspect the existing project.
2. Identify the current landing-page entry point.
3. Identify the Header/Navbar.
4. Identify the Footer.
5. Identify the infinity-scroll implementation.
6. Identify the existing theme system.
7. Identify existing authentication routes.
8. Inspect assets/1–7.
9. Determine actual frame filenames and ordering.
10. Determine the minimum files that need modification.

Then provide a brief implementation plan.

After the plan is confirmed, implement the changes.

Do NOT rewrite unrelated project files.

Do NOT remove existing functionality.

Do NOT duplicate components.

Do NOT replace finalized components unnecessarily.

---

# 17. QUALITY REQUIREMENTS

Before considering the task complete, verify:

- Header works.
- Footer works.
- Sign In works.
- Create Account works.
- Existing routing works.
- Boot animation works.
- Dark/light mode works.
- Existing infinity-scroll works.
- All 7 frame sequences load correctly.
- Forward scrolling works.
- Reverse scrolling works.
- Fast scrolling works.
- Trackpad works.
- Touch scrolling works.
- Mobile layout works.
- Reduced-motion works.
- No frame flickering.
- No broken assets.
- No console errors.
- No unnecessary loading delays.
- No unrelated functionality has been changed.

---

# 18. FINAL EXPERIENCE

The visitor should feel:

Money is everywhere.

Money evolved.

Understanding money creates freedom.

Money itself is only a tool.

The real advantage is mindset.

Risk must be understood.

Master the principles.

Then master finance with FinanceX.

The final experience should feel like a continuous cinematic financial journey rather than seven independent animations.

---
# 19. CINEMATIC CONTENT + SCROLL STORY

IMPORTANT:

Each folder (1–7) is NOT only a visual animation.

Each folder represents a complete storytelling chapter.

As the user scrolls through the frames:

VIDEO/FRAME ANIMATION
+
TEXT CONTENT
+
TEXT POSITION/OPACITY
+
VISUAL TRANSITION
+
STAGE-SPECIFIC EFFECTS

must work together.

The user should learn something from every stage.

The content must progressively appear, remain readable, and disappear naturally as the user moves into the next chapter.

Do NOT leave blank spaces between frame sequences.

Do NOT simply show the video with empty text areas.

Every stage must contain meaningful content.

==================================================
STAGE 1 — OVERVIEW / WHY FINANCE MATTERS
ASSET: assets/1
==================================================

PURPOSE:

Introduce FinanceX and immediately establish why understanding money and finance matters.

OPENING:

Start with the existing cinematic dollar/money visual.

Initially show only a short statement.

TEXT:

"Money moves everything."

As the user continues scrolling:

"Yet most people are never taught how it really works."

Then reveal:

"FinanceX exists to change that."

Then:

"Learn how money works.
Understand the markets.
Build better financial decisions."

VISUAL EFFECT:

Text should appear progressively with the frame movement.

Use:

fade-in
slight upward movement
subtle scale
blur → sharp

Do not display all text at once.

The cinematic money visual remains dominant.

END OF STAGE:

Show a small transition indicator:

"THE STORY OF MONEY →"

Then smoothly transition into Stage 2.

==================================================
STAGE 2 — EVOLUTION OF MONEY
ASSET: assets/2
==================================================

PURPOSE:

Explain how money evolved and why understanding that evolution matters.

INTRO:

"Money wasn't always money."

As the user scrolls:

"BARTER"

→

"COINS"

→

"PAPER CURRENCY"

→

"BANKING"

→

"DIGITAL MONEY"

Each concept should appear at the appropriate visual moment.

Then reveal:

"Every generation changed the way value moved."

Follow with:

"Today, money moves faster than ever."

Then:

"Understanding that evolution is the first step toward understanding modern finance."

VISUAL EFFECT:

The text should transition with the visual evolution.

Example:

Barter:
simple fade

Coins:
small horizontal movement

Paper:
paper-like transition

Banking:
subtle scale

Digital:
slight glow / digital dissolve

Do NOT use excessive effects.

END:

"Money evolved."

"Now it's time to understand what it can create."

Transition into Stage 3.

==================================================
STAGE 3 — FINANCIAL FREEDOM
ASSET: assets/3
==================================================

PURPOSE:

Explain what financial freedom actually means and connect it directly to FinanceX.

OPENING:

"Financial freedom isn't about being rich."

Then:

"It's about having choices."

As scrolling continues, reveal:

"Control over your time."

"Confidence in your decisions."

"Freedom from constant financial uncertainty."

Then explain:

"Financial freedom is built through:"
 
KNOWLEDGE
+
DISCIPLINE
+
CONSISTENT ACTION
+
RISK AWARENESS

Then connect to FinanceX:

"FinanceX helps you build the knowledge behind better financial decisions."

"Understand money."

"Understand markets."

"Build your financial mindset."

FINAL MESSAGE:

"Freedom begins with understanding."

Transition into Stage 4.

==================================================
STAGE 4 — CRUSH THE MONEY MINDSET
ASSET: assets/4
==================================================

PURPOSE:

Create the major emotional turning point.

The user should question their relationship with money.

OPENING:

"Money is powerful."

As the dollar begins to compress:

"But money should never control you."

As the crushing progresses:

"Don't chase money blindly."

"Understand it."

"Use it."

"Control your decisions."

Then the key statement:

"MONEY IS A TOOL."

Followed by:

"NOT THE DESTINATION."

VISUAL EFFECT:

Synchronize text with the crushing action.

Beginning:
Money is powerful.

Middle:
Money should not control you.

Crushing:
Money is a tool.

Final frame:
Not the destination.

Allow the final statement to remain briefly in darkness.

Transition into Stage 5.

==================================================
STAGE 5 — THE 1%
ASSET: assets/5
==================================================

PURPOSE:

Explain the meaning of "1%" as a mindset of financial mastery.

IMPORTANT:

Do NOT present the 1% as luxury, status or material wealth.

OPENING:

"The 1% isn't just about wealth."

Then:

"It's about how you think."

Reveal progressively:

"Learn before you risk."

"Think before you act."

"Control emotion."

"Understand probability."

"Manage risk."

"Play the long game."

Then:

"The difference isn't always more money."

"The difference is better decisions."

FinanceX connection:

"FinanceX is built for people who want to understand before they act."

Final statement:

"Think differently.
Trade intelligently.
Build deliberately."

Transition into Stage 6.

==================================================
STAGE 6 — RISK
ASSET: assets/6
==================================================

PURPOSE:

Introduce risk, uncertainty and trading reality.

OPENING:

"Every opportunity has risk."

As the visual becomes more volatile:

"Markets don't guarantee outcomes."

"Predictions can fail."

"Emotions can distort decisions."

Then reveal:

"The goal isn't to eliminate risk."

"The goal is to understand it."

Then introduce:

RISK MANAGEMENT

"Know what you can lose."

"Know why you're entering."

"Know when to step away."

FinanceX connection:

"Learn to read markets."

"Understand risk."

"Make informed decisions."

Final statement:

"Risk isn't the enemy."

"Unmanaged risk is."

Transition into Stage 7.

==================================================
STAGE 7 — PRINCIPLES OF MASTERY
ASSET: assets/7
==================================================

PURPOSE:

Finish the cinematic journey by introducing the principles required for financial and trading mastery.

The XAUUSD-inspired chart should remain as the primary background.

Do NOT overload the screen.

Reveal one principle at a time.

01
PATIENCE

"Good decisions rarely require urgency."

02
DISCIPLINE

"Follow the plan, not the emotion."

03
FOCUS

"Know what matters. Ignore the noise."

04
CONSISTENCY

"Small disciplined actions compound."

05
RISK MANAGEMENT

"Protect capital before chasing returns."

06
MINDSET

"Your decisions shape your financial future."

After all principles:

"Master the principles."

Then:

"Understand the market."

Then:

"Build your financial future with FinanceX."

==================================================
FINAL FINANCEX CTA
==================================================

After Stage 7 completes, transition smoothly into the existing FinanceX CTA section.

Do not create a new unrelated CTA design.

Use the existing FinanceX design system.

Suggested content:

"Your financial journey starts with understanding."

Supporting text:

"Learn finance. Understand markets. Build better decisions."

Primary:

"Get Started"

Secondary:

"Sign In"

Use the EXISTING authentication routes.

==================================================
TEXT SCROLL BEHAVIOR
==================================================

IMPORTANT:

Text must be synchronized with the frame sequence.

Do NOT display every paragraph simultaneously.

Divide every stage into scroll progress ranges.

Example:

0–20%
→ opening statement

20–40%
→ explanation

40–60%
→ key concept

60–80%
→ FinanceX connection

80–100%
→ transition statement

Use smooth:

opacity
translateY
scale
blur

transitions.

Text should enter and leave naturally.

When scrolling backward, all text animations must reverse naturally.

==================================================
CONTENT DESIGN RULE
==================================================

Every visual stage must answer at least one question:

STAGE 1:
Why should I care about finance?

STAGE 2:
Where did money come from and how did it evolve?

STAGE 3:
What is financial freedom?

STAGE 4:
What should my relationship with money be?

STAGE 5:
What does the "1%" mindset actually mean?

STAGE 6:
Why does risk matter?

STAGE 7:
What principles lead to financial mastery?

The visitor should finish the sequence feeling that they have learned something meaningful.

==================================================
NO EMPTY SECTIONS
==================================================

There must be NO blank content areas between:

assets/1 → assets/2
assets/2 → assets/3
assets/3 → assets/4
assets/4 → assets/5
assets/5 → assets/6
assets/6 → assets/7

Each transition must contain:

visual movement
+
meaningful text
+
scroll interaction
+
narrative progression.

The result should feel like an interactive financial documentary.

# FINAL IMPLEMENTATION RULE

PRESERVE THE EXISTING FINANCEX WEBSITE.

MODIFY THE LANDING-PAGE STORY.

DO NOT REBUILD THE FINANCEX PRODUCT.

The existing header, footer, infinity-scroll, boot animation, authentication, routing, theme system and finalized components remain the foundation.

The new cinematic frame sequences and scroll-driven storytelling are an additional visual/content layer integrated into that foundation.