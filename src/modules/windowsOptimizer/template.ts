export const WINDOWS_OPTIMIZER_HTML = `
<div class="winopt-container">
    <!-- TOP WORKBENCH HEADER & PROFILE SELECTOR -->
    <div class="card winopt-hero">
        <div class="winopt-hero-left">
            <div class="brand-icon-box winopt-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 5.479v5.771h7.714V3.125L3 5.479zm0 13.042l7.714 2.354V12.75H3v5.771zM11.857 3v8.25H21V1.75L11.857 3zm0 9.75V21L21 22.25V12.75h-9.143z"/>
                </svg>
            </div>
            <div>
                <h1 style="font-size: 1.15rem; font-weight: 800; margin: 0">Windows Playbook &amp; Hardware Tuning</h1>
                <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0; font-family: var(--font-mono)">
                    Zero-bloat deployment, DDU driver hygiene, BIOS configuration &amp; verified low-latency setup
                </p>
            </div>
        </div>

        <!-- HARDWARE SELECTORS MATRIX -->
        <div class="winopt-profile-selectors">
            <div class="selector-field">
                <label for="winopt-os-select">OS TARGET</label>
                <div class="select-wrapper">
                    <select id="winopt-os-select" class="winopt-select">
                        <option value="win10" selected>Windows 10 (22H2 / LTSC)</option>
                        <option value="win11">Windows 11 (23H2 / 24H2)</option>
                    </select>
                </div>
            </div>

            <div class="selector-field">
                <label for="winopt-mobo-select">MOTHERBOARD &amp; BIOS PLATFORM</label>
                <div class="select-wrapper">
                    <select id="winopt-mobo-select" class="winopt-select"></select>
                </div>
            </div>

            <div class="selector-field">
                <label for="winopt-cpu-select">CPU ARCHITECTURE</label>
                <div class="select-wrapper">
                    <select id="winopt-cpu-select" class="winopt-select">
                        <option value="intel-legacy" selected>Intel Monolithic (6th-11th Gen, e.g. i7-9700K)</option>
                        <option value="intel-raptor">Intel Core 13th/14th Gen Raptor Lake (0x12B Microcode)</option>
                        <option value="intel-alder">Intel Core 12th Gen Alder Lake (Hybrid P/E)</option>
                        <option value="amd-x3d-single">AMD Ryzen Single-CCD X3D (5800X3D, 7800X3D, 9800X3D)</option>
                        <option value="amd-x3d-dual">AMD Ryzen Dual-CCD X3D (7900X3D, 7950X3D, 9950X3D)</option>
                        <option value="amd-standard">AMD Ryzen Standard (Non-X3D AM4 / AM5)</option>
                    </select>
                </div>
            </div>

            <div class="selector-field">
                <label for="winopt-gpu-select">GRAPHICS CARD</label>
                <div class="select-wrapper">
                    <select id="winopt-gpu-select" class="winopt-select"></select>
                </div>
            </div>

            <div class="selector-field">
                <label for="winopt-ram-select">MEMORY (RAM) PROFILE</label>
                <div class="select-wrapper">
                    <select id="winopt-ram-select" class="winopt-select"></select>
                </div>
            </div>
        </div>
    </div>

    <!-- HARDWARE DETECTIVE TERMINAL SCANNER -->
    <div class="card spec-scanner-card">
        <div class="spec-scanner-header">
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="pill-badge">HARDWARE DETECTIVE</span>
                <span style="font-size:0.82rem; font-weight:700; color:var(--text-primary)">Don't know your exact specs? Run this 1-line diagnostic:</span>
            </div>
            <span style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono)">Detects Motherboard, CPU, GPU &amp; RAM Configuration</span>
        </div>

        <div class="terminal-code-window" style="margin-top:6px;">
            <div class="terminal-bar">
                <div class="terminal-badge">
                    <span class="terminal-dot"></span>
                    <span class="terminal-title">PowerShell (Administrator)</span>
                </div>
                <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="$m=(Get-CimInstance Win32_BaseBoard | ForEach-Object { $_.Manufacturer+' '+$_.Product }); $c=(Get-CimInstance Win32_Processor).Name.Trim(); $g=(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' / '; $mem=Get-CimInstance Win32_PhysicalMemory; $gb=[Math]::Round(($mem | Measure-Object Capacity -Sum).Sum / 1GB); $spd=($mem | Select-Object -First 1).ConfiguredClockSpeed; $stk=($mem | Measure-Object).Count; $ddr=if($spd -gt 4500){'DDR5'}elseif($spd -gt 2000){'DDR4'}else{'DDR3'}; $ch=if($stk -gt 1){'Dual-Channel ('+$stk+' sticks)'}else{'SINGLE-CHANNEL ALERT (1 stick)'}; $out='MOBO: '+$m+' | CPU: '+$c+' | GPU: '+$g+' | RAM: '+$gb+'GB '+$ddr+' @ '+$spd+'MHz ['+$ch+']'; Write-Host ''; Write-Host $out -ForegroundColor Green; Set-Clipboard -Value $out">Copy Command</button>
            </div>
            <pre class="terminal-code-body"><code>$m=(Get-CimInstance Win32_BaseBoard | ForEach-Object { $_.Manufacturer+' '+$_.Product }); $c=(Get-CimInstance Win32_Processor).Name.Trim(); $g=(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' / '; $mem=Get-CimInstance Win32_PhysicalMemory; $gb=[Math]::Round(($mem | Measure-Object Capacity -Sum).Sum / 1GB); $spd=($mem | Select-Object -First 1).ConfiguredClockSpeed; $stk=($mem | Measure-Object).Count; $ddr=if($spd -gt 4500){'DDR5'}elseif($spd -gt 2000){'DDR4'}else{'DDR3'}; $ch=if($stk -gt 1){'Dual-Channel ('+$stk+' sticks)'}else{'SINGLE-CHANNEL ALERT (1 stick)'}; $out='MOBO: '+$m+' | CPU: '+$c+' | GPU: '+$g+' | RAM: '+$gb+'GB '+$ddr+' @ '+$spd+'MHz ['+$ch+']'; Write-Host ''; Write-Host $out -ForegroundColor Green; Set-Clipboard -Value $out</code></pre>
        </div>

        <div class="spec-paste-bar">
            <input type="text" id="winopt-spec-paste-input" class="spec-paste-field" placeholder="Paste command output here to auto-detect your exact components..." />
            <button type="button" id="winopt-spec-parse-btn" class="btn-action-pill" style="white-space:nowrap">Auto-Fill Menu</button>
            <span id="winopt-spec-parse-status" style="font-size:0.75rem; font-family:var(--font-mono)"></span>
        </div>
    </div>

    <!-- BENCHMARK LAB -->
    <div class="card spec-scanner-card">
        <div class="spec-scanner-header">
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="pill-badge">BENCHMARK LAB</span>
                <span style="font-size:0.82rem; font-weight:700; color:var(--text-primary)">Telemetry Footprint &amp; Verification Suite:</span>
            </div>
            <span style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono)">Process Footprint &amp; Latency Guide</span>
        </div>
        <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
            Run this script in PowerShell (Admin). On run 1, it saves <code>Windows-Benchmark-Before.clixml</code> on your Desktop. Complete the playbook, then run it again to calculate resource reductions.
            <br/><strong>Note on Benchmark Limits:</strong> Windows dynamically scales caches and background services. True stutter elimination is verified via <strong>DPC Latency (under 250 µs in LatencyMon)</strong> and <strong>1% low FPS in games</strong> rather than process counts alone.
        </p>

        <div class="terminal-code-window" style="margin-top:6px;">
            <div class="terminal-bar">
                <div class="terminal-badge">
                    <span class="terminal-dot"></span>
                    <span class="terminal-title">PowerShell (Administrator)</span>
                </div>
                <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="&amp; { $desktop=[Environment]::GetFolderPath('Desktop'); $beforePath=Join-Path $desktop 'Windows-Benchmark-Before.clixml'; $afterPath=Join-Path $desktop 'Windows-Benchmark-After.clixml'; $reportPath=Join-Path $desktop 'Windows-Benchmark-Report.txt'; $procs=Get-Process; $procCount=$procs.Count; $threadCount=($procs.Threads).Count; $handleCount=($procs | Measure-Object -Property Handles -Sum).Sum; $os=Get-CimInstance Win32_OperatingSystem; $totalRamMB=[Math]::Round($os.TotalVisibleMemorySize/1024,0); $freeRamMB=[Math]::Round($os.FreePhysicalMemory/1024,0); $usedRamMB=$totalRamMB-$freeRamMB; $ramPct=[Math]::Round(($usedRamMB/$totalRamMB)*100,1); $cpu=(Get-CimInstance Win32_Processor).Name.Trim(); $gpu=(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' / '; $nonMsServices=Get-CimInstance Win32_Service | Where-Object { $_.State -eq 'Running' -and $_.PathName -notmatch 'Windows|System32' }; $serviceCount=($nonMsServices | Measure-Object).Count; $dwm=Get-Process dwm -ErrorAction SilentlyContinue; $dwmMemMB=if($dwm){[Math]::Round($dwm.WorkingSet64/1MB,1)}else{0}; $snapshot=[PSCustomObject]@{ Timestamp=(Get-Date).ToString('yyyy-MM-dd HH:mm:ss'); CPU=$cpu; GPU=$gpu; Active_Processes=$procCount; Active_Threads=$threadCount; Open_Handles=$handleCount; Used_RAM_MB=$usedRamMB; Free_RAM_MB=$freeRamMB; RAM_Usage_Pct=$ramPct; Non_MS_Services=$serviceCount; DWM_RAM_MB=$dwmMemMB }; if(-not(Test-Path $beforePath)){ $snapshot | Export-Clixml -Path $beforePath; Write-Host ''; Write-Host '[STEP 1 COMPLETE: BASELINE SAVED TO DESKTOP]' -ForegroundColor Green; $snapshot | Format-List; Write-Host ''; Write-Host 'Complete Phase 1 to Phase 7, then run this command again to see your scorecard!' -ForegroundColor Cyan; Write-Host '' } else { $before=Import-Clixml -Path $beforePath; $snapshot | Export-Clixml -Path $afterPath; $pDiff=$snapshot.Active_Processes-$before.Active_Processes; $tDiff=$snapshot.Active_Threads-$before.Active_Threads; $hDiff=$snapshot.Open_Handles-$before.Open_Handles; $rDiff=$snapshot.Used_RAM_MB-$before.Used_RAM_MB; $sDiff=$snapshot.Non_MS_Services-$before.Non_MS_Services; $dDiff=$snapshot.DWM_RAM_MB-$before.DWM_RAM_MB; $comp=@( [PSCustomObject]@{Metric='Active Processes';Before=$before.Active_Processes;After=$snapshot.Active_Processes;Change=&quot;$pDiff&quot;;Status=if($pDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='Kernel Threads';Before=$before.Active_Threads;After=$snapshot.Active_Threads;Change=&quot;$tDiff&quot;;Status=if($tDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='System Handles';Before=$before.Open_Handles;After=$snapshot.Open_Handles;Change=&quot;$hDiff&quot;;Status=if($hDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='RAM Used (MB)';Before=$before.Used_RAM_MB;After=$snapshot.Used_RAM_MB;Change=&quot;$rDiff MB&quot;;Status=if($rDiff -le 0){'✓ Freed'}else{'Increased'}}, [PSCustomObject]@{Metric='3rd-Party Services';Before=$before.Non_MS_Services;After=$snapshot.Non_MS_Services;Change=&quot;$sDiff&quot;;Status=if($sDiff -le 0){'✓ Stripped'}else{'Added'}}, [PSCustomObject]@{Metric='DWM Memory (MB)';Before=$before.DWM_RAM_MB;After=$snapshot.DWM_RAM_MB;Change=&quot;$dDiff MB&quot;;Status=if($dDiff -le 0){'✓ Lean'}else{'Increased'}} ); Write-Host ''; Write-Host '================== OPTIMIZATION SCORECARD ==================' -ForegroundColor Cyan; $comp | Format-Table -AutoSize; $comp | Out-File -FilePath $reportPath; Write-Host ('[Scorecard saved to: ' + $reportPath + ']'); Write-Host '' } }">Copy Benchmark Script</button>
            </div>
            <pre class="terminal-code-body"><code>&amp; { $desktop=[Environment]::GetFolderPath('Desktop'); $beforePath=Join-Path $desktop 'Windows-Benchmark-Before.clixml'; $afterPath=Join-Path $desktop 'Windows-Benchmark-After.clixml'; ... # Compares Before &amp; After Metrics and Outputs Scorecard }</code></pre>
        </div>
    </div>

    <!-- DYNAMIC COMPATIBILITY & HARDWARE ADVISORY -->
    <div id="hw-advisory-banner" class="advisory-container"></div>

    <!-- CHRONOLOGICAL PHASES STREAM -->
    <div class="winopt-steps-grid">
        <!-- PHASE 1: CLEAN INSTALLATION & RUFUS BLUEPRINT -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge phase-pill">PHASE 01</span>
                <span class="step-title" id="p1-iso-title">Clean ISO &amp; Rufus Deployment</span>
            </div>
            <p class="step-desc" id="p1-iso-desc"></p>

            <div class="links-action-bar">
                <a id="p1-iso-link" href="https://www.microsoft.com/software-download/windows10ISO" target="_blank" rel="noopener" class="link-chip-large">
                    Download ISO ↗
                </a>
                <a href="https://rufus.ie/" target="_blank" rel="noopener" class="link-chip-large highlight">
                    Download Rufus Official ↗
                </a>
            </div>

            <div class="step-content-box">
                <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
                    Step 1A: Exact Rufus Configuration (USB Preparation):
                </div>
                <div id="p1-rufus-options"></div>
            </div>

            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                    <strong style="color:var(--text-primary)">Step 1B: Boot USB &amp; 100% Clean Drive Wipe (Shift + F10):</strong>
                    <span class="pill-badge" style="font-size:0.65rem">Purges Dirty OEM Partitions</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                    Plug in your Rufus USB and reboot. On the very first screen of the Windows installer, press <kbd>Shift</kbd> + <kbd>F10</kbd> to open Command Prompt. Run this sequence to wipe residual OEM recovery partitions and format a clean GPT disk:
                </p>
                <div class="terminal-code-window" style="margin-top:6px;">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">Diskpart Command Line</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="diskpart; list disk; select disk 0; clean; convert gpt; exit; exit">Copy Sequence</button>
                    </div>
                    <pre class="terminal-code-body"><code>diskpart ➔ list disk ➔ select disk 0 ➔ clean ➔ convert gpt ➔ exit ➔ exit</code></pre>
                </div>
            </div>

            <div class="step-content-box" id="p1-oobe-guide"></div>
        </div>

        <!-- PHASE 2: BIOS UPDATE & MOTHERBOARD TUNING -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge phase-pill">PHASE 02</span>
                <span class="step-title">Motherboard BIOS Update &amp; Hardware Tuning</span>
            </div>
            <p class="step-desc">
                Flashing your motherboard BIOS before installing drivers ensures CPU microcode stability, memory training, and PCIe Resizable BAR support.
            </p>

            <div class="step-content-box">
                <div class="bios-grid">
                    <div class="bios-guide-col">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong>Motherboard Flash Utility:</strong>
                            <span class="pill-badge" id="p2-mobo-tool-name">ASUS (EZ Flash 3)</span>
                        </div>
                        <ol class="ordered-step-list">
                            <li>Format an empty USB drive to <strong>FAT32</strong>.</li>
                            <li>Download the latest non-beta BIOS update from your motherboard support page:
                                <div style="margin:4px 0;"><a id="p2-mobo-link" href="#" target="_blank" rel="noopener" class="link-chip">Open Motherboard BIOS Portal ↗</a></div>
                            </li>
                            <li>Extract the BIOS file to the root of the USB drive (run BIOSRenamer if provided).</li>
                            <li>Restart PC and tap <kbd>Delete</kbd> or <kbd>F2</kbd> to enter UEFI/BIOS.</li>
                            <li>Select your flash utility, select the USB file, and let it flash. <em>Do not power off.</em></li>
                        </ol>
                    </div>
                    <div class="bios-settings-col">
                        <strong>Mandatory BIOS Settings to Enable:</strong>
                        <ul class="clean-bullet-list" id="p2-bios-settings-list"></ul>
                    </div>
                </div>

                <div class="step-content-box" style="border-left: 3px solid var(--accent-brand); margin-top: 8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                        <strong style="color:var(--text-primary)">Motherboard RAM Slot Placement (Daisy-Chain Signal Integrity):</strong>
                        <span class="pill-badge" style="font-size:0.65rem">Slots A2 &amp; B2 (2 &amp; 4)</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                        Nearly all consumer motherboards utilize a <strong>Daisy-Chain memory trace layout</strong>. Traces route from the CPU socket directly to Slot 2, then continue to Slot 4.
                    </p>
                    <ul class="clean-bullet-list" style="margin-top:6px;">
                        <li><strong>Always install 2 sticks in Slots 2 and 4 (labeled A2 and B2):</strong> Counting away from CPU: <em>[CPU] ➔ Empty (A1) ➔ Stick (A2) ➔ Empty (B1) ➔ Stick (B2)</em>.</li>
                        <li><strong>Why this matters:</strong> Placing sticks in Slots 1 and 3 leaves open, unterminated trace stubs. Signal reflections bounce back along the PCB, causing memory instability and game crashes.</li>
                    </ul>
                </div>
            </div>

            <div class="step-content-box" style="margin-top: 8px; border-left: 3px solid var(--accent-brand);">
                <strong style="color:var(--text-primary)">Anti-Cheat Compatibility Guardrail (Riot Vanguard &amp; EasyAntiCheat):</strong>
                <p style="font-size:0.74rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                    If you play <strong>League of Legends, Valorant, Fortnite, or Apex</strong>:
                    <br/>• <strong>Secure Boot:</strong> Must be set to <strong>Enabled (Standard/Windows UEFI Mode)</strong>.
                    <br/>• <strong>TPM 2.0 (Intel PTT / AMD fTPM):</strong> Must remain <strong>Enabled</strong>.
                    <br/>• <strong>CSM:</strong> Must be <strong>Disabled (Pure UEFI)</strong>. If CSM is turned on, Vanguard rejects the boot environment (Error VAN 9003).
                </p>
            </div>
        </div>

        <!-- PHASE 3: FIRST-BOOT SAFETY NETS & DRIVER LOCK -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge phase-pill">PHASE 03</span>
                <span class="step-title">Safety Nets, Checkpoints &amp; Driver Lock</span>
            </div>
            <p class="step-desc">
                Create an instant system restore checkpoint and block Windows Update from replacing your clean display drivers with outdated generic OEM drivers.
            </p>

            <div class="action-revert-pair">
                <div class="terminal-code-window">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">PowerShell (Admin) · Action 1: Create System Restore Point</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="Enable-ComputerRestore -Drive 'C:\'; Checkpoint-Computer -Description 'FreshInstall-Clean' -RestorePointType 'MODIFY_SETTINGS'">Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>Enable-ComputerRestore -Drive "C:\"; Checkpoint-Computer -Description "FreshInstall-Clean" -RestorePointType "MODIFY_SETTINGS"</code></pre>
                </div>

                <div class="revert-box">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                        <span class="revert-title">How to Roll Back / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy="SystemPropertiesProtection">Copy Run Command</button>
                    </div>
                    <span class="revert-text">
                        Press <kbd>Win</kbd> + <kbd>R</kbd>, type <code>SystemPropertiesProtection</code>, press Enter, and click <strong>"System Restore"</strong>.
                    </span>
                </div>
            </div>

<div class="action-revert-pair" style="margin-top: 10px;">
                <div class="terminal-code-window">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">Command Prompt (Admin) · Action 2: Block Driver Overwrite</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy='reg add "HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f'>Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>reg add "HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f</code></pre>
                </div>

                <div class="revert-box">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy='reg delete "HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /f'>Copy Revert Command</button>
                    </div>
                    <span class="revert-text">
                        Restores driver auto-updates: <code>reg delete "HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /f</code>
                    </span>
                </div>
            </div>
        </div>

        <!-- PHASE 4: DDU DEEP CLEAN, DRIVERS & GRAPHICS CALIBRATION -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge phase-pill">PHASE 04</span>
                <span class="step-title">DDU Safe Mode Deep Clean &amp; Graphics Calibration</span>
            </div>
            <p class="step-desc">
                Display Driver Uninstaller (DDU) eliminates remnant display drivers, broken shader caches, and audio conflicts before clean installation.
            </p>

            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 1: Driver Preparation (Do This While Connected):</strong>
                    <div style="display:flex; gap:6px;">
                        <a href="https://www.wagnardsoft.com/display-driver-uninstaller-ddu-" target="_blank" rel="noopener" class="link-chip">Download DDU (v18+) ↗</a>
                    </div>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin:0;">
                    Download the official driver installer matched to your GPU below. Save DDU and the driver installer to your local drive or USB before beginning.
                </p>
            </div>

            <div class="step-content-box">
                <strong style="color:var(--text-primary)">Step 2: DDU Safe Mode Deep Clean Protocol:</strong>
                <ol class="ordered-step-list">
                    <li><strong>DISCONNECT FROM THE INTERNET:</strong> Unplug Ethernet or disable Wi-Fi. (Remain offline until Step 4 is complete).</li>
                    <li><strong>Reboot into Safe Mode:</strong> Hold <kbd>Shift</kbd> while clicking Restart in Start Menu ➔ Troubleshoot ➔ Advanced Options ➔ Startup Settings ➔ Restart ➔ Press <kbd>4</kbd> (Enable Safe Mode).</li>
                    <li><strong>Launch DDU in Safe Mode:</strong>
                        <ul class="clean-bullet-list" style="margin-top:4px;">
                            <li><strong>iGPU Clean (if on desktop):</strong> Select device type <strong>GPU</strong> ➔ Select <strong>Intel</strong> ➔ Click <em>"Clean and do NOT restart"</em>.</li>
                            <li><strong>Dedicated GPU Clean:</strong> Select device type <strong>GPU</strong> ➔ Select your card vendor (NVIDIA / AMD) ➔ Click <strong>"Clean and Restart"</strong>.</li>
                        </ul>
                    </li>
                    <li>Your PC reboots into normal Windows with generic basic display drivers. <strong>Stay offline.</strong> Run your downloaded GPU installer executable.</li>
                </ol>
            </div>

            <div id="hw-dynamic-content" class="step-content-box"></div>

            <!-- STEP 3: DISPLAY & 3D SETTINGS CALIBRATION -->
            <div class="step-content-box" style="margin-top:4px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)" id="p4-driver-control-title">Step 3: Display Calibration &amp; Driver 3D Engine:</strong>
                    <span class="pill-badge" id="p4-driver-control-badge" style="font-size:0.65rem">Dynamic Calibration</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 6px 0; line-height:1.45;" id="p4-driver-control-desc">
                    Follow the prerequisite display setup before applying the 3D settings matrix below:
                </p>

                <div id="p4-display-prereqs-mount" style="width:100%; margin-top:8px;"></div>
                <div id="p4-driver-settings-table-mount" style="width:100%; margin-top:14px;"></div>
            </div>
        </div>

        <!-- PHASE 5: CHRIS TITUS WINUTIL BLUEPRINT -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge phase-pill">PHASE 05</span>
                <span class="step-title">Chris Titus WinUtil Companion Blueprint</span>
            </div>
            <p class="step-desc">
                Connect your Ethernet cable now. Launch CTT WinUtil in PowerShell, then click any section below to mirror the exact checkboxes.
                <strong>Green [✓ SET ON]</strong> buttons are safe to check, <strong>Red [✕ LEAVE OFF]</strong> must stay unchecked, and <strong>Yellow [⚡ OPTIONAL]</strong> are for specific setups.
            </p>

            <div class="terminal-code-window">
                <div class="terminal-bar">
                    <div class="terminal-badge">
                        <span class="terminal-dot"></span>
                        <span class="terminal-title">PowerShell (Administrator) · Launch CTT WinUtil</span>
                    </div>
                    <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="iwr -useb https://christitus.com/win | iex">Copy Command</button>
                </div>
                <pre class="terminal-code-body"><code>iwr -useb https://christitus.com/win | iex</code></pre>
            </div>

            <div class="ctt-workbench-layout">
                <div class="ctt-column">
             <div class="ctt-accordion" id="acc-ctt-essential">
                        <button type="button" class="ctt-accordion-header" data-target="ctt-box-essential">
                            <div class="acc-title-group">
                                <span class="acc-chevron">▸</span>
                                <span>Essential Tweaks (Exact CTT Mirror)</span>
                            </div>
                            <span class="pill-badge" style="font-size:0.65rem">18 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-essential" style="display: none;"></div>
                    </div>

                    <div class="ctt-accordion" id="acc-ctt-advanced" style="margin-top:10px;">
                        <button type="button" class="ctt-accordion-header" data-target="ctt-box-advanced">
                            <div class="acc-title-group">
                                <span class="acc-chevron">▸</span>
                                <span>Advanced Tweaks — CAUTION</span>
                            </div>
                            <span class="pill-badge" style="font-size:0.65rem">20 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-advanced" style="display: none;"></div>
                    </div>
                </div>

                <div class="ctt-column">
                    <div class="ctt-accordion" id="acc-ctt-preferences">
                        <button type="button" class="ctt-accordion-header" data-target="ctt-box-preferences">
                            <div class="acc-title-group">
                                <span class="acc-chevron">▸</span>
                                <span>Customize Preferences (Toggles)</span>
                            </div>
                            <span class="pill-badge" style="font-size:0.65rem">24 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-preferences" style="display: none;"></div>
                    </div>

                    <div class="ctt-accordion" id="acc-ctt-features" style="margin-top:10px;">
                        <button type="button" class="ctt-accordion-header" data-target="ctt-box-features">
                            <div class="acc-title-group">
                                <span class="acc-chevron">▸</span>
                                <span>Config Tab ➔ Features (.NET, DirectPlay &amp; WSL)</span>
                            </div>
                            <span class="pill-badge" style="font-size:0.65rem">9 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-features" style="display: none;"></div>
                    </div>

                    <div class="ctt-section-container" style="margin-top:10px;">
                        <div class="ctt-section-title">
                            <span>DNS Benchmark (UDP Port 53 Latency Test)</span>
                            <span class="pill-badge" style="font-size:0.65rem">Benchmark Script</span>
                        </div>
                        <p style="font-size:0.74rem; color:var(--text-secondary); margin:4px 0 6px 0; line-height:1.45;">
                            Run this script in PowerShell to test your actual UDP latency across top public resolvers:
                        </p>

                        <div class="terminal-code-window">
                            <div class="terminal-bar">
                                <div class="terminal-badge">
                                    <span class="terminal-dot"></span>
                                    <span class="terminal-title">PowerShell (Admin) · DNS Benchmark</span>
                                </div>
                                <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="$s=@([PSCustomObject]@{N='Cloudflare';I='1.1.1.1'},[PSCustomObject]@{N='Quad9';I='9.9.9.9'},[PSCustomObject]@{N='Google';I='8.8.8.8'},[PSCustomObject]@{N='AdGuard';I='94.140.14.14'},[PSCustomObject]@{N='OpenDNS';I='208.67.222.222'},[PSCustomObject]@{N='Control D';I='76.76.2.0'}); $d=@('cloudflare.com','steampowered.com','google.com','microsoft.com','riotgames.com'); Write-Host '--- RUNNING DNS BENCHMARK OVER RAW UDP ---' -ForegroundColor Cyan; $res=foreach($srv in $s){ $times=@(); for($i=0;$i -lt 3;$i++){ foreach($dom in $d){ try{ $sw=[System.Diagnostics.Stopwatch]::StartNew(); $null=Resolve-DnsName -Name $dom -Server $srv.I -Type A -QuickTimeout -DnsOnly -ErrorAction Stop; $sw.Stop(); $times+=$sw.Elapsed.TotalMilliseconds }catch{} } }; $avg=if($times.Count -gt 0){[Math]::Round(($times | Measure-Object -Average).Average, 1)}else{999}; [PSCustomObject]@{ Provider=$srv.N; IP=$srv.I; 'Avg(ms)'=$avg } }; $res | Sort-Object 'Avg(ms)' | Format-Table -AutoSize">Copy Benchmark</button>
                            </div>
                            <pre class="terminal-code-body"><code>$s=@([PSCustomObject]@{N='Cloudflare';I='1.1.1.1'},[PSCustomObject]@{N='Quad9';I='9.9.9.9'},[PSCustomObject]@{N='Google';I='8.8.8.8'},[PSCustomObject]@{N='AdGuard';I='94.140.14.14'}...); ... # Resolves and ranks fastest DNS</code></pre>
                        </div>

                        <!-- 4 DIVERSE DNS PROVIDERS -->
                        <div class="dns-static-grid" style="margin-top:8px;">
                            <div class="dns-static-card fastest">
                                <div class="dns-tile-top">
                                    <strong style="color:var(--text-primary)">1. Cloudflare (1.1.1.1)</strong>
                                    <span class="pill-badge" style="font-size:0.65rem">Lowest Gaming Ping</span>
                                </div>
                                <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0;">
                                    Ranked #1 on DNSPerf. Zero logs, Anycast routing, lowest round-trip query time.
                                </p>
                            </div>

                            <div class="dns-static-card">
                                <div class="dns-tile-top">
                                    <strong style="color:var(--text-primary)">2. Quad9 (9.9.9.9)</strong>
                                    <span class="pill-badge" style="font-size:0.65rem">Malware Blocking</span>
                                </div>
                                <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0;">
                                    Non-profit Swiss resolver with automated threat-intelligence blocking at the network edge.
                                </p>
                            </div>

                            <div class="dns-static-card">
                                <div class="dns-tile-top">
                                    <strong style="color:var(--text-primary)">3. Google (8.8.8.8)</strong>
                                    <span class="pill-badge" style="font-size:0.65rem">Global Reliability</span>
                                </div>
                                <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0;">
                                    Massive global infrastructure with nearly 100% uptime. Optimal backup secondary resolver.
                                </p>
                            </div>

                            <div class="dns-static-card">
                                <div class="dns-tile-top">
                                    <strong style="color:var(--text-primary)">4. AdGuard (94.140.14.14)</strong>
                                    <span class="pill-badge" style="font-size:0.65rem">Ad &amp; Tracker Blocker</span>
                                </div>
                                <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0;">
                                    Blocks ads, telemetries, and tracking domains at the DNS level before packets touch apps.
                                </p>
                            </div>
                        </div>

                        <div class="mpo-advice-card" style="margin-top:8px;">
                            <div><strong>Multiplane Overlay (MPO) in CTT:</strong> Set to <strong style="color:var(--accent-rose);">Disabled</strong> to prevent desktop and Discord black-screen flickering.</div>
                            <div style="margin-top:4px;"><strong>Performance Plans in CTT:</strong> <strong style="color:var(--accent-rose);">Do not enable "Ultimate Performance"</strong> in CTT. Use our calibrated Balanced script in Phase 6 instead to keep idle fan noise quiet.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PHASE 6: KERNEL LATENCY & HARDWARE INTERRUPTS -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge phase-pill">PHASE 06</span>
                <span class="step-title">Kernel Latency, Hardware Interrupts &amp; Polish</span>
            </div>
            <p class="step-desc">
                These finishing touches resolve hardware polling conflicts and DPC latency that general debloaters cannot touch. Every step includes its technical background and exact revert command.
            </p>

            <!-- STEP 1: BALANCED POWER -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 1: Calibrated Balanced Power Script (Silent Idle, Peak Boost):</strong>
                    <span class="pill-badge" style="font-size:0.65rem">Core Power</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    <strong>Why use it:</strong> "Ultimate Performance" plans pin CPU clocks at 100% frequency even when browsing the web, generating unnecessary heat and fan noise. This script configures Balanced mode to drop idle clock speeds to quiet states, while configuring PCIe Link State Power Management to <strong>Off</strong> and disabling USB selective suspend so gaming mice never disconnect or hitch during movement. It also turns off hibernation to reclaim 16–32 GB of drive space.
                </p>
                <div class="terminal-code-window" style="margin-top:6px;">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">CMD / PowerShell (Admin) · Apply Power Script</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="powercfg -restoredefaultschemes; powercfg /change monitor-timeout-ac 0; powercfg /change standby-timeout-ac 0; powercfg /change disk-timeout-ac 0; powercfg /setacvalueindex SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0; powercfg /hibernate off; powercfg /setactive SCHEME_CURRENT">Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>powercfg -restoredefaultschemes; powercfg /change monitor-timeout-ac 0; powercfg /change standby-timeout-ac 0; powercfg /change disk-timeout-ac 0; powercfg /setacvalueindex SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0; powercfg /hibernate off; powercfg /setactive SCHEME_CURRENT</code></pre>
                </div>
                <div class="revert-box" style="margin-top:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy="powercfg -restoredefaultschemes; powercfg /hibernate on">Copy Revert</button>
                    </div>
                    <span class="revert-text">Restores standard Windows default power profiles: <code>powercfg -restoredefaultschemes; powercfg /hibernate on</code></span>
                </div>
            </div>

            <!-- STEP 2: MSI UTILITY -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 2: MSI (Message Signaled Interrupts) Mode Utility v3:</strong>
                    <a href="https://forums.guru3d.com/threads/windows-line-based-vs-message-signaled-based-interrupts-msi-tool.378044/" target="_blank" rel="noopener" class="link-chip">Download MSI Tool v3 ↗</a>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    <strong>Why use it:</strong> Legacy line-based interrupts force devices to share an IRQ pin, creating hardware interrupt queues and micro-stuttering under heavy GPU/network load. MSI gives your GPU and network card dedicated vector addresses for direct hardware interrupts.
                </p>
                <ul class="clean-bullet-list" style="margin-top:6px;">
                    <li>Right-click <code>MSI_util_v3.exe</code> and click <strong>Run as Administrator</strong>.</li>
                    <li>Locate your <strong>Graphics Card</strong>: Check the <strong>MSI</strong> box, and set <strong>Interrupt Priority</strong> to <strong>High</strong> (or Undefined).</li>
                    <li>Locate your <strong>Realtek / Intel Network Adapter</strong>: Check the <strong>MSI</strong> box.</li>
                    <li>Click <strong>Apply</strong> at top right and reboot.</li>
                </ul>
                <div class="revert-box" style="margin-top:6px;">
                    <span class="revert-title">How to Revert / Undo:</span>
                    <span class="revert-text">Open <code>MSI_util_v3.exe</code> as Admin, uncheck MSI for the device, set Interrupt Priority back to <strong>Undefined</strong>, and click <strong>Apply</strong>.</span>
                </div>
            </div>

            <!-- STEP 3: NETWORK ADAPTER -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 3: Network Adapter Hardware Optimization (Kill Packet Sleep):</strong>
                    <span class="pill-badge" style="font-size:0.65rem">Device Manager</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    <strong>Why use it:</strong> Features like "Energy Efficient Ethernet" place the physical Ethernet transceiver into low-power sleep between bursts of packets, introducing 2–10ms packet latency jitter when data resumes. Disabling green features maintains constant line readiness.
                </p>
                <ul class="clean-bullet-list" style="margin-top:6px;">
                    <li>Press <kbd>Win</kbd> + <kbd>X</kbd> ➔ Device Manager ➔ Expand <em>Network adapters</em> ➔ Right-click your Ethernet controller ➔ <strong>Properties</strong> ➔ <strong>Advanced</strong> tab:</li>
                    <li><strong>Energy Efficient Ethernet (EEE):</strong> Set to <strong>Disabled</strong>.</li>
                    <li><strong>Green Ethernet / Gigabit Lite:</strong> Set to <strong>Disabled</strong>.</li>
                    <li><strong>Interrupt Moderation:</strong> Set to <strong>Enabled</strong> (or <em>Low</em> for competitive gaming).</li>
                    <li><strong>Receive Side Scaling (RSS):</strong> Set to <strong>Enabled</strong>.</li>
                </ul>
                <div class="revert-box" style="margin-top:6px;">
                    <span class="revert-title">How to Revert / Undo:</span>
                    <span class="revert-text">In Device Manager ➔ Network Adapter Properties ➔ Advanced tab, set Energy Efficient Ethernet back to <strong>Enabled</strong> and Interrupt Moderation to <strong>Enabled</strong>.</span>
                </div>
            </div>

<!-- STEP 4: MMCSS -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 4: Disable MMCSS Network Throttling &amp; System CPU Reservation:</strong>
                    <span class="pill-badge" style="font-size:0.65rem">Network Queue</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    <strong>Why use it:</strong> By default, Windows Multimedia Class Scheduler Service (MMCSS) throttles non-multimedia network packets by up to 20% whenever an audio application is active, and reserves 20% of CPU time for background services. Setting <code>NetworkThrottlingIndex</code> to <code>0xFFFFFFFF</code> and <code>SystemResponsiveness</code> to <code>0</code> eliminates packet throttling during online gaming and Discord streaming.
                </p>
                <div class="terminal-code-window" style="margin-top:6px;">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">PowerShell / CMD (Admin) · MMCSS Fix</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy='reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f'>Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f</code></pre>
                </div>
                <div class="revert-box" style="margin-top:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy='reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 20 /f'>Copy Revert</button>
                    </div>
                    <span class="revert-text">Restores standard Windows default values (Index: 10, Responsiveness: 20): <code>reg add "HKLM\\SOFTWARE\\Microsoft\\\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 20 /f</code></span>
                </div>
            </div>

          <!-- STEP 5: GAME DVR -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 5: Disable Game DVR Background Recording:</strong>
                    <span class="pill-badge" style="font-size:0.65rem">GPU Encoder</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    <strong>Why use it:</strong> Windows background Game DVR silently records gameplay clips in a continuous buffer, utilizing GPU encoder hardware and CPU cycles. Turning it off frees up hardware video encoder bandwidth and prevents micro-stutters during heavy gameplay.
                </p>
                <div class="terminal-code-window" style="margin-top:6px;">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">PowerShell / CMD (Admin) · Game DVR Kill</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy='reg add "HKCU\\System\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f'>Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>reg add "HKCU\\System\\\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f; reg add "HKLM\\\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f</code></pre>
                </div>
                <div class="revert-box" style="margin-top:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy='reg add "HKCU\\System\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 1 /f; reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /f'>Copy Revert</button>
                    </div>
                    <span class="revert-text">Re-enables Windows background game recording: <code>reg add "HKCU\\\\System\\\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 1 /f; reg delete "HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\GameDVR" /v AllowGameDVR /f</code></span>
                </div>
            </div>

          <!-- STEP 6: FAST 3-CLICK VISUAL EFFECTS -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 6: 0ms Visual Effects (The 3-Click Native Method):</strong>
                    <span class="pill-badge" style="font-size:0.65rem">GUI · 5 Seconds</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Eliminates all 17 window zooms, taskbar slides, and fade delays without breaking text clarity or file previews.
                </p>

                <div style="display:flex; align-items:center; gap:8px; margin-top:6px; flex-wrap:wrap;">
                    <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono)">1. Open dialog:</span>
                    <span style="font-size:0.75rem; color:var(--text-primary)">Press <kbd>Win</kbd> + <kbd>R</kbd> ➔ type:</span>
                    <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="SystemPropertiesPerformance" style="font-family:var(--font-mono); font-size:0.72rem;">SystemPropertiesPerformance</button>
                </div>

                <div class="latency-grid" style="margin-top:8px;">
                    <div class="latency-item" style="border-left: 3px solid var(--accent-rose);">
                        <strong style="color:var(--accent-rose);">A. One-Click Strip:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            Select <strong>"Adjust for best performance"</strong> at the top. This immediately unchecks all 17 sluggish animations, tooltip slides, and drop shadows.
                        </p>
                    </div>

                    <div class="latency-item" style="border-left: 3px solid var(--accent-brand);">
                        <strong style="color:var(--accent-brand);">B. Re-Check The Essential 3:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            Scroll down and check <strong>ONLY</strong> these 3 boxes:
                            <br/>☑ <strong>Smooth edges of screen fonts</strong> <em>(Stops jagged/blurry text)</em>
                            <br/>☑ <strong>Show thumbnails instead of icons</strong> <em>(Keeps photo/video previews)</em>
                            <br/>☑ <strong>Show window contents while dragging</strong> <em>(No empty wireframes)</em>
                        </p>
                    </div>
                </div>

                <div class="revert-box" style="margin-top:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                        <span class="revert-title">How to Revert:</span>
                    </div>
                    <span class="revert-text">
                        Open <code>SystemPropertiesPerformance</code> again and select <strong>"Let Windows choose what's best for my computer"</strong> ➔ click <strong>Apply</strong>.
                    </span>
                </div>
            </div>

            <!-- STEP 7: DYNAMIC STATIC PAGEFILE -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)" id="p6-pagefile-title">Step 7: Automated Static NVMe Pagefile:</strong>
                    <span class="pill-badge" id="p6-pagefile-badge" style="font-size:0.65rem">Calculating...</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;" id="p6-pagefile-desc">
                    Calculating optimal pagefile size for your selected RAM profile...
                </p>
                <div class="terminal-code-window" style="margin-top:6px;">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">PowerShell (Admin) · Run Once</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" id="p6-pagefile-copy-btn" data-copy="">Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code id="p6-pagefile-code">Loading command...</code></pre>
                </div>
                <div class="revert-box" style="margin-top:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy="Get-CimInstance Win32_ComputerSystem | Set-CimInstance -Property @{AutomaticManagedPagefile=$True}; Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' -Name 'PagingFiles' -ErrorAction SilentlyContinue">Restore Automatic Management</button>
                    </div>
                    <span class="revert-text">Restores default Windows dynamic pagefile sizing: <code>Get-CimInstance Win32_ComputerSystem | Set-CimInstance -Property @{AutomaticManagedPagefile=$True}</code></span>
                </div>
            </div>

            <!-- STEP 8: CORE ISOLATION / HVCI AUDIT -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 8: Core Isolation &amp; Memory Integrity (HVCI) Latency Audit:</strong>
                    <span class="pill-badge" style="font-size:0.65rem">1% Low Latency</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    <strong>Why check it:</strong> Hypervisor-Protected Code Integrity (HVCI) isolates the kernel inside a virtualized hypervisor container. On gaming rigs, it can impose a 3–8% CPU overhead on 1% lows. On Windows 10, it is usually OFF by default. Use this diagnostic to verify its state:
                </p>
                <div class="terminal-code-window" style="margin-top:6px;">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">PowerShell (Admin) · Audit &amp; Disable HVCI</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy='$k="HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity"; $hv=(Get-ItemProperty -Path $k -ErrorAction SilentlyContinue).Enabled; if($hv -eq 1){ Set-ItemProperty -Path $k -Name "Enabled" -Value 0 -Type DWord; Write-Host "HVCI was ENABLED. Disabled for bare-metal gaming latency. Restart PC to apply." -ForegroundColor Yellow } else { Write-Host "HVCI is already OFF. Maximum bare-metal performance active." -ForegroundColor Green }'>Audit &amp; Disable</button>
                    </div>
                    <pre class="terminal-code-body"><code>Check HypervisorEnforcedCodeIntegrity ➔ Set Enabled=0 for bare-metal CPU execution</code></pre>
                </div>
                <div class="revert-box" style="margin-top:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy='Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" -Name "Enabled" -Value 1 -Type DWord'>Enable HVCI</button>
                    </div>
                    <span class="revert-text">Re-enables hypervisor memory integrity: <code>Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" -Name "Enabled" -Value 1 -Type DWord</code></span>
                </div>
            </div>

            <!-- STEP 9: SUBSYSTEM & AUDIO POLISH -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 9: Targeted Subsystem &amp; Audio Latency Polish:</strong>
                    <span class="pill-badge" style="font-size:0.65rem">Fine-Tuning Grid</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Quick adjustments for desktop responsiveness, direct audio hardware alignment, and storage index hygiene:
                </p>

                <div class="latency-grid" style="margin-top:8px;">
                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">Desktop Menu Delay (10ms):</strong>
                        <p style="font-size:0.73rem; margin:4px 0 6px 0; color:var(--text-secondary);">
                            Eliminates the sluggish 400ms delay before context submenus expand.
                        </p>
                        <div class="terminal-code-window">
                            <div class="terminal-bar">
                                <div class="terminal-badge"><span class="terminal-dot"></span><span>10ms Delay</span></div>
                                <button type="button" class="btn-action-pill copy-btn-trigger" data-copy='reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 10 /f''>Copy</button>
                            </div>
                            <pre class="terminal-code-body"><code>reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d 10 /f</code></pre>
                        </div>
                        <div style="margin-top:6px; font-size:0.7rem; color:var(--text-muted)">
                            <strong>Revert:</strong> <code>reg add "HKCU\Control Panel\Desktop" /v MenuShowDelay /t REG_SZ /d 400 /f</code>
                        </div>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">Audio Resampling Alignment (48,000 Hz):</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            Almost all games render audio natively at 48 kHz. Setting your DAC or headset to 48 kHz avoids Windows software resampling overhead.
                            <br/><br/>
                            Press <kbd>Win</kbd> + <kbd>R</kbd> ➔ <code>mmsys.cpl</code> ➔ Properties ➔ Advanced ➔ set <strong>24-bit, 48000 Hz</strong>.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">Disable NTFS 8.3 &amp; LastAccess:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 6px 0; color:var(--text-secondary);">
                            Stops Windows from writing secondary MS-DOS short file names and timestamp records on every file read.
                        </p>
                        <div class="terminal-code-window">
                            <div class="terminal-bar">
                                <div class="terminal-badge"><span class="terminal-dot"></span><span>NTFS Tweaks</span></div>
                                <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="fsutil behavior set disable8dot3 1; fsutil behavior set disablelastaccess 1">Copy</button>
                            </div>
                            <pre class="terminal-code-body"><code>fsutil behavior set disable8dot3 1; fsutil behavior set disablelastaccess 1</code></pre>
                        </div>
                        <div style="margin-top:6px; font-size:0.7rem; color:var(--text-muted)">
                            <strong>Revert:</strong> <code>fsutil behavior set disable8dot3 0; fsutil behavior set disablelastaccess 0</code>
                        </div>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">NVMe TRIM &amp; Game De-Indexing:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            1. <strong>TRIM Check:</strong> Run <code>fsutil behavior query DisableDeleteNotify</code> (should return 0).<br/>
                            2. <strong>De-Index:</strong> In Windows Indexing Options, uncheck game installation drives so search indexing daemons don't scan game folders during gameplay.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">App Hardware Acceleration (Discord, Chrome, Spotify):</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            Chromium and Electron apps allocate background Direct3D swapchains. When an intensive game hits 95–99% GPU usage, background video streams drop frames, causing Desktop Window Manager (DWM) stuttering on your primary monitor.
                            <br/><br/>
                            • <strong>Discord:</strong> User Settings ➔ Advanced ➔ Toggle <strong>Hardware Acceleration OFF</strong>.<br/>
                            • <strong>Chrome / Brave / Edge:</strong> Settings ➔ System ➔ Toggle <em>"Use graphics acceleration when available"</em> <strong>OFF</strong> if gaming on mismatched refresh monitors.<br/>
                            • <strong>Spotify:</strong> Click ••• Menu ➔ View ➔ Toggle <strong>Hardware Acceleration OFF</strong>.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">Mouse Polling Rate (1,000 Hz vs. 4,000 / 8,000 Hz):</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            Polling rates (4K / 8K) send 4,000–8,000 hardware interrupts per second to CPU Core 0. On 8-thread CPUs (like i7-9700K or Ryzen 3600/5600), fast mouse swipes can consume 25–35% of a CPU core, causing frame drops in <em>League of Legends</em> and <em>Valorant</em>.
                            <br/><br/>
                            • <strong>Competitive Standard:</strong> Set your mouse software to <strong>1,000 Hz</strong> for rock-solid frame pacing.<br/>
                            • <strong>Live Rate Checker:</strong> Test your actual sensor frequency at <a href="https://cpstest.org/polling-rate-test/" target="_blank" rel="noopener" class="link-chip">Polling Rate Test ↗</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- PHASE 7: DEEP HOUSEKEEPING, BLEACHBIT & STARTUP PURGE -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge phase-pill">PHASE 07</span>
                <span class="step-title">Deep Housekeeping, BleachBit &amp; Startup Hygiene</span>
            </div>
            <p class="step-desc">
                Eliminate startup polling daemons, clear crash dumps safely, and clean system buffers without breaking Windows.
            </p>

            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 1: Clean Startup Hooks with Microsoft Sysinternals Autoruns:</strong>
                    <a href="https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns" target="_blank" rel="noopener" class="link-chip">Download Autoruns (Sysinternals) ↗</a>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Task Manager only shows ~30% of startup programs. Autoruns reveals hidden hooks:
                </p>
                <ul class="clean-bullet-list" style="margin-top:6px;">
                    <li>Extract and launch <code>Autoruns64.exe</code> as Administrator.</li>
                    <li>Entries highlighted in <strong>Yellow ("File Not Found")</strong> ➔ Right-click ➔ <strong>Delete</strong> (cleans orphaned startup keys).</li>
                    <li>Click the <strong>Logon</strong> tab ➔ Uncheck auto-updaters (Adobe, Discord Update, Edge AutoLaunch).</li>
                </ul>
            </div>

            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Step 2: BleachBit Deep Cleaning Protocol:</strong>
                    <a href="https://www.bleachbit.org/download" target="_blank" rel="noopener" class="link-chip">Download BleachBit Official ↗</a>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Follow these safe checkboxes when running BleachBit:
                </p>
                <div class="latency-grid" style="margin-top:6px;">
                    <div class="latency-item" style="border-color: rgba(74, 222, 128, 0.25);">
                        <strong style="color:#22c55e">✓ SAFE TO CHECK IN BLEACHBIT:</strong>
                        <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.4;">
                            • <strong>System:</strong> Temporary files, Memory Dumps, Mini-dumps, Recycle Bin, Clipboard.<br/>
                            • <strong>Windows Explorer:</strong> Thumbnail cache, Recent documents.<br/>
                            • <strong>Prefetch:</strong> Safe to clean once after finishing your debloat setup.
                        </p>
                    </div>
                    <div class="latency-item" style="border-color: rgba(214, 93, 100, 0.25);">
                        <strong style="color:var(--accent-rose)">✕ DO NOT CHECK (DANGER):</strong>
                        <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.4;">
                            • <strong>Windows Registry:</strong> Never clean the registry with BleachBit.<br/>
                            • <strong>Free disk space wipe:</strong> Unnecessary write cycles on modern NVMe SSDs.<br/>
                            • <strong>Do not clean Prefetch weekly:</strong> Prefetch speeds up daily application launches.
                        </p>
                    </div>
                </div>
            </div>

            <div class="step-content-box">
                <strong style="color:var(--text-primary)">Step 3: Safe Manual AppData &amp; Crash Dump Purge:</strong>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Never delete your entire AppData folder. Safely delete these temporary subdirectories:
                </p>
                <ul class="clean-bullet-list" style="margin-top:6px;">
                    <li><code>%localappdata%\CrashDumps</code> ➔ Delete all contents (Frees gigabytes of old crash dumps).</li>
                    <li><code>%temp%</code> and <code>C:\Windows\Temp</code> ➔ Delete all contents (Skip files in use).</li>
                    <li><code>%localappdata%\D3DSCache</code> ➔ Safe to delete if clearing corrupted game DirectX shader caches.</li>
                </ul>
            </div>
        </div>

        <!-- PHASE 8: THE "GOLDEN MASTER" BACKUP -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge phase-pill">PHASE 08</span>
                <span class="step-title">The "Golden Master" Backup (The Finish Line)</span>
            </div>
            <p class="step-desc">
                Your system is now clean, responsive, and low-latency. Capturing an image now lets you restore to this exact setup in under 3 minutes if anything ever goes wrong.
            </p>

            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary)">Native Windows System Image Tool:</strong>
                    <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="sdclt.exe /BLASTBACKUP">Launch Backup Wizard</button>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                    Press <kbd>Win</kbd> + <kbd>R</kbd> ➔ type <code>sdclt.exe</code> ➔ Click <strong>"Create a system image"</strong> on the left pane ➔ Select your external backup drive.
                </p>
            </div>
        </div>
    </div>
</div>
`;