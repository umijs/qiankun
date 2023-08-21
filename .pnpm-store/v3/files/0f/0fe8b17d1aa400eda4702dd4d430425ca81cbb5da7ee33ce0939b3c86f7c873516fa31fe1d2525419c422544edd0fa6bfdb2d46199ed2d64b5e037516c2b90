/// <reference types="node" />

import * as streamTransform from './index';
export = transform

// transform(records, [options], handler)

type Handler<T = any, U = any> = (record: T) => U
declare function transform<T = any, U = any>(records: Array<T>, handler: Handler<T, U>): Array<U>
declare function transform<T = any, U = any>(records: Array<T>, options: streamTransform.Options, handler: Handler<T, U>): Array<U>
declare namespace transform { }
