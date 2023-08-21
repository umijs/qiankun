"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
// fs.promises polyfill for node 8.x
if (!('promises' in fs)) {
    class FileHandle {
        constructor(fd) {
            this.fd = fd;
        }
        stat() {
            return new Promise((resolve, reject) => {
                fs.fstat(this.fd, (err, stats) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(stats);
                    }
                });
            });
        }
        read(buffer, offset, length, position) {
            return new Promise((resolve, reject) => {
                fs.read(this.fd, buffer, offset, length, position, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
        close() {
            return new Promise((resolve, reject) => {
                fs.close(this.fd, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
    }
    Object.defineProperty(fs, 'promises', {
        value: {
            open: (filepath, flags) => (new Promise((resolve, reject) => {
                fs.open(filepath, flags, (err, fd) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(new FileHandle(fd));
                    }
                });
            })),
        },
        writable: false
    });
}
