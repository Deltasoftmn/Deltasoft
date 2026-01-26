# Deployment Instructions

## ⚠️ Important: Resolve Git Lock Issues First

If you encounter "Access denied" or "File exists" errors, follow these steps:

### Step 1: Close all applications
- **Close VS Code completely** (if open)
- Close GitHub Desktop (if installed)
- Close any file explorer windows showing the project folder
- Close all PowerShell/Command Prompt windows
- Close any antivirus that might be scanning the folder

### Step 2: Run PowerShell as Administrator
1. Right-click on PowerShell
2. Select "Run as Administrator"
3. Navigate to the project: `cd d:\ajil\deltasoft`

### Step 3: Remove corrupted .git directory
```powershell
# Take ownership and remove
takeown /f .git /r /d y
icacls .git /grant administrators:F /t
Remove-Item -Path .git -Recurse -Force
```

### Alternative: Use the deployment script
After closing all applications, run:
```powershell
cd d:\ajil\deltasoft
.\deploy.ps1
```

## Manual Deployment Steps

If the automated script doesn't work, follow these steps:

### Step 3: Initialize Git and Deploy
```powershell
# Initialize git
git init

# Add remote repository
git remote add origin https://github.com/Deltasoftmn/Deltasoftweb.git

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Deltasoft IT Outsourcing Company Website"

# Set main branch and push
git branch -M main
git push -u origin main
```

### Alternative: Using GitHub Desktop or VS Code
1. Open the project in VS Code
2. Use the Source Control panel (Ctrl+Shift+G)
3. Click "Initialize Repository"
4. Stage all changes
5. Commit with message: "Initial commit: Deltasoft IT Outsourcing Company Website"
6. Add remote: https://github.com/Deltasoftmn/Deltasoftweb.git
7. Push to main branch

## Troubleshooting

### If you get "permission denied" errors:
- Run PowerShell as Administrator
- Check if any process is locking the .git folder
- Restart your computer if necessary

### If you get "remote already exists" error:
```powershell
git remote remove origin
git remote add origin https://github.com/Deltasoftmn/Deltasoftweb.git
```

### If you need to force push (use with caution):
```powershell
git push -u origin main --force
```

## Repository URL
https://github.com/Deltasoftmn/Deltasoftweb.git
