import { Menu, MenuItemConstructorOptions } from "electron";
import { notify } from './api';

const template: MenuItemConstructorOptions[] = [
	{
		label: "App",
		submenu: [
			{
				label: "Settings",
				accelerator: "CmdOrCtrl+,",
				click: (item, focusedWindow) => {
					if (focusedWindow) {
						notify(focusedWindow.webContents).that('settingsMenuClicked');
					}
				}
			},
			{
				type: "separator"
			},
			{
				label: "Exit",
				accelerator: "CmdOrCtrl+Q",
				role: "quit"
			}
		]
	},
	{
		label: "Edit",
		submenu: [
			{
				label: "Undo",
				accelerator: "CmdOrCtrl+Z",
				role: "undo"
			},
			{
				label: "Redo",
				accelerator: "Shift+CmdOrCtrl+Z",
				role: "redo"
			},
			{
				type: "separator"
			},
			{
				label: "Cut",
				accelerator: "CmdOrCtrl+X",
				role: "cut"
			},
			{
				label: "Copy",
				accelerator: "CmdOrCtrl+C",
				role: "copy"
			},
			{
				label: "Paste",
				accelerator: "CmdOrCtrl+V",
				role: "paste"
			},
			{
				label: "Select All",
				accelerator: "CmdOrCtrl+A",
				role: "selectAll"
			}
		]
	},
	{
		label: "View",
		submenu: [
			{
				label: "Reload",
				accelerator: "CmdOrCtrl+R",
				click: (item, focusedWindow) => {
					if (focusedWindow) {
						focusedWindow.reload();
					}
				}
			},
			{
				label: "Toggle Full Screen",
				accelerator: (() => {
					if (process.platform === "darwin") {
						return "Ctrl+Command+F";
					}
					return "F11";
				})(),
				click: (item, focusedWindow) => {
					if (focusedWindow) {
						focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
					}
				}
			},
			{
				label: "Toggle Developer Tools",
				accelerator: (() => {
					if (process.platform === "darwin") {
						return "Alt+Command+I";
					}

					return "Ctrl+Shift+I";
				})(),
				click: (item, focusedWindow) => {
					if (focusedWindow) {
						focusedWindow.webContents.toggleDevTools();
					}
				}
			}
		]
	},
	{
		label: "Window",
		role: "window",
		submenu: [
			{
				label: "Minimize",
				accelerator: "CmdOrCtrl+M",
				role: "minimize"
			},
			{
				label: "Close",
				accelerator: "CmdOrCtrl+W",
				role: "close"
			}
		]
	}
];

export default Menu.buildFromTemplate(template);
