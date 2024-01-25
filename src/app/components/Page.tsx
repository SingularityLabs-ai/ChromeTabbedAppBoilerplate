import { useNavigate } from '@tanstack/react-router'
import { FC, PropsWithChildren, useMemo, useCallback } from 'react'
import cx from 'classnames'
import closeIcon from '~/assets/icons/close_nobg.svg'

const PagePanel: FC<PropsWithChildren<{ title: string }>> = (props) => {
  const isSettings = useMemo(() => location.href.includes('setting'), [])
  const navigate = useNavigate()
  const closePage = useCallback(
    () => {
      navigate({ to: '/' })
    },
    [navigate],
  )
  return (
    <div className="flex flex-col overflow-hidden bg-primary-background dark:text-primary-text rounded-[20px] h-full">
      <div className="text-center border-b border-solid border-primary-border flex flex-col justify-center mx-10 py-3">
        <span className="font-semibold text-lg">
          {props.title}
          <a onClick={closePage} className={cx('bg-white rounded-md p-2 inline-flex float-right text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500', isSettings ? '' : 'invisible')}>
            <img src={closeIcon}/>
          </a>
        </span>
      </div>
      <div className="px-10 h-full overflow-auto">{props.children}</div>
    </div>
  )
}

export default PagePanel
