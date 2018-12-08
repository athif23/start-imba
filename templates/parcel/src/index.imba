# Don't delete this or Ignore this line!
# This line is for parcel so it will always empty the html first before append changes.
# This is an issue for parcel and imba only.
if module:hot
    module:hot.dispose do
        document:body:innerHTML = ''

# Import your component here
import App from './components/App'

# All style is here
# Remember to always import all your new .scss file inside index.scss
require './styles/index.scss'

Imba.mount <App>