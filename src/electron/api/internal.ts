import { app, BrowserWindow, dialog, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import path from 'path';
import fs from 'fs';
import { Qualtrics, QualtricsAuthorization, Settings } from '@/types';
import { decrypt, encrypt } from '@/electron/encryptor';

const SETTINGS_FILE_PATH = path.join(app.getPath('userData'), 'settings.json');
const QUALTRICS_FILE_PATH = path.join(app.getPath('userData'), 'qualtrics.json');
const DEFAULT_EXPORT_DIRECTORY = path.resolve(app.getPath('downloads'));

export const loadSettings = (): Settings => {
	if (!fs.existsSync(SETTINGS_FILE_PATH)) {
		return {
			rememberMe: false,
			navigationMenuPosition: 'left',
			exportDirectory: DEFAULT_EXPORT_DIRECTORY
		};
	}

	const content: string = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
	const settings: Settings = JSON.parse(content) as Settings;
	return settings;
};

export const saveSettings = (settings: Settings): Promise<void> => (
	new Promise<void>((resolve) => {
		// is directory writeable?
		fs.access(settings.exportDirectory as string, fs.constants.W_OK, (err) => {
			// not writeable
			if (err) {
				// override with default value
				settings.exportDirectory = DEFAULT_EXPORT_DIRECTORY;
			}
			fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings), () => resolve());
		});
	})
);

export const loadQualtricsAuthorization = (): QualtricsAuthorization | undefined => {
	if (!fs.existsSync(QUALTRICS_FILE_PATH)) {
		return undefined;
	}

	const content: string = fs.readFileSync(QUALTRICS_FILE_PATH, 'utf-8');
	const qualtrics: Qualtrics = JSON.parse(content) as Qualtrics;
	const { dataCenter, apiToken } = qualtrics;

	let decryptedApiToken: string | undefined;
	if (apiToken) {
		decryptedApiToken = decrypt(apiToken);
	}
	return { dataCenter, apiToken: decryptedApiToken };
};

export const saveQualtricsAuthorization = (auth: QualtricsAuthorization): Promise<void> => (
	new Promise<void>((resolve) => {
		const encryptedAuth = { ...auth };
		if (auth.apiToken) {
			encryptedAuth.apiToken = encrypt(auth.apiToken);
		}
		fs.writeFile(QUALTRICS_FILE_PATH, JSON.stringify(encryptedAuth), () => resolve());
	})
);

export const selectDirectory = (window: BrowserWindow, path?: string): Promise<string> => (
	new Promise<string>((resolve) => {
		const defaultPath: string = path ?? DEFAULT_EXPORT_DIRECTORY;
		const options: OpenDialogOptions = {
			title: 'Select export directory',
			properties: ['openDirectory', 'createDirectory', 'dontAddToRecent'],
			defaultPath
		};
		dialog.showOpenDialog(window, options).then((selection: OpenDialogReturnValue) => {
			const { canceled, filePaths } = selection;
			if (!canceled && filePaths[0]) {
				resolve(filePaths[0]);
			}
			else {
				resolve(defaultPath);
			}
		})
	})
);
