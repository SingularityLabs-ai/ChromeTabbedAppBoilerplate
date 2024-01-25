import { Outlet } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { followArcThemeAtom, themeColorAtom } from '~app/state'
import Sidebar from './Sidebar'
import { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react'

function Layout() {
  const themeColor = useAtomValue(themeColorAtom)
  const followArcTheme = useAtomValue(followArcThemeAtom)
  const [count, setCount] = useState(0);
  const onLayoutChangeInMain = useCallback(
    (v: number) => {
      setCount(v)
    },
    [],
  )
  return (
    <main
      className="h-screen grid grid-cols-[auto_1fr]"
      style={{ backgroundColor: followArcTheme ? 'var(--arc-palette-foregroundPrimary)' : themeColor }}
    >
      <Sidebar onLayoutChangeInMain={onLayoutChangeInMain}/>
      <div className="px-[15px] py-3 h-full overflow-hidden">
        <Outlet />
      </div>
    </main>
  )
}

export default Layout
