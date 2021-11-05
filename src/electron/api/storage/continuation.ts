import AsyncLock from 'async-lock';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { Map } from '@/types';

const KEY = 'CONTINUATION_TOKEN';
const lock = new AsyncLock({});

const CONTINUATION_TOKEN_MAP_FILE_PATH = path.join(app.getPath('userData'), 'continuation.json');

const isContinuationTokenMapExist = (): boolean => fs.existsSync(CONTINUATION_TOKEN_MAP_FILE_PATH);

const loadContinuationTokenMap = (): Map<string> => {
	if (isContinuationTokenMapExist()) {
		try {
			const continuationTokenMap: string = fs.readFileSync(CONTINUATION_TOKEN_MAP_FILE_PATH, 'utf-8');
			return JSON.parse(continuationTokenMap) as Map<string>;
		}
		catch (error) {
			// do nothing
		}
	}
	return {};
};

const continuationTokenMap: Map<string> = loadContinuationTokenMap();

const saveContinuationTokenMap = (): void => {
	lock.acquire(KEY, () => {
		fs.writeFileSync(CONTINUATION_TOKEN_MAP_FILE_PATH, JSON.stringify(continuationTokenMap));
	});
};

export const getContinuationToken = (surveyId: string): string | undefined => continuationTokenMap[surveyId];

export const putContinuationToken = (surveyId: string, continuationToken: string): void => {
	continuationTokenMap[surveyId] = continuationToken;
	saveContinuationTokenMap();
};
