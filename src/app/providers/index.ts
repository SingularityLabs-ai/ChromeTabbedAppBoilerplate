import { Provider1 } from './provider1'

export type ProviderId =
  | 'provider1'

export function createProviderInstance(ProviderId: ProviderId) {
  switch (ProviderId) {
    case 'provider1':
      return new Provider1()
  }
}

export type ProviderInstance = ReturnType<typeof createProviderInstance>
