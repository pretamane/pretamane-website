# GitHub Secrets Setup - Quick Reference

## Current Status
- **Workflow**: Deploy to Cloudflare Pages
- **Status**: FAILING - Missing required secrets
- **Run ID**: 19299535131
- **URL**: https://github.com/pretamane/pretamane-website/actions/runs/19299535131

## Required Secrets
The workflow requires these two secrets to deploy to Cloudflare Pages:

1. `CLOUDFLARE_API_TOKEN`
2. `CLOUDFLARE_ACCOUNT_ID`

## Quick Setup (2 minutes)

### Direct Link to Secrets Page
**https://github.com/pretamane/pretamane-website/settings/secrets/actions**

### Steps

1. **Open Secrets Page**
   - Click the link above or navigate: Repository → Settings → Secrets and variables → Actions

2. **Add First Secret**
   - Click "New repository secret"
   - Name: `CLOUDFLARE_API_TOKEN`
   - Secret: `owrWwvDMbECEVtA3NTwItOxguTO1Zsb_PiQNeTRe`
   - Click "Add secret"

3. **Add Second Secret**
   - Click "New repository secret" again
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Secret: `d4cce76b1a4f91b589da3c2d627308ff`
   - Click "Add secret"

4. **Verify Secrets**
   - You should see both secrets listed on the secrets page

5. **Re-run Workflow**
   - Go to: https://github.com/pretamane/pretamane-website/actions
   - Find the failed workflow run
   - Click "Re-run jobs" → "Re-run all jobs"
   - Workflow should now succeed!

## Verification Checklist

- [ ] `CLOUDFLARE_API_TOKEN` secret added
- [ ] `CLOUDFLARE_ACCOUNT_ID` secret added
- [ ] Both secrets visible on secrets page
- [ ] Workflow re-run initiated
- [ ] Workflow completes successfully

## Workflow Configuration

The workflow file `.github/workflows/cloudflare-pages.yml` is correctly configured to use:
- `secrets.CLOUDFLARE_API_TOKEN` (line 19)
- `secrets.CLOUDFLARE_ACCOUNT_ID` (line 20)

Once secrets are added, the workflow will automatically:
1. Checkout the repository
2. Deploy to Cloudflare Pages project `thaw-zin-portfolio`
3. Use the provided credentials for authentication

## Troubleshooting

### If workflow still fails after adding secrets:
1. Verify secret names match exactly (case-sensitive)
2. Check that secrets are in the correct repository
3. Ensure Cloudflare credentials are valid
4. Check workflow logs for specific error messages

### Token Permission Issue
The provided GitHub token doesn't have `repo` scope permissions needed for API-based secret management. Use the manual web UI method above instead.

## Related Files
- `.github/workflows/cloudflare-pages.yml` - Workflow definition
- `add-github-secrets.py` - API script (requires token with repo scope)
- `add-secrets-manual.md` - Detailed manual instructions








