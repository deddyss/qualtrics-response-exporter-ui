import { WhoAmI } from '@/api/qualtrics';
import { ApiCommand, ApiConfiguration, ApiError, ApiEvent, User } from '@/types';
import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

const signIn = async (auth: ApiConfiguration) => {
	const api = new WhoAmI(auth);
	return new Promise<User>((resolve, reject) => {
		api.userInfo()
			.then((user: User) => resolve(user))
			.catch((error: ApiError) => reject(error));
	});
};

export const registerEventListeners = (window: BrowserWindow): void => {

	ipcMain.on('signIn' as ApiCommand, (event: IpcMainEvent, auth: ApiConfiguration) => {
		console.log('signIn', auth);
		signIn(auth)
			.then((user: User) => event.sender.send('signedIn' as ApiEvent, { user }))
			.catch((error: ApiError) => event.sender.send('signInFailed' as ApiEvent, { error }));
	});

};
