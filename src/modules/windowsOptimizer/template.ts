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
                <span style="font-size:0.82rem; font-weight:700; color:var(--text-primary)">Quantify Your Improvement (Auto-Comparing Telemetry):</span>
            </div>
            <span style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono)">Saves Before &amp; After Scorecard to Desktop</span>
        </div>
        <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
            Run this command in PowerShell (Admin). On your first run, it creates a baseline <code>Windows-Benchmark-Before.clixml</code> on your Desktop. Complete Phase 1 through 7, then run it again to generate your before-and-after scorecard.
        </p>

        <div class="terminal-code-window" style="margin-top:6px;">
            <div class="terminal-bar">
                <div class="terminal-badge">
                    <span class="terminal-dot"></span>
                    <span class="terminal-title">PowerShell (Administrator)</span>
                </div>
                <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="&amp; { $desktop=[Environment]::GetFolderPath('Desktop'); $beforePath=Join-Path $desktop 'Windows-Benchmark-Before.clixml'; $afterPath=Join-Path $desktop 'Windows-Benchmark-After.clixml'; $reportPath=Join-Path $desktop 'Windows-Benchmark-Report.txt'; $procs=Get-Process; $procCount=$procs.Count; $threadCount=($procs.Threads).Count; $handleCount=($procs | Measure-Object -Property Handles -Sum).Sum; $os=Get-CimInstance Win32_OperatingSystem; $totalRamMB=[Math]::Round($os.TotalVisibleMemorySize/1024,0); $freeRamMB=[Math]::Round($os.FreePhysicalMemory/1024,0); $usedRamMB=$totalRamMB-$freeRamMB; $ramPct=[Math]::Round(($usedRamMB/$totalRamMB)*100,1); $cpu=(Get-CimInstance Win32_Processor).Name.Trim(); $gpu=(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' / '; $nonMsServices=Get-CimInstance Win32_Service | Where-Object { $_.State -eq 'Running' -and $_.PathName -notmatch 'Windows|System32' }; $serviceCount=($nonMsServices | Measure-Object).Count; $dwm=Get-Process dwm -ErrorAction SilentlyContinue; $dwmMemMB=if($dwm){[Math]::Round($dwm.WorkingSet64/1MB,1)}else{0}; $snapshot=[PSCustomObject]@{ Timestamp=(Get-Date).ToString('yyyy-MM-dd HH:mm:ss'); CPU=$cpu; GPU=$gpu; Active_Processes=$procCount; Active_Threads=$threadCount; Open_Handles=$handleCount; Used_RAM_MB=$usedRamMB; Free_RAM_MB=$freeRamMB; RAM_Usage_Pct=$ramPct; Non_MS_Services=$serviceCount; DWM_RAM_MB=$dwmMemMB }; if(-not(Test-Path $beforePath)){ $snapshot | Export-Clixml -Path $beforePath; Write-Host ''; Write-Host '[STEP 1 COMPLETE: BASELINE SAVED TO DESKTOP]' -ForegroundColor Green; $snapshot | Format-List; Write-Host ''; Write-Host 'Complete Phase 1 to Phase 7, then run this command again to see your scorecard!' -ForegroundColor Cyan; Write-Host '' } else { $before=Import-Clixml -Path $beforePath; $snapshot | Export-Clixml -Path $afterPath; $pDiff=$snapshot.Active_Processes-$before.Active_Processes; $tDiff=$snapshot.Active_Threads-$before.Active_Threads; $hDiff=$snapshot.Open_Handles-$before.Open_Handles; $rDiff=$snapshot.Used_RAM_MB-$before.Used_RAM_MB; $sDiff=$snapshot.Non_MS_Services-$before.Non_MS_Services; $dDiff=$snapshot.DWM_RAM_MB-$before.DWM_RAM_MB; $comp=@( [PSCustomObject]@{Metric='Active Processes';Before=$before.Active_Processes;After=$snapshot.Active_Processes;Change=&quot;$pDiff&quot;;Status=if($pDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='Kernel Threads';Before=$before.Active_Threads;After=$snapshot.Active_Threads;Change=&quot;$tDiff&quot;;Status=if($tDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='System Handles';Before=$before.Open_Handles;After=$snapshot.Open_Handles;Change=&quot;$hDiff&quot;;Status=if($hDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='RAM Used (MB)';Before=$before.Used_RAM_MB;After=$snapshot.Used_RAM_MB;Change=&quot;$rDiff MB&quot;;Status=if($rDiff -le 0){'✓ Freed'}else{'Increased'}}, [PSCustomObject]@{Metric='3rd-Party Services';Before=$before.Non_MS_Services;After=$snapshot.Non_MS_Services;Change=&quot;$sDiff&quot;;Status=if($sDiff -le 0){'✓ Stripped'}else{'Added'}}, [PSCustomObject]@{Metric='DWM Memory (MB)';Before=$before.DWM_RAM_MB;After=$snapshot.DWM_RAM_MB;Change=&quot;$dDiff MB&quot;;Status=if($dDiff -le 0){'✓ Lean'}else{'Increased'}} ); Write-Host ''; Write-Host '================== OPTIMIZATION SCORECARD ==================' -ForegroundColor Cyan; $comp | Format-Table -AutoSize; $comp | Out-File -FilePath $reportPath; Write-Host ('[Scorecard saved to: ' + $reportPath + ']'); Write-Host '' } }">Copy Benchmark Script</button>
            </div>
            <pre class="terminal-code-body"><code>&amp; { $desktop=[Environment]::GetFolderPath('Desktop'); $beforePath=Join-Path $desktop 'Windows-Benchmark-Before.clixml'; $afterPath=Join-Path $desktop 'Windows-Benchmark-After.clixml'; $reportPath=Join-Path $desktop 'Windows-Benchmark-Report.txt'; $procs=Get-Process; $procCount=$procs.Count; $threadCount=($procs.Threads).Count; $handleCount=($procs | Measure-Object -Property Handles -Sum).Sum; $os=Get-CimInstance Win32_OperatingSystem; $totalRamMB=[Math]::Round($os.TotalVisibleMemorySize/1024,0); $freeRamMB=[Math]::Round($os.FreePhysicalMemory/1024,0); $usedRamMB=$totalRamMB-$freeRamMB; $ramPct=[Math]::Round(($usedRamMB/$totalRamMB)*100,1); $cpu=(Get-CimInstance Win32_Processor).Name.Trim(); $gpu=(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' / '; $nonMsServices=Get-CimInstance Win32_Service | Where-Object { $_.State -eq 'Running' -and $_.PathName -notmatch 'Windows|System32' }; $serviceCount=($nonMsServices | Measure-Object).Count; $dwm=Get-Process dwm -ErrorAction SilentlyContinue; $dwmMemMB=if($dwm){[Math]::Round($dwm.WorkingSet64/1MB,1)}else{0}; $snapshot=[PSCustomObject]@{ Timestamp=(Get-Date).ToString('yyyy-MM-dd HH:mm:ss'); CPU=$cpu; GPU=$gpu; Active_Processes=$procCount; Active_Threads=$threadCount; Open_Handles=$handleCount; Used_RAM_MB=$usedRamMB; Free_RAM_MB=$freeRamMB; RAM_Usage_Pct=$ramPct; Non_MS_Services=$serviceCount; DWM_RAM_MB=$dwmMemMB }; if(-not(Test-Path $beforePath)){ $snapshot | Export-Clixml -Path $beforePath; Write-Host '[STEP 1 COMPLETE: BASELINE SAVED TO DESKTOP]' -ForegroundColor Green; $snapshot | Format-List } else { ... # Compares Before &amp; After Metrics and Outputs Scorecard } }</code></pre>
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
                <div style="display:flex; justify-content:space-between; align-items:center;">
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
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="Enable-ComputerRestore -Drive &quot;C:\\&quot;; Checkpoint-Computer -Description &quot;FreshInstall-Clean&quot; -RestorePointType &quot;MODIFY_SETTINGS&quot;">Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>Enable-ComputerRestore -Drive "C:\\"; Checkpoint-Computer -Description "FreshInstall-Clean" -RestorePointType "MODIFY_SETTINGS"</code></pre>
                </div>

                <div class="revert-box">
                    <div class="code-header-flex">
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
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="reg add &quot;HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate&quot; /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f">Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f</code></pre>
                </div>

                <div class="revert-box">
                    <div class="code-header-flex">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy="reg delete &quot;HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate&quot; /v ExcludeWUDriversInQualityUpdate /f">Copy Revert Command</button>
                    </div>
                    <span class="revert-text">
                        Removes the policy key and restores standard automated driver delivery.
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
                    <li><strong>Reboot into Safe Mode:</strong> Hold <kbd>Shift</kbd> while clicking Restart in the Start Menu ➔ Troubleshoot ➔ Advanced Options ➔ Startup Settings ➔ Restart ➔ Press <kbd>4</kbd> (Enable Safe Mode).</li>
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

            <div class="step-content-box" style="margin-top:4px;">
                <strong style="color:var(--text-primary)">Step 3: Post-Install Graphics &amp; Display Calibration:</strong>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                    Once the clean driver is installed and you reboot, apply these essential control panel and system settings:
                </p>

                <div class="latency-grid" style="margin-top:8px;">
                    <!-- DYNAMIC HAGS CARD -->
                    <div class="latency-item" id="hags-calibration-card" style="border-color: var(--accent-brand);">
                        <strong style="color:var(--accent-brand)">1. Hardware-Accelerated GPU Scheduling (HAGS):</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;" id="hags-calibration-text">
                            Navigate to: <strong>Windows Settings (Win+I) ➔ System ➔ Display ➔ Graphics ➔ Change default graphics settings</strong>.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">2. Escape the 60Hz "Ultra HD" Trap:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            In NVIDIA Control Panel ➔ <em>Change resolution</em>: Do <strong>NOT</strong> pick resolutions from the top "Ultra HD, HD, SD" list (they cap monitors at 60Hz!).
                            <br/><br/>
                            Scroll down past Ultra HD to the <strong>"PC"</strong> section (e.g. <code>PC ➔ 1920x1080</code> or <code>2560x1440</code>). Select your native resolution here to unlock your monitor's true <strong>144Hz, 165Hz, or 240Hz+</strong>.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">3. Set Shader Cache Size to 10 GB:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            In NVIDIA Control Panel ➔ <em>Manage 3D settings</em> ➔ set <strong>Shader Cache Size</strong> to <strong>10 GB</strong> (instead of Driver Default).
                            <br/><br/>
                            Prevents modern DirectX 12 games (CoD, Fortnite, Apex) from continually re-compiling shaders during firefights, eliminating frame stutter.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">4. The Blur Busters Low-Latency Formula:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            • <strong>G-Sync / FreeSync:</strong> Enabled (Full Screen).<br/>
                            • <strong>NVCP Vertical Sync:</strong> <strong>ON</strong> (in driver, NOT in-game).<br/>
                            • <strong>In-Game V-Sync:</strong> <strong>OFF</strong>.<br/>
                            • <strong>Frame Cap:</strong> Cap <strong>3 to 4 FPS below monitor Hz</strong> (141 FPS on 144Hz; 237 FPS on 240Hz). Keeps frames inside the zero-lag G-Sync window.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">5. Recommended 3D Driver Settings:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            • <strong>Power Management Mode:</strong> <strong>Normal</strong> (prevents 60W idle draw and high fan noise).<br/>
                            • <strong>Low Latency Mode:</strong> <strong>On</strong> (In games with NVIDIA Reflex, set in-game Reflex to <em>On + Boost</em>).<br/>
                            • <strong>Texture Filtering - Quality:</strong> <strong>High Performance</strong>.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--text-primary)">6. Full Output Dynamic Range (0–255):</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            In NVIDIA Control Panel ➔ <em>Change resolution</em> ➔ Scroll down to step 3: Check <strong>"Use NVIDIA color settings"</strong> ➔ Set <em>Output dynamic range</em> to <strong>Full (0–255)</strong>.
                            <br/><br/>
                            Fixes Windows treating monitors as HDMI TVs with washed-out, limited 16–235 black levels.
                        </p>
                    </div>
                </div>
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
                    <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="irm https://christitus.com/win | iex">Copy Command</button>
                </div>
                <pre class="terminal-code-body"><code>irm https://christitus.com/win | iex</code></pre>
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
                            <span class="pill-badge" style="font-size:0.65rem">15 Items</span>
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
                            <span class="pill-badge" style="font-size:0.65rem">11 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-preferences" style="display: none;"></div>
                    </div>

                    <div class="ctt-accordion" id="acc-ctt-features" style="margin-top:10px;">
                        <button type="button" class="ctt-accordion-header" data-target="ctt-box-features">
                            <div class="acc-title-group">
                                <span class="acc-chevron">▸</span>
                                <span>Config Tab ➔ Features (.NET, DirectPlay &amp; WSL)</span>
                            </div>
                            <span class="pill-badge" style="font-size:0.65rem">6 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-features" style="display: none;"></div>
                    </div>

                    <div class="ctt-section-container" style="margin-top:10px;">
                        <div class="ctt-section-title">
                            <span>DNS Benchmark (UDP Port 53 Latency Test)</span>
                            <span class="pill-badge" style="font-size:0.65rem">Benchmark Script</span>
                        </div>
                        <p style="font-size:0.74rem; color:var(--text-secondary); margin:4px 0 6px 0; line-height:1.45;">
                            Run this script in PowerShell to test your actual UDP latency across the top 6 resolvers:
                        </p>

                        <div class="terminal-code-window">
                            <div class="terminal-bar">
                                <div class="terminal-badge">
                                    <span class="terminal-dot"></span>
                                    <span class="terminal-title">PowerShell (Admin) · DNS Benchmark</span>
                                </div>
                                <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="$s=@([PSCustomObject]@{N='Cloudflare';I='1.1.1.1'},[PSCustomObject]@{N='Quad9';I='9.9.9.9'},[PSCustomObject]@{N='Google';I='8.8.8.8'},[PSCustomObject]@{N='OpenDNS';I='208.67.222.222'},[PSCustomObject]@{N='AdGuard';I='94.140.14.14'},[PSCustomObject]@{N='Control D';I='76.76.2.0'}); $d=@('cloudflare.com','steampowered.com','google.com','microsoft.com','riotgames.com'); Write-Host '--- RUNNING DNS BENCHMARK OVER RAW UDP ---' -ForegroundColor Cyan; $res=foreach($srv in $s){ $times=@(); for($i=0;$i -lt 3;$i++){ foreach($dom in $d){ try{ $sw=[System.Diagnostics.Stopwatch]::StartNew(); $null=Resolve-DnsName -Name $dom -Server $srv.I -Type A -QuickTimeout -DnsOnly -ErrorAction Stop; $sw.Stop(); $times+=$sw.Elapsed.TotalMilliseconds }catch{} } }; $avg=if($times.Count -gt 0){[Math]::Round(($times | Measure-Object -Average).Average, 1)}else{999}; [PSCustomObject]@{ Provider=$srv.N; IP=$srv.I; 'Avg(ms)'=$avg } }; $res | Sort-Object 'Avg(ms)' | Format-Table -AutoSize">Copy Benchmark</button>
                            </div>
                            <pre class="terminal-code-body"><code>$s=@([PSCustomObject]@{N='Cloudflare';I='1.1.1.1'},[PSCustomObject]@{N='Quad9';I='9.9.9.9'},[PSCustomObject]@{N='Google';I='8.8.8.8'},[PSCustomObject]@{N='OpenDNS';I='208.67.222.222'},[PSCustomObject]@{N='AdGuard';I='94.140.14.14'},[PSCustomObject]@{N='Control D';I='76.76.2.0'}); $d=@('cloudflare.com','steampowered.com','google.com','microsoft.com','riotgames.com'); ... # Resolves and ranks fastest DNS</code></pre>
                        </div>

                        <div class="dns-static-grid" style="margin-top:8px;">
                            <div class="dns-static-card fastest">
                                <div class="dns-tile-top">
                                    <strong style="color:var(--text-primary)">1. Cloudflare (1.1.1.1)</strong>
                                    <span class="pill-badge" style="font-size:0.65rem">Lowest Gaming Ping</span>
                                </div>
                                <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0;">
                                    Consistently ranks #1 on DNSPerf worldwide. Fastest query turnaround, zero logs, pure throughput for gaming.
                                </p>
                            </div>
                            <div class="dns-static-card">
                                <div class="dns-tile-top">
                                    <strong style="color:var(--text-primary)">2. Quad9 (9.9.9.9)</strong>
                                    <span class="pill-badge" style="font-size:0.65rem">Malware Blocking</span>
                                </div>
                                <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0;">
                                    Operated by an independent Swiss non-profit. Blocks malicious phishing and malware domains at the resolution layer.
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
                <strong style="color:var(--text-primary)">Step 1: Calibrated Balanced Power Script (Silent Idle, Peak Boost):</strong>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:0;">
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
                    <div class="code-header-flex">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy="powercfg -restoredefaultschemes; powercfg /hibernate on">Copy Revert</button>
                    </div>
                    <span class="revert-text">Restores standard Windows default power profiles and re-enables hibernation: <code>powercfg -restoredefaultschemes; powercfg /hibernate on</code></span>
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
                    <span class="revert-text">Open <code>MSI_util_v3.exe</code> as Admin, uncheck the MSI box for the device, set Interrupt Priority back to <strong>Undefined</strong>, and click <strong>Apply</strong>.</span>
                </div>
            </div>

            <!-- STEP 3: NETWORK ADAPTER -->
            <div class="step-content-box">
                <strong style="color:var(--text-primary)">Step 3: Network Adapter Hardware Optimization (Kill Packet Sleep):</strong>
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
                <strong style="color:var(--text-primary)">Step 4: Disable MMCSS Network Throttling &amp; System CPU Reservation:</strong>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    <strong>Why use it:</strong> By default, Windows Multimedia Class Scheduler Service (MMCSS) throttles non-multimedia network packets by up to 20% whenever an audio or media application is active, and reserves 20% of CPU time for background Windows services. Setting <code>NetworkThrottlingIndex</code> to <code>0xFFFFFFFF</code> (disabled) and <code>SystemResponsiveness</code> to <code>0</code> eliminates packet throttling during online gaming and audio streaming.
                </p>
                <div class="terminal-code-window" style="margin-top:6px;">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">PowerShell (Admin) · MMCSS Fix</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="reg add &quot;HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Multimedia\\\\SystemProfile&quot; /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f; reg add &quot;HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Multimedia\\\\SystemProfile&quot; /v SystemResponsiveness /t REG_DWORD /d 0 /f">Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>reg add "HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Multimedia\\\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f; reg add "HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Multimedia\\\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f</code></pre>
                </div>
                <div class="revert-box" style="margin-top:6px;">
                    <div class="code-header-flex">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy="reg add &quot;HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Multimedia\\\\SystemProfile&quot; /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f; reg add &quot;HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Multimedia\\\\SystemProfile&quot; /v SystemResponsiveness /t REG_DWORD /d 20 /f">Copy Revert</button>
                    </div>
                    <span class="revert-text">Restores standard Windows default values (Index: 10, Responsiveness: 20): <code>reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 20 /f</code></span>
                </div>
            </div>

            <!-- STEP 5: GAME DVR -->
            <div class="step-content-box">
                <strong style="color:var(--text-primary)">Step 5: Disable Game DVR Background Recording:</strong>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    <strong>Why use it:</strong> Windows background Game DVR silently records gameplay clips in a continuous buffer, utilizing GPU encoder hardware and CPU cycles. Turning it off frees up hardware video encoder bandwidth and prevents micro-stutters during heavy gameplay.
                </p>
                <div class="terminal-code-window" style="margin-top:6px;">
                    <div class="terminal-bar">
                        <div class="terminal-badge">
                            <span class="terminal-dot"></span>
                            <span class="terminal-title">PowerShell (Admin) · Game DVR Kill</span>
                        </div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="reg add &quot;HKCU\\\\System\\\\GameConfigStore&quot; /v GameDVR_Enabled /t REG_DWORD /d 0 /f; reg add &quot;HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\GameDVR&quot; /v AllowGameDVR /t REG_DWORD /d 0 /f">Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>reg add "HKCU\\\\System\\\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f; reg add "HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f</code></pre>
                </div>
                <div class="revert-box" style="margin-top:6px;">
                    <div class="code-header-flex">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy="reg add &quot;HKCU\\\\System\\\\GameConfigStore&quot; /v GameDVR_Enabled /t REG_DWORD /d 1 /f; reg delete &quot;HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\GameDVR&quot; /v AllowGameDVR /f">Copy Revert</button>
                    </div>
                    <span class="revert-text">Re-enables Windows background game recording: <code>reg add "HKCU\\System\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 1 /f; reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /f</code></span>
                </div>
            </div>

            <!-- STEP 6: MISC POLISH WITH REVERT COMMANDS -->
            <div class="latency-grid">
                <div class="latency-item">
                    <strong style="color:var(--text-primary)">Step 6A: MenuShowDelay (10ms):</strong>
                    <p style="font-size:0.73rem; margin:4px 0 6px 0; color:var(--text-secondary);">
                        Eliminates the sluggish 400ms delay before submenus expand.
                    </p>
                    <div class="terminal-code-window">
                        <div class="terminal-bar">
                            <div class="terminal-badge"><span class="terminal-dot"></span><span>10ms Delay</span></div>
                            <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="reg add &quot;HKCU\\\\Control Panel\\\\Desktop&quot; /v MenuShowDelay /t REG_SZ /d 10 /f">Copy</button>
                        </div>
                        <pre class="terminal-code-body"><code>reg add "HKCU\\\\Control Panel\\\\Desktop" /v MenuShowDelay /t REG_SZ /d 10 /f</code></pre>
                    </div>
                    <div style="margin-top:6px; font-size:0.7rem; color:var(--text-muted)">
                        <strong>Revert:</strong> <code>reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 400 /f</code>
                    </div>
                </div>

                <div class="latency-item">
                    <strong style="color:var(--text-primary)">Step 6B: Audio Resampling Alignment (48,000 Hz):</strong>
                    <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                        Almost all games render audio natively at 48 kHz. Setting your DAC or headset to 48 kHz avoids Windows software resampling overhead.
                        <br/><br/>
                        Press <kbd>Win</kbd> + <kbd>R</kbd> ➔ <code>mmsys.cpl</code> ➔ Properties ➔ Advanced ➔ set <strong>24-bit, 48000 Hz</strong>.
                    </p>
                </div>

                <div class="latency-item">
                    <strong style="color:var(--text-primary)">Step 6C: NVMe TRIM &amp; Game De-Indexing:</strong>
                    <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                        1. <strong>TRIM Check:</strong> Run <code>fsutil behavior query DisableDeleteNotify</code> (should be 0).<br/>
                        2. <strong>De-Index:</strong> In Windows Indexing Options, uncheck game installation drives so search indexing daemons don't scan game folders during gameplay.
                    </p>
                </div>

                <div class="latency-item">
                    <strong style="color:var(--text-primary)">Step 6D: Disable NTFS 8.3 &amp; LastAccess:</strong>
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
                    <strong style="color:var(--text-primary)">Step 6E: Contiguous Fixed Pagefile:</strong>
                    <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                        Fixing the pagefile size to a static 8192 MB (8 GB) prevents dynamic pagefile fragmentation and storage allocation hitches.<br/><br/>
                        Press <kbd>Win</kbd> + <kbd>R</kbd> ➔ <code>sysdm.cpl</code> ➔ Performance Settings ➔ Advanced ➔ Virtual Memory ➔ Set Initial &amp; Maximum to <strong>8192 MB</strong>.
                    </p>
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
                    <li><code>%localappdata%\\CrashDumps</code> ➔ Delete all contents (Frees gigabytes of old crash dumps).</li>
                    <li><code>%temp%</code> and <code>C:\\Windows\\Temp</code> ➔ Delete all contents (Skip files in use).</li>
                    <li><code>%localappdata%\\D3DSCache</code> ➔ Safe to delete if clearing corrupted game DirectX shader caches.</li>
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
