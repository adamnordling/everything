import type { Archetype, LanguageId, ScaffolderState } from './types';

export interface OptionItem {
    value: string;
    label: string;
}

export function getDefaultState(): ScaffolderState {
    return {
        projectName: 'my-project',
        archetype: 'web-spa',
        languages: ['typescript'],
        framework: 'none',
        buildEngine: 'vite',
        linter: 'eslint-strict',
        packageManager: 'npm',
        testFramework: 'none',
        database: 'none',
        license: 'none',
        includeDocker: false,
        includeCi: false,
        includeEdgeHeaders: false,
        includeEnvExample: false,
        includeEditorConfig: false,
        includeGitAttributes: false,
        includePackScript: false,
        includeDependabot: false
    };
}

export function getFrameworkOptions(archetype: Archetype, languages: LanguageId[]): OptionItem[] {
    const list: OptionItem[] = [{ value: 'none', label: 'None (Clean Architecture / Vanilla Core)' }];
    const hasJs = languages.includes('typescript') || languages.includes('javascript');
    const hasPython = languages.includes('python');
    const hasRust = languages.includes('rust');

    if (archetype === 'web-spa') {
        list.push(
            { value: 'react', label: 'React 19 (Component UI)' },
            { value: 'vue', label: 'Vue 3 (Composition API)' },
            { value: 'svelte', label: 'Svelte 5 (Runes)' },
            { value: 'solid', label: 'Solid.js (Fine-grained Reactivity)' }
        );
    } else if (archetype === 'fullstack-ssr') {
        list.push(
            { value: 'nextjs', label: 'Next.js 15 (App Router Server Components)' },
            { value: 'astro', label: 'Astro 5 (Content & Islands Architecture)' },
            { value: 'nuxt', label: 'Nuxt 3 (Full-Stack Vue)' },
            { value: 'sveltekit', label: 'SvelteKit (Edge/SSR Full-Stack)' }
        );
    } else if (archetype === 'backend-api') {
        if (hasJs) {
            list.push(
                { value: 'hono', label: 'Hono (Edge Lightweight Fast Router)' },
                { value: 'fastify', label: 'Fastify (High-Throughput Node.js)' },
                { value: 'express', label: 'Express (Classic Middleware API)' }
            );
        }
        if (hasPython) {
            list.push(
                { value: 'fastapi', label: 'FastAPI (High-Performance Async Python)' },
                { value: 'django-ninja', label: 'Django Ninja (Type-Hinted Django REST)' }
            );
        }
        if (hasRust) {
            list.push(
                { value: 'axum', label: 'Axum (Tokio-native Fast Async Web)' },
                { value: 'actix-web', label: 'Actix Web (Zero-Copy High-RPS)' }
            );
        }
    } else if (archetype === 'python-ml') {
        list.push(
            { value: 'pytorch-fastapi', label: 'PyTorch + FastAPI (Inference Server)' },
            { value: 'pytorch-train', label: 'PyTorch Core (Training & Checkpoints)' },
            { value: 'huggingface', label: 'Transformers Pipeline (NLP/Vision)' }
        );
    } else if (archetype === 'desktop-tauri') {
        list.push(
            { value: 'tauri-vanilla', label: 'Tauri 2.0 + Vanilla TS' },
            { value: 'tauri-react', label: 'Tauri 2.0 + React 19' }
        );
    } else if (archetype === 'browser-extension') {
        list.push(
            { value: 'extension-mv3-vanilla', label: 'Manifest V3 Vanilla (Popup + Background)' },
            { value: 'extension-mv3-react', label: 'Manifest V3 React Popup' }
        );
    } else if (archetype === 'library-package') {
        list.push(
            { value: 'tsup-lib', label: 'tsup (Dual ESM + CJS Universal Library)' },
            { value: 'rollup-lib', label: 'Rollup (Plugin Tree-Shaken Library)' }
        );
    }

    return list;
}

export function getBuildEngineOptions(archetype: Archetype, languages: LanguageId[]): OptionItem[] {
    const list: OptionItem[] = [];
    const hasJs = languages.includes('typescript') || languages.includes('javascript');
    const hasPython = languages.includes('python');
    const hasRust = languages.includes('rust');
    const hasGo = languages.includes('go');

    if (archetype === 'fullstack-ssr') {
        list.push({ value: 'next-turbopack', label: 'Turbopack (Next.js Native)' });
    }
    if (hasJs && archetype !== 'fullstack-ssr') {
        list.push(
            { value: 'vite', label: 'Vite 8.x (ESM Development & Rollup Build)' },
            { value: 'bun', label: 'Bun (All-in-One Engine & Runtime)' }
        );
    }
    if (hasPython) {
        list.push({ value: 'uv', label: 'uv (Astral Ultra-Fast Python Packaging)' });
    }
    if (hasRust) {
        list.push({ value: 'cargo', label: 'Cargo (Rust Package & Build Manager)' });
    }
    if (hasGo) {
        list.push({ value: 'go-build', label: 'Go Modules Toolchain' });
    }
    if (list.length === 0) {
        list.push({ value: 'none', label: 'Standard Toolchain' });
    }
    return list;
}

export function getLinterOptions(languages: LanguageId[]): OptionItem[] {
    const list: OptionItem[] = [];
    const hasJs = languages.includes('typescript') || languages.includes('javascript');
    const hasPython = languages.includes('python');
    const hasRust = languages.includes('rust');

    if (hasJs) {
        list.push(
            { value: 'eslint-strict', label: 'ESLint (Flat Config Strict Type-Checked)' },
            { value: 'biome', label: 'Biome (Sub-millisecond Rust Formatter/Linter)' }
        );
    }
    if (hasPython) {
        list.push({ value: 'ruff', label: 'Ruff (Fastest Python Linter & Formatter)' });
    }
    if (hasRust) {
        list.push({ value: 'clippy', label: 'Clippy + Rustfmt' });
    }
    list.push({ value: 'none', label: 'No Linter' });
    return list;
}

export function getTestingOptions(languages: LanguageId[]): OptionItem[] {
    const list: OptionItem[] = [{ value: 'none', label: 'None' }];
    const hasJs = languages.includes('typescript') || languages.includes('javascript');
    const hasPython = languages.includes('python');
    const hasRust = languages.includes('rust');

    if (hasJs) {
        list.push(
            { value: 'vitest', label: 'Vitest (Native ESM Fast Unit Testing)' },
            { value: 'playwright', label: 'Playwright (Cross-Browser End-to-End Testing)' }
        );
    }
    if (hasPython) {
        list.push({ value: 'pytest', label: 'Pytest (Standard Python Test Runner)' });
    }
    if (hasRust) {
        list.push({ value: 'cargo-test', label: 'Cargo Test (Rust Native Unit/Integration)' });
    }
    return list;
}

export function getDatabaseOptions(archetype: Archetype): OptionItem[] {
    const list: OptionItem[] = [{ value: 'none', label: 'None (Stateless / Local Storage)' }];
    if (archetype === 'web-spa' || archetype === 'browser-extension') {
        list.push({ value: 'sqlite-raw', label: 'IndexedDB / Local-First Database' });
        return list;
    }
    list.push(
        { value: 'drizzle', label: 'Drizzle ORM (TypeScript Lightweight & Fast)' },
        { value: 'prisma', label: 'Prisma (TypeScript Full Schema ORM)' },
        { value: 'sqlalchemy', label: 'SQLAlchemy 2.0 (Python Async ORM)' },
        { value: 'sqlite-raw', label: 'SQLite / Embedded DB' }
    );
    return list;
}
