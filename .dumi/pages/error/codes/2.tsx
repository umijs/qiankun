import React from 'react'
import CodeSnippet from '../CodeSnippet'

export default function ErrorCode1(props) {
    return (
        <>
            <h1>#2: You should not set multiply entry script in one entry html, but {props.getErrorCodeArg(0)} has at least 2 entry scripts</h1>
        </>
    )
}