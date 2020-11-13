/// <reference types="zen-observable" />
import { Observable, Observer } from "./Observable";
declare type MaybeAsync<T> = T | PromiseLike<T>;
declare type Source<T> = MaybeAsync<Observable<T>>;
export declare type ConcastSourcesIterable<T> = Iterable<Source<T>>;
export declare class Concast<T> extends Observable<T> {
    private observers;
    private sub?;
    constructor(sources: MaybeAsync<ConcastSourcesIterable<T>>);
    private sources;
    private start;
    addObserver(observer: Observer<T>): void;
    removeObserver(observer: Observer<T>, quietly?: boolean): void;
    private resolve;
    private reject;
    readonly promise: Promise<T>;
    private latest?;
    private handlers;
    cleanup(callback: () => any): void;
    cancel: (reason: any) => void;
}
export {};
//# sourceMappingURL=Concast.d.ts.map