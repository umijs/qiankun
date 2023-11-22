import React from 'react'
import CodeSnippet from '../CodeSnippet'

export default function ErrorCode1(props) {
    return (
        <>
            <h1>#4: entry {props.getErrorCodeArg(0)} response body is empty!</h1>
        </>
    )
}