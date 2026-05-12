# Hostinger Automated Git Deployment Guide

## Overview
This guide explains how to set up automated deployment from your Git repository to Hostinger's root directory. When you push to the `main` branch, your changes will automatically build and deploy.

## Prerequisites
- Hostinger Business Web Hosting plan (you have this)
- Git repository (GitHub, GitLab, or Bitbucket)
- SSH access to Hostinger (or FTP as fallback)

## Option 1: Using Hostinger's Git Integration (Recommended)

### Step 1: Enable Git in Hostinger Control Panel
1. Log in to your Hostinger hPanel
2. Navigate to **Websites** → **benbolpharmacy**
3. Go to **Git** section (or **Repository** depending on your panel version)
4. Click **Connect Repository**

### Step 2: Connect Your Git Repository
1. Select your Git provider (GitHub, GitLab, or Bitbucket)
2. Authorize Hostinger to access your repository
3. Select the repository containing your code
4. Select the **main** branch

### Step 3: Configure Build Settings
1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Node.js Version**: 18 or higher (check your package.json)
4. **Environment Variables**: Add your Supabase credentials
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Step 4: Set Deployment Path
- **Deploy to**: `/` (root directory for benbolpharmacy)
- This ensures your `dist` folder contents go directly to the root

### Step 5: Enable Auto-Deploy
1. Check **Automatic deployment on push**
2. Select **main** branch
3. Save settings

**Result**: Every commit to `main` will automatically trigger a build and deploy to your Hostinger root directory.

---

## Option 2: Using GitHub Actions (Advanced but More Control)

If Hostinger's Git integration doesn't work or you want more control, use GitHub Actions.

### Step 1: Create SSH Key on Hostinger
1. SSH into your Hostinger account:
   ```bash
   ssh username@benbolpharmacy.com
   ```
2. Generate SSH key:
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/hostinger_deploy
   ```
3. Copy the private key:
   ```bash
   cat ~/.ssh/hostinger_deploy
   ```

### Step 2: Add SSH Key to GitHub
1. Go to your GitHub repository
2. Settings → **Secrets and variables** → **Actions**
3. Create new secret: `HOSTINGER_SSH_KEY`
4. Paste the private key content

### Step 3: Add Hostinger Host Key
1. Get your Hostinger host key:
   ```bash
   ssh-keyscan benbolpharmacy.com
   ```
2. Create GitHub secret: `HOSTINGER_HOST_KEY`
3. Paste the host key

### Step 4: Create GitHub Actions Workflow
Create file: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Hostinger

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy to Hostinger
        uses: appleboy/scp-action@master
        with:
          host: benbolpharmacy.com
          username: ${{ secrets.HOSTINGER_USERNAME }}
          key: ${{ secrets.HOSTINGER_SSH_KEY }}
          source: "dist/*"
          target: "/home/benbolpharmacy/public_html"
          rm: true

      - name: Notify deployment
        run: echo "Deployment to Hostinger completed successfully"
```

### Step 5: Add GitHub Secrets
Add these to your GitHub repository secrets:
- `HOSTINGER_USERNAME` - Your Hostinger FTP/SSH username
- `HOSTINGER_SSH_KEY` - Private SSH key (from Step 1)
- `HOSTINGER_HOST_KEY` - Host key (from Step 3)
- `VITE_SUPABASE_URL` - Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

---

## Option 3: Using FTP Deployment (Fallback)

If SSH isn't available, use FTP with GitHub Actions.

### Step 1: Get FTP Credentials
1. Log in to Hostinger hPanel
2. Go to **Files** → **FTP Accounts**
3. Note your FTP credentials

### Step 2: Create GitHub Actions Workflow
Create file: `.github/workflows/deploy-ftp.yml`

```yaml
name: Deploy to Hostinger via FTP

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Upload to Hostinger via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: ./
          dangerous-clean-slate: true
```

### Step 2: Add GitHub Secrets
- `FTP_SERVER` - Your Hostinger FTP server (e.g., ftp.benbolpharmacy.com)
- `FTP_USERNAME` - Your FTP username
- `FTP_PASSWORD` - Your FTP password
- `VITE_SUPABASE_URL` - Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

---

## Recommended Approach for Your Setup

**Use Option 1 (Hostinger Git Integration)** because:
- ✅ Simplest to set up
- ✅ No need to manage SSH keys
- ✅ Built-in to Hostinger
- ✅ Automatic builds and deploys
- ✅ No GitHub Actions needed

**Fallback to Option 3 (FTP)** if:
- Hostinger Git integration isn't available in your panel
- You prefer not to use SSH

---

## Deployment Workflow

### Before First Deployment
1. Ensure your `package.json` has correct build script:
   ```json
   "build": "vite build"
   ```

2. Verify `.gitignore` excludes:
   ```
   node_modules/
   dist/
   .env
   .env.local
   ```

3. Commit your `.env.example` (without secrets):
   ```
   VITE_SUPABASE_URL=your_url_here
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```

### Deployment Process
1. Make changes locally
2. Test locally: `npm run build && npm run preview`
3. Commit to main: `git commit -m "Your message"`
4. Push to GitHub: `git push origin main`
5. **Automatic deployment starts** ✅
6. Check Hostinger dashboard for deployment status
7. Visit `https://www.benbolpharmacy.com` to verify

### Monitoring Deployments

**Option 1 (Hostinger Git)**:
- Check Hostinger hPanel → Git section for deployment logs

**Option 2/3 (GitHub Actions)**:
- Go to GitHub repository → **Actions** tab
- View workflow runs and logs
- Get notifications on success/failure

---

## Troubleshooting

### Build Fails
- Check GitHub Actions logs for error messages
- Verify all environment variables are set
- Ensure `npm run build` works locally

### Files Not Updating
- Clear browser cache (Ctrl+Shift+Delete)
- Check if deployment actually completed
- Verify files are in root directory (not in subdirectory)

### Environment Variables Not Found
- Double-check variable names match your code
- Ensure they're added to GitHub Secrets (not just locally)
- Rebuild after adding secrets

### SSH Connection Issues
- Verify SSH key is correctly formatted
- Check Hostinger allows SSH access
- Try FTP deployment as fallback

---

## Security Best Practices

⚠️ **Never commit secrets to Git**:
- Keep `.env` in `.gitignore`
- Use GitHub Secrets for sensitive data
- Rotate SSH keys periodically

✅ **Recommended**:
- Use strong SSH keys (4096-bit RSA minimum)
- Limit SSH key permissions
- Monitor deployment logs for unauthorized access
- Use branch protection rules on main

---

## Cost
- **Hostinger Git Integration**: Included with Business plan
- **GitHub Actions**: Free for public repos, limited free tier for private
- **Total Cost**: $0 additional

---

## Next Steps

1. **Choose your deployment method** (Option 1 recommended)
2. **Set up Git integration** in Hostinger hPanel
3. **Configure build settings** (npm run build, dist folder)
4. **Add environment variables** to Hostinger
5. **Test with a small commit** to main branch
6. **Monitor first deployment** to ensure it works
7. **Celebrate** - you now have automated deployments! 🎉

---

**Created**: April 13, 2026
**Status**: Ready to implement
**Recommended**: Option 1 (Hostinger Git Integration)
