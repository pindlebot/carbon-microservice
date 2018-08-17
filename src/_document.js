import React from 'react'
import PropTypes from 'prop-types'
import fs from 'fs'
import { DEFAULT_BG_COLOR, COLORS } from './constants'
import fonts from './assets/fonts'

const Head = props => (
  <head id={props.id}>
    <title>{props.title}</title>
    <script
      type='text/javascript'
      dangerouslySetInnerHTML={{ __html: props.data }}
    />
    {props.children}
  </head>
)

Head.defaultProps = {
  title: 'untitled',
  id: 'parcel',
  data: {}
}

const Script = ({ src }) =>
  (<script src={src} type='text/javascript' />)

const Body = props => (
  <body>
    <div id='root' />
    {props.children}
  </body>
)

let cache = new Map()

class Document extends React.Component {
  render () {
    const {
      title,
      src,
      children,
      ...props
    } = this.props
    const {
      theme,
      fontFamily,
      fontSize,
      lineHeight
    } = this.props
    console.log(this.props)
    const data = 'window.__DATA__ = ' + JSON.stringify({ props })
    let themeStyles = ''
    if (cache.has(theme)) {
      themeStyles = cache.get(theme)
    } else {
      themeStyles = fs.readFileSync(`node_modules/prismjs/themes/prism-${theme}.css`, { encoding: 'utf8' })
      cache.set(theme, themeStyles)
    }
    return (
      <html lang='en'>
        <Head data={data} title={title}>
          <meta charSet='utf-8' />
          {children}
          <style
            dangerouslySetInnerHTML={{
              __html: `
              ${fonts}
        
              body {
                margin: 0;
                padding: 0;
              }
              
              main {
                position: relative;
                width: 100vw;
                height: 100vh;
              }

              .boundary {
                padding: 20px;
                background-color: ${DEFAULT_BG_COLOR};
                position: absolute;
              }
              
              .terminal {
                display: flex;
                flex-direction: column;
                width: auto;
                border-radius: 3px;
                box-shadow: 0 20px 68px rgba(0, 0, 0, 0.55);
                padding: 0;
              }
              
              .terminal-header {
                flex-basis: 48px;
                height: 48px;
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 0 18px;
              }
              
              .terminal-content {
                flex-basis: calc(100% - 60px);
                box-sizing: border-box;
                padding: 0 18px 18px 18px;
              }
              
              ${themeStyles}

              pre.terminal {
                margin: 0;
                padding: 0;
                font-family: ${fontFamily};
                font-size: ${fontSize};
                overflow: unset;
              }
              code {
                display: block;
                line-height: 18px;
              }
              `
            }}
          />
        </Head>
        <Body src={src} />
      </html>
    )
  }
}

Document.defaultProps = {
  title: 'Untitled',
  theme: 'tomorrow',
  fontFamily: 'Hack',
  fontSize: '14px',
  lineHeight: '133%'
}

Document.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  src: PropTypes.string
}

export default Document
