export interface Map<T> {
	[key: string]: T;
}

export interface SelectOption {
	value: string;
	label: string;
}

export interface NavigationMenuItem {
	path: string;
	name: string;
	description: string;
}

export type SortBy = 'name' | 'isActive' | 'creationDate' | 'lastModified';
export type SortOrder = 'ascending' | 'descending';

export interface SortCriteria {
	by: SortBy;
	order: SortOrder; 
}

export interface Header {
	id: string;
	name: string;
	class?: string;
}

export type AlertType = 'info' | 'success' | 'warning' | 'error';
export type NotificationType = AlertType;
export type NavigationMenuPosition = 'left' | 'center';

export interface State {
	configuration: Configuration;
	current: Current;
	qualtrics: Qualtrics;
	user?: User;
	surveys: Survey[];
	selectedIds: string[];
	exportOptions: ExportOptions;
	exportProgress: ExportProgress;
}

export interface Current {
	keyword: string;
	activeOnly: boolean;
	sortCriteria: SortCriteria;
	isLoading: boolean;
	showAdvancedOptions: boolean;
	isExporting: boolean;
	errorMessage?: string;
}

export interface Configuration {
	rememberApiToken: boolean;
	rememberSurveys: boolean;
	rememberSelectedIds: boolean;
	navigationMenuPosition: NavigationMenuPosition;
}

export interface ExportOptions extends Map<string | boolean | undefined> {
	format: string;
	compress: boolean;
	allowContinuation: boolean;
	formatDecimalAsComma: boolean;
	breakoutSets: boolean;
	seenUnansweredRecode: boolean;
	multiselectSeenUnansweredRecode: boolean;
	includeDisplayOrder: boolean;
	useLabels: boolean;
	timeZone: string;
}

export interface ExportOptionQuestion {
	id: string;
	title: string;
	description: string;
	type: 'boolean' | 'select';
	required?: boolean;
	options?: string[];
	value?: boolean | string;
}

export interface ExportProgressDetail {
	id: string;
	name: string;
	exportStatus?: 'inProgress' | 'complete' | 'failed';
	exportProgress?: number;
	downloadProgress?: number;
	downloadedTime?: number;
}
export interface ExportProgress extends Map<ExportProgressDetail> {}

// export interface Preferences {
// 	dataCenter?: string;
// 	activeSurveyOnly?: boolean;
// 	lastSelectedSurveys?: string[];
// 	exportWithContinuation?: boolean;
// 	exportFormat?: string;
// 	compressExportFile?: boolean;
// }

// export interface Answer extends Preferences {
// 	apiToken?: string;
// 	loadPreferences?: boolean;
// 	selectedSurveys?: string[];
// 	savePreferences?: boolean;
// }

export interface ApiAuthorization {
	dataCenter: string;
	apiToken: string;
}

export interface Qualtrics {
	accessible: boolean;
	dataCenter: string;
	apiToken?: string;
	errorMessage?: string;
}

export interface Error {
	errorMessage: string;
	errorCode: string;
}
export interface Meta {
	httpStatus: string;
	requestId: string;
	notice?: string;
}
export interface MetaWithError extends Meta {
	error: Error;
}

export interface User {
	brandId?: string;
	userId?: string;
	userName?: string;
	accountType?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	datacenter?: string;
}

export interface Survey {
	id: string;
	name: string;
	ownerId: string;
	lastModified: string;
	creationDate: string;
	isActive: boolean;
}
export interface ListSurveysResult {
	elements: Array<Survey>;
	nextPage: string | null;
}

export type ResponseExportStatus = "complete" | "failed" | "inProgress" | undefined;
export interface ResponseExportProgress {
	percentComplete: number;
	status: ResponseExportStatus;
	continuationToken?: string;
}
export interface StartExportRequestData {
	format: string;
	compress: boolean;
	allowContinuation?: boolean;
	continuationToken?: string;
}
export interface StartExportResult extends ResponseExportProgress {
	progressId: string;
}
export interface ExportProgressResult extends ResponseExportProgress {
	fileId?: string;
}

export interface ApiResponse {
	meta: Meta;
}
export interface ApiErrorResponse {
	meta: MetaWithError;
}
export interface WhoAmIResponse extends ApiResponse {
	result: User;
}
export interface ListSurveysResponse extends ApiResponse {
	result: ListSurveysResult;
}
export interface StartExportResponse extends ApiResponse {
	result: StartExportResult;
}
export interface ExportProgressResponse extends ApiResponse {
	result: ExportProgressResult;
}

export interface ApiError {
	status: number;
	statusText: string;
	message?: string;
}

export interface PoolOptions extends ApiAuthorization {
	internalApiPort: number;
	surveys: Survey[],
	exportWithContinuation: boolean;
	exportFormat: string;
	compressExportFile: boolean;
	exportFileDirectory: string;
	logFilePath: string;
}
export interface RunnableOptions extends PoolOptions{
	id: string;
}
export type Runnable = (options: RunnableOptions) => Promise<void>;

interface ExportFailedRequestBody {
	surveyId: string;
	errorMessage: string;
}
export interface ExportFailedSurvey {
	id: string;
	name: string;
	error: string;
}

// eslint-disable-next-line
type EventListener = (...args: any[]) => void;
export type FunctionLike = EventListener;

export type ApiAction = 'signIn';
export type ApiEvent = 'serverReady' | 'signedIn' | 'signInFailed';

declare global {
	interface Window {
		api: {
			// loadConfiguration: () => void;
			// saveConfiguration: (configuration: Configuration) => void;
			signIn: (param: ApiAuthorization) => void;
			on: (event: ApiEvent, listener: EventListener) => void;
		}
	}
}
