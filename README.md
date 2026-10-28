<img src="assets/icon.svg" width="64" height="64" alt="">

# 3KG — Studio Website

Private testing repository for the current 3KG website review.

**Repository:** https://github.com/shabrawyz/threekg-website-testing

This contains the profile-aligned website and portfolio refresh. It is a review environment; no public deployment is configured. The original site and Git history are maintained in [MustafaX3KG/threekg-website](https://github.com/MustafaX3KG/threekg-website).

## Structure
- `index.html` — work cards, studio, services, contact and navigation
- `assets/style.css` — design tokens (`:root` block has colors/fonts)
- `assets/script.js` — canvas dot-field, cursor, hover previews, menu
- `assets/profile-data.js` — source-backed project descriptions, metadata, images and films
- `assets/profile.js` — sample filters, full-page cases, image viewer and direct links
- `assets/profile.css` — navigation, sample dialog and logo treatment
- `assets/profile/` — WebP derivatives from the profile source library
- `assets/icon.svg` — favicon

## Editing
- Keep project cards in `index.html` and records in `assets/profile-data.js` consistent.
- Update content only from approved 3KG sources. Do not add inferred metrics, dates or contact details.
- The WordPress theme contains corresponding assets and a profile homepage template; update both delivery targets together.

## Portfolio resources

[Resource refresh and source register](docs/portfolio-resource-refresh.md): evolving Business Development and Drive references, source-written case chapters, original/working visual status, and on-demand project films.

## Current website review

See [the current website direction](docs/website-direction.md) for the wide film hero, restored About content, locked interactive team photograph and expanded project cases.

## Profile alignment review

This testing option combines the Audit 02 R02.1 profile with the later website direction and portfolio resource refresh. See [the original comparison and adoption notes](docs/profile-alignment.md) for the earlier baseline; the current direction supersedes its logo treatment and condensed case content.
Serve the repository locally with `python3 -m http.server 4173 --bind 127.0.0.1`.
This repository is for review. Publishing a preview is a separate step.

The review includes the client-logo reveal and square portfolio grid
from `new.threekg.com/preview/`; see [the component/content comparison](docs/prototype-content-comparison.md).

The original repository deploys from its own `main` branch. Uploading here does not deploy or modify that site.

Created in [T3 Code](https://t3.codes).
