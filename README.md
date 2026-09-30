# itzsnufis — bio

Four hand-written HTML pages, one SCSS stylesheet and a small vanilla JS layer.
No framework, no bundler, no analytics, no cookie banner.

## Pages

| file | contents |
| --- | --- |
| `index.html` | hero, toolkit snapshot, what is currently on the bench |
| `about.html` | the hardware story, off-the-clock, environment & habits |
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
    _layout.scss      topbar, wrap, grids, hero, footer
    _components.scss  panel, kv, tags, buttons, terminal
    _pages.scss       page-specific blocks: timeline, skillset, deep dives
    main.scss         entry point, defines the `@use` order
  favicon.svg         terminal caret, amber on #0d0f12
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

## Markup notes

- semantic HTML5: `header`/`nav`/`main`/`section`/`article`/`aside`/`footer`
- one `h1` per page, no skipped heading levels, no duplicate ids
- `aria-current="page"` in the nav, skip link at the top of every page
- usable without JavaScript: everything is visible, only the reveal
  animation, copy buttons, clock and terminal overlay are missing
- no inline styles, no trackers; the only external request is the font
  stylesheet, with system font fallbacks if it never arrives
