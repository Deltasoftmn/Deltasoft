@echo off
echo ========================================
echo Deltasoft Git Repository Setup
echo ========================================
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo Step 1: Removing locked .git directory...
if exist .git (
    takeown /f .git /r /d y >nul 2>&1
    icacls .git /grant administrators:F /t >nul 2>&1
    rmdir /s /q .git 2>nul
    echo .git directory removed.
) else (
    echo No .git directory found.
)

echo.
echo Step 2: Initializing git repository...
git init
if %errorLevel% neq 0 (
    echo ERROR: Failed to initialize git repository
    pause
    exit /b 1
)

echo.
echo Step 3: Adding remote repository...
git remote add origin https://github.com/Deltasoftmn/Deltasoftweb.git
if %errorLevel% neq 0 (
    git remote set-url origin https://github.com/Deltasoftmn/Deltasoftweb.git
)

echo.
echo Step 4: Adding all files...
git add .
if %errorLevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo Step 5: Creating initial commit...
git commit -m "Initial commit: Deltasoft IT Outsourcing Company Website"
if %errorLevel% neq 0 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)

echo.
echo Step 6: Setting main branch...
git branch -M main

echo.
echo Step 7: Pushing to GitHub...
echo Please enter your GitHub credentials when prompted.
git push -u origin main

if %errorLevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to push to GitHub
    echo Check your credentials and try again
    echo ========================================
)

echo.
pause
