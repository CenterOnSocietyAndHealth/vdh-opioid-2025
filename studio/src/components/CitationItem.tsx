import React from 'react'

// Custom renderer for items in the citations array that prefixes the preview with [index]
export default function CitationItem(props: any) {
  const {index, renderDefault} = props
  return (
    <div style={{display: 'flex', alignItems: 'flex-start', gap: '8px'}}>
      <div style={{opacity: 0.8, minWidth: '28px', textAlign: 'right'}}>[{(index ?? 0) + 1}]</div>
      <div style={{flex: 1}}>{renderDefault(props)}</div>
    </div>
  )
}


