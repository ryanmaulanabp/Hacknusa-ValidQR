# ValidQR (NusaPay) — Real-Time Adaptive Anti-Fraud Engine for QRIS

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Hackathon](https://img.shields.io/badge/HackNusa_2026-Finalist-indigo?style=for-the-badge)

**Adaptive Real-Time Anti-Fraud Engine for the Indonesian QRIS Payment Ecosystem**  
*HackNusa 2026 — Telkom University × Kaspersky Cybersecurity Innovation Hackathon*

[**🚀 Explore Live Web App (Vercel)**](https://hacknusa-web.vercel.app) • [**🏬 Merchant Portal**](https://hacknusa-web.vercel.app/merchant-portal) • [**📋 Incident Audit Logs**](https://hacknusa-web.vercel.app/history)

</div>

---

## 📖 Table of Contents

1. [Overview & Core Value](#-overview--core-value)
2. [Prerequisites](#-prerequisites)
3. [Step-by-Step: How to Install & Run Locally](#-step-by-step-how-to-install--run-locally)
4. [Step-by-Step: Local Production Build & Deployment](#-step-by-step-local-production-build--deployment)
   - [Option A: Standard Production Server](#option-a-standard-production-server)
   - [Option B: PM2 Process Daemon](#option-b-pm2-process-daemon)
   - [Option C: Docker Containerization](#option-c-docker-containerization)
5. [Evaluation Runbook: 8 HackNusa Test Scenarios](#-evaluation-runbook-8-hacknusa-test-scenarios)
6. [Key Security Architecture](#-key-security-architecture)
   - [3-Layer Sequential Verification Pipeline](#1-3-layer-sequential-verification-pipeline)
   - [Area Security Policy (Exclusive vs Open Zones)](#2-area-security-policy-exclusive-vs-open-zones)
   - [Pre-Payment Physical Store & Product Photo Verification](#3-pre-payment-physical-store--product-photo-verification)
   - [Dynamic vs Static QRIS Support (Tag 54)](#4-dynamic-vs-static-qris-support-tag-54)
   - [Automated WhatsApp Anti-Fraud Gateway](#5-automated-whatsapp-anti-fraud-gateway)
   - [Full Bilingual Localization (ID / EN)](#6-full-bilingual-localization-id--en)
7. [Merchant Portal & Onboarding](#-merchant-portal--onboarding)
8. [REST API Documentation](#-rest-api-documentation)
9. [Project Directory Structure](#-project-directory-structure)
10. [Core Team](#-core-team)

---

## 🎯 Overview & Core Value

**ValidQR** is an adaptive, zero-modification anti-fraud client-server engine specifically engineered for the Indonesian QRIS ecosystem. It stops **physical QR sticker replacement (Overlay Attacks)**, **fake charity boxes**, **merchant impersonation (Typosquatting/Rebranding)**, and **tampered bill amounts** in real time **before** buyer funds are deducted.

### Key Highlights:
- **Physical-Digital Binding:** Pairs digital merchant identity (NMID) with satellite GPS coordinates; fraudsters can replicate a QR image, but cannot fake physical proximity.
- **Zero Modification Required:** Operates seamlessly with all existing national EMVCo QRIS stickers without requiring merchant hardware upgrades.
- **Sub-200ms Decision:** Executes complete cryptographic validation, string distance calculations, and geodesic computations in a fraction of a second.
- **Physical Store & Product Photo Inspection:** Buyers can inspect official storefront and merchandise photos registered with 16-digit national NIK before approving payment.
- **Bilingual Interface:** Instant seamless switching between **Bahasa Indonesia (ID)** and **English (EN)** across all screens, modals, and receipts.

---

## 💻 Prerequisites

Ensure your host machine has the following tools installed:

| Requirement | Minimum Version | Recommended | Notes |
|---|---|---|---|
| **Node.js** | `v18.18.0` | `v20.x LTS` or higher | Required for Next.js runtime |
| **npm** | `v9.0.0` | `v10.x` (or `pnpm` / `yarn`) | Package manager |
| **Operating System** | Windows 10/11, macOS, Linux | Any modern OS | Native PowerShell/Bash support |
| **Browser** | Chrome 90+, Edge 90+, Safari 14+ | Chromium-based | Supports camera & Geolocation API |

---

## 🚀 Step-by-Step: How to Install & Run Locally

Follow these clear, step-by-step instructions to get the solution running on your local machine:

### Step 1: Clone the Repository
Open your terminal (PowerShell or Bash) and clone the project:
```bash
git clone https://github.com/ryanmaulanabp/Hacknusa-ValidQR.git
cd Hacknusa-ValidQR
```

*(If you are navigating from the local workspace folder)*:
```bash
cd "c:\Users\Ryan Maulana\lomba\hacknusa-web"
```

### Step 2: Install Project Dependencies
Install all required Node.js packages:
```bash
npm install
```

### Step 3: Setup Environment Variables
Copy the provided environment example into `.env.local`:

```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# Linux / macOS
cp .env.example .env.local
```

#### `.env.local` Configuration:
```env
# ── Cloud PostgreSQL Database (Optional) ──
# Neon Serverless connection string:
DATABASE_URL=postgresql://neondb_owner:[PASSWORD]@[ENDPOINT].neon.tech/neondb?sslmode=require

# ── ValidQR Security Thresholds ──
GEOFENCE_RADIUS_METERS=20
FUZZY_WARNING_THRESHOLD=50

# ── WhatsApp Anti-Fraud Bot (Optional - Fonnte API) ──
FONNTE_TOKEN=
WHATSAPP_ALERT_TARGET=6281234567890
```

> [!TIP]
> **Zero-Setup In-Memory Mode:** If `DATABASE_URL` is omitted or left empty, ValidQR **automatically activates an embedded in-memory database** pre-seeded with all hackathon evaluation scenarios (Warung Bakso Pak Budi, Masjid Raya, Pujasera, etc.). **No external PostgreSQL or Docker database is required for quick evaluation!**

### Step 4: Run the Development Server
Start the local server with Next.js Turbopack:
```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:3000
```
- **Mobile E-Wallet App:** `http://localhost:3000`
- **Merchant Admin Portal:** `http://localhost:3000/merchant-portal`
- **Incident Audit Log:** `http://localhost:3000/history`

### Step 5: Test on Mobile Smartphone (Camera & GPS)
To test physical camera scanning and satellite GPS on your mobile phone:
1. Ensure your smartphone and PC are connected to the same Wi-Fi network.
2. Note your computer's local IP address (e.g., `192.168.1.15` or `10.66.176.252`).
3. Open mobile browser and go to:
   ```
   http://<YOUR_COMPUTER_IP>:3000
   ```
4. Allow Camera and Location permissions when prompted by your browser.

---

## 📦 Step-by-Step: Local Production Build & Deployment

### Option A: Standard Production Server

1. **Build the production bundle:**
   ```bash
   npm run build
   ```
   *Next.js will compile TypeScript, bundle Tailwind CSS, and generate static and dynamic server routes.*

2. **Start the production server:**
   ```bash
   npm run start
   ```
   The production application runs on `http://localhost:3000`.

3. *(Optional)* To run on a custom port (e.g., 8080):
   ```bash
   npx next start -p 8080
   ```

---

### Option B: PM2 Process Daemon (Background Service)

For continuous, background operation on a local server or VM:

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Build the project
npm run build

# 3. Start under PM2 supervision
pm2 start npm --name "validqr-web" -- start -- -p 3000

# 4. Check status and logs
pm2 status
pm2 logs validqr-web

# 5. Stop process when done
pm2 stop validqr-web
```

---

### Option C: Docker Containerization

Deploy the application inside an isolated Docker container:

```bash
# 1. Build the Docker image
docker build -t validqr-web:latest .

# 2. Run the container
docker run -d -p 3000:3000 --env-file .env.local --name validqr-container validqr-web:latest

# 3. Check logs
docker logs -f validqr-container
```

---

## 🧪 Evaluation Runbook: 8 HackNusa Test Scenarios

The desktop web view includes a **Desktop Companion Widget ("Skenario Pengujian / Testing Scenarios")** on the right side of the dashboard. Evaluators can click any button to immediately test the 3-Layer anti-fraud engine without printing physical paper:

| Preset Button | Scenario Tested | Scanned Target vs Registered Store | Security Policy | Outcome | Anti-Fraud Rationale |
|---|---|---|---|---|---|
| **Stiker A** | Official Merchant | Warung Bakso Pak Budi (`ID10293847561`) | Open Zone | 🟢 **VERIFIED** | Location match (3m $\le$ 20m), 100% name match, official NMID. Smooth checkout. |
| **Stiker B** | Overlay Sticker Attack | Toko Aksesoris Penipu (`ID99999999980`) | Open Zone | 🔴 **HARD BLOCKED** | Registered in Jakarta, scanned in Bandung (~122 km breach). Instant block, WhatsApp alert dispatched. |
| **Stiker C** | Rebrand / Typosquatting | Bakso Budi Dipatiukur (`ID10293847561`) | Open Zone | 🟡 **WARNING** | Same NMID & location, but name score drops to ~45%. Caution prompt shown to buyer. |
| **Stiker E** | Official Mosque QR | Infaq Masjid Raya Selaru (`ID88880001001`) | **Exclusive Zone** | 🟢 **VERIFIED** | Authorized single-QR in locked zone. Transaction allowed safely. |
| **Stiker F** | Charity Box Fraud | QR Liar Kotak Amal (`ID99999999991`) | **Exclusive Zone** | 🔴 **HARD BLOCKED** | **Zero-Tolerance Lockdown Violation**. Unregistered rogue QR detected in locked zone; blocked instantly. |
| **Stiker G** | Coexisting Merchants | Mie Ayam Pak Budi - Food Court | Open Zone | 🟢 **VERIFIED** | Adjacent shop (3m from Pak Budi). Allowed side-by-side in Open Zone without mutual blocking. |
| **Stiker H** | Mosque QR Without GPS | Infaq Masjid Raya Selaru | **Exclusive Zone** | 🔴 **BLOCKED (GPS_REQUIRED)** | GPS turned off on device. In exclusive zones, GPS is strictly mandatory to prevent spoofing. |
| **Stiker I** | Dynamic POS QRIS | Kasir Ritel POS (EMVCo Tag 54) | Open Zone | 🟢 **VERIFIED (Rp 35.000)** | Bill amount automatically locked at Rp 35.000 via Tag 54. Manual amount tampering blocked. |

---

## 🛡️ Key Security Architecture

### 1. 3-Layer Sequential Verification Pipeline
```
[Buyer Device: Scanner / Camera]
       │
       ▼ (Submits scanned QR payload + live GPS coordinates)
[/api/v1/verify/scan]
       │
       ├─► Layer 0: Security Policy Mode Check (Exclusive Zone vs Open Zone)
       ├─► Layer 1: NMID Authority Whitelist Validation
       ├─► Layer 2: Hybrid Fuzzy Match (Levenshtein 40% + Token Overlap 60%)
       └─► Layer 3: Haversine Geofencing GPS Verification (±20m tolerance)
       │
       ├──► 🟢 VERIFIED     : Proceed to payment with locked or manual amount
       ├──► 🟡 WARNING      : Name mismatch alert, user confirmation requested
       └──► 🔴 HARD BLOCKED : Transaction terminated; WhatsApp incident alert dispatched
```

### 2. Area Security Policy (Exclusive vs Open Zones)
- **Zona Eksklusif (Single-Merchant Lockdown):** Designed for high-risk, single-QR locations such as Mosques, Churches, Charity Boxes, and Hospital Emergency Cashiers. Only 1 official registered QR code is permitted in this perimeter. Any rogue QR scanned inside the zone is **hard-blocked instantly**.
- **Zona Terbuka (Multi-Merchant Coexistence):** Designed for culinary centers, food courts, and commercial complexes. Allows multiple legitimate merchants to operate side-by-side without interference.

### 3. Pre-Payment Physical Store & Product Photo Verification
To eliminate fictitious stores and rogue stickers:
- **Mandatory Registration Proofs:** Merchants must provide a valid 16-digit National NIK, detailed business commodity descriptions, and upload 2 real-world photographs:
  1. *Physical Storefront / Shopfront photo* (tampak depan gerobak / etalase).
  2. *Merchandise / Product menu photo* (foto barang dagangan).
- **Buyer Pre-Payment Inspection Modal:** Buyers can open and compare the official photos directly on their smartphone before completing payment.
- **🚨 Report Store Mismatch:** If the physical stall or seller differs from the official photo, the buyer can click *"Laporkan Toko Berbeda"*. The transaction is instantly cancelled with zero balance loss and logged to the security audit dashboard.

### 4. Dynamic vs Static QRIS Support (Tag 54)
- **Static QRIS (Tag 01="11"):** Fixed sticker where buyers enter amount manually.
- **Dynamic QRIS (Tag 01="12"):** Cashier/POS generated QR containing invoice ID and locked transaction amount in EMVCo Tag 54. ValidQR locks the input field and displays a *"Nominal Terkunci"* chip, preventing fraudulent amount manipulation.

### 5. Automated WhatsApp Anti-Fraud Gateway
Whenever a geofence breach or rogue QR is intercepted, the system dispatches an automated alert via the Fonnte WhatsApp API to the registered merchant's phone:
```
🚨 PERINGATAN KEAMANAN ValidQR:
Terdeteksi percobaan transaksi mencurigakan di luar radius lokasi resmi Anda.
Mohon segera periksa fisik stiker QRIS di meja kasir Anda!
```

### 6. Full Bilingual Localization (ID / EN)
The active language selected in the dashboard dynamically propagates across:
- Scanner modal and satellite GPS status
- 3-Layer verification result popup and geofence explanations
- Visual store & product photo inspection sheet
- Payment nominal input and PIN authentication sheet
- Digital payment receipt with localized date and currency formatting

---

## 🏬 Merchant Portal & Onboarding

Access the portal at `http://localhost:3000/merchant-portal`:

1. **Leaflet OpenStreetMap Geofence Selector:**
   - Click anywhere on the map or use the **GPS Saya** button to pinpoint the store.
   - Adjust coordinates with 1-meter precision nudge buttons ($\uparrow \downarrow \leftarrow \rightarrow$).
2. **Registration Verification Requirements:**
   - Store Name & City.
   - 16-Digit Owner NIK (KTP).
   - Goods & Sold Items Description.
   - Storefront Photo & Product Photo Uploads (Auto-compressed client-side).
   - Choice of QRIS Type (Static vs Dynamic) and Security Mode (Open vs Exclusive).
3. **Official QRIS Sticker Issuance:**
   - Generates high-resolution, EMVCo-compliant QRIS stickers with CRC-16 checksums, ready for PNG download or direct printing.
4. **Read-Only Inspection Mode:**
   - Clicking any merchant in the database table pans the map directly to their location, highlights the 20m perimeter, and locks form inputs into read-only mode to prevent inadvertent edits.

---

## 🔌 REST API Documentation

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "service": "ValidQR Next.js Fullstack API",
  "version": "2.1.0",
  "timestamp": "2026-10-03T06:30:00.000Z"
}
```

### 2. Verify QRIS Scan
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
  "distance_meters": 3.2,
  "geofence_radius": 20,
  "location_check": "MATCH",
  "fuzzy_score": 100,
  "qr_type": "STATIS",
  "store_photo_url": "/uploads/store_budi.jpg",
  "product_photo_url": "/uploads/product_bakso.jpg"
}
```

### 3. Fetch Registered Merchants
```http
GET /api/v1/merchants
```

### 4. Report Suspected Fraud / Store Mismatch
```http
POST /api/v1/incidents
Content-Type: application/json

{
  "action": "REPORT_MISMATCH",
  "nmid": "ID10293847561",
  "reason": "SUSPECTED_FAKE_STORE"
}
```

---

## 📂 Project Directory Structure

```
hacknusa-web/
├── public/                     # Static assets, branding, and icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/         # System heartbeat endpoint
│   │   │   ├── v1/
│   │   │   │   ├── merchants/  # Merchant registration & stickers
│   │   │   │   ├── verify/scan # 3-Layer + Layer 0 ValidQR verification engine
│   │   │   │   ├── notify/     # WhatsApp alert dispatch route
│   │   │   │   └── incidents/  # Fraud incident logging & audit API
│   │   │   └── db-init/        # Automated DB schema initializer
│   │   ├── history/            # Audit incident logs UI
│   │   ├── merchant-portal/    # Interactive Leaflet admin portal
│   │   ├── layout.tsx          # App root layout & metadata
│   │   └── page.tsx            # NusaPay mobile e-wallet interface
│   ├── components/
│   │   ├── DesktopCompanionWidgets.tsx # 8 HackNusa demo presets UI
│   │   ├── LocationPickerMap.tsx       # Leaflet map & geofence perimeter UI
│   │   ├── ScannerModal.tsx            # WebRTC camera barcode scanner
│   │   ├── VerificationPopup.tsx       # 3-Layer security result card & photo proof
│   │   ├── PaymentAmountModal.tsx      # Nominal input & dynamic lock amount
│   │   ├── PaymentSuccessModal.tsx     # Celebration modal & digital receipt
│   │   ├── StickerModal.tsx            # Official printable QRIS sticker
│   │   └── BottomNav.tsx               # Mobile navigation bar
│   └── lib/
│       ├── geofence.ts         # Haversine geodesic distance logic
│       ├── fuzzy.ts            # Levenshtein & token overlap algorithms
│       ├── emvco.ts            # EMVCo QRIS TLV parsing engine
│       ├── db.ts               # PostgreSQL client with in-memory fallback
│       ├── mockData.ts         # Hackathon demo presets & sample stores
│       ├── LanguageContext.tsx # Bilingual state management (ID/EN)
│       └── translations.ts     # Complete bilingual dictionary
├── .env.example                # Configuration template
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── README.md                   # Complete solution documentation
```

---

## 👥 Core Team — Tim NusaPay

- **Rahmatul Akbar Alim** — Frontend Engineering, AI Security Algorithms, UI/UX Architecture
- **Ryan Maulana** — Fullstack & Backend Integration, Database Engineering, Security Protocols

---

<div align="center">

**HackNusa 2026 Innovation Submission**  
*Telkom University × Kaspersky Cybersecurity Hackathon*

</div>
