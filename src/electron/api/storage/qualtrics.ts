import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { Qualtrics, QualtricsAuthorization } from '@/types';
import { decrypt, encrypt } from '@/electron/encryptor';

const QUALTRICS_FILE_PATH = path.join(app.getPath('userData'), 'qualtrics.json');

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
