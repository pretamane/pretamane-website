# Cloudflare Pages Deployment Troubleshooting

## Common Issues and Solutions

### 1. Check GitHub Secrets
The deployment requires these secrets to be set in GitHub:
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token with Pages permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

**To check/add secrets:**
1. Go to your GitHub repository: https://github.com/pretamane/pretamane-website
2. Click Settings → Secrets and variables → Actions
3. Verify both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` exist

### 2. Get Cloudflare API Token
1. Log in to Cloudflare Dashboard
2. Go to "My Profile" → "API Tokens"
3. Click "Create Token"
4. Use "Edit Cloudflare Workers" template or create custom token with:
   - Account: Cloudflare Pages:Edit permissions
   - Zone Resources: Include All zones (or specific zone)

### 3. Get Cloudflare Account ID
1. Log in to Cloudflare Dashboard
2. Select any domain
3. Scroll down on the Overview page
4. Find "Account ID" in the right sidebar

### 4. Verify Project Name
Current project name in workflow: `thaw-zin-portfolio`
- Check Cloudflare Pages dashboard to verify the exact project name
- Ensure it matches exactly (case-sensitive)

### 5. Check Cloudflare Pages Project Settings
1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your project
3. Go to Settings → Builds & deployments
4. Verify:
   - Build command: (leave empty for static site)
   - Build output directory: `.` or root directory
   - Root directory: `/` or root

### 6. Manual Deployment Test
You can test deployment manually using Wrangler CLI:

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy . --project-name=thaw-zin-portfolio
```

### 7. Check GitHub Actions Logs
1. Go to your GitHub repository
2. Click "Actions" tab
3. Click on the failed workflow run
4. Check the error messages in the logs

### 8. Verify Webhook Integration
1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to Settings → Builds & deployments
4. Check "GitHub Integration" is connected

## Quick Fixes

### If secrets are missing:
Add them to GitHub repository secrets and re-run the workflow.

### If project name is wrong:
Update the `projectName` in `.github/workflows/cloudflare-pages.yml`

### If authentication fails:
Regenerate the Cloudflare API token with proper permissions.

### If deployment succeeds but site doesn't update:
- Check Cloudflare Pages dashboard for deployment status
- Clear browser cache
- Check if custom domain is correctly configured






