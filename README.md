# AUDIT198 website

Clean static site for **AUDIT198 s. r. o.** (audit and advisory), hosted on **GitHub Pages**.

Live preview (after Pages builds from `main`):  
https://8dhk2vtvgf-cyber.github.io/audit198web/

Production: **https://www.audit198.com** (`audit198.com` only; `audit198.sk` is being dropped).

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080/ (Slovak) or http://localhost:8080/en/ (English).

## Languages

Primary language is **Slovak** at `/`. English is a real path at **`/en/`** (and `/en`). `/sk/` is also available and canonicalises to `/`.

| URL | Language |
|------|----------|
| `/` | Slovak (default) |
| `/sk/` | Slovak |
| `/en/` | English |

The top **SK \| EN** switcher navigates between `/` and `/en/`. Legacy `?lang=en` / `?lang=sk` redirects to those paths.

Email `office@audit198.com` is on **Proton Mail** (independent of Websupport hosting).

## GitHub Pages

Repo Settings → Pages:

- Source: **Deploy from a branch**
- Branch: **`main`** / folder **`/` (root)**

No build step. After merge to `main`, the site is served from the repository root.

## Custom domain

Primary host: **`www.audit198.com`** (Slovak by default; SK|EN switcher). Apex `audit198.com` should redirect via GitHub Pages once DNS is set.

DNS at Websupport (do **not** change MX / Proton mail records):

- **A** for `@` (apex) → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- **CNAME** for `www` → `8dhk2vtvgf-cyber.github.io`

Repo root `CNAME` file pins the Pages custom domain to `www.audit198.com`. After DNS propagates, enable **Enforce HTTPS** in Pages settings if not already on.

`audit198.sk` is being dropped (no renewal). Website Builder should be cancelled only after `www.audit198.com` serves this site over HTTPS.

## Structure

```
index.html      # Slovak home (`/`)
en/index.html   # English (`/en/`)
sk/index.html   # Slovak alternate (`/sk/`, canonical → `/`)
css/styles.css  # shared styles
js/lang.js      # path-based language switching
assets/         # logo, hero, portrait
```
