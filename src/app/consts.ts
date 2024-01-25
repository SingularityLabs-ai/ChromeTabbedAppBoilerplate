import provider1Logo from '~/assets/provider1-logo.png'
import { ProviderId } from './providers'
import i18n from './i18n'

export const CHATBOTS: Record<ProviderId, { name: string; avatar: any }> = {
  provider1: {
    name: 'Provider1',
    avatar: provider1Logo,
  },
}


import { getBrowser } from '~app/utils/navigator'
const browser = getBrowser()
export const MYAWESOMEAPP_EXTENSION_STORE = (browser === 'Edge') ? "https://microsoftedge.microsoft.com/addons/" : "https://chrome.google.com/webstore/detail/";
export const MYAWESOMEAPP_GITHUB = "https://github.com/SingularityLabs-ai";
export const ALL_IN_ONE_PAGE_ID = "all";
export const DISCORD_HOME = "https://discord.gg/jc4xtF58Ve"
export const DEFAULT_NUMBER_OF_PANELS = 4
export let COMMON_ERROR_MESSAGE = (WEBSITE: string) => { return "Also make sure that you are logged in this provider's website by visiting it's website " + WEBSITE + " and checking if you are able to access it from there. If it works fine via web access but not via MyAwesomeApp then you may create an issue at " + MYAWESOMEAPP_GITHUB + "/issues";}
