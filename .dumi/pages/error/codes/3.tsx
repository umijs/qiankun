import React from 'react'
import CodeSnippet from '../CodeSnippet'

export default function ErrorCode1(props) {
    return (
        <>
            <h1>#3: entry {props.getErrorCodeArg(0)} load failed as entry script {props.getErrorCodeArg(1)} load failed</h1>
        </>
    )
}