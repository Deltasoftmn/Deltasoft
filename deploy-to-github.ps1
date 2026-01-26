# Script to deploy Deltasoft project to GitHub
# Run this script to push your project to https://github.com/Deltasoftmn/Deltasoft.git

Write-Host "Deploying Deltasoft project to GitHub..." -ForegroundColor Green

# Change to project directory
Set-Location $PSScriptRoot

# Remove lock files if they exist
Write-Host "Removing git lock files..." -ForegroundColor Yellow
$lockFiles = @(".git\index.lock", ".git\config.lock")
foreach ($lockFile in $lockFiles) {
    if (Test-Path $lockFile) {
        try {
            # Try to remove the lock file
            Remove-Item -Path $lockFile -Force -ErrorAction Stop
            Write-Host "Removed $lockFile" -ForegroundColor Green
        } catch {
            Write-Host "Warning: Could not remove $lockFile. You may need to close any programs using git." -ForegroundColor Yellow
            Write-Host "Please manually delete $lockFile and run this script again." -ForegroundColor Yellow
            exit 1
        }
    }
}

# Check if git is initialized
if (-not (Test-Path ".git\config")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to initialize git repository" -ForegroundColor Red
        exit 1
    }
}

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to add files. Please check for lock files." -ForegroundColor Red
    exit 1
}

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
} else {
    # Create initial commit
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: Deltasoft project"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to create commit" -ForegroundColor Red
        exit 1
    }
}

# Check if remote exists
$remoteUrl = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($remoteUrl)) {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/Deltasoftmn/Deltasoft.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to add remote" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Remote already exists: $remoteUrl" -ForegroundColor Green
    # Update remote URL if needed
    git remote set-url origin https://github.com/Deltasoftmn/Deltasoft.git
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully deployed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/Deltasoftmn/Deltasoft.git" -ForegroundColor Cyan
} else {
    Write-Host "Error: Failed to push to GitHub" -ForegroundColor Red
    Write-Host "You may need to:" -ForegroundColor Yellow
    Write-Host "  1. Set up authentication (SSH key or personal access token)" -ForegroundColor Yellow
    Write-Host "  2. Check your internet connection" -ForegroundColor Yellow
    Write-Host "  3. Verify repository permissions" -ForegroundColor Yellow
    exit 1
}
