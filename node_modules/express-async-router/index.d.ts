import * as express from "express";
export declare type Router = express.Router;
export declare type Request = express.Request;
export declare type Response = express.Response;
export declare type RequestHandler = express.RequestHandler;
export declare type RequestParamHandler = express.RequestParamHandler;
export declare type ErrorRequestHandler = express.ErrorRequestHandler;
export declare type ParamHandler = RequestParamHandler;
export declare type ErrorHandler = ErrorRequestHandler;
export declare type NextFunction = express.NextFunction;
export declare type AsyncRouterParamHandler = (req: Request, res: Response, param: any) => any;
export declare type AsyncRouterSender = (req: Request, res: Response, value: any) => any;
export interface AsyncRouterOptions {
    caseSensitive?: boolean;
    mergeParams?: boolean;
    strict?: boolean;
    send?: boolean;
    sender?: AsyncRouterSender;
}
export interface AsyncRouter {
    (): AsyncRouterInstance;
    (options: AsyncRouterOptions): AsyncRouterInstance;
    new (): AsyncRouterInstance;
    new (options: AsyncRouterOptions): AsyncRouterInstance;
}
export interface AsyncRouterInstance extends express.Router {
    param(name: string, handler: ParamHandler): this;
    param(name: string, matcher: RegExp): this;
    param(name: string, mapper: (param: any) => any): this;
    param(callback: (name: string, matcher: RegExp) => ParamHandler): this;
    param(name: string, handler: AsyncRouterParamHandler): void;
}
export declare function AsyncRouter(options?: AsyncRouterOptions): AsyncRouterInstance;
export declare function create(): AsyncRouterInstance;
export declare function create(options: AsyncRouterOptions): AsyncRouterInstance;
