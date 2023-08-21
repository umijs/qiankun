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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var shouldFail = false;
var mockExeca = function () {
    return {
        failed: shouldFail,
    };
};
var asyncExeca = jest
    .fn()
    .mockImplementation(function () { return Promise.resolve(mockExeca()); });
var syncExeca = jest.fn().mockImplementation(mockExeca);
Object.defineProperty(asyncExeca, 'sync', {
    value: syncExeca,
});
jest.mock('execa', function () {
    return asyncExeca;
});
var _1 = require("./");
describe('getPackageList', function () {
    it('should handle arrays', function () {
        var input = ['twilio', 'node-env-run@1', 'twilio-run@1'];
        var output = _1.getPackageList(input);
        expect(output).toEqual(input);
    });
    it('should filter out empty or invalid values', function () {
        var input = ['twilio', undefined, 1.23, 'node-env-run@1'];
        // @ts-ignore
        var output = _1.getPackageList(input);
        expect(output).toEqual(['twilio', 'node-env-run@1']);
    });
    it('should turn objects into arrays', function () {
        var input = {
            twilio: '^3',
            'node-env-run': '1',
            'twilio-run': undefined,
        };
        var output = _1.getPackageList(input);
        expect(output).toEqual(['twilio@^3', 'node-env-run@1', 'twilio-run']);
    });
});
describe('isManagerInstalled', function () {
    it('should call execa with the right paramters', function () {
        _1.isManagerInstalled('npm');
        expect(asyncExeca).toHaveBeenLastCalledWith('npm', ['--version']);
        _1.isManagerInstalled('yarn');
        expect(asyncExeca).toHaveBeenLastCalledWith('yarn', ['--version']);
    });
    it('should forward the result', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    shouldFail = false;
                    _a = expect;
                    return [4 /*yield*/, _1.isManagerInstalled('npm')];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toBe(true);
                    shouldFail = true;
                    _b = expect;
                    return [4 /*yield*/, _1.isManagerInstalled('npm')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('isManagerInstalledSync', function () {
    it('should call execa with the right paramters', function () {
        _1.isManagerInstalledSync('npm');
        expect(syncExeca).toHaveBeenLastCalledWith('npm', ['--version']);
        _1.isManagerInstalledSync('yarn');
        expect(syncExeca).toHaveBeenLastCalledWith('yarn', ['--version']);
    });
    it('should forward the result', function () {
        shouldFail = false;
        expect(_1.isManagerInstalledSync('npm')).toBe(true);
        shouldFail = true;
        expect(_1.isManagerInstalledSync('npm')).toBe(false);
    });
});
describe('getCurrentPackageManager', function () {
    var envBackup;
    beforeEach(function () {
        envBackup = __assign({}, process.env);
    });
    afterEach(function () {
        process.env = __assign({}, envBackup);
    });
    it('should handle yarn user agents', function () {
        process.env = {
            npm_config_user_agent: 'yarn/1.13.0 npm/? node/v11.6.0 darwin x64',
        };
        expect(_1.getCurrentPackageManager()).toBe('yarn');
    });
    it('should handle npm user agents', function () {
        process.env = {
            npm_config_user_agent: 'npm/6.5.0 node/v11.6.0 darwin x64',
        };
        expect(_1.getCurrentPackageManager()).toBe('npm');
    });
    it('should handle missing user agents', function () {
        process.env = {};
        expect(_1.getCurrentPackageManager()).toBe(null);
    });
});
describe('constructYarnArguments', function () {
    var packageList = ['twilio', 'twilio-run@1'];
    it('should handle default config', function () {
        var output = _1.constructYarnArguments(packageList, _1.defaultConfig);
        expect(output).toEqual(['add'].concat(packageList));
    });
    it('should add dev flag', function () {
        var output = _1.constructYarnArguments(packageList, __assign({}, _1.defaultConfig, { dev: true }));
        expect(output).toEqual(['add'].concat(packageList, ['--dev']));
    });
    it('should add exact flag', function () {
        var output = _1.constructYarnArguments(packageList, __assign({}, _1.defaultConfig, { exact: true }));
        expect(output).toEqual(['add'].concat(packageList, ['--exact']));
    });
    it('should add verbose flag', function () {
        var output = _1.constructYarnArguments(packageList, __assign({}, _1.defaultConfig, { verbose: true }));
        expect(output).toEqual(['add'].concat(packageList, ['--verbose']));
    });
    it('shoud ignore noSave option', function () {
        var output = _1.constructYarnArguments(packageList, __assign({}, _1.defaultConfig, { noSave: true }));
        expect(output).toEqual(['add'].concat(packageList));
    });
    it('shoud ignore bundle option', function () {
        var output = _1.constructYarnArguments(packageList, __assign({}, _1.defaultConfig, { bundle: true }));
        expect(output).toEqual(['add'].concat(packageList));
    });
    it('should handle all flags', function () {
        var output = _1.constructYarnArguments(packageList, __assign({}, _1.defaultConfig, { dev: true, exact: true, verbose: true }));
        expect(output).toEqual([
            'add'
        ].concat(packageList, [
            '--dev',
            '--exact',
            '--verbose',
        ]));
    });
});
describe('constructNpmArguments', function () {
    var packageList = ['twilio', 'twilio-run@1'];
    it('should handle default config', function () {
        var output = _1.constructNpmArguments(packageList, _1.defaultConfig);
        expect(output).toEqual(['install'].concat(packageList));
    });
    it('should add dev flag', function () {
        var output = _1.constructNpmArguments(packageList, __assign({}, _1.defaultConfig, { dev: true }));
        expect(output).toEqual(['install'].concat(packageList, ['--save-dev']));
    });
    it('should add exact flag', function () {
        var output = _1.constructNpmArguments(packageList, __assign({}, _1.defaultConfig, { exact: true }));
        expect(output).toEqual(['install'].concat(packageList, ['--save-exact']));
    });
    it('should add verbose flag', function () {
        var output = _1.constructNpmArguments(packageList, __assign({}, _1.defaultConfig, { verbose: true }));
        expect(output).toEqual(['install'].concat(packageList, ['--verbose']));
    });
    it('should add bundle flag', function () {
        var output = _1.constructNpmArguments(packageList, __assign({}, _1.defaultConfig, { bundle: true }));
        expect(output).toEqual(['install'].concat(packageList, ['--save-bundle']));
    });
    it('should handle noSave flag', function () {
        var output = _1.constructNpmArguments(packageList, __assign({}, _1.defaultConfig, { noSave: true }));
        expect(output).toEqual(['install'].concat(packageList, ['--no-save']));
    });
    it('should handle all flags', function () {
        var output = _1.constructNpmArguments(packageList, __assign({}, _1.defaultConfig, { dev: true, exact: true, verbose: true }));
        expect(output).toEqual([
            'install'
        ].concat(packageList, [
            '--save-dev',
            '--save-exact',
            '--verbose',
        ]));
    });
});
//# sourceMappingURL=index.test.js.map