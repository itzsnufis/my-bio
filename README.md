<<<<<<< HEAD
yo ig idk to put in the readme lol
=======
# itzsnufis — bio

Four hand-written HTML pages, one SCSS stylesheet and a small vanilla JS layer.
No framework, no bundler, no analytics, no cookie banner.

## Pages

| file | contents |
| --- | --- |
| `index.html` | hero, toolkit snapshot, what is currently on the bench |
| `about.html` | the hardware story, off-the-clock, environment & habits, what is still busted |
| `projects.html` | deep dives: custom OS, hand-built phone, Raspberry Pi bench, backend tooling |
| `stack.html` | core, low-level, web and tooling — levels instead of percentage bars |

## Layout

```
index.html  about.html  projects.html  stack.html
assets/
  css/main.css        built output, checked in on purpose
  js/main.js          reveal, copy buttons, clock, terminal overlay
  scss/
    _tokens.scss      design tokens as CSS custom properties
    _base.scss        reset, typography, utilities
    _layout.scss      topbar, wrap, section heads, grids, footer
    _components.scss  panel, kv, tags, kicker, link rows, buttons
    _pages.scss       hero, timeline, skill sets, deep dives, terminal
    main.scss         entry point, defines the `@use` order
  favicon.svg         terminal caret, amber on #0c0e11
build.sh
```

## Building the CSS

Only `sass` (Dart-Sass) is required — no Node, no npm, no config file.

```sh
./build.sh          # expanded, readable (default)
./build.sh --min    # compressed, for deploying
```

`assets/css/main.css` is checked in, so the site runs without a build step.

## Running it locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Terminal overlay

`ctrl`/`⌘` + `K`, or the button in the topbar, opens a small shell:
`help`, `whoami`, `ls`, `cd <page>`, `goto`, `status`, `stack`, `uname`,
`date`, `echo`, `clear`, `exit`. History with `↑`/`↓`, `ctrl+L` clears,
`Esc` or a click outside closes. The routes are read from the active nav,
so they cannot drift away from the real pages.

## Design notes

- three background layers on `body`: a soft vignette at the top, a 34px dot
  grid, and a faint SVG grain — texture without gradients on the text
- every rule is 1px, corner radius stays at 3px, panels get one inner
  highlight and one soft drop shadow
- amber `#dfae72` is the only accent; green and orange mean *running* and
  *running late*, nothing else
- section headings are a title plus a dashed leader, with an optional mono
  line underneath. No numbering, no progress bars, no percentages

## Markup notes

- semantic HTML5: `header`/`nav`/`main`/`section`/`article`/`aside`/`footer`
- one `h1` per page, no skipped heading levels, no duplicate ids
- `aria-current="page"` in the nav, skip link at the top of every page
- usable without JavaScript: everything is visible, only the reveal
  animation, copy buttons, clock and terminal overlay are missing
- no inline styles, no trackers; the only external request is the font
  stylesheet, with system font fallbacks if it never arrives
- there are no comments in the markup, styles or script: names are meant to
  carry the meaning, and anything that needs explaining lives in this file
>>>>>>> cc72046 (fixed some stuff lol)
