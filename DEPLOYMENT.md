# ============================================
# Saudi Tabreed Portal - SharePoint Deployment Guide
# ============================================

## Option 1: Deploy as Static Site to SharePoint (Easiest)

### Step 1: Build the production version
```powershell
cd C:\Users\lenovo\Tabreed
npm run build
```

### Step 2: Create SharePoint Site
1. Go to https://sauditabreed.sharepoint.com
2. Create a new Communication Site called "Tabreed Portal"
3. Go to Site Contents → Site Pages

### Step 3: Upload to SharePoint Document Library
1. In the SharePoint site, go to Site Contents
2. Create a new Document Library called "portal"
3. Upload ALL files from the `dist/` folder to this library
4. Set index.html as the default page

### Step 4: Configure the Backend API
The backend server (Express.js) needs to be hosted separately:
- **Option A**: Azure App Service (recommended)
- **Option B**: On-premise IIS server
- **Option C**: Azure Functions

#### Deploy Backend to Azure App Service:
```powershell
# Install Azure CLI
winget install Microsoft.AzureCLI

# Login to Azure
az login

# Create resource group
az group create --name tabreed-portal-rg --location uaenorth

# Create App Service plan
az appservice plan create --name tabreed-plan --resource-group tabreed-portal-rg --sku B1 --is-linux

# Create web app
az webapp create --resource-group tabreed-portal-rg --plan tabreed-plan --name tabreed-portal-api --runtime "NODE:18-lts"

# Deploy the server
cd server
az webapp deployment source config-zip --resource-group tabreed-portal-rg --name tabreed-portal-api --src server.zip
```

### Step 5: Update API URL in frontend
Before building, update `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tabreed-portal-api.azurewebsites.net',
        changeOrigin: true,
      },
    },
  },
})
```

For production, update `src/services/api.ts`:
```typescript
const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://tabreed-portal-api.azurewebsites.net/api'
  : '/api';
```

---

## Option 2: SharePoint Framework (SPFx) Web Part

### Prerequisites:
- Node.js 18.x (SPFx requirement)
- Yeoman & SPFx Generator

```powershell
npm install -g yo @microsoft/generator-sharepoint
```

### This converts the React app to an SPFx web part.
### Contact your SharePoint admin for App Catalog access.

---

## Option 3: Azure Static Web Apps (Recommended for Full Stack)

This deploys both frontend AND backend together:

```powershell
# Install SWA CLI
npm install -g @azure/static-web-apps-cli

# Initialize
swa init --config-name tabreed-portal

# Deploy
swa deploy ./dist --api-location ./server --app-name tabreed-portal
```

---

## Option 4: Embed in SharePoint Modern Page

1. Build the app: `npm run build`
2. Host the `dist/` folder on any web server or CDN
3. In SharePoint, add an "Embed" web part to a page
4. Paste the URL of your hosted `index.html`

---

## Database Configuration for Production:
Update `server/.env`:
```
DB_SERVER=your-sql-server.database.windows.net
DB_DATABASE=TabreedPortal
DB_USER=TabreedAdmin
DB_PASSWORD=YourProductionPassword
DB_TRUST_CERT=true

SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=sharePoint1@sauditabreed.onmicrosoft.com
SMTP_PASS=YourSMTPPassword
SMTP_FROM=sharePoint1@sauditabreed.onmicrosoft.com
```

## SSL/Domain:
- Frontend: https://portal.sauditabreed.com (SharePoint)
- API: https://api.sauditabreed.com (Azure App Service)
