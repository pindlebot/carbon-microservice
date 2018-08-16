import React from 'react'
import ReactDOM from 'react-dom'

function init() {
  const props = (window.__DATA__ && window.__DATA__.props) || {}
  import('./app.js')
    .then(module => module.default)
    .then(Root => {
      ReactDOM.hydrate(<Root {...props} />, document.getElementById('root'))
    })
}

init()
