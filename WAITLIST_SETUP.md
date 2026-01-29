# Waitlist System Setup Guide

This project includes a complete waitlist system powered by Supabase. Follow these steps to get it running.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be provisioned (~2 minutes)

## 2. Set Up the Database

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to create the waitlist table and policies

This will create:
- `waitlist` table with email, source, and timestamp fields
- Row Level Security (RLS) policies for anonymous inserts/selects
- Indexes for performance
- Helper functions for analytics

## 3. Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy your **anon/public key** (starts with `eyJ...`)

## 4. Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

## 5. Test the Integration

1. Start your dev server: `npm run dev`
2. Visit any of these pages:
   - `/waitlist` - Dedicated waitlist page
   - `/` - Landing page footer
   - `/results` - After completing a test
3. Try signing up with your email
4. Check your Supabase dashboard → **Table Editor** → `waitlist` to see the entry

## Waitlist Locations

The waitlist appears in three places:

### Primary: Results Page (`/results`)
- Compact variant
- Shows after completing a test
- Source: `results`

### Secondary: Landing Page Footer (`/`)
- Full variant with features
- Always visible at bottom
- Source: `landing`

### Tertiary: Dedicated Waitlist Page (`/waitlist`)
- Full variant with timeline and benefits
- Shareable link
- Source: `waitlist_page`

## Database Schema

```sql
waitlist (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL, -- 'results' | 'landing' | 'waitlist_page'
  created_at TIMESTAMP DEFAULT NOW()
)
```

## Security Features

- **RLS Enabled**: Row Level Security prevents unauthorized access
- **Email Validation**: Client and server-side validation
- **Duplicate Prevention**: Database-level unique constraint
- **Lowercase Storage**: All emails stored in lowercase
- **Anonymous Access**: Users can join without authentication

## Analytics

View waitlist stats in Supabase:

```sql
-- Total signups
SELECT COUNT(*) FROM waitlist;

-- Signups by source
SELECT source, COUNT(*) as count
FROM waitlist
GROUP BY source
ORDER BY count DESC;

-- Recent signups
SELECT email, source, created_at
FROM waitlist
ORDER BY created_at DESC
LIMIT 10;
```

## Export Waitlist

To export all emails:

```sql
SELECT email, source, created_at
FROM waitlist
ORDER BY created_at DESC;
```

Then click "Download CSV" in the Supabase SQL Editor.

## Troubleshooting

**Error: "Database error"**
- Check that you ran the schema SQL in Supabase
- Verify your environment variables are correct
- Check Supabase dashboard for any issues

**Error: "Email already registered"**
- This is expected behavior - each email can only join once
- Check the `waitlist` table in Supabase to confirm

**No emails appearing in Supabase**
- Check browser console for errors
- Verify API route is working: `/api/waitlist`
- Ensure RLS policies are set up correctly

## Next Steps

Once you have waitlist signups, you can:
1. Export the email list for your email marketing platform
2. Send launch announcements
3. Grant early access to beta features
4. Analyze signup sources to optimize marketing

## Component API

```tsx
import { Waitlist } from '@/components/Waitlist'

<Waitlist
  source="results" // or 'landing' or 'waitlist_page'
  variant="compact" // or 'full'
  className="custom-class" // optional
/>
```

## Files Created

- `lib/supabase.ts` - Supabase client configuration
- `app/api/waitlist/route.ts` - API endpoint for submissions
- `components/Waitlist.tsx` - Reusable waitlist component
- `components/Footer.tsx` - Landing page footer with waitlist
- `app/waitlist/page.tsx` - Dedicated waitlist page
- `supabase-schema.sql` - Database schema
- `WAITLIST_SETUP.md` - This setup guide

---

Need help? Check the [Supabase documentation](https://supabase.com/docs) or open an issue.
