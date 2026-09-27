// =============================================================================
// BACKUP & RESTORE ENGINE (LOCALSTORAGE EXPORT & IMPORT)
// =============================================================================

const BACKUP_KEYS = [
    'everything_deadlines_v2',
    'everything_tasks_v2',
    'everything_habits_v2',
    'everything_scratchpad',
    'wx_lat',
    'wx_lon',
    'wx_city',
    'app_theme'
];

export function initBackup(): void {
    const exportBtn = document.getElementById('btn-export-data');
    const importBtn = document.getElementById('btn-import-data');
    const fileInput = document.getElementById('backup-file-input') as HTMLInputElement | null;

    // 1. EXPORT ALL DATA TO JSON FILE
    exportBtn?.addEventListener('click', () => {
        const payload: Record<string, string | null> = {};
        BACKUP_KEYS.forEach(key => {
            payload[key] = localStorage.getItem(key);
        });

        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
        const downloadAnchor = document.createElement('a');
        const dateTag = new Date().toISOString().split('T')[0];

        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `everything-backup-${dateTag}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // 2. TRIGGER FILE PICKER FOR IMPORT
    importBtn?.addEventListener('click', () => {
        fileInput?.click();
    });

    // 3. READ, VALIDATE & RESTORE JSON DATA
    fileInput?.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>): void => {
            try {
                const content = e.target?.result as string;
                const parsed: unknown = JSON.parse(content);

                if (typeof parsed !== 'object' || parsed === null) {
                    alert('Invalid backup file format.');
                    return;
                }

                const record = parsed as Record<string, unknown>;
                Object.entries(record).forEach(([key, val]) => {
                    if (BACKUP_KEYS.includes(key) && typeof val === 'string') {
                        localStorage.setItem(key, val);
                    }
                });

                // Reload the window to re-render all modules with restored state
                window.location.reload();
            } catch {
                alert('Failed to parse backup file. Please select a valid JSON backup.');
            }
        };

        reader.readAsText(file);
    });
}
