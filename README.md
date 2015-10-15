## Run

To build and serve the app locally:

```
$ npm install -g firebase-tools
$ npm install
$ npm run build
$ firebase serve
```

Then open your browser to [localhost:5000](http://localhost:5000).

## Deploy

To deploy the app to firebase:
 1. Edit firebase.json to point to your Firebase url, then:

```
$ npm install -g firebase-tools
$ npm install
$ npm run build
$ firebase deploy
```

## Develop

To develop locally, with automatic build and livereload support
using [webpack-dev-server](https://github.com/webpack/webpack-dev-server):

```
$ npm install
$ npm run serve
```

Then open your browser to [localhost:8080](http://localhost:8080).
