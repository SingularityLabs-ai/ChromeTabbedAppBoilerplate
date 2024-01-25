import { atomWithImmer } from 'jotai-immer'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai/utils'
import { createProviderInstance, ProviderId } from '~app/providers'
import { getDefaultThemeColor } from '~app/utils/color-scheme'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'
import { DEFAULT_NUMBER_OF_PANELS } from '~app/consts'

type Param = { providerId: ProviderId; targetLang?: string};//, page: string }

export const chatFamily = atomFamily(
  (param: Param) => {
    return atomWithImmer({
      providerId: param.providerId,
      targetLang: param.targetLang,
      provider: createProviderInstance(param.providerId),
      messages: [] as ChatMessageModel[],
      generatingMessageId: '',
      abortController: undefined as AbortController | undefined,
      conversationId: uuid(),
    })
  },
  (a, b) => a.providerId === b.providerId && a.targetLang === b.targetLang,
)

export const multiPanelProvidersAtom = atomWithStorage<ProviderId[]>('multiPanelProviders', ['provider1', 'provider1', 'provider1', 'provider1'])
export const licenseKeyAtom = atomWithStorage('licenseKey', '')
export const sidebarCollapsedAtom = atomWithStorage('sidebarCollapsed', false)
export const themeColorAtom = atomWithStorage('themeColor', getDefaultThemeColor())
export const zoomconvboxAtom = atomWithStorage('zoomconvbox', false)
export const followArcThemeAtom = atomWithStorage('followArcTheme', false)
export const sidePanelProviderAtom = atomWithStorage<ProviderId>('sidePanelProvider', 'provider1')
export const layoutglobalAtom = atomWithStorage<number>('layoutglobal', DEFAULT_NUMBER_OF_PANELS, undefined, { unstable_getOnInit: true })
