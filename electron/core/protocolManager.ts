import { app } from 'electron';
import path from 'path';
import { logInfo } from '../services/logger.js';

export function setupProtocolHandler() {
  const PROTOCOL_PREFIX = 'luper';

  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(PROTOCOL_PREFIX, process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    app.setAsDefaultProtocolClient(PROTOCOL_PREFIX);
  }

  logInfo(`Protocol handler [${PROTOCOL_PREFIX}://] configured.`);
}
