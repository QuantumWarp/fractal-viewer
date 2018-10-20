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
var fractal_processor_1 = __webpack_require__(/*! ./fractal-processers/fractal-processor */ "./worker/app-workers/fractal-processers/fractal-processor.ts");
var process_fractal_done_1 = __webpack_require__(/*! ./messages/process-fractal-done */ "./worker/app-workers/messages/process-fractal-done.ts");
var process_fractal_results_1 = __webpack_require__(/*! ./messages/process-fractal-results */ "./worker/app-workers/messages/process-fractal-results.ts");
var worker_message_enum_1 = __webpack_require__(/*! ./messages/worker-message.enum */ "./worker/app-workers/messages/worker-message.enum.ts");
var AppWorkers = /** @class */ (function () {
    function AppWorkers(workerCtx) {
        this.workerCtx = workerCtx;
    }
    AppWorkers.prototype.workerBroker = function ($event) {
        var message = $event.data;
        switch (message.type) {
            case worker_message_enum_1.WorkerMessageType.ProcessFractalInfo:
                this.startProcessor(message);
                break;
            default:
                console.error('Message not recognized');
        }
    };
    AppWorkers.prototype.startProcessor = function (params) {
        var _this = this;
        var processor = new fractal_processor_1.FractalProcessor(params);
        processor.process(function (coords) {
            return _this.workerCtx.postMessage(new process_fractal_results_1.ProcessFractalResults(coords));
        });
        this.workerCtx.postMessage(new process_fractal_done_1.ProcessFractalDone());
    };
    return AppWorkers;
}());
exports.AppWorkers = AppWorkers;


/***/ }),

/***/ "./worker/app-workers/fractal-processers/fractal-processor.ts":
/*!********************************************************************!*\
  !*** ./worker/app-workers/fractal-processers/fractal-processor.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fractal_factory_1 = __webpack_require__(/*! ../fractals/shared/fractal-factory */ "./worker/app-workers/fractals/shared/fractal-factory.ts");
var computed_point_1 = __webpack_require__(/*! ../shared/computed-point */ "./worker/app-workers/shared/computed-point.ts");
var coordinate_1 = __webpack_require__(/*! ../shared/coordinate */ "./worker/app-workers/shared/coordinate.ts");
var FractalProcessor = /** @class */ (function () {
    function FractalProcessor(params) {
        this.params = params;
        this.computedCoords = [];
        this.fractal = fractal_factory_1.FractalFactory.create(params.fractalParams);
        this.topLeftCoord = new coordinate_1.Coordinate(params.center.x - (params.increment * params.width / 2), params.center.y - (params.increment * params.height / 2));
    }
    FractalProcessor.prototype.process = function (resultCallback) {
        var x = 0;
        while (x < this.params.width) {
            var y = 0;
            while (y < this.params.height) {
                var coord = this.translateToCoord(x, y);
                var iterations = this.fractal.calculate(coord);
                this.computedCoords.push(new computed_point_1.ComputedPoint(x, y, iterations));
                y++;
            }
            resultCallback(this.computedCoords);
            this.computedCoords = [];
            x++;
        }
    };
    FractalProcessor.prototype.translateToCoord = function (x, y) {
        return new coordinate_1.Coordinate(this.topLeftCoord.x + (this.params.increment * x), this.topLeftCoord.y + (this.params.increment * y));
    };
    return FractalProcessor;
}());
exports.FractalProcessor = FractalProcessor;


/***/ }),

/***/ "./worker/app-workers/fractals/mandelbrot-set.ts":
/*!*******************************************************!*\
  !*** ./worker/app-workers/fractals/mandelbrot-set.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MandelbrotSet = /** @class */ (function () {
    function MandelbrotSet(params) {
        this.params = params;
    }
    MandelbrotSet.prototype.calculate = function (initialCoord) {
        var coord = initialCoord.clone();
        var count = 0;
        while (count < this.params.maxIterations) {
            coord = this.iterate(coord, initialCoord);
            if (!this.checkIsBounded(coord)) {
                return count;
            }
            count++;
        }
        return undefined;
    };
    MandelbrotSet.prototype.checkIsBounded = function (coord) {
        // Find the absolute value
        var value = (coord.x * coord.x) + (coord.y * coord.y);
        return value < (this.params.bound * this.params.bound);
    };
    MandelbrotSet.prototype.iterate = function (coord, initialCoord) {
        var x = coord.x;
        var y = coord.y;
        // Square the current term
        coord.x = (x * x) - (y * y);
        coord.y = 2 * x * y;
        // Add the initial value
        coord.x = coord.x + initialCoord.x;
        coord.y = coord.y + initialCoord.y;
        return coord;
    };
    return MandelbrotSet;
}());
exports.MandelbrotSet = MandelbrotSet;


/***/ }),

/***/ "./worker/app-workers/fractals/shared/fractal-factory.ts":
/*!***************************************************************!*\
  !*** ./worker/app-workers/fractals/shared/fractal-factory.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mandelbrot_set_1 = __webpack_require__(/*! ../mandelbrot-set */ "./worker/app-workers/fractals/mandelbrot-set.ts");
var fractal_type_enum_1 = __webpack_require__(/*! ./fractal-type.enum */ "./worker/app-workers/fractals/shared/fractal-type.enum.ts");
var FractalFactory = /** @class */ (function () {
    function FractalFactory() {
    }
    FractalFactory.create = function (params) {
        switch (params.type) {
            case fractal_type_enum_1.FractalType.MandelbrotSet:
                return new mandelbrot_set_1.MandelbrotSet(params);
        }
    };
    return FractalFactory;
}());
exports.FractalFactory = FractalFactory;


/***/ }),

/***/ "./worker/app-workers/fractals/shared/fractal-type.enum.ts":
/*!*****************************************************************!*\
  !*** ./worker/app-workers/fractals/shared/fractal-type.enum.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FractalType;
(function (FractalType) {
    FractalType[FractalType["MandelbrotSet"] = 0] = "MandelbrotSet";
})(FractalType = exports.FractalType || (exports.FractalType = {}));


/***/ }),

/***/ "./worker/app-workers/messages/process-fractal-done.ts":
/*!*************************************************************!*\
  !*** ./worker/app-workers/messages/process-fractal-done.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var worker_message_enum_1 = __webpack_require__(/*! ./worker-message.enum */ "./worker/app-workers/messages/worker-message.enum.ts");
var ProcessFractalDone = /** @class */ (function () {
    function ProcessFractalDone() {
        this.type = worker_message_enum_1.WorkerMessageType.ProcessFractalDone;
    }
    return ProcessFractalDone;
}());
exports.ProcessFractalDone = ProcessFractalDone;


/***/ }),

/***/ "./worker/app-workers/messages/process-fractal-results.ts":
/*!****************************************************************!*\
  !*** ./worker/app-workers/messages/process-fractal-results.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var worker_message_enum_1 = __webpack_require__(/*! ./worker-message.enum */ "./worker/app-workers/messages/worker-message.enum.ts");
var ProcessFractalResults = /** @class */ (function () {
    function ProcessFractalResults(computedPoints) {
        this.computedPoints = computedPoints;
        this.type = worker_message_enum_1.WorkerMessageType.ProcessFractalResults;
    }
    return ProcessFractalResults;
}());
exports.ProcessFractalResults = ProcessFractalResults;


/***/ }),

/***/ "./worker/app-workers/messages/worker-message.enum.ts":
/*!************************************************************!*\
  !*** ./worker/app-workers/messages/worker-message.enum.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WorkerMessageType;
(function (WorkerMessageType) {
    WorkerMessageType[WorkerMessageType["ProcessFractalInfo"] = 0] = "ProcessFractalInfo";
    WorkerMessageType[WorkerMessageType["ProcessFractalResults"] = 1] = "ProcessFractalResults";
    WorkerMessageType[WorkerMessageType["ProcessFractalDone"] = 2] = "ProcessFractalDone";
})(WorkerMessageType = exports.WorkerMessageType || (exports.WorkerMessageType = {}));


/***/ }),

/***/ "./worker/app-workers/shared/computed-point.ts":
/*!*****************************************************!*\
  !*** ./worker/app-workers/shared/computed-point.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ComputedPoint = /** @class */ (function () {
    function ComputedPoint(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }
    return ComputedPoint;
}());
exports.ComputedPoint = ComputedPoint;


/***/ }),

/***/ "./worker/app-workers/shared/coordinate.ts":
/*!*************************************************!*\
  !*** ./worker/app-workers/shared/coordinate.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Coordinate = /** @class */ (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    Coordinate.prototype.clone = function () {
        return new Coordinate(this.x, this.y);
    };
    return Coordinate;
}());
exports.Coordinate = Coordinate;


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
