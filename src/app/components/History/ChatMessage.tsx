import cx from 'classnames'
import { FC, memo, useCallback } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useSWRConfig } from 'swr'
import { CHATBOTS } from '~/app/consts'
import { ProviderId } from '~app/providers'
import { deleteHistoryMessage } from '~services/chat-history'
import { ChatMessageModel } from '~types'
import Markdown from '../Markdown'

interface Props {
  providerId: ProviderId
  message: ChatMessageModel
  conversationId: string
}

const ChatMessage: FC<Props> = ({ providerId, message, conversationId }) => {
  const { mutate } = useSWRConfig()

  const deleteMessage = useCallback(async () => {
    await deleteHistoryMessage(providerId, conversationId, message.id)
    mutate(`history:${providerId}`)
  }, [providerId, conversationId, message.id, mutate])

  if (!message.text) {
    return null
  }
  console.log("message", message)
  return (
    <div
      className={cx(
        'group relative py-5 flex flex-col gap-1 px-5 text-primary-text',
        message.author === 'user' ? 'bg-secondary' : 'bg-primary-background',
      )}
    >
      <div className="flex flex-row justify-between">
        <span className="text-xs text-secondary-tex">
          {message.author === 'user' ? 'You' : CHATBOTS[message.author].name}
        </span>
        {!!conversationId && (
          <FiTrash2 className="invisible group-hover:visible cursor-pointer" onClick={deleteMessage} />
        )}
      </div>
      <Markdown>{message.text}</Markdown>
    </div>
  )
}

export default memo(ChatMessage)
