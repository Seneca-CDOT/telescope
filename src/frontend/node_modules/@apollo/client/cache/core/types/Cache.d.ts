import { DataProxy } from './DataProxy';
import { Modifier, Modifiers } from './common';
export declare namespace Cache {
    type WatchCallback = (diff: Cache.DiffResult<any>) => void;
    interface ReadOptions<TVariables = any, TData = any> extends DataProxy.Query<TVariables, TData> {
        rootId?: string;
        previousResult?: any;
        optimistic: boolean;
    }
    interface WriteOptions<TResult = any, TVariables = any> extends DataProxy.Query<TVariables, TResult> {
        dataId?: string;
        result: TResult;
        broadcast?: boolean;
    }
    interface DiffOptions extends ReadOptions {
        returnPartialData?: boolean;
    }
    interface WatchOptions extends ReadOptions {
        immediate?: boolean;
        callback: WatchCallback;
    }
    interface EvictOptions {
        id?: string;
        fieldName?: string;
        args?: Record<string, any>;
        broadcast?: boolean;
    }
    interface ModifyOptions {
        id?: string;
        fields: Modifiers | Modifier<any>;
        optimistic?: boolean;
        broadcast?: boolean;
    }
    export import DiffResult = DataProxy.DiffResult;
    export import WriteQueryOptions = DataProxy.WriteQueryOptions;
    export import WriteFragmentOptions = DataProxy.WriteFragmentOptions;
    export import Fragment = DataProxy.Fragment;
}
//# sourceMappingURL=Cache.d.ts.map