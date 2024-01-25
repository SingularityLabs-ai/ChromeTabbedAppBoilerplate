import cx from 'classnames'
import { useAtomValue, useSetAtom } from 'jotai'
import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clearIcon from '~/assets/icons/trash-slate-thin.svg'
import historyIcon from '~/assets/icons/history-slate-thin.svg'
import shareIcon from '~/assets/icons/share-slate-thin.svg'
import { CHATBOTS } from '~app/consts'
import { ConversationContext, ConversationContextValue } from '~app/context'
// import { trackEvent } from '~app/plausible'
import { ChatMessageModel } from '~types'
import { ProviderId, ProviderInstance } from '../../providers'
import Button from '../Button'
import IconButton from '~/app/components/IconButton'
import HistoryDialog from '../History/Dialog'
import ShareDialog from '../Share/Dialog'
import SwitchProviderDropdown from '../SwitchProviderDropdown'
import Tooltip from '../Tooltip'
import ChatMessageInput from './ChatMessageInput'
import ChatMessageList from './ChatMessageList'
import sendIcon from '~/assets/icons/send-black-thin.svg'
import { zoomconvboxAtom } from '~app/state'

interface Props {
  providerId: ProviderId
  targetLang?: string
  provider: ProviderInstance
  messages: ChatMessageModel[]
  onUserSendMessage: (input: string, sourceLang: string, targetLang: string, providerId: ProviderId) => void
  resetConversation: () => void
  generating: boolean
  stopGenerating: () => void
  stopGeneratingSilently?: () => void
  mode?: 'full' | 'compact'
  onSwitchProvider?: (providerId: ProviderId) => void
  bgImage: any
  bgColor: string
}

const ConversationPanel: FC<Props> = (props) => {
  const { t } = useTranslation()
  const providerInfo = CHATBOTS[props.providerId]
  const mode = props.mode || 'full'
  const isMultiChat = (props.onSwitchProvider != undefined)
  const marginClass = 'mx-5'
  const [showHistory, setShowHistory] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const enabledZoomOnHover = useAtomValue(zoomconvboxAtom)
  // console.log('ConversationPanel enabledZoomOnHover:', enabledZoomOnHover)

  const context: ConversationContextValue = useMemo(() => {
    return {
      reset: props.resetConversation,
    }
  }, [props.resetConversation])

  const onSubmit = useCallback(
    async (input: string) => {
      props.onUserSendMessage(input as string, 'auto' as string, 'hi' as string, props.providerId)
    },
    [props],
  )

  const resetConversation = useCallback(() => {
    if (!props.generating) {
      props.resetConversation()
    }
  }, [props])

  const openHistoryDialog = useCallback(() => {
    setShowHistory(true)
    // trackEvent('open_history_dialog', { providerId: props.providerId })
  }, [props.providerId])

  const openShareDialog = useCallback(() => {
    setShowShareDialog(true)
    // trackEvent('open_share_dialog', { providerId: props.providerId })
  }, [props.providerId])

  return (
    <ConversationContext.Provider value={context}>
      <div className={cx('flex flex-col overflow-hidden bg-primary-background h-full rounded-[6px]', (isMultiChat && enabledZoomOnHover) ? 'zoomconvbox' : '')}>
        <div
          className={cx(
            'border-b border-solid border-primary-border flex flex-row items-center justify-between gap-2 py-[10px]',
            marginClass,
          )}
        >
          <div className="flex flex-row items-center gap-2">
            <img src={providerInfo.avatar} className="w-[18px] h-[18px] object-contain rounded-full" />
            <Tooltip content={(props.provider.name || providerInfo.name) + (('(' + props.targetLang + ')') || '')}>
              <span className="font-semibold text-primary-text text-sm cursor-default">{props.targetLang}</span>
            </Tooltip>
            {/*mode === 'compact' && props.onSwitchProvider && (
              <SwitchProviderDropdown selectedProviderId={props.providerId} onChange={props.onSwitchProvider} />
            )*/}
          </div>
          <div className="flex flex-row items-center gap-3">
            <Tooltip content={t('Share conversation')}>
              <img src={shareIcon} className="w-5 h-5 cursor-pointer" onClick={openShareDialog} />
            </Tooltip>
            <Tooltip content={t('Clear conversation')}>
              <img
                src={clearIcon}
                className={cx('w-5 h-5', props.generating ? 'cursor-not-allowed' : 'cursor-pointer')}
                onClick={resetConversation}
              />
            </Tooltip>
            <Tooltip content={t('View history')}>
              <img src={historyIcon} className="w-5 h-5 cursor-pointer" onClick={openHistoryDialog} />
            </Tooltip>
          </div>
        </div>
        <ChatMessageList providerId={props.providerId} messages={props.messages} className={marginClass} stopGeneratingSilently={props.stopGeneratingSilently} bgImage={props.bgImage} bgColor={props.bgColor}/>
        <div className={cx('flex flex-col', marginClass, mode === 'full' ? 'mt-3 mb-3' : 'mt-[5px] mb-[5px]')}>
        {props.bgImage=='' &&
          <div className={cx('flex flex-row items-center gap-[5px]', mode === 'full' ? 'mb-3' : 'mb-0')}>
            {mode === 'compact' && <span className="font-medium text-xs text-light-text">Send to {providerInfo.name}</span>}
            <hr className="grow border-primary-border" />
          </div>
        }
          <ChatMessageInput
            mode={mode}
            disabled={props.generating}
            placeholder={mode === 'compact' ? '' : undefined}
            onSubmit={onSubmit}
            autoFocus={mode === 'full'}
            actionButton={
              props.generating ? (
                <Button
                  text={t('Stop')}
                  color="flat"
                  size={mode === 'full' ? 'normal' : 'small'}
                  onClick={props.stopGenerating}
                />
              ) : (
                mode === 'full' && <IconButton icon={sendIcon} tooltipText={t('Send')} className="bg-[#00000014] dark:bg-[#ffffff26]" type="submit"/>
              )
            }
          />
        </div>
      </div>
      {showHistory && <HistoryDialog providerId={props.providerId} open={true} onClose={() => setShowHistory(false)} />}
      {showShareDialog && (
        <ShareDialog open={true} onClose={() => setShowShareDialog(false)} messages={props.messages} />
      )}
    </ConversationContext.Provider>
  )
}

export default ConversationPanel
