import { contextBridge, ipcRenderer } from 'electron';
import { ApiAction, ApiAuthorization, FunctionLike, QualtricsAuthorization, Settings } from '@/types';

/**
 * Wrapper of {@link IpcRenderer.send}
 * @param action
 * @param args
 */
const send = (action: ApiAction, ...args: any[]) => {
	ipcRenderer.send(action, ...args);
};

/**
 * Wrapper of {@link IpcRenderer.invoke}
 * @param action
 * @param args
 */
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
		saveQualtrics: (auth: QualtricsAuthorization) => {
			send('saveQualtrics', auth);
		},
		selectDirectory: (path?: string) => {
			return invoke('selectDirectory', path);
		},
		signIn: (auth: ApiAuthorization) => {
			send('signIn', auth);
		},
		retrieveSurveys: (auth: ApiAuthorization) => {
			send('retrieveSurveys', auth);
		},
		on: (name: string, func: FunctionLike) => {
			// remove all listeners first
			ipcRenderer.removeAllListeners(name);
			// deliberately strip event as it includes sender
			ipcRenderer.on(name, (event, ...args) => func(...args));
		}
	}
);
