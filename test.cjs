const script = `$process = Start-Process cmd.exe -WindowStyle Hidden -Verb RunAs -ArgumentList '/c exit 1' -Wait -PassThru; if ($process.ExitCode -ne 0) { throw "ExitCode: $($process.ExitCode)" }`;
const encoded = Buffer.from(script, 'utf16le').toString('base64');
const { execSync } = require('child_process');
try {
  execSync('powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand ' + encoded, { stdio: 'pipe' });
  console.log('SUCCESS');
} catch (e) {
  console.log('FAILED', e.status);
  console.log('STDOUT', e.stdout.toString());
  console.log('STDERR', e.stderr.toString());
}
