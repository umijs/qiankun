import React from 'react'
import CodeSnippet from '../CodeSnippet'

export default function ErrorCode1(props) {
    return (
        <>
            <h1>#6: You need to export lifecycle functions in {props.getErrorCodeArg(0)} entry</h1>
        </>
    )
}