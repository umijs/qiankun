"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TexError = (function () {
    function TexError(id, message) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        this.id = id;
        this.message = TexError.processString(message, rest);
    }
    TexError.processString = function (str, args) {
        var parts = str.split(TexError.pattern);
        for (var i = 1, m = parts.length; i < m; i += 2) {
            var c = parts[i].charAt(0);
            if (c >= '0' && c <= '9') {
                parts[i] = args[parseInt(parts[i], 10) - 1];
                if (typeof parts[i] === 'number') {
                    parts[i] = parts[i].toString();
                }
            }
            else if (c === '{') {
                c = parts[i].substr(1);
                if (c >= '0' && c <= '9') {
                    parts[i] = args[parseInt(parts[i].substr(1, parts[i].length - 2), 10) - 1];
                    if (typeof parts[i] === 'number') {
                        parts[i] = parts[i].toString();
                    }
                }
                else {
                    var match = parts[i].match(/^\{([a-z]+):%(\d+)\|(.*)\}$/);
                    if (match) {
                        parts[i] = '%' + parts[i];
                    }
                }
            }
            if (parts[i] == null) {
                parts[i] = '???';
            }
        }
        return parts.join('');
    };
    TexError.pattern = /%(\d+|\{\d+\}|\{[a-z]+:\%\d+(?:\|(?:%\{\d+\}|%.|[^\}])*)+\}|.)/g;
    return TexError;
}());
exports.default = TexError;
//# sourceMappingURL=TexError.js.map