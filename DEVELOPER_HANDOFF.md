# TestiFlow - Developer Handoff Documentation

## Overview
TestiFlow is a SaaS testimonial management platform that helps businesses collect, manage, and showcase customer testimonials. Built with React + TypeScript, Supabase (database + auth), and Stripe (payments).

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Payments**: Stripe (subscriptions + webhooks)
- **Email**: Resend API (notifications)
- **Deployment**: Netlify (frontend) + Supabase (backend)

## Architecture Overview

### Core User Flow
1. **Landing Page** → Sign up → Choose plan → Stripe checkout (7-day trial)
2. **Dashboard** → Create forms → Share with customers → Collect testimonials
3. **Review & Approve** → Export testimonials → Use in marketing

### Database Schema (Supabase)
- `testimonial_forms` - Collection forms created by users
- `testimonials` - Customer submissions (pending/approved/rejected)
- `form_fields` - Custom questions added to forms
- `form_responses` - Answers to custom questions
- `form_branding` - Logo, colors, fonts for forms
- `testimonial_tags` - Organization tags for testimonials
- `testimonial_tag_assignments` - Many-to-many tag relationships
- `stripe_customers` - Links Supabase users to Stripe customers
- `stripe_subscriptions` - Subscription status and billing info

## Feature Breakdown by Plan

### Standard Plan ($29/month)
**Limits:**
- ✅ Up to 25 testimonials total
- ✅ 1 collection form maximum
- ✅ Image uploads (up to 10MB)
- ✅ Basic approval workflow (pending/approved/rejected)
- ✅ CSV export only
- ✅ Email notifications

**Restrictions:**
- ❌ No custom fields beyond standard (name, email, company, rating, testimonial)
- ❌ No custom branding (uses default TestiFlow branding)
- ❌ No video uploads
- ❌ No JSON/widget exports
- ❌ No tag organization system

### Premium Plan ($49/month)
**Everything from Standard PLUS:**
- ✅ **Unlimited** testimonials and forms
- ✅ **Custom fields** - Add dropdown, radio, checkbox, rating, text fields
- ✅ **Custom branding** - Logo, colors, fonts for forms
- ✅ **Video testimonials** - Upload and display video testimonials
- ✅ **Advanced exports** - JSON data, website widgets, social media posts
- ✅ **Tag organization** - Categorize testimonials with custom tags
- ✅ **Rich media support** - Images + videos in testimonials

## Key Components & Files

### Authentication & Routing
- `src/contexts/AuthContext.tsx` - Supabase auth wrapper
- `src/hooks/useRouteGuard.ts` - Subscription-based route protection
- `src/components/ProtectedRoute.tsx` - Route wrapper for authenticated pages

### Subscription Management
- `src/hooks/useSubscription.ts` - **CRITICAL** - Plan detection and feature gating
- `src/hooks/useStripe.ts` - Stripe checkout and portal integration
- `src/stripe-config.ts` - Product definitions and price IDs

### Core Features
- `src/pages/Forms.tsx` - Form creation and management
- `src/pages/Testimonials.tsx` - Review and approval workflow
- `src/components/FormBuilder.tsx` - Custom field creation (Premium)
- `src/pages/Branding.tsx` - Form customization (Premium)
- `src/pages/Tags.tsx` - Tag management (Premium)
- `src/pages/SubmitTestimonial.tsx` - Public form submission

### Export System
- `src/utils/exportUtils.ts` - CSV, JSON, widget generation
- `src/components/ExportModal.tsx` - Export interface with format selection

## Current Issues & Debugging

### 🚨 CRITICAL ISSUE: Plan Detection Not Working
**Problem**: After upgrading to Premium, user still sees Standard plan features
**Location**: `src/hooks/useSubscription.ts` lines 120-140

**Debug Steps:**
1. Check browser console for logs starting with "useSubscription:"
2. Verify `stripe_subscriptions.price_id` in database matches:
   - Standard: `price_1Rznb5Dn6VTzl81bjqFfCagv`
   - Premium: `price_1Rznb5Dn6VTzl81b8Hx5UQt6`
3. Check if webhook is updating the subscription table

**Potential Fixes:**
- Webhook might not be firing or failing
- Price ID comparison logic might be wrong
- Frontend caching subscription data

### Feature Gating Logic
**File**: `src/hooks/useSubscription.ts`
**Key Function**: `PLAN_LIMITS` object defines what each plan can do

```typescript
const PLAN_LIMITS = {
  standard: {
    maxTestimonials: 25,
    maxForms: 1,
    canUseCustomFields: false,
    canUseBranding: false,
    canUseVideoUploads: false,
    canUseAdvancedExports: false,
    canUseTags: false,
  },
  premium: {
    maxTestimonials: Infinity,
    maxForms: Infinity,
    canUseCustomFields: true,
    canUseBranding: true,
    canUseVideoUploads: true,
    canUseAdvancedExports: true,
    canUseTags: true,
  }
};
```

## Stripe Integration

### Price IDs (CRITICAL)
```typescript
// src/stripe-config.ts
const products = [
  {
    id: 'standard',
    priceId: 'price_1Rznb5Dn6VTzl81bjqFfCagv', // $29/month
    name: 'Standard Plan',
    mode: 'subscription'
  },
  {
    id: 'premium', 
    priceId: 'price_1Rznb5Dn6VTzl81b8Hx5UQt6', // $49/month
    name: 'Premium Plan',
    mode: 'subscription'
  }
];
```

### Webhook Events (Supabase Edge Functions)
**File**: `supabase/functions/stripe-webhook/index.ts`
**Key Events**:
- `checkout.session.completed` - Links customer to user, syncs subscription
- `customer.subscription.updated` - Updates plan changes, billing info
- `invoice.payment_failed` - Marks subscription as past_due

### Database Tables for Stripe
```sql
-- Links Supabase users to Stripe customers
stripe_customers (user_id, customer_id)

-- Stores subscription details
stripe_subscriptions (
  customer_id,
  subscription_id, 
  price_id,        -- THIS determines the plan!
  status,          -- trialing, active, past_due, canceled
  current_period_start,
  current_period_end
)
```

## Email Notifications
**File**: `src/hooks/useEmailNotifications.ts`
**Edge Function**: `supabase/functions/send-notification/index.ts`
**Types**:
- New testimonial notifications (to form owners)
- Trial ending reminders
- Payment failure notices
- Follow-up emails (for customers)

## Environment Variables Required

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_RESEND_API_KEY=your_resend_api_key
```

### Supabase Edge Functions
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
APP_URL=your_app_url
```

## Testing Checklist

### Subscription Flow
- [ ] Sign up → redirects to /get-started
- [ ] Choose plan → Stripe checkout opens
- [ ] Complete payment → returns to /dashboard
- [ ] Trial banner shows correct days remaining
- [ ] Upgrade during trial → immediate billing + feature unlock
- [ ] Plan change reflected in Settings page

### Feature Gating
- [ ] Standard users see upgrade prompts for Premium features
- [ ] Premium users have full access to all features
- [ ] Form limits enforced (1 for Standard, unlimited for Premium)
- [ ] Testimonial limits enforced (25 for Standard, unlimited for Premium)

### Core Functionality
- [ ] Create forms with custom branding (Premium)
- [ ] Add custom fields to forms (Premium)
- [ ] Submit testimonials via public form
- [ ] Approve/reject testimonials in dashboard
- [ ] Export testimonials (CSV for all, JSON/Widget for Premium)
- [ ] Tag organization (Premium)

## Common Issues & Solutions

### 1. Plan Not Updating After Upgrade
**Symptoms**: User pays but still sees Standard features
**Debug**: Check browser console for "useSubscription:" logs
**Fix**: Verify webhook is updating `stripe_subscriptions.price_id`

### 2. Features Not Unlocking
**Symptoms**: Premium user sees upgrade prompts
**Root Cause**: `useSubscription.ts` not detecting Premium plan
**Fix**: Check price_id comparison logic

### 3. Webhook Failures
**Symptoms**: Payments succeed but database not updated
**Debug**: Check Supabase Edge Function logs
**Fix**: Verify webhook secret and endpoint configuration

### 4. Email Notifications Not Sending
**Symptoms**: No emails received for new testimonials
**Debug**: Test at `/test-email` route
**Fix**: Check Resend API key configuration

## Development Commands
```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Deploy to Netlify (automatic via git push)
git push origin main
```

## Production Deployment
- **Frontend**: Auto-deploys to Netlify on git push
- **Backend**: Supabase Edge Functions auto-deploy when connected
- **Database**: Migrations in `supabase/migrations/` auto-apply

## Support & Maintenance
- Monitor Stripe webhook delivery in Stripe dashboard
- Check Supabase logs for Edge Function errors
- Monitor email delivery in Resend dashboard
- Review user feedback for UX improvements

---

**Next Developer Priority**: Fix the subscription plan detection issue in `useSubscription.ts` - this is blocking Premium feature access after successful upgrades.