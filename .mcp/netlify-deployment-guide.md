# Netlify Deployment Guide

This guide covers deploying The Hobbinomicon to Netlify with proper form configuration.

## Pre-Deployment Checklist

- [ ] Site builds successfully locally (`npm run build`)
- [ ] Contact form works in development (`npm run dev`)
- [ ] All content is committed to Git
- [ ] Repository is pushed to GitHub/GitLab/Bitbucket

## Initial Deployment

### 1. Connect Repository to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select the `hobbinomicon` repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18 or higher (set in Environment Variables)

### 2. Environment Variables

Set the following in Netlify dashboard under **Site Settings** → **Environment Variables**:

```
NODE_VERSION = 18
```

### 3. Deploy Site

Click "Deploy site" and wait for the build to complete.

## Netlify Forms Configuration

### Automatic Form Detection

Netlify automatically detects forms with the `data-netlify="true"` attribute. The contact form is already configured correctly in `/src/pages/contact.astro`.

### Email Notifications Setup

1. Go to **Site Settings** → **Forms** → **Form notifications**
2. Click "Add notification"
3. Select "Email notification"
4. Configure:
   - **Event to listen for:** New form submission
   - **Email to notify:** `matt@hobbinomicon.com`
   - **Form:** Select "contact"

### Verify Form is Active

1. After deployment, check **Site Settings** → **Forms**
2. You should see the "contact" form listed
3. If not, check build logs for errors

### Test the Form

1. Visit your live site: `https://[your-site-name].netlify.app/contact`
2. Fill out and submit the contact form
3. Check:
   - Form redirects to `/contact-success`
   - Submission appears in Netlify dashboard under **Forms**
   - Email notification arrives at `matt@hobbinomicon.com`

## Spam Protection

The contact form includes:

1. **Honeypot field** - Hidden field that bots fill out
2. **Netlify's built-in spam filtering** - Automatically enabled
3. **reCAPTCHA (Optional)** - Can be enabled in Netlify dashboard

To enable reCAPTCHA:
1. Go to **Site Settings** → **Forms** → **Form detection**
2. Enable reCAPTCHA
3. Add your reCAPTCHA site key and secret key

## Custom Domain Setup

### Add Custom Domain

1. Go to **Site Settings** → **Domain management** → **Add custom domain**
2. Enter `hobbinomicon.com`
3. Follow Netlify's instructions to update DNS records

### DNS Configuration

Update your domain's DNS records to point to Netlify:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site-name].netlify.app
```

### SSL/HTTPS

1. Netlify automatically provisions SSL certificates via Let's Encrypt
2. Go to **Site Settings** → **Domain management** → **HTTPS**
3. Click "Verify DNS configuration"
4. Wait for SSL certificate to be provisioned (usually 1-2 minutes)
5. Enable "Force HTTPS"

## Form Submission Management

### View Submissions

1. Go to your site dashboard on Netlify
2. Click **Forms** in the top navigation
3. Click on "contact" form
4. View all submissions with:
   - Submission date/time
   - Sender name and email
   - Subject and message
   - Spam score

### Export Submissions

1. Go to **Forms** → "contact"
2. Click "Export CSV" to download all submissions

### Delete Spam

1. Go to **Forms** → "contact"
2. Check boxes next to spam submissions
3. Click "Delete selected"

## Continuous Deployment

Netlify automatically rebuilds and deploys when you push to your repository.

### Auto-Deploy Settings

Configure in **Site Settings** → **Build & deploy** → **Continuous deployment**:

- **Production branch:** `main` (or your primary branch)
- **Auto publishing:** Enabled
- **Deploy previews:** Enable for pull requests

### Deploy Contexts

- **Production:** Deploys from `main` branch
- **Deploy previews:** Created for pull requests
- **Branch deploys:** Can be configured for other branches

## Monitoring & Analytics

### Build Notifications

Set up notifications for build failures:
1. **Site Settings** → **Build & deploy** → **Build notifications**
2. Add email or Slack notifications

### Netlify Analytics (Optional)

Enable server-side analytics:
1. **Site Settings** → **Analytics**
2. Enable Netlify Analytics ($9/month)
3. View visitor data without JavaScript

### Form Analytics

View form performance:
1. **Forms** dashboard
2. See submission rates, spam detection stats
3. Track conversion over time

## Troubleshooting

### Form Not Detected

**Problem:** Form doesn't appear in Netlify dashboard after deployment.

**Solution:**
1. Check that `data-netlify="true"` is present in form tag
2. Check that `name="contact"` is in form tag
3. Check build logs for errors
4. Trigger a manual deploy

### Form Submissions Not Received

**Problem:** Form submits but emails aren't received.

**Solution:**
1. Check Netlify dashboard → Forms to see if submission was recorded
2. Verify email notification is configured correctly
3. Check spam folder
4. Verify email address in notification settings

### Build Failures

**Problem:** Site fails to build on Netlify.

**Solution:**
1. Check build logs for specific errors
2. Verify Node version is set to 18+
3. Ensure all dependencies are in `package.json`
4. Test build locally: `npm run build`

### 404 Errors

**Problem:** Pages return 404 errors.

**Solution:**
1. Check that pages exist in `/src/pages/`
2. Verify publish directory is set to `dist`
3. Check build logs for errors
4. Clear cache and trigger new deploy

## Performance Optimization

### Asset Optimization

Netlify automatically:
- Compresses images
- Minifies CSS/JS
- Serves assets from CDN
- Enables HTTP/2

### Additional Optimizations

In **Site Settings** → **Build & deploy** → **Post processing**:
- ✅ Enable asset optimization
- ✅ Enable pretty URLs
- ✅ Enable bundle CSS
- ✅ Enable minify JS

## Security

### Headers

Security headers are configured in `netlify.toml`:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy

### Form Spam Protection

Netlify provides:
- Built-in spam filtering
- Honeypot detection
- Optional reCAPTCHA
- Rate limiting

## Cost Estimate

Netlify offers a generous free tier:

**Free Tier Includes:**
- Unlimited sites
- 100GB bandwidth/month
- 300 build minutes/month
- 100 form submissions/month
- Automatic HTTPS
- Deploy previews

**Paid Plans:**
- More bandwidth if needed
- Additional form submissions
- Analytics
- Team features

For The Hobbinomicon's expected traffic, the free tier should be sufficient.

## Useful Netlify Commands (CLI)

Install Netlify CLI:
```bash
npm install -g netlify-cli
```

Common commands:
```bash
# Deploy to production
netlify deploy --prod

# Deploy preview
netlify deploy

# Run local development with Netlify features
netlify dev

# View form submissions
netlify forms

# Open site dashboard
netlify open
```

## Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Forms Docs](https://docs.netlify.com/forms/setup/)
- [Astro on Netlify Guide](https://docs.astro.build/en/guides/deploy/netlify/)
- [Netlify Support](https://www.netlify.com/support/)

## Maintenance

### Regular Tasks

- **Monthly:** Review form submissions and clean up spam
- **Quarterly:** Review analytics and performance
- **As needed:** Update dependencies and rebuild
- **Before major changes:** Create deploy preview to test

### Backup Strategy

- Repository is your source of truth (Git)
- Form submissions can be exported as CSV
- Consider periodic exports for records
