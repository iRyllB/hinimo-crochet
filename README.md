# Hinimo Crochet

Hinimo Crochet is a React and Vite storefront with a Supabase-backed product catalogue,
contact inbox, and admin area.

## Development

Install dependencies and start the local server:

```powershell
npm install
npm run dev
```

Required frontend variables belong in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

## Contact form protection

The public “Leave a note” form uses Cloudflare Turnstile and the
`submit-contact-message` Supabase Edge Function. The Turnstile site key is public;
the Turnstile secret remains an Edge Function secret.

Deploy the function with JWT verification disabled because visitors are not logged in:

```powershell
npx supabase functions deploy submit-contact-message --no-verify-jwt
```

Configure these Supabase Edge Function secrets:

- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret key
- `ALLOWED_ORIGIN`: comma-separated allowed origins, such as
  `https://hinimo-crochet.vercel.app,http://localhost:5173`

Supabase automatically provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge
Functions. Apply `supabase/revoke-public-contact-inserts.sql` once so anonymous clients
cannot bypass CAPTCHA and insert directly into `contact_messages`.

The `supabase/allow-admin-delete-contact-messages.sql` script enables authenticated
admins to delete contact messages.

## Production

Add the three `VITE_` variables to the Vercel project and redeploy after changing them.
The Turnstile widget must allow every hostname where the frontend runs, including the
production hostname and `localhost` for local testing.
