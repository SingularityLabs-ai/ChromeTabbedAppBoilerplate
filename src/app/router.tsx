import { createHashHistory, ReactRouter, RootRoute, Route, useParams } from '@tanstack/react-router'
import { ProviderId } from './providers'
import Layout from './components/Layout'
import MultiProviderChatPanel from './pages/MultiProviderChatPanel'
import SettingPage from './pages/SettingPage'
import SingleProviderChatPanel from './pages/SingleProviderChatPanel'
import PremiumPage from './pages/PremiumPage'

const rootRoute = new RootRoute()

const layoutRoute = new Route({
  getParentRoute: () => rootRoute,
  component: Layout,
  id: 'layout',
})

const indexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: MultiProviderChatPanel,
})

// function ChatRoute() {
//   const { providerId } = useParams({ from: chatRoute.id })
//   return <SingleProviderChatPanel providerId={providerId as ProviderId} />
// }

// const chatRoute = new Route({
//   getParentRoute: () => layoutRoute,
//   path: 'chat/$providerId',
//   component: ChatRoute,
// })

const settingRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'setting',
  component: SettingPage,
})

const premiumRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'premium',
  component: PremiumPage,
})

const routeTree = rootRoute.addChildren([layoutRoute.addChildren([indexRoute, /*chatRoute,*/ settingRoute, premiumRoute])])

const hashHistory = createHashHistory()
const router = new ReactRouter({ routeTree, history: hashHistory })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router }
