"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var FileError = /** @class */ (function (_super) {
    __extends(FileError, _super);
    /**
     * Creates an instance of FileError.
     * @param {string} message
     * @param {string} path
     * @param {boolean} [isBinary=false] Whether the error was caused because the file is binary
     * @memberof FileError
     */
    function FileError(message, path, isBinary) {
        if (isBinary === void 0) { isBinary = false; }
        var _this = _super.call(this, message) || this;
        _this.path = path;
        _this.isBinary = isBinary;
        return _this;
    }
    return FileError;
}(Error));
exports["default"] = FileError;
//# sourceMappingURL=file-error.js.map