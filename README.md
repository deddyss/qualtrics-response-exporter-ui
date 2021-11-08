# Qualtrics Response Exporter UI
Web-based desktop application to export survey responses

## About The Project
If you have so many [Qualtrics](https://www.qualtrics.com) surveys and want to export its responses at once without having to click repeatedly on the web page, then this is the right tool for you.

![Sign-in](images/1-sign-in.jpg)

![Survey List](images/2-survey-list.jpg)

![Export Options](images/3-export-options.jpg)

![Export Progress](images/4-export-progress.jpg)

![Settings](images/5-settings.jpg)


### Built With
* [TypeScript](https://www.typescriptlang.org/)
* [Vue.js](https://v3.vuejs.org/)
* [Tailwind	CSS](https://tailwindcss.com/)
* [Electron.js](https://www.electronjs.org/)
* [Axios HTTP Client](https://axios-http.com/)
* [Limiter](https://github.com/jhurliman/node-rate-limiter)

## Getting Started
### Prerequisites
1. Your Qualtrics account must have access to the Qualtrics API feature. You need that access to generate an API token that will be used by this app.
2. You need to install [Node.js](https://nodejs.org/) runtime and [Git](https://git-scm.com/) on your machine.

### Installation
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

## Development
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

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Attributions
* Application icon made by <a href="https://www.flaticon.com/authors/stockes-design" title="Stockes Design">Stockes Design</a> from <a href="https://www.flaticon.com/" title="Flaticon">Flaticon.com</a>
* Photos on sign-in page are retrieved from <a href="https://unsplash.com/">Unsplash.com</a>
* I customized the background on settings page at [SVGBackgrounds.com](https://www.svgbackgrounds.com/)

## Acknowledgements
* [Electron builder](https://www.electron.build/)
* [Jest](https://jestjs.io/)
* [Denque](https://github.com/invertase/denque)
* [Async-lock](https://github.com/rogierschouten/async-lock)
* [Webpack](https://webpack.js.org/)
