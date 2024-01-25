import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'
// import { trackEvent } from '~app/plausible'
import { chatFamily } from '~app/state'
import { setConversationMessages } from '~services/chat-history'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'
import { ProviderId } from '../providers'

export function useChat(providerId: ProviderId, targetLang: string) {
  console.log("useChat", providerId, targetLang)
  const chatAtom = useMemo(() => chatFamily({ providerId, targetLang }), [providerId, targetLang])
  const [chatState, setChatState] = useAtom(chatAtom)

  const updateMessage = useCallback(
    (messageId: string, updater: (message: ChatMessageModel) => void) => {
      setChatState((draft) => {
        const message = draft.messages.find((m) => m.id === messageId)
        if (message) {
          updater(message)
        }
      })
    },
    [setChatState],
  )
  const updateMessageIdJust = useCallback(
    (messageId: string, updater: (message: ChatMessageModel) => void) => {
      setChatState((draft) => {
        const message = draft.messages.find((m) => m.id === messageId)
      })
    },
    [setChatState],
  )

  const sendMessage = useCallback(
    async (input: string, sourceLang: string, targetLang: string) => {
      // trackEvent('send_message', { providerId })
      const providerMessageId = uuid()
      setChatState((draft) => {
        draft.messages.push({ id: uuid(), text: input, author: 'user' }, { id: providerMessageId, text: '', author: providerId })
      })
      const abortController = new AbortController()
      setChatState((draft) => {
        draft.generatingMessageId = providerMessageId
        draft.abortController = abortController
      })
      console.log("chatState.provider", chatState.provider);
      console.log("input", input);
      console.log("abortController.signal", abortController.signal);
      await chatState.provider.sendMessage({
        prompt: input,
        sourceLang: sourceLang,
        targetLang: targetLang,
        signal: abortController.signal,
        onEvent(event: any) {
          console.debug("event", event)
          if (event.type === 'UPDATE_ANSWER') {
            updateMessage(providerMessageId, (message) => {
              message.text = event.data.text
            })
          } else if (event.type === 'ERROR') {
            console.error('sendMessage error', event.error.code, event.error)
            updateMessage(providerMessageId, (message) => {
              message.error = event.error
            })
            setChatState((draft) => {
              draft.abortController = undefined
              draft.generatingMessageId = ''
            })
          } else if (event.type === 'DONE') {
            setChatState((draft) => {
              draft.abortController = undefined
              draft.generatingMessageId = ''
            })
          }
        },
      })
    },
    [providerId, chatState.provider, setChatState, updateMessage],
  )

  const resetConversation = useCallback(() => {
    chatState.provider.resetConversation()
    setChatState((draft) => {
      draft.abortController = undefined
      draft.generatingMessageId = ''
      draft.messages = []
      draft.conversationId = uuid()
    })
  }, [chatState.provider, setChatState])

  const stopGeneratingSilently = useCallback(() => {
    chatState.abortController?.abort()
    if (chatState.generatingMessageId) {
      updateMessageIdJust(chatState.generatingMessageId, (message) => {
      })
    }
    setChatState((draft) => {
      draft.generatingMessageId = ''
    })
  }, [chatState.abortController, chatState.generatingMessageId, setChatState, updateMessage])

  const stopGenerating = useCallback(() => {
    chatState.abortController?.abort()
    if (chatState.generatingMessageId) {
      updateMessage(chatState.generatingMessageId, (message) => {
        if (!message.text && !message.error) {
          message.text = 'Cancelled'
        }
      })
    }
    setChatState((draft) => {
      draft.generatingMessageId = ''
    })
  }, [chatState.abortController, chatState.generatingMessageId, setChatState, updateMessage])

  useEffect(() => {
    if (chatState.messages.length) {
      setConversationMessages(providerId, chatState.conversationId, chatState.messages)
    }
  }, [providerId, chatState.conversationId, chatState.messages])

  const chat = useMemo(
    () => ({
      providerId,
      targetLang: targetLang,
      provider: chatState.provider,
      messages: chatState.messages,
      sendMessage,
      resetConversation,
      generating: !!chatState.generatingMessageId,
      stopGenerating,
      stopGeneratingSilently,
    }),
    [
      providerId,
      targetLang,
      chatState.provider,
      chatState.generatingMessageId,
      chatState.messages,
      resetConversation,
      sendMessage,
      stopGenerating,
      stopGeneratingSilently,
    ],
  )

  return chat
}
