# AUDIT198 website

Clean static site for **AUDIT198 s. r. o.** (audit and advisory), hosted on **GitHub Pages**.

Live preview (after Pages builds from `main`):  
https://8dhk2vtvgf-cyber.github.io/audit198web/

Production domain (planned): **`audit198.com`** only. The `audit198.sk` domain is being dropped to save cost.

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080/ (Slovak by default) or `?lang=en`.

## Languages

Primary language is **Slovak**. English is available via the top **SK | EN** switcher (`?lang=en`).

| Host | Default language |
|------|------------------|
| `audit198.com` / `www.audit198.com` | Slovak |
| GitHub Pages / localhost | Slovak |

Overrides: `?lang=sk` / `?lang=en`, or path segments `/sk` / `/en`.  
Language switching stays on the same host (no `.sk` domain redirect).

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
index.html      # single-page bilingual site
css/styles.css  # shared styles
js/lang.js      # language / query behaviour
assets/         # logo, hero, portrait
```
