import { WhoAmI } from '@/api/qualtrics';
import { ApiAction, ApiAuthorization, ApiError, ApiEvent, User } from '@/types';
import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

const signIn = async (auth: ApiAuthorization) => {
	const api = new WhoAmI(auth);
	return new Promise<User>((resolve, reject) => {
		api.userInfo()
			.then((user: User) => resolve(user))
			.catch((error: ApiError) => reject(error));
	});
};

export const registerEventListeners = (window: BrowserWindow): void => {
	// sign in
	ipcMain.on('signIn' as ApiAction, (event: IpcMainEvent, auth: ApiAuthorization) => {
		signIn(auth)
			.then((user: User) => event.sender.send('signedIn' as ApiEvent, { user, auth }))
			.catch((error: ApiError) => event.sender.send('signInFailed' as ApiEvent, { error, auth }));
	});

};
