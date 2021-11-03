import { Surveys, WhoAmI } from '@/api/qualtrics';
import { ApiAuthorization, ApiError, Survey, User } from '@/types';

export const signIn = async (auth: ApiAuthorization) => {
	const api = new WhoAmI(auth);
	return new Promise<User>((resolve, reject) => {
		api.userInfo()
			.then((user: User) => resolve(user))
			.catch((error: ApiError) => reject(error));
	});
};

export const retrieveSurveys = async (auth: ApiAuthorization) => {
	const api = new Surveys(auth);
	return new Promise<Array<Survey>>((resolve, reject) => {
		api.listAllSurvey()
			.then((surveys: Survey[]) => resolve(surveys))
			.catch((error: ApiError) => reject(error));
	});
};
