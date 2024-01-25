import Browser from 'webextension-polyfill'
import { ALL_IN_ONE_PAGE_ID } from '~app/consts'
import { getUserConfig } from '~services/user-config'

const MYAWESOMEAPP_UNINSTALL_TYPEFORM_URL = "https://survey.typeform.com/to/someid"
const MYAWESOMEAPP_UNINSTALL_TALLY_URL = "https://tally.so/r/againsomeid"

async function openAppPage() {
  try {
    const tabs = await Browser.tabs.query({})
    const url = Browser.runtime.getURL('app.html')
    const tab = tabs.find((tab) => tab.url?.startsWith(url))
    if (tab) {
      await Browser.tabs.update(tab.id, { active: true })
      return
    }
    const { startupPage } = await getUserConfig()
    const hash = startupPage === ALL_IN_ONE_PAGE_ID ? '' : `#/chat/${startupPage}`
    console.log("openAppPage hash:", hash)
    await Browser.tabs.create({ url: `app.html${hash}` })
  } catch(err) {
    console.log("openAppPage Error", err)
  }
}

Browser.action.onClicked.addListener(() => {
  openAppPage()
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    openAppPage()
  }
})

Browser.commands.onCommand.addListener(async (command) => {
  console.debug(`Command: ${command}`)
  if (command === 'open-app') {
    openAppPage()
  }
})

function getUninstallURL(): any {
  const arr = Array(99).fill(MYAWESOMEAPP_UNINSTALL_TALLY_URL)
  arr.push(MYAWESOMEAPP_UNINSTALL_TYPEFORM_URL)
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

Browser.runtime.setUninstallURL(getUninstallURL())
