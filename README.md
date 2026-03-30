# Htein Lin Thar Real Estate - Property Management System

A mission-critical property management system designed specifically for the Myanmar market. Built with a modern, responsive, and highly dynamic glassmorphism interface, backed by Cloudflare's global edge network.

## 🚀 Live Demo

- **Frontend Application**: [https://htein-lin-thar.pages.dev](https://htein-lin-thar.pages.dev)
- **Backend API API Base**: [https://backend.nyinyimin2007.workers.dev](https://backend.nyinyimin2007.workers.dev)

## 🛠 Technology Stack

### Frontend (`/frontend`)
- **Framework**: React + Vite
- **Styling**: TailwindCSS (High-Contrast Dark Mode & Glassmorphism)
- **Icons**: Lucide React
- **Mobile Support**: Capacitor (Ready for Native Android/iOS compilation)

### Backend (`/backend`)
- **Framework**: Cloudflare Workers (TypeScript)
- **Database**: Cloudflare D1 (Serverless SQLite)
- **Storage**: Cloudflare R2 (Note: Storage integration requires active configuration)

## 📦 Project Structure

```
real-estate-project/
├── frontend/             # React SPA (Cloudflare Pages)
│   ├── src/              # Components, styles, utils
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── backend/              # Cloudflare Workers API
│   ├── src/              # Worker routes and logic
│   ├── schema.sql        # D1 Database Schema
│   └── wrangler.jsonc    # Cloudflare configuration
├── HTEIN_LIN_THAR_MANIFEST.md # Project Rules & Specifications
└── setup-production.ps1  # Automated setup script
```

## 🏗 Local Development 

To run both the frontend and backend simultaneously on your local machine:

1. **Install Dependencies**
   From the root of the project, run:
   ```bash
   npm install      # Installs root dependencies (like concurrently)
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Start the Development Servers**
   From the root directory, simply run:
   ```bash
   npm run dev
   ```
   This will spin up both the Vite frontend server and the Wrangler local worker server concurrently.

## ☁️ Deployment

### Automated Deployment

**Frontend:**
```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name htein-lin-thar
```

**Backend:**
```bash
cd backend
npm run deploy
```

### Initial Provisioning (Cloudflare)

If setting up the infrastructure from scratch, you can use the included PowerShell script:
```powershell
.\setup-production.ps1
```
This script automates:
- D1 Database initialization & schema application
- Initial data seeding (100 sample listings)

*Note: Ensure you are logged into Wrangler (`npx wrangler login`) before provisioning.*

## 🔒 Access Control & Business Rules
- **Pricing**: All prices are represented in Millions (M) of Myanmar Kyats (MMK).
- **Admin**: Full system control and access to audit logs.
- **Agent**: Can create and edit their own/shared property listings.
- **User**: Can browse properties and save bookmarks.
