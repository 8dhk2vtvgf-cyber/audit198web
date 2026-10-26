/**
 * AUDIT198 language behaviour
 * - audit198.com / www → Slovak by default
 * - GitHub Pages / localhost → Slovak by default
 * - Top switcher toggles SK | EN on the same host (?lang=)
 * - Overrides: ?lang=sk|en, path /sk or /en, localStorage (only when host has no preference)
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

  function langFromPath() {
    var path = window.location.pathname || "";
    if (/\/sk(?:\/|$)/i.test(path)) return "sk";
    if (/\/en(?:\/|$)/i.test(path)) return "en";
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
    // Production .com (and www) always prefer Slovak as the primary language.
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

  function resolveLang() {
    // Explicit URL overrides win (switcher + testing on GitHub Pages).
    return (
      langFromQuery() ||
      langFromPath() ||
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
    var url = new URL(window.location.href);
    url.searchParams.set("lang", targetLang);
    return url.pathname + url.search + url.hash;
  }

  function wireSwitcher() {
    document.querySelectorAll(".lang-switch a[data-set-lang]").forEach(function (link) {
      var targetLang = link.getAttribute("data-set-lang");
      link.setAttribute("href", switchHref(targetLang));
      link.addEventListener("click", function (event) {
        event.preventDefault();
        persistLang(targetLang);
        applyLang(targetLang);
        var url = new URL(window.location.href);
        url.searchParams.set("lang", targetLang);
        window.history.replaceState({}, "", url.pathname + url.search + url.hash);
        link.blur();
      });
    });
  }

  var lang = resolveLang();
  applyLang(lang);
  if (langFromHost() && !langFromQuery() && !langFromPath()) persistLang(lang);
  wireSwitcher();
})();
