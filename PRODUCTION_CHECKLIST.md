Overview: Subscription + App MVP (Supabase + Stripe on Netlify)
1) Core flow (happy path)
Landing page: Every button is a single CTA (“Start Free Trial”). All of them open the sign-up flow (no plan-specific buttons on the landing page).
Sign-up: Create the user in Supabase Auth (email confirmation is turned off), then send them to /get-started.
Get Started: User chooses Basic or Pro. When they click “Start 7-day trial,” the server creates a Stripe Checkout Session with a trial and redirects them to Stripe.
Return: After Checkout, Stripe sends the user back to /dashboard. Your webhook marks the subscription as “trialing” and stores the trial end date.
Dashboard: Shows the product’s real sections (e.g., Dashboard, Forms, Submissions, Settings) plus Settings. A small banner shows trial days left and charge date. All features work during the trial.
Auto-upgrade: At the end of the trial, Stripe automatically charges the card and the subscription becomes “active.”

2) App structure
Routes
/landing
/signup: email/password sign-up
/get-started: plan selection + start trial (go to Checkout)
/dashboard: protected app with product sections + Settings
Sections are tailored to the product (no generic “Features” tab). Settings is always the last tab.

3) Plans, trials, and portal
Trial: 7 days; card is collected at start; everything is unlocked during the trial.

After trial:
If active and Pro → full access.
If active and Basic → same UI, but Basic-gated actions remain disabled.

If past_due or other payment issues → show a “Payment issue” banner and allow a 30-day grace window; after 30 days, treat as no active subscription.
If no active subscription (canceled, >30-day payment issue, or sign-up abandoned before payment) → route to /get-started.
Settings → Manage Subscription: Opens Stripe Customer Portal (https://billing.stripe.com/p/login/28E28r3f7fJDc9y7sG5os00) for cancel and payment method updates only. Do not use the portal for plan switching.
Upgrade/Downgrade (plan changes): Handled manually in-app. When the user changes plans, the server starts a new Checkout Session without a trial, and Stripe charges immediately based on your proration policy. (Plan changes do not create a new trial.) Basic Price ID: price_1Rznb5Dn6VTzl81bjqFfCagv, Pro Price ID price_1Rznb5Dn6VTzl81b8Hx5UQt6. Both monthly subscriptions.

4) Data model (Supabase)
profiles (one row per user, keyed by auth.users.id) stores:
email
plan (basic | pro)
subscription_status (trialing, active, past_due, canceled, etc.)
trial_ends_at, current_period_end
customer_id, subscription_id
payment_issue_since (timestamp set on first payment failure; cleared on recovery)
RLS: Users can read and update only their own profile row.

Feature data: Create normal app tables for your product (e.g., events, projects, etc.). All reads/writes persist via Supabase with RLS so users only see their own data.

5) Environment & deployment (Netlify)
Server-only env vars: Stripe Secret Key, Stripe Webhook Secret, Supabase Service Role Key, App URL.
Client env vars: Stripe Publishable Key, Supabase URL, Supabase Anon Key.
Redeploy after setting env.

6) Server endpoints (what each should do)
Create Checkout Session (POST /api/create-checkout-session)
For sign-up trials: Create a subscription Checkout Session with a 7-day trial for the selected price. Set success URL to /dashboard and cancel URL to /get-started. Return the Stripe URL to redirect the user.
For plan changes: Create a subscription Checkout Session without a trial that changes the plan immediately (use your proration policy). Return the Stripe URL.
Create Portal Session (POST /api/create-portal-session)
Look up the user’s Stripe customer_id (and, if you support many products, the exact subscription_id to manage).
Create a Stripe Billing Portal session that does not allow plan switching. Return the portal URL.
Stripe Webhook (POST /api/stripe-webhook)
Verify the signature.
On checkout.session.completed: store customer_id and subscription_id on the user’s profile.
On customer.subscription.created/updated: update plan, subscription_status, trial_ends_at, and current_period_end. If payment recovered, clear payment_issue_since.
On invoice.payment_failed: set status to past_due and, if not already set, record payment_issue_since.
On customer.subscription.deleted: set status to canceled.

Ensure idempotency so events are processed once.

7) Client logic (what the app should do)
Route guard (everywhere users enter the app):
If not signed in → send to /signup.
If status is trialing or active → send to /dashboard.
If past_due and the first failure was within 30 days → allow /dashboard but show a payment-issue banner.
Otherwise → send to /get-started.
Grace helper: Determine whether a user is in the 30-day grace window by comparing the current time to payment_issue_since.

Feature gating:
If status is trialing, allow all features.
Otherwise, gate actions based on plan. Keep Pro actions visible but disabled on Basic with a small inline “Upgrade” prompt (copy can still say “Upgrade” even though the card is already on file).
Trial banner (on /dashboard during trial): Show “Trial ends in X days. Your card will be charged on [date]. Manage in Settings.”

8) Analytics & notifications (nice to have)

Events to track: landing CTA click, sign-up completed, Get Started viewed, Checkout started, Checkout completed, trial started, trial ends soon, trial converted/charged, payment failed, grace started, grace resolved, subscription canceled, plan changed.
Attribution: carry ?src= and UTM params from landing to sign-up and store on profile or in an analytics system.
Emails (via Stripe or your tool): trial started, trial ending soon, payment failed, grace ending, cancellation confirmation.

9) QA checklist (condensed)
Sign-up → Get Started → Checkout (trial) → Dashboard works.
Trial banner shows correct days left and charge date.
Webhooks set trialing, then flip to active automatically.
Basic vs Pro gates behave; trial overrides gating.
Payment failure shows banner and starts 30-day grace; after 30 days, the app routes to Get Started.
Settings → Portal handles cancel/payment only.
Plan change triggers a Checkout without a trial and charges immediately per proration rules.
Feature data persists via Supabase with correct RLS.

10) Final “don’t forgets”
Show dates in the user’s timezone when displaying trial_ends_at.
If a user signs up but never finishes Checkout, the next visit should route them to /get-started.
Decide and document your proration policy for plan changes (and reflect it in Settings copy).