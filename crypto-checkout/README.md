# Kanak Algo’s redesign and Sq9 Origin launch preview

Source assets in `public/`; server checkout in `worker/checkout.mjs`. Build with `node scripts/build-payment.mjs` to produce a Worker ESM artifact in `dist/server/index.js`. This is a separate owner-private preview; the existing Vercel deployments and payment APIs are unchanged.

Sq9 Origin prices supplied by owner: $25 USD/month and $311 USD/year. These are presented as supplied, without an annual discount claim. Plan enquiries open the visitor's email app; no email is sent automatically. All seven paid tiers now support NOWPayments hosted invoices through a server-side proxy to the existing Vercel invoice backend. Monthly and yearly access requires a new payment on renewal; automatic crypto debits are not enabled. Included access, activation, renewal and cancellation terms require confirmation with support.

The server chooses fixed catalogue prices, requires same-origin JSON requests and a delivery email, validates returned NOWPayments URLs, and keeps payment credentials outside the source. Original payment processing and webhook handling remain on the existing Vercel backend. No live Vercel code or credentials were changed. Access delivery remains subject to payment verification and support activation.

Sq9 live terminal inspection on 14 October 2026 showed an example anchor and awaiting ephemeris data. The supplied Pine v8 uses JPL approximate orbital elements plus a separate lunar series, not DE442s. Its external event-input compatibility is not verified. The calculator implements only the supplied geometric level formula, with automatic price scaling; it is not a live market feed or astronomy engine.

The original recovery remains in the GitHub repository. No indicator source is included in the published site.
