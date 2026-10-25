/**
 * AUDIT198 language / domain behaviour
 * - audit198.sk → Slovak
 * - audit198.com / www → English
 * - GitHub Pages (and other hosts) → English by default
 * Overrides: ?lang=sk|en, path /sk or /en, localStorage audit198-lang
 */
(function () {
  var STORAGE_KEY = "audit198-lang";
  var SK_HOSTS = ["audit198.sk", "www.audit198.sk"];
  var EN_HOSTS = ["audit198.com", "www.audit198.com"];

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
    if (SK_HOSTS.indexOf(host) !== -1) return "sk";
    if (EN_HOSTS.indexOf(host) !== -1) return "en";
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
    // Explicit URL overrides always win (useful on GitHub Pages preview).
    return (
      langFromQuery() ||
      langFromPath() ||
      langFromHost() ||
      langFromStorage() ||
      "en"
    );
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);

    var titles = {
      sk: "Audítorské a poradenské služby | AUDIT198 s. r. o.",
      en: "Audit and advisory services | AUDIT198 s. r. o.",
    };
    if (titles[lang]) document.title = titles[lang];

    var descriptions = {
      sk:
        "Štatutárny audit, audítorské a poradenské služby, audit EÚ grantov. AUDIT198 s. r. o., Bratislava.",
      en:
        "Statutory audit, audit and advisory services, EU grant audits. AUDIT198 s. r. o., Bratislava.",
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
    var host = (window.location.hostname || "").toLowerCase();
    var onCustom =
      SK_HOSTS.indexOf(host) !== -1 || EN_HOSTS.indexOf(host) !== -1;

    // On production domains, prefer the matching hostname when available.
    if (onCustom) {
      if (targetLang === "sk" && EN_HOSTS.indexOf(host) !== -1) {
        return "https://www.audit198.sk/";
      }
      if (targetLang === "en" && SK_HOSTS.indexOf(host) !== -1) {
        return "https://www.audit198.com/";
      }
    }

    var url = new URL(window.location.href);
    url.searchParams.set("lang", targetLang);
    return url.pathname + url.search + url.hash;
  }

  function wireSwitcher() {
    document.querySelectorAll(".lang-switch a[data-set-lang]").forEach(function (link) {
      var targetLang = link.getAttribute("data-set-lang");
      link.setAttribute("href", switchHref(targetLang));
      link.addEventListener("click", function (event) {
        var host = (window.location.hostname || "").toLowerCase();
        var crossing =
          (targetLang === "sk" && EN_HOSTS.indexOf(host) !== -1) ||
          (targetLang === "en" && SK_HOSTS.indexOf(host) !== -1);

        persistLang(targetLang);

        // Same-host preview: apply without full navigation reload if possible.
        if (!crossing) {
          event.preventDefault();
          applyLang(targetLang);
          var url = new URL(window.location.href);
          url.searchParams.set("lang", targetLang);
          window.history.replaceState({}, "", url.pathname + url.search + url.hash);
          link.blur();
        }
      });
    });
  }

  var lang = resolveLang();
  applyLang(lang);
  // Persist host-derived language so switcher stays consistent on github.io.
  if (langFromHost()) persistLang(lang);
  wireSwitcher();
})();
