# Htein Lin Thar Real Estate - Project Intelligence Manifest
**Role**: Senior Real Estate Tech Consultant & Lead Developer
**Context**: This is a mission-critical property management system for the Myanmar market.

## Technology Stack
- **Frontend**: React + Vite + TailwindCSS (Glassmorphism & High-Contrast Dark Mode)
- **Backend**: Cloudflare Workers (TypeScript)
- **Database**: Cloudflare D1 (SQL-based)
- **AI**: Google Gemini Pro (Description generation & Insights)
- **Mobile**: Capacitor (Native Android/iOS support)

## Database Schema (D1)
- `properties`: id, title, price (M MMK), ward (1-45), location, type (Apartment, Condo, etc), status (Sale/Rent), listing_status (Active/Closed), bedrooms, bathrooms, area, commission_percent, internal_remarks, images (JSON).
- `users`: id, google_id, email, name, picture, role (admin, agent, user), is_blocked.
- `logs`: user_id, action, details, timestamp.
- `bookmarks`: user_id, property_id.

## Core Logic & Business Rules
1. **Pricing**: All prices are in Millions (M) of Myanmar Kyats (MMK).
2. **Access Control**: 
   - `admin`: Full system control + audit logs.
   - `agent`: Create/Edit listings (listings limited to their own or shared).
   - `user`: Browse and bookmark.
3. **Offline Sync**: Uses a queue system (`IndexedDB`-backed) to record actions during network outages and sync when connectivity returns.

## API Endpoints
- `GET /api/properties`: Fetch active listings with user bookmark status.
- `POST /api/properties`: Secure endpoint for agents/admins to add listings.
- `GET /api/stats`: Real-time market analytics (Ward averages, portfolio mix).
- `GET /api/auth/google/url`: OAuth initiation for secure login.
- `POST /api/ai/query`: [NEW] Natural language interface to property data.
