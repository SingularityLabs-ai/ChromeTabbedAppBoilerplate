import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { ProviderId } from '~app/providers'
import { ALL_IN_ONE_PAGE_ID, CHATBOTS } from '~app/consts'

const userConfigWithDefaultValue = {
  isPinnedTabs: false,
  startupPage: ALL_IN_ONE_PAGE_ID,
  enabledProviders: Object.keys(CHATBOTS) as ProviderId[],
}

export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.sync.get(Object.keys(userConfigWithDefaultValue))
  return defaults(result, userConfigWithDefaultValue)
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
  console.debug('update configs', updates)
  await Browser.storage.sync.set(updates)
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) {
      await Browser.storage.sync.remove(key)
    }
  }
}
