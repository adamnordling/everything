export type Archetype =
    | 'web-spa'
    | 'fullstack-ssr'
    | 'backend-api'
    | 'python-ml'
    | 'systems-cli'
    | 'desktop-tauri'
    | 'browser-extension'
    | 'library-package';

export type LanguageId = 'typescript' | 'javascript' | 'python' | 'rust' | 'go' | 'csharp';
export type PackageManagerChoice = 'npm' | 'pnpm' | 'bun' | 'cargo' | 'uv';
export type LicenseChoice = 'none' | 'MIT' | 'Apache-2.0' | 'Unlicense';
export type TestFramework = 'none' | 'vitest' | 'pytest' | 'cargo-test' | 'playwright';
export type DatabaseChoice = 'none' | 'drizzle' | 'prisma' | 'sqlalchemy' | 'sqlite-raw';

export interface ScaffolderState {
    projectName: string;
    archetype: Archetype;
    languages: LanguageId[];
    framework: string;
    buildEngine: string;
    linter: string;
    packageManager: PackageManagerChoice;
    testFramework: TestFramework;
    database: DatabaseChoice;
    license: LicenseChoice;
    includeDocker: boolean;
    includeCi: boolean;
    includeEdgeHeaders: boolean;
    includeEnvExample: boolean;
    includeEditorConfig: boolean;
    includeGitAttributes: boolean;
    includePackScript: boolean;
    includeDependabot: boolean;
}

export interface GeneratedFile {
    path: string;
    description: string;
    badge: string;
    content: string;
}
