(function(e, a) { for(var i in a) e[i] = a[i]; }(/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./worker/app-workers/app.workers.ts":
/*!*******************************************!*\
  !*** ./worker/app-workers/app.workers.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cpu_intensive_worker_1 = __webpack_require__(/*! ./cpu-intensive.worker */ "./worker/app-workers/cpu-intensive.worker.ts");
var worker_message_model_1 = __webpack_require__(/*! ./shared/worker-message.model */ "./worker/app-workers/shared/worker-message.model.ts");
var worker_topic_constants_1 = __webpack_require__(/*! ./shared/worker-topic.constants */ "./worker/app-workers/shared/worker-topic.constants.ts");
var AppWorkers = /** @class */ (function () {
    function AppWorkers(workerCtx) {
        this.workerCtx = workerCtx;
        this.created = new Date();
    }
    AppWorkers.prototype.workerBroker = function ($event) {
        var _a = $event.data, topic = _a.topic, data = _a.data;
        var workerMessage = new worker_message_model_1.WorkerMessage(topic, data);
        switch (topic) {
            case worker_topic_constants_1.WORKER_TOPIC.cpuIntensive:
                this.workerCPUIntensive(workerMessage);
                break;
            default:// Add support for more workers here
                console.error('Topic Does Not Match');
        }
    };
    AppWorkers.prototype.workerCPUIntensive = function (value) {
        this.returnWorkResults(cpu_intensive_worker_1.CPUIntensiveWorker.doWork(value));
    };
    /**
     * Posts results back through to the worker
     * @param {WorkerMessage} message
     */
    AppWorkers.prototype.returnWorkResults = function (message) {
        this.workerCtx.postMessage(message);
    };
    return AppWorkers;
}());
exports.AppWorkers = AppWorkers;


/***/ }),

/***/ "./worker/app-workers/cpu-intensive.worker.ts":
/*!****************************************************!*\
  !*** ./worker/app-workers/cpu-intensive.worker.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var worker_message_model_1 = __webpack_require__(/*! ./shared/worker-message.model */ "./worker/app-workers/shared/worker-message.model.ts");
var CPUIntensiveWorker = /** @class */ (function () {
    function CPUIntensiveWorker() {
    }
    CPUIntensiveWorker.doWork = function (value) {
        var before = new Date();
        var count = 0;
        while (true) {
            count++;
            var now = new Date();
            if (now.valueOf() - before.valueOf() > value.data.duration) {
                break;
            }
        }
        return new worker_message_model_1.WorkerMessage(value.topic, { iteration: count });
    };
    return CPUIntensiveWorker;
}());
exports.CPUIntensiveWorker = CPUIntensiveWorker;


/***/ }),

/***/ "./worker/app-workers/shared/worker-message.model.ts":
/*!***********************************************************!*\
  !*** ./worker/app-workers/shared/worker-message.model.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WorkerMessage = /** @class */ (function () {
    function WorkerMessage(topic, data) {
        this.topic = topic;
        this.data = data;
    }
    WorkerMessage.getInstance = function (value) {
        var topic = value.topic, data = value.data;
        return new WorkerMessage(topic, data);
    };
    return WorkerMessage;
}());
exports.WorkerMessage = WorkerMessage;


/***/ }),

/***/ "./worker/app-workers/shared/worker-topic.constants.ts":
/*!*************************************************************!*\
  !*** ./worker/app-workers/shared/worker-topic.constants.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKER_TOPIC = {
    cpuIntensive: 'cupIntensive',
    imageProcessor: 'imageProcessor'
};


/***/ }),

/***/ "./worker/main.worker.ts":
/*!*******************************!*\
  !*** ./worker/main.worker.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var app_workers_1 = __webpack_require__(/*! ./app-workers/app.workers */ "./worker/app-workers/app.workers.ts");
exports.worker = new app_workers_1.AppWorkers(self);
addEventListener('message', function ($event) {
    exports.worker.workerBroker($event);
});
exports.LAZY_MODULE_MAP = {};


/***/ }),

/***/ 0:
/*!*************************************!*\
  !*** multi ./worker/main.worker.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! G:\My Documents\Development\Git\fractal-viewer\worker\main.worker.ts */"./worker/main.worker.ts");


/***/ })

/******/ })));
//# sourceMappingURL=main.js.map
