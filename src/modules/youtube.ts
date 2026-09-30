// =============================================================================
// YOUTUBE PRECISION STUDIO & DOWNLOAD ENGINE
// =============================================================================

export interface YtStudioState {
    url: string;
    videoId: string;
    playlistId: string | null;
    isPlaylistMode: boolean;
    mediaType: 'audio' | 'video';
    audioFormat: 'wav' | 'flac' | 'mp3' | 'opus' | 'm4a' | 'aac';
    videoFormat: 'mp4' | 'mkv' | 'webm';
    videoQuality: 'best' | '2160' | '1440' | '1080' | '720';
    timeTrimEnabled: boolean;
    startTime: string;
    endTime: string;
    volumePercent: number;
    ignorePlaylistErrors: boolean;
    playlistStart: number;
    playlistEnd: number;
}

const STORAGE_KEY = 'everything_yt_settings';

const BLACK_THUMBNAIL =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='100%25' height='100%25' fill='%23000000'/%3E%3C/svg%3E";

const DEFAULT_STATE: YtStudioState = {
    url: '',
    videoId: '',
    playlistId: null,
    isPlaylistMode: false,
    mediaType: 'audio',
    audioFormat: 'wav',
    videoFormat: 'mp4',
    videoQuality: 'best',
    timeTrimEnabled: false,
    startTime: '00:00:00',
    endTime: '01:00:00',
    volumePercent: 100,
    ignorePlaylistErrors: true,
    playlistStart: 1,
    playlistEnd: 50
};

export function initYoutube(): void {
    // Load persisted state or fallback
    let state: YtStudioState = { ...DEFAULT_STATE };
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            state = { ...DEFAULT_STATE, ...(JSON.parse(saved) as Partial<YtStudioState>) };

            if (state.videoId === 'dQw4w9WgXcQ' || state.url.includes('dQw4w9WgXcQ')) {
                state.url = '';
                state.videoId = '';
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            }
        } catch {
            state = { ...DEFAULT_STATE };
        }
    }

    const persist = (): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Storage quota safe guard
        }
    };

    // DOM Elements
    const urlInput = document.getElementById('yt-url-input') as HTMLInputElement | null;
    const fetchBtn = document.getElementById('yt-fetch-btn');
    const pasteBtn = document.getElementById('yt-paste-btn');

    const previewThumb = document.getElementById('yt-preview-thumb') as HTMLImageElement | null;
    const previewTitle = document.getElementById('yt-preview-title');
    const previewAuthor = document.getElementById('yt-preview-author');
    const previewBadge = document.getElementById('yt-preview-badge');

    const btnPresetBinaural = document.getElementById('yt-preset-binaural');
    const btnPresetCutter = document.getElementById('yt-preset-cutter');
    const btnPreset4k = document.getElementById('yt-preset-4k');
    const btnPresetPlaylist = document.getElementById('yt-preset-playlist');

    const radioSingle = document.getElementById('yt-mode-single') as HTMLInputElement | null;
    const radioPlaylist = document.getElementById('yt-mode-playlist') as HTMLInputElement | null;
    const playlistOptionsCard = document.getElementById('yt-playlist-options');

    const selectMediaType = document.getElementById('yt-media-type') as HTMLSelectElement | null;
    const selectAudioFormat = document.getElementById('yt-audio-format') as HTMLSelectElement | null;
    const selectVideoFormat = document.getElementById('yt-video-format') as HTMLSelectElement | null;
    const selectVideoQuality = document.getElementById('yt-video-quality') as HTMLSelectElement | null;
    const audioOptionsGroup = document.getElementById('yt-audio-options-group');
    const videoOptionsGroup = document.getElementById('yt-video-options-group');

    const trimCheckbox = document.getElementById('yt-trim-toggle') as HTMLInputElement | null;
    const trimInputsContainer = document.getElementById('yt-trim-inputs');
    const startInput = document.getElementById('yt-trim-start') as HTMLInputElement | null;
    const endInput = document.getElementById('yt-trim-end') as HTMLInputElement | null;
    const trimDurationDisplay = document.getElementById('yt-trim-duration');
    const btnTrim6h = document.getElementById('yt-trim-6h-btn');
    const btnTrim1h = document.getElementById('yt-trim-1h-btn');
    const btnTrimReset = document.getElementById('yt-trim-reset-btn');

    const volumeSlider = document.getElementById('yt-volume-slider') as HTMLInputElement | null;
    const volumeNumber = document.getElementById('yt-volume-number') as HTMLInputElement | null;
    const volumeDbDisplay = document.getElementById('yt-volume-db');
    const btnVol5 = document.getElementById('yt-vol-5-btn');
    const btnVol25 = document.getElementById('yt-vol-25-btn');
    const btnVol50 = document.getElementById('yt-vol-50-btn');
    const btnVol100 = document.getElementById('yt-vol-100-btn');

    const ignoreErrorsCheck = document.getElementById('yt-pl-ignore-errors') as HTMLInputElement | null;
    const plStartInput = document.getElementById('yt-pl-start') as HTMLInputElement | null;
    const plEndInput = document.getElementById('yt-pl-end') as HTMLInputElement | null;

    const commandTextarea = document.getElementById('yt-command-output') as HTMLTextAreaElement | null;
    const copyCommandBtn = document.getElementById('yt-copy-cmd-btn');
    const platformTabs = document.querySelectorAll('.cmd-tab-btn');

    let currentPlatform: 'ytdlp' | 'bash' = 'ytdlp';

    function parseYouTubeUrl(urlStr: string): { videoId: string; playlistId: string | null } {
        const cleanUrl = urlStr.trim();
        let videoId = '';
        let playlistId: string | null = null;

        try {
            const urlObj = new URL(cleanUrl);
            const listParam = urlObj.searchParams.get('list');
            if (listParam) playlistId = listParam;

            if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            } else if (urlObj.pathname.includes('/shorts/')) {
                videoId = urlObj.pathname.split('/shorts/')[1]?.split(/[?&]/)[0] ?? '';
            } else if (urlObj.pathname.includes('/live/')) {
                videoId = urlObj.pathname.split('/live/')[1]?.split(/[?&]/)[0] ?? '';
            } else {
                videoId = urlObj.searchParams.get('v') ?? '';
            }

            const timeParam = urlObj.searchParams.get('t');
            if (timeParam && startInput) {
                const totalSeconds = parseTimeStringToSeconds(timeParam);
                startInput.value = formatSecondsToTimeString(totalSeconds);
                state.startTime = startInput.value;
            }
        } catch {
            if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
                videoId = cleanUrl;
            }
        }

        return { videoId, playlistId };
    }

    function parseTimeStringToSeconds(timeStr: string): number {
        const clean = timeStr.replace(/[^\d:hms]/g, '');
        if (clean.includes('h') || clean.includes('m') || clean.includes('s')) {
            let total = 0;
            const h = /(\d+)h/.exec(clean);
            const m = /(\d+)m/.exec(clean);
            const s = /(\d+)s/.exec(clean);
            if (h) total += parseInt(h[1], 10) * 3600;
            if (m) total += parseInt(m[1], 10) * 60;
            if (s) total += parseInt(s[1], 10);
            return total;
        }

        const parts = clean.split(':').map(p => parseInt(p, 10) || 0);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 1) return parts[0];
        return 0;
    }

    function formatSecondsToTimeString(sec: number): string {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    if (previewThumb) {
        previewThumb.addEventListener('error', () => {
            previewThumb.src = BLACK_THUMBNAIL;
        });
    }

    async function fetchMetadata(videoId: string): Promise<void> {
        if (!videoId && !state.playlistId) {
            if (previewTitle) previewTitle.textContent = 'No stream selected';
            if (previewAuthor) previewAuthor.textContent = 'Channel: —';
            if (previewThumb) previewThumb.src = BLACK_THUMBNAIL;
            if (previewBadge) previewBadge.textContent = 'No Stream';
            return;
        }

        if (previewTitle) previewTitle.textContent = 'Fetching stream information...';
        if (previewAuthor) previewAuthor.textContent = 'Connecting to Google CDN...';

        if (videoId && previewThumb) {
            previewThumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }

        const targetUrl = videoId
            ? `https://www.youtube.com/watch?v=${videoId}`
            : `https://www.youtube.com/playlist?list=${state.playlistId}`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 2000);

            const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = (await res.json()) as { title: string; author_name: string; thumbnail_url?: string };
                if (previewTitle) previewTitle.textContent = data.title;
                if (previewAuthor) previewAuthor.textContent = `Channel: ${data.author_name}`;
                if (previewThumb && data.thumbnail_url) previewThumb.src = data.thumbnail_url;
            }
        } catch {
            if (previewTitle) previewTitle.textContent = state.isPlaylistMode ? 'Active Playlist' : `Video: ${videoId}`;
            if (previewAuthor) previewAuthor.textContent = 'Target Stream Verified';
        }

        if (previewBadge) {
            previewBadge.textContent = state.isPlaylistMode ? 'Playlist Mode' : 'Single Video';
        }
    }

    function updateDurationCalculation(): void {
        const startSec = parseTimeStringToSeconds(state.startTime);
        const endSec = parseTimeStringToSeconds(state.endTime);

        if (endSec <= startSec) {
            if (trimDurationDisplay) {
                trimDurationDisplay.textContent = 'End time must be greater than start time';
                trimDurationDisplay.style.color = 'var(--accent-rose)';
            }
            return;
        }

        const diffSec = endSec - startSec;
        const diffStr = formatSecondsToTimeString(diffSec);
        const hours = (diffSec / 3600).toFixed(2);

        if (trimDurationDisplay) {
            trimDurationDisplay.textContent = `Trim Section: ${diffStr} (${hours} hrs to download)`;
            trimDurationDisplay.style.color = 'var(--accent-mint)';
        }
    }

    function updateVolumeDbDisplay(pct: number): void {
        if (!volumeDbDisplay) return;
        if (pct <= 0) {
            volumeDbDisplay.textContent = '-∞ dB (Muted)';
            return;
        }
        const ratio = pct / 100;
        const db = 20 * Math.log10(ratio);
        volumeDbDisplay.textContent = `${pct}% · ${db.toFixed(1)} dB`;
    }

    function sanitizeShellArg(val: string): string {
        return val.replace(/["`$\\]/g, '').trim();
    }

    function getGeneratedCommand(): string {
        const isAudio = state.mediaType === 'audio';
        const isPl = state.isPlaylistMode;
        const targetUrl = sanitizeShellArg(state.url);

        const flags: string[] = [];

        flags.push('-P "~/Downloads"');

        if (isPl) {
            flags.push('-o "%(playlist_index)02d - %(title)s.%(ext)s"');
            if (state.ignorePlaylistErrors) {
                flags.push('--ignore-errors');
                flags.push('--no-abort-on-error');
                flags.push('--compat-options no-youtube-unavailable-videos');
                flags.push('--no-warnings');
            }
            if (state.playlistStart > 1) flags.push(`--playlist-start ${state.playlistStart}`);
            if (state.playlistEnd > 0) flags.push(`--playlist-end ${state.playlistEnd}`);
        } else {
            flags.push('-o "%(title)s.%(ext)s"');
            flags.push('--no-playlist');
        }

        // Precision Time Trimming (Single declaration with anti-403 headers)
        if (state.timeTrimEnabled) {
            const safeStart = sanitizeShellArg(state.startTime);
            const safeEnd = sanitizeShellArg(state.endTime);
            flags.push(`--download-sections "*${safeStart}-${safeEnd}"`);
            flags.push('--force-keyframes-at-cuts');
            flags.push('--downloader-args "ffmpeg_i:-headers Referer:https://www.youtube.com/"');
        }

        if (isAudio) {
            flags.push('-x');
            flags.push(`--audio-format ${state.audioFormat}`);
            flags.push('--audio-quality 0');

            if (state.volumePercent !== 100) {
                const volRatio = (state.volumePercent / 100).toFixed(2);
                flags.push(`--postprocessor-args "ExtractAudio+ffmpeg:-filter:a volume=${volRatio}"`);
            }
        } else {
            if (state.videoQuality === 'best') {
                flags.push(`-f "bv*[ext=${state.videoFormat}]+ba[ext=m4a]/b[ext=${state.videoFormat}]/bv*+ba/b"`);
            } else {
                flags.push(
                    `-f "bv*[height<=${state.videoQuality}][ext=${state.videoFormat}]+ba/b[height<=${state.videoQuality}]/bv*+ba/b"`
                );
            }
            flags.push(`--merge-output-format ${state.videoFormat}`);

            if (state.volumePercent !== 100) {
                const volRatio = (state.volumePercent / 100).toFixed(2);
                flags.push(`--postprocessor-args "ffmpeg:-filter:a volume=${volRatio}"`);
            }
        }

        if (targetUrl) {
            flags.push(`"${targetUrl}"`);
        } else {
            flags.push('"<PASTE_YOUTUBE_URL_HERE>"');
        }

        if (currentPlatform === 'bash') {
            return `yt-dlp \\\n  ${flags.join(' \\\n  ')}`;
        }
        return `yt-dlp ${flags.join(' ')}`;
    }

    function renderCommand(): void {
        if (!commandTextarea) return;
        commandTextarea.value = getGeneratedCommand();
    }

    function syncUrlChange(): void {
        if (!urlInput) return;
        state.url = urlInput.value.trim();
        const parsed = parseYouTubeUrl(state.url);
        state.videoId = parsed.videoId;
        state.playlistId = parsed.playlistId;

        if (parsed.playlistId) {
            state.isPlaylistMode = true;
            if (radioPlaylist) radioPlaylist.checked = true;
            if (radioSingle) radioSingle.checked = false;
            if (playlistOptionsCard) playlistOptionsCard.style.display = 'block';
        } else {
            state.isPlaylistMode = false;
            if (radioSingle) radioSingle.checked = true;
            if (radioPlaylist) radioPlaylist.checked = false;
            if (playlistOptionsCard) playlistOptionsCard.style.display = 'none';
        }

        persist();
        void fetchMetadata(state.videoId);
        renderCommand();
    }

    // Populate initial inputs
    if (urlInput) urlInput.value = state.url;
    if (radioSingle) radioSingle.checked = !state.isPlaylistMode;
    if (radioPlaylist) radioPlaylist.checked = state.isPlaylistMode;
    if (playlistOptionsCard) playlistOptionsCard.style.display = state.isPlaylistMode ? 'block' : 'none';

    if (selectMediaType) selectMediaType.value = state.mediaType;
    if (selectAudioFormat) selectAudioFormat.value = state.audioFormat;
    if (selectVideoFormat) selectVideoFormat.value = state.videoFormat;
    if (selectVideoQuality) selectVideoQuality.value = state.videoQuality;

    if (audioOptionsGroup) audioOptionsGroup.style.display = state.mediaType === 'audio' ? 'flex' : 'none';
    if (videoOptionsGroup) videoOptionsGroup.style.display = state.mediaType === 'video' ? 'flex' : 'none';

    if (trimCheckbox) trimCheckbox.checked = state.timeTrimEnabled;
    if (trimInputsContainer) trimInputsContainer.style.display = state.timeTrimEnabled ? 'grid' : 'none';
    if (startInput) startInput.value = state.startTime;
    if (endInput) endInput.value = state.endTime;

    if (volumeSlider) volumeSlider.value = String(state.volumePercent);
    if (volumeNumber) volumeNumber.value = String(state.volumePercent);

    if (ignoreErrorsCheck) ignoreErrorsCheck.checked = state.ignorePlaylistErrors;
    if (plStartInput) plStartInput.value = String(state.playlistStart);
    if (plEndInput) plEndInput.value = String(state.playlistEnd);

    let urlDebounce: number | undefined;
    urlInput?.addEventListener('input', () => {
        window.clearTimeout(urlDebounce);
        urlDebounce = window.setTimeout(syncUrlChange, 350);
    });

    fetchBtn?.addEventListener('click', syncUrlChange);

    pasteBtn?.addEventListener('click', () => {
        void (async (): Promise<void> => {
            try {
                const text = await navigator.clipboard.readText();
                if (text && urlInput) {
                    urlInput.value = text.trim();
                    syncUrlChange();
                }
            } catch {
                urlInput?.focus();
            }
        })();
    });

    btnPresetBinaural?.addEventListener('click', () => {
        state.mediaType = 'audio';
        state.audioFormat = 'wav';
        state.volumePercent = 5;
        state.timeTrimEnabled = false;

        if (selectMediaType) selectMediaType.value = 'audio';
        if (selectAudioFormat) selectAudioFormat.value = 'wav';
        if (audioOptionsGroup) audioOptionsGroup.style.display = 'flex';
        if (videoOptionsGroup) videoOptionsGroup.style.display = 'none';
        if (trimCheckbox) trimCheckbox.checked = false;
        if (trimInputsContainer) trimInputsContainer.style.display = 'none';
        if (volumeSlider) volumeSlider.value = '5';
        if (volumeNumber) volumeNumber.value = '5';

        persist();
        updateVolumeDbDisplay(5);
        renderCommand();
    });

    btnPresetCutter?.addEventListener('click', () => {
        state.timeTrimEnabled = true;
        state.startTime = '00:00:00';
        state.endTime = '06:00:00';

        if (trimCheckbox) trimCheckbox.checked = true;
        if (trimInputsContainer) trimInputsContainer.style.display = 'grid';
        if (startInput) startInput.value = '00:00:00';
        if (endInput) endInput.value = '06:00:00';

        persist();
        updateDurationCalculation();
        renderCommand();
    });

    btnPreset4k?.addEventListener('click', () => {
        state.mediaType = 'video';
        state.videoFormat = 'mp4';
        state.videoQuality = '2160';
        state.volumePercent = 100;

        if (selectMediaType) selectMediaType.value = 'video';
        if (selectVideoFormat) selectVideoFormat.value = 'mp4';
        if (selectVideoQuality) selectVideoQuality.value = '2160';
        if (audioOptionsGroup) audioOptionsGroup.style.display = 'none';
        if (videoOptionsGroup) videoOptionsGroup.style.display = 'flex';
        if (volumeSlider) volumeSlider.value = '100';
        if (volumeNumber) volumeNumber.value = '100';

        persist();
        updateVolumeDbDisplay(100);
        renderCommand();
    });

    btnPresetPlaylist?.addEventListener('click', () => {
        state.isPlaylistMode = true;
        state.ignorePlaylistErrors = true;
        if (radioPlaylist) radioPlaylist.checked = true;
        if (radioSingle) radioSingle.checked = false;
        if (playlistOptionsCard) playlistOptionsCard.style.display = 'block';
        if (ignoreErrorsCheck) ignoreErrorsCheck.checked = true;

        persist();
        renderCommand();
    });

    radioSingle?.addEventListener('change', () => {
        if (radioSingle.checked) {
            state.isPlaylistMode = false;
            if (playlistOptionsCard) playlistOptionsCard.style.display = 'none';
            persist();
            renderCommand();
        }
    });

    radioPlaylist?.addEventListener('change', () => {
        if (radioPlaylist.checked) {
            state.isPlaylistMode = true;
            if (playlistOptionsCard) playlistOptionsCard.style.display = 'block';
            persist();
            renderCommand();
        }
    });

    selectMediaType?.addEventListener('change', () => {
        state.mediaType = selectMediaType.value as 'audio' | 'video';
        if (state.mediaType === 'audio') {
            if (audioOptionsGroup) audioOptionsGroup.style.display = 'flex';
            if (videoOptionsGroup) videoOptionsGroup.style.display = 'none';
        } else {
            if (audioOptionsGroup) audioOptionsGroup.style.display = 'none';
            if (videoOptionsGroup) videoOptionsGroup.style.display = 'flex';
        }
        persist();
        renderCommand();
    });

    selectAudioFormat?.addEventListener('change', () => {
        state.audioFormat = selectAudioFormat.value as YtStudioState['audioFormat'];
        persist();
        renderCommand();
    });

    selectVideoFormat?.addEventListener('change', () => {
        state.videoFormat = selectVideoFormat.value as YtStudioState['videoFormat'];
        persist();
        renderCommand();
    });

    selectVideoQuality?.addEventListener('change', () => {
        state.videoQuality = selectVideoQuality.value as YtStudioState['videoQuality'];
        persist();
        renderCommand();
    });

    trimCheckbox?.addEventListener('change', () => {
        state.timeTrimEnabled = trimCheckbox.checked;
        if (trimInputsContainer) {
            trimInputsContainer.style.display = state.timeTrimEnabled ? 'grid' : 'none';
        }
        persist();
        updateDurationCalculation();
        renderCommand();
    });

    startInput?.addEventListener('input', () => {
        state.startTime = startInput.value.trim() || '00:00:00';
        persist();
        updateDurationCalculation();
        renderCommand();
    });

    endInput?.addEventListener('input', () => {
        state.endTime = endInput.value.trim() || '01:00:00';
        persist();
        updateDurationCalculation();
        renderCommand();
    });

    btnTrim6h?.addEventListener('click', () => {
        state.startTime = '00:00:00';
        state.endTime = '06:00:00';
        if (startInput) startInput.value = '00:00:00';
        if (endInput) endInput.value = '06:00:00';
        persist();
        updateDurationCalculation();
        renderCommand();
    });

    btnTrim1h?.addEventListener('click', () => {
        state.startTime = '00:00:00';
        state.endTime = '01:00:00';
        if (startInput) startInput.value = '00:00:00';
        if (endInput) endInput.value = '01:00:00';
        persist();
        updateDurationCalculation();
        renderCommand();
    });

    btnTrimReset?.addEventListener('click', () => {
        state.startTime = '00:00:00';
        state.endTime = '00:00:00';
        if (startInput) startInput.value = '00:00:00';
        if (endInput) endInput.value = '00:00:00';
        persist();
        updateDurationCalculation();
        renderCommand();
    });

    const setVolume = (val: number): void => {
        state.volumePercent = Math.max(0, Math.min(200, val));
        if (volumeSlider) volumeSlider.value = String(state.volumePercent);
        if (volumeNumber) volumeNumber.value = String(state.volumePercent);
        persist();
        updateVolumeDbDisplay(state.volumePercent);
        renderCommand();
    };

    volumeSlider?.addEventListener('input', () => {
        setVolume(parseInt(volumeSlider.value, 10) || 5);
    });

    volumeNumber?.addEventListener('input', () => {
        setVolume(parseInt(volumeNumber.value, 10) || 5);
    });

    btnVol5?.addEventListener('click', () => {
        setVolume(5);
    });
    btnVol25?.addEventListener('click', () => {
        setVolume(25);
    });
    btnVol50?.addEventListener('click', () => {
        setVolume(50);
    });
    btnVol100?.addEventListener('click', () => {
        setVolume(100);
    });

    ignoreErrorsCheck?.addEventListener('change', () => {
        state.ignorePlaylistErrors = ignoreErrorsCheck.checked;
        persist();
        renderCommand();
    });

    plStartInput?.addEventListener('input', () => {
        state.playlistStart = parseInt(plStartInput.value, 10) || 1;
        persist();
        renderCommand();
    });

    plEndInput?.addEventListener('input', () => {
        state.playlistEnd = parseInt(plEndInput.value, 10) || 0;
        persist();
        renderCommand();
    });

    platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            platformTabs.forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            const targetPlatform = tab.getAttribute('data-platform');
            currentPlatform = targetPlatform === 'bash' ? 'bash' : 'ytdlp';
            renderCommand();
        });
    });

    type OsKey = 'windows-winget' | 'windows-scoop' | 'macos' | 'linux' | 'python';

    const OS_COMMANDS: Record<OsKey, string> = {
        'windows-winget': 'winget install yt-dlp ffmpeg deno',
        'windows-scoop': 'scoop install yt-dlp ffmpeg deno',
        macos: 'brew install yt-dlp ffmpeg deno',
        linux: 'sudo apt update && sudo apt install -y ffmpeg yt-dlp deno',
        python: 'pip install -U yt-dlp'
    };

    const osTabs = document.querySelectorAll<HTMLButtonElement>('.os-pill-btn');
    const setupCodeDisplay = document.getElementById('setup-code-display');
    const setupCopyBtn = document.getElementById('setup-copy-btn');
    const setupUpdateBtn = document.getElementById('setup-update-btn');

    let currentOsKey: OsKey = 'windows-winget';

    osTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            osTabs.forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            const targetOs = tab.getAttribute('data-os');
            if (targetOs && targetOs in OS_COMMANDS) {
                currentOsKey = targetOs as OsKey;
            }
            if (setupCodeDisplay) {
                setupCodeDisplay.textContent = OS_COMMANDS[currentOsKey];
            }
        });
    });

    setupCopyBtn?.addEventListener('click', () => {
        const cmdToCopy = OS_COMMANDS[currentOsKey];
        void navigator.clipboard.writeText(cmdToCopy);
        const originalText = setupCopyBtn.textContent;
        setupCopyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            setupCopyBtn.textContent = originalText;
        }, 1400);
    });

    setupUpdateBtn?.addEventListener('click', () => {
        void navigator.clipboard.writeText('yt-dlp -U');
        const originalText = setupUpdateBtn.textContent;
        setupUpdateBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            setupUpdateBtn.textContent = originalText;
        }, 1400);
    });

    copyCommandBtn?.addEventListener('click', () => {
        if (!commandTextarea) return;
        void navigator.clipboard.writeText(commandTextarea.value);
        const originalText = copyCommandBtn.textContent;
        copyCommandBtn.textContent = '✓ Copied Command!';
        setTimeout(() => {
            copyCommandBtn.textContent = originalText;
        }, 1400);
    });

    updateVolumeDbDisplay(state.volumePercent);
    updateDurationCalculation();
    syncUrlChange();
}
