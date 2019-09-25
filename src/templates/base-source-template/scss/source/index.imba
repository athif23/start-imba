import { App } from './components/app'
import { Stores } from './controllers/store'

const state = Stores.new()

Imba.mount <App[state]>