---
name: Overture Studios
description: Blacklight door stamp for a Toronto DJ and production studio. stamp ink on a Pure black ground, lit by a torch.
colors:
  ground: "#000000"
  ground-2: "#0b0b0b"
  ground-3: "#161616"
  ink: "#f2f2f2"
  ink-dim: "#a6a6a6"
  ink-faint: "#3a3a3a"
  lit: "#ffffff"
  red: "#ff3b3b"
  red-ink: "#ff6b6b"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(5.5rem, 21.5vw, 22rem)"
    fontWeight: 900
    lineHeight: 0.78
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 10.5vw, 9.5rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  headline-sm:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.8rem, 7.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)"
    fontWeight: 900
    lineHeight: 0.9
  statement:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 5.6vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 75"
  lede:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1rem + .8vw, 1.6rem)"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1rem, .96rem + .2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 125"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.88em"
    fontWeight: 400
    letterSpacing: "-0.01em"
    fontFeature: "'tnum'"
  figure:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "clamp(1.8rem, 3vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.04em"
rounded:
  none: "0px"
spacing:
  space-1: "0.5rem"
  space-2: "1rem"
  space-3: "1.5rem"
  space-4: "2.5rem"
  space-5: "4rem"
  space-6: "clamp(5rem, 11vw, 10rem)"
  gutter: "clamp(1rem, 4vw, 3.5rem)"
components:
  button-book:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.5rem 0.8rem"
    height: "3.25rem"
  button-book-hover:
    backgroundColor: "{colors.red-ink}"
    textColor: "{colors.ground}"
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.5rem 0.8rem"
    height: "3.25rem"
  button-solid-hover:
    backgroundColor: "{colors.lit}"
    textColor: "{colors.ground}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.5rem 0.8rem"
    height: "3.25rem"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  ticket:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.1rem 1.25rem 1.25rem"
  ticket-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  input-field:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.lit}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.9rem 0.9rem 0.8rem"
  input-field-focus:
    backgroundColor: "{colors.ground-3}"
    textColor: "{colors.lit}"
  nav-link:
    textColor: "{colors.ink-dim}"
    typography: "{typography.label}"
    padding: "0.5rem 0"
  nav-link-active:
    textColor: "{colors.lit}"
  perk-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.6rem"
---

# Design System: Overture Studios

## Overview

**Creative North Star: "The Blacklight Door Stamp"**

The site is the dark room at the door of a warehouse party, and the visitor holds the UV torch. Everything is printed in one white stamp ink on a pure black ground, and it turns into the real thing (hot white type, full-colour photographs) only where the light falls. One gesture drives every reveal: the pointer is the torch on desktop; on touch and when idle, the beam sweeps the room by itself.

The material is cheap club print: rubber-stamped condensed display type pushed through an SVG ink-bleed filter, two-tone Bayer-dithered photo prints, dashed perforations, stamp-edged rules, a fixed film-grain overlay. Density is low and loud: huge stamps, long ruled lists, typographic sections instead of card grids. Proof is literal: gear lists in mono, capacities as two-digit figures, membership hour bars whose length is the exact number of hours.

The world refuses the stock club template: full-bleed video, a centred headline, and a grid of cards.

**Key Characteristics:**
- One ink colour for all printed matter; white only where the light lands; red only for booking and live state.
- Every photo is a UV plate: dithered ink print on top, colour underneath, revealed by the beam.
- Stamped Big Shoulders Black, always through an ink filter.
- Square, ruled, perforated: no radius, no cards, no drop shadows.
- Motion is a stamp (fast in, thud) or a glow (light passing), never a float.

## Colors

A single white ink family on pure black, with one red reserved for the action of booking.

### Primary
- **Stamp White** (#f2f2f2): all printed matter at rest: stamps, body text, outline buttons, solid rules, the tonal fill of hour bars, ticket hover fill. The colour the whole site is "printed" in.

### Secondary
- **Hot White** (#ffffff): ink that has been lit. Hero stamps, ledes, prices and figures, the hovered or current state of links and stamps, typed input text, solid-button hover. It means "the light is on this".

### Tertiary
- **Door Red** (#ff3b3b): the booking action and live state only. Solid Book buttons, the current-page underline in the nav, the current page in the mobile drawer, field error borders.
- **Red Ink** (#ff6b6b): hover for the red solid button, and error message text.

### Neutral
- **Blacklight Ground** (#000000): page background, text on solid buttons and tickets, scrim colour over hero photos.
- **Raised Ground** (#0b0b0b): tickets, form fields, footer.
- **Pressed Ground** (#161616): focused form field.
- **Faded Ink** (#a6a6a6): secondary text, descriptions, captions, nav links at rest, field labels, footer meta.
- **Ghost Ink** (#3a3a3a): rules, dashed perforations, outline borders, the hour-bar empty cells, scrollbar thumb, the outlined footer wordmark, and the unlit state of the manifesto words before the light reaches them.

### Named Rules
**The One Ink Rule.** All printed matter is Stamp White or one of its two tints. No second hue for type, rules or fills.

**The Light Means Lit Rule.** Hot White is a state, not a decoration: it marks what the light (or the pointer, or focus) is on, plus the few elements that are always under the light (hero stamp, ledes, figures).

**The Door Red Rule.** Red is booking and live state. If it is not a Book action, a current-page mark, or an error, it is not red.

## Typography

**Display Font:** Big Shoulders, variable 100 to 900, used at 900 (with Arial Narrow, sans-serif)
**Body Font:** Archivo, variable weight 400 to 800 and width 62 to 125% (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono 400 (with ui-monospace, monospace)

**Character:** A rubber-stamped condensed black display face over a working grotesk that changes width by role: compressed (75%) for the manifesto statement, normal for reading, expanded (112 to 125%) for uppercase labels and buttons. Mono is reserved for data.

### Hierarchy
- **Display** (900, clamp(5.5rem, 21.5vw, 22rem), 0.78): the full-width hero stamp, letter by letter. Inner-page heads use a smaller wrapping variant (clamp(4rem, 13vw, 13rem)).
- **Headline** (900, clamp(3.4rem, 10.5vw, 9.5rem), 0.86): section heads. A smaller step (clamp(2.8rem, 7.4vw, 6rem)) heads each room on Studios.
- **Title** (900, roughly clamp(1.6rem, 2.6vw, 2.4rem) up to 4.6rem, 0.85 to 0.95): ticket names, room-card and plan names, course and outcome heads, the footer call.
- **Statement** (Archivo 800 at 75% width, clamp(2.1rem, 5.6vw, 5.4rem), 1.02): the manifesto, set in grotesk so it reads as speech rather than stamp.
- **Lede** (Archivo 500, clamp(1.15rem, 1rem + .8vw, 1.6rem), 1.4, max 34ch): Hot White intro lines.
- **Body** (Archivo 400, clamp(1rem, .96rem + .2vw, 1.125rem), 1.6, max 65ch).
- **Label** (Archivo 700 to 800, 0.72 to 0.9rem, 0.12 to 0.16em, uppercase, 112 to 125% width): nav, buttons, field labels, footer column heads.
- **Mono** (JetBrains Mono 400, tabular figures): gear specs, capacities, hours, prices. At figure size (clamp(1.8rem, 3vw, 2.6rem), -0.04em) for prices and capacities.

### Named Rules
**The Stamp Rule.** Every solid Big Shoulders setting goes through an ink filter: `#ink` for display and headline sizes, `#ink-mid` for mid-size stamps so counters stay open, `#ink-soft` for small stamps, the wordmark and buttons. The only unfiltered display setting is the outlined footer wordmark.

**The Mono Is Data Rule.** JetBrains Mono appears only for gear, counts, hours and prices. Never for prose, labels or decoration.

## Layout

Content sits in a 1480px max container with a fluid gutter (clamp(1rem, 4vw, 3.5rem)). Sections breathe on a large vertical step (space-6, clamp(5rem, 11vw, 10rem)); tight sections use space-5. Section heads are a two-column grid (1.4fr / 1fr), headline left and a short Faded Ink paragraph aligned to its baseline on the right, collapsing to one column at 860px.

Structure is ruled lists, not cards: plan rows, course rows, the learn index, FAQ and gear specs all stack between 2px rules (Stamp White to open a block, Ghost Ink between rows). Columns divide with 2px dashed perforations. Rooms alternate media left and right on Studios. The rooms rail is a horizontal scroll-snap strip (min(78vw, 820px) columns, 86vw on phones) with square arrow buttons. The hero is a full-viewport grid: stamp centred vertically, lede and actions bottom-left, address meta bottom-right, the ticket strip on the bottom edge (four across, two by two below 860px).

Nav collapses to a full-screen drawer at 960px. Most two-column compositions fall to one column between 720 and 900px.

## Elevation & Depth

The system is flat and tonal. Depth comes from light, not lift: the torch (a screen-blended white radial gradient fixed over the page), glows on hover, and three ground tones (Blacklight, Raised, Pressed). A fixed film-grain layer at 11% opacity sits over everything.

### Shadow Vocabulary
- **Plate glow** (`box-shadow: 0 0 2.5rem -0.25rem color-mix(in srgb, var(--b) 60%, transparent), 0 .5rem 2rem -1rem var(--b)`): button hover, in the button's own colour.
- **Bar glow** (`box-shadow: 0 0 .6rem rgba(150, 120, 255, .6)`): lit hour-bar cells on plan hover.
- **Light up** (`text-shadow: 0 0 .06em rgba(185, 168, 255, .55), 0 0 .5em rgba(120, 90, 255, .35)`): the hero stamp; a softer `0 0 .35em rgba(150, 120, 255, .45)` on lit manifesto words.
- **Scrolled nav rule** (`box-shadow: 0 1px 0 var(--ink-faint)`): a hairline, not a shadow.

### Named Rules
**The Glow Not Lift Rule.** Nothing casts a shadow downward. Emphasis is light emitted in the element's own colour.

## Shapes

Square everywhere (0 radius, set explicitly on inputs). Borders are 2px: solid for plates, buttons and section rules; dashed for perforations between tickets and outcome columns; 1px solid and dotted for spec-list leaders and perk tags. The only curves are cut-outs and light: semicircular notches punched into each ticket's sides with a mask, the circular torch, and the radial mask that reveals colour on a UV plate. Stamps tilt and land (rotation up to a few degrees on entry, -2deg on the "For duos" flag, -1.2deg on the marquee band).

## Components

### Buttons
Stamped plates: square, 2px bordered, expanded uppercase label, run through `#ink-soft`.
- **Shape:** square (0), min height 3.25rem (2.6rem in the nav), padding 0.85rem 1.5rem 0.8rem.
- **Book (primary):** solid Door Red with ground text, always carrying the right-arrow SVG. Used for every Book / Start / Choose action. Hover lifts to Red Ink.
- **Solid:** solid Stamp White with ground text, for form submits. Hover to Hot White.
- **Outline:** transparent with Stamp White border and text, for secondary paths (Plans, Join a plan, Free class). Hover fills with ink.
- **Hover / Focus / Active:** plate glow on hover, arrow nudges 0.25em right; focus is a 2px dashed Hot White outline offset 4px (global); press is scale(.97) rotate(-.5deg), a stamp.

### Chips
- **Perk tag:** 1px Ghost Ink border, Stamp White text, 0.78rem 600. An excluded perk is Faded Ink and struck through.
- **Flag:** "For duos": expanded label in Hot White inside a 1.5px lit border, rotated -2deg and ink-filtered, like a hand stamp.

### Cards / Containers
There are no cards. Containers are ruled rows and UV plates.
- **Corner Style:** square.
- **Background:** Blacklight Ground; Raised Ground for tickets, fields, footer.
- **Shadow Strategy:** none at rest (see Elevation).
- **Border:** 2px rules top and bottom, dashed between columns.

### Inputs / Fields
- **Style:** Raised Ground fill, no box border, 2px Ghost Ink underline, square, Hot White text; labels in Faded Ink expanded uppercase above.
- **Focus:** underline turns Stamp White and the fill deepens to Pressed Ground (native outline removed).
- **Error:** underline turns Door Red; message in Red Ink below, announced politely.
- **Checkbox:** square 2px Faded Ink box, fills Stamp White with a ground tick when checked.
- **Newsletter:** input and solid button butted together with no gap.

### Navigation
Fixed, transparent over the hero; after 24px of scroll it gains a 92% ground fill and a Ghost Ink hairline. Wordmark is the swirl mark (masked, spins 180deg on hover) plus stamped OVERTURE. Links are Faded Ink expanded labels; hover and current go Hot White, and the current page carries a 2px Door Red underline. The Book button sits at the end in red. Below 960px a Menu button opens a full-screen drawer that wipes down (clip-path) with links as staggered ink-filtered stamps; the current page is red.

### UV Plate (signature)
Every photograph. A dithered two-tone ink print (`-ink.png`) at 0.9 opacity (0.42 in heroes) over the colour photo (`.webp`), which is masked to a soft circle of radius clamp(160px, 22vw, 340px) at the beam's position, with a faint white fringe ring screen-blended around it. The beam follows the pointer on desktop and drifts on its own when idle; on touch each plate gets its own slow sweep. Reduced motion lights every plate fully. The learn index uses a beam-borne variant: a colour photo that follows the pointer while a row is hovered.

### Ticket Strip (signature)
The hero's room index: four perforated stubs on Raised Ground, notched on both sides, divided by dashed perforations. Room name as a small stamp, type in Faded Ink, capacity as a two-digit mono figure in Hot White. Hover inverts to a Stamp White fill with ground text.

### Hour Bar (signature)
Twenty cells, one per hour; filled cells equal the plan's exact monthly hours, empty cells are faint Ghost Ink. Cells rise in from the bottom with a 45ms stagger when scrolled into view, and glow Hot White on plan hover.

### Spec List
Gear as mono rows between 1px Ghost Ink rules, with a dotted leader running to the Faded Ink quantity on the right.

### Marquee
A full-width solid Stamp White band, tilted -1.2deg, with ground-coloured stamped phrases separated by the swirl mark, scrolling 32s linear. Decorative and hidden from assistive tech.

## Do's and Don'ts

### Do:
- **Do** ship every photo as a pair: a two-tone Bayer-dithered ink print and the colour original, combined in a UV plate.
- **Do** route every Book action through the solid Door Red button with the arrow, and keep secondary actions as outline plates.
- **Do** set prices, capacities, hours and gear in JetBrains Mono with tabular figures; capacities as two digits (06, 20).
- **Do** draw quantities at their true length: an hour bar has one cell per hour out of twenty.
- **Do** separate content with 2px rules and dashed perforations instead of boxes.
- **Do** let every reveal be the light: stamp-in (ease cubic-bezier(.7, 0, .84, 0)) for type, a beam or scroll-driven glow for photos and words, and give reduced motion a fully lit, static state.

### Don't:
- **Don't** round corners or put content in cards; the only curves are the ticket notches and the beam.
- **Don't** show a colour photo at rest outside the light; colour appears under the beam or as the beam-borne peek.
- **Don't** use red for anything but booking, current page, and errors.
- **Don't** use drop shadows for elevation; emphasis glows in the element's own colour.
- **Don't** set Big Shoulders solid without an ink filter, or set prose in it.
- **Don't** use Ghost Ink for resting text; it is for rules, borders and the unlit state of a reveal that always completes.
- **Don't** build the stock club template: full-bleed video, a centred headline over it, and a grid of cards.

## Revision 2026-11-17: deep space

Display type stays Big Shoulders 900 in stamped caps (a blackletter experiment was tried and reverted at the client's request). The whole site now floats in space: a fixed 2D starfield canvas (`.cosmos`, js/site.js) sits behind every page, parallaxing with scroll, streaking into warp lines on fast scrolls, with an occasional shooting star. Photo plates drift in zero gravity (`zero-g`, 9s, out of phase). Every closer sits on a planet horizon (`.closer::before`, a huge dark sphere with a lit white rim and a faint red dawn line). The ticket strip and footer are translucent so the stars show through. The home first viewport is the chrome 3D logo (js/space.js).

## Revision 2026-11-17: space meets CDJ/DJM

The degraded print look is retired at the client's request. No SVG ink filters remain (`#ink`, `#ink-mid` and `#ink-soft` are gone), so display type is clean Big Shoulders caps. Photo plates are clean grayscale (`<name>-mono.webp` at 0.62 opacity) with the colour photo revealed by the torch, and the film grain is down to 3.5%. Hardware motifs: a CDJ-style waveform deck (`.deck`, canvas, 128 BPM beat grid, red playhead, mono time/BPM/key readouts) under the home intro stamp and every page header; the room strip is a set of DJM channel strips (`CH 1`–`CH 4`, 12-cell LED meters pulsing to the beat, top two cells red); membership hour bars light their 17th to 20th hours red as peak. Where earlier sections of this file mention the stamp filters, dithered `-ink.png` prints or Bayer dither, this revision supersedes them.

## Revision 2026-11-17: rooms as a DJM mixer

On the home page the rooms are a full-width four-channel mixer (`.mixer`, `.ch`). Each channel strip carries a CH label with a red status LED, the room name set vertically, a 12-cell vertical LED meter and a fader whose cap rises when the channel opens. One channel is open at a time (Nova by default): its panel shows the colour photo as a bezelled deck screen with a MAX readout, then the type, a blurb, a mono gear line, and a red Book button (the header button) plus Details. Hover opens a channel only from its strip, after a 140ms dwell and with an 850ms lock, so strips sliding under a still cursor can't chain-open. On screens 800px and narrower every channel stacks open. Red is the only accent colour; room photos keep their natural light. The Studios page keeps the square, near-black card modules (`.tickets .ticket`).

## Revision 2026-11-17: rooms adrift (replaces the mixer on the home page)

The home rooms section is now four colour photos floating loose in the starfield (`.adrift`, `.fr`), placed at staggered sizes and heights (in vw), each drifting on the `zero-g` loop out of phase and scrolling at its own parallax speed (`--sp`, desktop only). Each has CH and MAX readouts on the photo, then name, type, mono gear line, a red Book button and Details. Hovering one room dims and slightly blurs the others; the photos drop in one by one. On screens 800px and narrower they stack at 88% width, alternating left and right. The `.mixer` styles remain in css/site.css but are no longer used.

## Revision 2026-11-17: rooms as a drifting belt (replaces "rooms adrift")

The home rooms section is a full-width band (`.belt`) where room photos drift sideways endlessly (75s loop). Each room appears twice at different sizes and heights; smaller ones are dimmed to read as further away, and every photo bobs on `zero-g`. A slower layer of faint black-and-white studio photos drifts behind (160s). Hovering pauses the front stream. A CDJ-style `.readout` under the band shows the room you point at, tap or focus (Nova by default): CH, name, type, gear, capacity, red Book button and Details. No blur and no panels. With reduced motion it becomes a still, sideways-scrollable strip. The `.adrift` and `.mixer` styles are unused.

- Revision 2026-11-17: manifesto gets a canvas spiral galaxy (white dust, a few red stars) that turns faster as you scroll past, with a red-tailed shooting star on arrival and every 5–11s; Studios / School / Label pillars get square floating photos.
- Revision 2026-11-17: memberships get a red LED kicker ("Studio memberships · Monthly · 4 plans · Cancel any time"), a red "Membership 0N" tag and a square floating room photo per plan; padding against the marquee tightened.
- Revision 2026-11-17: "Learn here" list is a CDJ track browser (TRK 0N + LED + mono meta), rows warp in from the right with a stagger; hover runs a red playhead along the row, wipes the title red and lights the LED.
- Revision 2026-11-17: red on every section (scroll cue, pillar links, red plan CTAs with B2B solid, free-class CTA under the track list, red quote mark, red marquee marks, red Send/Join); swirl mark inline left of the intro wordmark; the closer horizon is now a WebGL greyscale Earth (js/earth.js, self-hosted textures) starting on North America with a pulsing red pin on Toronto, red city lights on the night side, drag to spin, scroll nudges it; CSS horizon stays as the no-WebGL fallback.
- Revision 2026-11-17: inner pages carry the home direction. Page headers: galaxy + glitching memories + red LED kicker (no dim photo plate). All photos are colour with red glow and zero-g drift (uv() emits one colour plate; torch removed). Studios: drifting belt + readout replaces the ticket modules, rooms get CH/Max LED tags. Outcomes get square pillar photos; DJ courses get Level tags; every section carries a red kicker or red CTA; FAQ numbered Q01–Q14 with red LED + playhead line on the open item.
