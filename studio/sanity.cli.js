import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xz8a6oqx',
    dataset: 'production'
  },
  deployment: {
    appId: 'ct0oss6n6zoh00r05mkhp3qu',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
