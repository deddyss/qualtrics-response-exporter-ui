import { contextBridge, ipcRenderer } from 'electron';
import { ApiAction, ApiAuthorization, FunctionLike } from '@/types';

contextBridge.exposeInMainWorld(
	'api', {
		// loadConfiguration: () => {
		// 	ipcRenderer.send(COMMAND.CONFIGURATION.LOAD);
		// },
		// saveConfiguration: (configuration: Configuration) => {
		// 	ipcRenderer.send(COMMAND.CONFIGURATION.SAVE, { configuration });
		// },
		signIn: (param: ApiAuthorization) => {
			ipcRenderer.send('signIn' as ApiAction, param);
		},
		on: (name: string, func: FunctionLike) => {
			// remove all listeners first
			ipcRenderer.removeAllListeners(name);
			// deliberately strip event as it includes sender
			ipcRenderer.on(name, (event, ...args) => func(...args));
		}
	}
);
