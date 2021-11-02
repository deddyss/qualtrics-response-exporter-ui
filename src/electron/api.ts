import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, IpcMainInvokeEvent, OpenDialogOptions, OpenDialogReturnValue, WebContents } from 'electron';
import path from 'path';
import fs from 'fs';
import { WhoAmI } from '@/api/qualtrics';
import { ApiAction, ApiAuthorization, ApiError, ApiEvent, Settings, SignedInParam, SignInFailedParam, User } from '@/types';

const SETTINGS_FILE_PATH = path.join(app.getPath('userData'), 'settings.json');
const DEFAULT_EXPORT_DIRECTORY = path.resolve(app.getPath('downloads'));

const signIn = async (auth: ApiAuthorization) => {
	const api = new WhoAmI(auth);
	return new Promise<User>((resolve, reject) => {
		api.userInfo()
			.then((user: User) => resolve(user))
			.catch((error: ApiError) => reject(error));
	});
};

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

const saveSettings = (settings: Settings): Promise<void> => (
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

const selectDirectory = (window: BrowserWindow, path?: string): Promise<string> => (
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
	
/**
 * Wrapper of {@link WebContents.send}
 * @param webContents
 * @returns
 */
export const notify = (webContents: WebContents) => {
	const that = (apiEvent: ApiEvent, ...args: any[]) => {
		webContents.send(apiEvent, ...args);
	}
	return { that };
}

export const registerEventListeners = (window: BrowserWindow): void => {
	// sign in
	ipcMain.on('signIn' as ApiAction, (event: IpcMainEvent, auth: ApiAuthorization) => {
		signIn(auth)
			.then((user: User) => notify(event.sender).that('signedIn', { user, auth } as SignedInParam))
			.catch((error: ApiError) => notify(event.sender).that('signInFailed', { error, auth } as SignInFailedParam));
	});

	// save settings
	ipcMain.on('saveSettings' as ApiAction, (event: IpcMainEvent, settings: Settings) => {
		saveSettings(settings);
	});

	// select directory
	ipcMain.handle('selectDirectory' as ApiAction, async (event: IpcMainInvokeEvent, path?: string) => {
		const directory = await selectDirectory(window, path);
		return directory;
	});
};
