/// <reference types="node" />

import * as stream from "stream";
export = transform

// transform([records], [options], handler, [callback])

declare function transform<T = any, U = any>(handler: transform.Handler<T, U>, callback?: transform.Callback): transform.Transformer
declare function transform<T = any, U = any>(records: Array<T>, handler: transform.Handler<T, U>, callback?: transform.Callback): transform.Transformer
declare function transform<T = any, U = any>(options: transform.Options, handler: transform.Handler<T, U>, callback?: transform.Callback): transform.Transformer
declare function transform<T = any, U = any>(records: Array<T>, options: transform.Options, handler: transform.Handler<T, U>, callback?: transform.Callback): transform.Transformer
declare namespace transform {
    type Handler<T = any, U = any> = (record: T, callback: HandlerCallback, params?: any) => U
    type HandlerCallback<T = any> = (err?: null | Error, record?: T) => void
    type Callback = (err?: null | Error, output?: string) => void
    interface Options {
        /**
         * In the absence of a consumer, like a `stream.Readable`, trigger the consumption of the stream.
         */
        consume?: boolean
        /**
         * The number of transformation callbacks to run in parallel; only apply with asynchronous handlers; default to "100".
         */
        parallel?: number
        /**
         * Pass user defined parameters to the user handler as last argument.
         */
        params?: any
    }
    interface State {
        finished: number
        running: number
        started: number
    }
    class Transformer extends stream.Transform {
        constructor(options: Options)
        readonly options: Options
        readonly state: State
    }
}
