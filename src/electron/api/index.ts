import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent, WebContents } from 'electron';
import { ApiAction, ApiAuthorization, ApiError, ApiEvent, QualtricsAuthorization, RetrieveSurveysFailedParam, Settings, SignedInParam, SignInFailedParam, Survey, SurveysRetrievedParam, User } from '@/types';
import { retrieveSurveys, signIn } from './qualtrics';
import { saveQualtricsAuthorization, saveSettings, selectDirectory } from './internal';

export { loadQualtricsAuthorization, loadSettings } from './internal';

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
	// save settings
	ipcMain.on('saveSettings' as ApiAction, (event: IpcMainEvent, settings: Settings) => {
		saveSettings(settings);
	});

	// save qualtrics authorization
	ipcMain.on('saveQualtrics' as ApiAction, (event: IpcMainEvent, auth: QualtricsAuthorization) => {
		saveQualtricsAuthorization(auth);
	});

	// select directory
	ipcMain.handle('selectDirectory' as ApiAction, async (event: IpcMainInvokeEvent, path?: string) => {
		const directory = await selectDirectory(window, path);
		return directory;
	});

	// sign in
	ipcMain.on('signIn' as ApiAction, (event: IpcMainEvent, auth: ApiAuthorization) => {
		signIn(auth)
			.then((user: User) => notify(event.sender).that('signedIn', { user, auth } as SignedInParam))
			.catch((error: ApiError) => notify(event.sender).that('signInFailed', { error, auth } as SignInFailedParam));
	});

	// retrieve surveys
	ipcMain.on('retrieveSurveys' as ApiAction, (event: IpcMainEvent, auth: ApiAuthorization) => {
		retrieveSurveys(auth)
			.then(
				(surveys: Survey[]) => notify(event.sender).that(
					'surveysRetrieved', { surveys } as SurveysRetrievedParam
				)
			)
			.catch(
				(error: ApiError) => notify(event.sender).that(
					'retrieveSurveysFailed', { error } as RetrieveSurveysFailedParam
				)
			);
	});
};
