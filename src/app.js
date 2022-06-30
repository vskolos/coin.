import 'normalize.css'
import './common/common.scss'
import createHeader from './blocks/header/header.js'
import createLogo from './blocks/logo/logo.js'
import createMain from './blocks/main/main.js'
import createContainer from './blocks/container/container.js'
import createLoginForm from './blocks/login-form/login-form.js'

const body = document.body
const header = createHeader()
const headerContainer = createContainer()
const logo = createLogo()
const main = createMain()
const mainContainer = createContainer()
const loginForm = createLoginForm()

headerContainer.append(logo)
header.append(headerContainer)

mainContainer.append(loginForm)
main.append(mainContainer)

body.append(header, main)
