# Google Search Console API — 100% Free Autonomous Setup Guide

This guide enables **SettlementCheck's Autonomous SERP Sentinel** to connect directly to Google Search Console (GSC) API, eliminating manual CSV exports entirely.

---

## 1. Cost & Spend Guarantee: **£0.00 / $0.00 (100% Free)**

- **Google Search Console API Pricing**: **Free**. Google does not charge for Search Console API calls on verified properties.
- **Credit Card Required?**: **No**. Standard Google Cloud accounts can create Service Accounts and use the Search Console API without entering billing details.
- **Google API Quota**:
  - **1,200 requests per minute** per project.
  - **100,000,000 queries per day**.
  - SettlementCheck makes **1 to 5 requests per week** (~0.000005% of the free allowance).
- **Email Digest**: Uses your existing free Resend tier (up to 3,000 emails/month; we send ~4 to 30).

**Total Cost: £0.00 / month forever.**

---

## 2. Step-by-Step Setup (Takes ~4 Minutes)

### Step 1: Create Google Cloud Project & Enable GSC API (2 mins)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top → **New Project**.
   - Project Name: `settlementcheck-sentinel` → Click **Create**.
3. In the search bar at the top, type `Google Search Console API` (or Webmasters API).
4. Click on **Google Search Console API** → Click **Enable**.

### Step 2: Create a Service Account & Download Key (1 min)
1. Go to **APIs & Services** → **Credentials** (or **IAM & Admin** → **Service Accounts**).
2. Click **+ Create Credentials** → Select **Service Account**.
   - Service account name: `gsc-sentinel`
   - Service account ID: `gsc-sentinel@settlementcheck-sentinel.iam.gserviceaccount.com`
   - Click **Create and Continue**, then click **Done**.
3. In the Service Accounts list, click the newly created service account email.
4. Go to the **Keys** tab → Click **Add Key** → **Create new key**.
5. Select **JSON** → Click **Create**.
6. A `.json` key file will download to your computer.

### Step 3: Grant Access in Google Search Console (1 min)
1. Open [Google Search Console](https://search.google.com/search-console).
2. Select your property: `https://settlementcheck.co.uk/` (or the domain property).
3. In the left sidebar, click **Settings** (near the bottom) → **Users and permissions**.
4. Click **Add user** (blue button in top right).
5. Paste the Service Account email address:
   `gsc-sentinel@settlementcheck-sentinel.iam.gserviceaccount.com`
6. Permission: Select **Full** (or **Restricted** / Read-only).
7. Click **Add**.

### Step 4: Add Credentials to `.env.local` (30 seconds)
Open the downloaded JSON key file in a text editor. Copy `client_email` and `private_key`, then add them to `.env.local`:

```env
# Google Search Console Autonomous API
GSC_CLIENT_EMAIL="gsc-sentinel@settlementcheck-sentinel.iam.gserviceaccount.com"
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...YOUR_PRIVATE_KEY_HERE...\n-----END PRIVATE KEY-----\n"
GSC_SITE_URL="https://settlementcheck.co.uk/"
SEO_ALERT_EMAIL="your-email@example.com"
```

> **Note on Private Key**: Keep the `\n` characters intact on a single line or enclosed in double quotes.

---

## 3. Immediate Verification

Once credentials are in `.env.local`, run:

```bash
node scripts/sentinel/test-gsc-connection.mjs
```

You will see:
```text
======================================================
🔍 Testing Google Search Console API Connection
======================================================

• Environment Credentials Present: ✅ YES
• Attempting OAuth2 JWT assertion & handshake with Google...
• Handshake Status:  ✅ SUCCESS!
• Data Source:       GSC_LIVE_API
• Verified Site URL: https://settlementcheck.co.uk/
• Queries Retrieved: 295
======================================================
🎉 GSC Integration is active and running autonomously!
======================================================
```

---

## 4. Code Architecture Already in Place

- **API Client**: [`lib/agentic-engine/services/gsc-client.ts`](file:///c:/settlementcheck/lib/agentic-engine/services/gsc-client.ts) (Native JWT OAuth2 auth, zero npm dependencies).
- **Action Service**: [`lib/agentic-engine/services/autonomous-seo-actions.ts`](file:///c:/settlementcheck/lib/agentic-engine/services/autonomous-seo-actions.ts) (Striking distance internal links, meta recalibration, Resend email digest).
- **CLI Runner**: [`scripts/sentinel/serp-sentinel.mjs`](file:///c:/settlementcheck/scripts/sentinel/serp-sentinel.mjs) (`npm run sentinel:serp`).
- **Serverless Endpoint**: [`app/api/cron/serp-sentinel/route.ts`](file:///c:/settlementcheck/app/api/cron/serp-sentinel/route.ts).
- **Test Script**: [`scripts/sentinel/test-gsc-connection.mjs`](file:///c:/settlementcheck/scripts/sentinel/test-gsc-connection.mjs).

---

## 5. Starting the New Chat (Prompt to Copy)

When you open a new chat, paste this prompt:

> "I want to finish connecting Google Search Console API and Google Cloud Service Account for SettlementCheck. Please review `@docs/GSC_AUTOMATION_SETUP_GUIDE.md` and walk me through the setup, verifying credentials using `node scripts/sentinel/test-gsc-connection.mjs`."
