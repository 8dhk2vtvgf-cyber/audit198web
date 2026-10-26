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

## Custom domain (later — do not change DNS until ready)

When the Pages deploy looks correct:

1. In the repo Pages settings, set custom domain e.g. `www.audit198.com`.
2. At the DNS provider (Websupport), point **`audit198.com`** at GitHub Pages, for example:
   - **A** records for apex `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** for `www` → `8dhk2vtvgf-cyber.github.io`
3. Wait for DNS + GitHub HTTPS certificate.
4. Only then cancel Websupport Website Builder (next billed period cited around late December 2026).
5. Let the `audit198.sk` registration lapse (or cancel renewal) once you no longer need it — no site dependency remains.

Keep domain registration at Websupport (or elsewhere); Pages only replaces the website hosting.

## Structure

```
index.html      # single-page bilingual site
css/styles.css  # shared styles
js/lang.js      # language / query behaviour
assets/         # logo, hero, portrait
```
