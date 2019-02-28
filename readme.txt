The build-worker and serve-worker sections have been added to angular.json.
Two packages have been added to assist with compilation of the worker correctly:
    angular-devkit/build-angular
    replace-in-file-webpack-plugin
Worker is compiled into assets/workers/main.js.
Used https://github.com/patidar-suresh/angular6-webworker as a reference.

Use 'npm run start' to serve and 'npm run build' to build.
