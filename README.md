# mateosusic.github.io

Personal CV and portfolio website of **Mateo Sušić** — program, project and operations professional in San Antonio, Texas.

Live site: **https://mateosusic.github.io/**

A lightweight static site (HTML + CSS + a little vanilla JS). No build step, no framework, no paid services.

Design: black and white, Japanese-inspired minimalism, set entirely in **Lato**. The home page fits on one screen: the left column holds name, portrait and menu; the right side shows one section at a time. Switch sections with the menu, the ← → buttons, or the keyboard arrow keys. Each section has its own link (`/#about`, `/#experience`, `/#background`, `/#contact`). On phones the menu sits on top and long sections can scroll.

## Structure

```
/
├── index.html            Home: intro, about, experience, background, contact (one panel each)
├── cv.html               CV page — shows the PDF in the browser + download button
├── style.css             All styling (colors and fonts are set at the top in :root)
├── script.js             Section switching (menu, ← → buttons, keyboard)
├── favicon.svg
├── .nojekyll             Tells GitHub Pages to serve files as-is
└── assets/
    ├── portrait.jpg              Portrait (4:5, ~500×600 px is enough)
    ├── Mateo-Susic-CV.pdf        The CV that is shown and downloaded
    └── fonts/                    Self-hosted Lato (SIL Open Font License)
```

## Updating content

| What | Where |
|---|---|
| Headline, about text, experience, background, contact | `index.html` — each panel is clearly commented (`00 Intro` … `04 Contact`) |
| CV (e.g. the InDesign version) | Replace `assets/Mateo-Susic-CV.pdf` with a file of the **same name**. `cv.html` and every "Download CV" button update automatically. |
| Portrait | Replace `assets/portrait.jpg` (keep the name; a 4:5 crop, under ~200 KB). It is shown in black and white automatically. |
| Colors / font | Variables at the top of `style.css` (`--white`, `--black`, `--dim`, `--hair`, `--font`). |
| Links | LinkedIn and GitHub URLs appear in `index.html` (hero and contact section). |

Tip: on GitHub you can edit any file in the browser (pencil icon) or drag a new file onto **Add file → Upload files** to replace the CV or portrait.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

This repository is named `mateosusic.github.io`, so it is published at the root URL.

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source: Deploy from a branch**.
3. Choose **Branch: `main`** and folder **`/ (root)`**, then **Save**.
4. After a minute or two the site is live at **https://mateosusic.github.io/**. Every push to `main` redeploys automatically.

## Accessibility & performance notes

- Semantic landmarks, skip link, visible focus states, descriptive link labels.
- Text colors meet WCAG AA contrast on the off-white background.
- Respects `prefers-reduced-motion` (no transitions).
- Without JavaScript, all sections simply stack on one page.
- The font is self-hosted with `font-display: swap`; no third-party requests.
