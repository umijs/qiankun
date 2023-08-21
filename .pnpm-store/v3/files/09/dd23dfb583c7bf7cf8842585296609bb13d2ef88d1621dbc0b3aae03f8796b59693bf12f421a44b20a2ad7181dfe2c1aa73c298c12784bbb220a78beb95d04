var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/service/telemetry.ts
var telemetry_exports = {};
__export(telemetry_exports, {
  Telemetry: () => Telemetry,
  noopStorage: () => noopStorage
});
module.exports = __toCommonJS(telemetry_exports);
var Telemetry = class {
  constructor() {
    this.queuedEvents = [];
    this.storage = new NoopStorage();
    this.afterFlush = () => {
      const un = this.unFinishedEvents();
      if (un.length) {
        this.scheduleFlush();
      } else {
        this.queuedEvents = [];
      }
    };
  }
  prefixWith(prefix) {
    const upStream = this;
    return {
      record(e) {
        const { name, ...rest } = e;
        upStream.record({
          name: `${prefix}:${name}`,
          ...rest
        });
      },
      async flush() {
        return upStream.flush();
      },
      recordAsync(e) {
        const { name, ...rest } = e;
        return upStream.recordAsync({
          name: `${prefix}:${name}`,
          ...rest
        });
      }
    };
  }
  useStorage(s) {
    this.storage = s;
  }
  record(e) {
    this.storage.save(this.addTimeStamp(e)).catch(() => {
      this.queuedEvents.push({ event: e, tried: 1, status: "queued" });
      this.scheduleFlush();
    });
  }
  async recordAsync(e) {
    try {
      await this.storage.save(this.addTimeStamp(e));
      return true;
    } catch (e2) {
      return false;
    }
  }
  async flush() {
    const events = this.unFinishedEvents().map((e) => {
      if (e.status === "queued") {
        e.status = "sending";
        e.tried++;
        e.promise = this.storage.save(e.event).then(
          () => {
            e.status = "sent";
          },
          () => {
            e.status = "queued";
          }
        );
      }
      return e;
    });
    this.queuedEvents = events;
    await Promise.all(events.map(({ promise }) => promise));
  }
  scheduleFlush() {
    setTimeout(() => {
      this.flush().then(this.afterFlush, this.afterFlush);
    }, 5e3);
  }
  unFinishedEvents() {
    return this.queuedEvents.filter((e) => {
      if (e.status === "sent") {
        return false;
      }
      return e.tried < 3;
    });
  }
  addTimeStamp(e) {
    if (!e.timestamp) {
      e.timestamp = Date.now();
    }
    return e;
  }
};
var NoopStorage = class {
  async save(_e) {
    return;
  }
};
var noopStorage = new NoopStorage();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Telemetry,
  noopStorage
});
