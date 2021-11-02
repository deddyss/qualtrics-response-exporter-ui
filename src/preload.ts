import { contextBridge, ipcRenderer, IpcRenderer } from 'electron';
import { ApiAction, ApiAuthorization, FunctionLike, Settings } from '@/types';

/**
 * Wrapper of {@link IpcRenderer.send}
 * @param action
 * @param args
 */
const send = (action: ApiAction, ...args: any[]) => {
	ipcRenderer.send(action, ...args);
};

const invoke = (action: ApiAction, ...args: any[]) => {
	return ipcRenderer.invoke(action, ...args);
}

contextBridge.exposeInMainWorld(
	'api', {
		// loadConfiguration: () => {
		// 	ipcRenderer.send(COMMAND.CONFIGURATION.LOAD);
		// },
		// saveConfiguration: (configuration: Configuration) => {
		// 	ipcRenderer.send(COMMAND.CONFIGURATION.SAVE, { configuration });
		// },
		saveSettings: (settings: Settings) => {
			send('saveSettings', settings);
		},
		selectDirectory: (path?: string) => {
			return invoke('selectDirectory', path);
		},
		signIn: (auth: ApiAuthorization) => {
			send('signIn', auth);
		},
		on: (name: string, func: FunctionLike) => {
			// remove all listeners first
			ipcRenderer.removeAllListeners(name);
			// deliberately strip event as it includes sender
			ipcRenderer.on(name, (event, ...args) => func(...args));
		}
	}
);
