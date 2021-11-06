import { WebContents } from 'electron';

// --------------------------------- Base --------------------------------------
export interface Map<T> {
	[key: string]: T;
}

// ---------------------------------- UI ---------------------------------------

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

export interface ExportOptionQuestion {
	id: string;
	title: string;
	description: string;
	type: 'boolean' | 'select';
	required?: boolean;
	options?: string[];
}

// --------------------------------- State -------------------------------------

export interface Settings {
	rememberMe: boolean;
	navigationMenuPosition: NavigationMenuPosition;
	exportDirectory?: string;
}

export interface Current {
	appReady: boolean;
	keyword: string;
	activeOnly: boolean;
	sortCriteria: SortCriteria;
	isLoading: boolean;
	showAdvancedOptions: boolean;
	isExporting: boolean;
	exportDirectory?: string;
	errorMessage?: string;
}

export interface QualtricsAuthorization {
	apiToken?: string;
	dataCenter: string;
}

export interface Qualtrics extends QualtricsAuthorization {
	accessible: boolean;
	errorMessage?: string;
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

export interface ExportOptions extends Map<string | boolean | number | undefined> {
	format: string;
	compress: boolean;
	allowContinuation: boolean;
	formatDecimalAsComma: boolean;
	breakoutSets: boolean;
	seenUnansweredRecode: boolean | number;
	multiselectSeenUnansweredRecode: boolean | number;
	includeDisplayOrder: boolean;
	useLabels: boolean;
	timeZone: string;
}

export interface ExportProgressDetail {
	id: string;
	name: string;
	exportStatus?: 'inProgress' | 'complete' | 'failed';
	exportProgress?: number;
	downloadProgress?: number;
	downloadedTime?: number;
}

export type ExportProgress = Map<ExportProgressDetail>

export interface State {
	settings: Settings;
	current: Current;
	qualtrics: Qualtrics;
	user?: User;
	surveys: Survey[];
	selectedIds: string[];
	exportOptions: ExportOptions;
	exportProgress: ExportProgress;
}

// ----------------------------- Qualtrics API ---------------------------------

export interface ApiAuthorization {
	dataCenter: string;
	apiToken: string;
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

export interface ListSurveysResult {
	elements: Array<Survey>;
	nextPage: string | null;
}

export type ResponseExportStatus = 'complete' | 'failed' | 'inProgress' | undefined;
export interface ResponseExportProgress {
	percentComplete: number;
	status: ResponseExportStatus;
	continuationToken?: string;
}
export interface StartExportRequestData extends Partial<ExportOptions> {
	format: string;
	continuationToken?: string;
}
export interface StartExportResult extends ResponseExportProgress {
	progressId: string;
}
export interface ExportProgressResult extends ResponseExportProgress {
	fileId?: string;
}
export type ExportFileProgressCallback = (receivedBytes: number, totalBytes: number) => void;

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

// ---------------------------- Application API --------------------------------

export type ApiAction = 'saveSettings' | 'saveQualtrics' | 'selectDirectory' | 'openDirectory' | 'signIn' | 'retrieveSurveys' | 'exportResponses';
export interface SaveSettingsActionParam { settings: Settings }
export interface SaveQualtricsActionParam { auth: QualtricsAuthorization }
export interface SelectDirectoryActionParam { path?: string }
export interface OpenDirectoryActionParam { path?: string }
export interface SignInActionParam { auth: ApiAuthorization }
export interface RetrieveSurveysActionParam { auth: ApiAuthorization }
export interface ExportResponsesActionParam { auth: ApiAuthorization, selectedIds: string[], surveys: Survey[], exportOptions: ExportOptions, exportDirectory?: string }

export type ApiEvent = 'ready' | 'settingsMenuClicked' | 'signedIn' | 'signInFailed' | 'surveysRetrieved' | 'retrieveSurveysFailed' | 'exportProgress' | 'exportFileProgress' | 'exportSuccess' | 'exportFailed' | 'responsesExported';
export interface ReadyEventParam { settings: Settings, qualtrics?: QualtricsAuthorization }
export interface SignedInEventParam { user: User, auth: ApiAuthorization }
export interface SignInFailedEventParam { error: ApiError, auth: ApiAuthorization }
export interface SurveysRetrievedEventParam { surveys: Array<Survey> }
export interface RetrieveSurveysFailedEventParam { error: ApiError }
export interface ExportProgressEventParam { surveyId: string, status: ResponseExportStatus, percentComplete: number }
export interface ExportFileProgressEventParam { surveyId: string, percentComplete: number }
export interface ExportSuccessEventParam { surveyId: string }
export interface ExportFailedEventParam { surveyId: string, errorMessage: string }
export interface ResponseExportedEventParam { exportDirectory: string }

// eslint-disable-next-line
type EventListener = (...args: any[]) => void;
export type FunctionLike = EventListener;

export interface ServerParam extends ExportResponsesActionParam { webContents: WebContents }
export interface Server {
	auth: ApiAuthorization;
	exportOptions: ExportOptions;
	outputDirectory: string;
	getSurveyName: (surveyId: string) => string;
	getNextSurveyId: () => Promise<string | null>;
	notifyExportProgress: (surveyId: string, status: ResponseExportStatus, percentComplete: number) => Promise<void>;
	notifyExportFileProgress: (surveyId: string, percentComplete: number) => Promise<void>;
	notifyExportSuccess: (surveyId: string) => Promise<void>;
	notifyExportFailed: (surveyId: string, errorMessage: string) => Promise<void>;
}

export interface WorkerParam { id: number, server: Server }
export interface Worker {
	run: () => Promise<void>;
}

declare global {
	interface Window {
		api: {
			saveSettings: (param: SaveSettingsActionParam) => void;
			saveQualtrics: (param: SaveQualtricsActionParam) => void;
			selectDirectory: (param: SelectDirectoryActionParam) => Promise<string>;
			openDirectory: (param: OpenDirectoryActionParam) => void;
			signIn: (param: SignInActionParam) => void;
			retrieveSurveys: (param: RetrieveSurveysActionParam) => void;
			exportResponses: (param: ExportResponsesActionParam) => void;
			on: (event: ApiEvent, listener: EventListener) => void;
		}
	}
}

// ---------------------------- ??????????????? --------------------------------

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

export interface ExportFailedSurvey {
	id: string;
	name: string;
	error: string;
}
