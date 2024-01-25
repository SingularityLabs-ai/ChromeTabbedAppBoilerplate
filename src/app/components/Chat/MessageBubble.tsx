import cx from 'classnames'
import { FC, PropsWithChildren } from 'react'

interface Props {
  color: 'primary' | 'flat'
  className?: string
}

const MessageBubble: FC<PropsWithChildren<Props>> = (props) => {
  // chat-bubble bg-primary-blue bg-secondary
  return (
    <div
      className={cx(
        ' max-w-full',
        props.color === 'primary' ? 'text-white' : 'text-primary-text',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}

export default MessageBubble
