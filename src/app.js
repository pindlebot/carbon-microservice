import React from 'react'
import { Controls } from './components/Controls'
import * as hljs from 'highlight.js'
import { DEFAULT_CODE } from './constants'

const Terminal = (props) => (
  <div className={'terminal'}>
    <div className={'terminal-header'}>
      <Controls />
    </div>
    <div className={'terminal-content'}>
      {props.codeLines.map((line, i) => <pre
        key={`code_${i}`}
        dangerouslySetInnerHTML={{
          __html: hljs.highlight(props.language, line).value
        }}
      />
      )}
    </div>
  </div>
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
    const codeLines = this.props.code.split(/\r?\n/g)
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
