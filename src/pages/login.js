// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createLoginForm from '../blocks/login-form/login-form'

// CSS
import 'normalize.css'
import '../common/common.scss'

export default function renderLoginPage() {
  const body = document.body
  const header = createHeader()
  const main = createMain()
  const mainContainer = createContainer()
  const loginForm = createLoginForm()

  mainContainer.append(loginForm)
  main.append(mainContainer)

  body.innerHTML = ''
  body.append(header, main)

  main.style.minHeight = `calc(100vh - ${header.offsetHeight}px)`
}
