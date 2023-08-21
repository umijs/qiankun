"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnifier = exports.SpeechExplorer = exports.AbstractKeyExplorer = void 0;
var Explorer_js_1 = require("./Explorer.js");
var sre_js_1 = __importDefault(require("../sre.js"));
var AbstractKeyExplorer = (function (_super) {
    __extends(AbstractKeyExplorer, _super);
    function AbstractKeyExplorer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.attached = false;
        _this.eventsAttached = false;
        _this.events = _super.prototype.Events.call(_this).concat([['keydown', _this.KeyDown.bind(_this)],
            ['focusin', _this.FocusIn.bind(_this)],
            ['focusout', _this.FocusOut.bind(_this)]]);
        _this.oldIndex = null;
        return _this;
    }
    AbstractKeyExplorer.prototype.FocusIn = function (_event) {
    };
    AbstractKeyExplorer.prototype.FocusOut = function (_event) {
        this.Stop();
    };
    AbstractKeyExplorer.prototype.Update = function (force) {
        if (force === void 0) { force = false; }
        if (!this.active && !force)
            return;
        this.highlighter.unhighlight();
        var nodes = this.walker.getFocus(true).getNodes();
        if (!nodes.length) {
            this.walker.refocus();
            nodes = this.walker.getFocus().getNodes();
        }
        this.highlighter.highlight(nodes);
    };
    AbstractKeyExplorer.prototype.Attach = function () {
        _super.prototype.Attach.call(this);
        this.attached = true;
        this.oldIndex = this.node.tabIndex;
        this.node.tabIndex = 1;
        this.node.setAttribute('role', 'application');
    };
    AbstractKeyExplorer.prototype.AddEvents = function () {
        if (!this.eventsAttached) {
            _super.prototype.AddEvents.call(this);
            this.eventsAttached = true;
        }
    };
    AbstractKeyExplorer.prototype.Detach = function () {
        if (this.active) {
            this.node.tabIndex = this.oldIndex;
            this.oldIndex = null;
            this.node.removeAttribute('role');
        }
        this.attached = false;
    };
    AbstractKeyExplorer.prototype.Stop = function () {
        if (this.active) {
            this.highlighter.unhighlight();
            this.walker.deactivate();
        }
        _super.prototype.Stop.call(this);
    };
    return AbstractKeyExplorer;
}(Explorer_js_1.AbstractExplorer));
exports.AbstractKeyExplorer = AbstractKeyExplorer;
var SpeechExplorer = (function (_super) {
    __extends(SpeechExplorer, _super);
    function SpeechExplorer(document, region, node, mml) {
        var _this = _super.call(this, document, region, node) || this;
        _this.document = document;
        _this.region = region;
        _this.node = node;
        _this.mml = mml;
        _this.showRegion = 'subtitles';
        _this.init = false;
        _this.restarted = false;
        _this.initWalker();
        return _this;
    }
    SpeechExplorer.prototype.Start = function () {
        var _this = this;
        if (!this.attached)
            return;
        var options = this.getOptions();
        if (!this.init) {
            this.init = true;
            SpeechExplorer.updatePromise = SpeechExplorer.updatePromise.then(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2, sre_js_1.default.sreReady()
                            .then(function () { return sre_js_1.default.setupEngine({ locale: options.locale }); })
                            .then(function () {
                            _this.Speech(_this.walker);
                            _this.Start();
                        })];
                });
            }); })
                .catch(function (error) { return console.log(error.message); });
            return;
        }
        _super.prototype.Start.call(this);
        this.speechGenerator = sre_js_1.default.getSpeechGenerator('Direct');
        this.speechGenerator.setOptions(options);
        this.walker = sre_js_1.default.getWalker('table', this.node, this.speechGenerator, this.highlighter, this.mml);
        this.walker.activate();
        this.Update();
        if (this.document.options.a11y[this.showRegion]) {
            SpeechExplorer.updatePromise.then(function () { return _this.region.Show(_this.node, _this.highlighter); });
        }
        this.restarted = true;
    };
    SpeechExplorer.prototype.Update = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        _super.prototype.Update.call(this, force);
        var options = this.speechGenerator.getOptions();
        if (options.modality === 'speech') {
            this.document.options.sre.domain = options.domain;
            this.document.options.sre.style = options.style;
            this.document.options.a11y.speechRules =
                options.domain + '-' + options.style;
        }
        SpeechExplorer.updatePromise = SpeechExplorer.updatePromise.then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, sre_js_1.default.sreReady()
                        .then(function () { return sre_js_1.default.setupEngine({ modality: options.modality,
                        locale: options.locale }); })
                        .then(function () { return _this.region.Update(_this.walker.speech()); })];
            });
        }); });
    };
    SpeechExplorer.prototype.Speech = function (walker) {
        var _this = this;
        SpeechExplorer.updatePromise.then(function () {
            walker.speech();
            _this.node.setAttribute('hasspeech', 'true');
            _this.Update();
            if (_this.restarted && _this.document.options.a11y[_this.showRegion]) {
                _this.region.Show(_this.node, _this.highlighter);
            }
        });
    };
    SpeechExplorer.prototype.KeyDown = function (event) {
        var code = event.keyCode;
        this.walker.modifier = event.shiftKey;
        if (code === 27) {
            this.Stop();
            this.stopEvent(event);
            return;
        }
        if (this.active) {
            this.Move(code);
            if (this.triggerLink(code))
                return;
            this.stopEvent(event);
            return;
        }
        if (code === 32 && event.shiftKey || code === 13) {
            this.Start();
            this.stopEvent(event);
        }
    };
    SpeechExplorer.prototype.triggerLink = function (code) {
        var _a, _b;
        if (code !== 13) {
            return false;
        }
        var node = (_a = this.walker.getFocus().getNodes()) === null || _a === void 0 ? void 0 : _a[0];
        var focus = (_b = node === null || node === void 0 ? void 0 : node.getAttribute('data-semantic-postfix')) === null || _b === void 0 ? void 0 : _b.match(/(^| )link($| )/);
        if (focus) {
            node.parentNode.dispatchEvent(new MouseEvent('click'));
            return true;
        }
        return false;
    };
    SpeechExplorer.prototype.Move = function (key) {
        this.walker.move(key);
        this.Update();
    };
    SpeechExplorer.prototype.initWalker = function () {
        this.speechGenerator = sre_js_1.default.getSpeechGenerator('Tree');
        var dummy = sre_js_1.default.getWalker('dummy', this.node, this.speechGenerator, this.highlighter, this.mml);
        this.walker = dummy;
    };
    SpeechExplorer.prototype.getOptions = function () {
        var options = this.speechGenerator.getOptions();
        var sreOptions = this.document.options.sre;
        if (options.modality === 'speech' &&
            (options.locale !== sreOptions.locale ||
                options.domain !== sreOptions.domain ||
                options.style !== sreOptions.style)) {
            options.domain = sreOptions.domain;
            options.style = sreOptions.style;
            options.locale = sreOptions.locale;
            this.walker.update(options);
        }
        return options;
    };
    SpeechExplorer.updatePromise = Promise.resolve();
    return SpeechExplorer;
}(AbstractKeyExplorer));
exports.SpeechExplorer = SpeechExplorer;
var Magnifier = (function (_super) {
    __extends(Magnifier, _super);
    function Magnifier(document, region, node, mml) {
        var _this = _super.call(this, document, region, node) || this;
        _this.document = document;
        _this.region = region;
        _this.node = node;
        _this.mml = mml;
        _this.walker = sre_js_1.default.getWalker('table', _this.node, sre_js_1.default.getSpeechGenerator('Dummy'), _this.highlighter, _this.mml);
        return _this;
    }
    Magnifier.prototype.Update = function (force) {
        if (force === void 0) { force = false; }
        _super.prototype.Update.call(this, force);
        this.showFocus();
    };
    Magnifier.prototype.Start = function () {
        _super.prototype.Start.call(this);
        if (!this.attached)
            return;
        this.region.Show(this.node, this.highlighter);
        this.walker.activate();
        this.Update();
    };
    Magnifier.prototype.showFocus = function () {
        var node = this.walker.getFocus().getNodes()[0];
        this.region.Show(node, this.highlighter);
    };
    Magnifier.prototype.Move = function (key) {
        var result = this.walker.move(key);
        if (result) {
            this.Update();
        }
    };
    Magnifier.prototype.KeyDown = function (event) {
        var code = event.keyCode;
        this.walker.modifier = event.shiftKey;
        if (code === 27) {
            this.Stop();
            this.stopEvent(event);
            return;
        }
        if (this.active && code !== 13) {
            this.Move(code);
            this.stopEvent(event);
            return;
        }
        if (code === 32 && event.shiftKey || code === 13) {
            this.Start();
            this.stopEvent(event);
        }
    };
    return Magnifier;
}(AbstractKeyExplorer));
exports.Magnifier = Magnifier;
//# sourceMappingURL=KeyExplorer.js.map