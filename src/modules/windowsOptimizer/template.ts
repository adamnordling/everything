export const WINDOWS_OPTIMIZER_HTML = `
<div class="winopt-container">
    <!-- TOP WORKBENCH HEADER & PROFILE SELECTOR -->
    <div class="card winopt-hero">
        <div class="winopt-hero-left">
            <div class="brand-icon-box" style="background: linear-gradient(135deg, #0284c7 0%, #00dc82 100%)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0b0e14" stroke-width="2.5">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="12 17 2 12 17 22 12"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
            </div>
            <div>
                <h1 style="font-size: 1.15rem; font-weight: 800; margin: 0">Windows Playbook &amp; Hardware Tuning</h1>
                <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0; font-family: var(--font-mono)">
                    Zero-bloat deployment, DDU driver hygiene, BIOS configuration &amp; verified low-latency setup
                </p>
            </div>
        </div>

        <!-- HARDWARE SELECTORS MATRIX (5 TAILORED AXES) -->
        <div class="winopt-profile-selectors">
            <div class="selector-field">
                <label for="winopt-os-select">OS TARGET</label>
                <select id="winopt-os-select" class="select-mini-tz">
                    <option value="win10" selected>Windows 10 (22H2 / LTSC)</option>
                    <option value="win11">Windows 11 (23H2 / 24H2)</option>
                </select>
            </div>

            <div class="selector-field">
                <label for="winopt-mobo-select">MOTHERBOARD VENDOR</label>
                <select id="winopt-mobo-select" class="select-mini-tz">
                    <option value="asus" selected>ASUS / ROG</option>
                    <option value="msi">MSI (Micro-Star)</option>
                    <option value="gigabyte">Gigabyte / AORUS</option>
                    <option value="asrock">ASRock</option>
                    <option value="oem">OEM / Dell / HP / Lenovo / Other</option>
                </select>
            </div>

            <div class="selector-field">
                <label for="winopt-cpu-select">CPU ARCHITECTURE</label>
                <select id="winopt-cpu-select" class="select-mini-tz">
                    <option value="intel-legacy" selected>Intel Core Monolithic (6th-11th Gen, e.g. i7-9700K)</option>
                    <option value="intel-raptor">Intel Core 13th/14th Gen Raptor Lake (0x12B Microcode)</option>
                    <option value="intel-alder">Intel Core 12th Gen Alder Lake (Hybrid P/E)</option>
                    <option value="amd-x3d-single">AMD Ryzen Single-CCD X3D (5800X3D, 7800X3D, 9800X3D)</option>
                    <option value="amd-x3d-dual">AMD Ryzen Dual-CCD X3D (7900X3D, 7950X3D, 9950X3D)</option>
                    <option value="amd-standard">AMD Ryzen Standard (Non-X3D AM4 / AM5)</option>
                </select>
            </div>

            <div class="selector-field" style="min-width: 200px;">
                <label for="winopt-gpu-select">EXACT GRAPHICS CARD</label>
                <select id="winopt-gpu-select" class="select-mini-tz" style="width: 100%"></select>
            </div>

            <div class="selector-field" style="min-width: 220px;">
                <label for="winopt-ram-select">MEMORY (RAM) PROFILE</label>
                <select id="winopt-ram-select" class="select-mini-tz" style="width: 100%"></select>
            </div>
        </div>
    </div>

    <!-- HARDWARE DETECTIVE TERMINAL SCANNER -->
    <div class="card spec-scanner-card">
        <div class="spec-scanner-header">
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="pill-badge" style="color:var(--accent-mint)">HARDWARE DETECTIVE</span>
                <span style="font-size:0.82rem; font-weight:700; color:var(--text-primary)">Don't know your exact specs? Run this 1-line diagnostic:</span>
            </div>
            <span style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono)">Detects Mobo, CPU, GPU &amp; Dual-Channel RAM speed</span>
        </div>

        <div class="code-copy-row" style="margin-top:6px;">
            <code class="font-mono">$m=(Get-CimInstance Win32_BaseBoard | ForEach-Object { $_.Manufacturer+' '+$_.Product }); $c=(Get-CimInstance Win32_Processor).Name.Trim(); $g=(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' / '; $mem=Get-CimInstance Win32_PhysicalMemory; $gb=[Math]::Round(($mem | Measure-Object Capacity -Sum).Sum / 1GB); $spd=($mem | Select-Object -First 1).ConfiguredClockSpeed; $stk=($mem | Measure-Object).Count; $ddr=if($spd -gt 4500){'DDR5'}elseif($spd -gt 2000){'DDR4'}else{'DDR3'}; $ch=if($stk -gt 1){'Dual-Channel ('+$stk+' sticks)'}else{'SINGLE-CHANNEL ALERT (1 stick)'}; $out='MOBO: '+$m+' | CPU: '+$c+' | GPU: '+$g+' | RAM: '+$gb+'GB '+$ddr+' @ '+$spd+'MHz ['+$ch+']'; Write-Host ''; Write-Host $out -ForegroundColor Green; Set-Clipboard -Value $out</code>
            <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="$m=(Get-CimInstance Win32_BaseBoard | ForEach-Object { $_.Manufacturer+' '+$_.Product }); $c=(Get-CimInstance Win32_Processor).Name.Trim(); $g=(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' / '; $mem=Get-CimInstance Win32_PhysicalMemory; $gb=[Math]::Round(($mem | Measure-Object Capacity -Sum).Sum / 1GB); $spd=($mem | Select-Object -First 1).ConfiguredClockSpeed; $stk=($mem | Measure-Object).Count; $ddr=if($spd -gt 4500){'DDR5'}elseif($spd -gt 2000){'DDR4'}else{'DDR3'}; $ch=if($stk -gt 1){'Dual-Channel ('+$stk+' sticks)'}else{'SINGLE-CHANNEL ALERT (1 stick)'}; $out='MOBO: '+$m+' | CPU: '+$c+' | GPU: '+$g+' | RAM: '+$gb+'GB '+$ddr+' @ '+$spd+'MHz ['+$ch+']'; Write-Host ''; Write-Host $out -ForegroundColor Green; Set-Clipboard -Value $out">Copy Command</button>
        </div>

        <div class="spec-paste-bar">
            <input type="text" id="winopt-spec-paste-input" class="spec-paste-field" placeholder="Paste output here (e.g. MOBO: ASUS ROG STRIX | CPU: Intel Core i7-9700K | GPU: NVIDIA GeForce GTX 1070 | RAM: 16GB DDR4 @ 3200MHz [Dual-Channel])..." />
            <button type="button" id="winopt-spec-parse-btn" class="btn-action-pill" style="white-space:nowrap">Auto-Fill Menu</button>
            <span id="winopt-spec-parse-status" style="font-size:0.75rem; font-family:var(--font-mono)"></span>
        </div>
    </div>

    <!-- BENCHMARK LAB -->
    <div class="card spec-scanner-card" style="border-color: rgba(56, 189, 248, 0.4); background: linear-gradient(135deg, rgba(56, 189, 248, 0.04) 0%, rgba(0, 220, 130, 0.04) 100%);">
        <div class="spec-scanner-header">
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="pill-badge" style="color:var(--accent-sky)">BENCHMARK LAB</span>
                <span style="font-size:0.82rem; font-weight:700; color:var(--text-primary)">Quantify Your Improvement (Auto-Comparing Telemetry):</span>
            </div>
            <span style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono)">Saves Before &amp; After to Desktop</span>
        </div>
        <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
            Run this command in PowerShell (Admin). On your first run, it saves a baseline <code>Windows-Benchmark-Before.txt</code> on your Desktop. 
            Complete Phase 1 through Phase 7, then run it again. It automatically generates a side-by-side scorecard comparing active processes, threads, handles, and RAM usage:
        </p>

        <div class="code-action-box dns-code-box" style="margin-top:6px;">
            <div class="code-copy-row">
                <code class="font-mono dns-scroll-code">&amp; { $desktop=[Environment]::GetFolderPath('Desktop'); $beforePath=Join-Path $desktop 'Windows-Benchmark-Before.clixml'; $afterPath=Join-Path $desktop 'Windows-Benchmark-After.clixml'; $reportPath=Join-Path $desktop 'Windows-Benchmark-Report.txt'; $procs=Get-Process; $procCount=$procs.Count; $threadCount=($procs.Threads).Count; $handleCount=($procs | Measure-Object -Property Handles -Sum).Sum; $os=Get-CimInstance Win32_OperatingSystem; $totalRamMB=[Math]::Round($os.TotalVisibleMemorySize/1024,0); $freeRamMB=[Math]::Round($os.FreePhysicalMemory/1024,0); $usedRamMB=$totalRamMB-$freeRamMB; $ramPct=[Math]::Round(($usedRamMB/$totalRamMB)*100,1); $cpu=(Get-CimInstance Win32_Processor).Name.Trim(); $gpu=(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' / '; $nonMsServices=Get-CimInstance Win32_Service | Where-Object { $_.State -eq 'Running' -and $_.PathName -notmatch 'Windows|System32' }; $serviceCount=($nonMsServices | Measure-Object).Count; $dwm=Get-Process dwm -ErrorAction SilentlyContinue; $dwmMemMB=if($dwm){[Math]::Round($dwm.WorkingSet64/1MB,1)}else{0}; $snapshot=[PSCustomObject]@{ Timestamp=(Get-Date).ToString('yyyy-MM-dd HH:mm:ss'); CPU=$cpu; GPU=$gpu; Active_Processes=$procCount; Active_Threads=$threadCount; Open_Handles=$handleCount; Used_RAM_MB=$usedRamMB; Free_RAM_MB=$freeRamMB; RAM_Usage_Pct=$ramPct; Non_MS_Services=$serviceCount; DWM_RAM_MB=$dwmMemMB }; if(-not(Test-Path $beforePath)){ $snapshot | Export-Clixml -Path $beforePath; Write-Host ''; Write-Host '[STEP 1 COMPLETE: BASELINE SAVED TO DESKTOP]' -ForegroundColor Green; $snapshot | Format-List; Write-Host ''; Write-Host 'Complete Phase 1 to Phase 7, then run this command again to see your scorecard!' -ForegroundColor Cyan; Write-Host '' } else { $before=Import-Clixml -Path $beforePath; $snapshot | Export-Clixml -Path $afterPath; $pDiff=$snapshot.Active_Processes-$before.Active_Processes; $tDiff=$snapshot.Active_Threads-$before.Active_Threads; $hDiff=$snapshot.Open_Handles-$before.Open_Handles; $rDiff=$snapshot.Used_RAM_MB-$before.Used_RAM_MB; $sDiff=$snapshot.Non_MS_Services-$before.Non_MS_Services; $dDiff=$snapshot.DWM_RAM_MB-$before.DWM_RAM_MB; $comp=@( [PSCustomObject]@{Metric='Active Processes';Before=$before.Active_Processes;After=$snapshot.Active_Processes;Change="$pDiff";Status=if($pDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='Kernel Threads';Before=$before.Active_Threads;After=$snapshot.Active_Threads;Change="$tDiff";Status=if($tDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='System Handles';Before=$before.Open_Handles;After=$snapshot.Open_Handles;Change="$hDiff";Status=if($hDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='RAM Used (MB)';Before=$before.Used_RAM_MB;After=$snapshot.Used_RAM_MB;Change="$rDiff MB";Status=if($rDiff -le 0){'✓ Freed'}else{'Increased'}}, [PSCustomObject]@{Metric='3rd-Party Services';Before=$before.Non_MS_Services;After=$snapshot.Non_MS_Services;Change="$sDiff";Status=if($sDiff -le 0){'✓ Stripped'}else{'Added'}}, [PSCustomObject]@{Metric='DWM Memory (MB)';Before=$before.DWM_RAM_MB;After=$snapshot.DWM_RAM_MB;Change="$dDiff MB";Status=if($dDiff -le 0){'✓ Lean'}else{'Increased'}} ); Write-Host ''; Write-Host '================== OPTIMIZATION SCORECARD ==================' -ForegroundColor Cyan; $comp | Format-Table -AutoSize; $comp | Out-File -FilePath $reportPath; Write-Host ('[Scorecard saved to: ' + $reportPath + ']'); Write-Host '' } }</code>
                <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="&amp; { $desktop=[Environment]::GetFolderPath('Desktop'); $beforePath=Join-Path $desktop 'Windows-Benchmark-Before.clixml'; $afterPath=Join-Path $desktop 'Windows-Benchmark-After.clixml'; $reportPath=Join-Path $desktop 'Windows-Benchmark-Report.txt'; $procs=Get-Process; $procCount=$procs.Count; $threadCount=($procs.Threads).Count; $handleCount=($procs | Measure-Object -Property Handles -Sum).Sum; $os=Get-CimInstance Win32_OperatingSystem; $totalRamMB=[Math]::Round($os.TotalVisibleMemorySize/1024,0); $freeRamMB=[Math]::Round($os.FreePhysicalMemory/1024,0); $usedRamMB=$totalRamMB-$freeRamMB; $ramPct=[Math]::Round(($usedRamMB/$totalRamMB)*100,1); $cpu=(Get-CimInstance Win32_Processor).Name.Trim(); $gpu=(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' / '; $nonMsServices=Get-CimInstance Win32_Service | Where-Object { $_.State -eq 'Running' -and $_.PathName -notmatch 'Windows|System32' }; $serviceCount=($nonMsServices | Measure-Object).Count; $dwm=Get-Process dwm -ErrorAction SilentlyContinue; $dwmMemMB=if($dwm){[Math]::Round($dwm.WorkingSet64/1MB,1)}else{0}; $snapshot=[PSCustomObject]@{ Timestamp=(Get-Date).ToString('yyyy-MM-dd HH:mm:ss'); CPU=$cpu; GPU=$gpu; Active_Processes=$procCount; Active_Threads=$threadCount; Open_Handles=$handleCount; Used_RAM_MB=$usedRamMB; Free_RAM_MB=$freeRamMB; RAM_Usage_Pct=$ramPct; Non_MS_Services=$serviceCount; DWM_RAM_MB=$dwmMemMB }; if(-not(Test-Path $beforePath)){ $snapshot | Export-Clixml -Path $beforePath; Write-Host ''; Write-Host '[STEP 1 COMPLETE: BASELINE SAVED TO DESKTOP]' -ForegroundColor Green; $snapshot | Format-List; Write-Host ''; Write-Host 'Complete Phase 1 to Phase 7, then run this command again to see your scorecard!' -ForegroundColor Cyan; Write-Host '' } else { $before=Import-Clixml -Path $beforePath; $snapshot | Export-Clixml -Path $afterPath; $pDiff=$snapshot.Active_Processes-$before.Active_Processes; $tDiff=$snapshot.Active_Threads-$before.Active_Threads; $hDiff=$snapshot.Open_Handles-$before.Open_Handles; $rDiff=$snapshot.Used_RAM_MB-$before.Used_RAM_MB; $sDiff=$snapshot.Non_MS_Services-$before.Non_MS_Services; $dDiff=$snapshot.DWM_RAM_MB-$before.DWM_RAM_MB; $comp=@( [PSCustomObject]@{Metric='Active Processes';Before=$before.Active_Processes;After=$snapshot.Active_Processes;Change=&quot;$pDiff&quot;;Status=if($pDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='Kernel Threads';Before=$before.Active_Threads;After=$snapshot.Active_Threads;Change=&quot;$tDiff&quot;;Status=if($tDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='System Handles';Before=$before.Open_Handles;After=$snapshot.Open_Handles;Change=&quot;$hDiff&quot;;Status=if($hDiff -le 0){'✓ Reduced'}else{'Increased'}}, [PSCustomObject]@{Metric='RAM Used (MB)';Before=$before.Used_RAM_MB;After=$snapshot.Used_RAM_MB;Change=&quot;$rDiff MB&quot;;Status=if($rDiff -le 0){'✓ Freed'}else{'Increased'}}, [PSCustomObject]@{Metric='3rd-Party Services';Before=$before.Non_MS_Services;After=$snapshot.Non_MS_Services;Change=&quot;$sDiff&quot;;Status=if($sDiff -le 0){'✓ Stripped'}else{'Added'}}, [PSCustomObject]@{Metric='DWM Memory (MB)';Before=$before.DWM_RAM_MB;After=$snapshot.DWM_RAM_MB;Change=&quot;$dDiff MB&quot;;Status=if($dDiff -le 0){'✓ Lean'}else{'Increased'}} ); Write-Host ''; Write-Host '================== OPTIMIZATION SCORECARD ==================' -ForegroundColor Cyan; $comp | Format-Table -AutoSize; $comp | Out-File -FilePath $reportPath; Write-Host ('[Scorecard saved to: ' + $reportPath + ']'); Write-Host '' } }">Copy Benchmark Script</button>
            </div>
        </div>
    </div>

    <!-- DYNAMIC COMPATIBILITY & HARDWARE ADVISORY -->
    <div id="hw-advisory-banner" class="advisory-container"></div>

    <!-- CHRONOLOGICAL PHASES STREAM -->
    <div class="winopt-steps-grid">
        <!-- PHASE 1: CLEAN INSTALLATION & RUFUS BLUEPRINT -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge" style="color: var(--accent-sky)">PHASE 01</span>
                <span class="step-title" id="p1-iso-title">Clean ISO &amp; Rufus Deployment</span>
            </div>
            <p class="step-desc" id="p1-iso-desc"></p>

            <div class="links-action-bar">
                <a id="p1-iso-link" href="https://www.microsoft.com/software-download/windows10ISO" target="_blank" rel="noopener" class="link-chip-large">
                    Download ISO ↗
                </a>
                <a href="https://rufus.ie/" target="_blank" rel="noopener" class="link-chip-large highlight">
                    Download Rufus (v4+) Official ↗
                </a>
            </div>

            <div class="step-content-box">
                <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
                    Step 1A: Exact Rufus Configuration (USB Preparation):
                </div>
                <div id="p1-rufus-options"></div>
            </div>

            <!-- SHIFT + F10 CLEAN WIPE PROTOCOL -->
            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:var(--accent-mint)">Step 1B: Boot USB &amp; 100% Clean Drive Wipe (Shift + F10):</strong>
                    <span class="pill-badge" style="font-size:0.6rem">Purges Dirty OEM Partitions</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                    Plug in your Rufus USB and reboot. On the very first screen of the Windows installer (Language &amp; Region selection), press <kbd>Shift</kbd> + <kbd>F10</kbd> to open Command Prompt. 
                    Run this sequence to wipe residual OEM recovery partitions, leftover bootloaders, and format a clean GPT disk:
                </p>
                <div class="code-action-box" style="margin-top:6px;">
                    <div class="code-copy-row">
                        <code class="font-mono">diskpart ➔ list disk ➔ select disk 0 ➔ clean ➔ convert gpt ➔ exit ➔ exit</code>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="diskpart; list disk; select disk 0; clean; convert gpt; exit; exit">Copy Sequence</button>
                    </div>
                </div>
                <p style="font-size:0.72rem; color:var(--text-muted); margin:4px 0 0 0;">
                    <em>(Verify disk number with <code>list disk</code> — make sure you select your target SSD by its size).</em> Close the CMD window and proceed with the installation.
                </p>
            </div>

            <div class="step-content-box" id="p1-oobe-guide"></div>
        </div>

        <!-- PHASE 2: BIOS UPDATE & MOTHERBOARD TUNING -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge" style="color: var(--accent-amber)">PHASE 02</span>
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
                <span class="pill-badge" style="color: var(--accent-mint)">PHASE 03</span>
                <span class="step-title">Safety Nets, Checkpoints &amp; Driver Lock</span>
            </div>
            <p class="step-desc">
                Create an instant system restore checkpoint and block Windows Update from replacing your clean display drivers with outdated generic OEM drivers.
            </p>

            <div class="action-revert-pair">
                <div class="code-action-box">
                    <div class="code-header-flex">
                        <span class="code-title">Action 1: Enable &amp; Create Initial System Restore Checkpoint (Run in PowerShell as Admin):</span>
                        <span class="pill-badge" style="font-size:0.6rem">Safe</span>
                    </div>
                    <div class="code-copy-row">
                        <code class="font-mono">Enable-ComputerRestore -Drive "C:\\"; Checkpoint-Computer -Description "FreshInstall-Clean" -RestorePointType "MODIFY_SETTINGS"</code>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="Enable-ComputerRestore -Drive &quot;C:\\&quot;; Checkpoint-Computer -Description &quot;FreshInstall-Clean&quot; -RestorePointType &quot;MODIFY_SETTINGS&quot;">Copy</button>
                    </div>
                    <span class="code-explanation">
                        <strong>What it does:</strong> Enables Shadow Copy on drive C: and snapshots your clean system state.
                    </span>
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
                <div class="code-action-box">
                    <div class="code-header-flex">
                        <span class="code-title">Action 2: Block Windows Update from Overwriting GPU &amp; Chipset Drivers:</span>
                        <span class="pill-badge" style="font-size:0.6rem">Recommended</span>
                    </div>
                    <div class="code-copy-row">
                        <code class="font-mono">reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f</code>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="reg add &quot;HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate&quot; /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f">Copy</button>
                    </div>
                    <span class="code-explanation">
                        <strong>What it does:</strong> Windows Update will download security patches, but will NEVER overwrite your clean GPU or chipset drivers.
                    </span>
                </div>

                <div class="revert-box">
                    <div class="code-header-flex">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy="reg delete &quot;HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate&quot; /v ExcludeWUDriversInQualityUpdate /f">Copy Revert Command</button>
                    </div>
                    <div class="code-copy-row" style="margin-top:4px">
                        <code class="font-mono revert-code">reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /f</code>
                    </div>
                    <span class="revert-text">
                        Removes the policy key and restores standard Windows Update automated driver delivery.
                    </span>
                </div>
            </div>
        </div>

        <!-- PHASE 4: DDU DEEP CLEAN, DRIVERS & GRAPHICS CALIBRATION -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge" style="color: var(--accent-rose)">PHASE 04</span>
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
                        <a href="https://www.techpowerup.com/download/techpowerup-nvcleanstall/" target="_blank" rel="noopener" class="link-chip">Download NVCleanstall ↗</a>
                    </div>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin:0;">
                    Download the driver installer executable (<code>.exe</code>) matched to your GPU below. Save DDU and the driver installer to your local drive or an external USB stick.
                </p>
            </div>

            <div class="step-content-box">
                <strong style="color:var(--accent-mint)">Step 2: DDU Safe Mode Deep Clean Protocol:</strong>
                <ol class="ordered-step-list">
                    <li><strong>DISCONNECT FROM THE INTERNET:</strong> Unplug Ethernet or disable Wi-Fi. (Do not reconnect until Phase 5).</li>
                    <li><strong>Reboot into Safe Mode:</strong> Hold <kbd>Shift</kbd> while clicking Restart in the Start Menu ➔ Troubleshoot ➔ Advanced Options ➔ Startup Settings ➔ Restart ➔ Press <kbd>4</kbd> (Enable Safe Mode).</li>
                    <li><strong>Launch DDU in Safe Mode:</strong>
                        <ul class="clean-bullet-list" style="margin-top:4px;">
                            <li><strong>Option A (If changing GPU vendors or cleaning iGPU):</strong> Select device type <strong>GPU</strong> ➔ Select <strong>Intel</strong> ➔ Click <em>"Clean and do NOT restart"</em> (removes integrated display drivers that cause DWM hitching).</li>
                            <li><strong>Option B:</strong> Select device type <strong>GPU</strong> ➔ Select your vendor (NVIDIA / AMD) ➔ Click <strong>"Clean and Restart"</strong>.</li>
                        </ul>
                    </li>
                    <li>Your PC reboots into normal Windows (with generic basic display drivers). <strong>Stay offline.</strong> Install your downloaded driver package.</li>
                </ol>
            </div>

            <div id="hw-dynamic-content" class="step-content-box"></div>

            <div class="step-content-box" style="margin-top:4px;">
                <strong style="color:var(--accent-sky)">Step 3: Post-Install Graphics &amp; Display Calibration:</strong>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                    Once the clean driver is installed and you reboot, apply these mandatory control panel settings:
                </p>

                <div class="latency-grid" style="margin-top:8px;">
                    <div class="latency-item">
                        <strong style="color:var(--accent-amber)">1. Escape the 60Hz "Ultra HD" Trap:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            In NVIDIA Control Panel ➔ <em>Change resolution</em>: Do <strong>NOT</strong> pick resolutions from the top "Ultra HD, HD, SD" list (they cap monitors at 60Hz!).
                            <br/><br/>
                            Scroll down past Ultra HD to the <strong>"PC"</strong> section (e.g. <code>PC ➔ 1920x1080</code> or <code>2560x1440</code>). Select your native resolution here to unlock your monitor's true <strong>144Hz, 165Hz, or 240Hz+</strong>.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--accent-mint)">2. Set Shader Cache Size to 10 GB:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            In NVIDIA Control Panel ➔ <em>Manage 3D settings</em> ➔ set <strong>Shader Cache Size</strong> to <strong>10 GB</strong> (instead of Driver Default).
                            <br/><br/>
                            Prevents modern DirectX 12 games (CoD, Fortnite, Apex) from continually re-compiling shaders during firefights, eliminating frame stutter.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--accent-sky)">3. The Blur Busters Low-Latency Formula:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            • <strong>G-Sync / FreeSync:</strong> Enabled (Full Screen).
                            <br/>• <strong>NVCP Vertical Sync:</strong> <strong>ON</strong> (in driver, NOT in-game).
                            <br/>• <strong>In-Game V-Sync:</strong> <strong>OFF</strong>.
                            <br/>• <strong>Frame Cap:</strong> Cap <strong>3 to 4 FPS below monitor Hz</strong> (141 FPS on 144Hz; 237 FPS on 240Hz). Keeps frames inside the zero-lag G-Sync window.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--accent-violet)">4. Recommended 3D Driver Settings:</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            • <strong>Power Management Mode:</strong> <strong>Normal</strong> (prevents 60W idle draw and high fan noise).
                            <br/>• <strong>Low Latency Mode:</strong> <strong>On</strong> (In games with NVIDIA Reflex, set in-game Reflex to <em>On + Boost</em>).
                            <br/>• <strong>Texture Filtering - Quality:</strong> <strong>High Performance</strong>.
                        </p>
                    </div>

                    <div class="latency-item">
                        <strong style="color:var(--accent-mint)">5. Full Output Dynamic Range (0–255):</strong>
                        <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                            In NVIDIA Control Panel ➔ <em>Change resolution</em> ➔ Scroll down to step 3: Check <strong>"Use NVIDIA color settings"</strong> ➔ Set <em>Output dynamic range</em> to <strong>Full (0–255)</strong>.
                            <br/><br/>
                            *(Fixes Windows treating monitors as HDMI TVs with washed-out, limited 16–235 black levels).*
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- PHASE 5: CONTROLLED DEBLOAT & CHRIS TITUS WINUTIL BLUEPRINT -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge" style="color: var(--accent-violet)">PHASE 05</span>
                <span class="step-title">Chris Titus WinUtil Companion Blueprint</span>
            </div>
            <p class="step-desc">
                Connect your Ethernet cable now. Launch CTT WinUtil in PowerShell, then click any section below to expand the exact buttons to mirror.
                <strong>Green [✓ SET ON]</strong> buttons are safe to check, <strong>Red [✕ LEAVE OFF]</strong> must stay unchecked, and <strong>Yellow [⚡ OPTIONAL]</strong> are for specific setups.
            </p>

            <div class="code-action-box">
                <span class="code-title">1. Launch CTT WinUtil in PowerShell (Run as Administrator):</span>
                <div class="code-copy-row">
                    <code class="font-mono">irm https://christitus.com/win | iex</code>
                    <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="irm https://christitus.com/win | iex">Copy Command</button>
                </div>
            </div>

            <div class="ctt-workbench-layout">
                <div class="ctt-column">
                    <div class="ctt-accordion" id="acc-ctt-essential">
                        <button type="button" class="ctt-accordion-header green" data-target="ctt-box-essential">
                            <div class="acc-title-group">
                                <span class="acc-chevron">▸</span>
                                <span>Essential Tweaks (Exact CTT Mirror)</span>
                            </div>
                            <span class="pill-badge" style="font-size:0.6rem">18 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-essential" style="display: none;"></div>
                    </div>

                    <div class="ctt-accordion" id="acc-ctt-advanced" style="margin-top:12px;">
                        <button type="button" class="ctt-accordion-header amber" data-target="ctt-box-advanced">
                            <div class="acc-title-group">
                                <span class="acc-chevron">▸</span>
                                <span>Advanced Tweaks — CAUTION</span>
                            </div>
                            <span class="pill-badge" style="font-size:0.6rem; color:var(--accent-amber)">15 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-advanced" style="display: none;"></div>
                    </div>
                </div>

                <div class="ctt-column">
                    <div class="ctt-accordion" id="acc-ctt-preferences">
                        <button type="button" class="ctt-accordion-header sky" data-target="ctt-box-preferences">
                            <div class="acc-title-group">
                                <span class="acc-chevron">▸</span>
                                <span>Customize Preferences (Toggles)</span>
                            </div>
                            <span class="pill-badge" style="font-size:0.6rem">11 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-preferences" style="display: none;"></div>
                    </div>

                    <div class="ctt-accordion" id="acc-ctt-features" style="margin-top:12px;">
                        <button type="button" class="ctt-accordion-header mint" data-target="ctt-box-features">
                            <div class="acc-title-group">
                                <span class="acc-chevron">▸</span>
                                <span>Config Tab ➔ Features (.NET, DirectPlay &amp; WSL)</span>
                            </div>
                            <span class="pill-badge" style="font-size:0.6rem">6 Items</span>
                        </button>
                        <div class="ctt-accordion-body" id="ctt-box-features" style="display: none;"></div>
                    </div>

                    <div class="ctt-section-container" style="margin-top:12px;">
                        <div class="ctt-section-title violet">
                            <span>DNS - Set to: (Native Port 53 Latency Benchmark)</span>
                            <span class="pill-badge" style="font-size:0.6rem">PowerShell Script</span>
                        </div>
                        <p style="font-size:0.74rem; color:var(--text-secondary); margin:4px 0 6px 0; line-height:1.45;">
                            Run this script in PowerShell to test your actual UDP latency across the top 6 resolvers (Cloudflare, Quad9, Google, OpenDNS, AdGuard, Control D):
                        </p>

                        <div class="code-action-box dns-code-box">
<div class="code-copy-row">
    <code class="font-mono dns-scroll-code">$s=@([PSCustomObject]@{N='Cloudflare';I='1.1.1.1'},[PSCustomObject]@{N='Quad9';I='9.9.9.9'},[PSCustomObject]@{N='Google';I='8.8.8.8'},[PSCustomObject]@{N='OpenDNS';I='208.67.222.222'},[PSCustomObject]@{N='AdGuard';I='94.140.14.14'},[PSCustomObject]@{N='Control D';I='76.76.2.0'}); $d=@('cloudflare.com','steampowered.com','google.com','microsoft.com','riotgames.com'); Write-Host ''; Write-Host '--- RUNNING 15-SAMPLE DNS BENCHMARK OVER RAW UDP ---' -ForegroundColor Cyan; $res=foreach($srv in $s){ Write-Host ('Testing ' + $srv.N + '...') -NoNewline -ForegroundColor Gray; try{$null=Resolve-DnsName -Name 'cloudflare.com' -Server $srv.I -QuickTimeout -DnsOnly -ErrorAction Stop}catch{} $times=@(); for($i=0;$i -lt 3;$i++){ foreach($dom in $d){ try{ $sw=[System.Diagnostics.Stopwatch]::StartNew(); $null=Resolve-DnsName -Name $dom -Server $srv.I -Type A -QuickTimeout -DnsOnly -ErrorAction Stop; $sw.Stop(); $times+=$sw.Elapsed.TotalMilliseconds }catch{} } }; Write-Host ' Done.' -ForegroundColor Green; if($times.Count -gt 4){ $sorted=$times | Sort-Object; $trimmed=$sorted[1..($sorted.Count-2)]; $avg=[Math]::Round(($trimmed | Measure-Object -Average).Average, 1); $min=[Math]::Round($sorted[0], 1); $max=[Math]::Round($sorted[-1], 1) } elseif($times.Count -gt 0){ $avg=[Math]::Round(($times | Measure-Object -Average).Average, 1); $min=$avg; $max=$avg } else { $avg=999; $min=999; $max=999 }; [PSCustomObject]@{ Provider=$srv.N; IP=$srv.I; 'Avg(ms)'=$avg; 'Min(ms)'=$min; 'Max(ms)'=$max } }; Write-Host ''; $res | Sort-Object 'Avg(ms)' | Format-Table -AutoSize; Write-Host '[Choose the #1 lowest Avg(ms) in your CTT DNS dropdown]'; Write-Host ''</code>
    <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="$s=@([PSCustomObject]@{N='Cloudflare';I='1.1.1.1'},[PSCustomObject]@{N='Quad9';I='9.9.9.9'},[PSCustomObject]@{N='Google';I='8.8.8.8'},[PSCustomObject]@{N='OpenDNS';I='208.67.222.222'},[PSCustomObject]@{N='AdGuard';I='94.140.14.14'},[PSCustomObject]@{N='Control D';I='76.76.2.0'}); $d=@('cloudflare.com','steampowered.com','google.com','microsoft.com','riotgames.com'); Write-Host ''; Write-Host '--- RUNNING 15-SAMPLE DNS BENCHMARK OVER RAW UDP ---' -ForegroundColor Cyan; $res=foreach($srv in $s){ Write-Host ('Testing ' + $srv.N + '...') -NoNewline -ForegroundColor Gray; try{$null=Resolve-DnsName -Name 'cloudflare.com' -Server $srv.I -QuickTimeout -DnsOnly -ErrorAction Stop}catch{} $times=@(); for($i=0;$i -lt 3;$i++){ foreach($dom in $d){ try{ $sw=[System.Diagnostics.Stopwatch]::StartNew(); $null=Resolve-DnsName -Name $dom -Server $srv.I -Type A -QuickTimeout -DnsOnly -ErrorAction Stop; $sw.Stop(); $times+=$sw.Elapsed.TotalMilliseconds }catch{} } }; Write-Host ' Done.' -ForegroundColor Green; if($times.Count -gt 4){ $sorted=$times | Sort-Object; $trimmed=$sorted[1..($sorted.Count-2)]; $avg=[Math]::Round(($trimmed | Measure-Object -Average).Average, 1); $min=[Math]::Round($sorted[0], 1); $max=[Math]::Round($sorted[-1], 1) } elseif($times.Count -gt 0){ $avg=[Math]::Round(($times | Measure-Object -Average).Average, 1); $min=$avg; $max=$avg } else { $avg=999; $min=999; $max=999 }; [PSCustomObject]@{ Provider=$srv.N; IP=$srv.I; 'Avg(ms)'=$avg; 'Min(ms)'=$min; 'Max(ms)'=$max } }; Write-Host ''; $res | Sort-Object 'Avg(ms)' | Format-Table -AutoSize; Write-Host '[Choose the #1 lowest Avg(ms) in your CTT DNS dropdown]'; Write-Host ''">Copy Benchmark</button>
</div>
                        </div>

                        <div class="dns-static-grid">
                            <div class="dns-static-card fastest">
                                <div class="dns-tile-top">
                                    <strong style="color:var(--accent-mint)">1. Cloudflare (1.1.1.1)</strong>
                                    <span class="pill-badge" style="font-size:0.6rem">Lowest Gaming Ping</span>
                                </div>
                                <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0;">
                                    Consistently ranks #1 on DNSPerf worldwide. Fastest query turnaround, zero logs, pure raw throughput for gaming.
                                </p>
                            </div>
                            <div class="dns-static-card">
                                <div class="dns-tile-top">
                                    <strong style="color:var(--accent-sky)">2. Quad9 (9.9.9.9)</strong>
                                    <span class="pill-badge" style="font-size:0.6rem">Malware Blocking</span>
                                </div>
                                <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0;">
                                    Operated by an independent Swiss non-profit. Slightly higher ping (~2-4ms), but blocks malicious phishing and malware domains at the resolution layer.
                                </p>
                            </div>
                        </div>

                        <div class="mpo-advice-card" style="margin-top:10px;">
                            <div><strong>Multiplane Overlay (MPO) in CTT:</strong> Set to <span style="color:var(--accent-rose); font-weight:800;">Disabled</span>. Cures desktop and Discord black screen flickering on NVIDIA and AMD cards.</div>
                            <div style="margin-top:6px;"><strong>Performance Plans in CTT:</strong> <span style="color:var(--accent-rose); font-weight:800;">DO NOT ENABLE "Ultimate Performance"</span> in CTT. Use our calibrated Balanced script in Phase 6 instead to keep idle fans silent.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PHASE 6: KERNEL LATENCY, HARDWARE INTERRUPTS & POLISH -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge" style="color: var(--accent-mint)">PHASE 06</span>
                <span class="step-title">Kernel Latency, Hardware Interrupts &amp; Polish</span>
            </div>
            <p class="step-desc">
                These post-debloat finishing touches address hardware polling, interrupt conflicts, and DPC latency that general debloaters cannot touch. Follow these steps in order:
            </p>

            <div class="step-content-box">
                <div style="font-weight:700; color:var(--accent-mint); font-size:0.8rem;">
                    Step 1: Apply Calibrated Balanced Power Script (Silent Idle, Peak Boost):
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:0;">
                    Ensures cores scale in ~1ms via Speed Shift/CPPC, disables PCIe link power drops, stops USB sleep disconnects for gaming mice, and reclaims 16–32 GB SSD space:
                </p>
                <div class="code-action-box" style="margin-top:6px;">
<div class="code-copy-row">
    <code class="font-mono">powercfg -restoredefaultschemes; powercfg /change standby-timeout-ac 0; powercfg /change disk-timeout-ac 0; powercfg /setacvalueindex SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0; powercfg /hibernate off; powercfg /setactive SCHEME_CURRENT</code>
    <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="powercfg -restoredefaultschemes; powercfg /change standby-timeout-ac 0; powercfg /change disk-timeout-ac 0; powercfg /setacvalueindex SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0; powercfg /hibernate off; powercfg /setactive SCHEME_CURRENT">Copy Power Script</button>
</div>
                </div>
            </div>

            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <div style="font-weight:700; color:var(--accent-sky); font-size:0.8rem;">
                        Step 2: MSI (Message Signaled Interrupts) Mode Utility v3:
                    </div>
                    <a href="https://forums.guru3d.com/threads/windows-line-based-vs-message-signaled-based-interrupts-msi-tool.378044/" target="_blank" rel="noopener" class="link-chip">Download MSI Tool v3 ↗</a>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Legacy line-based interrupts force devices to share an IRQ pin, creating hardware interrupt queues and micro-stuttering. MSI mode gives your GPU and network card dedicated vector addresses:
                </p>
                <ul class="clean-bullet-list" style="margin-top:6px;">
                    <li>Right-click <code>MSI_util_v3.exe</code> and click <strong>Run as Administrator</strong>.</li>
                    <li>Locate your <strong>Graphics Card</strong>: Check the <strong>MSI</strong> box, and set <strong>Interrupt Priority</strong> to <strong>High</strong> (or Undefined).</li>
                    <li>Locate your <strong>Realtek / Intel Network Adapter</strong>: Check the <strong>MSI</strong> box. (Leave priority as Normal/Undefined).</li>
                    <li>Click <strong>Apply</strong> at top right and reboot. (DPC latency drops measurably).</li>
                </ul>
            </div>

            <div class="step-content-box">
                <div style="font-weight:700; color:var(--accent-amber); font-size:0.8rem;">
                    Step 3: Network Adapter Hardware Optimization (Kill Packet Sleep):
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Press <kbd>Win</kbd> + <kbd>X</kbd> ➔ Device Manager ➔ Expand <em>Network adapters</em> ➔ Right-click your Ethernet controller (Intel I225/I226, Realtek 2.5GbE) ➔ <strong>Properties</strong> ➔ <strong>Advanced</strong> tab:
                </p>
                <ul class="clean-bullet-list" style="margin-top:6px;">
                    <li><strong>Energy Efficient Ethernet (EEE):</strong> Set to <strong>Disabled</strong> (Stops the physical transceiver from sleeping between packets).</li>
                    <li><strong>Green Ethernet / Gigabit Lite:</strong> Set to <strong>Disabled</strong>.</li>
                    <li><strong>Interrupt Moderation:</strong> Set to <strong>Enabled</strong> (or <em>Low</em> for competitive gaming). Disabling it entirely can spike CPU usage; <em>Low</em> or <em>Enabled</em> maintains zero packet loss.</li>
                    <li><strong>Receive Side Scaling (RSS):</strong> Ensure it is set to <strong>Enabled</strong> (Spreads network packet handling across multiple CPU cores).</li>
                </ul>
            </div>

            <div class="step-content-box">
                <div style="font-weight:700; color:var(--accent-mint); font-size:0.8rem;">
                    Step 4: Disable MMCSS Network Throttling &amp; System CPU Reservation:
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Windows Multimedia Class Scheduler Service (MMCSS) throttles network packets by up to 20% while music/games run, and reserves 20% CPU for background tasks. Run this one-liner in CMD/PowerShell (Admin) to remove both limits:
                </p>
                <div class="code-action-box" style="margin-top:6px;">
                    <div class="code-copy-row">
                        <code class="font-mono">reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f</code>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="reg add &quot;HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile&quot; /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f; reg add &quot;HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile&quot; /v SystemResponsiveness /t REG_DWORD /d 0 /f">Copy MMCSS Fix</button>
                    </div>
                </div>
            </div>

            <div class="step-content-box">
                <div style="font-weight:700; color:var(--accent-rose); font-size:0.8rem;">
                    Step 5: Disable Game DVR Background Recording (Reclaim GPU Video Encoder):
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Windows silently records gameplay clips in the background, consuming NVENC/AMF video encoding bandwidth and causing frame drops. Run this to shut off silent background recording permanently:
                </p>
                <div class="code-action-box" style="margin-top:6px;">
                    <div class="code-copy-row">
                        <code class="font-mono">reg add "HKCU\\System\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f</code>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="reg add &quot;HKCU\\System\\GameConfigStore&quot; /v GameDVR_Enabled /t REG_DWORD /d 0 /f; reg add &quot;HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR&quot; /v AllowGameDVR /t REG_DWORD /d 0 /f">Copy Game DVR Kill</button>
                    </div>
                </div>
            </div>

            <div class="latency-grid">
                <div class="latency-item">
                    <strong style="color:var(--accent-mint)">Step 6A: Instant Menu Response (MenuShowDelay):</strong>
                    <p style="font-size:0.73rem; margin:4px 0 6px 0; color:var(--text-secondary);">
                        Windows defaults to a sluggish 400ms delay before expanding menus. Drop this to 10ms for instant responses:
                    </p>
                    <div class="code-copy-row">
                        <code class="font-mono">reg add "HKCU\\Control Panel\\Desktop" /v MenuShowDelay /t REG_SZ /d 10 /f</code>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="reg add &quot;HKCU\\Control Panel\\Desktop&quot; /v MenuShowDelay /t REG_SZ /d 10 /f">Copy</button>
                    </div>
                </div>

                <div class="latency-item">
                    <strong style="color:var(--accent-sky)">Step 6B: Audio Resampling Alignment (48,000 Hz):</strong>
                    <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                        Almost all modern games output at <strong>48,000 Hz</strong>. If your headset is at 44,100 Hz in Windows, the kernel runs a software resampler filter that adds DPC latency.
                        <br/><br/>
                        Press <kbd>Win</kbd> + <kbd>R</kbd> ➔ type <code>mmsys.cpl</code> ➔ double-click your playback device ➔ <strong>Advanced</strong> tab ➔ set to <strong>24-bit, 48000 Hz (Studio Quality)</strong>.
                    </p>
                </div>

                <div class="latency-item">
                    <strong style="color:var(--accent-violet)">Step 6C: NVMe TRIM &amp; Game De-Indexing:</strong>
                    <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                        1. <strong>Verify TRIM:</strong> Run <code>fsutil behavior query DisableDeleteNotify</code> in CMD (must return <code>0</code>).
                        <br/><br/>
                        2. <strong>De-Index Game Drives:</strong> Open <em>Indexing Options</em> ➔ <em>Modify</em> ➔ Uncheck your Steam/Epic game drives so Windows stops scanning game directories in the background.
                    </p>
                </div>

                <div class="latency-item">
                    <strong style="color:var(--accent-mint)">Step 6D: Disable NTFS Overhead:</strong>
                    <p style="font-size:0.73rem; margin:4px 0 6px 0; color:var(--text-secondary);">
                        Stops Windows creating duplicate 16-bit short names and writing timestamps every time a file is accessed:
                    </p>
                    <div class="code-copy-row">
                        <code class="font-mono">fsutil behavior set disable8dot3 1; fsutil behavior set disablelastaccess 1</code>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="fsutil behavior set disable8dot3 1; fsutil behavior set disablelastaccess 1">Copy</button>
                    </div>
                </div>

                <div class="latency-item">
                    <strong style="color:var(--accent-sky)">Step 6E: Contiguous Fixed Pagefile:</strong>
                    <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                        Press <kbd>Win</kbd> + <kbd>R</kbd> ➔ <code>sysdm.cpl</code> ➔ <em>Advanced</em> ➔ Performance <em>Settings</em> ➔ <em>Advanced</em> ➔ Virtual memory <em>Change</em> ➔ Uncheck Automatic ➔ Set C: drive to <strong>Initial: 8192 MB &amp; Max: 8192 MB</strong>.
                    </p>
                </div>
            </div>
        </div>

        <!-- PHASE 7: DEEP HOUSEKEEPING, BLEACHBIT & STARTUP PURGE -->
        <div class="card winopt-step-card">
            <div class="step-badge-row">
                <span class="pill-badge" style="color: var(--accent-sky)">PHASE 07</span>
                <span class="step-title">Deep Housekeeping, BleachBit &amp; Startup Hygiene</span>
            </div>
            <p class="step-desc">
                Eliminate startup polling daemons, clear crash dumps safely, and clean system buffers without breaking Windows.
            </p>

            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--accent-mint)">Step 1: Clean Startup Hooks with Microsoft Sysinternals Autoruns:</strong>
                    <a href="https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns" target="_blank" rel="noopener" class="link-chip">Download Autoruns (Sysinternals) ↗</a>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Task Manager only shows ~30% of startup programs. Autoruns reveals the rest:
                </p>
                <ul class="clean-bullet-list" style="margin-top:6px;">
                    <li>Extract and launch <code>Autoruns64.exe</code> as Administrator.</li>
                    <li>Look for entries highlighted in <strong>Yellow ("File Not Found")</strong> ➔ Right-click ➔ <strong>Delete</strong> (cleans dead registry startup ghosts).</li>
                    <li>Click the <strong>Logon</strong> tab ➔ Uncheck auto-updaters (Adobe, Discord Update, Edge AutoLaunch).</li>
                </ul>
            </div>

            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--accent-sky)">Step 2: BleachBit Deep Cleaning Protocol:</strong>
                    <a href="https://www.bleachbit.org/download" target="_blank" rel="noopener" class="link-chip">Download BleachBit Official ↗</a>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    BleachBit purges unneeded cache layers. Follow these safe checkboxes:
                </p>
                <div class="latency-grid" style="margin-top:6px;">
                    <div class="latency-item" style="border-color: rgba(0, 220, 130, 0.3);">
                        <strong style="color:var(--accent-mint)">✓ SAFE TO CHECK IN BLEACHBIT:</strong>
                        <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.4;">
                            • <strong>System:</strong> Temporary files, Memory Dumps, Mini-dumps, Recycle Bin, Clipboard.<br/>
                            • <strong>Windows Explorer:</strong> Thumbnail cache, Recent documents.<br/>
                            • <strong>Prefetch:</strong> Safe to clean once after finishing your debloat setup.
                        </p>
                    </div>
                    <div class="latency-item" style="border-color: rgba(244, 63, 94, 0.3);">
                        <strong style="color:var(--accent-rose)">✕ DO NOT CHECK (DANGER):</strong>
                        <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.4;">
                            • <strong>Windows Registry:</strong> Never clean the registry with BleachBit; risks breaking COM registrations.<br/>
                            • <strong>Free disk space wipe:</strong> Unnecessary wear on modern NVMe/SSDs.<br/>
                            • <strong>Do not clean Prefetch weekly:</strong> Prefetch accelerates application launches.
                        </p>
                    </div>
                </div>
            </div>

            <div class="step-content-box">
                <div style="font-weight:700; color:var(--accent-amber); font-size:0.8rem;">
                    Step 3: Safe Manual AppData &amp; Crash Dump Purge:
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Never delete your entire AppData folder (it stores browser profiles and game configs). Safely delete these specific subdirectories:
                </p>
                <ul class="clean-bullet-list" style="margin-top:6px;">
                    <li><code>%localappdata%\\CrashDumps</code> ➔ Delete all files inside (Frees gigabytes of old crash dumps).</li>
                    <li><code>%temp%</code> and <code>C:\\Windows\\Temp</code> ➔ Delete all contents (Skip files currently in use).</li>
                    <li><code>%localappdata%\\D3DSCache</code> ➔ Safe to delete if clearing corrupted game DirectX caches.</li>
                </ul>
            </div>
        </div>

        <!-- PHASE 8: THE "GOLDEN MASTER" BACKUP -->
        <div class="card winopt-step-card" style="border-color: rgba(0, 220, 130, 0.4); background: linear-gradient(145deg, var(--bg-surface) 0%, rgba(0, 220, 130, 0.03) 100%);">
            <div class="step-badge-row">
                <span class="pill-badge" style="color: var(--accent-mint); background: rgba(0, 220, 130, 0.15);">PHASE 08</span>
                <span class="step-title">The "Golden Master" Backup (The Finish Line)</span>
            </div>
            <p class="step-desc">
                Your system is now clean, responsive, and low-latency. If you have an external backup drive or secondary drive with <strong>30–40 GB of free space</strong>, capturing an image now lets you restore to this exact setup in under 3 minutes if anything ever goes wrong.
            </p>

            <div class="step-content-box">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--accent-mint)">Native Windows System Image Tool:</strong>
                    <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="sdclt.exe /BLASTBACKUP">Launch Backup Wizard</button>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                    Press <kbd>Win</kbd> + <kbd>R</kbd> ➔ type <code>sdclt.exe</code> ➔ Click <strong>"Create a system image"</strong> on the left pane ➔ Select your external backup drive or secondary internal drive.
                </p>
            </div>
        </div>
    </div>
</div>
`;
