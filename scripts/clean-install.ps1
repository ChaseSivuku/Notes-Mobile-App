# Run this script in PowerShell (preferably as Administrator) when npm hits EPERM.
# Close Cursor/VS Code first so nothing locks node_modules.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Removing node_modules..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
}
Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
if (Test-Path package-lock.json) {
    Remove-Item -Force package-lock.json
}
Write-Host "Running npm install..." -ForegroundColor Yellow
npm install
Write-Host "Done. Run: npx expo install --fix" -ForegroundColor Green
