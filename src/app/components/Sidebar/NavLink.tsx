import { Link, LinkPropsOptions } from '@tanstack/react-router'
import cx from 'classnames'

function NavLink(props: LinkPropsOptions & { text: string; icon: any; iconOnly?: boolean; textClass?: string; linkGapClass?: string }) {
  const { text, icon, iconOnly, textClass, linkGapClass, ...linkProps } = props
  return (
    <Link
      className={cx(
        'rounded-[10px] w-full h-[45px] pl-3 flex flex-row items-center shrink-0',
        linkGapClass ? linkGapClass : 'gap-3',
        iconOnly && 'justify-center',
      )}
      activeOptions={{ exact: true }}
      activeProps={{ className: 'bg-white text-primary-text dark:bg-primary-blue' }}
      inactiveProps={{
        className: 'bg-secondary bg-opacity-20 text-primary-text opacity-80 hover:opacity-100 hover:bg-opacity-80',
      }}
      title={text}
      {...linkProps}
    >
      <img src={icon} className="w-5 h-5" />
      {<span className={textClass ? textClass : "font-medium text-sm"}>{iconOnly ? '' : text}</span>}
    </Link>
  )
}

export default NavLink
