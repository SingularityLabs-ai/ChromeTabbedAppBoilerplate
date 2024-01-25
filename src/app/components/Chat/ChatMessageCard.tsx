import cx from 'classnames'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { IoCheckmarkSharp, IoCopyOutline } from 'react-icons/io5'
import { BeatLoader } from 'react-spinners'
import { ChatMessageModel } from '~/types'
import Markdown from '../Markdown'
import ErrorAction from './ErrorAction'
import MessageBubble from './MessageBubble'
import { ChatError, ErrorCode } from '~/utils/errors'
import { COMMON_ERROR_MESSAGE } from '~app/consts'

const COPY_ICON_CLASS = 'self-top cursor-pointer invisible group-hover:visible mt-[12px] text-primary-text'

interface Props {
  index: number
  totalMessagesCount: number
  message: ChatMessageModel
  className?: string
  stopGeneratingSilently?: () => void
}

const ChatMessageCard: FC<Props> = ({ index, totalMessagesCount, message, className, stopGeneratingSilently }) => {
  console.log("message", message)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true);
  const webmap = {
    provider1: "https://translate.google.com/"
  }

  const message_delay = "Message Timed out";

  const copyText = useMemo(() => {
    if (message.text) {
      return message.text
    }
    if (message.error) {
      return message.error.message
    }
  }, [message.error, message.text])

  const getErrorCode = useMemo(() => {
    return ErrorCode.NETWORK_ERROR
  }, [message.author])

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied])

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
        if (stopGeneratingSilently)
          stopGeneratingSilently()
      }, ['chatgpt', 'you'].find((m) => m === message.author) ? 15000 : 35000);
    }
  }, [loading]);
 // w-11/12
  if (message.author === 'user')
    return (<></>)
  return (
    <div
      className={cx('group flex gap-3 w-full', /*message.author === 'user' ? 'flex-row-reverse' : */'flex-row', className)}
    >
      <div className={cx("flex flex-col max-w-fit items-start gap-2 chat", /*message.author === 'user' ? "chat-end" :*/ /*"chat-start"*/)}>
        <MessageBubble color={/*message.author === 'user' ? 'primary' :*/ 'flat'}>
          {message.text ? (
            <Markdown>{message.text}</Markdown>
          ) : (totalMessagesCount - 1 == index? (
            !message.error && (loading ? (
              <BeatLoader size={10} className="leading-tight" color="rgb(var(--primary-text))" />
                ):(
                <>
                  <p>{message_delay}</p>
                  {<ErrorAction error={new ChatError(message_delay + `. ${COMMON_ERROR_MESSAGE('')}`, getErrorCode)} /> }
                </>
                )
              )
            ) : <Markdown>Fixed, please retry chat</Markdown>)}
          {!!message.error && <p className="text-red-500">{message.error.message}</p>}
        </MessageBubble>
        {!!message.error && <ErrorAction error={message.error} />}
      </div>
      {!!copyText && (
        <CopyToClipboard text={copyText} onCopy={() => setCopied(true)}>
          {copied ? <IoCheckmarkSharp className={COPY_ICON_CLASS} /> : <IoCopyOutline className={COPY_ICON_CLASS} />}
        </CopyToClipboard>
      )}
    </div>
  )
}

export default memo(ChatMessageCard)
