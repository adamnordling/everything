import { copyText } from '../../core/dom';
import {
    type Archetype,
    type DatabaseChoice,
    type GeneratedFile,
    type LanguageId,
    type LicenseChoice,
    type PackageManagerChoice,
    type ScaffolderState,
    type TestFramework,
    generateBootstrapScript,
    generateProjectFiles,
    getBuildEngineOptions,
    getDatabaseOptions,
    getDefaultState,
    getFrameworkOptions,
    getLinterOptions,
    getTestingOptions
} from './handbookData';
import { IDE_TIER_DATABASE, type IdeDetail } from './ideData';
import template from './handbookView.html?raw';

const STORAGE_KEY = 'everything_dev_handbook_v10';

let isInitialized = false;

export function initDeveloperHandbook(): void {
    const stage = document.getElementById('view-tool-handbook');
    if (!stage) return;

    if (isInitialized) return;
    isInitialized = true;

    if (!stage.hasChildNodes()) {
        stage.innerHTML = template;
    }

    let state: ScaffolderState = getDefaultState();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            state = { ...getDefaultState(), ...(JSON.parse(saved) as Partial<ScaffolderState>) };
        } catch {
            // Keep default
        }
    }

    const persist = (): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Storage safe
        }
    };

    // DOM References
    const nameInput = document.getElementById('hb-input-project-name') as HTMLInputElement | null;
    const archSelect = document.getElementById('hb-select-archetype') as HTMLSelectElement | null;
    const frameworkSelect = document.getElementById('hb-select-framework') as HTMLSelectElement | null;
    const bundlerSelect = document.getElementById('hb-select-bundler') as HTMLSelectElement | null;
    const linterSelect = document.getElementById('hb-select-linter') as HTMLSelectElement | null;
    const testSelect = document.getElementById('hb-select-testing') as HTMLSelectElement | null;
    const dbSelect = document.getElementById('hb-select-database') as HTMLSelectElement | null;
    const pmSelect = document.getElementById('hb-select-pm') as HTMLSelectElement | null;
    const pmGroup = document.getElementById('hb-pm-group');
    const licenseSelect = document.getElementById('hb-select-license') as HTMLSelectElement | null;

    const optDocker = document.getElementById('hb-opt-docker') as HTMLInputElement | null;
    const optCi = document.getElementById('hb-opt-ci') as HTMLInputElement | null;
    const optHeaders = document.getElementById('hb-opt-headers') as HTMLInputElement | null;
    const optEnv = document.getElementById('hb-opt-env') as HTMLInputElement | null;
    const optEditorConfig = document.getElementById('hb-opt-editorconfig') as HTMLInputElement | null;
    const optGitAttributes = document.getElementById('hb-opt-gitattributes') as HTMLInputElement | null;
    const optPackScript = document.getElementById('hb-opt-packscript') as HTMLInputElement | null;
    const optDependabot = document.getElementById('hb-opt-dependabot') as HTMLInputElement | null;
    const headersToggleWrap = document.getElementById('hb-headers-toggle-wrap');

    const fileListStream = document.getElementById('hb-file-list-stream');
    const fileCountBadge = document.getElementById('hb-file-count-badge');
    const activeFilename = document.getElementById('hb-active-filename');
    const activeDesc = document.getElementById('hb-active-desc');
    const activeBadge = document.getElementById('hb-active-badge');
    const fileContentDisplay = document.getElementById('hb-file-content-display') as HTMLTextAreaElement | null;
    const copyActiveFileBtn = document.getElementById('hb-copy-active-file-btn');

    const bootstrapperTitle = document.getElementById('hb-bootstrapper-title');
    const bootstrapperCode = document.getElementById('hb-bootstrapper-code') as HTMLTextAreaElement | null;
    const copyBootstrapperBtn = document.getElementById('hb-copy-bootstrapper-btn');
    const platformTabs = document.querySelectorAll<HTMLButtonElement>('.hb-tab-btn');
    const ideMount = document.getElementById('hb-ide-cards-mount');

    let currentFiles: GeneratedFile[] = [];
    let selectedFilePath = '';
    let currentPlatform: 'bash' | 'powershell' = 'bash';

    function recalculateDynamicOptions(): void {
        if (!frameworkSelect || !bundlerSelect || !linterSelect || !testSelect || !dbSelect) return;

        const isWeb = state.archetype === 'web-spa' || state.archetype === 'fullstack-ssr';
        const hasTsOrJs = state.languages.includes('typescript') || state.languages.includes('javascript');

        if (pmGroup) {
            pmGroup.style.display = hasTsOrJs ? 'flex' : 'none';
        }

        // Frameworks
        const frameworks = getFrameworkOptions(state.archetype, state.languages);
        frameworkSelect.innerHTML = frameworks
            .map(f => `<option value="${f.value}" ${f.value === state.framework ? 'selected' : ''}>${f.label}</option>`)
            .join('');
        if (!frameworks.some(f => f.value === state.framework)) {
            state.framework = 'none';
        }

        // Bundlers
        const bundlers = getBuildEngineOptions(state.archetype, state.languages);
        bundlerSelect.innerHTML = bundlers
            .map(
                b => `<option value="${b.value}" ${b.value === state.buildEngine ? 'selected' : ''}>${b.label}</option>`
            )
            .join('');
        const firstBundler = bundlers[0];
        state.buildEngine = bundlers.some(b => b.value === state.buildEngine) ? state.buildEngine : firstBundler.value;

        // Linters
        const linters = getLinterOptions(state.languages);
        linterSelect.innerHTML = linters
            .map(l => `<option value="${l.value}" ${l.value === state.linter ? 'selected' : ''}>${l.label}</option>`)
            .join('');
        const firstLinter = linters[0];
        state.linter = linters.some(l => l.value === state.linter) ? state.linter : firstLinter.value;

        // Testing
        const testOptions = getTestingOptions(state.languages);
        testSelect.innerHTML = testOptions
            .map(
                t =>
                    `<option value="${t.value}" ${t.value === state.testFramework ? 'selected' : ''}>${t.label}</option>`
            )
            .join('');
        if (!testOptions.some(t => t.value === state.testFramework)) {
            state.testFramework = 'none';
        }

        // Database
        const dbOptions = getDatabaseOptions(state.archetype);
        dbSelect.innerHTML = dbOptions
            .map(d => `<option value="${d.value}" ${d.value === state.database ? 'selected' : ''}>${d.label}</option>`)
            .join('');
        if (!dbOptions.some(d => d.value === state.database)) {
            state.database = 'none';
        }

        if (headersToggleWrap) {
            headersToggleWrap.style.display = isWeb ? 'flex' : 'none';
        }
    }

    function selectFile(path: string): void {
        selectedFilePath = path;
        const target = currentFiles.find(f => f.path === path);
        if (!target) return;

        if (activeFilename) activeFilename.textContent = target.path;
        if (activeDesc) activeDesc.textContent = target.description;
        if (activeBadge) activeBadge.textContent = target.badge;
        if (fileContentDisplay) fileContentDisplay.value = target.content;

        document.querySelectorAll('.file-tree-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-path') === target.path);
        });
    }

    function renderFileTree(): void {
        if (!fileListStream || !fileCountBadge) return;
        currentFiles = generateProjectFiles(state);
        fileCountBadge.textContent = `${currentFiles.length} Files`;

        fileListStream.innerHTML = '';
        currentFiles.forEach(f => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'file-tree-btn';
            btn.setAttribute('data-path', f.path);
            btn.innerHTML = `
                <span class="file-name-line">${f.path}</span>
                <span class="pill-badge" style="font-size:0.62rem;">${f.badge}</span>
            `;

            btn.addEventListener('click', () => {
                selectFile(f.path);
            });

            fileListStream.appendChild(btn);
        });

        const preferred = currentFiles.find(
            f =>
                f.path === 'package.json' ||
                f.path === 'index.html' ||
                f.path === 'pyproject.toml' ||
                f.path === 'Cargo.toml'
        );
        const firstFile = currentFiles[0] as GeneratedFile | undefined;
        if (!currentFiles.some(f => f.path === selectedFilePath)) {
            selectedFilePath = preferred ? preferred.path : firstFile ? firstFile.path : '';
        }
        if (selectedFilePath) {
            selectFile(selectedFilePath);
        }
    }

    function renderBootstrapper(): void {
        if (!bootstrapperCode || !bootstrapperTitle) return;
        bootstrapperTitle.textContent =
            currentPlatform === 'bash' ? 'Bash / macOS / Linux Bootstrapper' : 'PowerShell Bootstrapper';
        bootstrapperCode.value = generateBootstrapScript(state, currentPlatform);
    }

    function renderIdeCards(): void {
        if (!ideMount) return;
        ideMount.innerHTML = '';

        IDE_TIER_DATABASE.forEach((ide: IdeDetail) => {
            const card = document.createElement('div');
            card.className = 'ide-accordion-card';

            const tierClass =
                ide.tier === 'S+'
                    ? 'tier-s-plus'
                    : ide.tier === 'S'
                      ? 'tier-s'
                      : ide.tier === 'A'
                        ? 'tier-a'
                        : ide.tier === 'A-'
                          ? 'tier-a-minus'
                          : 'tier-b-plus';

            card.innerHTML = `
                <button type="button" class="ide-card-header-btn" data-target="ide-body-${ide.id}">
                    <div class="ide-title-badge-group">
                        <span class="tier-badge ${tierClass}">Tier ${ide.tier}</span>
                        <span class="ide-card-name">${ide.name}</span>
                    </div>
                    <div class="ide-specs-strip">
                        <span>${ide.ramFootprint}</span>
                        <span>·</span>
                        <span>${ide.coldStartup}</span>
                        <span class="acc-chevron">▸</span>
                    </div>
                </button>
                <div class="ide-card-body" id="ide-body-${ide.id}" style="display: none;">
                    <div class="ide-meta-quad">
                        <div class="ide-meta-item">
                            <span class="ide-meta-label">ENGINE ARCHITECTURE</span>
                            <span class="ide-meta-val">${ide.engine}</span>
                        </div>
                        <div class="ide-meta-item">
                            <span class="ide-meta-label">COLD STARTUP</span>
                            <span class="ide-meta-val">${ide.coldStartup}</span>
                        </div>
                        <div class="ide-meta-item">
                            <span class="ide-meta-label">RAM FOOTPRINT (IDLE)</span>
                            <span class="ide-meta-val">${ide.ramFootprint}</span>
                        </div>
                        <div class="ide-meta-item">
                            <span class="ide-meta-label">LICENSE &amp; PRICING</span>
                            <span class="ide-meta-val">${ide.pricing}</span>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                        <span class="pill-badge" style="font-size: 0.68rem;">Learning Curve: ${ide.learningCurve}</span>
                        <a href="${ide.downloadUrl}" target="_blank" rel="noopener" class="link-chip">
                            Official Download Portal ↗
                        </a>
                    </div>

                    <p style="font-size: 0.74rem; color: var(--text-secondary); line-height: 1.45; margin: 2px 0 0 0;">
                        <strong>Architectural Verdict:</strong> ${ide.verdict}
                    </p>

                    <!-- PROS & CONS GRID -->
                    <div class="ide-pros-cons-grid">
                        <div class="pros-column">
                            <span class="column-title pros">ADVANTAGES (+)</span>
                            <ul class="ide-point-list">
                                ${ide.pros.map(pro => `<li>${pro}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="cons-column">
                            <span class="column-title cons">TRADE-OFFS &amp; QUIRKS (-)</span>
                            <ul class="ide-point-list">
                                ${ide.cons.map(con => `<li>${con}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <!-- RECOMMENDED ADDONS -->
                    <div>
                        <span style="font-size: 0.72rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-primary); text-transform: uppercase;">
                            Essential Extensions &amp; Tooling:
                        </span>
                        <div class="ide-addon-list" style="margin-top: 6px;">
                            ${ide.recommendedExtensions
                                .map(
                                    ext => `
                                <div class="ide-addon-card">
                                    <span class="ide-addon-title">${ext.name}</span>
                                    <span class="ide-addon-purpose">${ext.purpose}</span>
                                </div>
                            `
                                )
                                .join('')}
                        </div>
                    </div>

                    <!-- FULL UNTRUNCATED SETTINGS.JSON -->
                    ${
                        ide.debloatJsonSnippet
                            ? `
                    <div style="margin-top: 6px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <span style="font-size: 0.72rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-primary);">
                                ${ide.debloatSettingsTitle ?? 'Debloat Configuration'}:
                            </span>
                            <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="${ide.debloatJsonSnippet.replace(/"/g, '&quot;')}">Copy settings.json</button>
                        </div>
                        <div class="terminal-code-window">
                            <pre class="terminal-code-body" style="max-height: 320px; overflow-y:auto; white-space:pre;"><code>${ide.debloatJsonSnippet}</code></pre>
                        </div>
                    </div>
                    `
                            : ''
                    }

                    <!-- KEY TIPS -->
                    <div style="margin-top: 6px;">
                        <span style="font-size: 0.72rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-primary); text-transform: uppercase;">
                            Workstation Tips &amp; Guidance:
                        </span>
                        <ul class="clean-bullet-list" style="margin-top: 4px;">
                            ${ide.keyTips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

            const btn = card.querySelector<HTMLButtonElement>('.ide-card-header-btn');
            const body = card.querySelector<HTMLElement>(`#ide-body-${ide.id}`);
            const chevron = card.querySelector<HTMLElement>('.acc-chevron');

            btn?.addEventListener('click', () => {
                if (!body) return;
                const isOpen = body.style.display !== 'none';
                body.style.display = isOpen ? 'none' : 'flex';
                btn.classList.toggle('open', !isOpen);
                if (chevron) chevron.textContent = isOpen ? '▸' : '▾';
            });

            ideMount.appendChild(card);
        });

        // Bind copy triggers inside dynamically generated IDE cards
        ideMount.querySelectorAll<HTMLButtonElement>('.copy-btn-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.getAttribute('data-copy');
                if (text) {
                    copyText(text, btn);
                }
            });
        });
    }

    function renderAll(): void {
        recalculateDynamicOptions();
        renderFileTree();
        renderBootstrapper();
        renderIdeCards();
    }

    // Synchronize UI Inputs with State BEFORE rendering
    if (nameInput) nameInput.value = state.projectName;
    if (archSelect) archSelect.value = state.archetype;
    if (pmSelect) pmSelect.value = state.packageManager;
    if (licenseSelect) licenseSelect.value = state.license;
    if (optDocker) optDocker.checked = state.includeDocker;
    if (optCi) optCi.checked = state.includeCi;
    if (optHeaders) optHeaders.checked = state.includeEdgeHeaders;
    if (optEnv) optEnv.checked = state.includeEnvExample;
    if (optEditorConfig) optEditorConfig.checked = state.includeEditorConfig;
    if (optGitAttributes) optGitAttributes.checked = state.includeGitAttributes;
    if (optPackScript) optPackScript.checked = state.includePackScript;
    if (optDependabot) optDependabot.checked = state.includeDependabot;

    document.querySelectorAll<HTMLInputElement>('#hb-lang-checkboxes input').forEach(cb => {
        cb.checked = state.languages.includes(cb.value as LanguageId);
        cb.addEventListener('change', () => {
            const checkedLangs: LanguageId[] = [];
            document.querySelectorAll<HTMLInputElement>('#hb-lang-checkboxes input').forEach(c => {
                if (c.checked) checkedLangs.push(c.value as LanguageId);
            });
            if (checkedLangs.length === 0) {
                cb.checked = true;
                return;
            }
            state.languages = checkedLangs;
            persist();
            renderAll();
        });
    });

    nameInput?.addEventListener('input', () => {
        state.projectName = nameInput.value.trim() || 'my-project';
        persist();
        renderAll();
    });

    archSelect?.addEventListener('change', () => {
        state.archetype = archSelect.value as Archetype;
        if (state.archetype === 'python-ml') {
            state.languages = ['python'];
            state.framework = 'pytorch-fastapi';
            state.buildEngine = 'uv';
            state.linter = 'ruff';
        } else if (state.archetype === 'systems-cli') {
            state.languages = ['rust'];
            state.framework = 'none';
            state.buildEngine = 'cargo';
            state.linter = 'clippy';
        } else if (state.archetype === 'desktop-tauri') {
            state.languages = ['typescript', 'rust'];
            state.framework = 'tauri-vanilla';
            state.buildEngine = 'vite';
            state.linter = 'eslint-strict';
        } else if (state.archetype === 'browser-extension') {
            state.languages = ['typescript'];
            state.framework = 'extension-mv3-vanilla';
            state.buildEngine = 'vite';
            state.linter = 'eslint-strict';
        } else {
            state.languages = ['typescript'];
            state.framework = 'none';
            state.buildEngine = 'vite';
            state.linter = 'eslint-strict';
        }
        document.querySelectorAll<HTMLInputElement>('#hb-lang-checkboxes input').forEach(cb => {
            cb.checked = state.languages.includes(cb.value as LanguageId);
        });
        persist();
        renderAll();
    });

    frameworkSelect?.addEventListener('change', () => {
        state.framework = frameworkSelect.value;
        persist();
        renderAll();
    });

    bundlerSelect?.addEventListener('change', () => {
        state.buildEngine = bundlerSelect.value;
        persist();
        renderAll();
    });

    linterSelect?.addEventListener('change', () => {
        state.linter = linterSelect.value;
        persist();
        renderAll();
    });

    testSelect?.addEventListener('change', () => {
        state.testFramework = testSelect.value as TestFramework;
        persist();
        renderAll();
    });

    dbSelect?.addEventListener('change', () => {
        state.database = dbSelect.value as DatabaseChoice;
        persist();
        renderAll();
    });

    pmSelect?.addEventListener('change', () => {
        state.packageManager = pmSelect.value as PackageManagerChoice;
        persist();
        renderAll();
    });

    licenseSelect?.addEventListener('change', () => {
        state.license = licenseSelect.value as LicenseChoice;
        persist();
        renderAll();
    });

    optDocker?.addEventListener('change', () => {
        state.includeDocker = optDocker.checked;
        persist();
        renderAll();
    });

    optCi?.addEventListener('change', () => {
        state.includeCi = optCi.checked;
        persist();
        renderAll();
    });

    optHeaders?.addEventListener('change', () => {
        state.includeEdgeHeaders = optHeaders.checked;
        persist();
        renderAll();
    });

    optEnv?.addEventListener('change', () => {
        state.includeEnvExample = optEnv.checked;
        persist();
        renderAll();
    });

    optEditorConfig?.addEventListener('change', () => {
        state.includeEditorConfig = optEditorConfig.checked;
        persist();
        renderAll();
    });

    optGitAttributes?.addEventListener('change', () => {
        state.includeGitAttributes = optGitAttributes.checked;
        persist();
        renderAll();
    });

    optPackScript?.addEventListener('change', () => {
        state.includePackScript = optPackScript.checked;
        persist();
        renderAll();
    });

    optDependabot?.addEventListener('change', () => {
        state.includeDependabot = optDependabot.checked;
        persist();
        renderAll();
    });

    platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            platformTabs.forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            const platform = tab.getAttribute('data-platform');
            currentPlatform = platform === 'powershell' ? 'powershell' : 'bash';
            renderBootstrapper();
        });
    });

    copyActiveFileBtn?.addEventListener('click', () => {
        if (!fileContentDisplay) return;
        copyText(fileContentDisplay.value, copyActiveFileBtn);
    });

    copyBootstrapperBtn?.addEventListener('click', () => {
        if (!bootstrapperCode) return;
        copyText(bootstrapperCode.value, copyBootstrapperBtn);
    });

    // Global copy triggers
    stage.querySelectorAll<HTMLButtonElement>('.copy-btn-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            if (text) {
                copyText(text, btn);
            }
        });
    });

    // Initial render
    renderAll();
}
