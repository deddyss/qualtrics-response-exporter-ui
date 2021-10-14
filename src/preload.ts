import { contextBridge, ipcRenderer } from 'electron';
import { ApiCommand, ApiConfiguration, FunctionLike } from '@/types';

contextBridge.exposeInMainWorld(
	'api', {
		// loadConfiguration: () => {
		// 	ipcRenderer.send(COMMAND.CONFIGURATION.LOAD);
		// },
		// saveConfiguration: (configuration: Configuration) => {
		// 	ipcRenderer.send(COMMAND.CONFIGURATION.SAVE, { configuration });
		// },
		signIn: (param: ApiConfiguration) => {
			ipcRenderer.send('signIn' as ApiCommand, param);
		},
		on: (name: string, func: FunctionLike) => {
			// remove all listeners first
			ipcRenderer.removeAllListeners(name);
			// deliberately strip event as it includes sender
			ipcRenderer.on(name, (event, ...args) => func(...args));
		}
	}
);
