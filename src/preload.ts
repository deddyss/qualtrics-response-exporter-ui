import { contextBridge, ipcRenderer } from 'electron';
import { ApiAction, ExportResponsesActionParam, FunctionLike, RetrieveSurveysActionParam, SaveQualtricsActionParam, SaveSettingsActionParam, SelectDirectoryActionParam, SignInActionParam } from '@/types';

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
const invoke = (action: ApiAction, ...args: any[]) => ipcRenderer.invoke(action, ...args);

contextBridge.exposeInMainWorld(
	'api', {
		// loadConfiguration: () => {
		// 	ipcRenderer.send(COMMAND.CONFIGURATION.LOAD);
		// },
		// saveConfiguration: (configuration: Configuration) => {
		// 	ipcRenderer.send(COMMAND.CONFIGURATION.SAVE, { configuration });
		// },
		saveSettings: (param: SaveSettingsActionParam) => {
			send('saveSettings', param);
		},
		saveQualtrics: (param: SaveQualtricsActionParam) => {
			send('saveQualtrics', param);
		},
		selectDirectory: (param: SelectDirectoryActionParam) => invoke('selectDirectory', param),
		signIn: (param: SignInActionParam) => {
			send('signIn', param);
		},
		retrieveSurveys: (param: RetrieveSurveysActionParam) => {
			send('retrieveSurveys', param);
		},
		exportResponses: (param: ExportResponsesActionParam) => {
			send('exportResponses', param);
		},
		on: (name: string, func: FunctionLike) => {
			// remove all listeners first
			ipcRenderer.removeAllListeners(name);
			// deliberately strip event as it includes sender
			ipcRenderer.on(name, (event, ...args) => func(...args));
		}
	}
);
