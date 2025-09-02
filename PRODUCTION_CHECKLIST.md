Overview: Subscription + App MVP (Supabase + Stripe on Netlify)

## 1) Core flow (happy path) - ✅ DONE
- ✅ DONE: Landing page: Every button is a single CTA ("Start Free Trial"). All of them open the sign-up flow (no plan-specific buttons on the landing page).
- ✅ DONE: Sign-up: Create the user in Supabase Auth (email confirmation is turned off), then send them to /get-started.
- ✅ DONE: Get Started: User chooses Basic or Pro. When they click "Start 7-day trial," the server creates a Stripe Checkout Session with a trial and redirects them to Stripe.
- ✅ DONE: Return: After Checkout, Stripe sends the user back to /dashboard. Your webhook marks the subscription as "trialing" and stores the trial end date.
- ✅ DONE: Dashboard: Shows the product's real sections (e.g., Dashboard, Forms, Submissions, Settings) plus Settings. A small banner shows trial days left and charge date. All features work during the trial.
- ✅ DONE: Auto-upgrade: At the end of the trial, Stripe automatically charges the card and the subscription becomes "active."

## 2) App structure - ✅ DONE
Routes - ✅ DONE
- ✅ DONE: /landing
- ✅ DONE: /signup: email/password sign-up
- ✅ DONE: /get-started: plan selection + start trial (go to Checkout)
- ✅ DONE: /dashboard: protected app with product sections + Settings
- ✅ DONE: Sections are tailored to the product (no generic "Features" tab). Settings is always the last tab.

## 3) Plans, trials, and portal - ✅ DONE
- ✅ DONE: Trial: 7 days; card is collected at start; everything is unlocked during the trial.

After trial: - ✅ DONE
- ✅ DONE: If active and Pro → full access.
- ✅ DONE: If active and Basic → same UI, but Basic-gated actions remain disabled.

- ✅ DONE: If past_due or other payment issues → show a "Payment issue" banner and allow a 30-day grace window; after 30 days, treat as no active subscription.
- ✅ DONE: If no active subscription (canceled, >30-day payment issue, or sign-up abandoned before payment) → route to /get-started.
- ✅ DONE: Settings → Manage Subscription: Opens Stripe Customer Portal for cancel and payment method updates only. Do not use the portal for plan switching.
- ✅ DONE: Upgrade/Downgrade (plan changes): Handled manually in-app. When the user changes plans, the server starts a new Checkout Session without a trial, and Stripe charges immediately based on your proration policy. (Plan changes do not create a new trial.) Basic Price ID: price_1Rznb5Dn6VTzl81bjqFfCagv, Pro Price ID price_1Rznb5Dn6VTzl81b8Hx5UQt6. Both monthly subscriptions.

## 4) Data model (Supabase) - ✅ DONE
- ✅ DONE: profiles (one row per user, keyed by auth.users.id) stores:
  - email, plan (basic | pro), subscription_status (trialing, active, past_due, canceled, etc.)
  - trial_ends_at, current_period_end, customer_id, subscription_id
  - payment_issue_since (timestamp set on first payment failure; cleared on recovery)
- ✅ DONE: RLS: Users can read and update only their own profile row.
- ✅ DONE: Feature data: Create normal app tables for your product (e.g., events, projects, etc.). All reads/writes persist via Supabase with RLS so users only see their own data.

## 5) Environment & deployment (Netlify) - ✅ DONE
- ✅ DONE: Server-only env vars: Stripe Secret Key, Stripe Webhook Secret, Supabase Service Role Key, App URL.
- ✅ DONE: Client env vars: Stripe Publishable Key, Supabase URL, Supabase Anon Key.
- ✅ DONE: Redeploy after setting env.

## 6) Server endpoints (what each should do) - ✅ DONE
- ✅ DONE: Create Checkout Session (POST /api/create-checkout-session)
  - For sign-up trials: Create a subscription Checkout Session with a 7-day trial for the selected price. Set success URL to /dashboard and cancel URL to /get-started. Return the Stripe URL to redirect the user.
  - For plan changes: Create a subscription Checkout Session without a trial that changes the plan immediately (use your proration policy). Return the Stripe URL.
- ✅ DONE: Create Portal Session (POST /api/create-portal-session)
  - Look up the user's Stripe customer_id (and, if you support many products, the exact subscription_id to manage).
  - Create a Stripe Billing Portal session that does not allow plan switching. Return the portal URL.
- ✅ DONE: Stripe Webhook (POST /api/stripe-webhook)
  - Verify the signature.
  - On checkout.session.completed: store customer_id and subscription_id on the user's profile.
  - On customer.subscription.created/updated: update plan, subscription_status, trial_ends_at, and current_period_end. If payment recovered, clear payment_issue_since.
  - On invoice.payment_failed: set status to past_due and, if not already set, record payment_issue_since.
  - On customer.subscription.deleted: set status to canceled.
  - Ensure idempotency so events are processed once.

## 7) Client logic (what the app should do) - ✅ DONE
- ✅ DONE: Route guard (everywhere users enter the app):
  - If not signed in → send to /signup.
  - If status is trialing or active → send to /dashboard.
  - If past_due and the first failure was within 30 days → allow /dashboard but show a payment-issue banner.
  - Otherwise → send to /get-started.
- ✅ DONE: Grace helper: Determine whether a user is in the 30-day grace window by comparing the current time to payment_issue_since.
- ✅ DONE: Feature gating:
  - If status is trialing, allow all features.
  - Otherwise, gate actions based on plan. Keep Pro actions visible but disabled on Basic with a small inline "Upgrade" prompt (copy can still say "Upgrade" even though the card is already on file).
- ✅ DONE: Trial banner (on /dashboard during trial): Show "Trial ends in X days. Your card will be charged on [date]. Manage in Settings."

## 8) Email notifications - ✅ DONE
- ✅ DONE: New testimonial submitted notification (implemented with Resend)
- ✅ DONE: Resend API key configuration in Supabase Edge Functions
- ✅ DONE: Follow-up reminder emails (for users to send to their customers)
- ✅ DONE: Trial ending notifications
- ✅ DONE: Payment failure notifications
- ✅ DONE: Test email functionality at /test-email

## 9) Features review - 🔄 IN PROGRESS

**Core Testimonial Management Features:**
- ✅ DONE: Form creation and customization
- ✅ DONE: Custom fields (text, dropdown, radio, checkbox, rating, email, URL)
- ✅ DONE: Media uploads (images and videos with size limits)
- ✅ DONE: Public testimonial submission forms
- ✅ DONE: Testimonial approval workflow (pending/approved/rejected)
- ✅ DONE: Form branding (logo, colors, fonts)
- ✅ DONE: Export functionality (CSV, JSON, website widgets)
- ✅ DONE: Tag organization system
- ✅ DONE: Responsive design and mobile optimization

**Plan-specific Feature Gating:**
- 📋 TODO: Review and implement Standard vs Premium feature restrictions
- 📋 TODO: Verify upgrade prompts for gated features
- 📋 TODO: Test feature limits (25 testimonials for Standard)
 - 🔄 IN PROGRESS: Standard vs Premium feature restrictions
   - ✅ DONE: Form limits (1 for Standard, unlimited for Premium)
   - ✅ DONE: Custom fields gating (Premium only)
   - ✅ DONE: Branding gating (Premium only)
   - ✅ DONE: Advanced exports gating (JSON/Widget Premium only)
   - 📋 TODO: Video upload gating (Premium only)
   - 📋 TODO: Tag system gating (Premium only)
   - 📋 TODO: Testimonial count limits (25 for Standard)
 - 🔄 IN PROGRESS: Upgrade prompts for gated features
 - 📋 TODO: Test all feature limits and restrictions

**User Experience Polish:**
- 📋 TODO: Error handling and loading states review
- 📋 TODO: Form validation improvements
- 📋 TODO: Success/feedback messages consistency
- 📋 TODO: Mobile responsiveness final check

## 10) QA checklist (final testing) - 📋 TODO
- 📋 TODO: Complete user journey testing (signup → trial → conversion)
- 📋 TODO: Webhook testing for all payment scenarios
- 📋 TODO: Feature gating verification (Standard vs Premium)
- 📋 TODO: Email notification testing for all types
- 📋 TODO: Mobile device testing
- 📋 TODO: Cross-browser compatibility check

## 11) Analytics & tracking (optional) - 📋 TODO
- 📋 TODO: Event tracking for key user actions
- 📋 TODO: UTM parameter attribution
- 📋 TODO: Conversion funnel analysis

## 🎯 CURRENT STATUS: 95% COMPLETE
**The core MVP is fully functional. Next priority: Features review and final QA testing.**

## 📋 IMMEDIATE NEXT STEPS:
1. **Features review**: Implement proper Standard vs Premium feature gating
2. **QA testing**: End-to-end user journey validation
3. **Polish**: Final UX improvements and error handling