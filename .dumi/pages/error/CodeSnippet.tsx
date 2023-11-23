import React from 'react'

export default function CodeSnippet(props) {
  const lines = props.children.split('\n')
  const firstTextualLine = lines.find(l => l.trim() !== l)
  const numLeadingSpaces = firstTextualLine ? /([^\s])/.exec(firstTextualLine).index : 0
  const formattedLines = lines.map(line => line.slice(numLeadingSpaces)).filter((line, i) => line.length > 0 || i > 0).join('\n')
  return (
    <div className="__dumi-default-code-block">
      <pre className="prism-code language-tsx">
      {formattedLines}
    </pre>
    </div>
    
  )
}