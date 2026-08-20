# AIRSTAY

Canada-outbound travel metasearch. Compare **Flights**, **Stays**, **Cars** and **Packages** from Canadian airports. Stays book on AIRSTAY through Duffel with your search details; flights complete on the airline/Aviasales checkout.

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

## Travel API v1

ReservationHub-style unified API under `/api/v1`:

- `POST /api/v1/search/flights`
- `POST /api/v1/search/hotels`
- `POST /api/v1/search/cars`
- `POST /api/v1/search/packages`
- `POST /api/v1/bookings`
- `GET /api/v1/bookings/{id}`
- `POST /api/v1/bookings/{id}/cancel`
- `GET /api/v1/health`

Docs: `/developers`

Live stays and bookable flight prices use Duffel. Travelpayouts supplies the Aviasales checkout link so flights keep your AIRSTAY dates.

Staff dashboard: `/admin` (set `ADMIN_PASSWORD`).

## Live fares

AIRSTAY does **not** scrape Kayak, Expedia, or Booking.com. That would break their terms and produce stale prices.

Package and stay prices come from Duffel Stays (`POST /stays/search`). Book on `/book` using Duffel quote + booking so the dates, guests and hotel from AIRSTAY are the ones reserved.

Flight results use Duffel offer requests when a token is set, with Travelpayouts / Aviasales as the ticket checkout (`marker=564250`).

Copy `.env.example` to `.env.local` and set:

- `DUFFEL_ACCESS_TOKEN` — test token from [Duffel Dashboard → Developers → Access tokens](https://app.duffel.com). Request Duffel Stays access first.
- `TRAVELPAYOUTS_TOKEN` — optional, from [Travelpayouts → Profile → API token](https://www.travelpayouts.com/programs/100/tools/api).

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
