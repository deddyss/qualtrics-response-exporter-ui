import { AxiosResponse, AxiosError } from 'axios';
import { ApiErrorResponse, User, WhoAmIResponse } from '@/types';
import Api from './Api';

const URL = '/whoami';

class WhoAmI extends Api {
	public userInfo(): Promise<User> {
		return new Promise<User>((resolve, reject) => {
			this.sendHttpGetRequest<WhoAmIResponse>({ url: URL })
				.then((response: AxiosResponse<WhoAmIResponse>) => {
					resolve(response.data.result);
				})
				.catch((error: AxiosError<ApiErrorResponse>) => {
					reject(Api.parseError(error));
				});
		});
	}
}

export default WhoAmI;
