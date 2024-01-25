import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import { useAtom } from 'jotai'
import { useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { FC, Suspense, useCallback, useEffect, useMemo } from 'react'
import { useState } from 'react'
import { ThemeMode, getUserThemeMode } from '~services/theme'
import { useTranslation } from 'react-i18next'
import allInOneIcon from '~/assets/all.svg'
import menuIcon from '~/assets/icons/menu-white-thin.svg'//TODO:using white all the time for now
import menuWhiteIcon from '~/assets/icons/menu-white-thin.svg'
import collapseIcon from '~/assets/icons/collapse.svg'
import feedbackIcon from '~/assets/icons/feedback.svg'
import githubIcon from '~/assets/icons/home-solid-white.svg'
import discordIcon from '~/assets/icons/discord.svg'
import settingIcon from '~/assets/icons/setting.svg'
import themeIcon from '~/assets/icons/theme.svg'
import logo from '~/assets/logo.png'
import minimalLogo from '~/assets/minimal-logo.svg'
import { useEnabledProviders } from '~app/hooks/use-enabled-providers'
import { sidebarCollapsedAtom, layoutglobalAtom } from '~app/state'
import CommandBar from '../CommandBar'
import GuideModal from '../GuideModal'
import ThemeSettingModal from '../ThemeSettingModal'
import Tooltip from '../Tooltip'
import NavLink from './NavLink'
import PremiumEntry from './PremiumEntry'
import { getBrowser, getOS } from '~app/utils/navigator'
import { DISCORD_HOME, MYAWESOMEAPP_GITHUB, DEFAULT_NUMBER_OF_PANELS } from '~app/consts'
import { ProviderId } from '../../providers'
import LayoutSwitch from '~app/components/Chat/LayoutSwitch'
import { useChat } from '~app/hooks/use-chat'
import SingularityLabsSocial from "./SingularityLabsSocial"
import { MdMenu } from "react-icons/md";

function IconButton(props: { icon: string; onClick?: () => void }) {
  return (
    <div
      className="p-[6px] rounded-[10px] w-fit cursor-pointer hover:opacity-80 bg-secondary bg-opacity-20 hover:bg-opacity-80"
      onClick={props.onClick}
    >
      <img src={props.icon} className="w-6 h-6" />
    </div>
  )
}

function Sidebar(props:any) {
  const { t } = useTranslation()
  const [themeMode, setThemeMode] = useState(getUserThemeMode())
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom)
  const [themeSettingModalOpen, setThemeSettingModalOpen] = useState(false)
  const enabledProviders = useEnabledProviders()
  const MYAWESOMEAPP_GITHUB_ISSUES = MYAWESOMEAPP_GITHUB + '/issues'
  const MYAWESOMEAPP_GITHUB_README = MYAWESOMEAPP_GITHUB + '#readme'
  const setLayoutglobal = useSetAtom(layoutglobalAtom)
  const layoutglobal = useAtomValue(layoutglobalAtom)
  console.log("Sidebar:layoutglobal", layoutglobal)
  const onLayoutChange = useCallback(
    (v: number) => {
      setLayoutglobal(v)
      props.onLayoutChangeInMain(v)
      document.documentElement.style.setProperty('--sidebarwidth', collapsed ? '74px' : '230px');
    },
    [],
  )
  const onMenuClick = () => {
    let sideEle = document.querySelector("aside");
    console.log("sideEle", sideEle)
    if (sideEle){
      sideEle.style.width = (collapsed?"230px":"74px");
    }
    if (!collapsed) {
      if (sideEle) {
        sideEle.style.paddingLeft = "1rem";
        sideEle.style.paddingRight = "1rem";
      }
      document.documentElement.style.setProperty('--sidebarwidth', '74px');
    } else {
      document.documentElement.style.setProperty('--sidebarwidth', '230px');
    }
    setCollapsed((c) => !c);
  }
      // <div className={cx('flex flex-col gap-x-3 gap-y-1 mt-3 overflow-y-auto', getOS() != 'Windows' ? 'scrollbar-none' : '')}>
      //   {enabledProviders.map(({ providerId, provider }) => (
      //     <NavLink
      //       key={providerId}
      //       to="/chat/$providerId"
      //       params={{ providerId }}
      //       text={provider.name}
      //       icon={provider.avatar}
      //       iconOnly={collapsed}
      //     />
      //   ))}
      // </div>

  return (
    <aside
      className={cx(
        'flex flex-col bg-primary-background bg-opacity-40 overflow-hidden transition-width duration-700 ease-in-out',
        collapsed ? 'items-center px-[15px]' : 'w-[230px] px-4',
      )}
    >
      {!!collapsed && (<IconButton icon={themeMode==ThemeMode.Dark?menuWhiteIcon:menuIcon} onClick={onMenuClick} />)}
      {!collapsed && (<div className="flex flex-row justify-evenly"> <SingularityLabsSocial themeMode={themeMode} /> <IconButton icon={themeMode==ThemeMode.Dark?menuWhiteIcon:menuIcon} onClick={onMenuClick} /> </div>)}
      <Link to="/" preload="intent">
        <LayoutSwitch layout={layoutglobal} onChange={onLayoutChange} collapsed={collapsed}/>
      </Link>
      <div className="mt-auto pt-2">
        {!collapsed && <hr className="border-[#ffffff4d]" />}
        <div className={cx('flex mt-5 gap-[10px] mb-4', collapsed ? 'flex-col' : 'flex-row ')}>
          <Tooltip content={t('GitHub')}>
            <a href={MYAWESOMEAPP_GITHUB_README} target="_blank" rel="noreferrer">
              <IconButton icon={githubIcon} />
            </a>
          </Tooltip>
          <Tooltip content={t('Feedback')}>
            <a href={MYAWESOMEAPP_GITHUB_ISSUES} target='_blank' rel="noreferrer">
              <IconButton icon={feedbackIcon} />
            </a>
          </Tooltip>
          <Tooltip content={t('Theme')}>
            <a onClick={() => setThemeSettingModalOpen(true)}>
              <IconButton icon={themeIcon} />
            </a>
          </Tooltip>
          <Tooltip content={t('Settings')}>
            <Link to="/setting">
              <IconButton icon={settingIcon} />
            </Link>
          </Tooltip>
        </div>
      </div>
      <CommandBar />
      <GuideModal />
      {themeSettingModalOpen && <ThemeSettingModal open={true} onClose={() => setThemeSettingModalOpen(false)} />}
    </aside>
  )
}

export default Sidebar

// <div className="my-1"><NavLink to="/" text={'In One'} icon={allInOneIcon} iconOnly={collapsed} textClass="text-lg font-bold" linkGapClass="gap-2"/></div>
          // {!collapsed && (
          //   <Tooltip content={t('Discord')}>
          //     <a href={DISCORD_HOME} target="_blank" rel="noreferrer">
          //       <IconButton icon={discordIcon} />
          //     </a>
          //   </Tooltip>
          // )}


      // <img
      //   src={collapseIcon}
      //   className={cx('w-6 h-6 cursor-pointer my-1', collapsed ? 'rotate-180' : 'self-end')}
      //   onClick={() => {
      //       let sideEle = document.querySelector("aside");
      //       if (sideEle)
      //         sideEle.style.width = (collapsed?"230px":"74px");
      //       if (!collapsed) {
      //         if (sideEle) {
      //           sideEle.style.paddingLeft = "1rem";
      //           sideEle.style.paddingRight = "1rem";
      //         }
      //       }
      //       setCollapsed((c) => !c);
      //     }
      //   }
      // />

