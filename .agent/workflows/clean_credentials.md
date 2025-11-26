---
description: Clean hardcoded Cloudflare credentials and secure deployment
---
# Agentic Workflow: clean_credentials

## Overview
This workflow removes any hard‑coded Cloudflare API token and Account ID from the repository, replaces them with environment‑variable placeholders, adds a safe `.env.example` file, updates deployment scripts to read from the environment, and commits the changes. It also reminds you to revoke the exposed token.

## Steps
1. **Identify all files containing the leaked credentials**
   ```bash
   grep -R "owrWwvDMbECEVtA3NTwItOxguTO1Zsb_PiQNeTRe" .
   grep -R "d4cce76b1a4f91b589da3c2d627308ff" .
   ```
2. **Replace the hard‑coded values with placeholders** (already done for `CLOUDFLARE_GITHUB_CONNECTION.md` and `DEPLOYMENT_FIX_SUMMARY.md`).
3. **Create an `.env.example` file** that shows the required variables.
   ```bash
   cat > .env.example <<'EOF'
   CLOUDFLARE_API_TOKEN=<YOUR_CLOUDFLARE_API_TOKEN>
   CLOUDFLARE_ACCOUNT_ID=<YOUR_CLOUDFLARE_ACCOUNT_ID>
   EOF
   ```
4. **Add `.env` to `.gitignore`** to prevent accidental commits.
   ```bash
   echo ".env" >> .gitignore
   ```
5. **Update `deploy-cloudflare.sh`** to source the `.env` file if present.
   ```bash
   # At the top of deploy-cloudflare.sh
   if [ -f .env ]; then
       source .env
   fi
   ```
6. **Commit the changes**
   ```bash
   git add .gitignore .env.example deploy-cloudflare.sh CLOUDFLARE_GITHUB_CONNECTION.md DEPLOYMENT_FIX_SUMMARY.md
   git commit -m "Secure Cloudflare credentials: replace hard‑coded values with env vars"
   ```
7. **Push to remote**
   ```bash
   git push origin main
   ```
8. **Revoke the exposed Cloudflare API token**
   - Log in to Cloudflare Dashboard → My Profile → API Tokens.
   - Delete the token `owrWwvDMbECEVtA3NTwItOxguTO1Zsb_PiQNeTRe`.
   - Generate a new token with the same permissions and store it in your CI secrets.

## Optional: Clean Git History (if you want to remove the token from past commits)
```bash
# Install BFG Repo‑Cleaner (or use git filter‑branch)
java -jar bfg.jar --replace-text <(echo 'owrWwvDMbECEVtA3NTwItOxguTO1Zsb_PiQNeTRe')
# Then force‑push the cleaned history
git push --force
```

---

**Note:** After completing these steps, any future deployment must use the new token stored in GitHub Secrets or a local `.env` file.
