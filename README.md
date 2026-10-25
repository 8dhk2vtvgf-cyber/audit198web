# AUDIT198 website

Clean static site for **AUDIT198 s. r. o.** (audit and advisory), hosted on **GitHub Pages**.

Live preview (after Pages builds from `main`):  
https://8dhk2vtvgf-cyber.github.io/audit198web/

Production domains (DNS not switched yet): `audit198.com`, `audit198.sk`.

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080/?lang=sk or `?lang=en`.

## Languages

| Host | Default language |
|------|------------------|
| `audit198.sk` / `www.audit198.sk` | Slovak |
| `audit198.com` / `www.audit198.com` | English |
| GitHub Pages / localhost | English |

Overrides for testing: `?lang=sk` / `?lang=en`, or path segments `/sk` / `/en`.  
Top-right **SK | EN** switcher matches the previous live site behaviour. On custom domains, the switcher prefers the matching hostname.

Email `office@audit198.com` is on **Proton Mail** (independent of Websupport hosting).

## GitHub Pages

Repo Settings → Pages:

- Source: **Deploy from a branch**
- Branch: **`main`** / folder **`/` (root)**

No build step. After merge to `main`, the site is served from the repository root.

## Custom domains (later — do not change DNS until ready)

When the Pages deploy looks correct:

1. In the repo Pages settings, set custom domain(s), e.g. `www.audit198.com` (and optionally `audit198.sk`).
2. At the DNS provider (Websupport), point the domains at GitHub Pages, for example:
   - **A** records for apex `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** for `www` → `8dhk2vtvgf-cyber.github.io`
3. Wait for DNS + GitHub HTTPS certificate.
4. Only then cancel Websupport Website Builder (next billed period cited around late December 2026).

Keep domain registration at Websupport (or elsewhere); Pages only replaces the website hosting.

## Structure

```
index.html      # single-page bilingual site
css/styles.css  # shared styles
js/lang.js      # hostname / query / path language behaviour
assets/         # logo, hero, portrait
```
