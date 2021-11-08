# Development

## Prerequisites
1. You need to install [Node.js](https://nodejs.org/) runtime and [Git](https://git-scm.com/) on your machine.


## Installation
1. Open the terminal
2. Clone the repo
   ```sh
   git clone https://github.com/deddyss/qualtrics-response-exporter-ui.git
   ```
3. Go to project directory
   ```sh
   cd qualtrics-response-exporter-ui
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. Build the portable desktop application
   ```sh
   npm run electron:build
   ```


## Useful Commands
Use following commands for several different purposes during development or production
1. Starts a development server that comes with Hot-Module-Replacement (HMR) working out of the box
   ```sh
   npm run serve
   ```
2. Produces a production-ready bundle with minification for JS/CSS/HTML and auto vendor chunk splitting for better caching
   ```sh
   npm run build
   ```
3. Identical to point number 1, it's just that the app is wrapped into a desktop application using Electron
   ```sh
   npm run electron:serve
   ```
4. Runs unit tests
   ```sh
   npm run test:unit
   ```
4. Lints and fixes files
   ```sh
   npm run lint
   ```
