import { ExportOptionQuestion } from '@/types';

const TIMEZONES = [
	'Pacific/Midway',
	'Pacific/Honolulu',
	'America/Anchorage',
	'America/Los_Angeles',
	'America/Phoenix',
	'America/Denver',
	'Canada/East-Saskatchewan',
	'America/Chicago',
	'America/Rio_Branco',
	'America/New_York',
	'Canada/Atlantic',
	'America/La_Paz',
	'Canada/Newfoundland',
	'America/Montevideo',
	'America/Argentina/Buenos_Aires',
	'America/Noronha',
	'Atlantic/Azores',
	'Atlantic/Cape_Verde',
	'Atlantic/Reykjavik',
	'Europe/London',
	'Europe/Berlin',
	'Africa/Bangui',
	'Europe/Athens',
	'Africa/Harare',
	'Europe/Moscow',
	'Africa/Nairobi',
	'Asia/Tehran',
	'Asia/Muscat',
	'Asia/Baku',
	'Asia/Kabul',
	'Asia/Yekaterinburg',
	'Asia/Karachi',
	'Asia/Calcutta',
	'Asia/Katmandu',
	'Asia/Dhaka',
	'Asia/Novosibirsk',
	'Asia/Rangoon',
	'Asia/Krasnoyk',
	'Asia/Yakutsk',
	'Asia/Seoul',
	'Australia/Daarsk',
	'Asia/Bangkorwin',
	'Australia/Adelaide',
	'Australia/Brisbane',
	'Australia/Canberra',
	'Asia/Magadan',
	'Pacific/Auckland',
	'Pacific/Fiji',
	'Pacific/Tongatapu'
];

export const BASIC: Array<ExportOptionQuestion> = [
	{
		id: 'format',
		title: 'Format of the export file',
		description: 'This can be one of: csv, tsv, json, ndjson, spss, or xml',
		type: 'select',
		required: true,
		options: ['csv', 'tsv', 'json', 'ndjson', 'spss', 'xml']
	},
	{
		id: 'compress',
		title: 'Compress the final export file as a ZIP file',
		description: 'The data is combined into a compressed ZIP file in order to reduce the overall file size. Exporting without compression is only recommended for small exports. Large exports may encounter issues when downloading the large files',
		type: 'boolean'
	},
	{
		id: 'allowContinuation',
		title: 'Export with continuation',
		description: 'Continuation gives you the ability to export new responses since the last export (done with continuation). A file exported with continuation will include the last response from the previous export, and all the responses from after the last export',
		type: 'boolean'
	}
];

export const ADVANCED: Array<ExportOptionQuestion> = [
	{
		id: 'formatDecimalAsComma',
		title: 'Use commas for decimals',
		description: 'All decimal characters in the data output are replaced by commas',
		type: 'boolean'
	},
	{
		id: 'breakoutSets',
		title: 'Split multi-value fields into columns',
		description: 'Certain question types allow for multiple answer choices to be selected for a single question. This option splits each possible answer to the question into a unique column, rather than combining every chosen answer into a single column',
		type: 'boolean'
	},
	{
		id: 'seenUnansweredRecode',
		title: 'Recode seen but unanswered questions as -99',
		description: 'By default, questions that participants chose not to answer are left blank in the survey data. When this option is enabled, any questions that participants saw and chose not to answer are coded as a value of -99 in order to distinguish them from questions participants didn’t see',
		type: 'boolean'
	},
	{
		id: 'multiselectSeenUnansweredRecode',
		title: 'Recode seen but unanswered multi-value fields as 0',
		description: 'This option is similar to “Recode seen but unanswered questions as -99”, but only applies to multi-value fields',
		type: 'boolean'
	},
	{
		id: 'includeDisplayOrder',
		title: 'Export viewing order data for randomized surveys',
		description: 'When this option is enabled, columns are added to your dataset for each randomized element in your survey. These columns contain information on the order in which your randomized blocks, questions, or answer choices were displayed to the individual respondent',
		type: 'boolean'
	},
	{
		id: 'useLabels',
		title: 'Use choice text',
		description: 'Instead of exporting the recode (numeric) value for the answer choice, export the text of the answer choice',
		type: 'boolean'
	},
	{
		id: 'timeZone',
		title: 'Timezone',
		description: 'Timezone used to determine response date values. Data is recorded in UTC, and translates that value to your local time. This can be useful for local survey deadlines. If this parameter is not provided, dates will be exported in UTC/GMT',
		type: 'select',
		options: TIMEZONES
	}
];
