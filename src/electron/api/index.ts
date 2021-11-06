import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent, WebContents } from 'electron';
import os from 'os';
import { Surveys, WhoAmI } from '@/api/qualtrics';
import { ApiAction, ApiAuthorization, ApiError, ExportResponsesActionParam, OpenDirectoryActionParam, ResponseExportedEventParam, RetrieveSurveysActionParam, RetrieveSurveysFailedEventParam, SaveQualtricsActionParam, SaveSettingsActionParam, SelectDirectoryActionParam, SignedInEventParam, SignInActionParam, SignInFailedEventParam, Survey, SurveysRetrievedEventParam, User } from '@/types';
import createServer from './export/server';
import createWorker from './export/worker';
import { saveQualtricsAuthorization } from './storage/qualtrics';
import { openDirectory, saveSettings, selectDirectory } from './storage/settings';
import { notify, range } from './util';

export { loadQualtricsAuthorization } from './storage/qualtrics';
export { loadSettings } from './storage/settings';

const signIn = async (auth: ApiAuthorization) => {
	const api = new WhoAmI(auth);
	return new Promise<User>((resolve, reject) => {
		api.userInfo()
			.then((user: User) => resolve(user))
			.catch((error: ApiError) => reject(error));
	});
};

const retrieveSurveys = async (auth: ApiAuthorization) => {
	const api = new Surveys(auth);
	return new Promise<Array<Survey>>((resolve, reject) => {
		api.listAllSurvey()
			.then((surveys: Survey[]) => resolve(surveys))
			.catch((error: ApiError) => reject(error));
	});
};

const exportResponses = async (param: ExportResponsesActionParam, webContents: WebContents) => {
	const count = os.cpus().length;
	const server = createServer({ ...param, webContents });
	const runningWorkers: Array<Promise<void>> = [];
	range(1, count).forEach((id) => {
		const worker = createWorker({ id, server });
		runningWorkers.push(worker.run());
	});
	Promise.all(runningWorkers).then(() => {
		notify(webContents).that(
			'responsesExported',
			{ exportDirectory: server.outputDirectory } as ResponseExportedEventParam
		);
	});
};

export const registerEventListeners = (window: BrowserWindow): void => {
	// save settings
	ipcMain.on('saveSettings' as ApiAction, (event: IpcMainEvent, param: SaveSettingsActionParam) => {
		const { settings } = param;
		saveSettings(settings);
	});

	// save qualtrics authorization
	ipcMain.on('saveQualtrics' as ApiAction, (event: IpcMainEvent, param: SaveQualtricsActionParam) => {
		const { auth } = param;
		saveQualtricsAuthorization(auth);
	});

	// select directory
	ipcMain.handle('selectDirectory' as ApiAction, async (event: IpcMainInvokeEvent, param: SelectDirectoryActionParam) => {
		const { path } = param;
		const directory = await selectDirectory(window, path);
		return directory;
	});

	// open directory
	ipcMain.on('openDirectory' as ApiAction, async (event: IpcMainInvokeEvent, param: OpenDirectoryActionParam) => {
		const { path } = param;
		openDirectory(path);
	});

	// sign in
	ipcMain.on('signIn' as ApiAction, (event: IpcMainEvent, param: SignInActionParam) => {
		const { auth } = param;
		signIn(auth)
			.then((user: User) => notify(event.sender).that('signedIn', { user, auth } as SignedInEventParam))
			.catch((error: ApiError) => notify(event.sender).that('signInFailed', { error, auth } as SignInFailedEventParam));
	});

	// retrieve surveys
	ipcMain.on('retrieveSurveys' as ApiAction, (event: IpcMainEvent, param: RetrieveSurveysActionParam) => {
		const { auth } = param;
		retrieveSurveys(auth)
			.then(
				(surveys: Survey[]) => notify(event.sender).that(
					'surveysRetrieved', { surveys } as SurveysRetrievedEventParam
				)
			)
			.catch(
				(error: ApiError) => notify(event.sender).that(
					'retrieveSurveysFailed', { error } as RetrieveSurveysFailedEventParam
				)
			);
	});

	// export responses
	ipcMain.on('exportResponses' as ApiAction, (event: IpcMainEvent, param: ExportResponsesActionParam) => {
		exportResponses(param, event.sender);
	});
};
