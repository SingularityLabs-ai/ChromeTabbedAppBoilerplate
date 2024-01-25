import { FC } from 'react'
import { useChat } from '~app/hooks/use-chat'
import { ProviderId } from '../providers'
import ConversationPanel from '../components/Chat/ConversationPanel'
import { getUserBackgroundimageMode } from '~services/backgroundimage'
import { getBgImageAndColorFromBgmode } from '~app/utils/color-scheme'

interface Props {
  providerId: ProviderId
}

const SingleProviderChatPanel: FC<Props> = ({ providerId }) => {
  const chat = useChat(providerId, 'bn')
  const bgImageMode = getUserBackgroundimageMode()
  let { bgImage, bgColor } = getBgImageAndColorFromBgmode(bgImageMode);

  return (
    <div className="overflow-hidden h-full">
      <ConversationPanel
        providerId={providerId}
        provider={chat.provider}
        messages={chat.messages}
        onUserSendMessage={chat.sendMessage}
        generating={chat.generating}
        stopGenerating={chat.stopGenerating}
        stopGeneratingSilently={chat.stopGeneratingSilently}
        resetConversation={chat.resetConversation}
        bgImage={bgImage}
        bgColor={bgColor}
      />
    </div>
  )
}

export default SingleProviderChatPanel
