<p align="center">
	<a href="http://lokalkauf.org">
		<img width="460" src="https://raw.githubusercontent.com/lokalkauf/lokalkauf-frontend/develop/src/assets/lokalkauf-logo.svg">
	</a>
</p>

# lokalkauf - Frontend

[lokalkauf](https://lokalkauf.org) is an easy to use online platform to set up local shops with an online shop, which allows them to supply their customers via a local delivery chain.
This can keep businesses running, even in times of social distancing.

Created during the [WirvsVirus Hackerthon](https://wirvsvirushackathon.org).

## Setup

Run `npm i`

Run `npm install -g @angular/cli`

## Development server

### Starting the frontend locally

Run `npm run start` for a dev server. Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Starting the firebase emulators locally

Run `npm run emulators:setup` to install the firebase emulators locally. Then start everything up running `npm run emulators`. The emulator will serve the contents out of the `dist` directory. Make sure you run `npm run build` in advance to start the emulators.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
