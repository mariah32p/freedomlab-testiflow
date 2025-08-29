# TestiFlow Production Deployment Checklist

## Overview
This checklist guides you through deploying TestiFlow from mock/demo mode to full production with real authentication and Stripe payments.

## Prerequisites
- [ ] Supabase project created and configured
- [ ] Stripe account set up with products configured
- [ ] Domain name ready (optional but recommended)

## 1. Environment Configuration

### Supabase Setup
- [ ] Click "Connect to Supabase" button in the top right of the editor
- [ ] Verify `.env` file contains:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Test Supabase connection in browser console

### Stripe Configuration
- [ ] Add Stripe environment variables to `.env`:
  - `VITE_STRIPE_PUBLISHABLE_KEY` (from Stripe Dashboard)
- [ ] Add Stripe secret keys to Supabase Edge Functions environment:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- [ ] Update `src/stripe-config.ts` with your actual Stripe Price IDs:
  - Replace `price_1Rznb5Dn6VTzl81bjqFfCagv` with your Basic plan price ID
  - Replace `price_1Rznb5Dn6VTzl81b8Hx5UQt6` with your Pro plan price ID

## 2. Database Setup

### Run Migrations
The following tables should already exist from the schema:
- [ ] `stripe_customers` - Links users to Stripe customer IDs
- [ ] `stripe_subscriptions` - Tracks subscription status
- [ ] `stripe_orders` - Records one-time payments

### Verify RLS Policies
- [ ] Test that users can only see their own data
- [ ] Verify unauthenticated users cannot access protected data

## 3. Stripe Webhook Configuration

### Set Up Webhook Endpoint
- [ ] In Stripe Dashboard, add webhook endpoint:
  - URL: `https://[your-supabase-project].supabase.co/functions/v1/stripe-webhook`
  - Events to send:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `payment_intent.succeeded`

### Test Webhook
- [ ] Use Stripe CLI or Dashboard to send test events
- [ ] Verify webhook receives and processes events correctly
- [ ] Check Supabase logs for any errors

## 4. Enable Production Mode

### Update App Configuration
- [ ] Change `src/config/app.ts`:
  ```typescript
  ENABLE_REAL_AUTH: true  // Change from false to true
  ```

### Test Authentication Flow
- [ ] Test user signup with real email
- [ ] Test user login
- [ ] Test password reset (if implemented)
- [ ] Verify user sessions persist correctly

## 5. Test Payment Flow

### Subscription Testing
- [ ] Test Basic plan subscription signup
- [ ] Test Pro plan subscription signup
- [ ] Verify subscription data appears in dashboard
- [ ] Test subscription cancellation (if implemented)

### Payment Verification
- [ ] Check Stripe Dashboard for test payments
- [ ] Verify customer data syncs to Supabase
- [ ] Test webhook event processing

## 6. Final Deployment

### Build and Deploy
- [ ] Run `npm run build` to verify no errors
- [ ] Deploy to your hosting platform
- [ ] Test all flows on production URL

### Post-Deployment Testing
- [ ] Test complete user journey: signup → pricing → payment → dashboard
- [ ] Verify all environment variables are set correctly
- [ ] Test error handling (invalid payments, network issues)
- [ ] Check browser console for any errors

## 7. Monitoring and Maintenance

### Set Up Monitoring
- [ ] Monitor Supabase logs for authentication errors
- [ ] Monitor Stripe webhook delivery
- [ ] Set up error alerting (optional)

### Documentation
- [ ] Document any custom configurations
- [ ] Update team on new environment variables
- [ ] Create backup/recovery procedures

## Rollback Plan

If issues occur after enabling production mode:

1. **Quick Rollback**: Change `ENABLE_REAL_AUTH: false` in `src/config/app.ts`
2. **Redeploy**: Push the change to restore mock mode
3. **Debug**: Fix issues in development environment
4. **Re-enable**: Set `ENABLE_REAL_AUTH: true` when ready

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Stripe Integration Guide**: https://stripe.com/docs/checkout
- **TestiFlow Support**: Check project documentation or contact development team

---

**Note**: Keep this checklist updated as you add new features or modify the deployment process.