/**
 * sidebar: false
 */

import React from 'react'
import { useLocation, useParams } from 'react-router-dom';
import Error1 from './codes/1'
import { useSearchParams } from 'dumi';
const r = require.context('./codes/', false, /\.tsx$/);

export default function CodeSnippet() {
    let [searchParams, setSearchParams] = useSearchParams();
    const code = searchParams.get('code');
    const Comp = code && r(`./${code}.tsx`).default;
    const errorCodeArgs = searchParams.getAll('arg');

    return code ? (
        <div>
            <Comp errorCodeArgs={errorCodeArgs}
                getErrorCodeArg={getErrorCodeArg}
                errorCode={code} />
        </div>
    ) : (<div>请输入错误码code</div>)

    function getErrorCodeArg(index, argName) {
        const missingArg = argName ? `(${argName})` : `(unknown)`;
        return errorCodeArgs.length > index ? errorCodeArgs[index] : missingArg;
    }
}