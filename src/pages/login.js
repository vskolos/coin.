// CSS
import 'normalize.css'
import '../common/common.scss'

// Blocks
import createHeader from '../blocks/header/header'
import createLogo from '../blocks/logo/logo'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createLoginForm from '../blocks/login-form/login-form'

// API
import login from '../api/login'

// Utilities
import reload from '../utilities/reload'

export default function renderLoginPage() {
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

  body.innerHTML = ''
  body.append(header, main)

  main.style.minHeight = `calc(100vh - ${header.offsetHeight}px)`

  loginForm.addEventListener('submit', async () => {
    const data = await login(loginForm.login.value, loginForm.password.value)
    if (data.error) {
      alert(data.error)
    } else if (!data.payload.token) {
      alert('Ошибка: в ответе сервера отсутствует токен')
    } else {
      localStorage.setItem('token', data.payload.token)
      reload()
    }
  })
}
