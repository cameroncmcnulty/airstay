# AIRSTAY

Canada-outbound travel metasearch. Compare **Flights**, **Stays**, **Cars** and **Packages** from Canadian airports, then book on partner sites (deeplink / affiliate model).

## Product

- Four search modules with bubble navigation
- Origins limited to Canadian airports
- Partner comparison in **CAD**
- Deal highlights
- Local account (browser) with PIPEDA-style access / export / delete
- EN / FR, cookie consent (opt-in analytics & marketing), CASL marketing checkbox (unchecked)
- Privacy Policy, Terms, Cookie Policy, Accessibility and affiliate disclosure written for Canadian rules (PIPEDA, provincial PIPA, Quebec Law 25, CASL, Competition Act, consumer protection, Charter of the French Language, AODA / WCAG)

AIRSTAY is **not** a travel agency and does not take booking payments.

Legal pages are a compliance-oriented template. Have a Canadian lawyer review them before a commercial launch, and replace `privacy@airstay.ca` / hosting details with your real entity.

## Stack

Next.js 15 · React 19 · Tailwind CSS · TypeScript

## Develop

```bash
npm install
npm run dev
```

## Live

- GitHub: https://github.com/cameroncmcnulty/airstay
- Vercel (production): https://airstay-tread-bros.vercel.app
- Vercel alias: https://airstay-eosin.vercel.app

The Vercel project `tread-bros/airstay` is connected to the GitHub repo, so pushes to `main` redeploy.

## Deploy

```bash
npm run build
npx vercel --prod --yes
```
