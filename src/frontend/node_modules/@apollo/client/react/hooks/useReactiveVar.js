import { useState, useEffect } from 'react';
export function useReactiveVar(rv) {
    var value = rv();
    var mute = rv.onNextChange(useState(value)[1]);
    useEffect(function () { return mute; }, []);
    return value;
}
//# sourceMappingURL=useReactiveVar.js.map