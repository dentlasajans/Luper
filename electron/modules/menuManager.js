import { Menu } from 'electron';

export function buildTrayContextMenu(mainWindow, onQuit) {
  return Menu.buildFromTemplate([
    { label: 'Luper Windows Optimizer', enabled: false },
    { type: 'separator' },
    { label: 'Aç / Göster', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } } },
    { label: 'Çıkış', click: onQuit }
  ]);
}
