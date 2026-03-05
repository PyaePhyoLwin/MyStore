# Developer App Hub (Static)

A modern, minimal portfolio + app distribution hub for a solo developer.

## Project structure

```
/
├── index.html
├── app.html
├── security.html
├── privacy.html
├── terms.html
├── styles.css
├── app.js
├── data/
│   ├── apps.json
│   └── downloads.json
├── assets/
└── downloads/   (placeholder folder for local files)
```

## Features

- Portfolio sections: About, Skills, Featured Projects.
- Apps hub with search and filters (platform, category, free/paid).
- App detail page (`app.html?id=<app-id>`) with:
  - Install buttons for Android, iOS, Desktop, Web.
  - OS-based recommendation highlight.
  - Release notes modal.
  - Safety section (signing/checksum/update policy).
  - Latest and older versions per platform from `downloads.json`.
  - Copy SHA256 buttons.
  - Show/hide older versions.
- Accessible and responsive layout.
- Privacy, Terms, and Security pages.
- Contact form using `mailto:` only.

## Local preview

Because data is loaded via `fetch`, run a local server (not direct `file://`):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

> Fallback mode: if JSON `fetch` is blocked (for example opening HTML directly with `file://`), the site uses built-in sample data so the UI still renders.

## Data files

### `data/apps.json`
Contains per-app metadata:

- `id`, `name`, `tagline`, `description`, `category`, `pricing`
- `platforms`: `webUrl`, `androidApkUrl`, `iosUrl`, `windowsUrl`, `macUrl`
- `version`, `releaseDate`, `changelog[]`, `sha256{}`, `screenshots[]`

### `data/downloads.json`
Contains release assets by app and platform:

- `latest`: file metadata + URL
- `older[]`: previous version assets

Each asset can include:
- `fileName`, `size`, `sha256`, `releaseDate`, `notes`, `url`

## Hosting on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your branch), root (`/`)
4. Save and wait for deployment.
5. Your site will be available at:
   - `https://<username>.github.io/<repo>/`

## Hosting on Cloudflare Pages

1. In Cloudflare dashboard, open **Pages → Create a project**.
2. Connect your Git repository.
3. Configure build settings:
   - **Framework preset**: None
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/`
4. Deploy.
5. Cloudflare gives a default `*.pages.dev` URL; add custom domain if needed.

## Handling large download files

For large binaries, avoid storing installers directly in git history.

Recommended:
1. Upload binaries to **GitHub Releases** (or another artifact/CDN host).
2. Copy release asset URLs.
3. Update links in:
   - `data/apps.json` platform URLs
   - `data/downloads.json` `url` fields for latest/older assets
4. Keep checksums (`sha256`) in JSON so users can verify integrity.

## Placeholder folders

- `assets/`: place screenshots and branding assets.
- `downloads/`: optional local placeholder for downloadable files during development.

Before production, replace placeholder names, bios, links, email, legal text, and app store URLs.
