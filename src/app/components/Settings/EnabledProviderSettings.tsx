import { FC, useCallback } from 'react'
import { ProviderId } from '~app/providers'
import { CHATBOTS } from '~app/consts'
import { UserConfig } from '~services/user-config'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const EnabledProviderSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const updateStatus = useCallback(
    (providerId: ProviderId, enabled: boolean) => {
      const providers = new Set(userConfig.enabledProviders)
      if (enabled) {
        providers.add(providerId)
      } else {
        if (providers.size === 1) {
          alert('At least one provider should be enabled')
          return
        } else {
          providers.delete(providerId)
        }
      }
      updateConfigValue({ enabledProviders: Array.from(providers) })
    },
    [updateConfigValue, userConfig.enabledProviders],
  )

  return (
    <div className="flex flex-row gap-3 flex-wrap max-w-[700px]">
      {Object.entries(CHATBOTS).map(([providerId, provider]) => {
        const enabled = userConfig.enabledProviders.includes(providerId as ProviderId)
        return (
          <div className="flex flex-row gap-[6px]" key={providerId}>
            <input
              type="checkbox"
              id={`provider-checkbox-${providerId}`}
              checked={enabled}
              onChange={(e) => updateStatus(providerId as ProviderId, e.target.checked)}
            />
            <label htmlFor={`provider-checkbox-${providerId}`} className="font-medium text-sm">
              {provider.name}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default EnabledProviderSettings
