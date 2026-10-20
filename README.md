# Shubhada Birthday Website

Peach-and-white, mobile-friendly birthday keepsake for Shubhada. Opening the surprise triggers a short, restrained confetti moment and reveals the birthday wish. Memories appear in a scrolling editorial gallery. A warm-hug panel appears when the visitor reaches the end. Replies and hug events are sent to Google Sheets through the Vercel API.

## Deploy
1. Open the linked Google Sheet and choose Extensions → Apps Script.
2. Paste `apps-script/Code.gs`, save.
3. In Apps Script Project Settings → Script Properties, set `API_SECRET` to a long random secret (32+ characters).
4. Deploy → New deployment → Web app. Execute as **Me**, access **Anyone**. Copy the URL ending in `/exec`.
5. In Vercel Project Settings → Environment Variables, set `SHEETS_WEB_APP_URL` to that `/exec` URL and `SHEETS_API_SECRET` to the same secret. Redeploy.
6. Import this repository into Vercel. Make sure `assets/` includes `photo1.jpg` to `photo9.jpg` and `memory.mp4`.

Google Sheet: https://docs.google.com/spreadsheets/d/1B63-nILpK253yTuLSbLKOIvX-_7GL9X0_ze36vL8fEQ/edit

The Apps Script creates a `Replies` tab when first used. Keep the spreadsheet private. WhatsApp notifications are not enabled.
