# Bianca & Ajay — Wedding Website

A one-page wedding website — hero, schedule, travel info, and an RSVP form
that writes straight into a Google Sheet. Built with your actual monogram
artwork and the palette pulled from it and your save-the-date illustration.
Plain HTML/CSS/JS, no build step, no framework — deploys as-is to Vercel,
GitHub Pages, or Netlify.

```
index.html            the page (hero, schedule, travel, RSVP)
styles.css             theme — sky blue hero, sage green, dusty rose, cream
script.js               nav toggle + RSVP form logic
config.js               ← paste your Google Sheet endpoint URL here
assets/monogram.png     your logo artwork
apps-script/Code.gs      paste into Google Apps Script (see below)
```

## 1. Connect the Google Sheet

1. Open (or create) the Google Sheet where you want RSVPs to land.
2. **Extensions → Apps Script.**
3. Delete the placeholder code, paste in `apps-script/Code.gs`.
4. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, then authorize when prompted (the "unverified app" warning is
     expected for your own script — **Advanced → Go to project (unsafe)**).
5. Copy the Web app URL (ends in `/exec`) into `config.js`:
   ```js
   const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycb.../exec";
   ```

The first submission auto-creates an **RSVPs** tab with headers.

> If you edit the form fields later, redeploy as the **same** deployment
> (Deploy → Manage deployments → pencil icon → New version) so the URL
> — and `config.js` — don't need to change.

## 2. Push to GitHub

```bash
cd wedding-site
git init
git add .
git commit -m "Wedding website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 3. Deploy on Vercel

1. vercel.com → **Add New → Project** → import the repo.
2. Framework preset: **Other** (no build command / output directory needed).
3. **Deploy.** You'll get a `*.vercel.app` URL right away.

**Custom domain:** in the Vercel project, **Settings → Domains** → add your
domain → Vercel shows you the DNS records to add at your registrar (an A
record + CNAME for a root domain, or just a CNAME for a subdomain like
`www.yourdomain.com`). Propagation is usually minutes, occasionally a few
hours.

## Customizing

- **Colors/fonts** — CSS variables at the top of `styles.css`. The greens
  and pinks are sampled directly from `assets/monogram.png`.
- **Schedule** — edit the event cards in the `#schedule` section of
  `index.html`. Times/venues are intentionally left as "to follow" since
  those weren't finalized; fill them in per event once they are.
- **Travel copy** — `#travel` section in `index.html`.
- **RSVP deadline / events list** — same as before, in the RSVP form markup.
- **Logo** — swap `assets/monogram.png` for a different export any time;
  it's referenced in the hero, the footer, and as the browser favicon.

## Notes on the submission flow

The form posts to the Apps Script Web App using `mode: "no-cors"` — the
standard workaround since Apps Script doesn't return CORS headers to
cross-origin requests. The browser can't read the response back, so the
site shows success once the request is sent rather than after confirming
the row was written. This is reliable in practice; for extra peace of mind,
add `MailApp.sendEmail(...)` inside `doPost` in `Code.gs` to get an email
notification on every RSVP.
