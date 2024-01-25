import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { BiExport, BiImport } from 'react-icons/bi'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import RadioGroup from '~app/components/RadioGroup'
import Select from '~app/components/Select'
import EnabledProviderSettings from '~app/components/Settings/EnabledProviderSettings'
import KDB from '~app/components/Settings/KDB'
import { ALL_IN_ONE_PAGE_ID, CHATBOTS } from '~app/consts'
import { usePremium } from '~app/hooks/use-premium'
import { exportData, importData } from '~app/utils/export'
import {
  UserConfig,
  getUserConfig,
  updateUserConfig,
} from '~services/user-config'
import { getVersion } from '~utils'
import PagePanel from '../components/Page'

function SettingPage() {
  const { t } = useTranslation()
  const [shortcuts, setShortcuts] = useState<string[]>([])
  const [userConfig, setUserConfig] = useState<UserConfig | undefined>(undefined)
  const [dirty, setDirty] = useState(false)
  const premiumState = usePremium()

  useEffect(() => {
    Browser.commands.getAll().then((commands) => {
      for (const c of commands) {
        if (c.name === 'open-app' && c.shortcut) {
          console.log(c.shortcut)
          setShortcuts(c.shortcut ? [c.shortcut] : [])
        }
      }
    })
    getUserConfig().then((config) => setUserConfig(config))
  }, [])

  const openShortcutPage = useCallback(() => {
    Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }, [])

  const updateConfigValue = useCallback(
    (update: Partial<UserConfig>) => {
      setUserConfig({ ...userConfig!, ...update })
      setDirty(true)
    },
    [userConfig],
  )

  const save = useCallback(async () => {
    toast.success('Saved')
    setTimeout(() => location.reload(), 500)
  }, [userConfig])

  if (!userConfig) {
    return null
  }

  return (
    <PagePanel title={`${t('Settings')} (v${getVersion()})`}>
      <div className="flex flex-col gap-5 mt-3">
        <div>
          <p className="font-bold mb-1 text-lg">{t('Export/Import All Data')}</p>
          <p className="mb-3 opacity-80">{t('Data includes all your settings, chat histories, and local prompts')}</p>
          <div className="flex flex-row gap-3">
            <Button size="small" text={t('Export')} icon={<BiExport />} onClick={exportData} />
            <Button size="small" text={t('Import')} icon={<BiImport />} onClick={importData} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">{t('Shortcut to open this app')}</p>
          <div className="flex flex-row gap-2 items-center">
            {shortcuts.length > 0 && (
              <div className="flex flex-row gap-1">
                {shortcuts.map((s) => (
                  <KDB key={s} text={s} />
                ))}
              </div>
            )}
            <Button text={t('Change shortcut')} size="small" onClick={openShortcutPage} />
          </div>
        </div>
{/*
        <div>
          <p className="font-bold mb-2 text-lg">{t('Startup page')}</p>
          <div className="w-[200px]">
            <Select
              options={[
                { name: 'All-In-One', value: ALL_IN_ONE_PAGE_ID },
                ...Object.entries(CHATBOTS).map(([providerId, provider]) => ({ name: provider.name, value: providerId })),
              ]}
              value={userConfig.startupPage}
              onChange={(v) => updateConfigValue({ startupPage: v })}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">{t('Chatproviders')}</p>
          <EnabledProviderSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
        </div>
*/}
      </div>
      <Button color={dirty ? 'primary' : 'flat'} text={t('Save')} className="w-fit my-8" onClick={save} />
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default SettingPage
