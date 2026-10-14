# Kanak AI frontend recovery

Recovered on 14 October 2026 from the existing Vercel deployment. No live deployment or repository was changed.

## Open and edit

Open `editable-site/index.html` in a browser. Edit that file for content, `styles.css` for design, and `app.js` for behavior. Fonts are included locally. For a local web preview, run from this folder:

```
python3 -m http.server 8765 --bind 127.0.0.1 --directory editable-site
```

Then open http://127.0.0.1:8765/ . `original-index.html` preserves the recovered served HTML.

## Recovery and secure SSL fix

`recover.py` downloads from the deployment's public alias, checks that it received the actual Kanak AI page, and separates its CSS and JavaScript. It explicitly uses the trusted certifi CA bundle, with the macOS `/etc/ssl/cert.pem` bundle as a fallback. TLS certificate and hostname verification remain enabled. This fixes the recovery script's missing Python default certificate file without changing system settings. Run `python3 recover.py` to refresh the files; this replaces the editable copy, so preserve your edits first.

## Recoverable scope and gaps

- Authenticated Vercel inspection identified production deployment `dpl_Gp1NBsEV6S8SHnNFW47k6BCByXab`, project `kanak-ai-site`. Its source tree contains `src/index.html` and two payment API scripts. There is no Git source metadata in the returned deployment details.
- The connected GitHub repository `kanakmay26-dotcom/KanakAi` is empty. The other accessible repositories concern separate trading dashboards and were not copied.
- All recovered frontend markup, inline SVG graphics, inline favicon, CSS, JavaScript, and ten font files are included.
- The three `proof/live-account-*.png` images referenced in the HTML return HTTP 404 in the live deployment, including authenticated requests. They could not be recovered and are not fabricated.
- TradingView is a remote embedded service and requires internet access. Verification blocked external network requests intentionally, so its preview is blank.
- The frontend checkout calls `POST /api/create-invoice`. This static backup has no payment API, credentials, webhook service, or operational checkout. Server code and all environment/authentication secrets are excluded. Contact uses the original mailto behavior.
- The old `recovered-site` folder in Downloads contains Vercel login-page assets. It is preserved but is not part of this backup. Use `editable-site` instead.

## Verification

Local Chrome checks passed: all four main views, theme switch, product detail and back navigation, legal modal, mobile menu, no horizontal overflow at 390px, and no uncaught JavaScript errors. See `verification.json`. The original HTML is preserved; missing images and backend services remain documented limitations. No invoice was created, email sent, or payment initiated.

`SHA256SUMS.json` records every included file's integrity hash. The ZIP was tested for archive integrity before delivery.
