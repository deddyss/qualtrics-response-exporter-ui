import { app, protocol, BrowserWindow, shell, Menu } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import { loadQualtricsAuthorization, loadSettings, registerEventListeners } from '@/electron/api';
import { notify } from '@/electron/api/util';
import { initKey } from '@/electron/encryptor';
import menu from '@/electron/menu';
import { ReadyEventParam } from '@/types';

const isDevelopment = process.env.NODE_ENV !== 'production';

// scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true } }
]);

const createWindow = async () => {
	const window = new BrowserWindow({
		width: 1366,
		height: 768,
		minWidth: 500,
		minHeight: 768,
		show: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			// use pluginOptions.nodeIntegration, leave this alone
			// see nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: (process.env
				.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
		}
	});
	window.maximize();
	window.show();

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// load the url of the dev server if in development mode
		await window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
		window.webContents.openDevTools();
	}
	else {
		createProtocol('app');
		// load the index.html when not in development
		window.loadURL('app://./index.html');
	}
	// open
	window.webContents.setWindowOpenHandler(({ url }) => {
		setImmediate(() => shell.openExternal(url));
		return { action: 'deny' };
	});

	// set app menu
	Menu.setApplicationMenu(menu);
	// initiate encryption key
	await initKey();
	// register event listener
	registerEventListeners(window);

	// load settings
	const settings = loadSettings();
	// load qualtrics authorization (if any)
	const qualtrics = loadQualtricsAuthorization();
	// notify that application is ready now
	notify(window.webContents).that('ready', { settings, qualtrics } as ReadyEventParam);
};

const runMiscellaneousScript = () => {
	// quit when all windows are closed.
	app.on('window-all-closed', () => {
		// on macOS it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		// on macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});

	// exit cleanly on request from parent process in development mode.
	if (isDevelopment) {
		if (process.platform === 'win32') {
			process.on('message', (data) => {
				if (data === 'graceful-exit') {
					app.quit();
				}
			});
		}
		else {
			process.on('SIGTERM', () => {
				app.quit();
			});
		}
	}
};

const background = async () => {
	// this method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// some APIs can only be used after this event occurs.
	app.on('ready', async () => {
		if (isDevelopment && !process.env.IS_TEST) {
			// Install Vue Devtools
			try {
				await installExtension(VUEJS3_DEVTOOLS);
			}
			catch (e) {
				console.error('Vue Devtools failed to install: ', e);
			}
		}
		await createWindow();
	});
	runMiscellaneousScript();
};

background();
