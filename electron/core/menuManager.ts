import { Menu } from 'electron';

export function buildTrayContextMenu(mainWindow: unknown, onQuit: unknown) {
  return Menu.buildFromTemplate([
    { label: 'Luper Windows Optimizer', enabled: false },
    { type: 'separator' },
    // @ts-expect-error - auto fixed
    { label: 'Aç / Göster', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } } },
    // @ts-expect-error - auto fixed
    { label: 'Çıkış', click: onQuit }
  ]);
}
