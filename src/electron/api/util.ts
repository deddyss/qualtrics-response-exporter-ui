import path from 'path';
import fs from 'fs';
import { WebContents } from 'electron';
import { ApiEvent } from '@/types';

export const sleep = (delay = 0): Promise<void> => new Promise((resolve) => {
	if (delay > 0) {
		setTimeout(() => {
			resolve();
		}, delay);
	}
	else {
		resolve();
	}
});

export const range = (beginInclusive: number, endInclusive: number): Array<number> => {
	if (beginInclusive > endInclusive) {
		return [];
	}
	if (beginInclusive === endInclusive) {
		return [beginInclusive];
	}
	const length = (endInclusive - beginInclusive) + 1;
	return Array.from({ length }, (_, i) => beginInclusive + i);
};

export const random = (min: number, max: number): number => {
	const minRange = Math.ceil(min);
	const maxRange = Math.floor(max);
	return Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
};

export const sanitizeFilename = (filename: string): string => filename.replace(/[/\\?%*:|"<>]/g, '').replace(/\s{2,}/g, ' ').trim();

const safeCurrentDateTimePathName = (): string => {
	const now = new Date();
	const offset = now.getTimezoneOffset() * 60 * 1000;
	const localDate = new Date(now.getTime() - offset);
	const result = localDate.toISOString().slice(0, 19).replace(/:/g, '.').replace('T', ' ');

	return result;
};

export const createOutputDirectory = (exportDirectory: string): string => {
	const uniquePathName: string = safeCurrentDateTimePathName();
	const directoryPath = path.join(exportDirectory, uniquePathName);
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath, { recursive: true });
	}
	return directoryPath;
};

export const initFile = (filePath: string): void => {
	if (!fs.existsSync(filePath)) {
		fs.closeSync(fs.openSync(filePath, "w"));
	}
};

interface NotifyReturn {
	that: (apiEvent: ApiEvent, ...args: any[]) => void;
}

/**
 * Wrapper of {@link WebContents.send}
 * @param webContents
 * @returns
 */
export const notify = (webContents: WebContents): NotifyReturn => {
	const that = (apiEvent: ApiEvent, ...args: any[]) => {
		webContents.send(apiEvent, ...args);
	};
	return { that };
};
