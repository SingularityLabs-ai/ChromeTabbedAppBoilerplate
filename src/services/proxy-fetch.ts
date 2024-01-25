import Browser from 'webextension-polyfill'
import {
  ProxyFetchRequestMessage,
  ProxyFetchResponseBodyChunkMessage,
  ProxyFetchResponseMetadataMessage,
  RequestInitSubset,
} from '~types/messaging'
import { uuid } from '~utils'
import { string2Uint8Array, uint8Array2String } from '~utils/encoding'
import { streamAsyncIterable } from '~utils/stream-async-iterable'

export function setupProxyExecutor() {
  // one port for one fetch request
  Browser.runtime.onConnect.addListener((port) => {
    const abortController = new AbortController()
    port.onDisconnect.addListener(() => {
      abortController.abort()
    })
    port.onMessage.addListener(async (message: ProxyFetchRequestMessage) => {
      console.debug('proxy fetch', message.url, message.options)
      const resp = await fetch(message.url, {
        ...message.options,
        signal: abortController.signal,
      })
      port.postMessage({
        type: 'PROXY_RESPONSE_METADATA',
        metadata: {
          status: resp.status,
          statusText: resp.statusText,
          headers: Object.fromEntries(resp.headers.entries()),
        },
      } as ProxyFetchResponseMetadataMessage)
      for await (const chunk of streamAsyncIterable(resp.body!)) {
        port.postMessage({
          type: 'PROXY_RESPONSE_BODY_CHUNK',
          value: uint8Array2String(chunk),
          done: false,
        } as ProxyFetchResponseBodyChunkMessage)
      }
      port.postMessage({ type: 'PROXY_RESPONSE_BODY_CHUNK', done: true } as ProxyFetchResponseBodyChunkMessage)
    })
  })
}

export async function proxyFetch(tabId: number, url: string, options?: RequestInitSubset): Promise<Response> {
  console.debug('proxyFetch', tabId, url, options)
  return new Promise((resolve) => {
    const port = Browser.tabs.connect(tabId, { name: uuid() })
    port.onDisconnect.addListener(() => {
      throw new DOMException('proxyFetch aborted', 'AbortError')
    })
    options?.signal?.addEventListener('abort', () => port.disconnect())
    const body = new ReadableStream({
      start(controller) {
        console.debug('proxyFetch inside controller', controller)
        port.onMessage.addListener(function onMessage(
          message: ProxyFetchResponseMetadataMessage | ProxyFetchResponseBodyChunkMessage,
        ) {
          console.debug('proxyFetch received onMessage', message)
          if (message.type === 'PROXY_RESPONSE_METADATA') {
            const response = new Response(body, message.metadata)
            resolve(response)
          } else if (message.type === 'PROXY_RESPONSE_BODY_CHUNK') {
            if (message.done) {
              controller.close()
              port.onMessage.removeListener(onMessage)
              port.disconnect()
            } else {
              const chunk = string2Uint8Array(message.value)
              controller.enqueue(chunk)
            }
          }
        })
        console.debug('proxyFetch still inside controller about to postMessage for GET req at', url)
        port.postMessage({ url, options } as ProxyFetchRequestMessage)
      },
      cancel(_reason: string) {
        port.disconnect()
      },
    })
    console.debug('proxyFetch body', body)
  })
}
