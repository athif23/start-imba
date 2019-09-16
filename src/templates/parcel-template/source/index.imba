import { App } from './components/main/app'

Imba.mount <App>

# ------------ WARNING: DO NOT TOUCH OR CHANGE!
module:hot.dispose do
	document:body:innerHTML = ''
# ------------ NEEDED FOR PARCEL!