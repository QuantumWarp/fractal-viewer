The build-worker and serve-worker sections have been added to angular.
Note: serve-worker not really working as expected, shouldn't error on npm start.

Run npm start to regenerate the worker. It gets saved into assets/workers.
The first exports part of the main.js needs to be removed since it doesn't work.

Then run like usual with 'ng s'.
