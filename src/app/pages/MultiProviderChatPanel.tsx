import cx from 'classnames'
import { css } from '@emotion/css'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { uniqBy } from 'lodash-es'
import { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import IconButton from '~/app/components/IconButton'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import LayoutSwitch from '~app/components/Chat/LayoutSwitch'
import PremiumFeatureModal from '~app/components/PremiumFeatureModal'
import { useChat } from '~app/hooks/use-chat'
import { usePremium } from '~app/hooks/use-premium'
// import { trackEvent } from '~app/plausible'
import { ProviderId } from '../providers'
import ConversationPanel from '../components/Chat/ConversationPanel'
import sendIcon from '~/assets/icons/send-black-thin.svg'
import downloadIcon from '~/assets/icons/download-folder-black-thin.svg'
import ScrollToProvidertom from 'react-scroll-to-bottom'
import { ChatMessageModel } from '~/types'
import { saveAs } from 'file-saver';
import { downloadZip } from 'client-zip';

const PANELNAMES = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF', 'GGG', 'HHH', 'III', 'JJJ', 'KKK', 'LLL', 'MMM', 'NNN', 'OOO', 'PPP', 'QQQ', 'RRR', 'SSS', 'TTT', 'UUU', 'VVV', 'WWW', 'XXX', 'YYY', 'ZZZ', '111', '222', '333', '444', '555', '666', '777', '888', '999', 'aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj', 'kkk', 'lll', 'mmm', 'nnn', 'ooo', 'ppp', 'qqq', 'rrr', 'sss', 'ttt', 'uuu', 'vvv']

const getPanelsCount = (cols: number) => {
  return Math.ceil(PANELNAMES.length / cols) * cols
}

const twoPanelProvidersAtom = atomWithStorage<ProviderId[]>('multiPanelProviders:' + getPanelsCount(2), Array(getPanelsCount(2)).fill('provider1'))
const threePanelProvidersAtom = atomWithStorage<ProviderId[]>('multiPanelProviders:' + getPanelsCount(3), Array(getPanelsCount(3)).fill('provider1'))
const fourPanelProvidersAtom = atomWithStorage<ProviderId[]>('multiPanelProviders:' + getPanelsCount(2), Array(getPanelsCount(2)).fill('provider1'))
const sixPanelProvidersAtom = atomWithStorage<ProviderId[]>('multiPanelProviders:' + getPanelsCount(3), Array(getPanelsCount(3)).fill('provider1'))
const ninePanelProvidersAtom = atomWithStorage<ProviderId[]>('multiPanelProviders:' + getPanelsCount(3), Array(getPanelsCount(3)).fill('provider1'))

import { layoutglobalAtom, zoomconvboxAtom } from '~app/state'
import { getUserBackgroundimageMode } from '~services/backgroundimage'
import { getBgImageAndColorFromBgmode } from '~app/utils/color-scheme'

async function writeHoverStatus(val:boolean) {
  await Browser.storage.sync.set({ hoverBehaviourNotificationSeen: val })
}
const GeneralChatPanel: FC<{
  rows:number
  cols:number
  chats: ReturnType<typeof useChat>[]
  providersAtom: typeof twoPanelProvidersAtom
}> = ({ rows, cols, chats, providersAtom}) => {
  const { t } = useTranslation()
  const generating = useMemo(() => chats.some((c) => c.generating), [chats])
  const setProviders = useSetAtom(providersAtom)
  //const setLayout = useSetAtom(layoutAtom)

  const [premiumModalOpen, setPremiumModalOpen] = useState(false)
  let chatMaps: Map<string, ChatMessageModel> = new Map();
  const premiumState = usePremium()
  const disabled = useMemo(() => !premiumState.isLoading && !premiumState.activated, [premiumState])

  useEffect(() => {
    if (disabled && chats.length > 2) {
      setPremiumModalOpen(true)
    }
  }, [chats.length, disabled])

  const onUserSendMessage = useCallback(
    (input: string, sourceLang?: string, targetLang?: string, providerId?: ProviderId) => {
      if (disabled && chats.length > 2) {
        setPremiumModalOpen(true)
        return
      }
      if (providerId) {
        const chat = chats.find((c) => c.providerId === providerId)
        chat?.sendMessage(input, 'auto', chat.targetLang)
      } else {
        console.log("chats", chats)
        uniqBy(chats, (c) => (c.providerId && c.targetLang)).forEach((c) => {
          console.log("chati", c)
          c.sendMessage(input, 'auto', c.targetLang);
        })
      }
      // trackEvent('send_messages', { count: chats.length })
    },
    [chats, disabled],
  )

  const onSwitchProvider = useCallback(
    (providerId: ProviderId, index: number) => {
      // trackEvent('switch_provider', { providerId, panel: chats.length })
      setProviders((providers) => {
        const newProviders = [...providers]
        newProviders[index] = providerId
        return newProviders
      })
    },
    [chats.length, setProviders],
  )

  // const onLayoutChange = useCallback(
  //   (v: number) => {
  //     // trackEvent('switch_all_in_one_layout', { layout: v })
  //     setLayout(v)
  //   },
  //   [setLayout],
  // )
  const [hoverBehaviourNotificationSeen, setHoverBehaviourNotificationSeen] = useState(false)
  useEffect(() => {
    Browser.storage.sync.get('hoverBehaviourNotificationSeen').then((res) => {
      console.log('MultiProviderChatPanel fetchedHoverStatus:', res, res['hoverBehaviourNotificationSeen'])
      setHoverBehaviourNotificationSeen(res['hoverBehaviourNotificationSeen'])
    })

  }, [])
  const [zoomconvbox, setZoomconvbox] = useAtom(zoomconvboxAtom)
  const revertHover = useCallback(() => {
    setZoomconvbox(false)
    alert("To enable it again go to themes setting in bottom left corner")
    setHoverBehaviourNotificationSeen(true)
    writeHoverStatus(true).then(() => {
      console.log('MultiProviderChatPanel writeHoverStatus:')
    })
  }, [])
  const acceptHover = useCallback(() => {
    // setZoomconvbox(true)
    setHoverBehaviourNotificationSeen(true)
    writeHoverStatus(true).then(() => {
      console.log('MultiProviderChatPanel writeHoverStatus:')
    })
  }, [])

  const downloadAsZip = useCallback(async () => {
    let folderName = "translated_data"
    let files = []
    for (const [key, value] of chatMaps.entries()) {
      try {
        let f = new File([value?.text], folderName + "/" + key + ".txt");
        files.push(f)
      } catch(ex) {
        console.log(ex)
      }
    }
    try {
      const content = await downloadZip(files).blob()
      saveAs(content, folderName + ".zip");
    } catch(ex2) {
      console.log(ex2)
    }
  }, [])

  const bgImageMode = getUserBackgroundimageMode()
  let { bgImage, bgColor } = getBgImageAndColorFromBgmode(bgImageMode);
  const enabledZoomOnHover = useAtomValue(zoomconvboxAtom)
  // console.log('MultiProviderChatPanel enabledZoomOnHover:', enabledZoomOnHover)
  console.log('MultiProviderChatPanel chats.length:', chats.length)
  console.log('MultiProviderChatPanel chats:', chats)
  console.log('MultiProviderChatPanel hoverBehaviourNotificationSeen:', hoverBehaviourNotificationSeen)

  //rows=1, col=3 1000
  //rows=2, col=2 1500 g
  //rows=2, col=3 1000
  //rows=3, col=3 667
  const adjustedheight = css({
    height: (6000 / (rows * cols)) + '%',
  });

  const updatingChatMaps = useCallback(
    (lang:string, chatmesaage: ChatMessageModel[]) => {
      console.log("updating chatMaps", lang, chatmesaage)
      if(chatmesaage.length > 0 && chatmesaage[chatmesaage.length - 1].text.trim().length > 0) {
        chatMaps.set(lang, chatmesaage[chatmesaage.length - 1])
      }
      return true
    },
    []
  )

  return (
  <>
{/*    {zoomconvbox && !hoverBehaviourNotificationSeen && (
      <div role="alert" className="alert">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Zoom on hover has been enabled</span>
        <div>
          <button className="btn btn-sm" onClick={revertHover}>Revert</button>
          <button className="btn btn-sm btn-primary" onClick={acceptHover}>Accept</button>
        </div>
      </div>
    )}*/}
    <div className="flex flex-row overflow-hidden w-full h-full">
      <div className="flex flex-row gap-3 mr-3">
        <ChatMessageInput
          mode="full"
          className="rounded-[6px] bg-primary-background px-4 py-2 grow"
          disabled={generating}
          onSubmit={onUserSendMessage}
          actionButton={!generating && <div className="flex flex-col gap-3 mr-3"><IconButton icon={sendIcon} tooltipText={t('Send')} className="bg-[#00000014] dark:bg-[#ffffff26]" type="submit"/><IconButton icon={downloadIcon} tooltipText={t('Download Translations')} className="bg-[#00000014] dark:bg-[#ffffff26]" onClick={downloadAsZip}/></div>}
          autoFocus={true}
        />
      </div>
      <ScrollToProvidertom className={cx("overflow-auto w-9/12 bg-blend-soft-light bg-repeat")}>
        <div
          className={cx(
            'gap-3 mb-3', adjustedheight,
            enabledZoomOnHover ? ((cols === 3) ? 'zoomconvboxcontainer-cols-3' : 'zoomconvboxcontainer-cols-2')
                               : ((cols === 3) ? 'grid overflow-hidden grow auto-rows-fr grid-cols-3' : 'grid overflow-hidden grow auto-rows-fr grid-cols-2'),
          )}
        >
          {chats.map((chat, index) => (
            updatingChatMaps(chat.targetLang, chat.messages) &&
            <ConversationPanel
              key={`${chat.providerId}-${index}`}
              providerId={chat.providerId}
              targetLang={chat.targetLang}
              provider={chat.provider}
              messages={chat.messages}
              onUserSendMessage={onUserSendMessage}
              generating={chat.generating}
              stopGenerating={chat.stopGenerating}
              stopGeneratingSilently={chat.stopGeneratingSilently}
              mode="compact"
              resetConversation={chat.resetConversation}
              onSwitchProvider={(providerId) => onSwitchProvider(providerId, index)}
              bgImage={bgImage}
              bgColor={bgColor}
            />
          ))
          }
        </div>
      </ScrollToProvidertom>
      <PremiumFeatureModal open={premiumModalOpen} setOpen={setPremiumModalOpen} />
    </div>
  </>
  )
}

const TwoProviderChatPanel = () => {
  const multiPanelProviderIds = useAtomValue(twoPanelProvidersAtom)
  let chatlist: ReturnType<typeof useChat>[] = []
  for (let i = 0; i < getPanelsCount(2); i++) {
    chatlist.push(useChat(multiPanelProviderIds[i], PANELNAMES[i]))
  }
  const chats = useMemo(() => chatlist, chatlist);
  return <GeneralChatPanel rows={1} cols={2} chats={chats} providersAtom={twoPanelProvidersAtom} />
}

const ThreeProviderChatPanel = () => {
  const multiPanelProviderIds = useAtomValue(threePanelProvidersAtom)
  let chatlist: ReturnType<typeof useChat>[] = []
  for (let i = 0; i < getPanelsCount(3); i++) {
    chatlist.push(useChat(multiPanelProviderIds[i], PANELNAMES[i]))
  }
  const chats = useMemo(() => chatlist, chatlist);
  return <GeneralChatPanel rows={1} cols={3} chats={chats} providersAtom={threePanelProvidersAtom} />
}

const FourProviderChatPanel = () => {
  const multiPanelProviderIds = useAtomValue(fourPanelProvidersAtom)
  console.log("Will create 4 useChat")
  let chatlist: ReturnType<typeof useChat>[] = []
  for (let i = 0; i < getPanelsCount(2); i++) {
    chatlist.push(useChat(multiPanelProviderIds[i], PANELNAMES[i]))
  }
  const chats = useMemo(() => chatlist, chatlist);
  return <GeneralChatPanel rows={2} cols={2} chats={chats} providersAtom={fourPanelProvidersAtom} />
}

const SixProviderChatPanel = () => {
  const multiPanelProviderIds = useAtomValue(sixPanelProvidersAtom)
  let chatlist: ReturnType<typeof useChat>[] = []
  for (let i = 0; i < getPanelsCount(3); i++) {
    chatlist.push(useChat(multiPanelProviderIds[i], PANELNAMES[i]))
  }
  const chats = useMemo(() => chatlist, chatlist);
  return <GeneralChatPanel rows={2} cols={3} chats={chats} providersAtom={sixPanelProvidersAtom} />
}

const NineProviderChatPanel = () => {
  const multiPanelProviderIds = useAtomValue(ninePanelProvidersAtom)
  let chatlist: ReturnType<typeof useChat>[] = []
  for (let i = 0; i < getPanelsCount(3); i++) {
    chatlist.push(useChat(multiPanelProviderIds[i], PANELNAMES[i]))
  }
  const chats = useMemo(() => chatlist, chatlist);
  return <GeneralChatPanel rows={3} cols={3} chats={chats} providersAtom={ninePanelProvidersAtom} />
}

const MultiProviderChatPanel: FC = () => {
  const layout = useAtomValue(layoutglobalAtom)
  if (layout === 9) {
    return <NineProviderChatPanel />
  }
  if (layout === 6) {
    return <SixProviderChatPanel />
  }
  if (layout === 4) {
    return <FourProviderChatPanel />
  }
  if (layout === 3) {
    return <ThreeProviderChatPanel />
  }
  return <TwoProviderChatPanel />
}

const MultiProviderChatPanelPage: FC = () => {
  const layoutglobal = useAtomValue(layoutglobalAtom)
  return (
    <Suspense>
      <MultiProviderChatPanel />
    </Suspense>
  )
}

export default MultiProviderChatPanelPage

