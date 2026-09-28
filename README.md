# HandWrite Work — Work-From-Home Handwriting Programme

A fast, mobile-first static website for a work-from-home handwriting work programme, built for
Meta (Facebook) advertising. Written in **British English** throughout.

No build step, no framework, no dependencies — upload the folder and it runs.

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Main landing page — hero, verified strip, how it works, the work, requirements, payouts, video, channels, trust, FAQ, application form |
| `privacy-policy.html` | Privacy Policy — what data is collected, lawful basis, retention, your rights |
| `terms.html` | Terms & Conditions + full disclaimer (not a government job, no income guarantee, no fees) |
| `data-security.html` | Data Security — access controls, payment safety, fraud warnings, data deletion requests |
| `thank-you.html` | Confirmation page shown after the form is submitted |
| `robots.txt`, `sitemap.xml` | Search engine basics — update the domain inside both files |

---

## ⚙️ Setup — edit ONE file

Open **`assets/js/main.js`**. Everything you need to change is at the top, in four blocks.

### 1. Images — `IMAGES`

Change a link here and it updates **everywhere on the site** (hero, sections, video poster,
favicon, social-share picture). No HTML editing required.

```js
const IMAGES = {
  hero:        "assets/images/hero.jpg",          // big photo at the top
  workSample:  "assets/images/work-sample.jpg",   // close-up of handwriting
  deskSetup:   "assets/images/desk-setup.jpg",    // desk flat-lay
  videoPoster: "assets/images/video-poster.jpg",  // shown before the video plays
  favicon:     "assets/images/favicon.svg",       // browser tab icon
  socialShare: "assets/images/hero.jpg",          // preview image in WhatsApp / Facebook
};
```

You can use either:

* **a local file** — drop your new picture into `assets/images/` and point to it, e.g.
  `"assets/images/my-new-photo.jpg"`, **or**
* **a full online URL** — e.g. `"https://images.example.com/photo.jpg"`,
  or a link from Imgur / Cloudinary / your own CDN or hosting.

Recommended sizes: hero and section photos around **1500 × 1125 px** (4:3), video poster
**1920 × 1080 px** (16:9). Keep each file under about 300 KB so the page stays fast on mobile.

> If you replace a file but keep the same name, you may need to hard-refresh (Ctrl/Cmd + Shift + R)
> to clear the browser cache.

### 2. Links and contact details — `SITE`

```js
const SITE = {
  telegramUrl:   "https://t.me/YOUR_TELEGRAM_CHANNEL", // main channel — applications + work
  whatsappNumber: "919999999999",                      // SUPPORT ONLY — digits, with country code
  supportEmail:  "support@yourdomain.com",
  companyName:   "HandWrite Work",
  supportHours:  "10:00 AM – 7:00 PM (Mon–Sat)",
  formEndpoint:  "",                                   // optional — see below
  supportMessage: "Hello! I have a question about the handwriting work programme.",
  applyMessage:   "Hello! I would like to apply for the handwriting work programme.",
};
```

Save the file and every button, footer link, legal-page contact and the sticky mobile bar update
automatically. **Telegram is the main channel for applications and work; WhatsApp is support only.**

### 3. Video — `VIDEO`

```js
const VIDEO = {
  youtubeUrl: "",   // e.g. "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  mp4Url:     "",   // or a direct video file link
  posterKey:  "videoPoster",
  title:      "Watch: how the work is done",
  caption:    "A 2-minute walkthrough — the work, the quality check and the payout.",
};
```

Fill in **one** of the two. YouTube (including unlisted videos and `youtu.be` links) plays in a
privacy-friendly embed on click; an MP4 plays in the browser's own player. Until you add a link, the
video section still looks complete — clicking it shows a small "video link will be added shortly"
note.

### 4. Meta Pixel — `PIXEL`

```js
const PIXEL = {
  pixelId: "",              // ← paste your Meta Pixel ID, e.g. "1234567890123456"
  telegramEvent: "Lead",    // the conversion this site counts
  dedupe: "session",        // one visitor = one conversion (see below)
  trackWhatsApp: false,     // support only — keep OFF
  advancedMatching: true,   // hashed email/mobile improves ad matching
  requireConsent: false,    // true → show a cookie consent banner before loading
  debug: false,             // true → log every event in the browser console
};
```

Leave `pixelId` empty and the whole tracking layer stays switched off — nothing is loaded and
nothing is sent.

---

## 📈 Meta Pixel & conversion tracking

### What counts as a conversion

**Telegram joins.** The site has several Telegram buttons — header, hero, sticky mobile bar,
sections, footer, thank-you page — and **a visitor is counted once no matter how many of them they
tap.** Every Telegram button feeds the same single conversion.

**WhatsApp is never counted.** It is a support channel, not a conversion. `trackWhatsApp` is off by
default; if you ever switch it on it fires a custom diagnostic event called `WhatsAppSupportClick`,
which must **never** be selected as a conversion event in Ads Manager.

### Deduplication

| `dedupe` value | Behaviour | When to use |
|---|---|---|
| `"session"` *(default)* | One conversion per visit | Recommended. A returning visitor who converts again later is a genuine second conversion |
| `"forever"` | One conversion per browser, ever | If you want the strictest one-person-one-conversion rule |
| `"never"` | Every tap counts | Not recommended — one keen visitor can look like ten conversions and distort your ad optimisation |

Every conversion also carries a unique `eventID`, so if you later add the **Conversions API**,
Meta can match the browser event with the server event and avoid double counting.

The event also carries a `content_name` telling you *which* button was used — `hero`,
`sticky-mobile-bar`, `footer`, `channels`, `video`, `final-cta` — so you can see which placement
works, without creating extra conversions.

### Diagnostic events (never conversions)

| Event | Fires when | Type |
|---|---|---|
| `PageView` | Every page load | Standard |
| `Lead` | A Telegram button is tapped (deduplicated) | **Standard — your conversion** |
| `ApplicationSubmitted` | A valid application form is submitted | Custom |
| `VideoPlay` | The video section is opened | Custom |
| `WhatsAppSupportClick` | Only if `trackWhatsApp: true` | Custom |

### Advanced matching

When an applicant submits the form, their email, mobile, name and city are hashed with SHA-256 in
the browser and sent to Meta as matching signals. This noticeably improves how well Meta matches
your adverts to real people. Hashed values cannot be reversed, and if the browser does not support
hashing the site simply skips it. The Privacy Policy already discloses this.

### Cookie consent

Set `requireConsent: true` if you want a consent banner: the pixel then loads **only** after the
visitor taps *Accept*. Stricter and safer legally, but expect slightly lower reported conversion
numbers. Default is `false`.

### Testing your setup

1. Open the site, then open the browser console and run `HW_Tracking.status()`. It lists your Pixel
   ID, whether it loaded, the conversion event, whether this visitor has already been counted, and
   whether WhatsApp tracking is off.
2. Install the **Meta Pixel Helper** browser extension — it shows the `Lead` event firing, once per
   visit, however many Telegram buttons you tap.
3. In Meta Events Manager, open your pixel → **Test Events** and paste your site URL there while you
   click around, to watch events arrive live.
4. Set `debug: true` in `PIXEL` to log every event in the console while you test. Turn it back off
   afterwards.

### In Ads Manager

1. Create your campaign with the **Leads** objective (or Sales if you prefer).
2. At ad set level choose your pixel as the data source and **`Lead`** as the conversion event.
3. Optimise for `Lead`. Do **not** add `ApplicationSubmitted`, `VideoPlay` or
   `WhatsAppSupportClick` as conversion events.
4. Once you have enough volume, the same pixel powers lookalike and retargeting audiences.

---

## 📝 The application form

**Default behaviour (no setup):** the form validates, saves a copy in the applicant's own browser,
shows a thank-you message and then moves to `thank-you.html`, where the applicant can send their
details to you on WhatsApp with one tap.

**To receive applications directly in your email or a spreadsheet:** create a free form service
(Formspree, Basemodels, or a Google Apps Script endpoint) and paste its URL into
`SITE.formEndpoint`. Applications are then sent there automatically and the applicant is taken
straight to `thank-you.html`.

Spam protection: the form includes a hidden honeypot field that silently blocks bot submissions.

---

## 🚀 Deployment

It is a static website, so any free host works:

* **Netlify / Cloudflare Pages / Vercel** — drag the folder in, or connect this GitHub repository.
* **GitHub Pages** — Settings → Pages → deploy from the `main` branch.

Before running ads:

1. Use **HTTPS** (all the hosts above give it free).
2. Update the domain in `robots.txt`, `sitemap.xml` and the `og:url` / `og:image` tags in
   `index.html` to full `https://` URLs — Meta needs absolute URLs for ad previews.
3. Add your Telegram, WhatsApp and email details in `assets/js/main.js` (see above). While they are
   placeholders, an orange "Setup needed" bar appears at the top of the site as a reminder — it
   disappears on its own once real details are saved.
4. Test the form end to end, and test the Telegram and WhatsApp buttons on a real phone.

---

## ✅ Meta (Facebook) ads compliance checklist

- [x] Privacy Policy, Terms & Conditions and Data Security pages, all linked in the footer and in the form consent
- [x] Clear "not a government job, not a government scheme" disclaimer on every page
- [x] No income guarantee — earnings described as dependent on hours worked and quality
- [x] No fees stated as a trust promise ("we never ask for money")
- [x] No payment details collected anywhere on the website
- [x] Consent checkbox (18+ and Privacy Policy agreement) on the form
- [x] Clear contact routes (WhatsApp support, Telegram, email)
- [x] 100% mobile responsive, Open Graph tags, favicon, sitemap and robots.txt
- [x] Meta Pixel support built in — paste your ID in `PIXEL.pixelId` (`HW_Tracking.status()` verifies it)
- [x] Privacy Policy section 6 discloses the Meta Pixel, hashed matching data and how to opt out

---

## 🗂 Project structure

```
index.html
privacy-policy.html
terms.html
data-security.html
thank-you.html
robots.txt
sitemap.xml
README.md
assets/
  css/style.css          ← design system, mobile-first
  js/main.js             ← ★ the only file you need to edit
  images/
    hero.jpg
    work-sample.jpg
    desk-setup.jpg
    video-poster.jpg
    favicon.svg
```

---

## 🧰 Built-in behaviour

* Sticky header with active-section highlighting; sticky Apply/Telegram/Support bar on mobile
* Scroll-reveal animations that switch off automatically for visitors who prefer reduced motion
* Form validation with inline errors, a success state and a WhatsApp fallback
* One-tap conversion tracking: any Telegram button counts once per visitor; WhatsApp support is excluded
* Cookie consent banner available as a single config flag, with the pixel gated behind it
* All content remains visible if JavaScript is blocked
* Print-friendly legal pages
