import { Sentry } from '~services/sentry'
import { ChatError, ErrorCode } from '~utils/errors'

export type Event =
  | {
      type: 'UPDATE_ANSWER'
      data: {
        text: string
      }
    }
  | {
      type: 'DONE'
    }
  | {
      type: 'ERROR'
      error: ChatError
    }

export interface SendMessageParams {
  prompt: string
  sourceLang: string
  targetLang: string
  onEvent: (event: Event) => void
  signal?: AbortSignal
}

export abstract class AbstractProvider {
  async sendMessage(params: SendMessageParams) {
    try {
      console.log("abstract sendMessage params", params)
      await this.doSendMessage(params)
    } catch (err) {
      if (err instanceof ChatError) {
        console.log("AbstractProvider sendMessage 1", err)
        params.onEvent({ type: 'ERROR', error: err })
      } else if (!params.signal?.aborted) {
        // ignore user abort exception
        console.log("AbstractProvider sendMessage UNKOWN_ERROR 2", err)
        params.onEvent({ type: 'ERROR', error: new ChatError((err as Error).message, ErrorCode.UNKOWN_ERROR) })
      }
      Sentry.captureException(err)
    }
  }

  get name(): string | undefined {
    return undefined
  }

  abstract doSendMessage(params: SendMessageParams): Promise<void>
  abstract resetConversation(): void
}

class DummyProvider extends AbstractProvider {
  async doSendMessage(_params: SendMessageParams) {
    // dummy
  }
  resetConversation() {
    // dummy
  }
  get name() {
    return ''
  }
}

export abstract class AsyncAbstractProvider extends AbstractProvider {
  #provider: AbstractProvider

  constructor() {
    super()
    this.#provider = new DummyProvider()
    this.initializeProvider().then((provider) => {
      this.#provider = provider
    })
  }

  abstract initializeProvider(): Promise<AbstractProvider>

  doSendMessage(params: SendMessageParams) {
    return this.#provider.doSendMessage(params)
  }

  resetConversation() {
    return this.#provider.resetConversation()
  }

  get name() {
    return this.#provider.name
  }
}
