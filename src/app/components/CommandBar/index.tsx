import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { ProviderId } from '~app/providers'
import { CHATBOTS } from '~app/consts'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './Command'
import { Columns } from 'lucide-react'
import allInOneIcon from '~/assets/all-in-one.svg'

function CommandBar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const onSelectProvider = useCallback(
    (v?: string) => {
      if (v) {
        const providerId = v as ProviderId
        // navigate({ to: '/chat/$providerId', params: { providerId } })
      } else {
        navigate({ to: '/' })
      }
      setOpen(false)
    },
    [navigate],
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem onSelect={() => onSelectProvider()}>
            <img src={allInOneIcon} className="w-5 h-5 mr-2" />
            <span>All-In-One</span>
          </CommandItem>
          {/*{Object.keys(CHATBOTS).map((key) => {
            const providerId = key as ProviderId
            const provider = CHATBOTS[providerId]
            return (
              <CommandItem key={providerId} onSelect={onSelectProvider} value={providerId}>
                <img src={provider.avatar} className="w-5 h-5 mr-2" />
                <span>{provider.name}</span>
              </CommandItem>
            )
          })}*/}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default CommandBar
