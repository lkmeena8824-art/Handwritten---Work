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
   ⚙️  EVERYTHING BELOW THIS LINE IS SITE LOGIC — NO NEED TO EDIT
   ============================================================================ */

/* ---------- Small helpers ---------- */
const isPlaceholder = (v) =>
  !v || /YOUR_|yourdomain\.com|919999999999/i.test(String(v));

function waLink(message, number) {
  const n = number || SITE.whatsappNumber;
  return "https://wa.me/" + n + "?text=" + encodeURIComponent(message || SITE.supportMessage);
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
  if (isPlaceholder(SITE.telegramUrl)) missing.push("Telegram link");
  if (isPlaceholder(SITE.whatsappNumber)) missing.push("WhatsApp number");
  if (isPlaceholder(SITE.supportEmail)) missing.push("support email");
  if (!missing.length) return;

  const bar = document.createElement("div");
  bar.className = "config-bar";
  bar.innerHTML =
    '<strong>Setup needed:</strong> add your ' + missing.join(", ") +
    ' in <code>assets/js/main.js</code> — this bar disappears automatically once real details are saved.';
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
      stage.innerHTML = '<iframe src="' + embed + '" title="' + VIDEO.title +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      stage.classList.add("playing");
      return;
    }

    if (VIDEO.mp4Url) {
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
      const firstBad = form.querySelector(".invalid");
      if (firstBad) firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
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

    if (SITE.formEndpoint) {
      fetch(SITE.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function () { location.href = "thank-you.html"; })
        .catch(function () { formWrap.style.display = "none"; successBox.classList.add("show"); successBox.scrollIntoView({ behavior: "smooth", block: "center" }); });
      return;
    }

    // No endpoint: show success box, then the thank-you page takes over
    formWrap.style.display = "none";
    successBox.classList.add("show");
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(function () { location.href = "thank-you.html"; }, 1200);
  });
}

/* ---------- Thank-you page: build the WhatsApp summary ---------- */
function initThankYou() {
  const btn = document.querySelector(".js-whatsapp-app");
  if (!btn || !document.getElementById("thankYouPage")) return;

  let data = null;
  try { data = JSON.parse(localStorage.getItem("hw_last_application") || "null"); } catch (e) { data = null; }

  if (!data) return;
  btn.href = waLink(
    SITE.applyMessage + "\n\n" +
    "Name: " + data.name + "\n" +
    "Mobile: " + data.mobile + "\n" +
    "Email: " + (data.email || "-") + "\n" +
    "City: " + data.city + "\n" +
    "Education: " + data.education + "\n" +
    "Hours available daily: " + data.dailyHours + "\n" +
    "Experience: " + (data.experience || "-") + "\n" +
    "Message: " + (data.message || "-")
  );
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
  applyImages();
  applySite();
  configWarning();
  initVideo();
  initForm();
  initThankYou();
  initReveal();
  initNav();
});
