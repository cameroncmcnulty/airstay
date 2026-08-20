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

- Domain: https://airstay.ca (and https://www.airstay.ca)
- GitHub: https://github.com/cameroncmcnulty/airstay
- Vercel project (TREAD BROS team): https://vercel.com/tread-bros/airstay
- Vercel production: https://airstay-tread-bros.vercel.app

The Vercel project `tread-bros/airstay` is connected to the GitHub repo, so pushes to `main` redeploy. In the Vercel dashboard, switch the team (top left) to **TREAD BROS** — the project is not on the personal Hobby account.

## Deploy

```bash
npm run build
npx vercel --prod --yes
```
