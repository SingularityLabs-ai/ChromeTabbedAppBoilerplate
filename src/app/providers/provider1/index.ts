import { uuid } from '~utils'
import { ofetch } from 'ofetch'
import { /*PiModel,*/ UserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse3 } from '~utils/sse'
import { AbstractProvider, SendMessageParams } from '../abstract-provider'
import { requestHostPermission } from '~app/utils/permissions'
import { COMMON_ERROR_MESSAGE } from '~app/consts'
// import google from "./translator/index.js";

interface ConversationContext {
  initialized: boolean
}

export function cacheFn(fn: any) {
  var cache:any = {};

  return async function () {
    var args = arguments;
    var key = [].slice.call(args).join("");
    if (10000 < Object.keys(cache).length) {
      cache = {}; //numbers.shift();
    }

    if (cache[key]) {
      return cache[key];
    } else {
      cache[key] = await fn.apply(this, args);
      return cache[key];
    }
  };
}


export class Provider1 extends AbstractProvider {
  private conversationContext?: ConversationContext

  constructor() {
    super();
  }

  resetConversation() {
    console.log('Provider1 resetConversation')
    this.conversationContext = void 0
  }

  async remoteCallingFunction(word: string, sourceLang: string, targetLang: string) {
    console.log("remoteCallingFunction:", word, sourceLang, targetLang)
    let dummyResponse:any = {}
    var response:any = dummyResponse;//await this.requestTranslate(word, sourceLang, targetLang);
    return response;
  }

  async doSendMessage(params: SendMessageParams) {
    console.log("doSendMessage", params)
    if (!this.conversationContext) {
      this.conversationContext = {
        initialized: !0
      };
    }

    console.log("doSendMessage", params)
    var resp:any = await this.remoteCallingFunction(params.prompt, params.sourceLang, params.targetLang);
    console.log("doSendMessage final response", resp)

    await parseSSEResponse3(resp, message => {
      console.debug("gootle translate sse", message);
      message && params.onEvent({
        type: "UPDATE_ANSWER",
        data: {
          text: message
        }
      })
    }).catch((err: Error) => {
      console.log("PI error caught succesfully:", err)
      throw new ChatError('Failed to access Provider1.' + COMMON_ERROR_MESSAGE('https://google.com'), ErrorCode.GOOGLETRANSLATE_EMPTY_RESPONSE)
    })
    params.onEvent({
      type: "DONE"
    });
  }

}
