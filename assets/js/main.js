/* ============================================================
   Handwriting Work From Home — Main JS
   ------------------------------------------------------------
   ★ IMPORTANT — SABSE PEHLE YE 3 CHEEZEIN UPDATE KAREIN ★
   Neeche CONFIG me apna Telegram link, WhatsApp number aur
   (optional) form endpoint daal dein. Bas!
   ============================================================ */

const CONFIG = {
  // 1) Apna Telegram channel/group link yahan daalein
  telegramUrl: "https://t.me/YOUR_TELEGRAM_CHANNEL",

  // 2) Apna WhatsApp number — country code ke SAATH, sirf digits
  //    Example: India number 9876543210  =>  "919876543210"
  whatsappNumber: "919999999999",

  // 3) Support email (footer me dikhega)
  supportEmail: "support@example.com",

  // 4) (OPTIONAL) Form data kahan save ho — Formspree/Basemodels ka URL
  //    Khali chhoda to application WhatsApp ke through aayegi.
  formEndpoint: "",

  // WhatsApp messages
  supportMessage: "Hello! Mujhe handwriting work-from-home ke baare me jankari chahiye. Kya aap help kar sakte hain?",
  applyMessage: "Hello! Main handwriting work ke liye apply karna chahta/chahti hoon.",
};

/* ---------- Helpers ---------- */
function waLink(message, number) {
  const n = number || CONFIG.whatsappNumber;
  return "https://wa.me/" + n + "?text=" + encodeURIComponent(message || CONFIG.supportMessage);
}

function applyButtons() {
  // Telegram links
  document.querySelectorAll(".js-telegram, .js-telegram-text").forEach(function (el) {
    el.href = CONFIG.telegramUrl;
    el.target = "_blank";
    el.rel = "noopener";
  });

  // WhatsApp support links
  document.querySelectorAll(".js-whatsapp, .js-whatsapp-text").forEach(function (el) {
    el.href = waLink(CONFIG.supportMessage);
    el.target = "_blank";
    el.rel = "noopener";
    if (el.classList.contains("js-whatsapp-text")) {
      el.textContent = "WhatsApp: +" + CONFIG.whatsappNumber;
    }
  });

  // Email links
  document.querySelectorAll(".js-email-text").forEach(function (el) {
    el.href = "mailto:" + CONFIG.supportEmail;
    el.textContent = CONFIG.supportEmail;
  });

  // Year in footer
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- Form validation + submit ---------- */
function initForm() {
  var form = document.getElementById("applyForm");
  if (!form) return;

  var formWrap = document.getElementById("formWrap");
  var successBox = document.getElementById("formSuccess");
  var waAppBtn = document.querySelector(".js-whatsapp-app");

  function setInvalid(fieldId, invalid) {
    var f = document.getElementById(fieldId);
    if (f) f.classList.toggle("invalid", invalid);
  }

  function validate() {
    var ok = true;

    var name = document.getElementById("fullName").value.trim();
    if (name.length < 2) { setInvalid("f-name", true); ok = false; } else { setInvalid("f-name", false); }

    var mobile = document.getElementById("mobile").value.trim();
    if (!/^[6-9]\d{9}$/.test(mobile)) { setInvalid("f-mobile", true); ok = false; } else { setInvalid("f-mobile", false); }

    var email = document.getElementById("email").value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setInvalid("f-email", true); ok = false; } else { setInvalid("f-email", false); }

    var city = document.getElementById("city").value.trim();
    if (city.length < 2) { setInvalid("f-city", true); ok = false; } else { setInvalid("f-city", false); }

    if (!document.getElementById("education").value) { setInvalid("f-education", true); ok = false; } else { setInvalid("f-education", false); }
    if (!document.getElementById("workType").value) { setInvalid("f-worktype", true); ok = false; } else { setInvalid("f-worktype", false); }

    var consent = document.getElementById("consent");
    var consentBox = document.getElementById("f-consent");
    if (!consent.checked) { consentBox.classList.add("invalid"); ok = false; }
    else { consentBox.classList.remove("invalid"); }

    return ok;
  }

  // Live validation — invalid field theek karte hi error hat jaye
  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("input", function () {
      var field = el.closest(".field");
      if (field) field.classList.remove("invalid");
      if (el.id === "consent") document.getElementById("f-consent").classList.remove("invalid");
    });
    el.addEventListener("change", function () {
      var field = el.closest(".field");
      if (field) field.classList.remove("invalid");
      if (el.id === "consent") document.getElementById("f-consent").classList.remove("invalid");
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstBad = form.querySelector(".invalid");
      if (firstBad) firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    var data = {
      name: document.getElementById("fullName").value.trim(),
      mobile: document.getElementById("mobile").value.trim(),
      email: document.getElementById("email").value.trim(),
      city: document.getElementById("city").value.trim(),
      education: document.getElementById("education").value,
      workType: document.getElementById("workType").value,
      message: document.getElementById("message").value.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Local backup (browser me) — endpoint na hone par bhi data record
    try {
      var saved = JSON.parse(localStorage.getItem("hw_applications") || "[]");
      saved.push(data);
      localStorage.setItem("hw_applications", JSON.stringify(saved));
    } catch (err) { /* ignore */ }

    // WhatsApp fallback message ready karein
    if (waAppBtn) {
      var msg =
        CONFIG.applyMessage + "\n\n" +
        "Name: " + data.name + "\n" +
        "Mobile: " + data.mobile + "\n" +
        "Email: " + (data.email || "-") + "\n" +
        "City: " + data.city + "\n" +
        "Education: " + data.education + "\n" +
        "Time: " + data.workType + "\n" +
        "Message: " + (data.message || "-");
      waAppBtn.href = waLink(msg);
    }

    // Agar formEndpoint set hai to server par bhej do
    if (CONFIG.formEndpoint) {
      fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      }).catch(function () { /* WhatsApp fallback already ready */ });
    }

    // Success dikhayein
    formWrap.style.display = "none";
    successBox.classList.add("show");
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  applyButtons();
  initForm();
});
