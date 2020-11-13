import { InlineFragmentNode, FragmentDefinitionNode, SelectionSetNode, FieldNode } from 'graphql';
import { FragmentMap, StoreValue, StoreObject, Reference, isReference } from '../../utilities';
import { IdGetter, ReadMergeModifyContext } from "./types";
import { FieldValueToBeMerged } from './helpers';
import { InMemoryCache } from './inMemoryCache';
import { SafeReadonly, FieldSpecifier, ToReferenceFunction, ReadFieldFunction, ReadFieldOptions, CanReadFunction } from '../core/types/common';
export declare type TypePolicies = {
    [__typename: string]: TypePolicy;
};
declare type KeySpecifier = (string | any[])[];
declare type KeyFieldsContext = {
    typename?: string;
    selectionSet?: SelectionSetNode;
    fragmentMap?: FragmentMap;
    keyObject?: Record<string, any>;
};
export declare type KeyFieldsFunction = (object: Readonly<StoreObject>, context: KeyFieldsContext) => KeySpecifier | ReturnType<IdGetter>;
export declare type TypePolicy = {
    keyFields?: KeySpecifier | KeyFieldsFunction | false;
    queryType?: true;
    mutationType?: true;
    subscriptionType?: true;
    fields?: {
        [fieldName: string]: FieldPolicy<any> | FieldReadFunction<any>;
    };
};
export declare type KeyArgsFunction = (args: Record<string, any> | null, context: {
    typename: string;
    fieldName: string;
    field: FieldNode | null;
    variables?: Record<string, any>;
}) => KeySpecifier | ReturnType<IdGetter>;
export declare type FieldPolicy<TExisting = any, TIncoming = TExisting, TReadResult = TExisting> = {
    keyArgs?: KeySpecifier | KeyArgsFunction | false;
    read?: FieldReadFunction<TExisting, TReadResult>;
    merge?: FieldMergeFunction<TExisting, TIncoming> | boolean;
};
export declare type StorageType = Record<string, any>;
export interface FieldFunctionOptions<TArgs = Record<string, any>, TVars = Record<string, any>> {
    args: TArgs | null;
    fieldName: string;
    storeFieldName: string;
    field: FieldNode | null;
    variables?: TVars;
    isReference: typeof isReference;
    toReference: ToReferenceFunction;
    storage: StorageType;
    cache: InMemoryCache;
    readField: ReadFieldFunction;
    canRead: CanReadFunction;
    mergeObjects<T extends StoreObject | Reference>(existing: T, incoming: T): T | undefined;
}
export declare type FieldReadFunction<TExisting = any, TReadResult = TExisting> = (existing: SafeReadonly<TExisting> | undefined, options: FieldFunctionOptions) => TReadResult | undefined;
export declare type FieldMergeFunction<TExisting = any, TIncoming = TExisting> = (existing: SafeReadonly<TExisting> | undefined, incoming: SafeReadonly<TIncoming>, options: FieldFunctionOptions) => SafeReadonly<TExisting>;
export declare const defaultDataIdFromObject: ({ __typename, id, _id }: Readonly<StoreObject>, context?: KeyFieldsContext | undefined) => string | undefined;
export declare type PossibleTypesMap = {
    [supertype: string]: string[];
};
export declare class Policies {
    private config;
    private typePolicies;
    private supertypeMap;
    private fuzzySubtypes;
    readonly cache: InMemoryCache;
    readonly rootIdsByTypename: Record<string, string>;
    readonly rootTypenamesById: Record<string, string>;
    readonly usingPossibleTypes = false;
    constructor(config: {
        cache: InMemoryCache;
        dataIdFromObject?: KeyFieldsFunction;
        possibleTypes?: PossibleTypesMap;
        typePolicies?: TypePolicies;
    });
    identify(object: StoreObject, selectionSet?: SelectionSetNode, fragmentMap?: FragmentMap): [string?, StoreObject?];
    addTypePolicies(typePolicies: TypePolicies): void;
    private setRootTypename;
    addPossibleTypes(possibleTypes: PossibleTypesMap): void;
    private getTypePolicy;
    private getFieldPolicy;
    private getSupertypeSet;
    fragmentMatches(fragment: InlineFragmentNode | FragmentDefinitionNode, typename: string | undefined, result?: Record<string, any>, variables?: Record<string, any>): boolean;
    getStoreFieldName(fieldSpec: FieldSpecifier): string;
    readField<V = StoreValue>(options: ReadFieldOptions, context: ReadMergeModifyContext): SafeReadonly<V> | undefined;
    hasMergeFunction(typename: string | undefined, fieldName: string): boolean;
    applyMerges<T extends StoreValue>(existing: T | Reference, incoming: T | FieldValueToBeMerged, context: ReadMergeModifyContext, storageKeys?: [string | StoreObject, string]): T;
}
export {};
//# sourceMappingURL=policies.d.ts.map