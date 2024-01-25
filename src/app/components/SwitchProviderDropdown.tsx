import { Menu, Transition } from '@headlessui/react'
import { FC, Fragment, useCallback } from 'react'
import dropdownIcon from '~/assets/icons/dropdown.svg'
import { ProviderId } from '~app/providers'
import { useEnabledProviders } from '~app/hooks/use-enabled-providers'

interface Props {
  selectedProviderId: ProviderId
  onChange: (providerId: ProviderId) => void
}

const SwitchProviderDropdown: FC<Props> = (props) => {
  const enabledProviders = useEnabledProviders()

  const onSelect = useCallback(
    (providerId: ProviderId) => {
      props.onChange(providerId)
    },
    [props],
  )

  return (
    <Menu as="div" className="relative inline-block text-left h-5">
      <Menu.Button>
        <img src={dropdownIcon} className="w-5 h-5" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 rounded-md bg-secondary shadow-lg focus:outline-none">
          {enabledProviders.map(({ providerId, provider}) => {
            if (providerId === props.selectedProviderId) {
              return null
            }
            return (
              <Menu.Item key={providerId}>
                <div
                  className="px-4 py-2 ui-active:bg-primary-blue ui-active:text-white ui-not-active:text-secondary-text cursor-pointer flex flex-row items-center gap-3 pr-8"
                  onClick={() => onSelect(providerId)}
                >
                  <div className="w-4 h-4">
                    <img src={provider.avatar} className="w-4 h-4" />
                  </div>
                  <p className="text-sm whitespace-nowrap">{provider.name}</p>
                </div>
              </Menu.Item>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default SwitchProviderDropdown
