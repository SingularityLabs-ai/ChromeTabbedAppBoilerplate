import cx from 'classnames'
import { FC } from 'react'
import layoutNineIcon from '~assets/icons/layout-nine.svg'
import layoutSixIcon from '~assets/icons/layout-six.svg'
import layoutFourIcon from '~assets/icons/layout-four.svg'
import layoutThreeIcon from '~assets/icons/layout-three.svg'
import layoutTwoIcon from '~assets/icons/layout-two.svg'

const Item: FC<{ icon: string; active: boolean; onClick: () => void }> = (props) => {
  return (
    <a className={cx(!!props.active && 'bg-[#00000014] dark:bg-[#ffffff26] rounded-[6px]', !props.active && 'hover:rounded-[6px] hover:brightness-50')} onClick={props.onClick}>
      <img src={props.icon} className="w-8 h-8 cursor-pointer" />
    </a>
  )
}

interface Props {
  collapsed:boolean
  layout: number
  onChange: (layout: number) => void
}

const isMultiChatPage = (link: string) => {
  return (link.split("/").length == 5 && link.split("/")[3].includes('app.html'));
}

const LayoutSwitch: FC<Props> = (props) => {
  console.log("LayoutSwitch:href=", location.href)
  const isMultiChat = isMultiChatPage(location.href)
  return (
    <div className={cx("flex", props.collapsed ? "flex-col px-1 py-1 rounded-[6px]" : "flex-row px-4 py-2 rounded-[10px]", "items-center gap-2", isMultiChat ? "bg-primary-background" :  "bg-secondary")}>
      <Item icon={layoutTwoIcon} active={isMultiChat && (props.layout === 2)} onClick={() => props.onChange(2)} />
      <Item icon={layoutThreeIcon} active={isMultiChat && (props.layout === 3)} onClick={() => props.onChange(3)} />
      <Item icon={layoutFourIcon} active={isMultiChat && (props.layout === 4)} onClick={() => props.onChange(4)} />
      <Item icon={layoutSixIcon} active={isMultiChat && (props.layout === 6)} onClick={() => props.onChange(6)} />
      <Item icon={layoutNineIcon} active={isMultiChat && (props.layout === 9)} onClick={() => props.onChange(9)} />
    </div>
  )
}

export default LayoutSwitch
