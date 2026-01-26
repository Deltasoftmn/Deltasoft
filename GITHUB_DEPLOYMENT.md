# GitHub Deployment Instructions

This guide will help you deploy the Deltasoft project to GitHub at https://github.com/Deltasoftmn/Deltasoft.git

## Prerequisites

1. **Close all programs using git** (VS Code, Git GUI, GitHub Desktop, etc.)
2. **Ensure you have git installed** and configured with your credentials
3. **Have GitHub authentication set up** (SSH key or Personal Access Token)

## Method 1: Using the Deployment Script (Recommended)

1. Close all programs that might be using git
2. Open PowerShell in the project directory
3. Run the deployment script:
   ```powershell
   .\deploy-to-github.ps1
   ```

## Method 2: Manual Deployment

If the script doesn't work due to lock files, follow these steps:

### Step 1: Remove Lock Files

Close all git-related programs, then manually delete these files if they exist:
- `.git\index.lock`
- `.git\config.lock`

You can do this in PowerShell:
```powershell
Remove-Item -Path ".git\index.lock" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".git\config.lock" -Force -ErrorAction SilentlyContinue
```

### Step 2: Initialize Git (if needed)

```powershell
git init
```

### Step 3: Add Remote Repository

```powershell
git remote add origin https://github.com/Deltasoftmn/Deltasoft.git
```

Or if the remote already exists:
```powershell
git remote set-url origin https://github.com/Deltasoftmn/Deltasoft.git
```

### Step 4: Add and Commit Files

```powershell
git add .
git commit -m "Initial commit: Deltasoft project"
```

### Step 5: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

## Troubleshooting

### Lock File Issues

If you encounter "Unable to create index.lock" errors:

1. **Close all git-related programs:**
   - VS Code / Cursor
   - Git GUI
   - GitHub Desktop
   - Any terminal windows running git commands

2. **Manually remove lock files:**
   ```powershell
   Remove-Item -Path ".git\index.lock" -Force
   Remove-Item -Path ".git\config.lock" -Force
   ```

3. **If files are still locked:**
   - Restart your computer
   - Or use Process Explorer to find what's locking the files

### Authentication Issues

If push fails due to authentication:

1. **For HTTPS:** Use a Personal Access Token
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Create a token with `repo` permissions
   - Use the token as your password when pushing

2. **For SSH:** Set up SSH keys
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Then add the public key to GitHub
   ```

### Permission Denied Errors

If you get "Permission denied" errors:

1. Check file permissions on `.git` directory
2. Run PowerShell as Administrator
3. Check if antivirus is blocking git operations

## Alternative: Fresh Git Repository

If all else fails, you can create a fresh git repository:

```powershell
# Backup your .git directory
Rename-Item -Path ".git" -NewName ".git_backup"

# Initialize fresh repository
git init
git add .
git commit -m "Initial commit: Deltasoft project"
git remote add origin https://github.com/Deltasoftmn/Deltasoft.git
git branch -M main
git push -u origin main
```

## Verification

After successful deployment, verify by visiting:
https://github.com/Deltasoftmn/Deltasoft

Your files should be visible in the repository.
