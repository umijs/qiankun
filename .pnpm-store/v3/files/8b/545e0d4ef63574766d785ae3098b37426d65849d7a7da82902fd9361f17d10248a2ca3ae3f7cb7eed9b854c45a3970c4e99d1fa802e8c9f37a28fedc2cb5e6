"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debugger = void 0;
const system_external_1 = require("./system_external");
class Debugger {
    constructor() {
        this.isActive_ = false;
        this.outputFunction_ = console.info;
        this.fileHandle = Promise.resolve();
        this.stream_ = null;
    }
    static getInstance() {
        Debugger.instance = Debugger.instance || new Debugger();
        return Debugger.instance;
    }
    init(opt_file) {
        if (opt_file) {
            this.startDebugFile_(opt_file);
        }
        this.isActive_ = true;
        return this.fileHandle;
    }
    output(...args) {
        if (this.isActive_) {
            this.output_(args);
        }
    }
    generateOutput(func) {
        if (this.isActive_) {
            this.output_(func.apply(func, []));
        }
    }
    exit(callback = () => { }) {
        this.fileHandle.then(() => {
            if (this.isActive_ && this.stream_) {
                this.stream_.end('', '', callback);
            }
        });
    }
    startDebugFile_(filename) {
        this.fileHandle = system_external_1.default.fs.promises.open(filename, 'w');
        this.fileHandle = this.fileHandle.then((handle) => {
            this.stream_ = handle.createWriteStream(filename);
            this.outputFunction_ = function (...args) {
                this.stream_.write(args.join(' '));
                this.stream_.write('\n');
            }.bind(this);
            this.stream_.on('error', function (_error) {
                console.info('Invalid log file. Debug information sent to console.');
                this.outputFunction_ = console.info;
            }.bind(this));
            this.stream_.on('finish', function () {
                console.info('Finalizing debug file.');
            });
        });
    }
    output_(outputList) {
        if (console.info === this.outputFunction_) {
            this.outputFunction_.apply(console, ['Speech Rule Engine Debugger:'].concat(outputList));
            return;
        }
        this.fileHandle.then(() => this.outputFunction_.apply(this.outputFunction_, ['Speech Rule Engine Debugger:'].concat(outputList)));
    }
}
exports.Debugger = Debugger;
