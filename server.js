import path from 'path'
import App from './src/app'
import React from 'react'
import http from 'http'
import customMiddleware from './src/middleware'
import launchChrome from '@serverless-chrome/lambda'
import CDP from 'chrome-remote-interface'
import { DEFAULT_CODE } from './src/constants'
import { parse } from 'query-string'

const PORT = process.env.PORT || 3000

let server

async function setHtml (client, html) {
  const { Page } = client

  const { frameTree: { frame: { id: frameId } } } = await Page.getResourceTree()
  await Page.setDocumentContent({ frameId, html })
}

async function connectToChrome () {
  const target = await CDP.New({
    port: 9222,
    host: 'localhost'
  })
  return CDP({ target, host: 'localhost', port: 9222 })
}

async function getBoxModel (
  client,
  selector
) {
  const { DOM } = client
  const { root: { nodeId: documentNodeId } } = await DOM.getDocument()
  const { nodeId } = await DOM.querySelector({
    selector: selector,
    nodeId: documentNodeId
  })

  const { model } = await DOM.getBoxModel({ nodeId })

  return model
}

function boxModelToViewPort (model, scale) {
  return {
    // x: model.content[0],
    // y: model.content[1],
    x: 0,
    y: 0,
    width: model.width,
    height: model.height,
    scale
  }
}

async function screenshot (client, selector, options = {}) {
  const { Page } = client

  const captureScreenshotOptions = {
    format: 'png',
    fromSurface: true,
    clip: undefined
  }
  if (selector) {
    const model = await getBoxModel(client, selector)
    captureScreenshotOptions.clip = boxModelToViewPort(model, 3)
  }

  if (options && options.omitBackground) {
    client.Emulation.setDefaultBackgroundColorOverride({
      color: { r: 0, g: 0, b: 0, a: 0 }
    })
  }
  const screenshot = await Page.captureScreenshot(captureScreenshotOptions)
  if (options && options.omitBackground) {
    client.Emulation.setDefaultBackgroundColorOverride()
  }
  return screenshot.data
}

const end = async ({ client, chrome }) => {
  // await upload(data, { key: message.key })
  await CDP.Close({
    host: 'localhost',
    port: 9222,
    id: client.target.id
  })
  chrome.kill()
  await client.close()
}

const run = async (staticMarkup) => {
  const client = await connectToChrome()
  await setHtml(client, staticMarkup)

  let data = await screenshot(client, '.boundary')
  return data
}

const bodyParser = (req) => {
  let { headers } = req
  let contentType = headers['content-type']
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })

  return new Promise((resolve, reject) => {
    req.on('end', () => {
      resolve(
        contentType === 'application/json'
          ? JSON.parse(body)
          : { code: body || DEFAULT_CODE }
      )
    })
  })
}

let chrome

const BASE_64_RE = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

const handler = async (req, res, next) => {
  let query = parse(req.url.slice(1)) || {}
  if (query.code) {
    // query.code = Buffer.from(decodeURIComponent(query.code), 'base64').toString()
  }

  if (req.method === 'POST') {
    if (!chrome) {
      chrome = await launchChrome({
        flags: ['--window-size=1280x1696', '--hide-scrollbars']
      })
    }
    let json = await bodyParser(req)
    let staticMarkup = customMiddleware(App, { ...json, ...query })
    let data = await run(staticMarkup)
    res.setHeader('Content-type', 'image/png')
    res.end(Buffer.from(data, 'base64'))
  } else {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    let staticMarkup = customMiddleware(App, query)
    res.end(staticMarkup)
  }
}

const createServer = async () => {
  server = http.createServer(handler)
  server.listen(PORT)

  return new Promise((resolve, reject) => {
    server.on('error', err => {
      console.error(err)
      reject(err)
    })

    server.once('listening', () => {
      console.log(
        `Server running at http://localhost:${server.address().port}`
      )

      resolve(server)
    })
  })
}

createServer()
