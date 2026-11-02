# Born For website

Two pages: `/` introduces Born For; `/discover/` runs a birthday → character → career selection → life teaser. It collects no email addresses. Birthday processing stays in tab memory and is never sent to the counter API or saved in browser storage.

## Local development

Use Node 24. From `website/`:

```sh
npm ci
npm run dev
```

Vite serves both pages and `/api/likes`. Local development uses a real SQLite database at `.data/likes.sqlite`; the anonymous cookie signing key is retained in `.data/cookie-secret`. Both are ignored by Git. The shared counter begins at **117**, increments atomically once per signed browser cookie, and survives local server restarts. `npm run build && npm run preview` tests the production frontend with the same local API.

```sh
npm test
npm run build
```

## Deploy to Vercel and connect your domain

1. Push this branch to GitHub. In Vercel choose **Add New → Project**, import the repository, and select the branch containing this website.
2. Set **Root Directory** to `website`. Framework: **Vite**. Build command: `npm run build`. Output: `dist`. Node: **24.x**. The directory is self-contained: no files outside the project root are needed during deployment.
3. Create an Upstash Redis database (available through the Vercel Marketplace or Upstash). In Vercel's project environment settings add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from its REST API settings. Add a random `LIKE_COOKIE_SECRET` of at least 32 characters (`openssl rand -hex 32`). These are server-only credentials; never put them in frontend code or chat. For separate preview counts, set a different `LIKES_NAMESPACE` in preview environments.
4. Deploy. `/api/likes` is a Vercel Node function; it uses a single atomic Redis script to initialize the counter at 117 and prevent duplicate likes. Initialization never resets an existing count. If storage isn't configured or is unavailable, the UI reports that the live count is unavailable and offers retry. It does not simulate a successful like.
5. In **Project → Settings → Domains**, add the domain you own and optionally `www`. Enter exactly the DNS records Vercel provides at your domain provider. Wait for domain verification; Vercel provisions HTTPS. No domain transfer is needed.
6. Verify `/`, a direct visit to `/discover/`, and `/api/likes` on the real domain. Like once, reload, and confirm it remains liked. A separate browser should see the updated shared count. Future pushes to the chosen production branch can deploy automatically.

The Redis adapter and local SQLite store are exercised by automated tests. Live Upstash authorization, Vercel deployment and custom-domain DNS require the project owner's accounts/settings and have not been performed in this workspace.

The counter represents **117 starting sparks plus anonymous browser likes**, not verified unique humans. A signed HttpOnly SameSite cookie remembers a browser's vote. Clearing cookies or using another browser allows another vote. There are no accounts or mailing lists. Monitor usage and enable hosting-level rate limits if needed.

## App source of truth

This site was created on a branch from main at `28c3d3f`. Data and artwork are copied into the website so it deploys independently. `src/generated/app-data.json` holds the main app's twelve signs, 16 starting attributes, 99 careers and the first scene of each career. `src/generated/birthday.js` is bundled from the app's astronomical sign calculation, including cusp detection. Nothing in the app was edited for this site.

After updating main, with the full repository checked out, run `npm run sync:app` inside `website/`, inspect generated changes, then rebuild. This refreshes the data, birthday helper and approved avatar/terrain assets. The landing page uses **Leo / The Champion** as its featured example. In the FiveThirtyEight [US SSA births dataset, 2000–2014](https://github.com/fivethirtyeight/data/tree/master/births), classifying dates at noon UTC using the app's `signAt` calculation gives Leo the largest total (5,580,362), ahead of Virgo and Cancer. This is a US birth-frequency proxy, not a claim of universal popularity, and the public page labels it only as an example.

Self-hosted Cormorant Garamond and DM Sans are provided through Fontsource packages under the SIL Open Font License. Avatar and terrain illustrations are the app's existing Born For artwork. The website logo is an unchanged copy of `assets/images/Born for logo.png`, used in the site header, footer, phone preview and browser icons. No third-party image, font, analytics or marketing services are contacted by the visitor's browser.
