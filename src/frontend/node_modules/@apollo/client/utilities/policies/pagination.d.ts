import { FieldPolicy, Reference } from '../../cache';
declare type KeyArgs = FieldPolicy<any>["keyArgs"];
export declare function concatPagination<T = Reference>(keyArgs?: KeyArgs): FieldPolicy<T[]>;
export declare function offsetLimitPagination<T = Reference>(keyArgs?: KeyArgs): FieldPolicy<T[]>;
declare type TEdge<TNode> = {
    cursor?: string;
    node: TNode;
} | (Reference & {
    cursor?: string;
});
declare type TPageInfo = {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
};
declare type TExistingRelay<TNode> = Readonly<{
    edges: TEdge<TNode>[];
    pageInfo: TPageInfo;
}>;
declare type TIncomingRelay<TNode> = {
    edges?: TEdge<TNode>[];
    pageInfo?: TPageInfo;
};
declare type RelayFieldPolicy<TNode> = FieldPolicy<TExistingRelay<TNode>, TIncomingRelay<TNode>, TIncomingRelay<TNode>>;
export declare function relayStylePagination<TNode = Reference>(keyArgs?: KeyArgs): RelayFieldPolicy<TNode>;
export {};
//# sourceMappingURL=pagination.d.ts.map