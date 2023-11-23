import React from 'react'
import CodeSnippet from '../CodeSnippet'

export default function ErrorCode1(props) {
    return (
        <>
            <h1>#7: {props.getErrorCodeArg(0)} head element not existed while accessing document.head!</h1>
        </>
    )
}