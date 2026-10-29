# Everything: Local-First Developer & System Suite

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Client--Side-10b981?style=flat-square)](#privacy--security-posture)
[![Deployment](https://img.shields.io/badge/Edge-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://everything.adamnordling.se/)

A high-density, zero-telemetry, client-side utility suite for developers and power users. Designed as a unified workstation command center featuring telemetry monitoring, precision stream extraction, Swedish almanac intelligence, and operating system optimization playbooks.

All computations, state persistence, and data buffers execute strictly inside the browser sandbox with zero backend collection servers.

---

## ⚡ Core Philosophy

- **Zero Telemetry & Tracking:** No analytics scripts, no advertising pixels, and no remote data harvesting.
- **Local-First State:** Data (scratchpad buffers, deadlines, routine habits) persists locally via `localStorage` with offline JSON export/import.
- **Pure Native Performance:** Zero heavy runtime frameworks (no React, Vue, or Angular overhead). Pure TypeScript, native Web APIs, and CSS Cascade Layers (`@layer`).
- **Dynamic Code Splitting:** Tools load on-demand via dynamic `await import()` boundaries, keeping the initial bundle under ~30 KB.

---

## 🛠 Features & Modules

### 1. Frameless Dashboard (Overview)
- **Chronometry Station:** Live clock with ISO-8601 week counters, active session timers, Unix Epoch one-click copying, solar horizon calculations, and daylight saving time (DST) status.
- **Adaptive Timezone Converter:** Rapid 4-digit input (`1200` &rarr; `12:00`), automatic 12H (`AM`/`PM`) and 24H format adaptation based on the target timezone (US vs. Europe/Asia), and real-time relative countdown indicators (`Local: 20:00 (8:00 PM) · Oct 29th [Today · in 2h 15m]`).
- **Workstation Telemetry HUD:** Hardware concurrency monitoring, physical display resolution vs. viewport scaling, display refresh rate benchmarking (60-frame buffer), WebGL unmasked GPU detection, active JS heap memory tracking, and dual-stack IPv6 probes.
- **Swedish Calendar & Date Intelligence:** Full *Svenska Akademiens Namnsdagar* (365 days), astronomical Easter calculations, statutory red days (*röda dagar*), flag days, and bridge day (*klämdagar*) detection.
- **Atmospheric Engine:** Real-time weather, surface pressure, UV index, wind speeds, and solar arc progress powered by Open-Meteo with an interactive Leaflet coordinates picker.
- **Local Productivity Buffers:** Auto-saving scratchpad clipboard buffer with word counters, deadline tracker synchronized with calendar days, and morning routine habit grids.

### 2. YouTube Precision Studio & Downloader
- **Lossless Stream Slicing:** Generates optimized `yt-dlp` commands with HTTP Range requests (`--download-sections`) to extract specific byte fragments (e.g. slicing a 6-hour ambient loop) without downloading the entire source file.
- **Custom DSP & Audio Attenuation:** Direct PCM volume gain control (e.g. `-26.0 dB / 5%` for sleep and study loops) and lossless format conversions (`.wav`, `.flac`, `.opus`, `.mp3`).
- **Playlist Shield:** Batch stream extraction with error-tolerant flags (`--ignore-errors`) to automatically skip private, deleted, or geo-restricted tracks.
- **1-Click Toolchain Manager:** Pre-configured environment installation scripts across Windows (WinGet / Scoop), macOS (Homebrew), and Linux (APT / Pip).

### 3. Windows Optimization Playbook & Hardware Tuning
- **Chronological Tuning Pipeline:** Multi-phase guide from clean USB deployment (Rufus GPT/UEFI) through safe BIOS hardware alignment, DDU clean driver installation, and CTT WinUtil configuration.
- **Tailored 3D Driver Engine:** Codified driver matrices distinguishing legacy monolithic CPUs from modern multi-threaded architectures, and Pascal architectures from modern RTX hardware.
- **System Integrity Checkpoint:** Automated DISM component store repair and SFC system file verification scripts.
- **Kernel Latency Mitigation:** Message Signaled Interrupts (MSI Mode v3) configuration, Ethernet transceiver green-power disabling, MMCSS packet throttle fixes, and dynamic static NVMe pagefile sizing.

---

## 🏗 Architecture & Code Structure

The repository utilizes a modular, feature-folder architecture where each tool isolates its logic, scoped stylesheet, and pure HTML template:

```text
everything/
├── public/
│   ├── _headers                     # Cloudflare Edge security headers (CSP, HSTS)
│   ├── site.webmanifest             # PWA deployment manifest
│   ├── sitemap.xml                  # Canonical search index
│   └── robots.txt
│
├── src/
│   ├── core/                        # Global foundational engines
│   │   ├── dom.ts                   # Type-safe element query wrappers ($ & req)
│   │   ├── router.ts                # Lazy dynamic view loader (await import)
│   │   └── theme.ts                 # Unified theme controller (Light mode default)
│   │
│   ├── styles/                      # Global design system
│   │   ├── layers.css               # @layer reset, base, layout, components, utilities
│   │   ├── variables.css            # CSS custom properties (color tokens, typography)
│   │   ├── reset.css                # Base browser reset
│   │   ├── layout.css               # App shell, responsive sidebar & main stage
│   │   ├── components.css           # Global action pills, buttons & inputs
│   │   └── main.css                 # Master style sheet
│   │
│   ├── tools/                       # Isolated Feature Slices
│   │   ├── dashboard/               # Default dashboard & widgets
│   │   │   ├── css/                 # Widget stylesheets (clock, weather, tasks...)
│   │   │   └── ts/                  # Widget logic & state coordinators
│   │   │
│   │   ├── youtube/                 # YouTube Extractor Studio
│   │   │   ├── index.ts             # Logic, state & CLI generator
│   │   │   ├── youtubeView.html     # Pure HTML template (imported via ?raw)
│   │   │   └── youtube.css          # Scoped studio styles
│   │   │
│   │   └── windowsOptimizer/        # Windows Playbook
│   │       ├── index.ts             # Hardware engine & interactive state
│   │       ├── windowsView.html     # Pure HTML template (imported via ?raw)
│   │       ├── windows.css          # Playbook styles
│   │       ├── hardwareData.ts      # Motherboard, GPU, and RAM databases
│   │       └── cttBlueprint.ts      # Tweaks and checks specification
│   │
│   ├── vite-env.d.ts                # Ambient type definitions for ?raw imports
│   └── main.ts                      # Application bootstrap entrypoint
│
├── index.html                       # Lean single-page application shell
├── vite.config.ts                   # Bundler configuration with inlined CSS minification
└── tsconfig.json                    # Strict TypeScript configuration
```

### Vite `?raw` HTML Template Strategy
Tools maintain pure `.html` template files (`youtubeView.html`, `windowsView.html`) instead of storing large strings in TypeScript. Vite imports these via `?raw`:

```ts
import template from './youtubeView.html?raw';

export function initYoutube(): void {
    const stage = document.getElementById('view-tool-youtube');
    if (stage && !stage.hasChildNodes()) {
        stage.innerHTML = template; // Clean, linted, format-checked HTML!
    }
}
```

This ensures full HTML syntax highlighting, Emmet completion, and automated formatting via Prettier while keeping `index.html` under a few hundred lines.

---

## 🔒 Privacy & Security Posture

The application is deployed on Cloudflare Pages and adheres to strict web security standards:

- **Content Security Policy (CSP):** Restricts script evaluation to `'self'`, enforces Subresource Integrity (SRI) on external CDNs (Leaflet), blocks object embedding (`object-src 'none'`), and limits form actions (`form-action 'self'`).
- **HTTP Strict Transport Security (HSTS):** Enforced with `max-age=31536000; includeSubDomains; preload`.
- **Isolation Policies:** Configured with `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`.
- **Scoped Permissions Policy:** Restricts access to device sensors, camera, microphone, USB, payments, and background tracking APIs (`clipboard-read=()`, `camera=()`, `browsing-topics=()`).

---

## 🚀 Development & Build

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher

```bash
# Clone the repository
git clone https://github.com/adamnordling/everything.git
cd everything

# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript type check
npm run typecheck

# Run linter
npm run lint

# Format code with Prettier
npm run format

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📋 Roadmap & Backlog (TODO)

### 1. New Utility Modules
- [ ] **Hash & Checksum Studio:** Browser-based SHA-256 / SHA-512 / MD5 hashing and CSP hash generator directly in the UI.
- [ ] **Developer Toolbox (All-in-One Quick Box):**
  - Responsive REM/PX scaler & aspect ratio calculator.
  - Quick unit converter (temperature, data storage, speed, mass).
  - Rule of Three / cross-multiplication calculator.
  - Instant string case switcher (camelCase, kebab-case, snake_case, PascalCase, CONSTANT_CASE).
  - Base64 & URL encoder/decoder pill.
  - Cryptographic password and secret key generator (`crypto.getRandomValues`).
  - Client-side QR code generator.
- [ ] **Media & Document Utilities:**
  - Client-side media file converter (WebAssembly / FFmpeg.wasm).
  - JSON / JWT / RegEx validator and formatter.
- [ ] **Language & Code Translation:**
  - Multi-language translator.
  - Programming language syntax and snippet translator.
- [ ] **Network & Diagnostic Tools:**
  - In-browser network speed and throughput test.
  - Subnet & CIDR calculator engine.
- [ ] **Productivity & Finance:**
  - Built-in Pomodoro focus timer with audible notifications.
  - Market watch: Financial indices and crypto market tracker.

### 2. Dashboard Refinements
- [ ] Add quick shortcut palette (<kbd>Ctrl</kbd> + <kbd>K</kbd>) for instant tool search.
- [ ] Implement customizable dashboard grid ordering (drag-and-drop widget arrangement).

### 3. Windows Playbook Enhancements
- [ ] Fix CTT WinUtil shortcut and terminal formatting for PowerShell Administrator mode (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + Enter).
- [ ] Add compact markdown-style syntax formatting for all command blocks.
- [ ] Expand motherboard database with advanced BIOS tables (legacy Intel chipsets, speed-shift variations, legacy vendor menus).
- [ ] Add discrete vendor icons to the hardware selector matrix.
- [ ] Refine navigation bar icon styling and active tool transition animations.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.





developer handbook > som windows playbook men bygga en file structure
media file converter
validator?
translate languages
translate programming lagnauges
hash script - put in index.html and get CSP with hashes
All in one box:
REM / responsive scaler, aspect ratio calculator, google,
netowrk speed test
Youtube downloader
Pomodoro timer
Quick Unit Converter 
Rule of Three / Cross-Multiplication:
QR code generator
Instant Case Switcher:
Cryptographic Password & Secret Key Generator:
Base64 & URL Decode/Encode Pill:
finance up and down
crypto up and down news

Ctrl R powershell-admin?
fixa så alla cmd command är mindre, bättre copy, ser ut som powershell markdown
fixa coloring, more minimanstlic
fixa favicon ny color
