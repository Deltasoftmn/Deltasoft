# Deltasoft Deployment Script
# This script initializes git, adds all files, and pushes to GitHub

Write-Host "Starting deployment to GitHub..." -ForegroundColor Green

# Remove existing .git if corrupted
if (Test-Path .git) {
    Write-Host "Removing existing .git directory..." -ForegroundColor Yellow
    Remove-Item -Path .git -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Initialize git repository
Write-Host "Initializing git repository..." -ForegroundColor Green
git init

# Add remote repository
Write-Host "Adding remote repository..." -ForegroundColor Green
git remote add origin https://github.com/Deltasoftmn/Deltasoftweb.git

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Green
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Green
git commit -m "Initial commit: Deltasoft IT Outsourcing Company Website"

# Push to GitHub (main branch)
Write-Host "Pushing to GitHub..." -ForegroundColor Green
git branch -M main
git push -u origin main

Write-Host "Deployment completed successfully!" -ForegroundColor Green
