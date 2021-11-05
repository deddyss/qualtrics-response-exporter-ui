import { RateLimiter } from 'limiter';
import { AxiosError, AxiosResponse } from 'axios';
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
			// TODO:
			console.log('startExport.data: %O', data);
			this.sendHttpPostRequest<StartExportResponse>({
				url: startExportUrl(surveyId),
				data,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((response: AxiosResponse<StartExportResponse>) => {
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
					const apiError: ApiError = this.parseError(error);
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
			const stream: WriteStream = createWriteStream(filePath);
			this.sendHttpGetFileStreamRequest({ url: exportFileUrl(surveyId, fileId) })
				.then((response: AxiosResponse<Stream>) => {
					let writeStreamError: Error | undefined;
					const totalBytes = parseInt(response.headers['content-length'] ?? '0', 10);
					// TODO:
					console.log('response.headers: %O', response.headers);
					console.log('totalBytes: %s', totalBytes);
					let receivedBytes = 0;

					stream.on('pipe', (chunk) => {
						receivedBytes += chunk.readableLength;
						// TODO:
						console.log('receivedBytes: %s', receivedBytes);
						if (progressCallback) {
							progressCallback(receivedBytes, totalBytes);
						}
					});
					stream.on('error', (error: Error) => {
						writeStreamError = error;
						stream.close();
						reject(writeStreamError);
					});
					stream.on('close', () => {
						if (!writeStreamError) {
							resolve();
						}
						else {
							reject(writeStreamError);
						}
					});
					response.data.pipe(stream);
				});
		});
	}
}

export default ResponseExport;
