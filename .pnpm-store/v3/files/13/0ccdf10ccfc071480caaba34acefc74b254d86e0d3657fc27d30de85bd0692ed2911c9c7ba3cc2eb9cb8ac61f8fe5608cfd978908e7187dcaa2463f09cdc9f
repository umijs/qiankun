"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransform = void 0;
function createTransform() {
    var nodeRequire = eval('require');
    var dirname = eval('__dirname');
    try {
        nodeRequire.resolve('saxon-js');
    }
    catch (err) {
        throw Error('Saxon-js not found.  Run the command:\n    npm install saxon-js\nand try again.');
    }
    var Saxon = nodeRequire('saxon-js');
    var path = nodeRequire('path');
    var fs = nodeRequire('fs');
    var xsltFile = path.resolve(dirname, 'mml3.sef.json');
    var xslt = JSON.parse(fs.readFileSync(xsltFile));
    return function (node, doc) {
        var adaptor = doc.adaptor;
        var mml = adaptor.outerHTML(node);
        if (!mml.match(/ xmlns[=:]/)) {
            mml = mml.replace(/<(?:(\w+)(:))?math/, '<$1$2math xmlns$2$1="http://www.w3.org/1998/Math/MathML"');
        }
        var result;
        try {
            result = adaptor.firstChild(adaptor.body(adaptor.parse(Saxon.transform({
                stylesheetInternal: xslt,
                sourceText: mml,
                destination: 'serialized'
            }).principalResult)));
        }
        catch (err) {
            result = node;
        }
        return result;
    };
}
exports.createTransform = createTransform;
//# sourceMappingURL=mml3-node.js.map