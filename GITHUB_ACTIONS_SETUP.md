# GitHub Actions Auto-Deployment Setup

## Quick Setup (2 minutes)

### Step 1: Add Secrets to GitHub

1. Go to your repository: https://github.com/pretamane/pretamane-website
2. Click **"Settings"** (top menu)
3. Click **"Secrets and variables"** → **"Actions"** (left sidebar)
4. Click **"New repository secret"**

### Step 2: Add First Secret

**Name**: `CLOUDFLARE_API_TOKEN`
**Value**: `owrWwvDMbECEVtA3NTwItOxguTO1Zsb_PiQNeTRe`
Click **"Add secret"**

### Step 3: Add Second Secret

**Name**: `CLOUDFLARE_ACCOUNT_ID`
**Value**: `d4cce76b1a4f91b589da3c2d627308ff`
Click **"Add secret"**

### Step 4: Verify Secrets

You should see both secrets listed:
- ✅ `CLOUDFLARE_API_TOKEN`
- ✅ `CLOUDFLARE_ACCOUNT_ID`

---

## How It Works

### Automatic Deployment

Every time you push to `main` branch:
1. GitHub Actions triggers
2. Checks out your code
3. Deploys to Cloudflare Pages
4. Your site updates automatically

### Manual Deployment

You can also trigger manually:
1. Go to **"Actions"** tab
2. Select **"Deploy to Cloudflare Pages"** workflow
3. Click **"Run workflow"**
4. Select branch (usually `main`)
5. Click **"Run workflow"**

---

## Testing the Setup

### Test 1: Make a Small Change

```bash
cd pretamane-website
# Make a small change to index.html (add a comment)
git add .
git commit -m "Test auto-deployment"
git push origin main
```

### Test 2: Check GitHub Actions

1. Go to **"Actions"** tab in GitHub
2. You should see a workflow run starting
3. Click on it to see progress
4. Wait 1-2 minutes for deployment

### Test 3: Verify Site Updated

Visit: https://thaw-zin-portfolio.pages.dev
Your changes should be live!

---

## Workflow File Location

`.github/workflows/cloudflare-pages.yml`

This file is already committed and ready to use once secrets are added.

---

## Troubleshooting

### Issue: Workflow fails with "secret not found"
**Solution**: Make sure secrets are added exactly as:
- `CLOUDFLARE_API_TOKEN` (case-sensitive)
- `CLOUDFLARE_ACCOUNT_ID` (case-sensitive)

### Issue: Deployment fails
**Solution**: 
- Check Cloudflare API token has correct permissions
- Verify account ID is correct
- Check workflow logs in GitHub Actions

### Issue: Site not updating
**Solution**:
- Wait 1-2 minutes for deployment
- Check Cloudflare Pages dashboard for deployment status
- Verify workflow completed successfully in GitHub Actions

---

## Current Status

- ✅ Workflow file created: `.github/workflows/cloudflare-pages.yml`
- ✅ Pushed to GitHub
- ⏳ **Action Required**: Add secrets to GitHub (Steps 1-3 above)
- ⏳ After secrets added: Auto-deployment will work on next push

---

## Next Steps

1. ✅ Add secrets to GitHub (2 minutes)
2. ✅ Make a test commit and push
3. ✅ Verify deployment in GitHub Actions
4. ✅ Check site is updated

**Once secrets are added, every push to main = automatic deployment!**

---

**Last Updated**: 2024-11-12

