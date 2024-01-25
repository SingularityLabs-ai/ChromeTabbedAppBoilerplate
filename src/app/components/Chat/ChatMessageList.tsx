import { FC } from 'react'
import cx from 'classnames'
import ScrollToProvidertom from 'react-scroll-to-bottom'
import { ProviderId } from '~app/providers'
import { ChatMessageModel } from '~types'
import ChatMessageCard from './ChatMessageCard'
import { css } from '@emotion/css'

interface Props {
  providerId: ProviderId
  messages: ChatMessageModel[]
  className?: string
  stopGeneratingSilently?: () => void
  bgImage: any
  bgColor: string
}

const ChatMessageList: FC<Props> = (props) => {
  const ROOT_CSS = css({
    backgroundImage: `url(${props.bgImage})`,
    backgroundColor: props.bgColor,
  });
  return (
    <ScrollToProvidertom className={cx("overflow-auto h-full bg-blend-soft-light bg-repeat", ROOT_CSS)}>
      <div className={cx('flex flex-col gap-3 h-full', props.className)}>
        {props.messages.map((message, index) => {
          if (index!=props.messages.length-1)
            return <div></div>
          return props.stopGeneratingSilently ? 
          <ChatMessageCard key={message.id} index={index} totalMessagesCount={props.messages.length} message={message} className={index === 0 ? 'mt-5' : undefined} stopGeneratingSilently={props.stopGeneratingSilently}/> : 
          <ChatMessageCard key={message.id} index={index} totalMessagesCount={props.messages.length} message={message} className={index === 0 ? 'mt-5' : undefined}/>
        })}
      </div>
    </ScrollToProvidertom>
  )
}

export default ChatMessageList
