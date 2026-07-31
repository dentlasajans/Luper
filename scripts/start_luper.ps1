$electronPath = "c:\Luper\node_modules\electron\dist\electron.exe"
$appPath = "c:\Luper"

# Stop any previous electron instance
Get-Process -Name "electron" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 300

# Launch via WMI Win32_Process -> GUARANTEED display on physical interactive desktop screen
$cmdLine = "`"$electronPath`" `"$appPath`""
$res = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $cmdLine }

$procId = $res.ProcessId
Write-Host "Luper Electron GUI active via WMI [PID: $procId]"

if ($procId -and $res.ReturnValue -eq 0) {
    # Register PowerShell engine exit event handler for Cancel Task execution
    Register-EngineEvent -SourceIdentifier ([System.Management.Automation.PsEngineEvent]::Exiting) -Action {
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    } | Out-Null

    try {
        while (Get-Process -Id $procId -ErrorAction SilentlyContinue) {
            Start-Sleep -Milliseconds 500
        }
    } finally {
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
}
