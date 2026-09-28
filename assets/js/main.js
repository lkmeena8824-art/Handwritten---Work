/* ============================================================================
   HandWrite Work — main.js
   ----------------------------------------------------------------------------
   ★★ EDIT ONLY THIS FILE TO CUSTOMISE THE SITE ★★
   Everything below is safe to edit. You do NOT need to touch the HTML.

   SECTION 1 — IMAGES        : change an image link here, whole site updates
   SECTION 2 — SITE SETTINGS : Telegram, WhatsApp, email, form endpoint
   SECTION 3 — VIDEO         : paste a YouTube link or an MP4 link
   ============================================================================ */


/* ============================================================================
   1) IMAGES  —  REPLACE ANY IMAGE BY CHANGING ONE LINK
   ----------------------------------------------------------------------------
   You can either use a local file (assets/images/...) OR a full online URL
   (e.g. "https://i.imgur.com/xxxx.jpg" or a link from Google Drive / Imgur /
   Cloudinary / your own CDN).

   The HTML uses data-img="key" — every place using that key updates at once.
   ============================================================================ */
const IMAGES = {
  // Big photo at the top of the page
  hero: "assets/images/hero.jpg",

  // Close-up of handwriting / notebook  (used in "What the work looks like")
  workSample: "assets/images/work-sample.jpg",

  // Desk flat-lay  (used in the requirements section)
  deskSetup: "assets/images/desk-setup.jpg",

  // Cover image shown before the video starts (poster)
  videoPoster: "assets/images/video-poster.jpg",

  // Favicon (browser tab icon)
  favicon: "assets/images/favicon.svg",

  // Image used when someone shares your link on Facebook / WhatsApp /
  // Telegram. For ads you MUST use a full URL, e.g.
  // "https://yourdomain.com/assets/images/hero.jpg"
  socialShare: "assets/images/hero.jpg",
};


/* ============================================================================
   2) SITE SETTINGS
   ----------------------------------------------------------------------------
   Fill in your real details below, then the whole website updates itself:
   header, hero, form, footer, sticky mobile bar, legal pages — everywhere.
   ============================================================================ */
const SITE = {

  /* ---- Telegram (main channel — applicants join here) -------------------
     Paste your channel link, e.g. "https://t.me/HandWriteWorkOfficial"      */
  telegramUrl: "https://t.me/YOUR_TELEGRAM_CHANNEL",

  /* ---- WhatsApp (SUPPORT ONLY — questions & help, not applications) -----
     Country code included, digits only. Example: "919876543210"            */
  whatsappNumber: "919999999999",

  /* ---- Support email ----------------------------------------------------- */
  supportEmail: "support@yourdomain.com",

  /* ---- Registered company name (shown in footer + legal pages) ---------- */
  companyName: "HandWrite Work",

  /* ---- Support hours (shown in footer) ---------------------------------- */
  supportHours: "10:00 AM – 7:00 PM (Mon–Sat)",

  /* ---- OPTIONAL: form endpoint ------------------------------------------
     Leave "" and applications land on the thank-you page with a ready-to-send
     WhatsApp message. To receive applications in your email / Google Sheet,
     paste a free Formspree / Basemodels / Apps-Script URL here.             */
  formEndpoint: "",

  /* ---- Pre-filled WhatsApp messages ------------------------------------- */
  supportMessage:
    "Hello! I have a question about the handwriting work programme.",
  applyMessage:
    "Hello! I would like to apply for the handwriting work programme.",
};

const VIDEO = {
  /* Paste ONE of these — the first one that is filled in will be used.
     YouTube:  youtubeUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
               (short youtu.be links and unlisted videos also work)
     OR a direct video file:
               mp4Url: "https://yourdomain.com/video/how-it-works.mp4"       */
  youtubeUrl: "",
  mp4Url: "",

  // Poster image key from IMAGES above
  posterKey: "videoPoster",

  title: "Watch: how the work is done",
  caption: "A 2-minute walkthrough — the work, the quality check and the payout.",
};


/* ============================================================================
   4) META PIXEL — CONVERSION TRACKING
   ----------------------------------------------------------------------------
   Paste your Meta Pixel ID below (Events Manager → Data Sources → your pixel).
   Everything else is already wired up.

   ★ THE ONE NUMBER THAT MATTERS ★
   "Telegram joins" is the conversion this site counts. There are several
   Telegram buttons across the page, but a visitor is counted ONCE no matter how
   many of them they tap — see `dedupe` below. WhatsApp is support only and is
   NOT counted as a conversion.
   ============================================================================ */
const PIXEL = {

  /* ---- Your Meta Pixel ID, e.g. "1234567890123456" ---------------------- */
  pixelId: "",

  /* ---- The event fired when someone taps ANY Telegram button ------------
     "Lead" is the standard event to optimise for. You can also use
     "Contact", "Subscribe" or "CompleteRegistration".                      */
  telegramEvent: "Lead",
  telegramIsStandard: true,   // true = standard Meta event, false = custom event

  /* ---- One visitor = one conversion ------------------------------------
     "session"  → counted once per visit (RECOMMENDED — a returning visitor who
                  converts again later is a genuine second conversion)
     "forever"  → counted once per browser, ever
     "never"    → counted on every tap (not recommended: one keen visitor can
                  look like ten conversions and spoil your ad optimisation)   */
  dedupe: "session",

  /* ---- Optional value sent with the conversion (0 = do not send) --------
     Only useful if you track revenue. Leave 0 for lead generation.          */
  value: 0,
  currency: "INR",

  /* ---- WhatsApp: SUPPORT ONLY — keep this OFF ---------------------------
     These are people asking a question, not joining. If you switch this on,
     it fires a custom event that must never be selected as a conversion in
     Ads Manager.                                                            */
  trackWhatsApp: false,

  /* ---- Diagnostic events (custom, never conversions) --------------------
     Useful for seeing how far people get down the page.                     */
  trackFormSubmit: true,      // fires "ApplicationSubmitted" after a valid form submission
  trackVideoPlay: true,       // fires "VideoPlay" when the video section is opened

  /* ---- Advanced matching -------------------------------------------------
     Sends a hashed (SHA-256) version of the applicant's email / mobile /
     name after they submit the form, which noticeably improves how well Meta
     matches your ads to real people. Hashed values cannot be reversed.      */
  advancedMatching: true,

  /* ---- Cookie consent ----------------------------------------------------
     false → pixel loads straight away.
     true  → a small consent banner appears and the pixel loads only if the
             visitor taps "Accept" (stricter, but you may lose some tracking). */
  requireConsent: false,

  /* ---- Debugging ---------------------------------------------------------
     true → every tracking event is logged in the browser console, and
     HW_Tracking.status() can be run from the console at any time.           */
  debug: false,
};


/* ============================================================================
   ⚙️  EVERYTHING BELOW THIS LINE IS SITE LOGIC — NO NEED TO EDIT
   ============================================================================ */

/* ============================================================================
   Tracking module — Meta Pixel
   One delegated listener catches every Telegram button on the page (header,
   hero, sticky bar, sections, footer, thank-you page — including buttons added
   later), so no button needs its own code.
   ============================================================================ */
const Tracking = (function () {

  const KEY = {
    telegram: "hw_px_telegram_conversion",
    match: "hw_px_match",
    consent: "hw_px_consent",
  };

  let ready = false;

  function log() {
    if (!PIXEL.debug) return;
    try { console.log.apply(console, ["[tracking]"].concat([].slice.call(arguments))); } catch (e) { /* ignore */ }
  }

  function store(type) {
    try { return type === "forever" ? window.localStorage : window.sessionStorage; }
    catch (e) { return null; }
  }

  function readStore(type, key) {
    const s = store(type);
    if (!s) return null;
    try { return s.getItem(key); } catch (e) { return null; }
  }

  function writeStore(type, key, value) {
    const s = store(type);
    if (!s) return;
    try { s.setItem(key, value); } catch (e) { /* storage may be blocked */ }
  }

  /* ---------- Load the pixel (unless the official snippet is already in) ---------- */
  function bootstrap() {
    if (!PIXEL.pixelId) { log("no Pixel ID set — tracking is off"); return false; }
    if (typeof window.fbq === "function") { ready = true; log("using pixel already installed on the page"); return true; }

    const w = window, d = document;
    const fbq = (w.fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    });
    if (!w._fbq) w._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    const s = d.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    d.head.appendChild(s);

    fbq("init", PIXEL.pixelId);
    ready = true;
    log("pixel initialised:", PIXEL.pixelId);
    return true;
  }

  /* ---------- Fire an event ---------- */
  function track(name, params, isStandard, eventId) {
    if (typeof window.fbq !== "function") { log("skipped (pixel not loaded):", name); return; }
    const method = isStandard === false ? "trackCustom" : "track";
    const payload = params || {};
    if (eventId) window.fbq(method, name, payload, { eventID: eventId });
    else window.fbq(method, name, payload);
    log(method, name, payload, eventId ? "eventID=" + eventId : "");
  }

  /* ---------- Deduplication: one visitor, one conversion ---------- */
  function shouldCount(key) {
    const mode = PIXEL.dedupe;
    if (mode === "never") return true;
    const type = mode === "forever" ? "forever" : "session";
    if (readStore(type, key)) return false;   // already counted
    writeStore(type, key, String(Date.now()));
    return true;
  }

  function newEventId(prefix) {
    return prefix + "." + Date.now() + "." + Math.random().toString(36).slice(2, 8);
  }

  /* ---------- Which part of the page was the button in? ----------
     Extra detail on the same single event, so you can see which button people
     actually use — it does not create additional conversions. */
  function whereFrom(el) {
    if (el.closest(".sticky-bar")) return "sticky-mobile-bar";
    if (el.closest(".final-cta")) return "final-cta";
    if (el.closest(".site-header")) return "header";
    if (el.closest("footer")) return "footer";
    const sec = el.closest("section");
    if (sec) {
      if (sec.id) return sec.id;
      const cls = String(sec.className || "").split(/\s+/).filter(function (c) {
        return c && c !== "section" && c !== "reveal" && c !== "on-white";
      })[0];
      return cls || "section";
    }
    const box = el.closest(".form-card, .form-success, .thanks-card");
    if (box) return "form";
    return "other";
  }

  /* ---------- Click tracking ---------- */
  function bindClicks() {
    document.addEventListener("click", function (e) {
      const t = e.target;
      if (!t || typeof t.closest !== "function") return;

      /* Any Telegram button anywhere — counted once per visitor */
      const tg = t.closest('a[data-site="telegram"], a.js-telegram, a.js-telegram-text');
      if (tg && shouldCount(KEY.telegram)) {
        const params = {
          content_name: whereFrom(tg),
          content_category: "telegram-join",
        };
        if (PIXEL.value) { params.value = PIXEL.value; params.currency = PIXEL.currency; }
        track(PIXEL.telegramEvent, params, PIXEL.telegramIsStandard, newEventId("tg"));
      }

      /* WhatsApp — support only. Off by default, and never a conversion. */
      if (PIXEL.trackWhatsApp && t.closest('a.js-whatsapp, a.js-whatsapp-text, a[data-site="whatsapp"]')) {
        track("WhatsAppSupportClick", { content_name: whereFrom(t) }, false);
      }
    }, true);   // capture phase: records before the browser opens the link
  }

  /* ---------- Advanced matching (hashed, privacy-safe) ---------- */
  function hash(value) {
    if (!value) return Promise.resolve(null);
    if (!window.crypto || !window.crypto.subtle || !window.TextEncoder) return Promise.resolve(null);
    return window.crypto.subtle
      .digest("SHA-256", new window.TextEncoder().encode(String(value).trim().toLowerCase()))
      .then(function (buf) {
        return [].map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
      })
      .catch(function () { return null; });
  }

  function identify(data) {
    if (!PIXEL.advancedMatching || !data || typeof window.fbq !== "function") return Promise.resolve();

    const jobs = [
      hash(data.email).then(function (h) { return ["em", h]; }),
      hash(data.mobile ? "91" + String(data.mobile).replace(/\D/g, "") : null).then(function (h) { return ["ph", h]; }),
      hash(data.city ? String(data.city).replace(/\s+/g, "") : null).then(function (h) { return ["ct", h]; }),
      hash(data.name ? String(data.name).trim().split(/\s+/)[0] : null).then(function (h) { return ["fn", h]; }),
    ];

    return Promise.all(jobs).then(function (pairs) {
      const payload = {};
      pairs.forEach(function (pair) { if (pair[0] && pair[1]) payload[pair[0]] = pair[1]; });
      if (!Object.keys(payload).length) return;
      window.fbq("init", PIXEL.pixelId, payload);
      log("advanced matching set:", Object.keys(payload).join(", "));
      writeStore("forever", KEY.match, JSON.stringify(payload));
    });
  }

  /* ---------- Optional consent banner ---------- */
  function showBanner(callback) {
    const bar = document.createElement("div");
    bar.className = "consent-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookie choices");
    bar.innerHTML =
      '<p>We use measurement cookies to see which of our adverts bring people to this page. ' +
      'These help us improve our advertising. See our <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
      '<div class="cta-row">' +
      '<button type="button" class="btn btn-outline" data-consent="denied">Decline</button>' +
      '<button type="button" class="btn btn-primary" data-consent="granted">Accept</button>' +
      '</div>';
    document.body.appendChild(bar);
    bar.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-consent]");
      if (!btn) return;
      bar.remove();
      callback(btn.getAttribute("data-consent") === "granted");
    });
  }

  function withConsent(callback) {
    if (!PIXEL.requireConsent) { callback(); return; }
    const choice = readStore("forever", KEY.consent);
    if (choice === "granted") { callback(); return; }
    if (choice === "denied") { log("pixel not loaded — visitor declined measurement cookies"); return; }
    showBanner(function (granted) {
      writeStore("forever", KEY.consent, granted ? "granted" : "denied");
      if (granted) callback();
      else log("pixel not loaded — visitor declined measurement cookies");
    });
  }

  /* ---------- Init (safe to call more than once) ---------- */
  let inited = false;

  function init() {
    if (inited) return;
    inited = true;
    if (!PIXEL.pixelId) { log("tracking disabled — paste your Pixel ID into PIXEL.pixelId in this file"); inited = false; return; }
    withConsent(function () {
      if (!bootstrap()) return;
      track("PageView");
      // Re-apply advanced matching details gathered on a previous step
      if (PIXEL.advancedMatching) {
        try {
          const saved = JSON.parse(readStore("forever", KEY.match) || "null");
          if (saved && Object.keys(saved).length) window.fbq("init", PIXEL.pixelId, saved);
        } catch (e) { /* ignore */ }
      }
      bindClicks();
    });
  }

  return {
    init: init,
    identify: identify,
    event: track,
    /* Run HW_Tracking.status() in the browser console to check your setup */
    status: function () {
      const counted = PIXEL.dedupe === "never"
        ? false
        : !!readStore(PIXEL.dedupe === "forever" ? "forever" : "session", KEY.telegram);
      const out = {
        "Pixel ID": PIXEL.pixelId || "(not set — tracking is off)",
        "Pixel loaded": typeof window.fbq === "function",
        "Telegram conversion event": PIXEL.telegramEvent,
        "Deduplication mode": PIXEL.dedupe,
        "WhatsApp tracking": PIXEL.trackWhatsApp ? "ON — must not be used as a conversion" : "off (support only)",
        "Form submit event": PIXEL.trackFormSubmit ? "ApplicationSubmitted (custom)" : "off",
        "Video play event": PIXEL.trackVideoPlay ? "VideoPlay (custom)" : "off",
        "Advanced matching": PIXEL.advancedMatching ? "on (hashed)" : "off",
        "Consent banner": PIXEL.requireConsent ? "required" : "not required",
        "Debug logging": PIXEL.debug ? "on" : "off",
      };
      out["Conversion already counted this " + (PIXEL.dedupe === "forever" ? "browser" : "visit")] = counted;
      return out;
    },
  };
})();

/* ---------- Small helpers ---------- */
const isPlaceholder = (v) =>
  !v || /YOUR_|yourdomain\.com|919999999999/i.test(String(v));

function waLink(message, number) {
  const n = number || SITE.whatsappNumber;
  return "https://wa.me/" + n + "?text=" + encodeURIComponent(message || SITE.supportMessage);
}

function scrollToCentre(el) {
  if (el && typeof el.scrollIntoView === "function") {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function youtubeEmbed(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0" : null;
}

/* ---------- Images: apply every data-img / data-bg ---------- */
function applyImages() {
  document.querySelectorAll("[data-img]").forEach(function (el) {
    const key = el.getAttribute("data-img");
    const src = IMAGES[key];
    if (!src) return;
    if (el.tagName === "IMG" || el.tagName === "SOURCE") el.setAttribute("src", src);
    else el.style.backgroundImage = 'url("' + src + '")';
  });

  document.querySelectorAll("[data-bg]").forEach(function (el) {
    const src = IMAGES[el.getAttribute("data-bg")];
    if (src) el.style.backgroundImage = 'url("' + src + '")';
  });

  // favicon
  const icon = document.querySelector('link[rel="icon"]');
  if (icon && IMAGES.favicon) icon.setAttribute("href", IMAGES.favicon);

  // social share image (Open Graph)
  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(function (m) {
    if (IMAGES.socialShare) m.setAttribute("content", IMAGES.socialShare);
  });
}

/* ---------- Links, text and hours ---------- */
function applySite() {
  document.querySelectorAll("[data-site='telegram'], .js-telegram, .js-telegram-text").forEach(function (el) {
    el.href = SITE.telegramUrl;
    el.target = "_blank";
    el.rel = "noopener";
  });

  document.querySelectorAll("[data-site='whatsapp'], .js-whatsapp, .js-whatsapp-text").forEach(function (el) {
    el.href = waLink(SITE.supportMessage);
    el.target = "_blank";
    el.rel = "noopener";
  });

  // "Send on WhatsApp" buttons that carry an application (not a support question).
  // The thank-you page replaces these hrefs with the full application summary.
  document.querySelectorAll(".js-whatsapp-app").forEach(function (el) {
    el.href = waLink(SITE.applyMessage);
    el.target = "_blank";
    el.rel = "noopener";
  });

  document.querySelectorAll(".js-whatsapp-text").forEach(function (el) {
    el.textContent = "WhatsApp: +" + SITE.whatsappNumber;
  });

  document.querySelectorAll(".js-email-text").forEach(function (el) {
    el.href = "mailto:" + SITE.supportEmail;
    el.textContent = SITE.supportEmail;
  });
  document.querySelectorAll("[data-site='email']").forEach(function (el) {
    el.href = "mailto:" + SITE.supportEmail;
  });

  document.querySelectorAll(".js-company").forEach(function (el) { el.textContent = SITE.companyName; });
  document.querySelectorAll(".js-hours").forEach(function (el) { el.textContent = SITE.supportHours; });

  // Any link that just needs the email text
  document.querySelectorAll("[data-site='hours']").forEach(function (el) { el.textContent = SITE.supportHours; });

  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Legal pages "last updated"
  const lu = document.getElementById("lastUpdated");
  if (lu) {
    lu.textContent = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
}

/* ---------- Warn (only) while placeholder details are still in use ---------- */
function configWarning() {
  const missing = [];
  if (!PIXEL.pixelId) missing.push("Meta Pixel ID");
  if (isPlaceholder(SITE.telegramUrl)) missing.push("Telegram link");
  if (isPlaceholder(SITE.whatsappNumber)) missing.push("WhatsApp number");
  if (isPlaceholder(SITE.supportEmail)) missing.push("support email");
  if (!missing.length) return;

  const bar = document.createElement("div");
  bar.className = "config-bar";
  bar.innerHTML =
    '<strong>Setup needed:</strong> add your ' + missing.join(", ") +
    ' in <code>assets/js/main.js</code> — this bar disappears automatically once real details are saved.' +
    (PIXEL.pixelId ? "" : " (Tracking stays off until the Pixel ID is added.)");
  document.body.prepend(bar);
}

/* ---------- Video ---------- */
function initVideo() {
  const stage = document.getElementById("videoStage");
  if (!stage) return;

  const poster = IMAGES[VIDEO.posterKey];
  if (poster) stage.style.backgroundImage = 'url("' + poster + '")';

  const titleEl = stage.querySelector(".video-caption");
  if (titleEl && VIDEO.caption) titleEl.textContent = VIDEO.caption;

  stage.addEventListener("click", function () {
    const embed = VIDEO.youtubeUrl ? youtubeEmbed(VIDEO.youtubeUrl) : null;

    if (embed) {
      if (PIXEL.trackVideoPlay) Tracking.event("VideoPlay", { content_name: "how-it-works" }, false);
      stage.innerHTML = '<iframe src="' + embed + '" title="' + VIDEO.title +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      stage.classList.add("playing");
      return;
    }

    if (VIDEO.mp4Url) {
      if (PIXEL.trackVideoPlay) Tracking.event("VideoPlay", { content_name: "how-it-works" }, false);
      stage.innerHTML = '<video controls autoplay playsinline poster="' + (poster || "") +
        '"><source src="' + VIDEO.mp4Url + '" type="video/mp4" /></video>';
      stage.classList.add("playing");
      return;
    }

    // No link added yet — show a friendly note instead of breaking
    const note = stage.querySelector(".video-soon");
    if (note) {
      note.classList.add("show");
      setTimeout(function () { note.classList.remove("show"); }, 3000);
    }
  });
}

/* ---------- Build the full application summary for WhatsApp ---------- */
function buildApplyMessage(data) {
  if (!data) return null;
  return SITE.applyMessage + "\n\n" +
    "Name: " + data.name + "\n" +
    "Mobile: " + data.mobile + "\n" +
    "Email: " + (data.email || "-") + "\n" +
    "City: " + data.city + "\n" +
    "Education: " + data.education + "\n" +
    "Hours available daily: " + data.dailyHours + "\n" +
    "Experience: " + (data.experience || "-") + "\n" +
    "Message: " + (data.message || "-");
}

function setApplyButtons(data) {
  const msg = buildApplyMessage(data);
  if (!msg) return;
  document.querySelectorAll(".js-whatsapp-app").forEach(function (el) {
    el.href = waLink(msg);
    el.target = "_blank";
    el.rel = "noopener";
  });
}

/* ---------- Application form ---------- */
function initForm() {
  const form = document.getElementById("applyForm");
  if (!form) return;

  const formWrap = document.getElementById("formWrap");
  const successBox = document.getElementById("formSuccess");

  const setInvalid = (fieldId, invalid) => {
    const f = document.getElementById(fieldId);
    if (f) f.classList.toggle("invalid", invalid);
  };

  function validate() {
    let ok = true;

    const name = document.getElementById("fullName").value.trim();
    setInvalid("f-name", name.length < 2); if (name.length < 2) ok = false;

    const mobile = document.getElementById("mobile").value.replace(/[^\d]/g, "").slice(-10);
    const mobileOk = /^[6-9]\d{9}$/.test(mobile);
    setInvalid("f-mobile", !mobileOk); if (!mobileOk) ok = false;

    const email = document.getElementById("email").value.trim();
    const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    setInvalid("f-email", !emailOk); if (!emailOk) ok = false;

    const city = document.getElementById("city").value.trim();
    setInvalid("f-city", city.length < 2); if (city.length < 2) ok = false;

    const education = document.getElementById("education").value;
    setInvalid("f-education", !education); if (!education) ok = false;

    const dailyHours = document.getElementById("dailyHours").value;
    setInvalid("f-hours", !dailyHours); if (!dailyHours) ok = false;

    const consent = document.getElementById("consent");
    const consentBox = document.getElementById("f-consent");
    consentBox.classList.toggle("invalid", !consent.checked);
    if (!consent.checked) ok = false;

    return ok;
  }

  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    const clear = function () {
      const field = el.closest(".field");
      if (field) field.classList.remove("invalid");
      if (el.id === "consent") document.getElementById("f-consent").classList.remove("invalid");
    };
    el.addEventListener("input", clear);
    el.addEventListener("change", clear);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.querySelector(".hp input").value) return; // honeypot: silently stop bots

    if (!validate()) {
      scrollToCentre(form.querySelector(".invalid"));
      return;
    }

    const data = {
      name: document.getElementById("fullName").value.trim(),
      mobile: document.getElementById("mobile").value.replace(/[^\d]/g, "").slice(-10),
      email: document.getElementById("email").value.trim(),
      city: document.getElementById("city").value.trim(),
      education: document.getElementById("education").value,
      dailyHours: document.getElementById("dailyHours").value,
      experience: document.getElementById("experience").value,
      message: document.getElementById("message").value.trim(),
      consent: true,
      submittedAt: new Date().toISOString(),
      source: location.pathname,
    };

    try {
      localStorage.setItem("hw_last_application", JSON.stringify(data));
      const all = JSON.parse(localStorage.getItem("hw_applications") || "[]");
      all.push(data);
      localStorage.setItem("hw_applications", JSON.stringify(all));
    } catch (err) { /* storage may be blocked — ignore */ }

    // Improve ad matching with a hashed copy of the applicant's details,
    // then record the submission (a diagnostic event — Telegram stays the only
    // conversion this website counts).
    Tracking.identify(data);
    if (PIXEL.trackFormSubmit) {
      Tracking.event("ApplicationSubmitted", {
        content_name: "application-form",
        hours_available: data.dailyHours,
      }, false);
    }

    if (SITE.formEndpoint) {
      fetch(SITE.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function () { location.href = "thank-you.html"; })
        .catch(function () {
          formWrap.style.display = "none";
          successBox.classList.add("show");
          scrollToCentre(successBox);
        });
      return;
    }

    // No endpoint: the WhatsApp button in the success box carries the application,
    // so it works immediately; the thank-you page repeats it with the same summary.
    setApplyButtons(data);
    formWrap.style.display = "none";
    successBox.classList.add("show");
    scrollToCentre(successBox);
    setTimeout(function () { location.href = "thank-you.html"; }, 2600);
  });
}

/* ---------- Thank-you page: build the WhatsApp summary ---------- */
function initThankYou() {
  const btn = document.querySelector(".js-whatsapp-app");
  if (!btn || !document.getElementById("thankYouPage")) return;

  let data = null;
  try { data = JSON.parse(localStorage.getItem("hw_last_application") || "null"); } catch (e) { data = null; }

  if (!data) return;
  setApplyButtons(data);
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  items.forEach((el) => io.observe(el));
}

/* ---------- Active nav link ---------- */
function initNav() {
  const links = document.querySelectorAll(".nav-desktop a[href^='#']");
  if (!links.length || !("IntersectionObserver" in window)) return;

  const sections = [...links].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach((s) => io.observe(s));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  Tracking.init();          // Meta Pixel + conversion tracking
  window.HW_Tracking = Tracking;
  applyImages();
  applySite();
  configWarning();
  initVideo();
  initForm();
  initThankYou();
  initReveal();
  initNav();
});
