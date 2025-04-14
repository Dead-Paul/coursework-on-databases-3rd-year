import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {database: (...args: any) => ipcRenderer.invoke('database', ...args)});