import { FC, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Browser from 'webextension-polyfill'
import { ConversationContext } from '~app/context'
import { ChatError, ErrorCode } from '~utils/errors'
import Button from '../Button'
import MessageBubble from './MessageBubble'

const ErrorAction: FC<{ error: ChatError }> = ({ error }) => {
  const conversation = useContext(ConversationContext)
  const { t } = useTranslation()
  if (error.code === ErrorCode.GOOGLETRANSLATE_EMPTY_RESPONSE) {
    return (
      <a href="https://google.com" target="_blank" rel="noreferrer">
        <Button color="primary" text="Login at google.com" size="small" />
      </a>
    )
  }
  if (
    error.code === ErrorCode.NETWORK_ERROR ||
    (error.code === ErrorCode.UNKOWN_ERROR && error.message.includes('Failed to fetch'))
  ) {
    return <p className="ml-2 text-secondary-text text-sm">{t('Please check your network connection')}</p>
  }
  return null
}

export default ErrorAction
