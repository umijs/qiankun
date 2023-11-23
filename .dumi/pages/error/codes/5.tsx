import React from 'react'
import CodeSnippet from '../CodeSnippet'

export default function ErrorCode1(props) {
    return (
        <>
            <h1>#5: {props.getErrorCodeArg(0)} entry {props.getErrorCodeArg(1)} load failed as it not export lifecycles</h1>
        </>
    )
}