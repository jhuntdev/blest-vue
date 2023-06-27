"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blestCommand = exports.blestRequest = exports.blestContext = exports.BlestProvider = void 0;
var vue_1 = require("vue");
var uuid_1 = require("uuid");
var BlestSymbol = Symbol();
exports.BlestProvider = {
    props: {
        url: String,
        options: {
            type: Object,
            default: function () { return ({}); }
        }
    },
    setup: function (_a, _b) {
        var _this = this;
        var url = _a.url, options = _a.options;
        var slots = _b.slots;
        var queue = (0, vue_1.reactive)([]);
        var state = (0, vue_1.reactive)({});
        var timeout = (0, vue_1.ref)(null);
        var enqueue = function (id, route, params, selector) {
            if (timeout.value)
                clearTimeout(timeout.value);
            state[id] = {
                loading: false,
                error: null,
                data: null
            };
            queue.push([id, route, params, selector]);
        };
        (0, vue_1.watchEffect)(function () {
            if (queue.length > 0) {
                var headers_1 = (options === null || options === void 0 ? void 0 : options.headers) && typeof (options === null || options === void 0 ? void 0 : options.headers) === 'object' ? options.headers : {};
                var myQueue_1 = __spreadArray([], queue, true);
                var requestIds_1 = queue.map(function (q) { return q[0]; });
                queue.splice(0);
                timeout.value = setTimeout(function () {
                    for (var i = 0; i < requestIds_1.length; i++) {
                        var id = requestIds_1[i];
                        state[id] = {
                            loading: true,
                            error: null,
                            data: null
                        };
                    }
                    fetch(url, {
                        body: JSON.stringify(myQueue_1),
                        mode: 'cors',
                        method: 'POST',
                        headers: __assign(__assign({}, headers_1), { "Content-Type": "application/json", "Accept": "application/json" })
                    })
                        .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                        var results, i, item;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, result.json()];
                                case 1:
                                    results = _a.sent();
                                    for (i = 0; i < results.length; i++) {
                                        item = results[i];
                                        state[item[0]] = {
                                            loading: false,
                                            error: item[3],
                                            data: item[2]
                                        };
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        for (var i = 0; i < myQueue_1.length; i++) {
                            var id = requestIds_1[i];
                            state[id] = {
                                loading: false,
                                error: error,
                                data: null
                            };
                        }
                    });
                }, 1);
            }
        });
        (0, vue_1.provide)(BlestSymbol, { queue: queue, state: state, enqueue: enqueue });
        if (!slots.default) {
            throw new Error('Expecting a default slot');
        }
        // @ts-expect-error
        return function () { return slots.default(); };
    }
};
function blestContext() {
    var context = (0, vue_1.inject)(BlestSymbol);
    (0, vue_1.onMounted)(function () {
        console.warn('useBlestContext() is a utility function for debugging');
    });
    return context;
}
exports.blestContext = blestContext;
function blestRequest(route, params, selector) {
    // @ts-expect-error
    var _a = (0, vue_1.inject)(BlestSymbol), state = _a.state, enqueue = _a.enqueue;
    var requestId = (0, vue_1.ref)(null);
    var data = (0, vue_1.ref)(null);
    var error = (0, vue_1.ref)(null);
    var loading = (0, vue_1.ref)(false);
    var lastRequest = (0, vue_1.ref)(null);
    (0, vue_1.watchEffect)(function () {
        var requestHash = route + JSON.stringify(params || {}) + JSON.stringify(selector || {});
        if (lastRequest.value !== requestHash) {
            lastRequest.value = requestHash;
            var id = (0, uuid_1.v4)();
            requestId.value = id;
            enqueue(id, route, params, selector);
        }
        if (requestId.value && state[requestId.value]) {
            var reqState = state[requestId.value];
            data.value = reqState.data;
            error.value = reqState.error;
            loading.value = reqState.loading;
        }
    });
    return {
        data: data,
        error: error,
        loading: loading
    };
}
exports.blestRequest = blestRequest;
function blestCommand(route, selector) {
    // @ts-expect-error
    var _a = (0, vue_1.inject)(BlestSymbol), state = _a.state, enqueue = _a.enqueue;
    var requestId = (0, vue_1.ref)(null);
    var data = (0, vue_1.ref)(null);
    var error = (0, vue_1.ref)(null);
    var loading = (0, vue_1.ref)(false);
    var request = function (params) {
        var id = (0, uuid_1.v4)();
        requestId.value = id;
        enqueue(id, route, params, selector);
    };
    (0, vue_1.watchEffect)(function () {
        if (requestId.value && state[requestId.value]) {
            var reqState = state[requestId.value];
            data.value = reqState.data;
            error.value = reqState.error;
            loading.value = reqState.loading;
        }
    });
    return [request, {
            data: data,
            error: error,
            loading: loading
        }];
}
exports.blestCommand = blestCommand;
