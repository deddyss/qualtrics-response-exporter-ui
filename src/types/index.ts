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
	errorMessage?: string;
}

export interface Qualtrics {
	accessible: boolean;
	dataCenter: string;
	apiToken?: string;
	errorMessage?: string;
}

export type QualtricsAuthorization = Pick<Qualtrics, 'dataCenter' | 'apiToken'>;

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

export interface ExportProgressDetail {
	id: string;
	name: string;
	exportStatus?: 'inProgress' | 'complete' | 'failed';
	exportProgress?: number;
	downloadProgress?: number;
	downloadedTime?: number;
}

export interface ExportProgress extends Map<ExportProgressDetail> {}

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

// ---------------------------- Application API --------------------------------

export interface ReadyParam { settings: Settings, qualtrics?: QualtricsAuthorization }
export interface SignedInParam { user: User, auth: ApiAuthorization }
export interface SignInFailedParam { error: ApiError, auth: ApiAuthorization }
export interface SurveysRetrievedParam { surveys: Array<Survey> }
export interface RetrieveSurveysFailedParam { error: ApiError }

// eslint-disable-next-line
type EventListener = (...args: any[]) => void;
export type FunctionLike = EventListener;

export type ApiAction = 'signIn' | 'saveSettings' | 'saveQualtrics' | 'selectDirectory' | 'retrieveSurveys';
export type ApiEvent = 'ready' | 'settingsMenuClicked' | 'signedIn' | 'signInFailed' | 'surveysRetrieved' | 'retrieveSurveysFailed';

declare global {
	interface Window {
		api: {
			// loadConfiguration: () => void;
			// saveConfiguration: (configuration: Configuration) => void;
			saveSettings: (settings: Settings) => void;
			saveQualtrics: (auth: QualtricsAuthorization) => void;
			selectDirectory: (path?: string) => Promise<string>;
			signIn: (auth: ApiAuthorization) => void;
			retrieveSurveys: (auth: ApiAuthorization) => void;
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

interface ExportFailedRequestBody {
	surveyId: string;
	errorMessage: string;
}
export interface ExportFailedSurvey {
	id: string;
	name: string;
	error: string;
}
