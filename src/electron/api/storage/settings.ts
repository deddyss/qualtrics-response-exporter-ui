import { app, BrowserWindow, dialog, OpenDialogOptions, OpenDialogReturnValue, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import { Settings } from '@/types';

const SETTINGS_FILE_PATH = path.join(app.getPath('userData'), 'settings.json');
export const DEFAULT_EXPORT_DIRECTORY = path.resolve(app.getPath('downloads'));

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
				// eslint-disable-next-line
				settings.exportDirectory = DEFAULT_EXPORT_DIRECTORY;
			}
			fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings), () => resolve());
		});
	})
);

export const selectDirectory = (window: BrowserWindow, currentPath?: string): Promise<string> => (
	new Promise<string>((resolve) => {
		const defaultPath: string = currentPath ?? DEFAULT_EXPORT_DIRECTORY;
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
		});
	})
);

export const openDirectory = (exportDirectory?: string): void => {
	const directoryPath = exportDirectory ?? DEFAULT_EXPORT_DIRECTORY;
	const files = fs.readdirSync(directoryPath).sort();
	shell.showItemInFolder(
		files.length > 0 ? path.join(directoryPath, files[0]) : directoryPath
	);
};
