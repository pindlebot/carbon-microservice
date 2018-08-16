import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import Document from './_document'

const getStaticDocumentMarkup = (props) => {
  const staticMarkup = renderToStaticMarkup(
    <Document src={''} {...props} />
  )
  return '<!DOCTYPE html>' + staticMarkup
}

export default (Component, props = {}) => {
  const id = 'root'
  const regex = new RegExp(`(<.*"${id}">)(<\/div>)`)
  const app = renderToString(<Component {...props} />)
  const html = getStaticDocumentMarkup(props)
  return html.replace(regex, `$1${app}$2`)
}
