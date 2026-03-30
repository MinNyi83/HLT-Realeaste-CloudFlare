# setup-production.ps1
# This script automates the provisioning of Cloudflare resources for the Real Estate platform.

$ErrorActionPreference = "Stop"

Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "🚀 HTEIN LIN THAR - Production Environment Setup" -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

try {
    # 1. Check Wrangler Version
    Write-Host "[1/4] Checking Wrangler installation..." -ForegroundColor Gray
    npx wrangler --version
    


    # 3. Provision & Initialize D1 Database
    Write-Host "[3/4] Initializing D1 Database & Applying Schema..." -ForegroundColor Yellow
    & npx wrangler d1 execute antigravity-db --file=schema.sql --remote --yes
    Write-Host "✅ D1 Schema applied." -ForegroundColor Green

    # 4. Seed Initial Data
    Write-Host "[4/4] Seeding initial property data (100 listings)..." -ForegroundColor Yellow
    & npx wrangler d1 execute antigravity-db --file=seed_properties.sql --remote --yes
    Write-Host "✅ Initial data seeded." -ForegroundColor Green

    Write-Host "--------------------------------------------------" -ForegroundColor Green
    Write-Host "✨ INFRASTRUCTURE READY!" -ForegroundColor Green
    Write-Host "--------------------------------------------------" -ForegroundColor Green
    Write-Host "Final Steps (Manual Required for Security):" -ForegroundColor White
    Write-Host "1. Set JWT Secret: npx wrangler secret put SESSION_SECRET"
    Write-Host "2. Set Google ID: npx wrangler secret put GOOGLE_CLIENT_ID"
    Write-Host "3. Set Google Secret: npx wrangler secret put GOOGLE_CLIENT_SECRET"
    Write-Host "4. Update frontend/.env with your Worker URL."
    Write-Host "5. Run: npx wrangler deploy"

} catch {
    Write-Host "❌ Setup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
