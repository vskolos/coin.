// Libraries
import JustValidate from 'just-validate'

// CSS
import 'normalize.css'
import '../common/common.scss'

// Blocks
import createHeader from '../blocks/header/header'
import createLogo from '../blocks/logo/logo'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createLoginForm from '../blocks/login-form/login-form'
import createModal from '../blocks/modal/modal'

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

  const validation = new JustValidate(loginForm, {
    errorLabelStyle: {},
    errorLabelCssClass: 'login-form__label-text--invalid',
    errorFieldCssClass: 'login-form__input--invalid',
  })

  async function sendForm() {
    const data = await login(loginForm.login.value, loginForm.password.value)
    if (data.error === 'No such user') {
      const modal = createModal({
        title: 'Ошибка',
        text: 'Пользователя с таким логином не существует',
        primaryButton: {
          text: 'Закрыть',
          clickHandler: () => {
            document.querySelector('.modal').remove()
            document.body.style.removeProperty('overflow')
          },
        },
      })
      document.body.append(modal)
      document.body.style.overflow = 'hidden'
      loginForm.login.value = ''
      loginForm.password.value = ''
    } else if (data.error === 'Invalid password') {
      const modal = createModal({
        title: 'Ошибка',
        text: 'Введен неверный пароль',
        primaryButton: {
          text: 'Закрыть',
          clickHandler: () => {
            document.querySelector('.modal').remove()
            document.body.style.removeProperty('overflow')
          },
        },
      })
      document.body.append(modal)
      document.body.style.overflow = 'hidden'
      loginForm.password.value = ''
    } else if (!data.payload.token) {
      const modal = createModal({
        title: 'Ошибка',
        text: 'Что-то пошло не так. В ответе сервера отсутствует токен. Обратитесь в техническую поддержку',
        primaryButton: {
          text: 'Закрыть',
          clickHandler: () => {
            document.querySelector('.modal').remove()
            document.body.style.removeProperty('overflow')
          },
        },
      })
      document.body.append(modal)
      document.body.style.overflow = 'hidden'
    } else {
      localStorage.setItem('token', data.payload.token)
      reload()
    }
  }

  validation
    .addField('.login-form__input--login', [
      {
        rule: 'required',
        errorMessage: 'Введите логин',
      },
      {
        rule: 'customRegexp',
        value: /^\S*$/,
        errorMessage: 'Логин не должен содержать пробелы',
      },
      {
        rule: 'minLength',
        value: 6,
        errorMessage: 'Логин не должен быть короче 6 символов',
      },
    ])
    .addField('.login-form__input--password', [
      {
        rule: 'required',
        errorMessage: 'Введите пароль',
      },
      {
        rule: 'customRegexp',
        value: /^\S*$/,
        errorMessage: 'Пароль не должен содержать пробелы',
      },
      {
        rule: 'minLength',
        value: 6,
        errorMessage: 'Пароль не должен быть короче 6 символов',
      },
    ])
    .onSuccess(sendForm)
}
