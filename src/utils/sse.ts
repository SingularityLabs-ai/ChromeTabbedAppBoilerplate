import { createParser } from 'eventsource-parser'
import { isEmpty } from 'lodash-es'
import { ChatError, ErrorCode } from './errors'
import { streamAsyncIterable } from './stream-async-iterable'
import { COMMON_ERROR_MESSAGE } from '~app/consts'

export async function parseSSEResponse(resp: Response, onMessage: (message: string) => void) {
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}))
    if (!isEmpty(error)) {
      throw new Error(JSON.stringify(error))
    }
    throw new ChatError(`${resp.status} ${resp.statusText}. ${COMMON_ERROR_MESSAGE('')}` , ErrorCode.NETWORK_ERROR)
  }
  const parser = createParser((event) => {
    console.log("parseSSEResponse parser event", event)//event=`{data:'{}',event:'',id='',type=''}`
    if (event.type === 'event') {
      onMessage(event.data)
    }
  })
  for await (const chunk of streamAsyncIterable(resp.body!)) {
    const str = new TextDecoder().decode(chunk)
    console.log("parseSSEResponse str", str)//str=`data:{message:{author:{name="someone"},content:{parts=["sometext"]}}`
    parser.feed(str)
  }
}

export async function parseSSEResponse3(resp: any, onMessage: (message: string) => void) {
  onMessage(resp.translatedText)
}

export async function parseSSEResponse2(resp: Response, onMessage: (message: string) => void) {
  console.log("parseSSEResponse2_resp", resp)
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}))
    if (!isEmpty(error)) {
      throw new Error(JSON.stringify(error))
    }
    throw new ChatError(`${resp.status} ${resp.statusText}. ${COMMON_ERROR_MESSAGE('')}`, ErrorCode.NETWORK_ERROR)
  }
  for await (const chunk of streamAsyncIterable(resp.body!)) {
    const str = new TextDecoder().decode(chunk)
    console.log("parseSSEResponse2_str", str)//str=`{"text":" sometext","is_finished":false}`
    try {
      let strjson = JSON.parse(str)
      if (strjson.is_finished == true && strjson.finish_reason === "COMPLETE") {
        onMessage(strjson.text)
        onMessage('[DONE]')
      } else {
        onMessage(strjson.text)
      }
    } catch (ex) {
      console.log(ex)
    }
  }
}
