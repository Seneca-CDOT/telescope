import { __assign, __spreadArrays } from "tslib";
import { __rest } from "tslib";
export function concatPagination(keyArgs) {
    if (keyArgs === void 0) { keyArgs = false; }
    return {
        keyArgs: keyArgs,
        merge: function (existing, incoming) {
            return existing ? __spreadArrays(existing, incoming) : incoming;
        },
    };
}
export function offsetLimitPagination(keyArgs) {
    if (keyArgs === void 0) { keyArgs = false; }
    return {
        keyArgs: keyArgs,
        merge: function (existing, incoming, _a) {
            var args = _a.args;
            var merged = existing ? existing.slice(0) : [];
            if (args) {
                var _b = args.offset, offset = _b === void 0 ? 0 : _b;
                for (var i = 0; i < incoming.length; ++i) {
                    merged[offset + i] = incoming[i];
                }
            }
            else {
                merged.push.apply(merged, incoming);
            }
            return merged;
        },
    };
}
export function relayStylePagination(keyArgs) {
    if (keyArgs === void 0) { keyArgs = false; }
    return {
        keyArgs: keyArgs,
        read: function (existing, _a) {
            var canRead = _a.canRead, readField = _a.readField;
            if (!existing)
                return;
            var edges = [];
            var startCursor = "";
            var endCursor = "";
            existing.edges.forEach(function (edge) {
                if (canRead(readField("node", edge))) {
                    edges.push(edge);
                    if (edge.cursor) {
                        startCursor = startCursor || edge.cursor;
                        endCursor = edge.cursor;
                    }
                }
            });
            return __assign(__assign({}, getExtras(existing)), { edges: edges, pageInfo: __assign(__assign({}, existing.pageInfo), { startCursor: startCursor,
                    endCursor: endCursor }) });
        },
        merge: function (existing, incoming, _a) {
            if (existing === void 0) { existing = makeEmptyData(); }
            var args = _a.args, isReference = _a.isReference, readField = _a.readField;
            var incomingEdges = incoming.edges ? incoming.edges.map(function (edge) {
                if (isReference(edge = __assign({}, edge))) {
                    edge.cursor = readField("cursor", edge);
                }
                return edge;
            }) : [];
            if (incoming.pageInfo) {
                var _b = incoming.pageInfo, startCursor = _b.startCursor, endCursor = _b.endCursor;
                var firstEdge_1 = incomingEdges[0];
                if (firstEdge_1 && startCursor) {
                    firstEdge_1.cursor = startCursor;
                }
                var lastEdge_1 = incomingEdges[incomingEdges.length - 1];
                if (lastEdge_1 && endCursor) {
                    lastEdge_1.cursor = endCursor;
                }
            }
            var prefix = existing.edges;
            var suffix = [];
            if (args && args.after) {
                var index = prefix.findIndex(function (edge) { return edge.cursor === args.after; });
                if (index >= 0) {
                    prefix = prefix.slice(0, index + 1);
                }
            }
            else if (args && args.before) {
                var index = prefix.findIndex(function (edge) { return edge.cursor === args.before; });
                suffix = index < 0 ? prefix : prefix.slice(index);
                prefix = [];
            }
            else if (incoming.edges) {
                prefix = [];
            }
            var edges = __spreadArrays(prefix, incomingEdges, suffix);
            var firstEdge = edges[0];
            var lastEdge = edges[edges.length - 1];
            var pageInfo = __assign(__assign(__assign({}, incoming.pageInfo), existing.pageInfo), { startCursor: firstEdge && firstEdge.cursor || "", endCursor: lastEdge && lastEdge.cursor || "" });
            if (incoming.pageInfo) {
                var _c = incoming.pageInfo, hasPreviousPage = _c.hasPreviousPage, hasNextPage = _c.hasNextPage;
                if (!prefix.length && hasPreviousPage !== void 0) {
                    pageInfo.hasPreviousPage = hasPreviousPage;
                }
                if (!suffix.length && hasNextPage !== void 0) {
                    pageInfo.hasNextPage = hasNextPage;
                }
            }
            return __assign(__assign(__assign({}, getExtras(existing)), getExtras(incoming)), { edges: edges,
                pageInfo: pageInfo });
        },
    };
}
var getExtras = function (obj) { return __rest(obj, notExtras); };
var notExtras = ["edges", "pageInfo"];
function makeEmptyData() {
    return {
        edges: [],
        pageInfo: {
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: "",
            endCursor: "",
        },
    };
}
//# sourceMappingURL=pagination.js.map