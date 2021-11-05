import AsyncLock from 'async-lock';
import Denque from 'denque';
import { ExportFailedEventParam, ExportFileProgressEventParam, ExportProgressEventParam, ExportSuccessEventParam, Map, ResponseExportStatus, Server, ServerParam, Survey } from '@/types';
import { DEFAULT_EXPORT_DIRECTORY } from '@/electron/api/storage/settings';
import { createOutputDirectory, notify } from '@/electron/api/util';

const queueKey = 'QUEUE_KEY';
const queueLock = new AsyncLock();

const composeSurveyNames = (surveys: Survey[]): Map<string> => {
	const names: Map<string> = {};
	surveys.forEach((survey) => {
		names[survey.id] = survey.name;
	});
	return names;
};

const getNextSurveyIdFromQueue = async (queue: Denque<string>): Promise<string | null> => {
	const surveyId = await queueLock.acquire<string | null>(queueKey, () => {
		if (queue.isEmpty()) {
			return null;
		}
		return queue.shift();
	});

	return surveyId;
};

const createServer = (param: ServerParam): Server => {
	const { auth, selectedIds, surveys, exportDirectory, exportOptions, webContents } = param;
	const queue = new Denque<string>(selectedIds);
	const outputDirectory = createOutputDirectory(exportDirectory ?? DEFAULT_EXPORT_DIRECTORY);
	const surveyNames = composeSurveyNames(surveys);

	const getSurveyName = (surveyId: string) => surveyNames[surveyId];
	const getNextSurveyId = () => getNextSurveyIdFromQueue(queue);
	const notifyExportProgress = async (surveyId: string, status: ResponseExportStatus, percentComplete: number) => {
		notify(webContents).that('exportProgress', { surveyId, status, percentComplete } as ExportProgressEventParam);
	};
	const notifyExportFileProgress = async (surveyId: string, percentComplete: number) => {
		notify(webContents).that('exportFileProgress', { surveyId, percentComplete } as ExportFileProgressEventParam);
	};
	const notifyExportSuccess = async (surveyId: string) => {
		notify(webContents).that('exportSuccess', { surveyId } as ExportSuccessEventParam);
	};
	const notifyExportFailed = async (surveyId: string, errorMessage: string) => {
		notify(webContents).that('exportFailed', { surveyId, errorMessage } as ExportFailedEventParam);
	};

	return {
		auth,
		exportOptions,
		outputDirectory,
		getSurveyName,
		getNextSurveyId,
		notifyExportProgress,
		notifyExportFileProgress,
		notifyExportSuccess,
		notifyExportFailed
	};
};

export default createServer;
