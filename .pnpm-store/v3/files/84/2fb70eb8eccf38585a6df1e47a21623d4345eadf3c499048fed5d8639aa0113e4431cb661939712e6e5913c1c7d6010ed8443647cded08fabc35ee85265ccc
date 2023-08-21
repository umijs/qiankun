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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathtoolsTagFormat = void 0;
var TexError_js_1 = __importDefault(require("../TexError.js"));
var Tags_js_1 = require("../Tags.js");
var tagID = 0;
function MathtoolsTagFormat(config, jax) {
    var tags = jax.parseOptions.options.tags;
    if (tags !== 'base' && config.tags.hasOwnProperty(tags)) {
        Tags_js_1.TagsFactory.add(tags, config.tags[tags]);
    }
    var TagClass = Tags_js_1.TagsFactory.create(jax.parseOptions.options.tags).constructor;
    var TagFormat = (function (_super) {
        __extends(TagFormat, _super);
        function TagFormat() {
            var e_1, _a;
            var _this = _super.call(this) || this;
            _this.mtFormats = new Map();
            _this.mtCurrent = null;
            var forms = jax.parseOptions.options.mathtools.tagforms;
            try {
                for (var _b = __values(Object.keys(forms)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var form = _c.value;
                    if (!Array.isArray(forms[form]) || forms[form].length !== 3) {
                        throw new TexError_js_1.default('InvalidTagFormDef', 'The tag form definition for "%1" should be an array fo three strings', form);
                    }
                    _this.mtFormats.set(form, forms[form]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return _this;
        }
        TagFormat.prototype.formatTag = function (tag) {
            if (this.mtCurrent) {
                var _a = __read(this.mtCurrent, 3), left = _a[0], right = _a[1], format = _a[2];
                return (format ? "".concat(left).concat(format, "{").concat(tag, "}").concat(right) : "".concat(left).concat(tag).concat(right));
            }
            return _super.prototype.formatTag.call(this, tag);
        };
        return TagFormat;
    }(TagClass));
    tagID++;
    var tagName = 'MathtoolsTags-' + tagID;
    Tags_js_1.TagsFactory.add(tagName, TagFormat);
    jax.parseOptions.options.tags = tagName;
}
exports.MathtoolsTagFormat = MathtoolsTagFormat;
//# sourceMappingURL=MathtoolsTags.js.map