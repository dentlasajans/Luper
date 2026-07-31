$electronPath = "c:\Luper\node_modules\electron\dist\electron.exe"
$appPath = "c:\Luper"
$parentPid = $PID

# 1. Terminate any previous electron instances
Get-Process -Name "electron" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 300

# 2. Launch Electron via WMI Win32_Process (forces display on interactive Session 1 desktop WinSta0\Default)
$cmdLine = "`"$electronPath`" `"$appPath`""
$res = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $cmdLine }

$procId = $res.ProcessId
Write-Host "Luper Win32 Process created via WMI with PID: $procId (ReturnValue: $($res.ReturnValue))"

if ($procId -and $res.ReturnValue -eq 0) {
    # 3. Spawn a dedicated monitor job that watches parent task process lifecycle
    # If the user kills the background task, the monitor job detects parent exit and kills Electron!
    $monitorJob = Start-Job -ScriptBlock {
        param($pId, $pParentPid)
        while ($true) {
            $parent = Get-Process -Id $pParentPid -ErrorAction SilentlyContinue
            if (-not $parent -or $parent.HasExited) {
                # Task was killed/cancelled by user -> terminate Electron
                Stop-Process -Id $pId -Force -ErrorAction SilentlyContinue
                break
            }
            $target = Get-Process -Id $pId -ErrorAction SilentlyContinue
            if (-not $target -or $target.HasExited) {
                break
            }
            Start-Sleep -Milliseconds 500
        }
    } -ArgumentList $procId, $parentPid

    # 4. Main task loop: wait while Electron process is open on screen
    try {
        while (Get-Process -Id $procId -ErrorAction SilentlyContinue) {
            Start-Sleep -Seconds 1
        }
    } finally {
        Remove-Job -Job $monitorJob -Force -ErrorAction SilentlyContinue
    }
}
