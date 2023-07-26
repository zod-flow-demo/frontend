import './app.css'
import { worker } from './mocks/browser'

if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: ({ url }, print) => {
      if (url.pathname.startsWith('/api')) {
        print.warning()
      }
    },
  })
}

import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
