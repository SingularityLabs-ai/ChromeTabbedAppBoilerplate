import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react'
import cx from 'classnames'
import { FC, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState, ButtonHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import Tooltip from './Tooltip'
import { BeatLoader } from 'react-spinners'

interface Props {
  icon: string
  className: string
  tooltipText: string
  color?: 'primary' | 'flat'
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClick?: () => void
  isLoading?: boolean
  size?: 'small' | 'normal'
}

const IconButton: FC<Props> = (props) => {
  const { t } = useTranslation()
  if (props.type)
    return (
      <button
      type={props.type}
        className={cx(
          'p-[6px] rounded-[18px] w-fit cursor-pointer hover:opacity-80 bg-secondary bg-opacity-20',
          props.className,
        )}
        onClick={props.onClick}
      >{props.isLoading ? (
          <BeatLoader size={props.size === 'normal' ? 10 : 5} color={props.color === 'primary' ? 'white' : '#303030'} />
        ) : (
        <Tooltip content={t(props.tooltipText)}>
          <img src={props.icon} className="w-10 h-10"/>
        </Tooltip>
        )}
      </button>
    )
  else
    return (
      <div
        className={cx(
          'p-[6px] rounded-[18px] w-fit cursor-pointer hover:opacity-80 bg-secondary bg-opacity-20',
          props.className,
        )}
        onClick={props.onClick}
      >{props.isLoading ? (
          <BeatLoader size={props.size === 'normal' ? 10 : 5} color={props.color === 'primary' ? 'white' : '#303030'} />
        ) : (
        <Tooltip content={t(props.tooltipText)}>
          <img src={props.icon} className="w-10 h-10"/>
        </Tooltip>
        )}
      </div>
    )
}
export default memo(IconButton)