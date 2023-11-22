import React from 'react'
import CodeSnippet from '../CodeSnippet'

export default function ErrorCode1(props) {
    return (
        <>
            <h1>#8: {props.getErrorCodeArg(0)} container {props.getErrorCodeArg(1)} element not ready while rebuilding!</h1>
        </>
    )
}