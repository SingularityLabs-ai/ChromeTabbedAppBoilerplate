import { ProviderId } from '~app/providers'
import { ChatError } from '~utils/errors'

export interface ChatMessageModel {
  id: string
  author: ProviderId | 'user'
  text: string
  error?: ChatError
}

export interface ConversationModel {
  messages: ChatMessageModel[]
}
