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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blestLazyRequest = exports.blestRequest = exports.BlestProvider = void 0;
exports.blestContext = blestContext;
var vue_1 = require("vue");
var uuid_1 = require("uuid");
var isEqual_1 = __importDefault(require("lodash/isEqual"));
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
        // const queue = reactive<[string, string, any?, any?][]>([])
        var state = (0, vue_1.reactive)({});
        var queue = (0, vue_1.ref)([]);
        var timeout = (0, vue_1.ref)(null);
        var maxBatchSize = (options === null || options === void 0 ? void 0 : options.maxBatchSize) && typeof options.maxBatchSize === 'number' && options.maxBatchSize > 0 && Math.round(options.maxBatchSize) === options.maxBatchSize && options.maxBatchSize || 25;
        var bufferDelay = (options === null || options === void 0 ? void 0 : options.bufferDelay) && typeof options.bufferDelay === 'number' && options.bufferDelay > 0 && Math.round(options.bufferDelay) === options.bufferDelay && options.bufferDelay || 10;
        var httpHeaders = (options === null || options === void 0 ? void 0 : options.httpHeaders) && typeof options.httpHeaders === 'object' ? options.httpHeaders : {};
        var enqueue = function (id, route, body, headers) {
            state[id] = {
                loading: false,
                error: null,
                data: null
            };
            queue.value.push([id, route, body, headers]);
            if (!timeout.value) {
                timeout.value = setTimeout(function () { process(); }, bufferDelay);
            }
        };
        var process = function () {
            if (timeout.value) {
                clearTimeout(timeout.value);
                timeout.value = null;
            }
            if (!queue.value.length) {
                return;
            }
            var copyQueue = queue.value.map(function (q) { return __spreadArray([], q, true); });
            queue.value.splice(0);
            var batchCount = Math.ceil(copyQueue.length / maxBatchSize);
            var _loop_1 = function (i) {
                var myQueue = copyQueue.slice(i * maxBatchSize, (i + 1) * maxBatchSize);
                var requestIds = myQueue.map(function (q) { return q[0]; });
                for (var i_1 = 0; i_1 < requestIds.length; i_1++) {
                    var id = requestIds[i_1];
                    state[id] = {
                        loading: true,
                        error: null,
                        data: null
                    };
                }
                fetch(url, {
                    body: JSON.stringify(myQueue),
                    mode: 'cors',
                    method: 'POST',
                    headers: __assign(__assign({}, httpHeaders), { "Content-Type": "application/json", "Accept": "application/json" })
                })
                    .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                    var results, i_2, item;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, result.json()];
                            case 1:
                                results = _a.sent();
                                for (i_2 = 0; i_2 < results.length; i_2++) {
                                    item = results[i_2];
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
                    for (var i_3 = 0; i_3 < myQueue.length; i_3++) {
                        var id = requestIds[i_3];
                        state[id] = {
                            loading: false,
                            error: error,
                            data: null
                        };
                    }
                });
            };
            for (var i = 0; i < batchCount; i++) {
                _loop_1(i);
            }
        };
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
var blestRequest = function (route, body, headers) {
    // @ts-expect-error
    var _a = (0, vue_1.inject)(BlestSymbol), state = _a.state, enqueue = _a.enqueue;
    var requestId = (0, vue_1.ref)(null);
    var data = (0, vue_1.ref)(null);
    var error = (0, vue_1.ref)(null);
    var loading = (0, vue_1.ref)(false);
    var lastRequest = (0, vue_1.ref)(null);
    (0, vue_1.watchEffect)(function () {
        var requestHash = route + JSON.stringify(body || {}) + JSON.stringify(headers || {});
        if (lastRequest.value !== requestHash) {
            lastRequest.value = requestHash;
            var id = (0, uuid_1.v1)();
            requestId.value = id;
            enqueue(id, route, body, headers);
        }
        if (requestId.value && state[requestId.value]) {
            var reqState = state[requestId.value];
            if (!(0, isEqual_1.default)(data.value, reqState.data)) {
                data.value = reqState.data;
            }
            if (!(0, isEqual_1.default)(error.value, reqState.error)) {
                error.value = reqState.error;
            }
            if (loading.value !== reqState.loading) {
                loading.value = reqState.loading;
            }
        }
    });
    return {
        data: data,
        error: error,
        loading: loading
    };
};
exports.blestRequest = blestRequest;
var blestLazyRequest = function (route, headers) {
    // @ts-expect-error
    var _a = (0, vue_1.inject)(BlestSymbol), state = _a.state, enqueue = _a.enqueue;
    var requestId = (0, vue_1.ref)(null);
    var data = (0, vue_1.ref)(null);
    var error = (0, vue_1.ref)(null);
    var loading = (0, vue_1.ref)(false);
    var request = function (body) {
        var id = (0, uuid_1.v1)();
        requestId.value = id;
        enqueue(id, route, body, headers);
    };
    (0, vue_1.watchEffect)(function () {
        if (requestId.value && state[requestId.value]) {
            var reqState = state[requestId.value];
            // data.value = reqState.data
            // error.value = reqState.error
            // loading.value = reqState.loading
            if (!(0, isEqual_1.default)(data.value, reqState.data)) {
                data.value = reqState.data;
            }
            if (!(0, isEqual_1.default)(error.value, reqState.error)) {
                error.value = reqState.error;
            }
            if (loading.value !== reqState.loading) {
                loading.value = reqState.loading;
            }
        }
    });
    return [request, {
            data: data,
            error: error,
            loading: loading
        }];
};
exports.blestLazyRequest = blestLazyRequest;
