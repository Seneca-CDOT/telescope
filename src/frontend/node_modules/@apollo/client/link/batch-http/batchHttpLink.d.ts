/// <reference types="zen-observable" />
import { ApolloLink, Operation, FetchResult } from '../core';
import { Observable } from '../../utilities';
import { HttpOptions } from '../http';
export declare namespace BatchHttpLink {
    interface Options extends HttpOptions {
        batchMax?: number;
        batchInterval?: number;
        batchKey?: (operation: Operation) => string;
    }
}
export declare class BatchHttpLink extends ApolloLink {
    private batchInterval;
    private batchMax;
    private batcher;
    constructor(fetchParams?: BatchHttpLink.Options);
    request(operation: Operation): Observable<FetchResult> | null;
}
//# sourceMappingURL=batchHttpLink.d.ts.map