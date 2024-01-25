import useSWR from 'swr/immutable'
import { ProviderId } from '~app/providers'
import { CHATBOTS } from '~app/consts'
import { getUserConfig } from '~services/user-config'

export function useEnabledProviders() {
  const query = useSWR('enabled-providers', async () => {
    const { enabledProviders } = await getUserConfig()
    return Object.keys(CHATBOTS)
      .filter((providerId) => enabledProviders.includes(providerId as ProviderId))
      .map((providerId) => {
        const bid = providerId as ProviderId
        return { providerId: bid, provider: CHATBOTS[bid] }
      })
  })
  return query.data || []
}
