import 'normalize.css'
import './common/common.scss'
import createHeader from './blocks/header/header.js'
import createLogo from './blocks/logo/logo.js'
import createMenu from './blocks/menu/menu.js'
import createMain from './blocks/main/main.js'
import createContainer from './blocks/container/container.js'
import createLoginForm from './blocks/login-form/login-form.js'
import createBurgerButton from './blocks/button/--burger/button--burger.js'

const body = document.body
const header = createHeader()
const headerContainer = createContainer()
const logo = createLogo()
const burger = createBurgerButton()
const menu = createMenu(['Банкоматы', 'Счета', 'Валюта', 'Выйти'])
const main = createMain()
const mainContainer = createContainer()
const loginForm = createLoginForm()

headerContainer.append(logo, burger, menu)
header.append(headerContainer)

mainContainer.append(loginForm)
main.append(mainContainer)

body.append(header, main)

main.style.minHeight = `calc(100vh - ${header.offsetHeight}px)`

burger.addEventListener('click', () => {
  menu.classList.toggle('menu--visible')
})
