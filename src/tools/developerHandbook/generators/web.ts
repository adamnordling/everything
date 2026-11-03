import type { GeneratedFile, ScaffolderState } from '../types';

export function generateWebFiles(state: ScaffolderState): GeneratedFile[] {
    const isWeb = state.archetype === 'web-spa' || state.archetype === 'fullstack-ssr';
    const isExtension = state.archetype === 'browser-extension';
    const isTauri = state.archetype === 'desktop-tauri';
    const isLibrary = state.archetype === 'library-package';

    // GUARD: Only generate if the project actually has a Web, Extension, Tauri, or Library frontend
    if (!isWeb && !isExtension && !isTauri && !isLibrary) {
        return [];
    }

    const files: GeneratedFile[] = [];
    const hasTs = state.languages.includes('typescript');
    const isNext = state.framework === 'nextjs';
    const isReact = state.framework === 'react';

    // 1. Edge Security & Web Assets (Headers, Robots, Sitemap, Favicon)
    if (state.includeEdgeHeaders && !isExtension && !isTauri && !isLibrary) {
        files.push({
            path: 'public/_headers',
            description: 'Edge security posture: strict Content-Security-Policy, HSTS, and immutable caches',
            badge: 'Headers',
            content: `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Permissions-Policy: camera=(), microphone=(), geolocation=(), usb=(), browsing-topics=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self';
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  ! Cache-Control
  Cache-Control: public, max-age=31536000, immutable

/manifest.webmanifest
  ! Cache-Control
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
  Content-Type: application/manifest+json; charset=utf-8

/robots.txt
  ! Cache-Control
  Cache-Control: public, max-age=86400
  Content-Type: text/plain; charset=utf-8

/sitemap.xml
  ! Cache-Control
  Cache-Control: public, max-age=86400
  Content-Type: application/xml; charset=utf-8`
        });

        files.push({
            path: 'public/robots.txt',
            description: 'Search crawler directives with explicit sitemap indexing declaration',
            badge: 'Text',
            content: `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://${state.projectName}.com/sitemap.xml`
        });

        files.push({
            path: 'public/sitemap.xml',
            description: 'Canonical XML search index blueprint',
            badge: 'XML',
            content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${state.projectName}.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
        });

        files.push({
            path: 'public/manifest.webmanifest',
            description: 'PWA display metadata with standalone application properties',
            badge: 'JSON',
            content: `{
  "name": "${state.projectName}",
  "short_name": "${state.projectName}",
  "description": "Client-side high-density developer utility.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0c0f17",
  "theme_color": "#4f5dfa",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}`
        });

        files.push({
            path: 'public/favicon.svg',
            description: 'Clean vector SVG brand favicon asset',
            badge: 'SVG',
            content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#4F5DFA"/>
  <path d="M10 22L16 10L22 22" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
        });
    }

    // 2. Browser Extension Manifest V3
    if (isExtension) {
        files.push({
            path: 'manifest.json',
            description: 'Chrome / Firefox Manifest V3 extension configuration',
            badge: 'JSON',
            content: `{
  "manifest_version": 3,
  "name": "${state.projectName}",
  "version": "1.0.0",
  "description": "Zero-telemetry browser utility extension.",
  "action": {
    "default_popup": "popup.html",
    "default_icon": "public/favicon.svg"
  },
  "background": {
    "service_worker": "src/background.${hasTs ? 'ts' : 'js'}"
  },
  "permissions": [
    "storage",
    "activeTab"
  ]
}`
        });

        files.push({
            path: `src/background.${hasTs ? 'ts' : 'js'}`,
            description: 'Extension background service worker lifecycle controller',
            badge: hasTs ? 'TypeScript' : 'JavaScript',
            content: `chrome.runtime.onInstalled.addListener(() => {
  console.log('${state.projectName} Extension installed.');
});`
        });

        files.push({
            path: 'popup.html',
            description: 'Extension popup window view shell',
            badge: 'HTML',
            content: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${state.projectName}</title>
    <style>
      body { width: 320px; padding: 12px; font-family: system-ui, sans-serif; background: #0c0f17; color: #fff; margin: 0; }
    </style>
  </head>
  <body>
    <h3>${state.projectName}</h3>
    <p>Extension popup ready.</p>
    <script type="module" src="./src/popup.${hasTs ? 'ts' : 'js'}"></script>
  </body>
</html>`
        });

        files.push({
            path: `src/popup.${hasTs ? 'ts' : 'js'}`,
            description: 'Popup script interaction logic',
            badge: hasTs ? 'TypeScript' : 'JavaScript',
            content: `document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup initialized.');
});`
        });
    }

    // 3. Tauri 2.0 Desktop Configuration
    if (isTauri) {
        files.push({
            path: 'src-tauri/tauri.conf.json',
            description: 'Tauri 2.0 application windows, bundle security, and permissions',
            badge: 'JSON',
            content: `{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "${state.projectName}",
  "version": "0.1.0",
  "identifier": "com.${state.projectName}.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:5173",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "${state.projectName}",
        "width": 1100,
        "height": 760,
        "resizable": true
      }
    ],
    "security": {
      "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
    }
  }
}`
        });

        files.push({
            path: 'src-tauri/Cargo.toml',
            description: 'Tauri Rust backend dependencies',
            badge: 'TOML',
            content: `[package]
name = "app"
version = "0.1.0"
edition = "2021"

[build-dependencies]
tauri-build = { version = "2.0.0", features = [] }

[dependencies]
tauri = { version = "2.0.0", features = [] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"`
        });

        files.push({
            path: 'src-tauri/src/main.rs',
            description: 'Tauri desktop execution entrypoint',
            badge: 'Rust',
            content: `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}`
        });
    }

    // 4. Reusable Library Exports
    if (isLibrary) {
        files.push({
            path: `src/index.${hasTs ? 'ts' : 'js'}`,
            description: 'Universal library entrypoint exporting public API',
            badge: hasTs ? 'TypeScript' : 'JavaScript',
            content: `export interface InitOptions {
  debug?: boolean;
}

export function initialize(options: InitOptions = {}): boolean {
  if (options.debug) {
    console.log('[${state.projectName}] initialized with debug active.');
  }
  return true;
}`
        });

        files.push({
            path: 'tsup.config.ts',
            description: 'Dual ESM/CJS build engine configuration with type declarations',
            badge: 'TypeScript',
            content: `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false
});`
        });
    }

    // 5. Next.js App Router Structure
    if (isNext) {
        files.push({
            path: 'next.config.ts',
            description: 'Next.js build configuration',
            badge: 'TypeScript',
            content: `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false
};

export default nextConfig;`
        });

        files.push({
            path: 'src/app/layout.tsx',
            description: 'Root Next.js server layout with HTML/Body wrapper',
            badge: 'TypeScript',
            content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${state.projectName}',
  description: 'Full-stack application built with Next.js 15.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`
        });

        files.push({
            path: 'src/app/page.tsx',
            description: 'Next.js root page server component',
            badge: 'TypeScript',
            content: `export default function HomePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>${state.projectName}</h1>
      <p>Next.js 15 App Router is active.</p>
    </main>
  );
}`
        });

        files.push({
            path: 'src/app/globals.css',
            description: 'Global stylesheet for Next.js',
            badge: 'CSS',
            content: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { min-height: 100vh; background: #0c0f17; color: #f2f4f8; font-family: system-ui, sans-serif; }`
        });
    }

    // 6. Standard Web HTML Shell, CSS & Frontend Entrypoint (for SPA / Tauri)
    if (!isExtension && !isLibrary && !isNext) {
        files.push({
            path: 'index.html',
            description: 'Main HTML document shell linking favicon, manifest and entrypoint',
            badge: 'HTML',
            content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${state.projectName}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="stylesheet" href="./src/styles/main.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./src/main.${hasTs ? (isReact ? 'tsx' : 'ts') : isReact ? 'jsx' : 'js'}"></script>
  </body>
</html>`
        });

        files.push({
            path: 'src/styles/layers.css',
            description: 'CSS Cascade Layers precedence order and root reset',
            badge: 'CSS',
            content: `@layer reset, base, layout, components, utilities;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    min-height: 100vh;
    font-family: system-ui, -apple-system, sans-serif;
    background: #0c0f17;
    color: #f2f4f8;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
}`
        });

        files.push({
            path: 'src/styles/main.css',
            description: 'Master stylesheet root importing cascade layers',
            badge: 'CSS',
            content: `@import './layers.css';\n`
        });

        files.push({
            path: `src/main.${hasTs ? (isReact ? 'tsx' : 'ts') : isReact ? 'jsx' : 'js'}`,
            description: 'Client frontend application bootstrap entrypoint',
            badge: hasTs ? 'TypeScript' : 'JavaScript',
            content: isReact
                ? `import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';

export function App() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>${state.projectName}</h1>
      <p>Clean React 19 application running.</p>
    </main>
  );
}

const root = createRoot(document.getElementById('app')!);
root.render(<App />);`
                : `import './styles/main.css';

const app = document.getElementById('app');
if (app) {
  app.innerHTML = \`
    <main style="padding: 2rem; text-align: center;">
      <h1>\${'${state.projectName}'}</h1>
      <p>Clean Vanilla application running with native Cascade Layers.</p>
    </main>
  \`;
}`
        });
    }

    return files;
}
