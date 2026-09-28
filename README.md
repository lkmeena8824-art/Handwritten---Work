# HandWrite Work — Handwriting Work From Home Landing Page

Mobile-responsive landing page for a handwriting work-from-home opportunity, ready for Meta (Facebook) ads.

## Pages

| File               | Kya hai                                        |
|--------------------|------------------------------------------------|
| `index.html`       | Main landing page (Hinglish) — hero, kaam ki jankari, process, FAQ, application form, Telegram + WhatsApp buttons |
| `privacy-policy.html` | Privacy Policy (Hindi + English) — Meta ads compliance ke liye |
| `terms.html`       | Terms & Conditions + Disclaimer (Hindi + English) |

## ⚙️ Sabse Zaroori — Links Update Karein

`assets/js/main.js` file kholiye aur upar `CONFIG` me apni details daaliye:

```js
const CONFIG = {
  telegramUrl: "https://t.me/YOUR_TELEGRAM_CHANNEL",  // ← apna Telegram link
  whatsappNumber: "919999999999",                     // ← apna WhatsApp number (country code ke saath, sirf digits)
  supportEmail: "support@example.com",                // ← apna email
  formEndpoint: "",                                   // ← optional (neeche dekhein)
};
```

Bas! Header, hero, form, footer aur sticky mobile bar ke saare buttons automatic update ho jayenge.

## 📝 Form ke 2 Options

1. **Bina backend (default):** Form validate hokar success dikhata hai, aur "WhatsApp Par Bhejein" button ke through application aapke WhatsApp par prefilled message ke saath aa jati hai. Application browser me backup ke liye `localStorage` me bhi save hoti hai.
2. **Formspree/Basemodels jaisa form endpoint:** Free account banayein, apna form URL `CONFIG.formEndpoint` me daal dein — submission seedha aapke email/dashboard me jayegi.

## 🚀 Hosting

Static site hai — kisi bhi free hosting par deploy kar sakte hain:
- **Netlify / Vercel / GitHub Pages** — folder upload karo, bas.
- Domain lena best rahega (ads ke liye `https://` zaroori hai).

## 📱 Meta Ads Compliance Checklist

- [x] Privacy Policy page (live link footer + form consent me)
- [x] Terms & Conditions + Disclaimer page
- [x] "Not a government job" disclaimer
- [x] Koi income guarantee nahi — "earning depends on your work"
- [x] Consent checkbox (18+ + privacy policy agree) form me
- [x] Clear contact options (WhatsApp, Telegram, Email)
- [x] "Koi fee nahi / hum paise nahi maangte" trust notice
- [x] 100% mobile responsive
- [x] Open Graph tags (ads preview ke liye)

> Suggestion: Ads chalate time `og:image` ke liye page ka final screenshot/hosted image URL daal dein (abhi relative path hai).
