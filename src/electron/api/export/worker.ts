import path from 'path';
import { ResponseExport } from '@/api/qualtrics';
import { random, sanitizeFilename, sleep } from '@/electron/api/util';
import { getContinuationToken, putContinuationToken } from '@/electron/api/storage/continuation';
import { ExportProgressResult, StartExportRequestData, Worker, WorkerParam } from '@/types';

interface WorkerProperties extends WorkerParam {
	api: ResponseExport;
}

const startQualtricsResponseExport = async (surveyId: string, props: WorkerProperties) => {
	const { api, server } = props;
	const { exportOptions } = server;
	const continuationToken = getContinuationToken(surveyId);

	const exportRequestData = {} as StartExportRequestData;
	Object.entries(exportOptions).forEach(([key, value]) => {
		if (value) {
			exportRequestData[key] = value;
		}
	});
	if (exportRequestData.allowContinuation && continuationToken) {
		exportRequestData.continuationToken = continuationToken;
	}
	else {
		exportRequestData.allowContinuation = true;
	}

	const exportProgress = await api.startExport(surveyId, exportRequestData);
	// notify
	const { status, percentComplete } = exportProgress;
	await server.notifyExportProgress(surveyId, status, percentComplete);

	return exportProgress.progressId;
};

const getQualtricsResponseExportProgress = async (surveyId: string, progressId: string, props: WorkerProperties) => {
	const { api } = props;
	const result = await api.getExportProgress(surveyId, progressId);
	return result;
};

const getQualtricsResponseExportFile = async (surveyId: string, fileId: string, props: WorkerProperties) => {
	const { api, server } = props;
	const { exportOptions: options, outputDirectory } = server;
	const surveyName = server.getSurveyName(surveyId);
	const fileName = `${sanitizeFilename(surveyName)}.${options.format}${options.compress ? '.zip' : ''}`;
	const filePath = path.join(outputDirectory, fileName);

	await api.getExportFile(
		surveyId,
		fileId,
		filePath,
		(receivedBytes, totalBytes) => {
			if (totalBytes > 0) {
				const percentComplete = Math.round((receivedBytes / totalBytes) * 100);
				server.notifyExportFileProgress(surveyId, percentComplete);
			}
		}
	);
};

const runQualtricsResponseExportProcess = async (surveyId: string, props: WorkerProperties) => {
	const { server } = props;
	const progressId = await startQualtricsResponseExport(surveyId, props);

	let exportProgress: ExportProgressResult;
	do {
		await sleep(random(1_000, 5_000));
		// after some delay
		exportProgress = await getQualtricsResponseExportProgress(surveyId, progressId, props);

		// notify
		const { status, percentComplete } = exportProgress;
		await server.notifyExportProgress(surveyId, status, percentComplete);
	}
	// loop until completed or failed
	while (exportProgress.status === 'inProgress');

	if (exportProgress.status === 'complete') {
		const fileId = exportProgress.fileId as string;
		await getQualtricsResponseExportFile(surveyId, fileId, props);
		putContinuationToken(surveyId, exportProgress.continuationToken as string);
	}
	else {
		throw new Error('Failed to export responses');
	}
};

const runWorker = async (props: WorkerProperties) => {
	const { server } = props;

	let surveyId: string | null;
	while ((surveyId = await server.getNextSurveyId()) !== null) {
		try {
			await runQualtricsResponseExportProcess(surveyId, props);
			await server.notifyExportSuccess(surveyId);
		}
		catch (err) {
			const error = err as Error;
			await server.notifyExportFailed(surveyId, error.message);
		}
		// wait
		await sleep(1_000);
	}
};

const createWorker = (param: WorkerParam): Worker => {
	const { id, server } = param;
	const api = new ResponseExport(server.auth);

	const run = () => runWorker({ id, server, api });
	return { run };
};

export default createWorker;
