# 3KG website alignment review — 28 October 2026

**Reference correction / second pass:** The full website prototype was subsequently identified at [new.threekg.com/preview/](https://new.threekg.com/preview/), including the newer `integration/ui-effects-wave-1` branch. The first pass below used the profile and symbol interaction study. See [the corrected component and content comparison](prototype-content-comparison.md) for the client wall and portfolio grid now applied to the local preview. The earlier alternating card arrangement has been replaced at the user's request with the referenced square grid.

This local branch retains Mustafa's page structure, paper and ink palette, dot field, alternating project imagery, service motion and restrained typography. It aligns navigation and content with the approved **3KG Company Profile 2026, Audit 02 R02.1**, and the **26 October 2026 animation handoff**. It has not been pushed or published.

## Comparison and resulting behavior

| Area | Mustafa's original site | Profile / prototype reference | Local revision |
| --- | --- | --- | --- |
| Studio positioning | “We build quiet, confident work…”; independent studio / 2021 claims | “Strategy first. Impact always.” and the studio approach paragraph | Uses the source statement and source paragraphs; removes unsupported founding-year claims |
| Navigation | Index, Showreel, Work, Clients, Studio, Contact | Studio, Brand, Design, Campaigns, Production, Tech, Xperience, Selected Work | Eight named categories and matching symbols; category links filter real samples |
| Prototype interaction | A standalone Work symbol and scroll-morphing service graphic | Expanding horizontal labels; a reversible left dock; magnification in dock mode | Adds a desktop symbol strip that docks after 96px and returns below 40px, with 560ms travel and neighboring icon emphasis; mobile uses the full menu |
| Work | Six fictional projects, each linked to `#` | 22 projects across seven work groups | Six initial editorial cards; category filters; all 22 samples; direct links; previous/next navigation within the chosen group |
| Services | Brand identity, Web design, Creative development, Art direction, Production, Motion & interaction | Brand, Design, Campaigns, Production, Tech, Xperience | Corrects labels, scopes and symbol mapping, including the missing Tech square |
| Clients | 15 explicitly fictional tiles | Client list in the current profile | Uses 36 source client entries with supplied industry groups; excludes the five entries whose industry is marked for confirmation |
| Statistics | 48 projects / 30 clients / 11 awards / 5 years | No approved source for these statistics | Removes these claims, including legacy Elementor defaults |
| Logo | Typeset “ThreeKG®” | Supplied original 3KG mark | Original silhouette in the header; interactive CSS extrusion in the hero |
| Reel | A 10-second placeholder labeled as a showreel | Existing 3KG symbol animation | Plays the actual symbol clip and labels it “3KG in motion”; does not imply that it is a finished portfolio reel |
| Contact | `hello@threekg.studio`; empty social links | `threekg.com`; email and phone to confirm | Keeps the supplied domain; removes decorative location labels, invented email and social destinations |
| Accessibility | Menu retained `aria-hidden=true` while open; close control behind the overlay | Production interaction must remain usable | Synchronizes hidden/inert state, supplies an internal close button, traps menu focus, restores focus, supports Escape and reduced motion |

The profile supplies the content, taxonomy, typography and white-paper palette. The website keeps Mustafa's responsive layout and original symbol animation; the profile's fixed 1920×1080 pages are not inserted as page screenshots.

## Content provenance

- The review uses the local `SOURCE/3KG Company Profile 2026 - A02R02.1.html` in the reconciled Illustrator R02 ParagraphText package.
- Project descriptions, metadata and service lists are extracted from that source. Two-page cases are combined by project; scope lists are merged without drafting missing paragraphs.
- ALX's unconfirmed “1,600 pieces of content / 150+ engaged users” output claim is excluded.
- Missing project narratives remain absent. ALX and California Garden currently have text-only sample entries because this source has no corresponding approved artwork placement.
- Artwork comes from the same profile source asset library, exported as bounded WebP derivatives. For pages whose placement remains empty, existing artwork with the matching project identity is used from that library. It is not regenerated with AI. Those selections still need visual approval before release.
- The three project-film links are retained from the source's `PROJECT_VIDEOS` mapping: Tasaheel, Americana Recipes and Americana QSR.
- No public web copy was used to replace internal approved content.

The animation handoff distinguishes the current prototype's **19 / 75%** appearance from later precision-studio controls of **24 / 9%**. This revision preserves Mustafa's existing prototype geometry and 2.3-second hover cycle. It does not claim the older loader video was regenerated to the later control values.

The 3D logo is a browser-rendered shallow extrusion using the exact source alpha silhouette and CSS `preserve-3d`, with pointer-controlled tilt and a static reduced-motion pose. It is not a new logo drawing, a Blender asset or a GLB model.

## WordPress adoption

The theme's CSS, JavaScript and profile artwork match the static preview. An empty front page renders `template-parts/profile-home.php`. An existing front page or saved Elementor layout retains its saved content.

For an existing Elementor page, use the new **3KG — Profile Homepage R02.1** widget on a review page, as the sole full-page widget, to review the aligned version. Existing Elementor widgets retain their editable controls; their defaults have been corrected, but changing defaults does not migrate previously saved page data. The shared header/hero and full profile page must not be inserted twice on one page.

No WordPress database, live installation, hosting configuration or GitHub Pages deployment was changed. PHP files were parsed for syntax; WordPress and Elementor runtime integration still requires a staging installation.

## Verification

- All seven work category filters returned the expected counts: 6 / 1 / 3 / 3 / 1 / 2 / 6.
- All 22 sample dialogs were exercised through previous/next navigation; each displayed its own title and source scope.
- Deep links, dialog close, Escape and focus restoration were exercised in the browser.
- Desktop symbol-strip/dock switching was checked; the eight mobile menu entries fit at 390×844 with no horizontal overflow.
- JavaScript syntax checks pass; all referenced project files exist; all ten PHP files parse; static/theme assets match.
- Browser console errors were checked. Screenshots and detailed check outputs are retained with the local review deliverables.

## Remaining editorial decisions

1. Confirm the actual contact email, phone and social destinations.
2. Supply or approve the finished portfolio showreel.
3. Supply ALX and California Garden artwork; review the selections reused from the source library for still-empty profile placements.
4. Choose whether to move the symbols from the prototype appearance to the later 24 / 9% precision setting.
5. Review this local version before any publication of previously unpublished content or artwork.

## Profile typography and floating service sequence — 28 October 2026

The local review now uses the profile's original self-hosted Instrument Sans (400, 500, 600) on white paper. Font licenses are included under `assets/fonts/`. This supersedes the earlier decision to keep Inter Tight. The live clock, Cairo labels in the header/hero/footer, decorative section indices and service numbering have been removed. Factual project copy and metadata are unchanged.

The six service items are floating titles with their small original symbols, without rectangular cards, fills or borders. Each title links directly to its discipline's sample filter. The complete approved scope list is visible beneath each title and appears with it. The large original eight-strand morph remains the progress indicator: it drives the title and scope lines through each transition, then settles on the completed symbol before moving to the next discipline. Earlier titles stay visible. Scrolling backwards reverses the progression. Short viewports use a flowing sequence with the indicator pinned beside or above the service copy; reduced-motion preferences receive all six service blocks in normal flow.

All 43 authentic marks from the profile's logo library are now present in the client wall, including separate Savola, Ganna and Rawaby marks and the additional AFIED, Kashat, Monka, Pepper and Tamam marks. Logo provenance is recorded in `docs/client-logo-sources.json`; no text placeholders or generated logos are used. Project overlays use the same original marks where a corresponding source exists.

Shared files, font files and the homepage template are synchronized to the WordPress theme. Saved Elementor content still requires selecting the Profile Homepage widget to adopt this layout. These changes are a local review and have not been pushed or deployed.

### Invisible client grid

The client wall uses borderless, transparent square hit areas. Individually tuned width and height limits balance each wordmark, emblem and stacked lockup; small measured center offsets compensate for uneven visual weight. All original artwork is preserved. The transparent white Giza Systems mark is rendered black through CSS so it remains visible on white. `docs/client-optical-sizes.json` records the individual settings. The colored square and client information appear only on hover, keyboard focus or tap.

### Original client colors and full service copy

The wall now uses 22 additional original logo variants from the prototype asset library and the official Kashat and Masr360 sites. Original monochrome master marks remain where that is the supplied identity. No grayscale treatment is applied to color artwork. SVG viewBoxes remove empty margins while preserving the source PNG bytes and colors. Sources and hashes are in `docs/client-color-sources.json`. The approved English AMAN identity remains in its branding project overlay; the client wall uses the corporate color mark.

Each of the six service blocks now displays all of its scope items from the approved profile (41 items total). The title, small symbol and copy build progressively with the large indicator; the final line finishes when the symbol completes. The open typography and borderless layout are preserved. On phone screens the blocks flow down the page beneath the sticky indicator so the copy remains readable.

### Magnetic completion and line-by-line copy

The services sequence now settles to a fully formed symbol after scrolling pauses. A short eased scroll finishes the current transition in the direction of travel; reversing finishes on the preceding symbol. Completed stops remain open at both ends so ordinary scrolling can leave the section. New wheel, pointer, touch, keyboard or click input cancels a running settle animation. Reduced-motion mode retains the static, fully readable service blocks.

The service title and scope lines scrub with the morph itself. Lines appear in order from the start of the transition, with the final line finishing at the symbol endpoint. Reverse scrolling unwinds the same progression. Opacity and position derive directly from morph progress, rather than independent time-based CSS delays. Mobile stops are ordered so each symbol finishes before the next transition begins, including neighbours in the same row.

### Slower weighted drift

Magnetic settling now lasts 1.05–1.5 seconds, with a trailing visual response that gently decelerates into the completed pose. The symbol and all service text use one shared visual phase, including reverse playback, so the line reveal inherits the same slower finish. The response uses elapsed time rather than a fixed per-frame increment. Reduced-motion mode and off-screen sections render directly without the trailing animation; new scroll input still takes priority over settling.
