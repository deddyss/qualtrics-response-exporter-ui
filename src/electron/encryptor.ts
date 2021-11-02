import CryptoJS from 'crypto-js';
import { system } from 'systeminformation';

// default key
let key = 'HmujeXd3?dj*fTK!#p7+6_$JA#s3^s-HqV4gdhZsdvt3Q%*y';

// key should be updated when this function is called
export const initKey = async (): Promise<void> => {
	const systemData = await system();
	const rawString = `${systemData.uuid}-${systemData.serial}`;
	const wordArray = CryptoJS.enc.Utf8.parse(rawString);
	key = CryptoJS.enc.Base64.stringify(wordArray);
};

export const encrypt = (text: string): string => CryptoJS.AES.encrypt(text, key).toString();
export const decrypt = (text: string): string => CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
