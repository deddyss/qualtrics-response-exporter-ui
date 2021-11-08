import { RateLimiter } from 'limiter';
import { AxiosError, AxiosResponse } from 'axios';
import progress from 'progress-stream';
import { createWriteStream, WriteStream } from 'fs';
import { Stream } from 'stream';
import { ApiError, ApiErrorResponse, ExportFileProgressCallback, ExportProgressResponse, ExportProgressResult, StartExportRequestData, StartExportResponse, StartExportResult } from '@/types';
import Api from './Api';

const startExportUrl = (surveyId: string) => `/surveys/${surveyId}/export-responses`;
const exportProgressUrl = (surveyId: string, progressId: string) => `/surveys/${surveyId}/export-responses/${progressId}`;
const exportFileUrl = (surveyId: string, fileId: string) => `/surveys/${surveyId}/export-responses/${fileId}/file`;

const startExportLimiter = new RateLimiter({ tokensPerInterval: 100, interval: 'minute' });
const exportProgressLimiter = new RateLimiter({ tokensPerInterval: 1000, interval: 'minute' });
const exportFileLimiter = new RateLimiter({ tokensPerInterval: 100, interval: 'minute' });

class ResponseExport extends Api {
	public async startExport(surveyId: string, data: StartExportRequestData)
		: Promise<StartExportResult> {
		await startExportLimiter.removeTokens(1);

		return new Promise<StartExportResult>((resolve, reject) => {
			this.sendHttpPostRequest<StartExportResponse>({
				url: startExportUrl(surveyId),
				data,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((response: AxiosResponse<StartExportResponse>) => {
				resolve(response.data.result);
			})
			.catch((error: AxiosError<ApiErrorResponse>) => {
				const apiError: ApiError = Api.parseError(error);
				reject(new Error(apiError.message ? apiError.message : apiError.statusText));
			});
		});
	}

	public async getExportProgress(surveyId: string, progressId: string): Promise<ExportProgressResult> {
		await exportProgressLimiter.removeTokens(1);

		return new Promise<ExportProgressResult>((resolve, reject) => {
			this.sendHttpGetRequest<ExportProgressResponse>({ url: exportProgressUrl(surveyId, progressId) })
				.then((response: AxiosResponse<ExportProgressResponse>) => {
					resolve(response.data.result);
				})
				.catch((error: AxiosError<ApiErrorResponse>) => {
					const apiError: ApiError = Api.parseError(error);
					reject(new Error(apiError.message ? apiError.message : apiError.statusText));
				});
		});
	}

	public async getExportFile(
		surveyId: string,
		fileId: string,
		filePath: string,
		progressCallback?: ExportFileProgressCallback
	): Promise<void> {
		await exportFileLimiter.removeTokens(1);

		return new Promise<void>((resolve, reject) => {
			const writeStream: WriteStream = createWriteStream(filePath);
			this.sendHttpGetFileStreamRequest({ url: exportFileUrl(surveyId, fileId) })
				.then((response: AxiosResponse<Stream>) => {
					const length = parseInt(response.headers['content-length'] ?? '0', 10);
					let writeStreamError: Error | undefined;

					writeStream.on('error', (error: Error) => {
						writeStreamError = error;
						writeStream.close();
						reject(writeStreamError);
					});
					writeStream.on('close', () => {
						if (!writeStreamError) {
							resolve();
						}
						else {
							reject(writeStreamError);
						}
					});
					if (progressCallback) {
						const progressStream =  progress({ length, time: 10 });
						progressStream.on('progress', (stat) => {
							progressCallback(stat.transferred, stat.length);
						});
						response.data.pipe(progressStream).pipe(writeStream);
					}
					else {
						response.data.pipe(writeStream);
					}
				});
		});
	}
}

export default ResponseExport;
