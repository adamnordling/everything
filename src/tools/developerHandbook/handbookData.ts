import type { GeneratedFile, ScaffolderState } from './types';
import { generateWebFiles } from './generators/web';
import { generateBackendFiles } from './generators/backend';
import { generatePythonFiles } from './generators/python';
import { generateSystemsFiles } from './generators/systems';
import { generateDevOpsFiles } from './generators/devops';

export * from './types';
export * from './registry';

export function generateProjectFiles(state: ScaffolderState): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    const hasJs = state.languages.includes('typescript') || state.languages.includes('javascript');
    const hasTs = state.languages.includes('typescript');
    const pm = state.packageManager;

    // 1. Web, UI, Extension & Tauri Layer
    files.push(...generateWebFiles(state));

    // 2. Backend, API & Data Layer
    files.push(...generateBackendFiles(state));

    // 3. Python Layer
    files.push(...generatePythonFiles(state));

    // 4. Systems Layer (Rust / Go)
    files.push(...generateSystemsFiles(state));

    // 5. JavaScript / TypeScript Package.json, Tsconfig & Linter Configs
    if (hasJs) {
        const isBun = state.buildEngine === 'bun' || pm === 'bun';
        const isReact = state.framework === 'react';
        const isNext = state.framework === 'nextjs';
        const isHono = state.framework === 'hono';
        const isFastify = state.framework === 'fastify';
        const isExpress = state.framework === 'express';
        const isTauri = state.archetype === 'desktop-tauri';
        const isExtension = state.archetype === 'browser-extension';
        const isLibrary = state.archetype === 'library-package';

        const deps: Record<string, string> = {};
        const devDeps: Record<string, string> = {};

        if (isReact) {
            deps['react'] = '^19.0.0';
            deps['react-dom'] = '^19.0.0';
            if (hasTs) {
                devDeps['@types/react'] = '^19.0.0';
                devDeps['@types/react-dom'] = '^19.0.0';
            }
        } else if (isNext) {
            deps['next'] = '^15.0.0';
            deps['react'] = '^19.0.0';
            deps['react-dom'] = '^19.0.0';
        } else if (isHono) {
            deps['hono'] = '^4.6.14';
        } else if (isFastify) {
            deps['fastify'] = '^5.0.0';
        } else if (isExpress) {
            deps['express'] = '^4.21.0';
            if (hasTs) devDeps['@types/express'] = '^5.0.0';
        }

        if (isTauri) {
            devDeps['@tauri-apps/cli'] = '^2.0.0';
        }

        if (isLibrary) {
            devDeps['tsup'] = '^8.3.0';
        }

        if (state.database === 'drizzle') {
            deps['drizzle-orm'] = '^0.38.0';
            devDeps['drizzle-kit'] = '^0.30.0';
        } else if (state.database === 'prisma') {
            deps['@prisma/client'] = '^6.0.0';
            devDeps['prisma'] = '^6.0.0';
        }

        if (state.testFramework === 'vitest') {
            devDeps['vitest'] = '^3.0.0';
        } else if (state.testFramework === 'playwright') {
            devDeps['@playwright/test'] = '^1.49.0';
        }

        if (hasTs) {
            devDeps['typescript'] = '~5.8.2';
            if (!isBun) devDeps['@types/node'] = '^22.0.0';
        }

        if (state.buildEngine === 'vite' || isExtension || isTauri) {
            devDeps['vite'] = '^8.3.0';
            if (isReact) devDeps['@vitejs/plugin-react'] = '^4.3.4';
        }

        if (state.linter === 'eslint-strict') {
            devDeps['eslint'] = '^10.11.0';
            devDeps['@eslint/js'] = '^10.0.1';
            devDeps['prettier'] = '^3.9.8';
            if (hasTs) devDeps['typescript-eslint'] = '^8.70.0';
        } else if (state.linter === 'biome') {
            devDeps['@biomejs/biome'] = '^1.9.4';
        }

        // Scripts
        const scripts: Record<string, string> = {};
        if (isBun) {
            scripts['dev'] = 'bun run --hot src/server.ts';
            scripts['build'] = 'bun build src/server.ts --outdir ./dist';
            scripts['test'] = 'bun test';
        } else if (isNext) {
            scripts['dev'] = 'next dev';
            scripts['build'] = 'next build';
            scripts['start'] = 'next start';
        } else if (isTauri) {
            scripts['dev'] = 'vite';
            scripts['build'] = 'vite build';
            scripts['tauri'] = 'tauri';
            scripts['tauri:dev'] = 'tauri dev';
            scripts['tauri:build'] = 'tauri build';
        } else if (isLibrary) {
            scripts['build'] = 'tsup';
            scripts['dev'] = 'tsup --watch';
            scripts['typecheck'] = 'tsc --noEmit';
        } else {
            scripts['dev'] = 'vite';
            scripts['build'] = hasTs ? 'tsc --noEmit && vite build' : 'vite build';
            scripts['preview'] = 'vite preview';
            if (hasTs) scripts['typecheck'] = 'tsc --noEmit';
            scripts['lint'] =
                state.linter === 'biome' ? 'biome check src/' : 'eslint "src/**/*.{ts,js}" --max-warnings 0';
        }

        if (state.testFramework === 'vitest') {
            scripts['test'] = 'vitest run';
        } else if (state.testFramework === 'playwright') {
            scripts['test:e2e'] = 'playwright test';
        }

        // Package.json schema
        const packageJson: Record<string, unknown> = {
            name: state.projectName,
            version: '1.0.0',
            type: 'module',
            scripts,
            dependencies: deps,
            devDependencies: devDeps
        };

        if (isLibrary) {
            packageJson['main'] = './dist/index.cjs';
            packageJson['module'] = './dist/index.mjs';
            packageJson['types'] = './dist/index.d.ts';
            packageJson['exports'] = {
                '.': {
                    import: './dist/index.mjs',
                    require: './dist/index.cjs',
                    types: './dist/index.d.ts'
                }
            };
            packageJson['files'] = ['dist'];
        } else {
            packageJson['private'] = true;
        }

        files.push({
            path: 'package.json',
            description: 'Dependencies, scripts, and module definitions',
            badge: 'JSON',
            content: JSON.stringify(packageJson, null, 2)
        });

        // Strict TypeScript Compiler Configuration
        if (hasTs && !isNext) {
            files.push({
                path: 'tsconfig.json',
                description: 'Strict TypeScript configuration with bundler resolution and zero any escapes',
                badge: 'JSON',
                content: `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true${isReact ? ',\n    "jsx": "react-jsx"' : ''}
  },
  "include": ["src/**/*"${state.buildEngine === 'vite' ? ', "vite.config.ts"' : ''}]
}`
            });
        }

        // ESLint Flat Config
        if (state.linter === 'eslint-strict') {
            files.push({
                path: 'eslint.config.js',
                description: 'Modern flat ESLint config with strict TypeScript type-checking rules',
                badge: 'JavaScript',
                content: `import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**']
  },
  js.configs.recommended,
  ${hasTs ? '...tseslint.configs.strictTypeChecked,' : ''}
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }]${
          hasTs
              ? `,\n      '@typescript-eslint/no-explicit-any': 'error',\n      '@typescript-eslint/explicit-function-return-type': 'warn',\n      '@typescript-eslint/no-non-null-assertion': 'warn'`
              : ''
      }
    }
  }
);`
            });
        } else if (state.linter === 'biome') {
            files.push({
                path: 'biome.json',
                description: 'Biome configuration for sub-millisecond linting and formatting',
                badge: 'JSON',
                content: `{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 4,
    "lineWidth": 120
  }
}`
            });
        }

        // Vite Config
        if ((state.buildEngine === 'vite' || isExtension || isTauri) && !isNext && !isLibrary) {
            files.push({
                path: `vite.config.${hasTs ? 'ts' : 'js'}`,
                description: 'Vite build engine configuration targeting ES2022 output',
                badge: hasTs ? 'TypeScript' : 'JavaScript',
                content: `import { defineConfig } from 'vite';
${isReact ? "import react from '@vitejs/plugin-react';\n" : ''}
export default defineConfig({
  plugins: [${isReact ? 'react()' : ''}],
  build: {
    target: 'es2022',
    outDir: 'dist'
  }
});`
            });
        }
    }

    // 6. DevOps, Docker, Git, CI, Readme & Packaging Scripts
    files.push(...generateDevOpsFiles(state));

    return files;
}

export function generateBootstrapScript(state: ScaffolderState, platform: 'bash' | 'powershell'): string {
    const files = generateProjectFiles(state);
    const pm = state.packageManager;

    if (platform === 'powershell') {
        const lines: string[] = [
            `# Windows PowerShell Automated Project Bootstrapper`,
            `# Project: ${state.projectName} (${state.archetype})`,
            `$ErrorActionPreference = "Stop"`,
            `Write-Host "Scaffolding ${state.projectName}..." -ForegroundColor Cyan`,
            `New-Item -ItemType Directory -Force -Path "${state.projectName}" | Out-Null`,
            `Set-Location "${state.projectName}"`
        ];

        files.forEach(f => {
            const dir = f.path.includes('/') ? f.path.substring(0, f.path.lastIndexOf('/')) : '';
            if (dir) {
                lines.push(`New-Item -ItemType Directory -Force -Path "${dir}" | Out-Null`);
            }
            const escaped = f.content.replace(/`/g, '``').replace(/\$/g, '`$');
            lines.push(`@"
${escaped}
"@ | Out-File -FilePath "${f.path}" -Encoding utf8`);
        });

        lines.push(`Write-Host "Installing dependencies..." -ForegroundColor Green`);
        if (state.languages.includes('python')) {
            lines.push(`uv sync`);
        } else if (state.languages.includes('rust')) {
            lines.push(`cargo check`);
        } else if (pm === 'bun') {
            lines.push(`bun install`);
        } else if (pm === 'pnpm') {
            lines.push(`pnpm install`);
        } else {
            lines.push(`npm install`);
        }
        lines.push(`Write-Host "Scaffolding completed in $PWD" -ForegroundColor Green`);
        return lines.join('\n');
    }

    // Bash / Zsh
    const lines: string[] = [
        `#!/usr/bin/env bash`,
        `# Automated Project Bootstrapper`,
        `# Project: ${state.projectName} (${state.archetype})`,
        `set -euo pipefail`,
        ``,
        `echo "Scaffolding ${state.projectName}..."`,
        `mkdir -p "${state.projectName}"`,
        `cd "${state.projectName}"`
    ];

    files.forEach(f => {
        const dir = f.path.includes('/') ? f.path.substring(0, f.path.lastIndexOf('/')) : '';
        if (dir) {
            lines.push(`mkdir -p "${dir}"`);
        }
        lines.push(`cat << 'EOF' > "${f.path}"`);
        lines.push(f.content);
        lines.push(`EOF`);
    });

    lines.push(``);
    lines.push(`echo "Installing dependencies..."`);
    if (state.languages.includes('python')) {
        lines.push(`uv sync`);
    } else if (state.languages.includes('rust')) {
        lines.push(`cargo check`);
    } else if (pm === 'bun') {
        lines.push(`bun install`);
    } else if (pm === 'pnpm') {
        lines.push(`pnpm install`);
    } else {
        lines.push(`npm install`);
    }
    lines.push(`echo "Project files created successfully in $(pwd)"`);
    return lines.join('\n');
}
