import React from 'react'
import { Controls } from './components/Controls'
import * as hljs from 'highlight.js'
import { DEFAULT_CODE } from './constants'
import Prism from 'prismjs'

const Terminal = (props) => (
  <pre className={`terminal language-${props.language}`}>
    <div className={'terminal-header'}>
      <Controls />
    </div>
    <div className={'terminal-content'}>
      {props.codeLines.map((line, i) => <code
        key={`code_${i}`}
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(line, Prism.languages[props.language])
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

class App extends React.Component {
  render () {
    console.log(this.props)
    const codeLines = this.props.code.split(/\r?\n/g)
    console.log({ codeLines })
    const language = hljs.highlightAuto(this.props.code).language || 'js'
    return (
      <Wrapper>
        <Boundary>
          <Terminal codeLines={codeLines} language={language} {...this.props} />
        </Boundary>
      </Wrapper>
    )
  }
}

App.defaultProps = {
  code: DEFAULT_CODE
}

export default App
