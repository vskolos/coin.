// Libraries
import JustValidate from 'just-validate'

// CSS
import 'normalize.css'
import '../common/common.scss'

// Blocks
import createHeader from '../blocks/header/header'
import createMain from '../blocks/main/main'
import createContainer from '../blocks/container/container'
import createLoginForm from '../blocks/login-form/login-form'

// API
import login from '../api/login'

// Utilities
import reload from '../app'
import handleError from '../utilities/handle-error'

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

  const validation = new JustValidate(loginForm, {
    errorLabelStyle: {},
    errorLabelCssClass: 'login-form__label-text--invalid',
    errorFieldCssClass: 'login-form__input--invalid',
  })

  async function sendForm() {
    try {
      const data = await login(loginForm.login.value, loginForm.password.value)
      if (data.error) {
        throw new Error(data.error)
      } else if (!data.payload.token) {
        throw new Error('No token')
      }
      localStorage.setItem('token', data.payload.token)
      reload('/accounts')
    } catch (error) {
      handleError(error)
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
