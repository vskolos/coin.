// Libraries
import { el } from 'redom'
import JustValidate from 'just-validate'

// App
import reload from '../../app'

// Blocks
import handleError from '../../utilities/handle-error'
import createPrimaryButton from '../button/--primary/button--primary'

// API
import login from '../../api/login'

// CSS
import './login-form.scss'

// Создание формы логина
export default function createLoginForm() {
  const form = el('form.login-form')
  const title = el('p.login-form__title', 'Вход в аккаунт')
  const username = el(
    'label.login-form__label',
    el('span.login-form__label-text', 'Логин'),
    el('input.login-form__input.login-form__input--login', {
      placeholder: 'Введите логин',
      type: 'text',
      name: 'login',
    })
  )
  const password = el(
    'label.login-form__label',
    el('span.login-form__label-text', 'Пароль'),
    el('input.login-form__input.login-form__input--password', {
      placeholder: 'Введите пароль',
      type: 'password',
      name: 'password',
    })
  )
  const button = createPrimaryButton({ text: 'Войти' })
  button.type = 'submit'

  form.addEventListener('submit', (e) => {
    e.preventDefault()
  })

  form.append(title, username, password, button)

  // Инициализируем JustValidate для валидации формы
  const validation = new JustValidate(form, {
    errorLabelStyle: {},
    errorLabelCssClass: 'login-form__label-text--invalid',
    errorFieldCssClass: 'login-form__input--invalid',
  })

  // Настраиваем параметры валидации
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
    .onSuccess(async () => {
      try {
        // Отправляем данные на сервер
        const data = await login(form.login.value, form.password.value)
        if (data.error) {
          throw new Error(data.error)
        } else if (!data.payload.token) {
          throw new Error('No token')
        }

        // Добавляем токен пользователя в localStorage
        localStorage.setItem('token', data.payload.token)

        // Загружаем страницу со списком счетов
        reload('/accounts')
      } catch (error) {
        handleError(error)
      }
    })

  return form
}
