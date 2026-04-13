# ============================================
# Saudi Tabreed Portal - Complete Deployment
# Run this script in PowerShell as Administrator
# ============================================

param(
    [string]$SharePointUrl = "",
    [string]$ApiUrl = ""
)

Write-Host @"

  ╔══════════════════════════════════════════╗
  ║  Saudi Tabreed Portal - Deployment       ║
  ║  District Cooling Company                ║
  ╚══════════════════════════════════════════╝

"@ -ForegroundColor Cyan

$ProjectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$ProjectRoot\package.json")) {
    $ProjectRoot = $PSScriptRoot
}

# ── Step 1: Build Frontend ──
Write-Host "`n[1/5] Building frontend..." -ForegroundColor Yellow
Set-Location $ProjectRoot

if ($ApiUrl) {
    $env:VITE_API_URL = $ApiUrl
    Write-Host "  API URL set to: $ApiUrl" -ForegroundColor Gray
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED!" -ForegroundColor Red
    exit 1
}
Write-Host "  Build complete! Files in dist/" -ForegroundColor Green

# ── Step 2: Prepare Server Package ──
Write-Host "`n[2/5] Preparing server package..." -ForegroundColor Yellow
$serverDist = "$ProjectRoot\deploy\server"
if (Test-Path $serverDist) { Remove-Item $serverDist -Recurse -Force }
New-Item -ItemType Directory -Path $serverDist -Force | Out-Null

# Copy server files
Copy-Item "$ProjectRoot\server\index.cjs" "$serverDist\"
Copy-Item "$ProjectRoot\server\db.cjs" "$serverDist\"
Copy-Item "$ProjectRoot\server\package.json" "$serverDist\"
Copy-Item "$ProjectRoot\server\.env.example" "$serverDist\.env"
Copy-Item "$ProjectRoot\db.json" "$serverDist\"

# Copy uploads folder structure
New-Item -ItemType Directory -Path "$serverDist\uploads\avatars" -Force | Out-Null
New-Item -ItemType Directory -Path "$serverDist\uploads\policies" -Force | Out-Null

# Create web.config for IIS
@"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="index.cjs" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="API" stopProcessing="true">
          <match url=".*" />
          <action type="Rewrite" url="index.cjs" />
        </rule>
      </rules>
    </rewrite>
    <iisnode nodeProcessCommandLine="node" />
  </system.webServer>
</configuration>
"@ | Out-File "$serverDist\web.config" -Encoding UTF8

Write-Host "  Server package ready in deploy/server/" -ForegroundColor Green

# ── Step 3: Prepare Frontend Package ──
Write-Host "`n[3/5] Preparing frontend package..." -ForegroundColor Yellow
$frontendDist = "$ProjectRoot\deploy\frontend"
if (Test-Path $frontendDist) { Remove-Item $frontendDist -Recurse -Force }
Copy-Item "$ProjectRoot\dist" "$frontendDist" -Recurse
Write-Host "  Frontend package ready in deploy/frontend/" -ForegroundColor Green

# ── Step 4: Create ZIP Archives ──
Write-Host "`n[4/5] Creating ZIP archives..." -ForegroundColor Yellow
$deployDir = "$ProjectRoot\deploy"

Compress-Archive -Path "$serverDist\*" -DestinationPath "$deployDir\tabreed-api.zip" -Force
Write-Host "  Created: deploy/tabreed-api.zip" -ForegroundColor Gray

Compress-Archive -Path "$frontendDist\*" -DestinationPath "$deployDir\tabreed-frontend.zip" -Force
Write-Host "  Created: deploy/tabreed-frontend.zip" -ForegroundColor Gray

# ── Step 5: SQL Scripts ──
Write-Host "`n[5/5] Copying SQL scripts..." -ForegroundColor Yellow
$sqlDist = "$deployDir\sql-scripts"
if (Test-Path $sqlDist) { Remove-Item $sqlDist -Recurse -Force }
New-Item -ItemType Directory -Path $sqlDist -Force | Out-Null
Copy-Item "$ProjectRoot\server\database\*.sql" "$sqlDist\"
Write-Host "  SQL scripts copied to deploy/sql-scripts/" -ForegroundColor Green

# ── Summary ──
Write-Host @"

╔══════════════════════════════════════════════════════╗
║  DEPLOYMENT PACKAGE READY!                           ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  deploy/                                             ║
║  ├── tabreed-frontend.zip   (SharePoint upload)     ║
║  ├── tabreed-api.zip        (Azure/IIS deploy)      ║
║  ├── frontend/              (unzipped frontend)     ║
║  ├── server/                (unzipped server)       ║
║  └── sql-scripts/           (database scripts)      ║
║                                                      ║
║  NEXT STEPS:                                         ║
║  1. Run SQL scripts on your SQL Server               ║
║  2. Upload tabreed-api.zip to Azure App Service      ║
║     or deploy server/ folder to IIS                  ║
║  3. Upload frontend/ contents to SharePoint          ║
║  4. Update server/.env with production values        ║
║                                                      ║
╚══════════════════════════════════════════════════════╝

"@ -ForegroundColor Green

# ── Optional: Deploy to SharePoint ──
if ($SharePointUrl) {
    Write-Host "Deploying to SharePoint: $SharePointUrl" -ForegroundColor Cyan

    try {
        Import-Module PnP.PowerShell -ErrorAction Stop
        Connect-PnPOnline -Url $SharePointUrl -Interactive

        $libName = "TabreedPortal"
        try { New-PnPList -Title $libName -Template DocumentLibrary } catch {}

        Get-ChildItem -Path $frontendDist -Recurse -File | ForEach-Object {
            $rel = $_.FullName.Replace($frontendDist, "").TrimStart("\").Replace("\", "/")
            $folder = Split-Path $rel -Parent
            if ($folder) {
                try { Resolve-PnPFolder -SiteRelativePath "$libName/$folder" } catch {}
            }
            Add-PnPFile -Path $_.FullName -Folder "$libName/$folder" | Out-Null
            Write-Host "  Uploaded: $rel" -ForegroundColor Gray
        }

        Write-Host "`nSharePoint deployment complete!" -ForegroundColor Green
        Write-Host "URL: $SharePointUrl/$libName/index.html" -ForegroundColor Cyan
    } catch {
        Write-Host "SharePoint deployment failed: $_" -ForegroundColor Red
        Write-Host "Install PnP.PowerShell: Install-Module PnP.PowerShell" -ForegroundColor Yellow
    }
}
