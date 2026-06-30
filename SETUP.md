# Go-live setup — making NextHireAI fully real

The app runs in **demo mode** with no keys. To switch auth, payments, and the admin
panel to **real**, create `.env.local` (copy from `.env.example`) and fill in the
values below, then restart `npm run dev`.

---

## 1. Firebase (auth + database) — required for real logins & the admin panel

1. Go to https://console.firebase.google.com → **Add project** (name it e.g. `nexthireai`).
2. **Build → Authentication → Get started** → enable **Email/Password** and **Google**.
3. **Build → Firestore Database → Create database** → Production mode → pick a region.
4. **Project settings (gear) → General →** scroll to *Your apps* → **Web app (</>)** →
   register, then copy the `firebaseConfig` values into `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
5. **Project settings → Service accounts → Generate new private key** (downloads a JSON).
   From that JSON copy:
   ```
   FIREBASE_ADMIN_PROJECT_ID=<project_id>
   FIREBASE_ADMIN_CLIENT_EMAIL=<client_email>
   FIREBASE_ADMIN_PRIVATE_KEY="<private_key — keep the \n exactly as in the JSON, wrapped in quotes>"
   ```
6. Admin panel access:
   ```
   ADMIN_EMAIL=as3331733@gmail.com
   ```
   Sign in with that Google account to open `/admin`.

> After this, real signup/login/Google work, data persists across devices, and `/admin` shows live stats.

---

## 2. Cashfree (payments) — required for real subscriptions

1. Sign up at https://www.cashfree.com → **Payment Gateway** → use **Sandbox/Test** first.
2. **Developers → API Keys** → copy App ID + Secret:
   ```
   CASHFREE_ENV=sandbox
   CASHFREE_APP_ID=...
   CASHFREE_SECRET_KEY=...
   ```
3. **Developers → Webhooks → Add endpoint:**
   `https://YOUR_DOMAIN/api/payments/webhook` (use an ngrok URL while local), then copy
   its signing secret:
   ```
   CASHFREE_WEBHOOK_SECRET=...
   ```
4. Set the app URL so return/redirect links are correct:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000   # or your deployed URL
   ```

> Flow: user clicks a plan → Cashfree checkout → returns to `/billing?order_id=...` →
> server verifies with Cashfree → Pro granted. The webhook grants it even if the user
> closes the tab. Go live by switching `CASHFREE_ENV=production` with production keys.

---

## 3. OpenAI (real AI text) — optional next step

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```
(The AI buttons currently use a local generator; wiring `/api/ai/*` to OpenAI is the
next phase once this key is set.)

---

## 4. Restart

```bash
npm run dev
```

Check `/admin` (signed in as the admin email) — if Firebase is configured you'll see
real visitor/user/payment numbers.
