# ValidQR — NusaPay Mobile Web Client & Merchant Portal

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/Status-Top_30_Finalist-success?style=for-the-badge)

**Adaptive Real-Time Anti-Fraud Engine for the Indonesian QRIS Payment Ecosystem**  
*HackNusa 2026 — Telkom University × Kaspersky Cybersecurity Innovation Hackathon*

[**Explore Live Demo (Vercel)**](https://knusa-web.vercel.app) • [**Merchant Portal**](https://knusa-web.vercel.app/merchant-portal) • [**Report an Incident**](#-rest-api-reference)

</div>

---

## 📖 Table of Contents

- [Executive Summary](#-executive-summary)
- [The Problem: QRIS Fraud in Indonesia](#-the-problem-qris-fraud-in-indonesia)
- [Key Features & System Enhancements](#-key-features--system-enhancements)
- [Adaptive 3-Layer Defense Architecture](#-adaptive-3-layer-defense-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start & Installation](#-quick-start--installation)
- [Environment Configuration](#-environment-configuration)
- [Running Locally (Development)](#-running-locally-development)
- [Local Production Build & Deployment](#-local-production-build--deployment)
  - [1. Standalone Production Server](#1-standalone-production-server)
  - [2. Process Manager Daemon (PM2)](#2-process-manager-daemon-pm2)
  - [3. Docker Container Deployment](#3-docker-container-deployment)
- [Evaluation Runbook & Demo Scenarios](#-evaluation-runbook--demo-scenarios)
- [Merchant Portal Walkthrough](#-merchant-portal-walkthrough)
- [REST API Reference](#-rest-api-reference)
- [Project Structure](#-project-structure)
- [Security & Compliance](#-security--compliance)
- [Core Team](#-core-team)

---

## 📌 Executive Summary

**ValidQR** is an adaptive, client-server anti-fraud software development kit (SDK) engineered for integration into digital wallets (e-wallets), mobile banking apps, and payment gateways. Specifically tailored for the national QRIS (Quick Response Code Indonesian Standard) standard, ValidQR stops **physical sticker replacement (Overlay Attack)** and **merchant name spoofing (Rebrand Attack)** in real-time **before** customer funds are debited.

Built as a high-performance Next.js full-stack application, this repository contains:
1. **NusaPay Mobile E-Wallet Web App:** A pixel-perfect, responsive mobile client with native-feel bottom navigation, WebRTC scanner, and animated transaction flows.
2. **Interactive Merchant Portal:** Administrative suite for merchant onboarding, Leaflet-based GPS geofence definition, and live QRIS sticker generation.
3. **ValidQR Core Verification Engine:** Serverless edge API routes performing sub-200ms cryptographic, string distance, and geodesic computations.

---

## ⚠️ The Problem: QRIS Fraud in Indonesia

QRIS adoption in Indonesia has reached over 50 million users and 30 million merchants. However, this growth has created severe security vulnerabilities:

1. **Physical Sticker Overlay Attack:** Fraudsters print their own QRIS sticker and paste it over legitimate merchant display acrylics (e.g., at mosques, food stalls, or retail checkout counters). Unsuspecting buyers scan the sticker, and funds are diverted to the attacker's account.
2. **Rebrand / Impersonation Attack:** Attackers register an NMID (National Merchant ID) under a misleading name (e.g., *"Masjid Nurul Iman"* modified to *"Restorasi Masjid Nurul"*) to deceive buyers during on-screen confirmation.
3. **Zero-Day Lag:** Financial institutions often discover fraud only after hours or days when merchants report missing revenue, making fund recovery nearly impossible.

**ValidQR solves this at the transaction handshake phase** by binding the physical merchant coordinates to the QR payload and verifying the buyer's live GPS radius in real-time.

---

## ✨ Key Features & System Enhancements

### 🛡️ Core Innovations
- **Adaptive 3-Layer Sequential Security:**
  - **Layer 1 (NMID Whitelist):** Instant lookup against certified merchant databases.
  - **Layer 2 (Hybrid Fuzzy Matching):** Composite distance score (40% Levenshtein + 60% Token Overlap) detects subtle typosquatting and deceptive rebranding.
  - **Layer 3 (GPS Geofencing with 20m Tolerance):** Evaluates geodesic distance via the Haversine formula against a strict **$\pm 20\text{m}$ perimeter**. If the buyer is scanning from beyond 20m of the registered merchant location, the transaction is **immediately hard-blocked**.
- **Real-Time Read-Only Merchant GPS Inspection:**
  - Clicking any registered merchant in the portal automatically pans and zooms the interactive Leaflet map to their exact GPS coordinates.
  - Activates **Read-Only Lock Mode**: drag handlers are disabled, map clicks are neutralized, nudge controls are hidden, and form inputs are locked to prevent inadvertent coordinate edits.
  - Includes a **Live Tracking toggle** that visualizes the evaluator's current device coordinates relative to the merchant with continuous distance computation.
- **Zero-Bleed QR Sticker Modal:**
  - Engineered with top-tier stacking context (`z-[9999]`) and container isolation (`isolate`).
  - GPS coordinate badges and micro-adjustment D-pad controls are automatically concealed when displaying the official QR sticker, ensuring clean printing and scanning on both desktop and mobile devices.
- **Multi-Engine QR Scanner:**
  - Modern WebRTC camera feed utilizing Google Chromium's native `BarcodeDetector` API for zero-lag hardware decoding, with seamless fallback to `jsQR` (canvas pixel analysis) for Safari and Firefox.
- **Zero-Docker In-Memory Fallback:**
  - Ready for cloud PostgreSQL (Neon / Supabase), with an embedded in-memory mock database that operates out-of-the-box without requiring Docker or local DB setups.
- **Automated WhatsApp Anti-Fraud Alerts:**
  - Dispatches immediate security alerts to registered merchant phone numbers whenever a geographic breach or overlay attack is intercepted.

---

## 📐 Adaptive 3-Layer Defense Architecture

```
[Buyer Device: NusaPay Mobile Web]
             │
             │ 1. Capture QR & Hardware GPS Coordinates
             ▼
[ValidQR Scan Engine: /api/v1/verify/scan]
             │
   ┌─────────┴────────────────────────────────────────┐
   ▼                                                  ▼
[Layer 1: NMID Lookup]                      [Database / Cache]
   │ Validates National Merchant ID                   │
   ▼                                                  │
[Layer 2: Hybrid Fuzzy Match]                         │
   │ 40% Levenshtein + 60% Token Overlap              │
   ▼                                                  │
[Layer 3: GPS Geofence Check (±20m)]                  │
   │ Haversine formula calculation                    │
   │ Distance <= 20m?                                 │
   ├───────────────┬──────────────────────────────────┘
   │ YES           │ NO (Breach > 20m)
   ▼               ▼
[🟢 VERIFIED]   [🔴 HARD BLOCK: OVERLAY ATTACK]
Proceed to Pay     │
                   ├─► Transaction Terminated
                   └─► WhatsApp Fraud Alert Dispatched
```

---

## 💻 Prerequisites

Ensure your development environment meets the following specifications:

| Requirement | Minimum Version | Recommended |
|---|---|---|
| **Node.js** | `v18.18.0` | `v20.x LTS` or higher |
| **npm** | `v9.0.0` | `v10.x` (or `pnpm` / `yarn`) |
| **Operating System** | Windows 10/11, macOS, or Linux | Windows 11 / Ubuntu 22.04 LTS |
| **Web Browser** | Chrome 90+, Edge 90+, Safari 14+, Firefox 88+ | Chrome (for native BarcodeDetector) |

---

## 📥 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ryanmaulanabp/Hacknusa-ValidQR.git
cd Hacknusa-ValidQR
```

*(If working from the local lomba monorepo, navigate directly to `hacknusa-web`)*:
```bash
cd "c:\Users\Ryan Maulana\lomba\hacknusa-web"
```

### 2. Install Dependencies
```bash
npm install
```

---

## ⚙️ Environment Configuration

Copy the example environment template into a local environment file:

```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# Linux / macOS
cp .env.example .env.local
```

### Environment Variables Breakdown (`.env.local`)

```env
# ==========================================
# ValidQR (NusaPay) Environment Variables
# ==========================================

# ── Cloud PostgreSQL Database ──
# Neon Serverless connection string (SSL required):
DATABASE_URL=postgresql://neondb_owner:[PASSWORD]@[ENDPOINT].neon.tech/neondb?sslmode=require

# Supabase connection string alternative:
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# ── ValidQR Security Thresholds ──
GEOFENCE_RADIUS_METERS=20
FUZZY_WARNING_THRESHOLD=50

# ── WhatsApp Bot Alerts (Optional - Fonnte API) ──
FONNTE_TOKEN=
WHATSAPP_ALERT_TARGET=6281234567890
```

> [!NOTE]
> **Zero-Setup Mode:** If `DATABASE_URL` is omitted, the application seamlessly activates an **in-memory database fallback** pre-seeded with test data (Warung Bakso Pak Budi & Toko Aksesoris Penipu). No database installation is required for quick reviews!

---

## 🏃‍♂️ Running Locally (Development)

Start the Next.js development server with hot-module replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

To test on your mobile smartphone over the same Wi-Fi network:
```
http://<YOUR_LOCAL_IP>:3000
```
*(Allow camera and location permissions when prompted by your browser).*

---

## 🚀 Local Production Build & Deployment

### 1. Standalone Production Server

Build the optimized Next.js production bundle:
```bash
npm run build
```

Once compilation completes successfully, launch the production server:
```bash
npm run start
```
The application will serve production-optimized static and dynamic routes on `http://localhost:3000`.

To run on a customized port:
```bash
npx next start -p 8080
```

### 2. Process Manager Daemon (PM2)

For continuous, production-grade deployment on a local VPS or machine:

```bash
# Install PM2 globally
npm install -g pm2

# Build the project
npm run build

# Start with PM2
pm2 start npm --name "validqr-web" -- start -- -p 3000

# View status and monitor logs
pm2 status
pm2 logs validqr-web

# Enable automatic restart on system reboot
pm2 save
pm2 startup
```

### 3. Docker Container Deployment

Create a `Dockerfile` in the project root:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

Build and execute the Docker container:
```bash
docker build -t validqr-web:latest .
docker run -d -p 3000:3000 --env-file .env.local --name validqr-container validqr-web:latest
```

---

## 🧪 Evaluation Runbook & Demo Scenarios

For HackNusa judges and evaluators, the app includes **Instant Demo Presets** embedded inside the scanner interface:

| Scenario | Target Merchant | Scan Origin | Verification Outcome | Engine Rationale |
|---|---|---|---|---|
| **Stiker A (Official)** | Warung Bakso Pak Budi (`ID10293847561`) | Gedung Selaru Telkom Univ | 🟢 **VERIFIED** | NMID valid, 100% name match, scan coordinates within the **20m geofence radius**. Seamless checkout. |
| **Stiker B (Overlay Attack)** | Toko Aksesoris Penipu (`ID99999999980`) | Gedung Selaru (Registered: Jakarta) | 🔴 **HARD BLOCKED** | Physical distance ~122 km breaches the **20m geofence**. Instant freeze, zero balance loss, WhatsApp incident alert fired. |
| **Stiker C (Rebrand Attack)** | Bakso Budi Dipatiukur (`ID10293847561`) | Gedung Selaru Telkom Univ | 🟡 **WARNING** | Same NMID and location, but name similarity drops to ~45% (below threshold). Confirmation dialogue prompt. |

---

## 🏬 Merchant Portal Walkthrough

Access the portal at `http://localhost:3000/merchant-portal`:

1. **Interactive Coordinate Selection:**
   - Click anywhere on the Leaflet map, use the OpenStreetMap search bar, or use the **GPS Saya** satellite lock button to pinpoint your storefront.
   - Adjust coordinates with 1-meter mathematical geodesic nudge buttons ($\uparrow \downarrow \leftarrow \rightarrow$).
2. **Generating Official QRIS Stickers:**
   - Provide the Merchant Name and City.
   - Click **Generate & Tampilkan Stiker QRIS**. An official EMVCo-compliant QR sticker is rendered in high resolution with print and PNG download actions.
3. **Inspecting Existing Merchants (Read-Only Mode):**
   - In the **Daftar Merchant Terdaftar** table, click on any merchant row or the **📍 Lokasi GPS** button.
   - The map automatically flies to the merchant's exact location, highlights the 20m geofence perimeter, and locks input fields into **Read-Only Mode** to preserve database integrity.
   - Use the **Cek Jarak GPS** button to view live proximity from your current physical position to the store.
   - Click **Buat Merchant Baru** to return to registration mode.

---

## 🔌 REST API Reference

### Health Check
```http
GET /api/health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "ValidQR Next.js Fullstack API",
  "version": "2.0.0",
  "timestamp": "2026-09-30T06:45:56.018Z"
}
```

---

### Verify QRIS Scan (3-Layer Engine)
```http
POST /api/v1/verify/scan
Content-Type: application/json

{
  "nmid": "ID10293847561",
  "name": "WARUNG BAKSO PAK BUDI",
  "latitude": -6.974021,
  "longitude": 107.630342,
  "accuracy": 4
}
```
**Response (200 OK — Verified):**
```json
{
  "success": true,
  "status": "VERIFIED",
  "action": "PROCEED",
  "color": "GREEN",
  "kicker": "Merchant Resmi & Lokasi Terverifikasi",
  "title": "Transaksi Aman",
  "distance_meters": 3.2,
  "geofence_radius": 20,
  "location_check": "MATCH",
  "fuzzy_score": 100,
  "is_rebrand": false
}
```

---

### Fetch Registered Merchants
```http
GET /api/v1/merchants
```

### Generate Merchant QRIS Sticker
```http
POST /api/v1/merchants/generate-sticker
Content-Type: application/json

{
  "name": "KEDAI KOPI NUSA",
  "city": "BANDUNG",
  "latitude": -6.973500,
  "longitude": 107.631200,
  "wa_number": "6281234567890"
}
```

---

## 📂 Project Structure

```
hacknusa-web/
├── public/                     # Static assets, branding, and icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/         # System heartbeat endpoint
│   │   │   ├── v1/
│   │   │   │   ├── merchants/  # Merchant registration & stickers
│   │   │   │   ├── verify/scan # 3-Layer ValidQR verification engine
│   │   │   │   ├── notify/     # WhatsApp alert dispatch route
│   │   │   │   └── incidents/  # Audit log queries
│   │   │   └── db-init/        # Automated DB schema initializer
│   │   ├── history/            # Audit incident logs UI
│   │   ├── merchant-portal/    # Interactive Leaflet admin portal
│   │   ├── layout.tsx          # App root layout & metadata
│   │   └── page.tsx            # NusaPay mobile e-wallet interface
│   ├── components/
│   │   ├── LocationPickerMap.tsx # High-precision Leaflet map & geofence UI
│   │   ├── ScannerModal.tsx    # WebRTC barcode camera scanner
│   │   ├── StickerModal.tsx    # Zero-leak official QRIS modal
│   │   ├── VerificationPopup.tsx # 3-Layer security result card
│   │   ├── BalanceCard.tsx     # E-wallet balance & quick transfer
│   │   ├── BottomNav.tsx       # Native mobile navigation bar
│   │   └── MobileFrame.tsx     # Desktop smartphone enclosure mockup
│   └── lib/
│       ├── geofence.ts         # Haversine geodesic distance logic
│       ├── fuzzy.ts            # Levenshtein & token overlap algorithms
│       ├── emvco.ts            # EMVCo QRIS TLV parsing engine
│       ├── db.ts               # PostgreSQL client with in-memory fallback
│       ├── mockData.ts         # Hackathon demo presets & sample stores
│       └── translations.ts     # Bilingual dictionary (Indonesian & English)
├── .env.example                # Configuration template
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler rules
└── README.md                   # Project documentation
```

---

## 🔒 Security & Compliance

- **EMVCo QR Code Specification:** Fully adheres to EMVCo Merchant-Presented Mode specifications (TLV data format, CRC16 verification).
- **Graceful GPS Degradation:** Incorporates hardware accuracy tolerance margins ($\pm \text{accuracy}$) to avoid false-positive blocks in deep indoor shopping malls.
- **Client Sanitization:** Input sanitization across merchant creation endpoints prevents SQL injection and cross-site scripting (XSS).
- **Zero-Storage of Sensitive Data:** Payment PINs and biometric tokens are processed entirely in-memory and never logged to persistent disks.

---

## 👥 Core Team — Tim NusaPay

- **Rahmatul Akbar Alim** — Frontend Engineering, AI Security Algorithms, UI/UX Architecture
- **Ryan Maulana** — Fullstack & Backend Integration, Database Engineering, Security Protocols

---

<div align="center">

**HackNusa 2026 Innovation Submission**  
*Telkom University × Kaspersky Cybersecurity Hackathon*

</div>
