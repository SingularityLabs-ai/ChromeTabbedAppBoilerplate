import { memo, useState } from 'react'
import cx from 'classnames'
import { ThemeMode, getUserThemeMode } from '~services/theme'

import discordIcon from '~/assets/icons/discord-white-thin.svg'//TODO:using white all the time for now
import discordWhiteIcon from '~/assets/icons/discord-white-thin.svg'
export const DISCORD_HOME = 'https://discord.gg/jc4xtF58Ve'

import githubIcon from '~/assets/icons/github-white-thin.svg'//TODO:using white all the time for now
import githubWhiteIcon from '~/assets/icons/github-white-thin.svg'
export const GITHUB_HOME = 'https://github.com/SingularityLabs-ai'

import twitterIcon from '~/assets/icons/twitter-white-thin.svg'//TODO:using white all the time for now
import twitterWhiteIcon from '~/assets/icons/twitter-white-thin.svg'
export const TWITTER_HOME = 'https://twitter.com/labssingularity'

import linkedinIcon from '~/assets/icons/linkedin-white-thin.svg'//TODO:using white all the time for now
import linkedinWhiteIcon from '~/assets/icons/linkedin-white-thin.svg'
export const LINKEDIN_HOME = 'https://www.linkedin.com/company/singularity-labs-ai'

function IconButton(props: { icon: string; onClick?: () => void }) {
  return (
    <div
      className="p-[2px] rounded-[8px] w-fit cursor-pointer hover:opacity-80 bg-secondary bg-opacity-20 hover:bg-opacity-80"
      onClick={props.onClick}
    >
      <img src={props.icon} className="w-4 h-4" />
    </div>
  )
}

interface Props {
  themeMode?: ThemeMode
}

function SingularityLabsSocial(props:Props) {
  // const themeMode = props.themeMode
  const [themeMode, setThemeMode] = useState(props.themeMode?props.themeMode:getUserThemeMode())
  // console.log()

  return (
    <div className={cx("gpt-feedback flex flex-row px-4 py-2 rounded-[10px] items-center gap-2 justify-evenly", 'animbox_' + Math.round(Math.random() * 10))}>
      <span>
        <a href={DISCORD_HOME} target="_blank" rel="noreferrer">
          <IconButton icon={themeMode==ThemeMode.Dark?discordWhiteIcon:discordIcon} />
        </a>
      </span>
      <span>
        <a href={GITHUB_HOME} target="_blank" rel="noreferrer">
          <IconButton icon={themeMode==ThemeMode.Dark?githubWhiteIcon:githubIcon} />
        </a>
      </span>
      <span>
        <a href={TWITTER_HOME} target="_blank" rel="noreferrer">
          <IconButton icon={themeMode==ThemeMode.Dark?twitterWhiteIcon:twitterIcon} />
        </a>
      </span>
      <span>
        <a href={LINKEDIN_HOME} target="_blank" rel="noreferrer">
          <IconButton icon={themeMode==ThemeMode.Dark?linkedinWhiteIcon:linkedinIcon} />
        </a>
      </span>
    </div>
  )
}

export default memo(SingularityLabsSocial)
