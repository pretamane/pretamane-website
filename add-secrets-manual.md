# Add GitHub Secrets - Manual Instructions

## Issue
Your GitHub Personal Access Token doesn't have permission to manage repository secrets via API.

## Solution: Add Secrets via GitHub Web UI

### Step 1: Go to Repository Settings
1. Open: https://github.com/pretamane/pretamane-website
2. Click **"Settings"** (top menu)
3. Click **"Secrets and variables"** → **"Actions"** (left sidebar)

### Step 2: Add First Secret
1. Click **"New repository secret"**
2. **Name**: `CLOUDFLARE_API_TOKEN`
3. **Secret**: `owrWwvDMbECEVtA3NTwItOxguTO1Zsb_PiQNeTRe`
4. Click **"Add secret"**

### Step 3: Add Second Secret
1. Click **"New repository secret"** again
2. **Name**: `CLOUDFLARE_ACCOUNT_ID`
3. **Secret**: `d4cce76b1a4f91b589da3c2d627308ff`
4. Click **"Add secret"**

### Step 4: Verify
You should see both secrets listed:
- ✅ `CLOUDFLARE_API_TOKEN`
- ✅ `CLOUDFLARE_ACCOUNT_ID`

## Alternative: Update Token Permissions

If you want to use API in the future, create a new token with:
- ✅ `repo` (Full control of private repositories)
- ✅ `workflow` (Update GitHub Action workflows)

Then use the script: `add-github-secrets.py`

## After Adding Secrets

1. Go to **"Actions"** tab
2. Find the failed workflow run
3. Click **"Re-run jobs"** → **"Re-run all jobs"**
4. Workflow should now succeed!

---

**Time Required**: 2 minutes
**Difficulty**: Easy








