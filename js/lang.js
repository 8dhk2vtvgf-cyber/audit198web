/**
 * AUDIT198 language behaviour
 * - `/` and `/sk/` → Slovak (canonical SK URL is `/`)
 * - `/en/` → English
 * - Top switcher navigates to real paths (`/` vs `/en/`)
 * - Legacy `?lang=sk|en` redirects to those paths
 * - localStorage remembers last choice only when no path/host preference applies
 *
 * Note: audit198.sk is being dropped; no cross-domain language switching.
 */
(function () {
  var STORAGE_KEY = "audit198-lang";
  var PRIMARY_HOSTS = ["audit198.com", "www.audit198.com"];

  function normalizeLang(value) {
    if (!value) return null;
    value = String(value).toLowerCase();
    if (value === "sk" || value.indexOf("sk") === 0) return "sk";
    if (value === "en" || value.indexOf("en") === 0) return "en";
    return null;
  }

  function siteBase() {
    var path = window.location.pathname || "/";
    var match = path.match(/^(.*?\/audit198web)(?:\/|$)/i);
    return match ? match[1] : "";
  }

  function langFromPath() {
    var path = window.location.pathname || "";
    var base = siteBase();
    var rest = path.slice(base.length) || "/";
    if (/^\/en(?:\/|$)/i.test(rest)) return "en";
    if (/^\/sk(?:\/|$)/i.test(rest)) return "sk";
    return null;
  }

  function langFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      return normalizeLang(params.get("lang"));
    } catch (e) {
      return null;
    }
  }

  function langFromHost() {
    var host = (window.location.hostname || "").toLowerCase();
    if (PRIMARY_HOSTS.indexOf(host) !== -1) return "sk";
    return null;
  }

  function langFromStorage() {
    try {
      return normalizeLang(window.localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  function langPath(lang) {
    var base = siteBase();
    if (lang === "en") return base + "/en/";
    // Canonical Slovak URL is `/` ( `/sk/` also works and shares the same content).
    return base + "/";
  }

  function resolveLang() {
    return (
      langFromPath() ||
      langFromQuery() ||
      langFromHost() ||
      langFromStorage() ||
      "sk"
    );
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);

    var titles = {
      sk: "Audit grantových programov a CFS | AUDIT198 s.r.o.",
      en: "Grant Programme Audits and CFS | AUDIT198 s.r.o.",
    };
    if (titles[lang]) document.title = titles[lang];

    var descriptions = {
      sk:
        "Audit grantových programov a Certificate on Financial Statements (CFS) podľa ISRS 4400. Skúsenosti s Horizon Europe, H2020 a ďalšími EÚ grantmi. Bezplatná konzultácia.",
      en:
        "Grant programme audits and Certificate on Financial Statements (CFS) under ISRS 4400. Experience with Horizon Europe, H2020 and other EU grants. Free consultation.",
    };
    var meta = document.querySelector('meta[name="description"]');
    if (meta && descriptions[lang]) meta.setAttribute("content", descriptions[lang]);

    document.querySelectorAll(".lang-switch a[data-set-lang]").forEach(function (link) {
      var linkLang = link.getAttribute("data-set-lang");
      if (linkLang === lang) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function persistLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function switchHref(targetLang) {
    return langPath(targetLang) + (window.location.hash || "");
  }

  function wireSwitcher() {
    document.querySelectorAll(".lang-switch a[data-set-lang]").forEach(function (link) {
      var targetLang = link.getAttribute("data-set-lang");
      link.setAttribute("href", switchHref(targetLang));
      link.addEventListener("click", function () {
        persistLang(targetLang);
        // Allow full navigation to `/` or `/en/` so crawlers and users share stable URLs.
      });
    });
  }

  // Migrate legacy `?lang=` to path URLs (keep hash).
  var queryLang = langFromQuery();
  if (queryLang && !langFromPath()) {
    try {
      var dest = langPath(queryLang) + (window.location.hash || "");
      var here = window.location.pathname + (window.location.hash || "");
      if (dest !== here && dest !== window.location.pathname + "/" + (window.location.hash || "")) {
        window.location.replace(dest);
        return;
      }
    } catch (e) {
      /* fall through */
    }
  }

  var lang = resolveLang();
  applyLang(lang);
  if (langFromPath() || (langFromHost() && !langFromQuery())) persistLang(lang);
  wireSwitcher();
})();
