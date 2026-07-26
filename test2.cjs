const regCmd = 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 0xffffffff /f';
const args = regCmd.replace(/^reg\s+/i, '').replace(/'/g, "''");
const script = `$process = Start-Process reg.exe -WindowStyle Hidden -Verb RunAs -ArgumentList '${args}' -Wait -PassThru; if ($process.ExitCode -ne 0) { throw "ExitCode: $($process.ExitCode)" }`;
const encoded = Buffer.from(script, 'utf16le').toString('base64');
const { execSync } = require('child_process');
try {
  execSync('powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand ' + encoded, { stdio: 'pipe' });
  console.log('SUCCESS');
} catch (e) {
  console.log('FAILED', e.status);
  console.log('STDOUT', e.stdout ? e.stdout.toString() : '');
  console.log('STDERR', e.stderr ? e.stderr.toString() : '');
}
