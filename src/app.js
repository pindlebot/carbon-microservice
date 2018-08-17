import React from 'react'
import { Controls } from './components/Controls'
import * as hljs from 'highlight.js'
import { DEFAULT_CODE } from './constants'
import Prism from 'prismjs'
// import { dump } from 'dumper.js'
const loadLanguages = require('prismjs/components/')

const Terminal = (props) => (
  <pre className={`terminal language-${props.language}`}>
    <div className={'terminal-header'}>
      <Controls />
    </div>
    <div className={'terminal-content'}>
      {props.codeLines.map((line, i) => <code
        key={`code_${i}`}
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(line, Prism.languages[props.language], props.language)
        }}
      />
      )}
    </div>
  </pre>
)

const Boundary = ({ children }) => (
  <div className={'boundary'}>{children}</div>
)

const Wrapper = ({ children }) => (
  <main className={'wrapper'}>
    {children}
  </main>
)

let cache = new Map()

class App extends React.Component {
  render () {
    const codeLines = this.props.code.split(/\r?\n/g)
    const language = hljs.highlightAuto(this.props.code).language || 'javascript'
    if (!cache.has(language)) {
      cache.set(language, true)
      loadLanguages([language])
    }
    return (
      <Wrapper>
        <Boundary>
          <Terminal
            codeLines={codeLines}
            language={language}
            {...this.props}
          />
        </Boundary>
      </Wrapper>
    )
  }
}

App.defaultProps = {
  code: DEFAULT_CODE
}

export default App
