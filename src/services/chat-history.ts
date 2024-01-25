import { zip } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { ProviderId } from '~app/providers'
import { ChatMessageModel } from '~types'

/**
 * conversations:$providerId => Conversation[]
 * conversation:$providerId:$cid:messages => ChatMessageModel[]
 */

interface Conversation {
  id: string
  createdAt: number
}

type ConversationWithMessages = Conversation & { messages: ChatMessageModel[] }

async function loadHistoryConversations(providerId: ProviderId): Promise<Conversation[]> {
  const key = `conversations:${providerId}`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || []
}

async function deleteHistoryConversation(providerId: ProviderId, cid: string) {
  const conversations = await loadHistoryConversations(providerId)
  const newConversations = conversations.filter((c) => c.id !== cid)
  await Browser.storage.local.set({ [`conversations:${providerId}`]: newConversations })
}

async function loadConversationMessages(providerId: ProviderId, cid: string): Promise<ChatMessageModel[]> {
  const key = `conversation:${providerId}:${cid}:messages`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || []
}

export async function setConversationMessages(providerId: ProviderId, cid: string, messages: ChatMessageModel[]) {
  const conversations = await loadHistoryConversations(providerId)
  if (!conversations.some((c) => c.id === cid)) {
    conversations.unshift({ id: cid, createdAt: Date.now() })
    await Browser.storage.local.set({ [`conversations:${providerId}`]: conversations })
  }
  const key = `conversation:${providerId}:${cid}:messages`
  await Browser.storage.local.set({ [key]: messages })
}

export async function loadHistoryMessages(providerId: ProviderId): Promise<ConversationWithMessages[]> {
  const conversations = await loadHistoryConversations(providerId)
  const messagesList = await Promise.all(conversations.map((c) => loadConversationMessages(providerId, c.id)))
  return zip(conversations, messagesList).map(([c, messages]) => ({
    id: c!.id,
    createdAt: c!.createdAt,
    messages: messages!,
  }))
}

export async function deleteHistoryMessage(providerId: ProviderId, conversationId: string, messageId: string) {
  const messages = await loadConversationMessages(providerId, conversationId)
  const newMessages = messages.filter((m) => m.id !== messageId)
  await setConversationMessages(providerId, conversationId, newMessages)
  if (!newMessages.length) {
    await deleteHistoryConversation(providerId, conversationId)
  }
}
