import './app.css'
import { worker } from './mocks/browser'

if (process.env.NODE_ENV === 'development') {
  worker.start()
}

import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
