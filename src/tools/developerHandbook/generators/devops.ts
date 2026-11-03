import type { GeneratedFile, LicenseChoice, ScaffolderState } from '../types';

function getLicenseText(license: LicenseChoice): string {
    const year = new Date().getFullYear();
    if (license === 'MIT') {
        return `MIT License

Copyright (c) ${year} Author

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
    }
    if (license === 'Apache-2.0') {
        return `Copyright ${year} Author

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`;
    }
    if (license === 'Unlicense') {
        return `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.`;
    }
    return '';
}

function getGettingStartedGuide(state: ScaffolderState): string {
    const pm = state.packageManager;

    switch (state.archetype) {
        case 'browser-extension':
            return `## How to Load and Test the Extension

1. Build the extension:
\`\`\`bash
${pm} install
${pm} run build
\`\`\`

2. Load in Chrome, Brave, or Edge:
- Open \`chrome://extensions/\` in your browser.
- Enable the **Developer mode** toggle in the top-right corner.
- Click **Load unpacked** and select the project directory.

3. Load in Firefox:
- Open \`about:debugging#/runtime/this-firefox\`.
- Click **Load Temporary Add-on...** and select \`manifest.json\`.

4. Development Workflow:
- Modify \`src/popup.ts\` or \`popup.html\` for popup interactions.
- Modify \`src/background.ts\` for background service worker events.
- Re-run \`${pm} run build\` and click the reload icon on your extensions page.`;

        case 'desktop-tauri':
            return `## How to Run the Desktop App

1. Ensure the Rust toolchain is installed:
\`\`\`bash
rustc --version
\`\`\`

2. Start the desktop window in development mode:
\`\`\`bash
${pm} install
${pm} run tauri dev
\`\`\`
This starts the local web server and automatically launches the native OS desktop window with hot-reload.

3. Build the release binary / installer:
\`\`\`bash
${pm} run tauri build
\`\`\`
Compiled installers (.exe, .dmg, or .AppImage) will be output to \`src-tauri/target/release/bundle/\`.`;

        case 'library-package':
            return `## Library Development & Publishing

1. Install and compile dual bundles (ESM & CJS):
\`\`\`bash
${pm} install
${pm} run build
\`\`\`
Build artifacts (.mjs, .cjs, and .d.ts type declarations) will be output to \`dist/\`.

2. Test your package locally in another project:
\`\`\`bash
${pm} link
# In your test project directory:
${pm} link ${state.projectName}
\`\`\`

3. Publish to NPM registry:
\`\`\`bash
npm publish --access public
\`\`\``;

        case 'fullstack-ssr':
            return `## Getting Started

1. Install dependencies and start development server:
\`\`\`bash
${pm} install
${pm} run dev
\`\`\`

2. Open \`http://localhost:3000\` in your browser.
- Pages and server routes live in \`src/app/\`.
- Components in \`src/app/page.tsx\` execute as Server Components by default.`;

        case 'backend-api':
            return `## Running the API Service

1. Start development server with hot-reload:
\`\`\`bash
${pm} install
${pm} run dev
\`\`\`

2. Verify endpoint health:
\`\`\`bash
curl http://localhost:3000/health
\`\`\``;

        case 'python-ml':
            return `## Environment Setup & Inference

1. Sync virtual environment using uv:
\`\`\`bash
uv sync
\`\`\`

2. Start the service:
\`\`\`bash
uv run python src/main.py
\`\`\`

3. API Documentation:
- Swagger UI interactive explorer: \`http://localhost:8000/docs\`
- OpenAPI specification: \`http://localhost:8000/openapi.json\``;

        case 'systems-cli':
            return `## Building and Running

1. Run debug executable:
\`\`\`bash
cargo run -- --help
\`\`\`

2. Compile release binary:
\`\`\`bash
cargo build --release
\`\`\`
Optimized binary will be placed at \`target/release/${state.projectName}\`.`;

        default:
            return `## Getting Started

1. Install dependencies and launch development server:
\`\`\`bash
${pm} install
${pm} run dev
\`\`\`

2. Open your local browser link (default: \`http://localhost:5173\`).
- Entrypoint is located at \`src/main.ts\`.
- Pure CSS styles are governed by cascade layers in \`src/styles/layers.css\`.`;
    }
}

export function generateDevOpsFiles(state: ScaffolderState): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    const hasPython = state.languages.includes('python');
    const hasRust = state.languages.includes('rust');
    const hasGo = state.languages.includes('go');
    const hasJs = state.languages.includes('typescript') || state.languages.includes('javascript');
    const pm = state.packageManager;

    if (state.license !== 'none') {
        files.push({
            path: 'LICENSE',
            description: `${state.license} open source license declaration`,
            badge: 'Legal',
            content: getLicenseText(state.license)
        });
    }

    if (state.includeGitAttributes) {
        files.push({
            path: '.gitattributes',
            description: 'Enforces consistent Unix LF line endings across all git clones',
            badge: 'Git',
            content: `* text=auto eol=lf
*.sh text eol=lf
*.bat text eol=crlf
*.cmd text eol=crlf`
        });
    }

    if (state.includeEditorConfig) {
        let editorConfigExtra = '';
        if (hasGo) {
            editorConfigExtra += `\n[*.go]\nindent_style = tab\nindent_size = 4\n`;
        }
        if (hasPython) {
            editorConfigExtra += `\n[*.py]\nindent_style = space\nindent_size = 4\n`;
        }

        files.push({
            path: '.editorconfig',
            description: 'Cross-IDE indentation, character set, and line-ending rules',
            badge: 'Config',
            content: `root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 4
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.{json,yml,yaml,md}]
indent_size = 2
${editorConfigExtra}`.trim()
        });
    }

    if (state.includeEnvExample) {
        files.push({
            path: '.env.example',
            description: 'Contract for required runtime secrets and configuration keys',
            badge: 'Env',
            content: `# Runtime Environment Configuration
PORT=3000
NODE_ENV=development
APP_ORIGIN=http://localhost:3000

# Service Credentials
DATABASE_URL=
API_SECRET_KEY=`
        });
    }

    if (state.includePackScript) {
        files.push({
            path: 'pack-project.sh',
            description: 'Single-file codebase bundle packager for audits and context',
            badge: 'Bash',
            content: `#!/bin/bash

OUTPUT_FILE="project-bundle.txt"
PROJECT_ROOT=$(basename "$PWD")

echo "=================================================="
echo "          CHOOSE PACKAGING MODE"
echo "=================================================="
echo "1) Pure Code Only (Scans ONLY inside 'src/' + index.html)"
echo "2) Full Dev Project (All code, public files, _headers, configs)"
echo "--------------------------------------------------"
read -p "Select mode (1 or 2): " choice


if command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
elif command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD=""
fi


cat > "$OUTPUT_FILE" <<EOF
================================================================================
PROJECT ROOT: $PROJECT_ROOT
================================================================================

=== COMPLETE FILE STRUCTURE ====================================================

EOF


if [ -n "$PYTHON_CMD" ]; then

    "$PYTHON_CMD" -c '
import os
import sys

output_file = sys.argv[1]

exclude = {
    "node_modules",
    ".git",
    "dist",
    "build",
    ".parcel-cache",
    ".idea",
    ".vscode",
    output_file
}

def print_tree(path, prefix=""):
    try:
        entries = [
            entry for entry in os.listdir(path)
            if entry not in exclude
        ]
    except PermissionError:
        return

    entries.sort(
        key=lambda entry: (
            not os.path.isdir(os.path.join(path, entry)),
            entry.lower()
        )
    )

    for index, entry in enumerate(entries):
        full_path = os.path.join(path, entry)
        is_last = index == len(entries) - 1
        is_dir = os.path.isdir(full_path)

        connector = "\`-- " if is_last else "|-- "
        suffix = "/" if is_dir else ""

        print(prefix + connector + entry + suffix)

        if is_dir:
            if is_last:
                child_prefix = prefix + "    "
            else:
                child_prefix = prefix + "|   "

            print_tree(full_path, child_prefix)

print(".")
print_tree(".")
' "$OUTPUT_FILE" >> "$OUTPUT_FILE"

    if [ $? -ne 0 ]; then
        echo "ERROR: Python failed while generating the file structure."
        exit 1
    fi

else

    echo "WARNING: Python unavailable. Using find instead."

    find . \\
        -not -path "./.git*" \\
        -not -path "./node_modules*" \\
        -not -path "./dist*" \\
        -not -path "./build*" \\
        -not -path "./.idea*" \\
        -not -path "./.vscode*" \\
        -not -name "$OUTPUT_FILE" \\
        -print |
        sort >> "$OUTPUT_FILE"

fi


cat >> "$OUTPUT_FILE" <<EOF

================================================================================
=== FILE CONTENTS ==============================================================
================================================================================

EOF


if [ "$choice" = "2" ]; then

    echo "[Mode 2 Selected: Grabbing all code, public files, _headers & configs across all folders]"

    find . -type f \\
        ! -path "*/node_modules/*" \\
        ! -path "*/dist/*" \\
        ! -path "*/build/*" \\
        ! -path "*/.git/*" \\
        ! -path "*/.idea/*" \\
        ! -path "*/.vscode/*" \\
        ! -name "package-lock.json" \\
        ! -name "$OUTPUT_FILE" \\
        ! -name ".gitignore" \\
        ! -name "LICENSE" \\
        ! -name "*.txt" \\
        ! -name "*.svg" \\
        ! -name "*.png" \\
        ! -name "*.webp" \\
        ! -name "*.jpg" \\
        ! -name "*.jpeg" \\
        ! -name "*.gif" \\
        ! -name "*.ico" \\
        ! -name "*.pdf" \\
        ! -name "*.woff" \\
        ! -name "*.woff2" \\
        ! -name "*.ttf" \\
        ! -name "*.eot" \\
        ! -name "*.mp4" \\
        ! -name "*.zip" |
        sort |
        while IFS= read -r file; do

            echo "------------------------------------------------------------------" >> "$OUTPUT_FILE"
            echo "FILE: $file" >> "$OUTPUT_FILE"
            echo "------------------------------------------------------------------" >> "$OUTPUT_FILE"

            cat "$file" >> "$OUTPUT_FILE"

            printf "\\n\\n" >> "$OUTPUT_FILE"

        done


elif [ "$choice" = "1" ]; then

    echo "[Mode 1 Selected: Pure source code inside /src ONLY + index.html]"

    if [ -d "./src" ]; then

        find ./src -type f \\
            \\( \\
            -name "*.ts" \\
            -o -name "*.tsx" \\
            -o -name "*.js" \\
            -o -name "*.jsx" \\
            -o -name "*.html" \\
            -o -name "*.css" \\
            \\) |
            sort |
            while IFS= read -r file; do

                echo "------------------------------------------------------------------" >> "$OUTPUT_FILE"
                echo "FILE: $file" >> "$OUTPUT_FILE"
                echo "------------------------------------------------------------------" >> "$OUTPUT_FILE"

                cat "$file" >> "$OUTPUT_FILE"

                printf "\\n\\n" >> "$OUTPUT_FILE"

            done

    else

        echo "WARNING: ./src does not exist."

    fi

    if [ -f "./index.html" ]; then

        echo "------------------------------------------------------------------" >> "$OUTPUT_FILE"
        echo "FILE: ./index.html" >> "$OUTPUT_FILE"
        echo "------------------------------------------------------------------" >> "$OUTPUT_FILE"

        cat "./index.html" >> "$OUTPUT_FILE"

        printf "\\n\\n" >> "$OUTPUT_FILE"

    fi

else

    echo "ERROR: Invalid choice. Please select 1 or 2."
    exit 1

fi


echo ""
echo "=================================================="
echo "Success!"
echo "Output generated: $OUTPUT_FILE"
echo "=================================================="`
        });
    }

    if (state.includeDocker) {
        files.push({
            path: 'Dockerfile',
            description: 'Production multi-stage Docker build container',
            badge: 'Docker',
            content: hasPython
                ? `FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir uv && uv pip install --system -r pyproject.toml
COPY . .
CMD ["python", "src/main.py"]`
                : hasRust
                  ? `FROM rust:1.82 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/${state.projectName} /usr/local/bin/
CMD ["${state.projectName}"]`
                  : `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN ${pm === 'pnpm' ? 'pnpm install' : pm === 'bun' ? 'bun install' : 'npm ci'}
COPY . .
RUN ${pm === 'bun' ? 'bun run build' : 'npm run build'}

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`
        });

        files.push({
            path: 'docker-compose.yml',
            description: 'Multi-container orchestration definition',
            badge: 'Docker',
            content: `services:
  app:
    build: .
    container_name: ${state.projectName}
    restart: unless-stopped
    ports:
      - "8080:8080"`
        });
    }

    if (state.includeCi) {
        files.push({
            path: '.github/workflows/ci.yml',
            description: 'Automated GitHub Actions continuous verification pipeline',
            badge: 'YAML',
            content: `name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
${
    hasJs
        ? `      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: ${pm === 'pnpm' ? 'pnpm install' : pm === 'bun' ? 'bun install' : 'npm ci'}
      - run: ${pm === 'pnpm' ? 'pnpm run build' : pm === 'bun' ? 'bun run build' : 'npm run build'}`
        : ''
}
${
    hasPython
        ? `      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install uv && uv sync`
        : ''
}
${
    hasRust
        ? `      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
      - run: cargo check --verbose`
        : ''
}`
        });
    }

    if (state.includeDependabot) {
        files.push({
            path: '.github/dependabot.yml',
            description: 'Automated weekly dependency security alerts',
            badge: 'YAML',
            content: `version: 2
updates:
${
    hasJs
        ? `  - package-ecosystem: "${pm === 'pnpm' ? 'pnpm' : 'npm'}"
    directory: "/"
    schedule:
      interval: "weekly"`
        : ''
}
${
    hasPython
        ? `  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"`
        : ''
}
${
    hasRust
        ? `  - package-ecosystem: "cargo"
    directory: "/"
    schedule:
      interval: "weekly"`
        : ''
}
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"`
        });
    }

    // Comprehensive multi-stack .gitignore
    const packIgnoreSection = state.includePackScript ? `\n# Project Bundle Diagnostics\nproject-bundle.txt\n` : '';
    files.push({
        path: '.gitignore',
        description: 'Multi-stack production git ignore table',
        badge: 'Git',
        content: `# Dependency Stores
node_modules/
.pnp
.pnp.js

# Python Environment & Bytecode
__pycache__/
*.py[cod]
*$py.class
*.so
.venv/
env/
venv/
*.egg-info/
.pytest_cache/
.ruff_cache/
.coverage
htmlcov/

# Rust Cargo & Go
/target
src-tauri/target/
Cargo.lock
*.exe
*.test
*.prof

# Build Output Artifacts & Cache
dist/
build/
out/
.next/
.astro/
.turbo/
.cache/
.vite/
.tsup/

# Extensions & Desktop Packages
*.crx
*.xpi

# Secrets & Environment Tokens (Do not commit)
.env
.env*.local
*.pem
*.key
*.cert

# Logging & Telemetry
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Operating System & Editor Files
.DS_Store
Thumbs.db
ehthumbs.db
.idea/
${packIgnoreSection}`.trim()
    });

    // Zero-emoji Technical README with "How to Begin" guide
    files.push({
        path: 'README.md',
        description: 'Technical documentation, getting started guide, and command references',
        badge: 'Markdown',
        content: `# ${state.projectName}

Technical architecture and deployment pipeline for ${state.archetype} built with ${state.languages.join(', ')}.

${getGettingStartedGuide(state)}

## Available Scripts

${
    hasJs
        ? `- \`${pm} run dev\`: Start local development runtime with hot-reload.
- \`${pm} run build\`: Compile and output optimized production bundle.
- \`${pm} run typecheck\`: Run static TypeScript compiler verification without emitting.
- \`${pm} run lint\`: Run AST linter checks with zero warnings tolerance.`
        : hasPython
          ? `- \`uv run python src/main.py\`: Start the local execution or API service.
- \`uv run ruff check .\`: Run AST static analysis and imports verification.
- \`uv run ruff format .\`: Format all Python files.`
          : `- \`cargo run\`: Execute debug binary target.
- \`cargo clippy\`: Run compiler lints and performance suggestions.
- \`cargo build --release\`: Compile release binary with LTO optimization.`
}

## Security Posture

- Local-first architecture: Zero unsolicited remote telemetry or tracking.
- Type integrity: Compile-time type checking enforced with no implicit any escapes.
`
    });

    return files;
}
